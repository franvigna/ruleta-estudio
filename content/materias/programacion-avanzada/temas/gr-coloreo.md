---
tema: gr-coloreo
---

## ¿Qué problema modela el coloreo de grafos y dónde aparece?
<!-- id: t8.1 | tipo: teorica -->

Problemas de asignación con restricciones: cada vértice es una entidad a clasificar y cada arista una incompatibilidad entre dos entidades. Aparece en el scheduling de exámenes (materias con alumnos en común), la asignación de registros en compiladores (variables que se usan a la vez) y las frecuencias de radio (antenas cercanas). La pregunta es cuál es la mínima cantidad de categorías para repartir elementos en conflicto.

## ¿Qué es colorear un grafo y qué es el número cromático?
<!-- id: t8.2 | tipo: teorica -->

Colorear es asignar un color a cada vértice de modo que dos adyacentes nunca tengan el mismo color, minimizando la cantidad de colores. El **número cromático C(G)** es la mínima cantidad de colores necesaria. Cualquier coloreo válido usa c(G) colores (minúscula), no necesariamente mínimo: c(G) ≥ C(G).

## ¿Cuánto cuesta colorear por fuerza bruta?
<!-- id: t8.3 | tipo: teorica -->

Para un k fijo hay kⁿ asignaciones (cada uno de los n vértices elige uno de k colores), y en el peor caso hay que probar k de 1 a n: Σ kⁿ ≤ n · nⁿ. Con k = 3 y 50 vértices serían unos 23 millones de años a mil millones de asignaciones por segundo.

## ¿Por qué el coloreo óptimo es NP-completo y qué se hace en la práctica?
<!-- id: t8.4 | tipo: teorica -->

Verificar un coloreo es fácil: se revisa cada arista en tiempo polinomial. Pero encontrar el de mínima cantidad de colores no tiene algoritmo eficiente conocido. En la práctica se usan heurísticas: buscan una solución buena en tiempo polinomial, aunque no siempre la óptima.

## ¿Cómo funciona el coloreo secuencial (greedy)?
<!-- id: t8.5 | tipo: teorica -->

Recorre los vértices en un orden y le asigna a cada uno el menor color que no use ninguno de sus vecinos ya coloreados. En el secuencial el orden es el original, sin reordenar. Es O(V + E), el más simple, pero el más sensible al orden de entrada.

## ¿Cómo funciona Welsh-Powell y por qué tiende a dar mejores resultados?
<!-- id: t8.6 | tipo: teorica | etiqueta: Tomada en parciales -->

Ordena los vértices por grado decreciente y aplica el mismo coloreo greedy. Procesar primero los vértices más conectados, que son los más restrictivos, reduce los conflictos futuros desde el inicio; por eso tiene la mayor probabilidad de acercarse a C(G). Cuesta O(V log V + E): el ordenamiento domina sobre el coloreo O(V + E).

## ¿Cómo funciona Matula y en qué se diferencia de Welsh-Powell?
<!-- id: t8.7 | tipo: teorica -->

Ordena por grado creciente. La complejidad es la misma, O(V log V + E); cambia la estrategia: procesar primero los menos conectados da más libertad inicial pero genera más conflictos al llegar a los de alto grado. En la práctica tiende a dar peores resultados que Welsh-Powell.

## ¿Alguna de estas heurísticas garantiza el número cromático?
<!-- id: t8.8 | tipo: teorica -->

No. Ninguna garantiza C(G); solo aproximan. Las tres son polinomiales y el resultado depende del orden (incluso del desempate entre vértices de igual grado).

| | Secuencial | Welsh-Powell | Matula |
| --- | --- | --- | --- |
| Orden | Arbitrario | Grado decreciente | Grado creciente |
| Complejidad | O(V + E) | O(V log V + E) | O(V log V + E) |
| ¿Garantiza C(G)? | No | No | No |

En el peor caso, con grafos densos, el coloreo greedy puede llegar a O(V²).

## ¿Cuál es el número cromático de algunas familias de grafos?
<!-- id: t8.9 | tipo: teorica -->

Grafo sin aristas (no conexo, vértices aislados): 1. Lineal: 2. Ciclo: 2 si es par, 3 si es impar. Estrella: 2. Completo Kₖ: k. n-partito completo: n. Planar: C(G) ≤ 4 por el Teorema de los Cuatro Colores.

## ¿Cómo se modela un problema de horarios como coloreo y qué indica cada elemento?
<!-- id: t8.10 | tipo: teorica | etiqueta: Tomada en parciales -->

Cada materia o conferencia es un vértice; dos que no pueden coincidir (por compartir alumnos o asistentes) se unen con una arista; cada color es una franja horaria o sesión. La cantidad de colores es la cantidad de sesiones necesarias, y la cantidad de vértices con un mismo color indica cuántas salas simultáneas hacen falta en esa sesión. Se resuelve con una heurística como Welsh-Powell, O(V log V + E).

## ¿Puede un algoritmo greedy encontrar el C(G) exacto? ¿Siempre? ¿Nunca?
<!-- id: r64b358e879 | tipo: reflexion -->

Sí puede, pero solo por coincidencia: depende del orden de los vértices y de la estructura del grafo. No hay garantía de que lo haga en el caso general.

## Si el grafo fuera planar, ¿necesitamos seguir usando heurísticas?
<!-- id: ra343c77ae1 | tipo: reflexion -->

Para grafos planares, el Teorema de los Cuatro Colores garantiza que C(G) ≤ 4, así que la cota superior es conocida. Sin embargo, encontrar el coloreo mínimo exacto dentro de ese límite sigue siendo NP-completo.

## ¿En qué se parece el coloreo al scheduling de exámenes de esta facultad?
<!-- id: r58ed99017d | tipo: reflexion -->

Cada materia es un vértice y cada conflicto entre materias es una arista; los colores son las franjas horarias disponibles. Minimizar colores equivale a minimizar la duración del período de exámenes.

## ¿Qué es el clique de un grafo y cómo afecta al número cromático?
<!-- id: r8327a91d44 | tipo: reflexion -->

Un clique es un subgrafo completo: todos sus vértices están conectados entre sí. Si el clique más grande tiene tamaño k, entonces C(G) ≥ k, porque esos vértices necesitan colores distintos obligatoriamente.

## ¿Qué pasaría si aplicaras Welsh-Powell dos veces con desempates distintos? ¿Obtendrías siempre el mismo resultado?
<!-- id: rfe31ae56b8 | tipo: reflexion -->

No necesariamente. El orden en que se resuelven los empates de grado puede llevar a coloreos distintos con diferente cantidad de colores. Esa variabilidad es justamente lo que se estudia con distribuciones de probabilidad en la comparativa
