--
-- PostgreSQL database dump
--
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
\restrict bl9todtHaOb9tOZj0G6dOhsLwaRvdBfTVyDJAGOQY9U0H7pmnzNCovHpi8kzDbY

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
-- Name: animal; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.animal (
    id integer NOT NULL,
    nombre character varying NOT NULL,
    sexo character varying NOT NULL,
    "fechaNacimiento" date,
    descripcion character varying NOT NULL,
    foto character varying NOT NULL,
    raza_id integer,
    especie_id integer,
    "estadoActual_id" integer
);


ALTER TABLE public.animal OWNER TO admin;

--
-- Name: animal_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.animal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.animal_id_seq OWNER TO admin;

--
-- Name: animal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.animal_id_seq OWNED BY public.animal.id;


--
-- Name: cambio_estado; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.cambio_estado (
    id integer NOT NULL,
    "fechaHoraInicio" character varying NOT NULL,
    "fechaHoraFin" character varying NOT NULL,
    "animalId" integer
);


ALTER TABLE public.cambio_estado OWNER TO admin;

--
-- Name: cambio_estado_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.cambio_estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cambio_estado_id_seq OWNER TO admin;

--
-- Name: cambio_estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.cambio_estado_id_seq OWNED BY public.cambio_estado.id;


--
-- Name: especie; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.especie (
    id integer NOT NULL,
    nombre character varying NOT NULL
);


ALTER TABLE public.especie OWNER TO admin;

--
-- Name: especie_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.especie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.especie_id_seq OWNER TO admin;

--
-- Name: especie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.especie_id_seq OWNED BY public.especie.id;


--
-- Name: estado; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.estado (
    id integer NOT NULL,
    nombre character varying NOT NULL
);


ALTER TABLE public.estado OWNER TO admin;

--
-- Name: estado_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.estado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.estado_id_seq OWNER TO admin;

--
-- Name: estado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.estado_id_seq OWNED BY public.estado.id;


--
-- Name: raza; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.raza (
    id integer NOT NULL,
    nombre character varying DEFAULT 'Sin nombre'::character varying NOT NULL,
    especie_id integer
);


ALTER TABLE public.raza OWNER TO admin;

--
-- Name: raza_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.raza_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.raza_id_seq OWNER TO admin;

--
-- Name: raza_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.raza_id_seq OWNED BY public.raza.id;


--
-- Name: animal id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal ALTER COLUMN id SET DEFAULT nextval('public.animal_id_seq'::regclass);


--
-- Name: cambio_estado id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cambio_estado ALTER COLUMN id SET DEFAULT nextval('public.cambio_estado_id_seq'::regclass);


--
-- Name: especie id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.especie ALTER COLUMN id SET DEFAULT nextval('public.especie_id_seq'::regclass);


--
-- Name: estado id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estado ALTER COLUMN id SET DEFAULT nextval('public.estado_id_seq'::regclass);


--
-- Name: raza id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.raza ALTER COLUMN id SET DEFAULT nextval('public.raza_id_seq'::regclass);


--
-- Data for Name: animal; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.animal (id, nombre, sexo, "fechaNacimiento", descripcion, foto, raza_id, especie_id, "estadoActual_id") FROM stdin;
1	Mango	Macho	2024-11-29	Mango es el caos adorable que le falta a tu vida. Un experto en travesuras y dueno de una torpeza que te robaria una sonrisa. Fiel a su espiritu naranja, tiene una energia inagotable para jugar.\n\nPero cuando la aventura termina, se convierte en el gato mas amoroso, buscando un regazo para llenarlo de ronroneos. Si buscas un amigo leal que combine ternura y diversion, Mango te esta esperando!	https://i.imgur.com/eBo0Snz.jpeg	31	2	1
2	Micha	Hembra	2024-11-02	Micha es una gata con la personalidad unica de las tricolor: independiente, observadora y duena de su espacio. Ella te ensenara que el mejor carino es el que se gana.\n\nAunque parece reservada, Micha buscara activamente tu afecto cuando lo desee, recompensandote con ronroneos y su especialidad: amasar con pura felicidad. Es una experta en encontrar los lugares mas incomodos e insolitos para dormir y disfruta enormemente de un buen plato de comida. Si buscas un amor leal y sincero (aunque con sus propias reglas), Micha es tu gata ideal.	https://i.imgur.com/huyvqea.jpeg	31	2	1
3	Misu	Hembra	2025-04-21	Misu es un estallido de vitalidad y sorpresa con un hermoso pelaje carey. Su espiritu jugueton no tiene limites; convierte cualquier objeto en su juguete y cada rincon de la casa en su gimnasio personal con saltos acrobaticos.\n\nEs un alma independiente que vive en su propio mundo de aventuras, pero cuando decide buscar carino, lo hace con una ternura que derrite y sorprende. Misu es la companera perfecta para quien busque una gata activa, impredecible y que llene el hogar de risas y vitalidad.	https://i.imgur.com/LrEvDnw.jpeg	31	2	1
4	Nube	Hembra	2013-01-12	Nube es tan dulce y esponjosa como su nombre indica. Es una caniche que es puro amor y ternura en un paquete de pelo suave. Es una companera extremadamente fiel que demuestra su carino de las formas mas dulces: buscando acurrucarse contigo en la cama y repartiendo besitos a quien se deje querer.\n\nSu alegria es contagiosa, especialmente cuando escucha la palabra "paseo", momento en el que su emocion ilumina toda la habitacion. Nube es perfecta para una familia que busque una dosis diaria de mimos, lealtad y la compania mas tierna que se pueda imaginar.	https://i.imgur.com/ZqRlaG2.jpeg	2	1	1
5	Kiwi	Macho	2016-05-14	Kiwi es la definicion de lealtad; un companero inseparable cuyo unico deseo es estar a tu lado. Ya sea acurrucado a tus pies por la noche o siguiendote por la casa durante el dia, su lugar favorito en el mundo es junto a ti.\n\nSu otra gran pasion es la calle. Se emociona con la simple idea de salir a pasear y es el copiloto perfecto para cualquier aventura fuera de casa, siempre listo para explorar el mundo. Si buscas un amigo incondicional que llene tus dias de compania, Kiwi es tu alma gemela.	https://i.imgur.com/JwzDLv4.jpeg	1	1	1
6	Kyra	Hembra	2025-01-13	Kyra tiene una mirada seria que esconde un corazon de oro. Es una gata independiente que elige sus momentos para dar carino, pero cuando lo hace, su ternura es capaz de derretir a cualquiera. Se adapta maravillosamente a la convivencia con perritos y su otra gran pasion es disfrutar de una buena comida. Es la companera ideal para quien busque un amor tranquilo y sincero.	https://i.imgur.com/v8J4PWV.jpeg	31	2	1
7	Blacky	Hembra	2023-10-13	Blacky es una explosion de alegria y lealtad en cuatro patas. Es una perrita muy juguetona que ama morder sus juguetes y explorar el mundo metiendo su curiosa nariz en la tierra. Su lugar favorito es siempre cerca de ti, lista para seguirte en cualquier aventura. Es la sombra perfecta para quien busque una companera divertida y fiel.	https://i.imgur.com/8rNB2Tl.jpeg	2	1	1
8	Luna	Hembra	2015-08-12	Luna es la companera tranquila y fiel que todos suenan tener. Aunque es una perrita adulta, guarda en su interior la alegria de una cachorra, siempre lista para un juego suave. Sus mayores placeres son las cosas simples de la vida: pasar tiempo al aire libre, revolcarse feliz en la tierra y encontrar un rayito de sol para una buena siesta.	https://i.imgur.com/RFqVPAy.jpeg	1	1	1
9	Bonzo	Macho	2016-10-03	Bonzo es un grandulon con un corazon de oro. Aunque de entrada puede parecer un poco bruto y desconfiado con quien no conoce, es solo la fachada de un perro increiblemente bueno y leal. Su energia es tan grande como su tamano, y su mayor pasion es el agua en todas sus formas: para el, no hay nada mas divertido que un buen charco donde chapotear. Busca una familia que entienda su fuerza y le de la oportunidad de mostrar el companero fiel que lleva dentro.	https://i.imgur.com/WnJbhCk.jpeg	5	1	1
10	Peluche	Macho	2020-06-09	Peluche es el equilibrio perfecto entre la calma y el juego. Tiene sus momentos de curiosidad y diversion, pero su verdadera naturaleza es la de un gato sereno y tranquilo. Es el companero ideal que buscara estar a tu lado en el sofa, ofreciendo una presencia relajante y afectuosa. Si buscas un amigo leal para compartir momentos de paz y juegos suaves, Peluche es tu gato ideal.	https://i.imgur.com/2zwqyFH.jpeg	31	2	1
11	Lupe	Hembra	2024-02-09	Lupe es una perrita con un espiritu jugueton y un alma de jardinera. Su mayor felicidad es pasar tiempo en casa, especialmente si hay un patio con pasto donde pueda revolcarse a gusto. No es fan de las largas caminatas; prefiere las aventuras hogarenas y los juegos en su propio territorio. Es la companera perfecta para quien busque una amiga leal y divertida que disfrute de la tranquilidad del hogar tanto como tu.	https://i.imgur.com/k6PcYQj.jpeg	1	1	1
12	Nina	Hembra	2022-12-10	Nina es una perra con un fuerte instinto de guardiana y un corazon leal. Aunque puede mostrarse selectiva y con caracter al principio, es solo porque se toma muy en serio el cuidado de los suyos.\n\nSu energia es desbordante, lo que demuestra con sus saltos de alegria y sus ganas de jugar. Su lado mas sociable y feliz brilla con mas fuerza cuando esta en compania de otros perros, con quienes adora correr y divertirse. Es la companera ideal para quien busque una protectora fiel y una gran amiga para sus otras mascotas.	https://i.imgur.com/Gmc3BXI.jpeg	2	1	1
13	Reina	Hembra	2017-02-10	Reina es una perra de gran tamano con el alma y la ternura de una cachorra. Su espiritu jugueton la lleva a olvidar sus dimensiones, por lo que intentara pasar entre tus piernas buscando carino como si todavia fuera pequena. Detras de ese corazon de eterna cachorra, se esconde una companera protectora y leal, siempre atenta a su familia. Es el perro ideal para quien busque la lealtad de una guardiana y la dulzura inagotable de un gran bebe.	https://i.imgur.com/2uBnd21.jpeg	1	1	1
\.


--
-- Data for Name: cambio_estado; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.cambio_estado (id, "fechaHoraInicio", "fechaHoraFin", "animalId") FROM stdin;
\.


--
-- Data for Name: especie; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.especie (id, nombre) FROM stdin;
1	Perro
2	Gato
\.


--
-- Data for Name: estado; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.estado (id, nombre) FROM stdin;
1	enAdopcion
2	pendienteAdopcion
3	adoptado
\.


--
-- Data for Name: raza; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.raza (id, nombre, especie_id) FROM stdin;
1	Mestizo	1
2	Caniche	1
3	Labrador Retriever	1
5	Golden Retriever	1
7	Yorkshire Terrier	1
8	Boxer	1
9	Beagle	1
10	Rottweiler	1
11	Salchicha (Dachshund)	1
12	Schnauzer Miniatura	1
14	Dogo de Burdeos	1
15	Cocker Spaniel	1
16	Bull Terrier	1
17	Chihuahua	1
18	Pinscher Miniatura	1
19	Shih Tzu	1
21	Siberian Husky	1
22	Doberman	1
23	Pointer	1
25	San Bernardo	1
26	Jack Russell Terrier	1
28	Chow Chow	1
29	Akita	1
33	Persa	2
35	Maine Coon	2
36	Angora	2
37	Ragdoll	2
38	British Shorthair	2
39	Scottish Fold	2
40	Himalayo	2
41	Birmano	2
42	Azul Ruso	2
43	Siberiano	2
44	Sphynx (Gato Esfinge)	2
46	Bombay	2
48	Abisinio	2
49	Manx	2
50	Cornish Rex	2
51	Devon Rex	2
52	Ocicat	2
53	Snowshoe	2
54	Savannah	2
57	Chartreux	2
58	Nebelung	2
59	Korat	2
6	Ovejero Alem├ín	1
13	Pug (Carlino)	1
20	Gran Danes	1
24	Setter Irlandes	1
27	Maltes	1
30	Pekines	1
31	Mestizo	2
32	Siames	2
34	Gato Comun Europeo	2
45	Exotico de Pelo Corto	2
47	Tonkines	2
60	Somali	2
4	Bulldog Frances	1
55	Balines	2
56	Javanes	2
\.

--
-- Name: animal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.animal_id_seq', 13, true);


--
-- Name: cambio_estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.cambio_estado_id_seq', 1, false);


--
-- Name: especie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.especie_id_seq', 2, true);


--
-- Name: estado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.estado_id_seq', 3, true);


--
-- Name: raza_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.raza_id_seq', 60, true);


--
-- Name: especie PK_07fb45be286aefa181943248b21; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.especie
    ADD CONSTRAINT "PK_07fb45be286aefa181943248b21" PRIMARY KEY (id);


--
-- Name: raza PK_0ec1e097b33d55dff937816e3b5; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.raza
    ADD CONSTRAINT "PK_0ec1e097b33d55dff937816e3b5" PRIMARY KEY (id);


--
-- Name: cambio_estado PK_62bb06443b1eb1255c05f40bff3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cambio_estado
    ADD CONSTRAINT "PK_62bb06443b1eb1255c05f40bff3" PRIMARY KEY (id);


--
-- Name: animal PK_af42b1374c042fb3fa2251f9f42; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT "PK_af42b1374c042fb3fa2251f9f42" PRIMARY KEY (id);


--
-- Name: estado PK_be2ef64a21d36522aa1ecb24886; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estado
    ADD CONSTRAINT "PK_be2ef64a21d36522aa1ecb24886" PRIMARY KEY (id);


--
-- Name: animal FK_8ab4f55f815d861407fbdd10428; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT "FK_8ab4f55f815d861407fbdd10428" FOREIGN KEY (especie_id) REFERENCES public.especie(id);


--
-- Name: animal FK_9ee8932216d2103d3b0046f10a4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT "FK_9ee8932216d2103d3b0046f10a4" FOREIGN KEY ("estadoActual_id") REFERENCES public.estado(id);


--
-- Name: cambio_estado FK_af776b0937cdb12d90bffaecac7; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.cambio_estado
    ADD CONSTRAINT "FK_af776b0937cdb12d90bffaecac7" FOREIGN KEY ("animalId") REFERENCES public.animal(id);


--
-- Name: animal FK_b895d2a15132512acd72f5a2fc5; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.animal
    ADD CONSTRAINT "FK_b895d2a15132512acd72f5a2fc5" FOREIGN KEY (raza_id) REFERENCES public.raza(id);


--
-- Name: raza FK_d785daef1744cb2f35be5510210; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.raza
    ADD CONSTRAINT "FK_d785daef1744cb2f35be5510210" FOREIGN KEY (especie_id) REFERENCES public.especie(id);


--
-- PostgreSQL database dump complete
--

\unrestrict bl9todtHaOb9tOZj0G6dOhsLwaRvdBfTVyDJAGOQY9U0H7pmnzNCovHpi8kzDbY

