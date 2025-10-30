-- Script de inicialización para la base de datos 'usuarios'

CREATE TABLE IF NOT EXISTS rol (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

COPY public.rol (id, nombre) FROM stdin;
1	Interesado
2	Admin General
3	Responsable de Adopciones
4   Responsable de Animales
5   Responsable de Donaciones
6   Responsable de Inventarios
\.

SELECT pg_catalog.setval('public.rol_id_seq', 6, true);
