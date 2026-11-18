---
tema: cc-conceptos-avanzados
---

## ¿Qué significa que un algoritmo sea eficiente en teoría?
<!-- id: t8.11 | tipo: teorica -->

Que su tiempo crece como un polinomio en el tamaño de la entrada (n, n², n³…). No significa rápido sino que escala razonablemente: n³ puede ser lento en la práctica pero sigue siendo manejable. Lo que se quiere evitar son 2ⁿ, n! y similares.

## ¿Qué es la clase P?
<!-- id: t8.12 | tipo: teorica -->

El conjunto de problemas que se pueden resolver en tiempo polinomial: ordenar (MergeSort, O(n log n)), búsqueda binaria, camino mínimo con Dijkstra, detectar ciclos, entre otros. Estar en P es garantía de escalabilidad, no de simplicidad.

## ¿Qué significa NP y qué NO significa?
<!-- id: t8.13 | tipo: teorica -->

NP es Nondeterministic Polynomial time, no “No Polinomial”. Se trabaja con problemas de decisión (respuesta sí o no). Un problema está en NP si, dada una solución candidata, se puede **verificar** en tiempo polinomial. La pregunta no es si se resuelve rápido, sino si se chequea rápido.

## ¿Cuál es la diferencia entre resolver y verificar? Dar un ejemplo.
<!-- id: t8.14 | tipo: teorica -->

En Subset Sum (¿hay un subconjunto de tareas que sume exactamente el objetivo?), verificar una propuesta es sumarla: O(n). Resolver exige probar subconjuntos: O(2ⁿ). Con 12 tareas son 4096 subconjuntos; con 40, un billón, y verificar sigue costando una suma. Esa asimetría es la definición de NP.

## ¿Por qué P ⊆ NP? ¿Qué es el problema P vs NP?
<!-- id: t8.15 | tipo: teorica -->

Todo lo que se resuelve rápido también se verifica rápido: se resuelve y se compara. El problema abierto es si P = NP, es decir, si todo lo que se verifica rápido también se puede resolver rápido. La mayoría cree que P ≠ NP, pero no está demostrado; es uno de los Problemas del Milenio.

## ¿Qué es reducir un problema a otro?
<!-- id: t8.16 | tipo: teorica -->

Transformar cualquier instancia del problema A en una instancia del problema B, en tiempo polinomial, de modo que resolver B dé la respuesta de A. Es adaptar un problema nuevo al molde de uno que ya se sabe resolver. Ejemplo: armar horarios de exámenes se reduce a coloreo de grafos.

## ¿Para qué sirve reducir?
<!-- id: t8.17 | tipo: teorica -->

Para transferir dificultad. Si A se reduce a B y B es fácil (está en P), A también es fácil. Si A se reduce a B y A es difícil, B es al menos igual de difícil. El segundo uso es el más poderoso: permite demostrar que un problema es difícil sin buscar su algoritmo. Ejemplo: Partición se reduce a Sprint Justo tomando objetivo = suma total / 2 (si la suma es impar, la respuesta es directamente “no”).

## ¿Qué es un problema NP-completo y uno NP-difícil?
<!-- id: t8.18 | tipo: teorica -->

**NP-completo**: está en NP (se verifica rápido) y todo problema de NP se reduce a él en tiempo polinomial; son los más difíciles dentro de NP. **NP-difícil**: cumple solo la segunda condición, es al menos tan difícil como cualquiera de NP, pero puede no estar en NP. Un algoritmo polinomial para un solo NP-completo demostraría P = NP.

## ¿Qué establece el teorema de Cook-Levin?
<!-- id: t8.19 | tipo: teorica -->

Que SAT (¿existe una asignación de variables booleanas que haga verdadera una fórmula?) es NP-completo; fue el primero (Cook 1971, Levin de forma independiente). Lo importante es el método: todo problema de NP se reduce a SAT, y eso permitió clasificar miles de problemas por reducciones encadenadas.

## Nombrá problemas NP-completos y pares de problemas parecidos con dificultad distinta.
<!-- id: t8.20 | tipo: teorica -->

NP-completos: SAT y 3-SAT, 3-coloreo, Clique, Partición, Subset Sum (Sprint Justo), Mochila y TSP (en su versión de decisión). Todos están conectados por reducciones: si uno cayera en P, caerían todos. Pares parecidos: camino de Euler (P) vs ciclo de Hamilton (NP-completo); 2-coloreo vs 3-coloreo; 2-SAT vs 3-SAT; camino más corto (P) vs camino simple más largo (NP-difícil).

## ¿Qué es un algoritmo pseudopolinomial?
<!-- id: t8.21 | tipo: teorica -->

Uno polinomial en el **valor** numérico de la entrada pero no en su **tamaño** en bits. Subset Sum con PD es O(n · objetivo): con objetivo 40 no hay problema, con un objetivo de 30 dígitos es gigantesco. Como un número W ocupa log W bits, O(n · W) es exponencial en el tamaño de la entrada; por eso no contradice que el problema sea NP-completo.

## ¿Qué se hace ante un problema NP-completo?
<!-- id: t8.22 | tipo: teorica -->

Dejar de buscar un algoritmo exacto y eficiente para el caso general y elegir una alternativa:

| Estrategia | Garantía | Costo | Cuándo |
| --- | --- | --- | --- |
| Exactos (p. ej. backtracking) | Óptimo | Exponencial en el peor caso | Instancia chica o con estructura aprovechable |
| Aproximación | Dentro de un margen del óptimo | Polinomial | Se necesita garantía de calidad |
| Heurísticas | Ninguna en teoría | Variable | Problema grande, alcanza con una buena solución |

Si solo hay que chequear una solución ya armada, no hace falta ninguna: verificar está en P.

## ¿Qué ventajas y límites tiene el marco teórico de P y NP?
<!-- id: t8.23 | tipo: teorica -->

Ventajas: saber que un problema es NP-completo evita buscar algo que probablemente no existe y orienta la elección de alternativas; además comunica mucho de forma compacta. Límites: trabaja con el peor caso, y muchas instancias reales de un NP-completo se resuelven rápido; y la clasificación depende del modelo de cómputo. La teoría da el marco; el contexto determina la estrategia.

## Dar ejemplos de problemas donde verificar es fácil y resolver es difícil.
<!-- id: t8.24 | tipo: teorica -->

Sprint Justo: encontrar un subconjunto de tareas que sume exactamente el objetivo puede tardar muchísimo, pero verificar uno ya armado toma segundos. Sudoku: encontrar la solución completa puede tardar mucho; verificar un tablero ya completo, segundos. Mochila: encontrar qué objetos maximizan el valor es difícil; chequear si una combinación cumple peso y valor es inmediato. Esa asimetría es lo que define a NP.

## ¿Por qué importa distinguir P de NP si igual usamos heurísticas en la práctica?
<!-- id: r37656627cc | tipo: reflexion -->

Conocer la clase de un problema evita perder tiempo buscando soluciones exactas eficientes que probablemente no existen. También guía la elección de la estrategia alternativa más adecuada según el contexto.

## ¿Un problema difícil en teoría puede ser fácil en la práctica? ¿Cómo?
<!-- id: r6c5e96ff4e | tipo: reflexion -->

Sí. La teoría trabaja con el peor caso, pero muchas instancias reales tienen estructura que los algoritmos pueden aprovechar. Un problema NP-completo puede resolverse rápido en el 99% de los casos prácticos.

## Si P = NP, ¿qué pasaría con la criptografía moderna?
<!-- id: r3d5e6781c7 | tipo: reflexion -->

La seguridad de RSA y otros sistemas se basa en asumir que ciertos problemas son difíciles. Si P = NP, esos problemas serían resolubles eficientemente y la criptografía de clave pública colapsaría.

## Si mañana alguien encontrara un algoritmo polinomial para el Sprint Justo, ¿qué otros problemas caerían con él?
<!-- id: r0f83ef2154 | tipo: reflexion -->

Caerían todos los problemas NP-completos: como todos se reducen entre sí (directa o indirectamente), un algoritmo polinomial para uno solo se puede encadenar para resolver cualquier otro. En la práctica, eso significaría que P = NP.
