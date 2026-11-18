---
tema: gr-arboles-abarcadores
---

## ¿Qué es un árbol abarcador de costo mínimo (MST)?
<!-- id: t7.10 | tipo: teorica -->

Un subgrafo que es **árbol** (conexo y sin ciclos), **abarcador** (incluye todos los vértices del grafo original) y de **costo mínimo** (sus aristas suman lo menor posible). Se obtiene de un grafo no dirigido, ponderado y conexo, y tiene V - 1 aristas. Se usa para minimizar costos de conexión: cableado, rutas aéreas, redes eléctricas o de suministro, logística.

## ¿Qué dicen las propiedades de corte y de ciclo?
<!-- id: t7.11 | tipo: teorica -->

**Corte**: dada una partición de los vértices en dos conjuntos no vacíos, la arista de peso mínimo que los une pertenece al MST. **Ciclo**: en cualquier ciclo, si una arista pesa más que todas las demás del ciclo, no puede pertenecer al MST.

## ¿Cómo funciona Prim?
<!-- id: t7.12 | tipo: teorica | etiqueta: Tomada en parciales -->

Hace crecer un único árbol desde un vértice inicial cualquiera. Mantiene una cola de prioridad con las aristas que salen del árbol; en cada paso extrae la de menor peso, y si su destino no está en el árbol, lo incorpora junto con la arista e inserta las aristas del nuevo vértice. Si el destino ya estaba en el árbol, la descarta. Termina cuando incorporó todos los vértices.

## ¿Qué complejidad tiene Prim y cuándo conviene la versión sin cola de prioridad?
<!-- id: t7.13 | tipo: teorica -->

Con cola de prioridad es O(E log V): cada arista entra y sale de la cola a lo sumo una vez (O(E log E)) y log E ≤ 2 log V. En grafos densos (E ≈ V²) eso da O(V² log V), y la versión con matriz de adyacencia y sin cola logra O(V²), que es mejor.

## ¿Qué es Union-Find y qué operaciones tiene?
<!-- id: t7.14 | tipo: teorica -->

Una estructura que mantiene una partición de elementos en conjuntos disjuntos; al inicio cada elemento es su propio conjunto. **find(x)** devuelve el representante del conjunto de x; **union(x, y)** fusiona los conjuntos de x e y. Dos elementos están en el mismo conjunto si y solo si find(x) == find(y).

## ¿Qué implementaciones de Union-Find hay y cuánto cuestan?
<!-- id: t7.15 | tipo: teorica -->

| Implementación | union | find |
| --- | --- | --- |
| Quick-find | O(V) | O(1) |
| Quick-union | O(altura) | O(altura) |
| Weighted quick-union | O(log V) | O(log V) |
| Weighted + compresión de caminos | casi O(1) amortizado | casi O(1) amortizado |

El ideal O(1) en ambas está demostrado que no se puede lograr.

## ¿Cómo funciona Kruskal y cómo controla que no se cierren ciclos?
<!-- id: t7.16 | tipo: teorica | etiqueta: Tomada en parciales -->

Parte de cada vértice como un árbol aislado. Pone las aristas en una cola de prioridad por peso y las va sacando de menor a mayor: si find(u) ≠ find(v), la arista une dos componentes distintas y no forma ciclo, así que la agrega y hace union(u, v); si no, la descarta. Termina al tener V - 1 aristas (árbol) o cuando no quedan aristas (bosque).

## ¿Qué complejidad tiene Kruskal?
<!-- id: t7.17 | tipo: teorica -->

O(E log E), dominada por ordenar las aristas. Con weighted quick-union o compresión de caminos las operaciones de Union-Find no dominan (con quick-union simple el total podría subir a O(E · V)). Como E < V², log E < 2 log V, así que O(E log E) = O(E log V).

## Compará Prim y Kruskal. ¿Cuándo conviene cada uno?
<!-- id: t7.18 | tipo: teorica | etiqueta: Tomada en parciales -->

| | Prim | Kruskal |
| --- | --- | --- |
| Punto de partida | Un nodo inicial | Todas las aristas |
| Estructura auxiliar | Cola de prioridad | Cola de prioridad + Union-Find |
| Complejidad | O(E log V) | O(E log E) |
| Cómo crece | Un único árbol | Varios fragmentos que se fusionan |
| Conviene en | Grafos densos (con matriz, O(V²)) | Grafos dispersos (E ≈ V) |

## ¿Por qué el enfoque greedy de Prim y Kruskal es correcto?
<!-- id: t7.19 | tipo: teorica -->

Por la propiedad de corte. Prim agrega la arista mínima que cruza el corte (árbol, resto de los vértices), así que debe estar en el MST. Kruskal acepta cada arista solo si es mínima en su corte correspondiente, y una arista rechazada es la más pesada (o empata) del ciclo que cerraría. Las decisiones locales nunca descartan una opción mejor.

## ¿Prim y Kruskal dan siempre el mismo árbol? ¿Y el mismo costo?
<!-- id: t7.20 | tipo: teorica | etiqueta: Tomada en parciales -->

El árbol puede no ser el mismo: si hay aristas de igual peso puede haber varios MST, y cada algoritmo (o el mismo con otro desempate u otro vértice inicial) puede devolver uno distinto. El costo total, en cambio, es siempre el mismo, porque ambos devuelven un árbol de costo mínimo y ese mínimo es único.

## ¿En qué se diferencian Prim y Dijkstra si ambos usan una cola de prioridad?
<!-- id: t7.21 | tipo: teorica -->

Dijkstra prioriza la distancia acumulada desde el origen y devuelve caminos mínimos; Prim prioriza solo el peso de la arista que conecta con el árbol y devuelve un árbol de costo total mínimo.

## ¿Qué variantes del problema de árbol abarcador mínimo existen y cómo se encaran?
<!-- id: t7.22 | tipo: teorica -->

* **Grafo disconexo**: se obtiene un bosque abarcador mínimo (Minimum Spanning Forest).
* **Pesos duplicados**: el MST puede no ser único.
* **MST máximo**: se niegan los pesos de las aristas antes de operar, o se altera el algoritmo.
* **Con restricciones**: que pase por cierto vértice está garantizado (el árbol abarca todos); que no pase por un vértice, se retira el vértice; que pase por cierta arista, se la fuerza al principio; que no pase por cierta arista, se la quita al principio.
* **Aristas críticas**: son las que aparecen en todos los MST.
* **MST dinámico** (el grafo cambia): es un problema muy complejo.

## Si dos aristas tienen el mismo peso, ¿el MST sigue siendo único? ¿Qué implicancias tiene eso?
<!-- id: r256727b75a | tipo: reflexion -->

No, el MST puede no ser único. Puede haber varios MSTs con el mismo costo total. Los algoritmos siguen funcionando correctamente, pero podrían retornar árboles distintos dependiendo de cómo desempatan.

## Se tiene una red con 500 nodos y 600 conexiones. ¿Qué algoritmo elegimos y por qué?
<!-- id: r4c34758dcd | tipo: reflexion -->

Kruskal. Con E ≈ V el grafo es muy disperso, y Kruskal aprovecha eso mejor. Ordenar 600 aristas es barato, y Union-Find hace las verificaciones de ciclo de forma casi constante.

## ¿Por qué no alcanza con un array de visitados para detectar ciclos en Kruskal? ¿Qué ventaja concreta da Union-Find?
<!-- id: rdf66be4ccd | tipo: reflexion -->

Un visited[] solo sabe si un nodo fue visitado, no si dos nodos ya pertenecen al mismo componente. Kruskal agrega aristas entre componentes distintos; necesita saber si u y v ya están conectados indirectamente, algo que visited[] no puede responder eficientemente.

## Si quisiéramos obtener el árbol abarcador de costo máximo en lugar del mínimo, ¿cómo modificaríamos cada algoritmo?
<!-- id: r0aa475ac86 | tipo: reflexion -->

En Kruskal, invertir el orden de las aristas (de mayor a menor). En Prim, usar una cola de prioridad máxima en lugar de mínima. En ambos casos el cambio es mínimo.

## ¿En qué se parece Prim a Dijkstra y en qué se diferencia? ¿Podríamos usar Dijkstra para resolver el problema del MST?
<!-- id: r0474448f9f | tipo: reflexion -->

Se parecen en la mecánica: ambos usan cola de prioridad y expanden desde un conjunto ya procesado. La diferencia es qué priorizan: Dijkstra acumula la distancia total desde el origen, Prim solo mira el peso de la arista inmediata. No se puede usar Dijkstra directamente para MST porque podría elegir aristas distintas al optimizar distancias acumuladas.
