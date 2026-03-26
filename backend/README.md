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
RENDER_PROVIDER_ORDER=deepai,huggingface,replicate,together,pollinations,mock
```

Proveedores soportados actualmente:

- `deepai`
- `huggingface`
- `replicate`
- `together`
- `pollinations`
- `mock`

Fallback recomendado backend:

1. DeepAI
2. Hugging Face
3. Replicate
4. Together
5. Pollinations
6. Mock
