# Ruleta de Estudio

Aplicación web de estudio genérica y multi-materia. Una ruleta elige un tema con preguntas
pendientes, muestra una pregunta al azar y permite dar vuelta la tarjeta para consultar la
respuesta. Cada respuesta se marca como sabida o pendiente de repaso y el avance queda guardado en
el navegador.

El proyecto migra y conserva la experiencia de la ruleta original de **Programación Avanzada
(UNLaM)**, pero separa el contenido de la aplicación: agregar una materia no requiere modificar
React ni TypeScript.

Autor: Fran Vigna

## Funcionalidades

- Catálogo de materias con porcentaje de avance.
- Ruleta que excluye los temas ya completados.
- Tarjetas reversibles con preguntas y respuestas en Markdown.
- Marcas “Me la sabía” y “No me la sabía”, corregibles en cualquier momento.
- Selección ponderada: las preguntas con más fallos tienen más oportunidades de volver a salir.
- Mazo por tema sin repeticiones inmediatas y acción “Otra de este tema”.
- Estadísticas generales, barras por tema y ranking de temas a reforzar.
- Historial de las preguntas que más costaron, ordenado por cantidad de fallos.
- Persistencia local por materia y migración automática del progreso de la versión legacy.
- Atajos de teclado y modo de animación reducida.
- Efectos visuales y sonidos sintetizados para giro, selección y autoevaluación.
- Fallback en memoria cuando `localStorage` no está disponible.

## Requisitos y ejecución

- Node.js 20 o superior.
- npm.

```bash
npm install
npm run dev
```

La aplicación de desarrollo se sirve en <http://localhost:5290>.

Para comprobar la versión de producción:

```bash
npm run build
npm run preview
```

La vista previa se sirve en <http://localhost:4290>.

## Comandos

| Comando                       | Función                                                |
| ----------------------------- | ------------------------------------------------------ |
| `npm run dev`                 | Genera el contenido y levanta Vite.                    |
| `npm run build`               | Genera contenido, verifica TypeScript y crea `dist/`.  |
| `npm run preview`             | Sirve el build de producción.                          |
| `npm test`                    | Ejecuta las pruebas de unidad e integración.           |
| `npm run test:e2e`            | Ejecuta el flujo de humo con Playwright.               |
| `npm run lint`                | Comprueba ESLint, accesibilidad y límites entre capas. |
| `npm run typecheck`           | Comprueba TypeScript sin emitir archivos.              |
| `npm run format`              | Formatea el repositorio con Prettier.                  |
| `npm run content:check`       | Valida materias, temas, ids y notación.                |
| `npm run content:build`       | Genera los JSON que consume la aplicación.             |
| `npm run content:new-id -- …` | Sugiere un id libre para una pregunta.                 |

## Cómo agregar una materia

1. Creá `content/materias/<id>/materia.json` y la carpeta `temas/`. El `id` debe estar en
   kebab-case.
2. Declará en `materia.json` el nombre, la descripción, las áreas y los temas, en el mismo orden en
   que deben aparecer en la ruleta. Cada área define un color principal y uno suave en formato
   `#RRGGBB`.
3. Para cada tema, creá el Markdown indicado en su campo `archivo`. El frontmatter debe identificar
   el mismo tema:

   ```markdown
   ---
   tema: estructuras-lineales
   ---
   ```

4. Agregá al menos una pregunta a cada tema.
5. Ejecutá `npm run content:check` y `npm run content:build`.
6. Ejecutá `npm test` antes de publicar.

La materia `content/materias/ejemplo-sistema-solar/` es una referencia mínima completa.

## Cómo agregar una pregunta

Primero pedí un id estable:

```bash
npm run content:new-id -- <materia> <tema> [teorica|reflexion|votacion]
```

Después agregá al Markdown del tema un bloque con esta forma:

```markdown
## ¿Qué significa que un algoritmo sea estable?

<!-- id: t1.27 | tipo: teorica | etiqueta: Tomada en parciales -->

Una respuesta escrita en **Markdown**.
```

`etiqueta` y `nota` son opcionales. Las votaciones escriben sus opciones como una lista Markdown.
No se admite LaTeX ni delimitadores `$`; la notación matemática se escribe con Unicode.

Los ids se guardan explícitamente y no deben cambiarse: son la identidad con la que se asocia el
progreso del usuario. Modificar un id equivale a crear una pregunta nueva y dejar huérfana la marca
anterior.

## Arquitectura

```text
src/
├── domain/       lógica pura y estrategias de selección
├── infra/        contenido, almacenamiento y migraciones
├── features/     catálogo, ruleta, tarjeta, progreso y atajos
├── app/          rutas, pantallas, providers y composición
├── shared/ui/    componentes de presentación reutilizables
├── styles/       tokens globales y hoja cuadriculada
└── content/generated/  salida generada; no se edita
content/materias/       fuente de verdad de las materias
scripts/                validación y generación del contenido
tests/e2e/              flujo de humo en navegador
legacy/                 versión original conservada como referencia
```

Reglas principales:

- `domain/` no depende de React, DOM, almacenamiento ni azar global.
- `features/` sólo depende del dominio, de `shared/` y de su propia feature.
- `infra/` implementa repositorios y valida el contenido.
- Sólo `app/` conoce las implementaciones concretas y compone las dependencias.
- Los colores de una materia provienen de su `materia.json`, no de componentes React.

## Persistencia y compatibilidad

El progreso multi-materia se guarda bajo `ruleta-estudio:progreso:v2`. Al iniciar, la composición
intenta migrar el formato legacy `ruleta-pa:progreso:v1` a la materia `programacion-avanzada`. La
clave anterior sólo se elimina después de escribir y releer correctamente el formato nuevo. Si hay
un conflicto, se conserva un respaldo.

## Puntos de extensión

- **Nueva materia:** agregar únicamente su carpeta dentro de `content/materias/` y reconstruir el
  contenido.
- **Nuevo modo de estudio:** implementar otra `EstrategiaSeleccion` en `domain/seleccion/` e
  inyectarla desde `app/composition.ts`. Repetición espaciada puede añadir metadatos al estado de la
  estrategia sin acoplar la interfaz.
- **Sincronización entre dispositivos:** implementar `ProgresoRepositorio` con una API remota y
  seleccionarlo en la composición. La UI no necesita acceder directamente a red ni almacenamiento.

## Despliegue

`npm run build` produce un sitio estático en `dist/`. La elección y configuración del hosting se
mantienen separadas del código: antes de publicar hay que decidir si el proveedor soporta rewrites
de SPA. El proyecto usa actualmente `HashRouter`, compatible con hosting estático sin rewrites; si
se elige un proveedor con rewrites puede cambiarse a `BrowserRouter` y añadir la regla correspondiente.
