# Convenciones de Ruleta de Estudio

## Dependencias entre capas

- `src/domain/` es lógica pura: no importa React, DOM, `localStorage` ni usa `Math.random`.
- `src/infra/` implementa puertos del dominio y valida datos externos.
- Una feature sólo importa su propio código, `domain/` y `shared/`.
- `src/shared/` contiene presentación reutilizable sin reglas de negocio.
- `src/app/` es el único lugar que compone implementaciones concretas.
- No se accede a `localStorage` desde componentes de UI.

ESLint hace cumplir estas fronteras. No se desactivan reglas para eludirlas.

## Contenido

- `content/materias/` es la fuente de verdad; `src/content/generated/` se genera y no se edita.
- No se modifica el texto de preguntas o respuestas sin un pedido explícito.
- Los ids de preguntas son estables. No se renombran ni se regeneran.
- Las migraciones de almacenamiento son versionadas y deben preservar los datos anteriores.
- La notación matemática usa Unicode; no se incorpora LaTeX ni delimitadores `$`.
- Antes de entregar cambios de contenido se ejecutan `content:check` y el test de equivalencia.

## Interfaz y extensiones

- El tema visual claro y el oscuro comparten los tokens de `src/styles/tokens.css`.
- Los colores de área llegan desde `materia.json`; no se hardcodean colores de una materia en React.
- Toda funcionalidad nueva entra como una feature cohesionada o como una estrategia del dominio.
- Un modo de estudio nuevo implementa `EstrategiaSeleccion`.
- Un almacenamiento nuevo implementa `ProgresoRepositorio` y se conecta en `app/composition.ts`.
- Se preservan accesibilidad, navegación por teclado y `prefers-reduced-motion`.

## Calidad

- TypeScript permanece en modo estricto.
- Cada cambio de comportamiento incluye pruebas deterministas; el azar se inyecta como `Rng`.
- El dominio mantiene al menos 90% de cobertura en líneas, funciones, ramas y sentencias.
- Al cerrar una fase se ejecutan lint, typecheck, tests, build y las validaciones de contenido.
- Los commits siguen Conventional Commits.
