--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13 (Debian 15.13-1.pgdg120+1)
-- Dumped by pg_dump version 15.13 (Debian 15.13-1.pgdg120+1)

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
-- Name: animal; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.animal (
    idanimal integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    edad integer,
    estado character varying(50),
    foto text,
    especie_id integer,
    raza_id integer
);


ALTER TABLE public.animal OWNER TO admin;

--
-- Name: animal_idanimal_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.animal_idanimal_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.animal_idanimal_seq OWNER TO admin;

--
-- Name: animal_idanimal_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.animal_idanimal_seq OWNED BY public.animal.idanimal;


--
-- Name: animal idanimal; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal ALTER COLUMN idanimal SET DEFAULT nextval('public.animal_idanimal_seq'::regclass);


--
-- Data for Name: animal; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.animal (idanimal, nombre, descripcion, edad, estado, foto, especie_id, raza_id) FROM stdin;
2	Panchito	Perro mestizo muy juguetón	2	Disponible	https://i.pinimg.com/736x/5e/45/46/5e4546ff7b149e349f114d805dc6e139.jpg	2	2
\.


--
-- Name: animal_idanimal_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.animal_idanimal_seq', 2, true);


--
-- Name: animal animal_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT animal_pkey PRIMARY KEY (idanimal);


--
-- Name: animal fk_especie; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT fk_especie FOREIGN KEY (especie_id) REFERENCES public.especie(id) ON DELETE SET NULL;


--
-- Name: animal fk_raza; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT fk_raza FOREIGN KEY (raza_id) REFERENCES public.raza(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

