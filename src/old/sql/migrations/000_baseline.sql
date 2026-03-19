--
-- PostgreSQL database dump
--

\restrict 9VQQM2PAP0opICm3hURyJPgLXOiOpxsX7TKbN7ppeS1JfZj9aOtAJ7UVGcx0GTU

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: admin_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.admin_role AS ENUM (
    'superuser',
    'admin'
);


--
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'new',
    'in_progress',
    'sent',
    'done',
    'canceled'
);


--
-- Name: order_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_type AS ENUM (
    'delivery',
    'pickup'
);


--
-- Name: payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_status AS ENUM (
    'paid',
    'not_paid'
);


--
-- Name: payment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.payment_type AS ENUM (
    'courier',
    'pickup'
);


--
-- Name: update_set_properties(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_set_properties() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  set_id INTEGER;
BEGIN
  -- Определяем, какой сет затронут
  IF (TG_OP = 'DELETE') THEN
    set_id := OLD.set_product_id;
  ELSE
    set_id := NEW.set_product_id;
  END IF;

  -- Обновляем поля в сете
  UPDATE product
  SET
    quantity = (
      SELECT COALESCE(SUM(si.quantity), 0)
      FROM set_item si
      WHERE si.set_product_id = set_id
    ),
    count_portion = (
      SELECT COALESCE(SUM(p.count_portion * si.quantity), 0)
      FROM set_item si
      JOIN product p ON p.id = si.product_id
      WHERE si.set_product_id = set_id
        AND p.is_active = true
    ),
    weight = (
      SELECT COALESCE(SUM(p.weight * si.quantity), 0)
      FROM set_item si
      JOIN product p ON p.id = si.product_id
      WHERE si.set_product_id = set_id
        AND p.is_active = true
    )
  WHERE id = set_id;

  RETURN NULL;
END;
$$;


--
-- Name: update_set_roll_count(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_set_roll_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE product
  SET roll_count = (
    SELECT COALESCE(SUM(si.roll_count * si.quantity), 0)
    FROM set_item si
    WHERE si.set_product_id = NEW.set_product_id
  )
  WHERE id = NEW.set_product_id;

  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addon (
    id integer NOT NULL,
    addon_rule_id integer NOT NULL,
    product_id integer NOT NULL
);


--
-- Name: addon_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addon_group (
    id integer NOT NULL,
    title text NOT NULL
);


--
-- Name: addon_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.addon_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: addon_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.addon_group_id_seq OWNED BY public.addon_group.id;


--
-- Name: addon_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.addon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: addon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.addon_id_seq OWNED BY public.addon.id;


--
-- Name: addon_rule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addon_rule (
    id integer NOT NULL,
    title text NOT NULL,
    base_count smallint DEFAULT 1 NOT NULL,
    divisor smallint DEFAULT 1 NOT NULL,
    show_count_percent smallint DEFAULT 50 NOT NULL,
    is_active boolean DEFAULT false,
    addon_group_id integer
);


--
-- Name: addon_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.addon_rule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: addon_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.addon_rule_id_seq OWNED BY public.addon_rule.id;


--
-- Name: addon_rule_to_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addon_rule_to_category (
    addon_rule_id integer NOT NULL,
    category_id integer NOT NULL
);


--
-- Name: addon_rule_to_product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addon_rule_to_product (
    addon_rule_id integer NOT NULL,
    product_id integer NOT NULL
);


--
-- Name: addon_rule_with_addons_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.addon_rule_with_addons_view AS
SELECT
    NULL::integer AS addon_rule_id,
    NULL::text AS title,
    NULL::smallint AS base_count,
    NULL::smallint AS divisor,
    NULL::smallint AS show_count_percent,
    NULL::integer AS addon_group_id,
    NULL::json AS addon_products;


--
-- Name: addon_rules_to_categories_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.addon_rules_to_categories_view AS
 SELECT arc.category_id,
    arc.addon_rule_id
   FROM (public.addon_rule_to_category arc
     JOIN public.addon_rule adr ON ((adr.id = arc.addon_rule_id)))
  WHERE (adr.is_active = true);


--
-- Name: addon_rules_to_products_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.addon_rules_to_products_view AS
 SELECT arp.product_id,
    arp.addon_rule_id
   FROM (public.addon_rule_to_product arp
     JOIN public.addon_rule adr ON ((adr.id = arp.addon_rule_id)))
  WHERE (adr.is_active = true);


--
-- Name: admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    login text NOT NULL,
    password_hash text NOT NULL,
    role public.admin_role DEFAULT 'admin'::public.admin_role NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- Name: admin_refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone NOT NULL,
    is_revoked boolean DEFAULT false
);


--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    nickname text NOT NULL,
    password_hash text NOT NULL,
    role public.admin_role DEFAULT 'admin'::public.admin_role NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category (
    id integer NOT NULL,
    title character varying(50) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    slug character varying(50) NOT NULL,
    image_link text,
    sort_number smallint DEFAULT 0
);


--
-- Name: category_discount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_discount (
    category_id integer NOT NULL,
    discount_id integer NOT NULL
);


--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: discount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discount (
    id integer NOT NULL,
    title text NOT NULL,
    percent smallint NOT NULL,
    is_active boolean DEFAULT false NOT NULL
);


--
-- Name: discount_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discount_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discount_id_seq OWNED BY public.discount.id;


--
-- Name: ingredient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ingredient (
    id integer NOT NULL,
    title character varying(50) NOT NULL
);


--
-- Name: ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ingredient_id_seq OWNED BY public.ingredient.id;


--
-- Name: order_daily_counter; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_daily_counter (
    order_date date NOT NULL,
    counter integer DEFAULT 0 NOT NULL
);


--
-- Name: order_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_item (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity_total integer NOT NULL,
    quantity_free integer DEFAULT 0 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    CONSTRAINT order_item_check CHECK (((quantity_free >= 0) AND (quantity_free <= quantity_total))),
    CONSTRAINT order_item_quantity_total_check CHECK ((quantity_total > 0))
);


--
-- Name: order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_item_id_seq OWNED BY public.order_item.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_number character varying(20) NOT NULL,
    customer_name character varying(50),
    customer_phone character varying(20) NOT NULL,
    user_id integer,
    address_city text,
    address_street text,
    address_house text,
    address_apartment text,
    address_floor text,
    address_entrance text,
    address_intercom text,
    total_price numeric(8,2) NOT NULL,
    payment_status public.payment_status DEFAULT 'not_paid'::public.payment_status NOT NULL,
    order_type public.order_type DEFAULT 'delivery'::public.order_type NOT NULL,
    payment_type public.payment_type DEFAULT 'courier'::public.payment_type NOT NULL,
    status public.order_status DEFAULT 'new'::public.order_status NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product (
    id integer NOT NULL,
    title character varying(50) NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_visible boolean DEFAULT false NOT NULL,
    slug character varying(50) NOT NULL,
    image_link text DEFAULT 'no_image.png'::text,
    price numeric(8,2) DEFAULT 0,
    weight smallint DEFAULT 0,
    count_portion smallint DEFAULT 0,
    quantity smallint DEFAULT 1,
    is_set boolean DEFAULT false NOT NULL
);


--
-- Name: product_card_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.product_card_view AS
SELECT
    NULL::integer AS id,
    NULL::character varying(50) AS title,
    NULL::character varying(50) AS slug,
    NULL::text AS image_link,
    NULL::double precision AS price,
    NULL::smallint AS weight,
    NULL::smallint AS count_portion,
    NULL::smallint AS quantity,
    NULL::boolean AS is_set,
    NULL::boolean AS is_visible,
    NULL::boolean AS is_active,
    NULL::character varying[] AS ingredients,
    NULL::integer[] AS category_ids,
    NULL::integer AS discount_percent,
    NULL::json[] AS addons,
    NULL::json[] AS set_items;


--
-- Name: product_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_category (
    product_id integer NOT NULL,
    category_id integer NOT NULL
);


--
-- Name: product_categories_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.product_categories_view AS
 SELECT pc.product_id,
    array_agg(c.id ORDER BY c.id) AS category_ids
   FROM ((public.product_category pc
     JOIN public.product p ON ((p.id = pc.product_id)))
     JOIN public.category c ON ((c.id = pc.category_id)))
  WHERE ((p.is_active = true) AND (p.is_visible = true) AND (c.is_active = true))
  GROUP BY pc.product_id;


--
-- Name: product_discount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_discount (
    product_id integer NOT NULL,
    discount_id integer NOT NULL
);


--
-- Name: product_discount_percent_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.product_discount_percent_view AS
 SELECT p.id AS product_id,
    d.percent AS discount_percent
   FROM ((((public.product p
     LEFT JOIN public.product_discount pd ON ((pd.product_id = p.id)))
     LEFT JOIN public.product_category pc ON ((pc.product_id = p.id)))
     LEFT JOIN public.category_discount cd ON ((cd.category_id = pc.category_id)))
     LEFT JOIN public.discount d ON ((d.id = COALESCE(pd.discount_id, cd.discount_id))))
  WHERE ((p.is_active = true) AND (p.is_visible = true) AND ((pd.discount_id IS NOT NULL) OR (cd.discount_id IS NOT NULL)) AND (d.is_active = true))
  GROUP BY p.id, d.percent;


--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: product_ingredient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_ingredient (
    product_id integer NOT NULL,
    ingredient_id integer NOT NULL
);


--
-- Name: product_ingredients_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.product_ingredients_view AS
 SELECT pi.product_id,
    array_agg(i.title ORDER BY i.title) AS ingredients
   FROM ((public.product_ingredient pi
     JOIN public.ingredient i ON ((i.id = pi.ingredient_id)))
     JOIN public.product p ON ((p.id = pi.product_id)))
  WHERE ((p.is_active = true) AND (p.is_visible = true))
  GROUP BY pi.product_id;


--
-- Name: set_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.set_item (
    id integer NOT NULL,
    set_product_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity smallint DEFAULT 1,
    quantity_all smallint DEFAULT 0
);


--
-- Name: set_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.set_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: set_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.set_item_id_seq OWNED BY public.set_item.id;


--
-- Name: set_items_with_ingredients_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.set_items_with_ingredients_view AS
 SELECT si.set_product_id AS set_id,
    p.id,
    p.title,
    p.is_active,
    p.is_visible,
    p.is_set,
    p.slug,
    p.image_link,
    (p.price)::double precision AS price,
    p.weight,
    p.count_portion,
    p.quantity,
    array_agg(DISTINCT i.title ORDER BY i.title) AS ingredients
   FROM (((public.set_item si
     JOIN public.product p ON ((p.id = si.product_id)))
     LEFT JOIN public.product_ingredient pi ON ((pi.product_id = p.id)))
     LEFT JOIN public.ingredient i ON ((i.id = pi.ingredient_id)))
  WHERE (p.is_active = true)
  GROUP BY si.set_product_id, p.id, p.title, p.is_active, p.is_visible, p.is_set, p.slug, p.image_link, p.price, p.weight, p.count_portion, p.quantity;


--
-- Name: sms_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sms_codes (
    id integer NOT NULL,
    phone character varying(20) NOT NULL,
    code character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: sms_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sms_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sms_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sms_codes_id_seq OWNED BY public.sms_codes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: addon id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon ALTER COLUMN id SET DEFAULT nextval('public.addon_id_seq'::regclass);


--
-- Name: addon_group id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_group ALTER COLUMN id SET DEFAULT nextval('public.addon_group_id_seq'::regclass);


--
-- Name: addon_rule id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule ALTER COLUMN id SET DEFAULT nextval('public.addon_rule_id_seq'::regclass);


--
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: discount id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount ALTER COLUMN id SET DEFAULT nextval('public.discount_id_seq'::regclass);


--
-- Name: ingredient id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingredient ALTER COLUMN id SET DEFAULT nextval('public.ingredient_id_seq'::regclass);


--
-- Name: order_item id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item ALTER COLUMN id SET DEFAULT nextval('public.order_item_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: set_item id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.set_item ALTER COLUMN id SET DEFAULT nextval('public.set_item_id_seq'::regclass);


--
-- Name: sms_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms_codes ALTER COLUMN id SET DEFAULT nextval('public.sms_codes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: addon_group addon_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_group
    ADD CONSTRAINT addon_group_pkey PRIMARY KEY (id);


--
-- Name: addon addon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon
    ADD CONSTRAINT addon_pkey PRIMARY KEY (id);


--
-- Name: addon_rule addon_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule
    ADD CONSTRAINT addon_rule_pkey PRIMARY KEY (id);


--
-- Name: addon_rule_to_category addon_to_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule_to_category
    ADD CONSTRAINT addon_to_category_pkey PRIMARY KEY (addon_rule_id, category_id);


--
-- Name: addon_rule_to_product addon_to_product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule_to_product
    ADD CONSTRAINT addon_to_product_pkey PRIMARY KEY (addon_rule_id, product_id);


--
-- Name: admin admin_login_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_login_key UNIQUE (login);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- Name: admin_refresh_tokens admin_refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_refresh_tokens
    ADD CONSTRAINT admin_refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: admins admins_nickname_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_nickname_key UNIQUE (nickname);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: category_discount category_discount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_discount
    ADD CONSTRAINT category_discount_pkey PRIMARY KEY (category_id, discount_id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);


--
-- Name: category category_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_slug_key UNIQUE (slug);


--
-- Name: category category_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_title_key UNIQUE (title);


--
-- Name: discount discount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (id);


--
-- Name: ingredient ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_pkey PRIMARY KEY (id);


--
-- Name: ingredient ingredient_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_title_key UNIQUE (title);


--
-- Name: ingredient ingredient_title_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_title_unique UNIQUE (title);


--
-- Name: order_daily_counter order_daily_counter_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_daily_counter
    ADD CONSTRAINT order_daily_counter_pkey PRIMARY KEY (order_date);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (product_id, category_id);


--
-- Name: product_discount product_discount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_discount
    ADD CONSTRAINT product_discount_pkey PRIMARY KEY (product_id, discount_id);


--
-- Name: product_ingredient product_ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_ingredient
    ADD CONSTRAINT product_ingredient_pkey PRIMARY KEY (product_id, ingredient_id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product product_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_slug_key UNIQUE (slug);


--
-- Name: product product_title_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_title_key UNIQUE (title);


--
-- Name: set_item set_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.set_item
    ADD CONSTRAINT set_item_pkey PRIMARY KEY (id);


--
-- Name: sms_codes sms_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sms_codes
    ADD CONSTRAINT sms_codes_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_addon_addon_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_addon_addon_rule_id ON public.addon USING btree (addon_rule_id);


--
-- Name: idx_addon_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_addon_product_id ON public.addon USING btree (product_id);


--
-- Name: idx_addon_rule_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_addon_rule_is_active ON public.addon_rule USING btree (is_active);


--
-- Name: idx_addon_rule_to_category_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_addon_rule_to_category_category_id ON public.addon_rule_to_category USING btree (category_id);


--
-- Name: idx_addon_rule_to_category_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_addon_rule_to_category_rule_id ON public.addon_rule_to_category USING btree (addon_rule_id);


--
-- Name: idx_addon_rule_to_product_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_addon_rule_to_product_product_id ON public.addon_rule_to_product USING btree (product_id);


--
-- Name: idx_addon_rule_to_product_rule_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_addon_rule_to_product_rule_id ON public.addon_rule_to_product USING btree (addon_rule_id);


--
-- Name: idx_product_category_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_category_category_id ON public.product_category USING btree (category_id);


--
-- Name: idx_product_category_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_category_product_id ON public.product_category USING btree (product_id);


--
-- Name: idx_product_ingredient_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_ingredient_product_id ON public.product_ingredient USING btree (product_id);


--
-- Name: idx_product_is_active_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_is_active_visible ON public.product USING btree (is_active, is_visible);


--
-- Name: idx_set_item_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_set_item_product_id ON public.set_item USING btree (product_id);


--
-- Name: idx_set_item_set_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_set_item_set_product_id ON public.set_item USING btree (set_product_id);


--
-- Name: addon_rule_with_addons_view _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.addon_rule_with_addons_view AS
 SELECT adr.id AS addon_rule_id,
    adr.title,
    adr.base_count,
    adr.divisor,
    adr.show_count_percent,
    adr.addon_group_id,
    json_agg(json_build_object('addon_rule_id', adr.id, 'id', p.id, 'title', p.title, 'is_active', p.is_active, 'is_visible', p.is_visible, 'is_set', p.is_set, 'slug', p.slug, 'image_link', p.image_link, 'price', (p.price)::double precision, 'weight', p.weight, 'count_portion', p.count_portion, 'quantity', p.quantity, 'ingredients', COALESCE(pi.ingredients, (ARRAY[]::text[])::character varying[]), 'category_ids', COALESCE(pc.category_ids, ARRAY[]::integer[]), 'discount_percent', COALESCE((pd.discount_percent)::integer, 0), 'addons', '[]'::json, 'set_items', '[]'::json) ORDER BY p.id) FILTER (WHERE (p.id IS NOT NULL)) AS addon_products
   FROM (((((public.addon_rule adr
     JOIN public.addon a ON ((a.addon_rule_id = adr.id)))
     JOIN public.product p ON ((p.id = a.product_id)))
     LEFT JOIN public.product_ingredients_view pi ON ((pi.product_id = p.id)))
     LEFT JOIN public.product_categories_view pc ON ((pc.product_id = p.id)))
     LEFT JOIN public.product_discount_percent_view pd ON ((pd.product_id = p.id)))
  WHERE ((adr.is_active = true) AND (p.is_active = true))
  GROUP BY adr.id;


--
-- Name: product_card_view _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.product_card_view AS
 SELECT p.id,
    p.title,
    p.slug,
    p.image_link,
    (p.price)::double precision AS price,
    p.weight,
    p.count_portion,
    p.quantity,
    p.is_set,
    p.is_visible,
    p.is_active,
    COALESCE(pi.ingredients, (ARRAY[]::text[])::character varying[]) AS ingredients,
    COALESCE(pc.category_ids, ARRAY[]::integer[]) AS category_ids,
    COALESCE((pd.discount_percent)::integer, 0) AS discount_percent,
    COALESCE(array_agg(json_build_object('addon_rule_id', adr.addon_rule_id, 'base_count', adr.base_count, 'divisor', adr.divisor, 'show_count_percent', adr.show_count_percent, 'addon_products', adr.addon_products)) FILTER (WHERE (adr.addon_rule_id IS NOT NULL)), ARRAY[]::json[]) AS addons,
    COALESCE(array_agg(json_build_object('id', si.id, 'title', si.title, 'is_active', si.is_active, 'is_visible', si.is_visible, 'is_set', si.is_set, 'slug', si.slug, 'image_link', si.image_link, 'price', si.price, 'weight', si.weight, 'count_portion', si.count_portion, 'quantity', si.quantity, 'ingredients', si.ingredients)) FILTER (WHERE (si.id IS NOT NULL)), ARRAY[]::json[]) AS set_items
   FROM (((((public.product p
     LEFT JOIN public.product_ingredients_view pi ON ((pi.product_id = p.id)))
     LEFT JOIN public.product_categories_view pc ON ((pc.product_id = p.id)))
     LEFT JOIN public.product_discount_percent_view pd ON ((pd.product_id = p.id)))
     LEFT JOIN ( SELECT atp.product_id,
            ara.addon_rule_id,
            ara.title,
            ara.base_count,
            ara.divisor,
            ara.show_count_percent,
            ara.addon_group_id,
            ara.addon_products
           FROM (public.addon_rules_to_products_view atp
             JOIN public.addon_rule_with_addons_view ara ON ((ara.addon_rule_id = atp.addon_rule_id)))
        UNION ALL
         SELECT pcp.product_id,
            ara.addon_rule_id,
            ara.title,
            ara.base_count,
            ara.divisor,
            ara.show_count_percent,
            ara.addon_group_id,
            ara.addon_products
           FROM ((public.product_category pcp
             JOIN public.addon_rules_to_categories_view atc ON ((atc.category_id = pcp.category_id)))
             JOIN public.addon_rule_with_addons_view ara ON ((ara.addon_rule_id = atc.addon_rule_id)))) adr ON ((adr.product_id = p.id)))
     LEFT JOIN public.set_items_with_ingredients_view si ON ((si.set_id = p.id)))
  WHERE ((p.is_active = true) AND (p.is_visible = true))
  GROUP BY p.id, p.title, p.slug, p.image_link, p.price, p.weight, p.count_portion, p.quantity, p.is_set, pi.ingredients, pc.category_ids, pd.discount_percent;


--
-- Name: set_item trg_update_set_properties; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_update_set_properties AFTER INSERT OR DELETE OR UPDATE ON public.set_item FOR EACH ROW EXECUTE FUNCTION public.update_set_properties();


--
-- Name: addon addon_addon_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon
    ADD CONSTRAINT addon_addon_rule_id_fkey FOREIGN KEY (addon_rule_id) REFERENCES public.addon_rule(id) ON DELETE CASCADE;


--
-- Name: addon addon_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon
    ADD CONSTRAINT addon_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: addon_rule addon_rule_addon_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule
    ADD CONSTRAINT addon_rule_addon_group_id_fkey FOREIGN KEY (addon_group_id) REFERENCES public.addon_group(id) ON DELETE SET NULL;


--
-- Name: addon_rule_to_category addon_rule_to_category_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule_to_category
    ADD CONSTRAINT addon_rule_to_category_rule_id_fkey FOREIGN KEY (addon_rule_id) REFERENCES public.addon_rule(id) ON DELETE CASCADE;


--
-- Name: addon_rule_to_product addon_rule_to_product_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule_to_product
    ADD CONSTRAINT addon_rule_to_product_rule_id_fkey FOREIGN KEY (addon_rule_id) REFERENCES public.addon_rule(id) ON DELETE CASCADE;


--
-- Name: addon_rule_to_category addon_to_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule_to_category
    ADD CONSTRAINT addon_to_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: addon_rule_to_product addon_to_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addon_rule_to_product
    ADD CONSTRAINT addon_to_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: admin_refresh_tokens admin_refresh_tokens_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_refresh_tokens
    ADD CONSTRAINT admin_refresh_tokens_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.admins(id) ON DELETE CASCADE;


--
-- Name: category_discount category_discount_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_discount
    ADD CONSTRAINT category_discount_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: category_discount category_discount_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_discount
    ADD CONSTRAINT category_discount_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discount(id) ON DELETE CASCADE;


--
-- Name: order_item order_item_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_item order_item_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_category product_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: product_category product_category_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: product_discount product_discount_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_discount
    ADD CONSTRAINT product_discount_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discount(id) ON DELETE CASCADE;


--
-- Name: product_discount product_discount_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_discount
    ADD CONSTRAINT product_discount_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: product_ingredient product_ingredient_ingredient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_ingredient
    ADD CONSTRAINT product_ingredient_ingredient_id_fkey FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(id) ON DELETE CASCADE;


--
-- Name: product_ingredient product_ingredient_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_ingredient
    ADD CONSTRAINT product_ingredient_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: set_item set_item_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.set_item
    ADD CONSTRAINT set_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: set_item set_item_set_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.set_item
    ADD CONSTRAINT set_item_set_product_id_fkey FOREIGN KEY (set_product_id) REFERENCES public.product(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 9VQQM2PAP0opICm3hURyJPgLXOiOpxsX7TKbN7ppeS1JfZj9aOtAJ7UVGcx0GTU

