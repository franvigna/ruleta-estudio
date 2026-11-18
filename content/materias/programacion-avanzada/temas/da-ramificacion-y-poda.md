---
tema: da-ramificacion-y-poda
---

## ¿Por qué backtracking no alcanza para problemas de optimización?
<!-- id: t10.1 | tipo: teorica -->

Porque solo poda lo infactible. Si encuentra una solución de la mochila con ganancia $70 no puede detenerse: podría haber otra mejor sin explorar. Para garantizar el óptimo debe recorrer todas las ramas factibles, y en el peor caso eso equivale a fuerza bruta.

## ¿Qué es ramificación y poda (Branch and Bound)?
<!-- id: t10.2 | tipo: teorica -->

Una extensión de backtracking a problemas de optimización. Además de verificar factibilidad, calcula en cada nodo una cota del mejor valor alcanzable desde ahí y descarta la rama si esa cota no puede superar la mejor solución encontrada hasta el momento.

## ¿Qué es la función de cota?
<!-- id: t10.3 | tipo: teorica -->

Responde: dado el estado de un nodo, ¿cuál es el mejor valor que podría alcanzar cualquier solución que pase por él? Si no supera la mejor solución conocida, la rama se poda; si la supera, el nodo es prometedor y se expande. Es una estimación optimista, no la respuesta exacta.

## ¿Qué propiedades debe tener una buena función de cota?
<!-- id: t10.4 | tipo: teorica -->

* **Optimista**: nunca subestima el valor alcanzable (en maximización), así nunca poda una rama que mejoraba la solución.
* **Rápida de calcular**: si cuesta más que explorar la rama, no se gana nada.
* **Ajustada**: cuanto más cerca del valor real, más ramas poda.

## ¿Qué es un nodo prometedor en backtracking y en Branch and Bound?
<!-- id: t10.5 | tipo: teorica -->

En backtracking, un nodo es no prometedor si viola una restricción (infactibilidad). En B&B, además, es no prometedor si su cota no supera la mejor solución encontrada, aunque sea factible. B&B hace las dos podas y nunca descarta un nodo desde el que se pueda superar la mejor solución actual.

## ¿Cómo funciona la poda en un problema de maximización como la mochila?
<!-- id: t10.6 | tipo: teorica -->

Se mantiene la mejor ganancia encontrada (maxprofit) y para cada nodo se calcula una cota **superior** de la ganancia alcanzable desde él. Se poda por infactibilidad si el peso acumulado supera la capacidad, y por cota si la cota es menor o igual a maxprofit: ni en el escenario más favorable esa rama mejoraría lo que ya hay. Cada vez que se encuentra una solución mejor, maxprofit sube y se podan más nodos.

## ¿Cómo cambia la poda en un problema de minimización como el viajante?
<!-- id: t10.7 | tipo: teorica -->

La dirección se invierte: la cota es **inferior** (lo mínimo que podría costar cualquier tour que pase por ese nodo) y se poda si esa cota ya es mayor o igual al mejor tour conocido.

## ¿Qué tipos de recorrido puede usar Branch and Bound?
<!-- id: t10.8 | tipo: teorica -->

| | DFS | BFS | Best-First |
| --- | --- | --- | --- |
| Estructura | Pila o recursión | Cola FIFO | Cola de prioridad por cota |
| Próximo nodo | El último generado | El más antiguo | El de cota más prometedora |
| Memoria | Baja | Alta | Alta en el peor caso |

## ¿Por qué en Best-First hay que volver a comparar la cota al extraer un nodo?
<!-- id: t10.9 | tipo: teorica -->

Porque un nodo puede ser prometedor cuando se inserta y dejar de serlo mientras espera en la cola, si maxprofit creció mientras tanto. En el ejemplo del apunte, un nodo entró con cota $82 cuando maxprofit era $40, y al salir maxprofit ya era $90.

## En Best-First, ¿por qué se puede terminar apenas sale un nodo cuya cota no mejora? ¿Y por qué la primera solución completa que sale es la óptima?
<!-- id: t10.10 | tipo: teorica -->

Porque siempre sale el nodo con la mejor cota: si ese no mejora la mejor solución, ninguno de los pendientes puede hacerlo. En un recorrido en profundidad eso no vale, porque el nodo que sale no es el de mejor cota. Y la cota de una solución completa es su valor real: si salió primero, ninguna cota pendiente (que nunca es peor que el valor real) puede dar algo mejor.

## ¿Cuál es la cota en el problema de suma máxima de subconjuntos y qué tipos de poda aparecen?
<!-- id: t10.11 | tipo: teorica -->

Suma acumulada más todos los números que todavía no se decidieron: el mejor caso es incluir todo lo que queda. Con {10, 8, 7, 2} y W = 16, el nodo {10, 8} se poda por infactibilidad (18 > 16); el nodo {10, sin 8, sin 7} se poda por cota (12 no supera la mejor conocida, 15) aunque es factible. Esa segunda poda es la novedad de B&B.

## ¿Cómo se calcula la cota en la mochila 0/1?
<!-- id: t10.12 | tipo: teorica -->

Con los ítems ordenados por p/w: se toma la ganancia acumulada, se suman ítems enteros en ese orden mientras entren, y se suma la fracción del primer ítem que no entra entero que cabe en el peso restante. bound = (profit + Σ pⱼ de los que entran) + (W - totweight) · pₖ/wₖ, donde k es el primer ítem que no entra. Es la mochila fraccionaria sobre lo que falta decidir: un valor que ninguna solución entera puede superar.

## ¿Por qué conviene obtener una solución inicial con greedy antes de aplicar B&B?
<!-- id: t10.13 | tipo: teorica -->

Porque arrancar con una buena solución (maxprofit inicial alto, o un tour inicial corto) permite podar por cota desde el principio. En la mochila del apunte, el greedy entero por p/w da $80 como maxprofit inicial. En el TSP, el tour del vecino más cercano da 31 y se poda todo nodo con cota ≥ 31. El candidato inicial no tiene por qué ser óptimo ni único.

## ¿Qué cota se usa en el TSP?
<!-- id: t10.14 | tipo: teorica -->

Mínimos por fila: todo vértice se abandona exactamente una vez, así que cualquier tour cuesta al menos la suma de la salida más barata de cada vértice (21 en el ejemplo). Al avanzar, las salidas ya elegidas usan su costo real y las demás el mínimo de su fila, excluyendo aristas que ya no pueden usarse (entrar a un vértice que ya tiene entrada, o volver al origen antes de tiempo). Otras cotas posibles: mínimos por columna (19) o reducción de matriz (22); el óptimo real era 30.

## ¿Conviene siempre usar la cota más ajustada?
<!-- id: t10.15 | tipo: teorica -->

No necesariamente. Una cota más ajustada reduce los nodos visitados, pero si calcularla es muy costoso el tiempo total puede ser mayor. El objetivo es minimizar el tiempo total, no la cantidad de nodos.

## Compará backtracking y Branch and Bound.
<!-- id: t10.16 | tipo: teorica -->

| | Backtracking | Branch and Bound |
| --- | --- | --- |
| Objetivo | Factibilidad (una o todas las soluciones) | Optimización (la mejor) |
| Recorrido | DFS fijo | Flexible: BFS, DFS, Best-First |
| Poda | Infactibilidad | Infactibilidad + cota |
| Estructura | Pila o recursión | Pila, cola o cola de prioridad |
| Peor caso | Exponencial | Exponencial |
| Ventaja práctica | Encuentra soluciones válidas rápido | Llega al óptimo sin explorar todo el árbol |

La diferencia no está en la garantía del peor caso sino en el comportamiento en instancias reales.

## ¿Cuándo conviene Branch and Bound y cuándo no?
<!-- id: t10.17 | tipo: teorica -->

Conviene cuando hay una cota barata y ajustada, cuando se consigue temprano una buena solución (por ejemplo con greedy) y cuando la instancia es demasiado grande para fuerza bruta. No conviene cuando la cota es laxa y poda poco, cuando no hay forma de acotar una solución parcial o cuando la instancia es chica y la fuerza bruta alcanza. En el peor caso recorre tanto como la fuerza bruta, más el costo de calcular las cotas.

## ¿Qué lugar ocupa B&B en el panorama de paradigmas?
<!-- id: t10.18 | tipo: teorica -->

Greedy es rápido sin garantía de óptimo global; división y conquista resuelve subproblemas independientes; backtracking explora exhaustivamente podando infactibles (útil para factibilidad); B&B explora implícitamente todo el árbol podando además subóptimos (útil para optimización). Con la misma garantía de optimalidad: fuerza bruta evalúa todos los nodos, backtracking poda infactibles, B&B poda infactibles y subóptimos.

## ¿Por qué la función de cota debe ser optimista?
<!-- id: rb4f4507a6e | tipo: reflexion -->

Si la cota subestimara el valor real alcanzable, podría descartar nodos que sí llevan al óptimo. Al ser optimista, garantizamos que si la cota no supera la mejor solución conocida, ninguna expansión de ese nodo puede mejorarla.

## ¿Qué diferencia hay entre podar por infactibilidad y podar por cota?
<!-- id: r0c5eec51a7 | tipo: reflexion -->

Podar por infactibilidad descarta caminos que violan restricciones del problema. Podar por cota descarta caminos que, aunque factibles, no pueden mejorar la mejor solución ya encontrada. B&B hace las dos cosas.

## ¿Por qué los ítems se ordenan por p/w antes de aplicar el algoritmo de la Mochila?
<!-- id: r53ec23fa42 | tipo: reflexion -->

Para que la cota fraccional sea lo más ajustada posible. Al tomar primero los ítems más eficientes, la fracción del último ítem representa el mejor escenario alcanzable desde ese nodo.

## ¿Es posible que Best-First visite más nodos que Backtracking?
<!-- id: ra2781d1a8b | tipo: reflexion -->

Sí. Si la cota es muy laxa, casi ningún nodo es podado y se recorren todos igualmente. Además, la cola de prioridad tiene costo adicional por cada inserción y extracción, sin garantía de mejora en el peor caso.

## ¿Qué pasa con la poda por cota si el problema no tiene función objetivo?
<!-- id: re59c21ef46 | tipo: reflexion -->

Sin función objetivo no hay ni “mejor solución conocida” ni valor que acotar, así que la poda por cota desaparece: solo queda podar por infactibilidad, y B&B se reduce a Backtracking.
