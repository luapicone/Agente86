# HabitatIA Backend

Backend inicial del proyecto HabitatIA desarrollado con Node.js y Express.

## Scripts

```bash
npm install
npm run dev
```

## Endpoints

### Healthcheck

```http
GET /api/health
```

### Generación de propuesta

```http
POST /api/projects/generate
```

### Generación de render con fallback

```http
POST /api/renders/generate
```

Payload esperado:

```json
{
  "projectName": "Vivienda familiar zona sur",
  "squareMeters": 75,
  "bedrooms": 2,
  "bathrooms": 1,
  "budget": 65000,
  "priority": "sostenibilidad",
  "climate": "templado",
  "material": "madera-reciclada"
}
```

### Generación de planos con fal.ai

```http
POST /api/renders/floor-plan
```

Recibe los datos normalizados del proyecto y `floorNumber`. HabitatIA genera una lámina
cenital independiente por planta con FLUX.2 Pro. Para casas se admiten hasta tres plantas;
para departamentos se genera una planta general.

### Edición conversacional de un ambiente

```http
POST /api/renders/edit
```

Payload esperado:

```json
{
  "imageUrl": "https://.../ambiente.jpeg",
  "instruction": "Mantené el encuadre y cambiá el piso por madera clara",
  "title": "Living comedor"
}
```

Cada respuesta devuelve una nueva `imageUrl`. El frontend usa esa última versión como
entrada del siguiente mensaje para encadenar modificaciones sobre el mismo ambiente. La
imagen de origen debe estar publicada mediante HTTPS para que fal.ai pueda accederla.

## Fallback actual

Orden configurable por `.env`:

```env
RENDER_PROVIDER_ORDER=fal,demo,mock
```

Proveedores soportados actualmente:

- `fal` (FLUX.2 Pro; requiere `FAL_KEY`)
- `deepai`
- `huggingface`
- `replicate`
- `together`
- `demo`
- `mock`

Fallback recomendado backend:

1. fal.ai / FLUX.2 Pro
2. Demo
3. Mock
