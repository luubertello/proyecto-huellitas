-- Script de inicialización para la base de datos 'adopciones'

CREATE TABLE IF NOT EXISTS estado (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

COPY public.estado (id, nombre) FROM stdin;
1	Pendiente
2	Aprobada
3	Rechazada
4	Finalizada
\.

SELECT pg_catalog.setval('public.estado_id_seq', 4, true);