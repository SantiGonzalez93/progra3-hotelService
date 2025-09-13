-- Insertar Clientes (5 registros)
INSERT INTO cliente (nombre, direccion, telefono, correo_electronico) VALUES
('Juan Pérez García', 'Av. Libertador 1234, CABA', '011-4555-0101', 'juan.perez@email.com'),
('María López Fernández', 'Calle Corrientes 5678, CABA', '011-4555-0202', 'maria.lopez@email.com'),
('Carlos Rodríguez Silva', 'Av. Santa Fe 910, Palermo', '011-4555-0303', 'carlos.rodriguez@email.com'),
('Ana Martínez Gómez', 'Calle Florida 234, Microcentro', '011-4555-0404', 'ana.martinez@email.com'),
('Luis González Torres', 'Av. Cabildo 3456, Belgrano', '011-4555-0505', 'luis.gonzalez@email.com');

-- Insertar Empleados (5 registros)
INSERT INTO empleado (nombre, cargo, numero_identificacion, salario, fecha_contratacion) VALUES
('Sofia Ramírez', 'Recepcionista', 35678901, 85000, '2023-01-15 09:00:00'),
('Diego Fernández', 'Gerente General', 30123456, 150000, '2022-03-20 08:30:00'),
('Laura Benítez', 'Jefe de Limpieza', 32890123, 95000, '2022-11-10 10:00:00'),
('Roberto Castro', 'Conserje', 28456789, 75000, '2023-06-05 07:00:00'),
('Patricia Díaz', 'Coordinadora de Eventos', 33567890, 110000, '2023-02-28 09:30:00');

-- Insertar Habitaciones (5 registros)
INSERT INTO habitacion (numero, tipo, precio_por_noche, estado, disponible) VALUES
(101, 'Individual Standard', 8500.50, 'Limpia', true),
(201, 'Doble Deluxe', 12000.00, 'Limpia', true),
(301, 'Suite Ejecutiva', 18500.75, 'En Mantenimiento', false),
(102, 'Individual Standard', 8500.50, 'Ocupada', false),
(202, 'Triple Familiar', 15000.00, 'Limpia', true);

-- Insertar Servicios (5 registros)
INSERT INTO servicio (nombre, descripcion, precio, disponibilidad) VALUES
('Desayuno Continental', 'Buffet completo con opciones locales e internacionales', 2500.00, true),
('Spa y Wellness', 'Acceso completo a spa, sauna y piscina climatizada', 4500.50, true),
('Servicio de Lavandería', 'Lavado y planchado express en 24 horas', 1800.00, true),
('Transfer Aeropuerto', 'Traslado ida y vuelta al aeropuerto en vehículo premium', 3500.00, true),
('Room Service 24h', 'Servicio de comidas y bebidas a la habitación', 2000.00, false);

-- Insertar Reservas (5 registros)
INSERT INTO reserva (fecha_inicio, fecha_fin, habitacion, cliente_id, estado) VALUES
('2024-12-20', '2024-12-25', 1, '1', 'CONFIRMADA'),
('2024-12-15', '2024-12-18', 2, '2', 'PENDIENTE'),
('2024-11-28', '2024-11-30', 4, '3', 'CONFIRMADA'),
('2024-12-22', '2024-12-27', 5, '4', 'CANCELADA'),
('2025-01-02', '2025-01-07', 2, '5', 'PENDIENTE');

-- Insertar Facturas (5 registros)
INSERT INTO factura (reserva_id, total, detalles) VALUES
(1, 42502.50, 'Hospedaje 5 noches habitación individual + desayuno incluido'),
(2, 36000.00, 'Hospedaje 3 noches habitación doble deluxe'),
(3, 17000.00, 'Hospedaje 2 noches + servicio de spa'),
(4, 75000.00, 'Hospedaje 5 noches suite familiar + servicios adicionales'),
(5, 60000.00, 'Hospedaje 5 noches habitación doble + transfer aeropuerto');

-- Insertar relaciones Servicio-Empleado (tabla intermedia)
INSERT INTO servicio_empleado (servicio_id, empleado_id) VALUES
(1, 3), -- Laura (Jefe Limpieza) gestiona Desayuno
(2, 5), -- Patricia (Coord. Eventos) gestiona Spa
(3, 3), -- Laura gestiona Lavandería
(4, 4), -- Roberto (Conserje) gestiona Transfer
(5, 1), -- Sofia (Recepcionista) gestiona Room Service
(1, 5), -- Patricia también ayuda con Desayuno
(2, 1); -- Sofia también ayuda con Spa