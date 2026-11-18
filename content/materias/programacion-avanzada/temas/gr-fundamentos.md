---
tema: gr-fundamentos
---

## ¿Qué es un grafo?
<!-- id: t6.1 | tipo: teorica -->

Un conjunto V de vértices (o nodos) y un conjunto E de aristas que los conectan. Permite modelar problemas como redes de ciudades y rutas, redes sociales, circuitos o estructuras químicas.

## ¿Qué es un grafo dirigido, uno no dirigido y uno ponderado?
<!-- id: t6.2 | tipo: teorica -->

En uno **dirigido** las aristas tienen sentido: en (v, w), v es la cola y w la cabeza. En uno **no dirigido** la conexión es simétrica. Es **ponderado** cuando cada arista tiene un valor numérico (peso). Dos vértices unidos por una arista son **adyacentes**.

## ¿Qué es el grado de un vértice?
<!-- id: t6.3 | tipo: teorica -->

La cantidad de vecinos directos. En un grafo no dirigido, cada arista suma 1 al grado de cada extremo. En uno dirigido se distingue grado de entrada (in-degree) y de salida (out-degree). Un vértice de grado 0 es un nodo aislado. En un grafo de dependencias, grado de entrada 0 indica un nodo inicial y grado de salida 0 un nodo final.

## ¿Qué es una matriz de adyacencia y qué es una lista de adyacencia?
<!-- id: t6.4 | tipo: teorica -->

La **matriz** es una tabla de V × V donde la celda (i, j) vale 1 (o el peso) si hay arista entre i y j, y 0 si no. La **lista** es un arreglo de V listas, una por vértice, donde cada una contiene solo los vecinos directos de ese vértice.

## ¿Cuándo conviene cada representación?
<!-- id: t6.5 | tipo: teorica | etiqueta: Tomada en parciales -->

| | Matriz | Lista |
| --- | --- | --- |
| Espacio | O(V²) | O(V + E) |
| ¿Existe la arista (u, v)? | O(1) | O(grado(u)) |
| Recorrer vecinos de u | O(V) | O(grado(u)) |
| Mejor para | Grafos densos | Grafos dispersos |

No hay una universalmente mejor: depende del grafo y de las operaciones, y la elección impacta en la eficiencia de los algoritmos. En un grafo disperso la matriz desperdicia espacio con ceros.

## ¿Qué es un camino, un ciclo y un árbol?
<!-- id: t6.6 | tipo: teorica -->

Un **camino** es una secuencia de vértices sin repetir, donde cada uno está conectado con el siguiente. Un **ciclo** es un camino que termina en el vértice donde empezó. Un **árbol** es un grafo no dirigido, conexo y sin ciclos.

## ¿Qué diferencia hay entre un camino euleriano y uno hamiltoniano?
<!-- id: t6.7 | tipo: teorica -->

El **euleriano** recorre cada **arista** exactamente una vez (puede repetir vértices). El **hamiltoniano** recorre cada **vértice** exactamente una vez (no necesita usar todas las aristas). Si además empiezan y terminan en el mismo vértice son circuito de Euler o ciclo de Hamilton, y el grafo se llama euleriano o hamiltoniano.

## ¿Cuál es la condición de existencia de un camino o circuito euleriano? ¿Por qué 0 o 2 vértices impares?
<!-- id: t6.8 | tipo: teorica | etiqueta: Tomada en parciales -->

Circuito: 0 vértices de grado impar. Camino abierto: exactamente 2 vértices de grado impar, que son necesariamente el inicio y el fin. La razón es que cada vez que el recorrido pasa por un vértice intermedio usa una arista para entrar y otra para salir, así que consume las aristas de a pares; solo el vértice donde arranca y el vértice donde termina pueden quedar con una arista suelta.

## ¿Por qué el problema de Euler es fácil y el de Hamilton es difícil?
<!-- id: t6.9 | tipo: teorica -->

Para Euler alcanza con contar grados (verificar la existencia es O(V + E)) y encontrarlo es O(E): es polinomial. Para Hamilton no se conoce ninguna condición simple; hay que explorar combinaciones y en el peor caso es exponencial: es NP-completo. El Problema del Viajante (TSP) es su versión más famosa.

## ¿Por qué saber que existe un circuito euleriano no alcanza para construirlo?
<!-- id: t6.10 | tipo: teorica -->

Porque la existencia se decide mirando solo los grados de los vértices, mientras que construir la ronda exige recorrer el grafo consumiendo efectivamente todas las aristas, eligiendo en qué orden.

## ¿Instagram y un grupo de WhatsApp necesitan el mismo tipo de grafo?
<!-- id: r5ed2ff337a | tipo: reflexion -->

Instagram necesita un grafo dirigido, porque seguir a alguien no implica que te sigan de vuelta. Un grupo de WhatsApp se parece más a uno no dirigido, ya que la pertenencia es simétrica: si vos estás, todos te ven a vos. Ninguno de los dos pide pesos a menos que quieras capturar algo como frecuencia de interacción.

## ¿Puede un árbol tener un ciclo hamiltoniano? ¿Y un camino hamiltoniano?
<!-- id: rdd7323fbfd | tipo: reflexion -->

No puede tener ciclo hamiltoniano, porque un árbol es acíclico por definición y un ciclo hamiltoniano es un caso particular de ciclo. Sí puede tener camino hamiltoniano, pero solo si el árbol es en realidad una cadena (sin ramificaciones); apenas hay un vértice con más de dos vecinos, ya no se puede visitar todos sin repetir.

## Con 1000 nodos y 1002 aristas, ¿qué representación conviene? ¿Y con 900.000 aristas?
<!-- id: r89c2014d20 | tipo: reflexion -->

Con 1002 aristas sobre 1000 nodos el grafo es disperso (muy por debajo de V² = 1.000.000), así que conviene lista de adyacencia. Con 900.000 aristas ya estamos cerca del máximo posible, el grafo es denso, y ahí la matriz empieza a ser más conveniente pese a gastar más memoria.

## ¿Por qué el TSP es tan difícil si el problema euleriano equivalente es tan fácil?
<!-- id: ra043b50f90 | tipo: reflexion -->

Para Euler alcanza con mirar los grados de cada vértice, una propiedad local y fácil de chequear. Para Hamilton no hay ninguna condición equivalente conocida: hay que explorar combinaciones de caminos, y eso crece exponencialmente. El TSP hereda esa dificultad, y encima busca el ciclo hamiltoniano de menor costo, no cualquiera.

## Ahora que tenemos las herramientas, ¿qué le falta a nuestro problema de las rutas del inicio para resolverse del todo?
<!-- id: ra00cf1c989 | tipo: reflexion -->

Ya sabemos representar la red (lista o matriz de adyacencia) y qué preguntas tiene sentido hacerle (¿hay conexión?, ¿hay un recorrido que no repita rutas?). Lo que todavía falta es un algoritmo que calcule el camino más corto usando los pesos del mapa. Eso llega en las próximas clases con BFS, DFS y los algoritmos de caminos mínimos.
