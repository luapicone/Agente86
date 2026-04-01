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


## Deploy en Vercel

Este repo quedó preparado para deploy unificado en Vercel:

- `frontend/` se builda con Vite
- `api/index.js` expone el backend Express como función de Vercel
- por defecto el frontend consume `'/api'` en producción

### Variables de entorno recomendadas en Vercel

- `REPLICATE_API_TOKEN` (si querés usar Replicate)
- cualquier otra variable usada por `backend/.env`

### Nota importante

El marketplace actualmente persiste en archivo JSON local (`backend/data/marketplace-materials.json`). En Vercel, las escrituras al filesystem no son persistentes entre ejecuciones, así que para producción real conviene migrar esa parte a una base de datos o storage externo.
