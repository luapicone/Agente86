# HabitatIA / Agente86

Proyecto web separado en frontend y backend.

## Estructura

- `frontend/`: React + Bootstrap + Vite
- `backend/`: Node.js + Express

## Cómo correr el proyecto

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend disponible en:

```bash
http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend disponible en:

```bash
http://localhost:5173
```

## Flujo actual

- landing page
- generador de viviendas
- integración frontend → backend
- generación de propuesta
- generación de prompt arquitectónico para render
- generación de render vía backend
- generación visual MVP con Puter.js para pruebas
- fallback configurable de proveedores
- configurador avanzado para casa/departamento
- carrusel de ambientes con vista fullscreen
