---
tema: da-programacion-dinamica-1
---

## ¿Qué problema resuelve la programación dinámica?
<!-- id: t11.1 | tipo: teorica -->

El de resolver muchas veces los mismos subproblemas. En Fibonacci recursivo, fib(30) hace 2.692.537 llamadas; si cada valor se anota la primera vez y se consulta después, alcanzan 29 sumas. Algunos problemas son difíciles solo porque los resolvemos mal.

## ¿Qué es la programación dinámica?
<!-- id: t11.2 | tipo: teorica -->

Una técnica que divide el problema en subproblemas más pequeños que se repiten, resuelve cada uno una sola vez, guarda su resultado y los combina para construir la solución completa. En un problema de optimización, esa solución es el óptimo global.

## ¿Qué condiciones debe cumplir un problema para aplicar PD?
<!-- id: t11.3 | tipo: teorica -->

**Subestructura óptima** (principio de optimalidad de Bellman): la solución óptima se arma con soluciones óptimas de subproblemas más chicos. **Subproblemas superpuestos**: al dividir recursivamente, el mismo subproblema aparece más de una vez. En el ladrón: robar(i) solo necesita robar(i - 1) y robar(i - 2), y robar(3) aparece en dos ramas del árbol.

## ¿Cómo se aplica la memoización (top-down)?
<!-- id: t11.4 | tipo: teorica -->

Se conserva la recursión y se agrega una memoria compartida por todas las llamadas: 1) agregar la memoria como parámetro; 2) definir la clave de cada subproblema; 3) al empezar, si la clave ya está en la memoria, devolver lo guardado; 4) antes de devolver un resultado calculado, guardarlo.

## ¿Cómo se aplica la tabulación (bottom-up)?
<!-- id: t11.5 | tipo: teorica -->

Se resuelven primero los subproblemas más chicos y se arman los grandes a partir de ellos, sin recursión: 1) ver de qué depende cada valor (grafo de dependencias); 2) decidir qué significa cada celda; 3) llenar la tabla en un orden donde las dependencias ya estén calculadas; 4) devolver la celda que responde el problema.

## ¿Qué diferencias hay entre top-down y bottom-up?
<!-- id: t11.6 | tipo: teorica -->

| Aspecto | Top-down (memoización) | Bottom-up (tabulación) |
| --- | --- | --- |
| Facilidad de implementación | ✅ | |
| Memoria con tabla densa | | ✅ |
| Memoria con tabla dispersa | ✅ | |
| Sin riesgo de stack overflow | | ✅ |
| Posibilidad de optimizar el espacio | | ✅ |
| Complejidad temporal | Igual | Igual |

Top-down parte de la recursión y solo calcula los subproblemas que se necesitan, por eso rinde mejor si la tabla es dispersa. Bottom-up no usa la pila de recursión y permite guardar solo las últimas celdas (FibSinTabla usa dos variables). En Fibonacci las dos son O(n): la ventaja concreta de bottom-up es que no se desborda la pila cuando n es muy grande.

## ¿Cuál es la receta de diseño de programación dinámica?
<!-- id: t11.7 | tipo: teorica -->

1\) **Subproblema**: qué calcula f(…) y qué parámetros necesita. 2) **Decisión**: qué opciones hay en el último paso, lo que da la recurrencia (max o min). 3) **Caso base**: qué subproblemas se responden sin recursión. 4) **Orden**: de qué depende cada valor, para memoizar o llenar la tabla. 5) **Respuesta**: qué valor resuelve el problema original. 6) **Complejidad**: cantidad de subproblemas × costo de decidir.

## ¿Cómo se resuelve el problema del ladrón de casas con PD?
<!-- id: t11.8 | tipo: teorica -->

Subproblema: robar(i) = máximo botín con las casas 0..i. Decisión sobre la casa i: robarla (casas[i] + robar(i - 2)) o no (robar(i - 1)); se toma el máximo. Casos base: robar(0) = casas[0], robar(1) = max(casas[0], casas[1]). En tabla: dp[i] = max(dp[i-1], dp[i-2] + casas[i-1]). Complejidad: n subproblemas × O(1) = O(n), contra O(2ⁿ) por fuerza bruta. Como cada celda usa solo las dos anteriores, el espacio baja a O(1) con dos variables.

## ¿Por qué no alcanza con una estrategia ávida en el ladrón de casas?
<!-- id: t11.9 | tipo: teorica -->

“Robar la casa más rica disponible y descartar sus vecinas” puede dar el máximo en un ejemplo, pero que funcione en un caso no prueba que funcione en cualquier calle. Para que greedy sea correcto hay que demostrar la propiedad de elección ávida.

## ¿Qué se rompe en el ladrón con casas en círculo y cómo se resuelve?
<!-- id: t11.10 | tipo: teorica -->

La recurrencia de la calle recta no sabe si se robó la casa 0, y en el círculo la primera y la última son vecinas: puede devolver una solución que las usa a ambas. Se resuelve partiendo en dos casos de calle recta: sin la casa 0 y sin la última, y se toma el máximo; sigue siendo O(n). Moraleja: si el subproblema no recuerda algo que se necesita, se parte en casos o se agrega un parámetro.

## ¿Cuándo la PD no aporta nada frente a la recursión directa?
<!-- id: t11.11 | tipo: teorica -->

Cuando los subproblemas no se repiten. En MergeSort las dos mitades nunca comparten subproblemas: memoizar no ahorra nada y división y conquista es suficiente.

## ¿Qué calcula Floyd y cómo se plantea como PD?
<!-- id: t11.12 | tipo: teorica -->

El camino mínimo entre todo par de nodos de un grafo ponderado. Subproblema: dist(i, j, k) = mínima distancia de i a j usando solo nodos {1..k} como intermediarios. Recurrencia: dist(i, j, k) = min(dist(i, j, k-1), dist(i, k, k-1) + dist(k, j, k-1)), es decir, ver si pasar por k mejora el camino conocido. Se llena de k = 0 a k = n (bottom-up natural) y la respuesta es toda la tabla para k = n. Tiene tres bucles anidados sobre los V vértices: O(V³).

## ¿Qué calcula Warshall?
<!-- id: t11.13 | tipo: teorica -->

La clausura transitiva: para cada par de nodos, si existe algún camino entre ellos. Subproblema: C(i, j, k) = ¿existe camino de i a j usando solo nodos {1..k} como intermediarios? Se llena igual que Floyd, de k = 0 a k = n.

## ¿Por qué Floyd-Warshall es programación dinámica y no “un algoritmo de grafos” más?
<!-- id: t11.14 | tipo: teorica -->

Porque cumple las dos condiciones: subestructura óptima (si el camino mínimo de i a j pasa por k, los tramos i→k y k→j también son mínimos) y superposición (cada dist(i, k, k - 1) se reutiliza para toda una fila de celdas). Aunque la tabla tiene tres índices, se guarda en una sola matriz de n × n: durante la iteración k, la fila y la columna k no cambian.

## ¿Cómo se resuelve el cambio con mínima cantidad de monedas con PD?
<!-- id: t11.15 | tipo: teorica -->

Subproblema: m(x) = mínima cantidad de monedas para pagar exactamente x. Decisión, ¿cuál es la última moneda?: m(x) = 1 + min{ m(x - d) : d ∈ D, d ≤ x }. Caso base: m(0) = 0, y ∞ si ninguna moneda da un valor finito. Orden: x = 0, 1, …, M. Respuesta: m(M) (∞ significa que no se puede pagar). Complejidad: O(M · k) en tiempo y O(M) en espacio. Con D = {1, 3, 4} y M = 6, greedy da 3 monedas (4 + 1 + 1) y PD da 2 (3 + 3).

## ¿En qué se diferencia la PD de división y conquista y de greedy?
<!-- id: t11.16 | tipo: teorica -->

Con división y conquista comparte dividir en subproblemas y resolverlos recursivamente, pero en DyC los subproblemas son disjuntos y en PD se solapan, por eso PD guarda resultados. Con greedy comparte la subestructura óptima, pero greedy toma una sola decisión irrevocable por paso, mientras que PD evalúa todas las opciones de cada subproblema y elige la mejor, por eso garantiza el óptimo sin necesitar la propiedad de elección ávida.

## ¿Puede resolverse un Sudoku con Programación Dinámica?
<!-- id: r02c8d13d50 | tipo: reflexion -->

No directamente, porque el Sudoku no tiene subestructura óptima clara ni subproblemas bien definidos que se reutilicen. Es un problema de satisfacción de restricciones que se aborda mejor con backtracking.

## ¿En qué se parece Top-Down a División y Conquista? ¿En qué se diferencia fundamentalmente?
<!-- id: r3a01376d6c | tipo: reflexion -->

Ambos dividen el problema en subproblemas y los resuelven recursivamente. La diferencia es que en DyC los subproblemas son disjuntos, mientras que en PD se solapan y por eso es necesario memorizar los resultados.

## se resuelve un problema de maximización con branch and bound y la mejor solución encontrada vale 50. ¿Cuándo se puede podar un nodo?
<!-- id: r36d63ae005 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) Cuando el valor acumulado hasta ese nodo es menor que 50.
- B) Cuando la cota superior de lo que se puede lograr desde ese nodo es 50 o menos.
- C) Cuando la cota inferior de lo que se puede lograr desde ese nodo es menor que 50.
- D) Cuando el nodo está más profundo que el de la mejor solución encontrada.

B. Se poda cuando ni en el escenario más favorable (la cota superior) se puede superar la mejor solución conocida. El valor acumulado no alcanza para decidir, porque lo que falta decidir todavía puede sumar.

## si Fib pudiera anotar cada valor la primera vez que lo calcula y consultarlo después, ¿cuántas sumas haría para calcular fib(30)?
<!-- id: r1f6dfbff34 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) Unas 2,7 millones.
- B) Unas 1,3 millones.
- C) 29.
- D) 435.

C. 29, porque cada valor de fib(2) a fib(30) necesita exactamente una suma y se calcula una sola vez. Sin anotar, fib(30) hace 2.692.537 llamadas.

## en la calle del disparador, “robo la casa más rica disponible y descarto sus vecinas” da 25, que es el máximo. ¿Qué podemos concluir?
<!-- id: rfcd91b7548 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) Que es correcta en cualquier calle.
- B) Nada todavía.
- C) Que conviene empezar por la casa más pobre.
- D) Que falla solo en calles cortas.

B. Nada todavía: que funcione en un ejemplo no prueba que funcione en cualquier calle. Para confiar en un greedy hay que demostrar la propiedad de elección ávida.

## memoización y tabulación son las dos O(n) para Fibonacci. ¿Qué ventaja concreta tiene bottom-up?
<!-- id: r7394aa270d | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) Es asintóticamente más rápida.
- B) Calcula menos subproblemas.
- C) No usa la pila de recursión, así que no se desborda cuando n es muy grande.
- D) No necesita casos base.

C. No usa la pila de recursión. Las dos tienen la misma complejidad temporal y calculan los mismos subproblemas, y la tabla igual necesita sus casos base.

## con n casas, ¿cuántos subproblemas distintos hay que resolver para calcular robar(n − 1)?
<!-- id: rb739c550f7 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) 2ⁿ.
- B) n².
- C) n.
- D) n/2.

C. n: uno por cada casa, de robar(0) a robar(n − 1), aunque el árbol de recursión los repita. Por eso la PD queda en n subproblemas × O(1) = O(n).

## ¿en cuál de estos problemas la PD no aporta nada frente a la recursión directa?
<!-- id: rc42beb39e3 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) Fibonacci.
- B) Ordenar con MergeSort.
- C) Camino mínimo en un mapa.
- D) El ladrón con mil casas.

B. MergeSort, porque las dos mitades nunca comparten subproblemas: no hay nada repetido para guardar.

## en la calle circular, robar(i) no sabe si se robó la casa 0. ¿Cómo lo resolvemos?
<!-- id: rc820028876 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) Resolver dos calles rectas, una sin la primera casa y otra sin la última, y quedarse con la mejor.
- B) Resolver la calle recta y sacar la más barata de las dos puntas si usa ambas.
- C) Pegar dos copias de la calle.
- D) Cambiar solo la última celda.

A. Se parte en dos casos de calle recta y se toma el máximo. Moraleja: si el subproblema no recuerda algo que se necesita, se parte en casos o se agrega un parámetro.

## durante la iteración k de Floyd, ¿qué pasa con los valores de la fila k y la columna k?
<!-- id: rc12bfe243e | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) No cambian.
- B) Son las que más cambian.
- C) Pueden cambiar, así que hay que copiar la matriz.
- D) Solo cambian las que valen ∞.

A. No cambian: ir de i a k pasando por k cuesta C[i][k] + C[k][k] = C[i][k] + 0. Por eso Floyd puede trabajar sobre una sola matriz de n × n.

## con monedas {1, 3, 4} y la tabla llena hasta x = 5 (m = 0, 1, 2, 1, 1, 2), ¿qué cuenta llena m(6)?
<!-- id: r1ab2c14d48 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) 1 + m(2).
- B) 1 + min(m(5), m(3), m(2)).
- C) min(m(5), m(3), m(2)).
- D) 1 + m(5).

B. Se prueba cada moneda como la última y se suma esa moneda: 1 + min(2, 1, 2) = 2 (dos monedas de 3). La A es la elección greedy y da 3.
