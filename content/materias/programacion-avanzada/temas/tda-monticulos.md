---
tema: tda-monticulos
---

## ¿Qué es una cola de prioridad y cuál es su interfaz?
<!-- id: t4.1 | tipo: teorica -->

Es una cola en la que cada elemento tiene asociada una prioridad: se insertan en cualquier orden y se extrae siempre el de mayor prioridad (no es FIFO). Su interfaz: crear la cola, insertar un elemento, extraer el primero (el de mayor prioridad) y consultar el primero sin sacarlo.

## ¿Qué costo tienen sus operaciones según cómo se implemente?
<!-- id: t4.2 | tipo: teorica -->

| Implementación | Insertar | Obtener el de mayor prioridad |
| --- | --- | --- |
| Lista ordenada | O(n) | O(1) |
| Lista desordenada | O(1) | O(n) |
| Montículo binario | O(log n) | O(log n) |

El montículo es la opción consistente: ninguna operación se degrada a lineal.

## ¿Qué es un montículo (heap)?
<!-- id: t4.3 | tipo: teorica -->

Un árbol binario completo o casi completo que cumple dos condiciones a la vez. **Condición de forma**: todos los niveles están llenos salvo quizás el último, que se llena de izquierda a derecha. **Condición de orden**: cada nodo es menor o igual que sus hijos (montículo de mínimo) o mayor o igual (de máximo). Toda operación termina reacomodando la estructura hasta que ambas condiciones quedan restauradas.

## ¿Cómo se representa un heap en un arreglo?
<!-- id: t4.4 | tipo: teorica | etiqueta: Tomada en parciales -->

Como el árbol es completo, se guarda por niveles en un vector, sin nodos ni referencias. Con la raíz en la posición 1 (la 0 queda sin usar): el hijo izquierdo de i está en 2i, el derecho en 2i + 1, y el padre de i en ⌊i/2⌋.

## ¿Cómo se inserta un elemento (sift-up)?
<!-- id: t4.5 | tipo: teorica -->

Se coloca al final del arreglo, en la primera posición libre del último nivel, y se lo hace “flotar”: mientras sea menor que su padre (en un min-heap) se intercambia con él. Termina cuando el padre es menor o igual, o cuando llega a la raíz.

## ¿Cómo se extrae la raíz (sift-down)?
<!-- id: t4.6 | tipo: teorica -->

Se guarda la raíz, se la reemplaza por el último elemento y se lo “hunde”: en cada paso se compara con sus dos hijos y se intercambia con el menor de ellos (en un min-heap), hasta que es menor o igual que ambos o queda como hoja.

## ¿Cuál es la complejidad de insertar y de extraer?
<!-- id: t4.7 | tipo: teorica -->

Inserción: mejor caso O(1), si el nuevo elemento ya es mayor que su padre; peor caso, cuando es un nuevo mínimo y sube hasta la raíz, tantas comparaciones como nodos en ese camino. Extraer es análogo hacia abajo. En ambos casos el costo es proporcional a la altura del árbol, y como el árbol es completo la altura es ⌊log₂ n⌋: **O(log n)** garantizado.

## ¿Qué pasa con los elementos repetidos? ¿Cómo se logra estabilidad?
<!-- id: t4.8 | tipo: teorica -->

El heap admite repetidos sin problema: la condición de orden no exige unicidad. Pero no garantiza ningún orden entre elementos iguales. Para que ante empate salga primero el que se insertó antes, se guarda cada elemento como una tupla (prioridad, contador, valor), donde el contador crece con cada inserción y actúa como criterio secundario de comparación.

## ¿Cuándo NO conviene usar un heap?
<!-- id: t4.9 | tipo: teorica -->

Si solo necesitás el mínimo una vez (un recorrido lineal O(n) es más simple); si los datos ya llegan ordenados y no entran nuevos (alcanza una cola simple); o si necesitás buscar por un valor arbitrario (el heap no tiene esa operación).

## ¿Cómo funciona HeapSort y qué ventajas tiene?
<!-- id: t4.10 | tipo: teorica -->

Se arma el heap con todos los elementos y se extraen uno a uno: salen ordenados. Es O(n log n). Frente a QuickSort, garantiza O(n log n) incluso en el peor caso. Frente a MergeSort, es en el lugar: no necesita memoria extra proporcional a n.

## ¿Cómo se construye un heap a partir de un arreglo en O(n)?
<!-- id: t4.11 | tipo: teorica -->

Insertando uno a uno costaría O(n log n). Con el **truco de Floyd** se hace sift-down desde la posición n/2 (el último nodo con al menos un hijo) hacia la raíz. Es O(n) porque la mayoría de los nodos están en los niveles bajos y casi no tienen que bajar: solo la raíz puede bajar toda la altura. En un heap de 15 nodos: 1 · 3 + 2 · 2 + 4 · 1 + 8 · 0 = 11 < 15 movimientos.

## ¿Qué relación tiene el heap con el algoritmo de Dijkstra?
<!-- id: t4.12 | tipo: teorica -->

Dijkstra necesita en cada paso el nodo no visitado de menor distancia acumulada, que es exactamente lo que da una cola de prioridad. Con un heap, Dijkstra baja de O(V²) a O((V + E) log V).

## Compará QuickSort, MergeSort y HeapSort.
<!-- id: t4.13 | tipo: teorica -->

| | Promedio | Peor caso | Memoria extra |
| --- | --- | --- | --- |
| QuickSort | O(n log n) | O(n²) | O(log n) |
| MergeSort | O(n log n) | O(n log n) | O(n) (no in-place) |
| HeapSort | O(n log n) | O(n log n) | O(1) in-place (O(log n) si el hundir es recursivo) |

## ¿Cómo se mantiene la mediana de un flujo de datos con dos heaps?
<!-- id: t4.14 | tipo: teorica -->

Se usan un max-heap con la mitad de valores menores y un min-heap con la mitad de mayores, balanceados en tamaño. Cada nuevo valor se inserta según sea menor o mayor que la mediana actual, y si los tamaños se desbalancean se pasa la raíz de un heap al otro. La mediana se lee de las raíces (o su promedio si la cantidad es par). Cada inserción es O(log n), contra O(n) de insertar ordenado en un vector.

## ¿Por qué es importante que el árbol sea completo para garantizar O(log n)?
<!-- id: r93e425b46a | tipo: reflexion -->

Porque la altura de un árbol binario depende de cuántos niveles tiene. En un árbol completo (o casi completo), con n nodos la altura es siempre ⌊log₂n⌋ no puede crecer más rápido que eso porque cada nivel se llena antes de abrir el siguiente. Si el árbol pudiera ser arbitrariamente desbalanceado (como un árbol binario de búsqueda sin balanceo), en el peor caso degeneraría en una lista lineal de altura n, y las operaciones costarían O(n). La completitud es exactamente lo que “compra” la garantía logarítmica.

## ¿Qué ventaja tiene representar el heap en un array en lugar de con nodos y punteros?
<!-- id: r469459c213 | tipo: reflexion -->

Varias concretas: no se gasta memoria extra en punteros (cada nodo con dos hijos y un padre necesitaría tres referencias adicionales); el acceso es más rápido porque el array es contiguo en memoria y aprovecha el caché del procesador (los nodos con punteros pueden estar dispersos en el heap de memoria); y la navegación padre-hijo se reduce a aritmética de enteros (2i, i/2), que es más barata que desreferenciar punteros. En la práctica, para un árbol que siempre va a ser completo, el array es la representación óptima en todos los sentidos.

## Si necesitás tanto las operaciones de mínimo como de máximo eficientemente, ¿qué harías?
<!-- id: ra345ce9f0e | tipo: reflexion -->

Hay varias opciones según el contexto. La más simple es mantener dos heaps en paralelo: un min-heap y un max-heap sobre los mismos datos (con una referencia cruzada entre elementos para poder eliminar de ambos). Una alternativa más elegante es usar un min-max heap, una estructura que en los niveles pares almacena mínimos y en los impares máximos, logrando O(log n) para ambas operaciones con un solo array. También existe el double-ended priority queue como abstracción general. En la práctica, la solución de dos heaps separados es la más fácil de implementar y suficiente para la mayoría de los casos reales.
