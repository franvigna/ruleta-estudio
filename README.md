# Ruleta de Estudio

App de estudio genérica y multi-materia: una ruleta sortea un tema y muestra una pregunta al
azar, con tarjeta que se da vuelta y seguimiento del progreso.

Autor: Fran Vigna

> Proyecto en migración desde la versión legacy (`legacy/`) a React + TypeScript.
> El README completo se escribe en la última fase.

## Cómo correrlo

```
npm install
npm run dev
```

Abrir http://localhost:5290. La versión de producción (`npm run build` y `npm run preview`) se
sirve en http://localhost:4290. Los puertos se cambian en `vite.config.ts` (y en
`playwright.config.ts` para los tests e2e).
