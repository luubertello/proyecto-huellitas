-- ========================
-- 1. DATOS INICIALES
-- ========================

-- Estados de adopción
INSERT INTO estado (id, nombre) VALUES
(1, 'Pendiente'),
(2, 'Aprobada'),
(3, 'Rechazada'),
(4, 'Finalizada');

-- Formularios de adopción
INSERT INTO formulario_adopcion (
    id, "motivoAdopcion", "experienciaPrevia", "tieneOtrosAnimales", "cantidadPerros", "cantidadGatos",
    "otrasEspeciesDescripcion", "tipoVivienda", "tienePatio", "tieneBalcon", "balconConProteccion",
    "medidasDeSeguridad", "tiempoAnimalSoloHoras", "compromisoPaseos", "compromisoGastosVet"
) VALUES
(1, 'Quiero compañía para mi familia', 'He tenido perros antes', true, 1, 0, NULL, 'Casa', true, false, NULL, 'Cercas y puertas cerradas', 4, true, true),
(2, 'Amor por los gatos', 'Nunca tuve gatos, pero he investigado', false, 0, 0, NULL, 'Departamento', false, true, true, 'Ventanas con protección', 6, true, true),
(3, 'Busco un perro activo', 'He tenido perros jóvenes', true, 0, 2, NULL, 'Casa con patio', true, false, NULL, 'Cercas altas y juguetes seguros', 3, true, true);

-- Solicitudes de adopción
INSERT INTO solicitud_adopcion (id, "fechaSolicitud", "adoptanteId", "animalId", "formularioId", "estadoActualId") VALUES
(1, '2025-10-31 09:00:00', 1, 1, 1, 1),
(2, '2025-10-30 15:30:00', 2, 2, 2, 2),
(3, '2025-10-28 12:15:00', 3, 3, 3, 1);

-- Cambios de estado (historial)
INSERT INTO cambio_estado (id, "fechaCambio", motivo, "responsableId", "solicitudId", "estadoNuevoId", "estadoAnteriorId") VALUES
(1, '2025-10-31 10:00:00', 'Solicitud recibida', 3, 1, 1, NULL),
(2, '2025-10-30 16:00:00', 'Solicitud aprobada por revisión', 3, 2, 2, 1),
(3, '2025-10-28 13:00:00', 'Solicitud recibida', 4, 3, 1, NULL);

-- ========================
-- 2. REINICIO DE SECUENCIAS
-- ========================
SELECT pg_catalog.setval('estado_id_seq', 4, true);
SELECT pg_catalog.setval('formulario_adopcion_id_seq', 3, true);
SELECT pg_catalog.setval('solicitud_adopcion_id_seq', 3, true);
SELECT pg_catalog.setval('cambio_estado_id_seq', 3, true);
