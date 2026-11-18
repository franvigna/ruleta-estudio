---
tema: da-programacion-dinamica-2
---

## ¿Para qué sirve la programación dinámica? ¿Cuándo se utiliza? Dar un ejemplo resuelto bottom-up.
<!-- id: t12.1 | tipo: teorica | etiqueta: Tomada en parciales -->

Sirve para resolver problemas de optimización (o de conteo) cuyos subproblemas se repiten, calculando cada uno una sola vez. Se utiliza cuando el problema tiene subestructura óptima y subproblemas superpuestos. Ejemplo bottom-up, mochila con V = {200, 300, 150}, W = {3, 3, 1}, capacidad 4: se arma una tabla de objetos × capacidades (0 a 4), la fila 0 en ceros, y cada celda vale max(no tomar el objeto, su valor + la celda de la fila anterior con la capacidad menos su peso), si entra. La última celda da 450 (laptop + guitarra).

## ¿Qué agrega la versión 2 de la receta de PD?
<!-- id: t12.2 | tipo: teorica -->

Pensar el problema como tabla: 1) qué significa la celda (i, j); 2) decisión o recurrencia, mirando qué opciones tiene el último elemento; 3) caso base, normalmente la fila 0 y la columna 0; 4) orden de llenado, que lo dicta el grafo de dependencias; 5) respuesta: qué celda leer y cómo reconstruir la solución; 6) complejidad: celdas × trabajo por celda.

## ¿Qué es una subsecuencia y qué es la LCS?
<!-- id: t12.3 | tipo: teorica -->

Una subsecuencia se obtiene borrando caracteres sin cambiar el orden de los que quedan (no tienen que ser contiguos). La LCS es la subsecuencia común más larga entre dos cadenas. Por fuerza bruta habría que probar las 2ⁿ subsecuencias de una de ellas.

## ¿Cuál es la recurrencia de LCS?
<!-- id: t12.4 | tipo: teorica -->

lcs(i, j) = largo de la LCS entre los primeros i caracteres de A y los primeros j de B. Vale 0 si i = 0 o j = 0; si A[i] = B[j], lcs(i - 1, j - 1) + 1; si no, max(lcs(i - 1, j), lcs(i, j - 1)). Se llena fila por fila, de izquierda a derecha, así las tres celdas de las que depende ya están calculadas. Complejidad O(n · m).

## ¿Cómo se reconstruye la subsecuencia en LCS?
<!-- id: t12.5 | tipo: teorica -->

Desde la celda inferior derecha hacia atrás: si A[i] = B[j], ese carácter es parte de la LCS, se anota y se mueve en diagonal; si no, se mueve hacia arriba si lcs(i - 1, j) ≥ lcs(i, j - 1), y si no hacia la izquierda. El valor está en la última celda; la solución, en el camino de vuelta.

## ¿Qué es la “PD sobre prefijos”?
<!-- id: t12.6 | tipo: teorica -->

Un patrón general de PD con tabla 2D: el subproblema es un par de prefijos (i, j); la tabla tiene (n + 1) · (m + 1) celdas con la fila 0 y la columna 0 como casos base; cada celda depende de vecinas ya calculadas; el valor está en la última celda y la solución se reconstruye volviendo. LCS y distancia de edición lo siguen.

## ¿Qué es la distancia de edición y cuál es su recurrencia?
<!-- id: t12.7 | tipo: teorica -->

El mínimo número de inserciones, borrados y sustituciones (costo 1 cada una) para transformar word1 en word2 (distancia de Levenshtein). edit(i, j) vale j si i = 0 y i si j = 0; si w1[i] = w2[j], edit(i - 1, j - 1); si no, 1 + min(edit(i - 1, j) borrar, edit(i, j - 1) insertar, edit(i - 1, j - 1) sustituir). Se llena fila por fila; respuesta edit(n, m); O(n · m) en tiempo y espacio.

## ¿Qué cambia entre LCS y distancia de edición? ¿Cómo se reconstruyen los cambios?
<!-- id: t12.8 | tipo: teorica -->

La estructura es casi idéntica; cambian la decisión (tres opciones y mínimo, en vez de máximo) y el caso base (la fila y columna 0 valen i o j, no 0). Para reconstruir, desde la última celda: si los caracteres coinciden, no hay operación y se mueve en diagonal; si el mínimo vino de (i - 1, j - 1) fue sustitución; de (i - 1, j), borrado; de (i, j - 1), inserción.

## ¿Qué es la mochila 0/1 y por qué no se resuelve con greedy?
<!-- id: t12.9 | tipo: teorica -->

Hay n objetos con valor y peso, y una capacidad W; cada objeto se lleva entero o no se lleva, y se maximiza el valor total sin exceder W. Greedy por valor/peso falla porque no se puede fraccionar y una elección localmente buena puede desperdiciar capacidad: con V = {60, 100, 120}, W = {10, 20, 30} y capacidad 50, greedy da 160 y el óptimo es 220.

## ¿Cuál es el subproblema y la recurrencia de la mochila 0/1?
<!-- id: t12.10 | tipo: teorica -->

Top-down: r(w, i) = máximo valor con capacidad w usando los objetos i…n-1. Vale 0 si i = n; r(w, i + 1) si el objeto i no entra (W[i] > w); y si entra, max(r(w, i + 1) no tomarlo, V[i] + r(w - W[i], i + 1) tomarlo). En tabla: t(i, j) = max(t(i - 1, j), V(i) + t(i - 1, j - W(i))) si W(i) ≤ j, y t(i - 1, j) si no. Cada fila agrega un objeto, cada columna es una capacidad y la celda es la mayor ganancia.

## ¿Por qué hace falta el caso “no entra” en la recurrencia?
<!-- id: t12.11 | tipo: teorica -->

Porque sin él la fórmula acepta capacidades negativas y elige objetos que no caben: en el ejemplo da 650, que es imposible (el óptimo es 450).

## ¿Cómo se sabe qué objetos se eligieron?
<!-- id: t12.12 | tipo: teorica -->

Recorriendo la tabla hacia atrás desde la última celda: si t[i][j] ≠ t[i-1][j], el objeto i se tomó, se anota y se resta su peso a j; si son iguales, no se tomó. Alternativa: guardar en cada celda una palabra de bits con los objetos elegidos, a costa de n bits más por celda.

## ¿Cuáles son los errores típicos en la mochila con PD?
<!-- id: t12.13 | tipo: teorica -->

No cortar cuando el objeto no entra (da 650); usar W[i] < j en vez de W[i] ≤ j (da 300, menos de lo posible); armar la tabla de n × W en vez de (n + 1) × (W + 1) (la última celda queda fuera de rango); usar greedy por valor/peso; y decir que O(n · W) es polinomial.

## ¿Por qué O(n · W) es pseudopolinomial?
<!-- id: t12.14 | tipo: teorica -->

Porque W ocupa unos log₂ W bits. Si b = log₂ W, entonces W = 2ᵇ y la complejidad es O(n · 2ᵇ): exponencial en el tamaño en bits de la entrada, aunque polinomial en el valor numérico de W.

## Compará todas las técnicas de diseño vistas.
<!-- id: t12.15 | tipo: teorica -->

| Técnica | Garantiza | Cuándo aplica | Costo típico |
| --- | --- | --- | --- |
| Fuerza bruta | Solución correcta | Siempre | Exponencial |
| División y conquista | Solución correcta | Subproblemas disjuntos | Según la recurrencia |
| Greedy | Óptimo global solo si se demuestra la propiedad greedy | Elección greedy segura | O(n log n) por el ordenamiento |
| Backtracking | Completitud | Espacio de búsqueda acotable | Exponencial (podado) |
| Ramificación y poda | Óptimo global | Función de cota disponible y simple | Exponencial (podado) |
| Programación dinámica | Óptimo global | Subestructura + solapamiento | Celdas × trabajo |

## ¿Qué garantiza cada técnica y cómo se elige cuál usar?
<!-- id: t12.16 | tipo: teorica -->

Greedy garantiza el óptimo si la propiedad greedy está demostrada; si no, ninguna garantía. División y conquista da una solución correcta si los subproblemas son independientes; si se solapan, repite trabajo. Backtracking explora todas las soluciones válidas podando por restricciones; podar además por valor es lo que agrega ramificación y poda. PD garantiza el óptimo si hay subestructura óptima, y es eficiente si los subproblemas se solapan y son pocos. No hay técnica perfecta: hay que elegir la adecuada según qué garantiza cada una.

## ¿Puede la tabla de PD guardar algo distinto de la respuesta del problema?
<!-- id: t12.17 | tipo: teorica -->

Sí. En la suma máxima de subrectángulos, la tabla guarda sumas parciales: PD[i][j] = suma de M[0][0] a M[i][j], calculada como PD[i-1][j] + PD[i][j-1] - PD[i-1][j-1] + M[i][j]. Con eso la suma de cualquier rectángulo se obtiene en O(1) con cuatro accesos, y el algoritmo baja de O(N⁶) a O(N⁴). La tabla no guarda el resultado sino información intermedia que acelera un paso interno; estos casos son más difíciles de detectar que Fibonacci.

## ¿Cómo se usa la PD en problemas de conteo?
<!-- id: t12.18 | tipo: teorica -->

Igual que en optimización, pero la recurrencia suma las formas de llegar en lugar de tomar el máximo o el mínimo. Ejemplo: contar de cuántas formas una abeja llega de una celda a otra del panal moviéndose solo en ciertas direcciones.

## ¿Puede un problema tener subestructura óptima pero no subproblemas solapados? ¿Qué técnica usarías en ese caso?
<!-- id: ra57718ea6a | tipo: reflexion -->

Sí, ocurre en problemas como Merge Sort: hay subestructura óptima pero los subproblemas son disjuntos. En ese caso, Divide & Conquer es suficiente y más natural; agregar memoización no aportaría ninguna mejora.

## ¿Por qué la mochila 0/1 necesita PD y la mochila fraccionaria se resuelve con Greedy?
<!-- id: r066a5eb338 | tipo: reflexion -->

En la mochila fraccionaria siempre conviene tomar primero el objeto con mayor valor por kilo, lo que hace que la elección greedy sea globalmente óptima. En la 0/1 no se puede fraccionar, por lo que una elección localmente buena puede bloquear combinaciones mejores.

## ¿Qué hace que un problema sea “difícil”? ¿Es una propiedad del problema o del enfoque elegido?
<!-- id: rc4f3e4d74d | tipo: reflexion -->

La dificultad no es solo del problema sino de cómo lo formulamos. Un problema exponencial con fuerza bruta puede volverse polinomial si encontramos la estructura correcta de subproblemas. La técnica no cambia el problema; cambia la forma en que lo vemos.

## ¿Se les ocurre un problema cotidiano que tenga estructura de PD?
<!-- id: r35997dbf35 | tipo: reflexion -->

Ejemplos posibles: planificar una dieta semanal maximizando nutrición con presupuesto fijo, elegir qué estudiar cada día antes de un examen con energía limitada, calcular la ruta más rápida en una ciudad con tráfico variable. El patrón es siempre el mismo: decisiones secuenciales donde el estado futuro depende de decisiones pasadas.

## casas en fila con valores [5, 7, 6, 1, 2, 4], sin robar dos vecinas, con dp[i] = max(dp[i-1], dp[i-2] + v[i]). ¿Cuánto vale dp en la última casa?
<!-- id: rb57f135295 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) 12.
- B) 13.
- C) 15.
- D) 25.

C. 15. La tabla queda 5, 7, 11, 11, 13, 15 (por ejemplo, casas de valor 5 + 6 + 4).

## en la distancia de edición, ¿cuánto vale la celda edit(“ins”, “i”)?
<!-- id: r26e62ce853 | tipo: votacion | etiqueta: Votación de clase | nota: Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase. -->

- A) 0.
- B) 1.
- C) 2.
- D) 4.

C. 2: la “i” ya coincide y alcanza con borrar la “n” y la “s”.
