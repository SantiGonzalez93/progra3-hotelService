# PROYECTO FINAL PROGRAMACION

## Sistema de Gestión de Hotel

Sistema fullstack para la gestión de reservas, clientes, habitaciones, servicios y empleados de un hotel.

## Tecnologías

### Backend
- Java 21
- Spring Boot 3.3.6
- Maven
- MySQL / H2 Database
- JPA/Hibernate

### Frontend
- React 18
- TypeScript
- Bootstrap 5
- Node.js 18.x (versión menor a 20)

## Requisitos Previos

- Java JDK 21
- Maven 3.8+
- Node.js 18.x (versión menor a 20)
- npm o yarn

## Instalación y Configuración

### Backend

1. Clonar el repositorio:
```bash
git clone https://github.com/SantiGonzalez93/progra3-hotelService.git
cd progra3-hotelService
```

2. Configurar la base de datos en `src/main/resources/application.properties`

3. Ejecutar el backend:
```bash
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:7080`

### Frontend

1. Navegar a la carpeta del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el frontend:
```bash
npm start
```

El frontend estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
progra3-hotelService/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── context/       # Context API
│   │   ├── services/      # Servicios API
│   │   └── types/         # Tipos TypeScript
│   └── package.json
├── src/
│   └── main/
│       ├── java/
│       │   └── belgrano/finalProgra3/
│       │       ├── controller/    # Controladores REST
│       │       ├── entity/        # Entidades JPA
│       │       ├── repository/    # Repositorios JPA
│       │       ├── service/       # Servicios de negocio
│       │       └── dto/           # Data Transfer Objects
│       └── resources/
│           └── application.properties
└── pom.xml                # Configuración Maven
```

## Funcionalidades

- ✅ Gestión de Clientes
- ✅ Gestión de Empleados
- ✅ Gestión de Habitaciones
- ✅ Gestión de Servicios
- ✅ Sistema de Reservas
- ✅ Validación de relaciones antes de eliminar entidades
- ✅ Manejo de errores mejorado

## Scripts Disponibles

### Backend
- `mvn spring-boot:run` - Inicia el servidor Spring Boot
- `mvn clean compile` - Compila el proyecto
- `mvn test` - Ejecuta las pruebas

### Frontend
- `npm start` - Inicia el servidor de desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas

## Notas

- El backend debe estar ejecutándose antes de iniciar el frontend
- Asegúrate de tener Node.js 18.x instalado (versión menor a 20) para el frontend
- El backend utiliza el puerto 7080 por defecto
- El frontend utiliza el puerto 3000 por defecto
