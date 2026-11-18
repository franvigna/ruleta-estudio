# Ruleta de Estudio: migración a un proyecto genérico en React + TypeScript

## Contexto

En `legacy/` hay una app que ya funciona: una ruleta de estudio hecha solo para la materia **Programación Avanzada** (UNLaM). La ruleta sortea uno de los 18 temas de la materia y muestra una tarjeta con una pregunta al azar de ese tema. La tarjeta se da vuelta para ver la respuesta, y el usuario la marca como "Me la sabía" o "No me la sabía". El progreso se guarda en `localStorage` y hay estadísticas por tema.

Archivos de `legacy/`:

- `ruleta-publicada.html`: la app completa en un solo archivo. Es la referencia de comportamiento y de diseño visual.
- `template.html`: el mismo HTML con el marcador `__DATA__`.
- `build_data.py`: parsea los dos Markdown, asigna cada pregunta a un tema (con reglas propias de esta materia), arma las respuestas que faltan y genera `data.json`.
- `data.json`: salida actual (331 preguntas, 18 temas). Es la referencia de datos.
- `preguntas_teoricas.md` y `preguntas_para_reflexionar.md`: el contenido original.

## Objetivo

Convertirlo en **Ruleta de Estudio**, una app genérica y multi-materia en React + TypeScript. Programación Avanzada pasa a ser una materia más dentro de un catálogo, y agregar una materia nueva tiene que requerir solo contenido, sin código.

El proyecto tiene que ser mantenible, modular, con bajo acoplamiento y alta cohesión, y fácil de extender con funcionalidades nuevas. Se despliega en un hosting gratuito como sitio estático.

Antes de escribir código, leé completos todos los archivos de `legacy/` y contame qué entendiste.

## Reglas que no se negocian

1. **El texto no cambia.** Las preguntas y respuestas de Programación Avanzada se reorganizan al formato nuevo, pero su texto queda idéntico.
2. **El progreso actual no se pierde.**
   - Hoy se guarda en `localStorage` bajo la clave `ruleta-pa:progreso:v1`, con formato `{"r": {"<id>": "si" | "no"}}`.
   - Ids actuales de las preguntas teóricas: `"t" + número` (ej. `t7.2`).
   - Ids actuales de las preguntas para pensar: `"r" + md5(textoDeLaPregunta).hex[0:10]`. El texto es el encabezado `####` sin el número inicial.
   - En el formato nuevo esos ids quedan **escritos explícitamente** en el contenido.
   - Al iniciar, la app migra automáticamente el progreso v1 al esquema nuevo, dentro de la materia `programacion-avanzada`, y borra la clave vieja recién cuando la migración salió bien.
3. **Prueba de aceptación de datos.** Lo que se genera para Programación Avanzada tiene que ser equivalente a `legacy/data.json`: mismos ids, mismo tema asignado y mismo texto. Escribí un test que lo compare.
4. **Notación y diseño.**
   - Nada de LaTeX ni `$`: la notación matemática va con Unicode.
   - Tema claro únicamente, sin modo oscuro.
   - Se mantiene el diseño visual del legacy: hoja cuadriculada, Bricolage Grotesque y Atkinson Hyperlegible, botones con sombra dura y tarjeta tipo ficha.
5. **Trabajo por fases.**
   - Al terminar cada fase: corré lint, typecheck y tests, mostrame la salida y hacé un commit con Conventional Commits.
   - No avances con algo en rojo y esperá mi OK entre fases.
   - Si encontrás una diferencia de comportamiento con el legacy, avisame; no la "corrijas" por tu cuenta.

## Stack

- **Base:** Vite, React 18 y TypeScript en modo `strict`.
- **Rutas:** React Router.
- **Estilos:** CSS Modules más un `tokens.css` global con las variables de diseño. Sin librerías de componentes.
- **Estado:** el de React (`useReducer` y Context). No hace falta Redux ni Zustand con esta escala.
- **Datos:** `zod` para validar el contenido en el build; `marked` para convertir Markdown a HTML en el build, no en el navegador; `gray-matter` para el frontmatter.
- **Tests:** Vitest y React Testing Library para unidad e integración; Playwright para un smoke test end-to-end.
- **Calidad:** ESLint (typescript-eslint, react-hooks, jsx-a11y) y Prettier.
- **Entorno:** Node 20 o más, npm.

## Modelo de contenido (genérico)

Cada materia es una carpeta. Para agregar una materia nueva alcanza con crear su carpeta y correr el build.

```
content/
└── materias/
    └── programacion-avanzada/
        ├── materia.json
        └── temas/
            ├── cc-fundamentos.md
            ├── da-recursividad.md
            └── ...                      # un archivo por tema
```

**`materia.json`** se valida con zod y contiene:

- `id`, `nombre` y `descripcion` de la materia.
- `areas`: lista de `{ id, nombre, color, colorSuave }`. En esta materia son CC, DA, GR y TDA, con los colores del legacy.
- `temas`: lista de `{ id, nombre, etiquetaCorta, area, archivo }`, en el orden en que aparecen en la ruleta.

**Archivo de tema:** un Markdown con frontmatter `tema: <id>`. Cada pregunta es un bloque:

```markdown
## ¿Qué significa que un algoritmo sea estable?
<!-- id: t1.27 | tipo: teorica | etiqueta: Tomada en parciales -->

Respuesta en Markdown (párrafos, listas, tablas).
```

- `tipo` es `teorica`, `reflexion` o `votacion`.
- `etiqueta` y `nota` son opcionales. La nota es el aviso de "respuesta armada con la teoría".
- El `id` es obligatorio y único dentro de la materia.
- Las votaciones guardan sus opciones como lista dentro de la pregunta.
- Hacé un script `npm run content:check` que valide todo (ids únicos, temas existentes, archivos referenciados) y falle con mensajes claros.
- Hacé un script `npm run content:new-id` que sugiera un id libre para una pregunta nueva.

**Migración única.** `scripts/migrate-legacy.ts` lee `legacy/` y escribe `content/materias/programacion-avanzada/`, replicando exactamente lo que hace `build_data.py`:

- el mapeo de cada pregunta a su tema;
- las respuestas armadas (los diccionarios `COMPOSED` y DyC);
- las votaciones con sus opciones;
- las etiquetas.

Después de correrlo una vez, el contenido de `content/` pasa a ser la fuente de verdad y la lógica específica de esta materia queda fuera del código de la app.

**Build de contenido.** `scripts/build-content.ts` genera:

- un JSON por materia en `src/content/generated/<materia>.json`;
- un índice liviano `src/content/generated/catalogo.json` con id, nombre, cantidad de temas y cantidad de preguntas.

`npm run build` corre esto primero. Las materias se cargan con `import()` dinámico (una por chunk), así el bundle no crece con cada materia nueva.

## Arquitectura

```
src/
├── domain/                 # lógica pura: sin React, sin DOM, sin localStorage, sin Math.random directo
│   ├── types.ts            # Materia, Area, Tema, Pregunta, Marca ('si' | 'no'), Progreso
│   ├── seleccion/
│   │   ├── estrategia.ts   # interfaz EstrategiaSeleccion (punto de extensión, p. ej. repetición espaciada a futuro)
│   │   └── azar-pendientes.ts   # la estrategia actual
│   ├── mazo.ts             # mazo por tema: pendientes, mezcla, no repetir la anterior
│   ├── progreso.ts         # marcar, reiniciar, limpiar ids huérfanos
│   ├── estadisticas.ts     # por tema, resumen general, ranking de temas a reforzar
│   ├── ruleta-math.ts      # ángulos, segmento bajo el puntero, rotación final, easing
│   └── random.ts           # type Rng = () => number, inyectable
├── infra/
│   ├── progreso-repo.ts    # interfaz ProgresoRepositorio { cargar(materiaId), guardar(materiaId, p), reiniciar(materiaId) }
│   ├── local-storage-repo.ts   # clave 'ruleta-estudio:progreso:v2', un registro por materia
│   ├── migraciones.ts      # v1 (ruleta-pa) → v2, con tests
│   ├── memory-repo.ts      # tests y fallback si localStorage falla
│   └── contenido-repo.ts   # carga el catálogo y cada materia (import dinámico) y la valida con zod
├── features/               # cada feature agrupa sus componentes, hooks y estilos
│   ├── catalogo/           # pantalla de inicio: lista de materias con su % de avance
│   ├── ruleta/             # <Ruleta/> en SVG y useGiro() (animación con requestAnimationFrame, tic, reduced motion)
│   ├── tarjeta/            # <Tarjeta/> con flip, etiquetas y <BotonesMarca/>
│   ├── progreso/           # <PanelProgreso/>, <BarraTema/>, <TemasAReforzar/>, <BotonReiniciar/> con doble confirmación
│   └── atajos/             # useAtajosTeclado()
├── app/
│   ├── providers/          # ProgresoProvider (recibe el repositorio por props: inyección de dependencias)
│   ├── routes.tsx          # '/' catálogo, '/materia/:id' ruleta, '/materia/:id/progreso'
│   ├── composition.ts      # único lugar donde se instancian los repositorios concretos
│   └── App.tsx
├── shared/ui/              # Boton, Chip, Kbd y otros componentes de presentación sin lógica de negocio
├── styles/                 # tokens.css (colores, tipografías, sombras), base.css (cuadrícula, reset)
└── content/generated/      # generado; no se edita a mano
scripts/                    # migrate-legacy.ts, build-content.ts, content-check.ts, content-new-id.ts
tests/e2e/                  # Playwright
legacy/                     # se conserva como referencia
```

### Reglas de dependencia

Hacelas cumplir con `eslint-plugin-boundaries` o con `no-restricted-imports`:

- `domain/` no importa nada del resto del proyecto ni de React.
- `features/` dependen de `domain/` y de `shared/`. Una feature no importa archivos internos de otra; si necesita algo, se sube a `domain/` o a `shared/`.
- `infra/` implementa interfaces; la UI nunca toca `localStorage` directamente.
- `app/` es el único lugar que conoce las implementaciones concretas.
- Los colores de área llegan desde `materia.json` como variables CSS. Nada de colores de una materia hardcodeados en componentes.

### Comportamiento a preservar (verificalo contra el legacy)

- **Selección de tema:** se sortea al azar entre los temas con preguntas pendientes. Un tema completo se ve atenuado y no se sortea. Si no queda ninguno, aparece el mensaje de "te sabés todas".
- **Giro:** unos 5,2 s, con easing `1 - (1 - u)^4`, entre 5 y 7 vueltas. Cae en el centro del segmento con un desvío al azar de hasta ±30 % del ancho. El puntero hace un tic al pasar cada segmento. Con `prefers-reduced-motion` es una sola vuelta de 700 ms y sin tic.
- **Etiquetas en la rueda:** las del semicírculo izquierdo se rotan 180° para que se lean al derecho.
- **Pendientes:** una pregunta está pendiente si no está marcada como "si". Las "no" siguen en el mazo y muestran la etiqueta "Para repasar".
- **Marcado:** los botones aparecen recién después de dar vuelta la tarjeta, y la marca se puede corregir.
- **"Otra de este tema":** saca otra pregunta del mismo mazo sin girar.
- **Atajos:** Espacio o Enter giran (salvo con un botón enfocado), V da vuelta la tarjeta, S marca "me la sabía" y N "no me la sabía".
- **Temas a reforzar:** solo temas con al menos una "no". Se ordenan por tasa de error `no / (si + no)` de mayor a menor; desempata la cantidad de "no" (más primero) y después el porcentaje sabido (menos primero). Se muestran los 3 primeros.
- **Fallo de `localStorage`:** se avisa que el progreso no se guarda y la app sigue andando con el repositorio en memoria.
- **Layout:** en desktop la tarjeta queda centrada verticalmente al lado de la ruleta; en mobile van una debajo de la otra.
- **Accesibilidad:** la tarjeta es `role="button"` con `aria-pressed`; la cara oculta lleva `aria-hidden`; el resultado es `aria-live="polite"`. Pasá jsx-a11y sin desactivar reglas.

## Fases

**Fase 1: andamiaje.**
- Vite + React + TS, ESLint (con las reglas de dependencia), Prettier, Vitest, RTL, Playwright.
- Scripts `dev`, `build`, `preview`, `test`, `test:e2e`, `lint`, `typecheck`, `format`, `content:build`, `content:check` y `content:new-id`.
- `.editorconfig`, `.gitignore` y `.nvmrc`.

**Fase 2: contenido.**
- Esquemas zod y `migrate-legacy.ts`; corrélo y commiteá `content/`.
- `build-content.ts`, `content-check.ts` y `content-new-id.ts`.
- Test de equivalencia contra `legacy/data.json`.
- Agregá una segunda materia de ejemplo, chica (dos temas, cuatro preguntas), para probar que el sistema es realmente genérico. Marcala como ejemplo en el catálogo.

**Fase 3: dominio.**
- Implementá `mazo`, `progreso`, `estadisticas`, `ruleta-math` y la estrategia de selección.
- Tests unitarios de cada regla de comportamiento, con rng fijo. Cubrí tema completo, mazo vacío, ranking con empates e ids huérfanos.
- Cobertura del dominio de 90 % o más.

**Fase 4: infra.**
- Repositorios, `migraciones.ts` con tests (incluido el caso de v1 a v2 con el formato real del legacy) y el caso de `localStorage` que lanza excepción.
- Carga de contenido con validación.

**Fase 5: UI.**
- Features, rutas, providers y composición.
- Tests de integración con RTL: girar, voltear, marcar y reiniciar con doble confirmación.
- Comparalo visualmente con `legacy/ruleta-publicada.html` en desktop y en un viewport de 390 px.

**Fase 6: entrega.**
- **Smoke test e2e con Playwright:** elegir la materia, girar, voltear, marcar, recargar y verificar que el progreso persiste.
- **CI en GitHub Actions:** install, lint, typecheck, test y build.
- **Hosting:** preguntame cuál uso antes de configurarlo.
  - Si no soporta reescrituras para una SPA, usá `HashRouter`.
  - Si las soporta, usá `BrowserRouter` y agregá el archivo de rewrites que corresponda (`_redirects`, `vercel.json` o similar).
  - Ajustá `base` en Vite si el sitio no queda en la raíz.
- **README:**
  - qué es y cómo correrlo;
  - **cómo agregar una materia** y cómo agregar preguntas, paso a paso;
  - la arquitectura y sus reglas de dependencia;
  - por qué los ids son explícitos y no se cambian.
- **`CLAUDE.md`** con las convenciones de este proyecto:
  - reglas de dependencia;
  - el contenido no se modifica sin pedido explícito;
  - ids estables y migraciones de storage versionadas;
  - tema claro únicamente y sin LaTeX;
  - toda funcionalidad nueva entra por una feature o por una estrategia del dominio.

## Qué espero al final

- Un resumen de cada fase.
- La salida de los tests.
- Las diferencias que hayas detectado frente al legacy.
- La lista de commits.
- Una sección corta de **puntos de extensión** con cómo agregarías: una materia, un modo de estudio nuevo (por ejemplo, repetición espaciada como otra `EstrategiaSeleccion`) y sincronización del progreso entre dispositivos (otra implementación de `ProgresoRepositorio`).
