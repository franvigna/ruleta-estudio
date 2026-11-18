---
tema: gr-recorridos
---

## ¿Para qué se recorre un grafo?
<!-- id: t6.11 | tipo: teorica -->

Para encontrar los vértices alcanzables desde uno dado, encontrar un camino entre dos vértices, averiguar si hay ciclos, procesar los nodos que cumplan una condición, entre otras cosas.

## ¿Cómo funciona DFS y qué estructuras usa?
<!-- id: t6.12 | tipo: teorica | etiqueta: Tomada en parciales -->

Búsqueda en profundidad: expande cada camino hasta su límite antes de explorar alternativas. Usa un **conjunto de visitados** y una **pila** con los nodos por visitar; también puede implementarse en forma recursiva, usando implícitamente la pila de llamadas.

## ¿Qué permite hacer DFS?
<!-- id: t6.13 | tipo: teorica -->

Recorrer los nodos accesibles desde un nodo inicial (en grafos dirigidos y no dirigidos), detectar ciclos, detectar subgrafos y componentes conexas, encontrar árboles de recorrido y obtener un orden topológico. Además habilita análisis avanzados: clasificación de aristas, componentes biconexas y fuertemente conexas, puentes y puntos de articulación.

## ¿Cómo funciona BFS y qué estructuras usa?
<!-- id: t6.14 | tipo: teorica | etiqueta: Tomada en parciales -->

Búsqueda en anchura: parte del nodo inicial, visita todos sus vecinos, después los vecinos de los vecinos, y así. Usa una **cola**: como primero se encolan los vecinos a distancia 1, luego los de distancia 2, etc., recorre el grafo en orden de distancia al inicio. Por eso, además de recorrer, calcula la distancia en saltos (cantidad de aristas) a cada nodo alcanzable.

## ¿Cómo se representa el “infinito” de las distancias en BFS?
<!-- id: t6.15 | tipo: teorica -->

Con un centinela como -1 (simple, sin ambigüedad porque las distancias nunca son negativas), con un valor gigante como Integer.MAX_VALUE (cuidado con el overflow al sumar) o con el infinito real del lenguaje (float('inf'), Infinity), que es lo más fiel al ∞.

## ¿Qué complejidad tienen DFS y BFS y de qué depende?
<!-- id: t6.16 | tipo: teorica | etiqueta: Tomada en parciales -->

O(V + E) con lista de adyacencia: cada vértice se visita una vez y cada arista se revisa una vez. Con matriz de adyacencia pasan a O(V²), porque recorrer los vecinos de cada nodo exige revisar su fila entera. En un grafo completo no dirigido E = V(V - 1)/2, así que también tienden a O(V²).

## Compará DFS y BFS. ¿Cuándo conviene cada uno?
<!-- id: t6.17 | tipo: teorica | etiqueta: Tomada en parciales -->

| | DFS | BFS |
| --- | --- | --- |
| Estructura | Pila (o recursión) | Cola |
| Orden | Primero en profundidad | Por niveles de distancia |
| Distancias mínimas | No | Sí, en grafos no ponderados |
| Ciclos y componentes conexas | Sí | Sí |
| Análisis avanzados | Sí (puentes, articulaciones, biconexas) | No |
| Uso típico | Exploración exhaustiva, orden topológico | Camino más corto en saltos |
| Complejidad | O(V + E) | O(V + E) |

## ¿Cómo detecta DFS un ciclo?
<!-- id: t6.18 | tipo: teorica -->

Con las aristas de retroceso. En un grafo dirigido, si se encuentra una arista hacia un nodo que todavía está en la pila de llamadas, hay un ciclo. En uno no dirigido, si un vecino ya fue visitado y no es el padre desde el que se llegó, hay un ciclo.

## ¿Cómo se determinan las componentes conexas?
<!-- id: t6.19 | tipo: teorica -->

Dos nodos están en la misma componente si existe un camino entre ellos. Se lanza un recorrido (DFS o BFS) desde cada nodo no visitado: cada lanzamiento marca una componente completa, así que la cantidad de lanzamientos es la cantidad de componentes.

## ¿Qué es un orden topológico y cuándo existe?
<!-- id: t6.20 | tipo: teorica -->

Una secuencia lineal de todos los nodos de un grafo dirigido tal que, para cada arista (u, v), u aparece antes que v. Existe si y solo si el grafo es un **DAG** (dirigido acíclico): con un ciclo, ningún orden puede respetar todas las dependencias. Puede haber varios órdenes válidos.

## ¿Cómo se obtiene un orden topológico?
<!-- id: t6.21 | tipo: teorica -->

Con DFS en post-orden inverso: se ejecuta DFS y cada vez que se termina de procesar un nodo (se cierra su llamada) se lo apila en una pila auxiliar; al final, desapilar da la secuencia. Si el DFS encuentra una arista de retroceso, hay ciclo y no hay orden. Alternativa tipo BFS (Kahn): se procesan primero los nodos con grado de entrada 0 y se van quitando sus aristas; si al terminar quedan nodos sin procesar, hay un ciclo.

## ¿Por qué DFS usa pila y BFS usa cola? ¿Qué pasaría si las intercambiaras?
<!-- id: r15f8fbb0d4 | tipo: reflexion -->

DFS necesita explorar “lo último descubierto” primero para profundizar sin perder el camino de vuelta, y eso es lo que da una pila (LIFO); BFS necesita expandirse pareja nivel por nivel, y eso es lo que da una cola (FIFO). Si las intercambiás, el recorrido sigue siendo válido (visitás todo lo alcanzable una sola vez), pero deja de ser DFS ni BFS: perdés la garantía de profundidad-primero o de orden por distancia mínima.

## Si en un grafo enorme y disperso solo te importa saber si hay camino entre dos nodos (no cuál es el más corto), ¿qué algoritmo usarías? ¿Cambia si el grafo es denso?
<!-- id: redeba6c679 | tipo: reflexion -->

Para solo saber si hay camino, cualquiera de los dos sirve porque ambos son O(V+E); en la práctica, DFS suele preferirse en grafos dispersos porque su estructura auxiliar (pila o recursión) ocupa menos memoria que la cola de BFS, que puede llegar a guardar un nivel entero de nodos. Si el grafo es denso, la diferencia importa menos: los dos convergen a O(V²) y el cuello de botella pasa a ser la cantidad de aristas, no la estructura elegida.

## Con matriz de adyacencia en vez de lista, ¿a qué cambia la complejidad? ¿Por qué?
<!-- id: r4dc052d899 | tipo: reflexion -->

Con matriz de adyacencia, recorrer los vecinos de un nodo cuesta O(V) (hay que revisar toda la fila) en vez de O(grado del nodo) como con lista, así que la complejidad total pasa de O(V+E) a O(V²). La lista es más eficiente porque solo “mira” las aristas que realmente existen; la matriz siempre revisa las V columnas, existan o no.

## DFS detecta ciclos. ¿BFS también puede? ¿Cómo?
<!-- id: rfd4da8074f | tipo: reflexion -->

Sí, aunque de forma distinta a DFS: en grafos no dirigidos, si un vecino ya está visitado y no es el nodo del que llegaste, hay un ciclo. En dirigidos conviene no usar el BFS clásico sino una variante tipo Kahn (basada en orden topológico): si terminás sin haber podido procesar todos los nodos, hay un ciclo.
