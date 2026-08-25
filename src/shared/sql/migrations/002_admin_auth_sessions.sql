BEGIN;

UPDATE admin
SET is_active = true
WHERE is_active IS NULL;

UPDATE admin
SET created_at = now()
WHERE created_at IS NULL;

ALTER TABLE admin
  ALTER COLUMN is_active SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at TYPE timestamptz
    USING created_at AT TIME ZONE current_setting('TimeZone');

ALTER TABLE admin_refresh_tokens RENAME TO admin_session;

ALTER TABLE admin_session
  RENAME CONSTRAINT admin_refresh_tokens_pkey TO admin_session_pkey;

ALTER TABLE admin_session
  RENAME CONSTRAINT admin_refresh_tokens_admin_id_fkey TO admin_session_admin_id_fkey;

UPDATE admin_session
SET created_at = now()
WHERE created_at IS NULL;

ALTER TABLE admin_session
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at TYPE timestamptz
    USING created_at AT TIME ZONE current_setting('TimeZone'),
  ALTER COLUMN expires_at TYPE timestamptz
    USING expires_at AT TIME ZONE current_setting('TimeZone'),
  ADD COLUMN refresh_token_hash text,
  ADD COLUMN last_used_at timestamptz,
  ADD COLUMN revoked_at timestamptz,
  ADD COLUMN revoke_reason text,
  ADD COLUMN ip_address inet,
  ADD COLUMN user_agent text;

UPDATE admin_session
SET refresh_token_hash = encode(digest(id::text, 'sha256'), 'hex'),
    revoked_at = CASE WHEN is_revoked THEN created_at ELSE NULL END,
    revoke_reason = CASE WHEN is_revoked THEN 'legacy_revoked' ELSE NULL END;

ALTER TABLE admin_session
  DROP COLUMN is_revoked,
  ADD COLUMN is_revoked boolean
    GENERATED ALWAYS AS (revoked_at IS NOT NULL) STORED,
  ALTER COLUMN refresh_token_hash SET NOT NULL,
  ADD CONSTRAINT admin_session_refresh_token_hash_key UNIQUE (refresh_token_hash),
  ADD CONSTRAINT admin_session_refresh_token_hash_format_check
    CHECK (refresh_token_hash ~ '^[0-9a-f]{64}$');

CREATE INDEX idx_admin_session_admin_active
  ON admin_session (admin_id)
  WHERE revoked_at IS NULL;

CREATE INDEX idx_admin_session_expires_at
  ON admin_session (expires_at);

CREATE TABLE admin_auth_event (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_id integer,
  session_id uuid,
  event_type text NOT NULL,
  attempted_login text,
  created_at timestamptz DEFAULT now() NOT NULL,
  ip_address inet,
  user_agent text,
  request_id text,
  metadata jsonb DEFAULT '{}'::jsonb NOT NULL,

  CONSTRAINT admin_auth_event_admin_id_fkey
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE SET NULL,
  CONSTRAINT admin_auth_event_session_id_fkey
    FOREIGN KEY (session_id) REFERENCES admin_session(id) ON DELETE SET NULL,
  CONSTRAINT admin_auth_event_type_check CHECK (
    event_type IN (
      'login_success',
      'login_failed',
      'logout',
      'logout_all',
      'session_refreshed',
      'session_expired',
      'session_revoked',
      'refresh_failed',
      'refresh_reuse_detected',
      'access_denied',
      'account_disabled',
      'password_changed'
    )
  )
);

CREATE INDEX idx_admin_auth_event_created_at
  ON admin_auth_event (created_at);

CREATE INDEX idx_admin_auth_event_admin_created_at
  ON admin_auth_event (admin_id, created_at);

CREATE INDEX idx_admin_auth_event_session_id
  ON admin_auth_event (session_id);

COMMIT;
