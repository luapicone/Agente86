# HabitatIA Frontend

Aplicación React + Vite de HabitatIA. El configurador usa un cuestionario fijo en
`src/utils/chatFlow.js`: no consulta OpenAI/Codex y no depende de servicios externos para
decidir la siguiente pregunta. Las respuestas se envían al backend únicamente al generar
la propuesta.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm test
```

## Cuestionario

- Las preguntas mantienen un orden único y cada campo se solicita una sola vez.
- `terrainType` aparece solo cuando la persona ya cuenta con terreno.
- `hasGrill` aparece solo cuando se eligió incluir quincho.
- La definición de preguntas es la única fuente de verdad del avance y del historial visual.

## Base técnica

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
