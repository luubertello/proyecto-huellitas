-- ========================
-- INSERTAR ROLES
-- ========================
INSERT INTO rol (id, nombre) VALUES
(1, 'Interesado'),
(2, 'Admin General'),
(3, 'Responsable de Adopciones'),
(4, 'Responsable de Animales'),
(5, 'Responsable de Donaciones'),
(6, 'Responsable de Inventarios');

-- ========================
-- INSERTAR USUARIOS DE PRUEBA
-- ========================
INSERT INTO usuario (id, nombre, apellido, dni, sexo, "fechaNacimiento", direccion, email, contrasena, telefono, "googleId", "rolId") VALUES
(1, 'Juan', 'Perez', 12345678, 'Masculino', '1990-05-12', 'Av. Siempre Viva 123', 'juan.interesado@example.com', '$2b$10$hashinteresado', '123456789', NULL, 1),
(2, 'Ana', 'Gomez', 23456789, 'Femenino', '1985-08-20', 'Calle Falsa 456', 'ana.admin@example.com', '$2b$10$hashadmin', '987654321', NULL, 2),
(3, 'Carlos', 'Lopez', 34567890, 'Masculino', '1992-11-03', 'Calle Luna 789', 'carlos.adopciones@example.com', '$2b$10$hashadopciones', '555555555', NULL, 3),
(4, 'María', 'Ramirez', 45678901, 'Femenino', '1995-02-14', 'Av. Sol 101', 'maria.animales@example.com', '$2b$10$hashanimales', '444444444', NULL, 4),
(5, 'Luis', 'Fernandez', 56789012, 'Masculino', '1988-07-22', 'Calle Estrella 202', 'luis.donaciones@example.com', '$2b$10$hashdonaciones', '333333333', NULL, 5),
(6, 'Carla', 'Mendoza', 67890123, 'Femenino', '1991-09-30', 'Av. Mar 303', 'carla.inventarios@example.com', '$2b$10$hashinventarios', '222222222', NULL, 6);
