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

- landing page visual sincronizada con la presentación comercial de HabitatIA, manteniendo el chat conversacional y el marketplace dentro de la app principal
- navegación por URL entre la landing (`/`), el chat/configurador (`/configurador`) y el marketplace (`/marketplace`), con soporte para Atrás/Adelante y acceso directo gracias al rewrite SPA de Vercel
- chat conversacional con extracción de respuestas compuestas para evitar repreguntar datos ya dichos en una misma frase
- generador de viviendas
- integración frontend → backend
- generación de propuesta
- generación de prompt arquitectónico para render
- generación de render vía backend
- generación de renders con FLUX.2 Pro mediante fal.ai
- visualización de planos exclusivamente con las imágenes generadas por fal.ai, con reintento para plantas faltantes
- generación visual MVP con Puter.js solo como último respaldo del navegador
- fallback configurable de proveedores
- fallback híbrido para la galería: cada ambiente intenta render por backend y, si falla por completo, recién prueba Puter en cliente
- si no hay proveedores externos configurados, `demo` devuelve imágenes arquitectónicas de muestra sin API keys ni costo para reuniones y validaciones rápidas
- `mock` sigue existiendo solo como último respaldo técnico para evitar galerías vacías
- normalización de respuestas booleanas del chat para que extras como pileta, garage, quincho o parrilla respeten el "Sí/No" real
- configurador avanzado para casa/departamento
- carrusel de ambientes con vista fullscreen


## Deploy en Vercel

Este repo quedó preparado para deploy unificado en Vercel:

- `frontend/` se builda con Vite
- `api/index.js` expone el backend Express como función de Vercel
- por defecto el frontend consume `'/api'` en producción

### Variables de entorno recomendadas en Vercel

- `FAL_KEY` (requerida para generar con FLUX.2 Pro)
- `RENDER_PROVIDER_ORDER=fal,demo,mock`
- `REPLICATE_API_TOKEN` (si querés usar Replicate)
- cualquier otra variable usada por `backend/.env`

Si no configurás ninguna credencial externa, el backend igual puede responder imágenes mediante el proveedor `demo`.

### Nota importante

El marketplace actualmente persiste en archivo JSON local (`backend/data/marketplace-materials.json`). En Vercel, las escrituras al filesystem no son persistentes entre ejecuciones, así que para producción real conviene migrar esa parte a una base de datos o storage externo.
