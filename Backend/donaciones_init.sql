--
-- PostgreSQL database dump
--
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
\restrict W54rNlZbnlUhV9KrYc9KkrdoDu3dqFXitpI8XVAmetfiXBHpaYc4XM9uOSNXQhX

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.14

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: donacion_dinero; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.donacion_dinero (
    id integer NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    monto numeric(10,2) NOT NULL,
    "metodoDePago" character varying(50) NOT NULL,
    "esAnonimo" boolean DEFAULT false NOT NULL,
    "userId" integer,
    "emailInvitado" character varying,
    "estadoDineroId" integer NOT NULL
);


ALTER TABLE public.donacion_dinero OWNER TO admin;

--
-- Name: donacion_dinero_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.donacion_dinero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.donacion_dinero_id_seq OWNER TO admin;

--
-- Name: donacion_dinero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.donacion_dinero_id_seq OWNED BY public.donacion_dinero.id;


--
-- Name: donacion_insumo; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.donacion_insumo (
    id integer NOT NULL,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    categoria character varying(100) NOT NULL,
    nombre character varying,
    descripcion text,
    unidad character varying(50),
    "tipoEntrega" character varying(50) NOT NULL,
    "direccionRetiro" character varying,
    "userId" integer,
    "nombreInvitado" character varying,
    "emailInvitado" character varying,
    "telefonoInvitado" character varying,
    "estadoInsumoId" integer NOT NULL,
    atributos jsonb DEFAULT '{}'::jsonb,
    cantidad double precision DEFAULT '1'::double precision NOT NULL
);


ALTER TABLE public.donacion_insumo OWNER TO admin;

--
-- Name: donacion_insumo_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.donacion_insumo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.donacion_insumo_id_seq OWNER TO admin;

--
-- Name: donacion_insumo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.donacion_insumo_id_seq OWNED BY public.donacion_insumo.id;


--
-- Name: estado_donacion_dinero; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.estado_donacion_dinero (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.estado_donacion_dinero OWNER TO admin;

--
-- Name: estado_donacion_dinero_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.estado_donacion_dinero_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.estado_donacion_dinero_id_seq OWNER TO admin;

--
-- Name: estado_donacion_dinero_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.estado_donacion_dinero_id_seq OWNED BY public.estado_donacion_dinero.id;


--
-- Name: estado_donacion_insumo; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.estado_donacion_insumo (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.estado_donacion_insumo OWNER TO admin;

--
-- Name: estado_donacion_insumo_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.estado_donacion_insumo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.estado_donacion_insumo_id_seq OWNER TO admin;

--
-- Name: estado_donacion_insumo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.estado_donacion_insumo_id_seq OWNED BY public.estado_donacion_insumo.id;


--
-- Name: donacion_dinero id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donacion_dinero ALTER COLUMN id SET DEFAULT nextval('public.donacion_dinero_id_seq'::regclass);


--
-- Name: donacion_insumo id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donacion_insumo ALTER COLUMN id SET DEFAULT nextval('public.donacion_insumo_id_seq'::regclass);


--
-- Name: estado_donacion_dinero id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estado_donacion_dinero ALTER COLUMN id SET DEFAULT nextval('public.estado_donacion_dinero_id_seq'::regclass);


--
-- Name: estado_donacion_insumo id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estado_donacion_insumo ALTER COLUMN id SET DEFAULT nextval('public.estado_donacion_insumo_id_seq'::regclass);


--
-- Data for Name: donacion_dinero; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.donacion_dinero (id, fecha, monto, "metodoDePago", "esAnonimo", "userId", "emailInvitado", "estadoDineroId") FROM stdin;
\.


--
-- Data for Name: donacion_insumo; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.donacion_insumo (id, fecha, categoria, nombre, descripcion, unidad, "tipoEntrega", "direccionRetiro", "userId", "nombreInvitado", "emailInvitado", "telefonoInvitado", "estadoInsumoId", atributos, cantidad) FROM stdin;
1	2025-11-12 22:22:46.269413+00	Alimentos	Bolsa de Dog Chow	1 bolsa de Dog Chow Adulto 15kg	Bolsa	retira_domicilio	Alem 664	8	\N	\N	\N	1	{}	1
2	2025-11-18 13:13:29.102975+00	Medicamentos	Amoxicilina Vet	1 caja de Amoxicilina 250mg para uso veterinario	Cajas	entrega_fundacion	\N	\N	Donante Invitado Anonimo	invitado1@example.com	3512345678	1	{"droga": "Amoxicilina", "marca": "VetAr"}	1
3	2025-11-18 13:13:35.311796+00	Accesorios	Cama para gato mediana	Cama acolchonada tama├▒o mediano color gris	Unidades	retira_domicilio	San Martin 1200	\N	Donante Invitado Anonimo	invitado2@example.com	3544556677	1	{"tipoInsumo": "Cama"}	1
\.


--
-- Data for Name: estado_donacion_dinero; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.estado_donacion_dinero (id, nombre) FROM stdin;
\.


--
-- Data for Name: estado_donacion_insumo; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.estado_donacion_insumo (id, nombre) FROM stdin;
1	Pendiente
2	EnCoordinacion
3	Recibida
4	Cancelada
5	RegistradaEnStock
\.


--
-- Name: donacion_dinero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.donacion_dinero_id_seq', 1, false);


--
-- Name: donacion_insumo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.donacion_insumo_id_seq', 47, true);


--
-- Name: estado_donacion_dinero_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.estado_donacion_dinero_id_seq', 1, false);


--
-- Name: estado_donacion_insumo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.estado_donacion_insumo_id_seq', 4, true);


--
-- Name: donacion_dinero PK_0c6907f0b5943155c9cc7a131fb; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donacion_dinero
    ADD CONSTRAINT "PK_0c6907f0b5943155c9cc7a131fb" PRIMARY KEY (id);


--
-- Name: donacion_insumo PK_6c3cca6b169efc82b1d89fd8827; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donacion_insumo
    ADD CONSTRAINT "PK_6c3cca6b169efc82b1d89fd8827" PRIMARY KEY (id);


--
-- Name: estado_donacion_dinero PK_b92d194618bb15d4fe3f3beae1c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estado_donacion_dinero
    ADD CONSTRAINT "PK_b92d194618bb15d4fe3f3beae1c" PRIMARY KEY (id);


--
-- Name: estado_donacion_insumo PK_e246f8154bcb4c989aacc16be61; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estado_donacion_insumo
    ADD CONSTRAINT "PK_e246f8154bcb4c989aacc16be61" PRIMARY KEY (id);


--
-- Name: estado_donacion_dinero UQ_086c3086dc49b8477cc0f6ad9f7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estado_donacion_dinero
    ADD CONSTRAINT "UQ_086c3086dc49b8477cc0f6ad9f7" UNIQUE (nombre);


--
-- Name: estado_donacion_insumo UQ_237a743f2ec78f8a72ca67aedd5; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estado_donacion_insumo
    ADD CONSTRAINT "UQ_237a743f2ec78f8a72ca67aedd5" UNIQUE (nombre);


--
-- Name: donacion_dinero FK_68245f22c2b20c9be7f2eacf096; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donacion_dinero
    ADD CONSTRAINT "FK_68245f22c2b20c9be7f2eacf096" FOREIGN KEY ("estadoDineroId") REFERENCES public.estado_donacion_dinero(id);


--
-- Name: donacion_insumo FK_d4ce72d291638ac72f991b83c6f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.donacion_insumo
    ADD CONSTRAINT "FK_d4ce72d291638ac72f991b83c6f" FOREIGN KEY ("estadoInsumoId") REFERENCES public.estado_donacion_insumo(id);


--
-- PostgreSQL database dump complete
--

\unrestrict W54rNlZbnlUhV9KrYc9KkrdoDu3dqFXitpI8XVAmetfiXBHpaYc4XM9uOSNXQhX

