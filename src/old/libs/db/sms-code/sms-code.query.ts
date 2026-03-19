'use server';
import { pool } from '@/libs/db/db';
import { ActionResult, actionResult, ErrorCode, errorResult } from '@/utils';
import { SmsCode, smsCodeSchema } from '@/types/db/tables/sms-code';

export const insertSmsCode = async (phone: string, code: string): Promise<ActionResult<SmsCode>> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE
       FROM sms_codes
       WHERE phone = $1`,
      [phone],
    );

    const response = await client.query(
      `INSERT INTO sms_codes (phone, code)
       VALUES ($1, $2)
       RETURNING *`,
      [phone, code],
    );

    await client.query('COMMIT');

    const result = smsCodeSchema.safeParse(response.rows[0]);

    if (!result.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<SmsCode>(result.data);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ DB insert error in insertSmsCode:', error);
    return errorResult(ErrorCode.DB_ERROR);
  } finally {
    client.release();
  }
};

export const verifySmsCode = async (phone: string): Promise<ActionResult<SmsCode | null>> => {
  try {
    const response = await pool.query(
      `SELECT *
       FROM sms_codes
       WHERE phone = $1`,
      [phone],
    );

    if (response.rowCount === 0) return actionResult(null);

    const result = smsCodeSchema.safeParse(response.rows[0]);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<SmsCode>(result.data);
  } catch (error) {
    console.error('❌ DB insert error in insertSmsCode:', error);
    return errorResult(ErrorCode.DB_ERROR);
  }
};
