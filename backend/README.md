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

## Fallback actual

Orden configurable por `.env`:

```env
RENDER_PROVIDER_ORDER=huggingface,replicate,together,pollinations,mock
```

Proveedores soportados actualmente:

- `huggingface`
- `replicate`
- `together`
- `pollinations`
- `mock`

Fallback recomendado backend:

1. Hugging Face
2. Replicate
3. Together
4. Pollinations
5. Mock

Además, el frontend intenta primero una generación gratuita en cliente con **Puter.js** antes de recurrir al backend.
