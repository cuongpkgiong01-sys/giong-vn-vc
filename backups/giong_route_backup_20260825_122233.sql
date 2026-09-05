--
-- PostgreSQL database dump
--

\restrict Xu6bRDBn0NFPZcjLx5dBx3UTewGEy3KMg3fQZ38sM6bIdJRj29odJOFWG7GL8fX

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._migrations (
    name text NOT NULL,
    applied_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public._migrations OWNER TO postgres;

--
-- Name: app_employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_employees (
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.app_employees OWNER TO postgres;

--
-- Name: app_receipts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_receipts (
    id text NOT NULL,
    receipt_number text NOT NULL,
    receipt_date date NOT NULL,
    employee_name text NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.app_receipts OWNER TO postgres;

--
-- Data for Name: _migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._migrations (name, applied_at) FROM stdin;
001_app_data.sql	2026-08-24 12:28:11.156205+07
\.


--
-- Data for Name: app_employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_employees (name, created_at) FROM stdin;
Phạm Kiên Cường	2026-08-25 11:33:44.648651+07
\.


--
-- Data for Name: app_receipts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_receipts (id, receipt_number, receipt_date, employee_name, data, created_at, updated_at) FROM stdin;
mt71g239-gfjg20	1_24_08_2026	2026-08-24	Lê Minh Cường	{"id": "mt71g239-gfjg20", "date": "2026-08-24", "legs": [{"km": 12.2, "toId": "tu-son", "fromId": "van-phong", "reversed": false, "estimated": false}, {"km": 5.6, "toId": "tien-du", "fromId": "tu-son", "reversed": false, "estimated": false}, {"km": 12, "toId": "huong-mac", "fromId": "tien-du", "reversed": false, "estimated": false}], "path": ["van-phong", "tu-son", "tien-du", "huong-mac"], "notes": "", "number": "1_24_08_2026", "status": "confirmed", "baseFee": 10000, "totalKm": 29.8, "evidence": [], "kmAmount": 119200, "perKmFee": 4000, "subtotal": 129200, "createdAt": "2026-08-24T09:33:09.909Z", "vehicleId": "xe-may", "hasEstimate": false, "totalAmount": 129200, "employeeName": "Lê Minh Cường", "surchargeRate": 0, "nightSurcharge": false, "noAllowanceOnly": false, "surchargeAmount": 0, "holidaySurcharge": false}	2026-08-24 16:33:10.039134+07	2026-08-24 16:33:10.039134+07
mt71jacp-zvrupb	2_24_08_2026	2026-08-24	Nguyễn Văn An	{"id": "mt71jacp-zvrupb", "date": "2026-08-24", "legs": [{"km": 22.9, "toId": "tien-phong", "fromId": "van-phong", "reversed": false, "estimated": false}, {"km": 11.5, "toId": "thach-da", "fromId": "tien-phong", "reversed": false, "estimated": false}, {"km": 12.7, "toId": "chi-dong", "fromId": "thach-da", "reversed": false, "estimated": false}], "path": ["van-phong", "tien-phong", "thach-da", "chi-dong"], "notes": "", "number": "2_24_08_2026", "status": "confirmed", "baseFee": 20000, "totalKm": 47.1, "evidence": [], "kmAmount": 376800, "perKmFee": 8000, "subtotal": 396800, "createdAt": "2026-08-24T09:35:40.585Z", "vehicleId": "o-to", "hasEstimate": false, "totalAmount": 456320, "employeeName": "Nguyễn Văn An", "surchargeRate": 0.15, "nightSurcharge": true, "noAllowanceOnly": false, "surchargeAmount": 59520, "holidaySurcharge": false}	2026-08-24 16:35:41.038103+07	2026-08-24 16:35:41.038103+07
mt71z8u4-g25u0p	3_24_08_2026	2026-08-24	Lê Minh Cường	{"id": "mt71z8u4-g25u0p", "date": "2026-08-24", "legs": [{"km": 32.8, "toId": "thach-da", "fromId": "van-phong", "reversed": false, "estimated": false}, {"km": 17.1, "toId": "dong-xuan", "fromId": "thach-da", "reversed": false, "estimated": false}, {"km": 23.7, "toId": "tam-an", "fromId": "dong-xuan", "reversed": false, "estimated": false}], "path": ["van-phong", "thach-da", "dong-xuan", "tam-an"], "notes": "", "number": "3_24_08_2026", "status": "confirmed", "baseFee": 10000, "totalKm": 73.6, "evidence": [], "kmAmount": 294400, "perKmFee": 4000, "subtotal": 304400, "createdAt": "2026-08-24T09:48:05.116Z", "vehicleId": "xe-may", "hasEstimate": false, "totalAmount": 304400, "employeeName": "Lê Minh Cường", "surchargeRate": 0, "nightSurcharge": false, "noAllowanceOnly": false, "surchargeAmount": 0, "holidaySurcharge": false}	2026-08-24 16:48:05.566913+07	2026-08-24 16:48:05.566913+07
mt722jo5-gmm44k	4_24_08_2026	2026-08-24	Lê Minh Cường	{"id": "mt722jo5-gmm44k", "date": "2026-08-24", "legs": [{"km": 30.9, "toId": "me-linh", "fromId": "van-phong", "reversed": false, "estimated": false}, {"km": 48, "toId": "bich-hoa", "fromId": "me-linh", "reversed": false, "estimated": true}, {"km": 47.6, "toId": "huong-mac", "fromId": "bich-hoa", "reversed": false, "estimated": true}], "path": ["van-phong", "me-linh", "bich-hoa", "huong-mac"], "notes": "", "number": "4_24_08_2026", "status": "confirmed", "baseFee": 10000, "totalKm": 126.5, "evidence": [], "kmAmount": 506000, "perKmFee": 4000, "subtotal": 516000, "createdAt": "2026-08-24T09:50:39.125Z", "vehicleId": "xe-may", "hasEstimate": true, "totalAmount": 516000, "employeeName": "Lê Minh Cường", "surchargeRate": 0, "nightSurcharge": false, "noAllowanceOnly": false, "surchargeAmount": 0, "holidaySurcharge": false}	2026-08-24 16:50:39.598207+07	2026-08-24 16:50:39.598207+07
mt724a3h-rqo2la	5_24_08_2026	2026-08-24	Trần Thị Bình	{"id": "mt724a3h-rqo2la", "date": "2026-08-24", "legs": [{"km": 21.4, "toId": "tien-du", "fromId": "van-phong", "reversed": false, "estimated": false}, {"km": 50.5, "toId": "thanh-oai", "fromId": "tien-du", "reversed": false, "estimated": true}, {"km": 55.3, "toId": "lien-mac", "fromId": "thanh-oai", "reversed": false, "estimated": true}, {"km": 48.5, "toId": "bich-hoa", "fromId": "lien-mac", "reversed": false, "estimated": true}, {"km": 8, "toId": "thanh-thuy", "fromId": "bich-hoa", "reversed": false, "estimated": false}], "path": ["van-phong", "tien-du", "thanh-oai", "lien-mac", "bich-hoa", "thanh-thuy"], "notes": "", "number": "5_24_08_2026", "status": "confirmed", "baseFee": 10000, "totalKm": 183.7, "evidence": [], "kmAmount": 734800, "perKmFee": 4000, "subtotal": 744800, "createdAt": "2026-08-24T09:52:00.029Z", "vehicleId": "xe-may", "hasEstimate": true, "totalAmount": 1005480, "employeeName": "Trần Thị Bình", "surchargeRate": 0.35, "nightSurcharge": true, "noAllowanceOnly": false, "surchargeAmount": 260680, "holidaySurcharge": true}	2026-08-24 16:52:00.24247+07	2026-08-24 16:52:00.24247+07
mt85n911-dhavlh	202608001	2026-08-25	Lê Minh Cường	{"id": "mt85n911-dhavlh", "date": "2026-08-25", "legs": [{"km": 38.5, "to": "thanh-thuy", "from": "van-phong", "toId": "thanh-thuy", "fromId": "van-phong", "estimated": false}, {"km": 8, "to": "bich-hoa", "from": "thanh-thuy", "toId": "bich-hoa", "fromId": "thanh-thuy", "estimated": false}, {"km": 5.2, "to": "thanh-oai", "from": "bich-hoa", "toId": "thanh-oai", "fromId": "bich-hoa", "estimated": false}], "path": ["van-phong", "thanh-thuy", "bich-hoa", "thanh-oai"], "notes": "", "number": "202608001", "status": "confirmed", "baseFee": 10000, "totalKm": 51.7, "evidence": [], "kmAmount": 258500, "perKmFee": 5000, "subtotal": 268500, "createdAt": "2026-08-25T04:18:30.133Z", "vehicleId": "xe-may", "hasEstimate": false, "totalAmount": 362475, "employeeName": "Lê Minh Cường", "surchargeRate": 0.35, "nightSurcharge": true, "noAllowanceOnly": false, "surchargeAmount": 93975, "holidaySurcharge": true}	2026-08-25 11:18:30.259345+07	2026-08-25 11:18:30.259345+07
mt85z6ro-d1nmk6	002_25_08_2026	2026-08-25	Nguyễn Văn An	{"id": "mt85z6ro-d1nmk6", "date": "2026-08-25", "legs": [{"km": 28.1, "to": "chi-dong", "from": "van-phong", "toId": "chi-dong", "fromId": "van-phong", "estimated": false}, {"km": 16.5, "to": "lien-mac", "from": "chi-dong", "toId": "lien-mac", "fromId": "chi-dong", "estimated": false}, {"km": 5.3, "to": "thach-da", "from": "lien-mac", "toId": "thach-da", "fromId": "lien-mac", "estimated": false}, {"km": 45, "to": "bich-hoa", "from": "thach-da", "toId": "bich-hoa", "fromId": "thach-da", "estimated": true}], "path": ["van-phong", "chi-dong", "lien-mac", "thach-da", "bich-hoa"], "notes": "", "number": "002_25_08_2026", "status": "confirmed", "baseFee": 10000, "totalKm": 94.9, "evidence": [], "kmAmount": 474500, "perKmFee": 5000, "subtotal": 484500, "createdAt": "2026-08-25T04:27:47.076Z", "vehicleId": "xe-may", "hasEstimate": true, "totalAmount": 484500, "employeeName": "Nguyễn Văn An", "surchargeRate": 0, "nightSurcharge": false, "noAllowanceOnly": false, "surchargeAmount": 0, "holidaySurcharge": false}	2026-08-25 11:27:47.21793+07	2026-08-25 11:27:47.21793+07
mt86bo0p-jbs07n	003_25_08_2026	2026-08-25	Lê Minh Cường	{"id": "mt86bo0p-jbs07n", "date": "2026-08-25", "legs": [{"km": 28.5, "to": "bich-hoa", "from": "van-phong", "toId": "bich-hoa", "fromId": "van-phong", "estimated": false}, {"km": 45.4, "to": "tien-du", "from": "bich-hoa", "toId": "tien-du", "fromId": "bich-hoa", "estimated": true}, {"km": 12, "to": "huong-mac", "from": "tien-du", "toId": "huong-mac", "fromId": "tien-du", "estimated": false}, {"km": 20.3, "to": "sai-dong", "from": "huong-mac", "toId": "sai-dong", "fromId": "huong-mac", "estimated": true}], "path": ["van-phong", "bich-hoa", "tien-du", "huong-mac", "sai-dong"], "notes": "", "number": "003_25_08_2026", "status": "confirmed", "baseFee": 10000, "totalKm": 106.2, "evidence": [], "kmAmount": 531000, "perKmFee": 5000, "subtotal": 541000, "createdAt": "2026-08-25T04:37:29.305Z", "vehicleId": "xe-may", "hasEstimate": true, "totalAmount": 541000, "employeeName": "Lê Minh Cường", "surchargeRate": 0, "nightSurcharge": false, "noAllowanceOnly": false, "surchargeAmount": 0, "holidaySurcharge": false}	2026-08-25 11:37:29.39881+07	2026-08-25 11:37:29.39881+07
\.


--
-- Name: _migrations _migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._migrations
    ADD CONSTRAINT _migrations_pkey PRIMARY KEY (name);


--
-- Name: app_employees app_employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_employees
    ADD CONSTRAINT app_employees_pkey PRIMARY KEY (name);


--
-- Name: app_receipts app_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_receipts
    ADD CONSTRAINT app_receipts_pkey PRIMARY KEY (id);


--
-- Name: app_receipts app_receipts_receipt_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_receipts
    ADD CONSTRAINT app_receipts_receipt_number_key UNIQUE (receipt_number);


--
-- Name: app_receipts_date_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX app_receipts_date_idx ON public.app_receipts USING btree (receipt_date DESC, created_at DESC);


--
-- Name: app_receipts_employee_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX app_receipts_employee_idx ON public.app_receipts USING btree (employee_name);


--
-- PostgreSQL database dump complete
--

\unrestrict Xu6bRDBn0NFPZcjLx5dBx3UTewGEy3KMg3fQZ38sM6bIdJRj29odJOFWG7GL8fX

