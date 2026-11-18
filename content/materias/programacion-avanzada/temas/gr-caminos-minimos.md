---
tema: gr-caminos-minimos
---

## ¿Qué problema resuelve Dijkstra y qué requisitos tiene el grafo?
<!-- id: t7.1 | tipo: teorica | etiqueta: Tomada en parciales -->

Halla los caminos de menor costo desde un nodo origen a todos los demás. Sirve para grafos ponderados, dirigidos o no (una arista no dirigida equivale a dos dirigidas de igual peso), con pesos **no negativos**. Es un algoritmo greedy.

## ¿Cómo funciona Dijkstra?
<!-- id: t7.2 | tipo: teorica -->

Inicializa todas las distancias en ∞ y la del origen en 0. En cada paso elige el nodo no visitado de menor distancia acumulada, lo cierra (su distancia queda definitiva) y relaja sus aristas salientes: para cada sucesor w, si distancia[w] > distancia[v] + peso(v, w), actualiza distancia[w] y guarda v como predecesor de w. Termina cuando no quedan nodos por cerrar.

## ¿Por qué es seguro cerrar el nodo de menor distancia?
<!-- id: t7.3 | tipo: teorica -->

Por la **propiedad de cierre**. Si Dijkstra cierra w con distancia d[w], cualquier camino alternativo más corto a w debería pasar por algún nodo u todavía no visitado, pero d[u] ≥ d[w] porque w se eligió por ser el mínimo, y sumar aristas de peso positivo solo aumenta el costo. Contradicción: la distancia de w ya es definitiva. Se apoya en la subestructura óptima: si el camino mínimo de A a C pasa por B, el tramo A→B también es mínimo.

## ¿Por qué Dijkstra falla con pesos negativos?
<!-- id: t7.4 | tipo: teorica -->

Porque una arista negativa puede hacer que un camino que parecía peor se vuelva mejor más adelante, y Dijkstra nunca revisa un nodo ya cerrado. Tampoco sirve ignorar los tramos negativos y correr Dijkstra sobre el resto: eso altera el grafo y el resultado.

## ¿Para qué sirve el vector de predecesores?
<!-- id: t7.5 | tipo: teorica -->

Para reconstruir el camino, no solo su costo: desde el destino se sigue el predecesor hacia atrás hasta llegar al origen.

## ¿Qué implementaciones de Dijkstra hay y cuándo conviene cada una?
<!-- id: t7.6 | tipo: teorica -->

Con cola de prioridad (heap): O((V + E) log V), aproximadamente O(E log V); conviene en grafos ralos, con pocas aristas. Sin cola, buscando el mínimo linealmente en cada paso: O(V²); conviene en grafos densos. El diseño algorítmico y la estructura de datos no son independientes: la operación cara es encontrar el mínimo, y el heap la baja de O(n) a O(log n).

## Compará BFS, Dijkstra y Bellman-Ford.
<!-- id: t7.7 | tipo: teorica -->

| | BFS | Dijkstra | Bellman-Ford |
| --- | --- | --- | --- |
| Pesos | Sin pesos o todos iguales | No negativos | Admite negativos y detecta ciclos negativos |
| Complejidad | O(V + E) | O((V + E) log V) con heap, O(V²) sin heap | O(V · E) |
| Cuándo | Importa la cantidad de saltos | Pesos reales no negativos | Puede haber pesos negativos; más general pero más lento |

## ¿Por qué BFS es un caso particular de Dijkstra?
<!-- id: t7.8 | tipo: teorica | etiqueta: Tomada en parciales -->

Cuando todas las aristas pesan lo mismo, el costo de un camino es proporcional a la cantidad de saltos, que es exactamente lo que BFS minimiza. Si algún tramo pesa distinto, BFS deja de alcanzar y hace falta Dijkstra.

## ¿Qué es un ciclo negativo y qué algoritmo lo detecta?
<!-- id: t7.9 | tipo: teorica -->

Un ciclo cuyas aristas suman un peso negativo: recorrerlo una y otra vez baja el costo indefinidamente, así que no existe camino mínimo. Lo detecta Bellman-Ford, que a diferencia de Dijkstra no da por cerrado un nodo y permite que su distancia siga mejorando; si después de las relajaciones todavía se puede mejorar alguna, hay un ciclo negativo.

## ¿Qué ocurre si una arista tiene peso cero? ¿Sigue siendo válido el algoritmo?
<!-- id: ra2173e9567 | tipo: reflexion -->

Sigue siendo válido. Peso cero no es negativo; la propiedad greedy se mantiene.

## Si el grafo no es dirigido, ¿cambia la lógica de Dijkstra o solo cambia la representación?
<!-- id: r5d5ddc217a | tipo: reflexion -->

Solo cambia la representación: cada arista se carga en ambas direcciones. La lógica es idéntica.

## ¿Por qué no alcanza con ser greedy? ¿Qué rol cumple la actualización del vector D en cada iteración?
<!-- id: r2124990cc2 | tipo: reflexion -->

La actualización propaga información. Greedy elige el nodo, pero sin relajar vecinos el resto del vector D quedaría desactualizado.

## Dijkstra encuentra el camino mínimo desde un nodo origen a todos los demás. ¿Cómo lo modificaríamos para detenerse en cuanto encuentre el camino mínimo a un único destino?
<!-- id: r864090780b | tipo: reflexion -->

Cortás el while cuando extraés el nodo destino del heap. En ese momento su distancia ya es definitiva.

## ¿En qué situación real preferiríamos Bellman-Ford sobre Dijkstra?
<!-- id: r4aaec17a48 | tipo: reflexion -->

Cuando hay pesos negativos: rutas con descuentos, grafos de dependencias con costos negativos, o detección de ciclos negativos.
