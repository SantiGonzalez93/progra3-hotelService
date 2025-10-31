# Sistema de Gestión de Hotel - Frontend

Frontend desarrollado con React + TypeScript para el sistema de gestión de hotel.

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Bootstrap 5** - Framework CSS
- **React Bootstrap** - Componentes Bootstrap para React
- **Axios** - Cliente HTTP
- **React Router** - Enrutamiento

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

## 🌐 Uso

1. Asegúrate de que el backend esté ejecutándose en `http://localhost:7080`
2. Ejecuta `npm start` en la carpeta `frontend`
3. Abre `http://localhost:3000` en tu navegador

## 🔧 Configuración

El frontend está configurado para conectarse automáticamente con el backend en `http://localhost:7080` mediante el proxy configurado en `package.json`.

## 📁 Estructura

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/     # Componentes React
│   ├── services/       # Servicios API
│   ├── types/          # Tipos TypeScript
│   ├── App.tsx         # Componente principal
│   ├── index.tsx       # Punto de entrada
│   └── index.css       # Estilos globales
├── package.json
└── tsconfig.json
```
