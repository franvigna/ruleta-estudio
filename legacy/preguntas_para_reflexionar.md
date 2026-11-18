# Preguntas para reflexionar: Programación Avanzada

*Preguntas y respuestas de las diapositivas de cada clase. Donde la diapositiva no trae respuesta, queda marcado; la teoría para armarla está en la misma clase del archivo de preguntas teóricas.*

---

## Clase 1: CC Fundamentos

*Sin respuestas en el material: armalas con la Clase 1 del archivo teórico.*

#### ¿Por qué no utilizamos siempre el mejor algoritmo? Es más: si existe un algoritmo óptimo y eficiente… ¿por qué usaríamos uno peor?

#### ¿Cómo se calcula en forma teórica el tiempo que tardará la ejecución de un fragmento de código?

#### ¿Y en forma empírica?

#### ¿Puede resolverse exactamente el mismo problema con distintos algoritmos?

#### ¿Cuáles eran las cuatro características vistas para los algoritmos de ordenamiento?

---

## Clase 2: DA Recursividad, CC Relaciones de Recurrencia y CC Teorema Maestro

### DA: Recursividad

#### Pero… ¿cómo medimos el costo de un algoritmo recursivo?

*Sin respuesta en el material: es la pregunta que abre Relaciones de Recurrencia (Clase 2 del archivo teórico).*

#### ¿Qué diferencias hay entre Recursividad e Iteración?

| Recursividad | Iteración |
| --- | --- |
| + Código más expresivo | + Mayor eficiencia |
| + Natural para problemas con estructura recursiva | + Seguridad de memoria |
| - Overhead al invocar funciones | - Código más imperativo |
| - Riesgo de stack overflow | - Menos natural en estructuras recursivas (árboles/grafos) |

### CC: Relaciones de Recurrencia

#### La telescopía funciona bien para recurrencias simples, pero es tediosa para las más complejas. ¿Existirá algún atajo?

*Sin respuesta en el material: "Lo veremos pronto…" (es el Teorema Maestro, ver la sección siguiente).*

### CC: Teorema Maestro

#### Resumen de Técnicas: ¿cuándo usar cada método?

| Método | Cuándo usarlo |
| --- | --- |
| Telescopía/Sustitución | Recurrencias simples, o cuando se desea obtener el desarrollo exacto paso a paso. |
| Árbol de recursión | Cuando se desea intuición visual del comportamiento recursivo |
| Teorema Maestro | Cuando la recurrencia tiene la forma T(n)=aT(n/b)+nᶜ y se desea obtener una respuesta rápidamente. |

---

## Clase 3: DA División y Conquista

### Preguntas de repaso

*Sin respuestas en el material: armalas con la Clase 3 del archivo teórico (la 5 también está en la Clase 2).*

#### 1. ¿Cuáles son los tres pasos de División y Conquista y qué hace cada uno en MergeSort específicamente?

#### 2. ¿Por qué el árbol de recursión de MergeSort tiene costo O(n) por nivel, y cuántos niveles tiene?

#### 3. ¿En qué condición el caso peor de QuickSort es O(n²) y cómo se puede mitigar?

#### 4. ¿Qué significa que un algoritmo de ordenamiento sea estable, y cuál de los dos algoritmos vistos cumple esa propiedad?

#### 5. ¿Por qué la recurrencia T(n) = T(n-1) + n no puede resolverse con el Teorema Maestro, y cuál es su solución por sustitución?

---

## Clase 4: TDA Montículo y Cola de Prioridad

#### 1. ¿Por qué es importante que el árbol sea completo para garantizar O(log n)?

Porque la altura de un árbol binario depende de cuántos niveles tiene. En un árbol completo (o casi completo), con n nodos la altura es siempre ⌊log₂n⌋ no puede crecer más rápido que eso porque cada nivel se llena antes de abrir el siguiente. Si el árbol pudiera ser arbitrariamente desbalanceado (como un árbol binario de búsqueda sin balanceo), en el peor caso degeneraría en una lista lineal de altura n, y las operaciones costarían O(n). La completitud es exactamente lo que "compra" la garantía logarítmica.

#### 2. ¿Qué ventaja tiene representar el heap en un array en lugar de con nodos y punteros?

Varias concretas: no se gasta memoria extra en punteros (cada nodo con dos hijos y un padre necesitaría tres referencias adicionales); el acceso es más rápido porque el array es contiguo en memoria y aprovecha el caché del procesador (los nodos con punteros pueden estar dispersos en el heap de memoria); y la navegación padre-hijo se reduce a aritmética de enteros (2i, i/2), que es más barata que desreferenciar punteros. En la práctica, para un árbol que siempre va a ser completo, el array es la representación óptima en todos los sentidos.

#### 3. Si necesitás tanto las operaciones de mínimo como de máximo eficientemente, ¿qué harías?

Hay varias opciones según el contexto. La más simple es mantener dos heaps en paralelo: un min-heap y un max-heap sobre los mismos datos (con una referencia cruzada entre elementos para poder eliminar de ambos). Una alternativa más elegante es usar un min-max heap, una estructura que en los niveles pares almacena mínimos y en los impares máximos, logrando O(log n) para ambas operaciones con un solo array. También existe el double-ended priority queue como abstracción general. En la práctica, la solución de dos heaps separados es la más fácil de implementar y suficiente para la mayoría de los casos reales.

---

## Clase 5: DA Algoritmos Ávidos

#### 1. ¿Podría Huffman construir un árbol subóptimo si el heap no estuviera bien implementado?

Sí. La optimalidad depende de que en cada paso se fusionen exactamente los dos nodos de menor frecuencia: ese extractMin es el paso greedy completo. Si el heap lo devuelve mal (bug, no empates: los empates no cambian el costo final), el árbol sigue siendo un código válido y libre de prefijos, pero deja de ser el de menor cantidad de bits. La corrección de Huffman depende 100% de la corrección del heap.

#### 2. ¿Por qué el greedy de scheduling falla si el criterio es "menor duración" en vez de "menor fin"?

Porque la duración no dice nada sobre cuánto tiempo libre deja para lo que sigue… sólo el momento en que termina lo dice. Contraejemplo rápido: A=[0,4], B=[5,9], C=[3,6]. C es la más corta, pero se solapa con A y con B, así que "menor duración" elige sólo C. El óptimo es {A,B}: el doble de actividades.

#### 3. ¿Qué propiedad comparten los tres problemas que hace que el greedy funcione (al menos en dos de ellos)?

Los tres tienen subestructura óptima: después de la primera elección, lo que queda es una instancia más chica del mismo problema. Pero esa propiedad la tienen los tres siempre, incluso Cambio de Moneda cuando falla (por eso ahí funciona Programación Dinámica igual). Lo que además tienen Actividades y Huffman, y por eso greedy nunca falla en esos dos, es la propiedad de elección ávida: se puede demostrar por intercambio que la primera elección local siempre forma parte de alguna solución óptima global. Cambio de Moneda sólo cumple esta segunda propiedad con sistemas canónicos de denominaciones.

---

## Clase 6: GR Fundamentos y GR Recorridos

### GR: Fundamentos

#### 1. ¿Instagram y un grupo de WhatsApp necesitan el mismo tipo de grafo?

Instagram necesita un grafo dirigido, porque seguir a alguien no implica que te sigan de vuelta. Un grupo de WhatsApp se parece más a uno no dirigido, ya que la pertenencia es simétrica: si vos estás, todos te ven a vos. Ninguno de los dos pide pesos a menos que quieras capturar algo como frecuencia de interacción.

#### 2. ¿Puede un árbol tener un ciclo hamiltoniano? ¿Y un camino hamiltoniano?

No puede tener ciclo hamiltoniano, porque un árbol es acíclico por definición y un ciclo hamiltoniano es un caso particular de ciclo. Sí puede tener camino hamiltoniano, pero solo si el árbol es en realidad una cadena (sin ramificaciones); apenas hay un vértice con más de dos vecinos, ya no se puede visitar todos sin repetir.

#### 3. Con 1000 nodos y 1002 aristas, ¿qué representación conviene? ¿Y con 900.000 aristas?

Con 1002 aristas sobre 1000 nodos el grafo es disperso (muy por debajo de V² = 1.000.000), así que conviene lista de adyacencia. Con 900.000 aristas ya estamos cerca del máximo posible, el grafo es denso, y ahí la matriz empieza a ser más conveniente pese a gastar más memoria.

#### 4. ¿Por qué el TSP es tan difícil si el problema euleriano equivalente es tan fácil?

Para Euler alcanza con mirar los grados de cada vértice, una propiedad local y fácil de chequear. Para Hamilton no hay ninguna condición equivalente conocida: hay que explorar combinaciones de caminos, y eso crece exponencialmente. El TSP hereda esa dificultad, y encima busca el ciclo hamiltoniano de menor costo, no cualquiera.

#### 5. Ahora que tenemos las herramientas, ¿qué le falta a nuestro problema de las rutas del inicio para resolverse del todo?

Ya sabemos representar la red (lista o matriz de adyacencia) y qué preguntas tiene sentido hacerle (¿hay conexión?, ¿hay un recorrido que no repita rutas?). Lo que todavía falta es un algoritmo que calcule el camino más corto usando los pesos del mapa. Eso llega en las próximas clases con BFS, DFS y los algoritmos de caminos mínimos.

### GR: Recorridos de Grafos

#### 1. ¿Por qué DFS usa pila y BFS usa cola? ¿Qué pasaría si las intercambiaras?

DFS necesita explorar "lo último descubierto" primero para profundizar sin perder el camino de vuelta, y eso es lo que da una pila (LIFO); BFS necesita expandirse pareja nivel por nivel, y eso es lo que da una cola (FIFO). Si las intercambiás, el recorrido sigue siendo válido (visitás todo lo alcanzable una sola vez), pero deja de ser DFS ni BFS: perdés la garantía de profundidad-primero o de orden por distancia mínima.

#### 2. Si en un grafo enorme y disperso solo te importa saber si hay camino entre dos nodos (no cuál es el más corto), ¿qué algoritmo usarías? ¿Cambia si el grafo es denso?

Para solo saber si hay camino, cualquiera de los dos sirve porque ambos son O(V+E); en la práctica, DFS suele preferirse en grafos dispersos porque su estructura auxiliar (pila o recursión) ocupa menos memoria que la cola de BFS, que puede llegar a guardar un nivel entero de nodos. Si el grafo es denso, la diferencia importa menos: los dos convergen a O(V²) y el cuello de botella pasa a ser la cantidad de aristas, no la estructura elegida.

#### 3. Con matriz de adyacencia en vez de lista, ¿a qué cambia la complejidad? ¿Por qué?

Con matriz de adyacencia, recorrer los vecinos de un nodo cuesta O(V) (hay que revisar toda la fila) en vez de O(grado del nodo) como con lista, así que la complejidad total pasa de O(V+E) a O(V²). La lista es más eficiente porque solo "mira" las aristas que realmente existen; la matriz siempre revisa las V columnas, existan o no.

#### 4. DFS detecta ciclos. ¿BFS también puede? ¿Cómo?

Sí, aunque de forma distinta a DFS: en grafos no dirigidos, si un vecino ya está visitado y no es el nodo del que llegaste, hay un ciclo. En dirigidos conviene no usar el BFS clásico sino una variante tipo Kahn (basada en orden topológico): si terminás sin haber podido procesar todos los nodos, hay un ciclo.

---

## Clase 7: GR Caminos Mínimos y GR Árboles Abarcadores

### GR: Caminos Mínimos

#### 1. ¿Qué ocurre si una arista tiene peso cero? ¿Sigue siendo válido el algoritmo?

Sigue siendo válido. Peso cero no es negativo; la propiedad greedy se mantiene.

#### 2. Si el grafo no es dirigido, ¿cambia la lógica de Dijkstra o solo cambia la representación?

Solo cambia la representación: cada arista se carga en ambas direcciones. La lógica es idéntica.

#### 3. ¿Por qué no alcanza con ser greedy? ¿Qué rol cumple la actualización del vector D en cada iteración?

La actualización propaga información. Greedy elige el nodo, pero sin relajar vecinos el resto del vector D quedaría desactualizado.

#### 4. Dijkstra encuentra el camino mínimo desde un nodo origen a todos los demás. ¿Cómo lo modificaríamos para detenerse en cuanto encuentre el camino mínimo a un único destino?

Cortás el while cuando extraés el nodo destino del heap. En ese momento su distancia ya es definitiva.

#### 5. ¿En qué situación real preferiríamos Bellman-Ford sobre Dijkstra?

Cuando hay pesos negativos: rutas con descuentos, grafos de dependencias con costos negativos, o detección de ciclos negativos.

### GR: Árboles Abarcadores

#### 1. Si dos aristas tienen el mismo peso, ¿el MST sigue siendo único? ¿Qué implicancias tiene eso?

No, el MST puede no ser único. Puede haber varios MSTs con el mismo costo total. Los algoritmos siguen funcionando correctamente, pero podrían retornar árboles distintos dependiendo de cómo desempatan.

#### 2. Se tiene una red con 500 nodos y 600 conexiones. ¿Qué algoritmo elegimos y por qué?

Kruskal. Con E ≈ V el grafo es muy disperso, y Kruskal aprovecha eso mejor. Ordenar 600 aristas es barato, y Union-Find hace las verificaciones de ciclo de forma casi constante.

#### 3. ¿Por qué no alcanza con un array de visitados para detectar ciclos en Kruskal? ¿Qué ventaja concreta da Union-Find?

Un visited[] solo sabe si un nodo fue visitado, no si dos nodos ya pertenecen al mismo componente. Kruskal agrega aristas entre componentes distintos; necesita saber si u y v ya están conectados indirectamente, algo que visited[] no puede responder eficientemente.

#### 4. Si quisiéramos obtener el árbol abarcador de costo máximo en lugar del mínimo, ¿cómo modificaríamos cada algoritmo?

En Kruskal, invertir el orden de las aristas (de mayor a menor). En Prim, usar una cola de prioridad máxima en lugar de mínima. En ambos casos el cambio es mínimo.

#### 5. ¿En qué se parece Prim a Dijkstra y en qué se diferencia? ¿Podríamos usar Dijkstra para resolver el problema del MST?

Se parecen en la mecánica: ambos usan cola de prioridad y expanden desde un conjunto ya procesado. La diferencia es qué priorizan: Dijkstra acumula la distancia total desde el origen, Prim solo mira el peso de la arista inmediata. No se puede usar Dijkstra directamente para MST porque podría elegir aristas distintas al optimizar distancias acumuladas.

---

## Clase 8: GR Coloreo y CC Conceptos Avanzados

### GR: Coloreo

#### 1. ¿Puede un algoritmo greedy encontrar el C(G) exacto? ¿Siempre? ¿Nunca?

Sí puede, pero solo por coincidencia: depende del orden de los vértices y de la estructura del grafo. No hay garantía de que lo haga en el caso general.

#### 2. Si el grafo fuera planar, ¿necesitamos seguir usando heurísticas?

Para grafos planares, el Teorema de los Cuatro Colores garantiza que C(G) ≤ 4, así que la cota superior es conocida. Sin embargo, encontrar el coloreo mínimo exacto dentro de ese límite sigue siendo NP-completo.

#### 3. ¿En qué se parece el coloreo al scheduling de exámenes de esta facultad?

Cada materia es un vértice y cada conflicto entre materias es una arista; los colores son las franjas horarias disponibles. Minimizar colores equivale a minimizar la duración del período de exámenes.

#### 4. ¿Qué es el clique de un grafo y cómo afecta al número cromático?

Un clique es un subgrafo completo: todos sus vértices están conectados entre sí. Si el clique más grande tiene tamaño k, entonces C(G) ≥ k, porque esos vértices necesitan colores distintos obligatoriamente.

#### 5. ¿Qué pasaría si aplicaras Welsh-Powell dos veces con desempates distintos? ¿Obtendrías siempre el mismo resultado?

No necesariamente. El orden en que se resuelven los empates de grado puede llevar a coloreos distintos con diferente cantidad de colores. Esa variabilidad es justamente lo que se estudia con distribuciones de probabilidad en la comparativa

### CC: Conceptos Avanzados

#### 1. ¿Por qué importa distinguir P de NP si igual usamos heurísticas en la práctica?

Conocer la clase de un problema evita perder tiempo buscando soluciones exactas eficientes que probablemente no existen. También guía la elección de la estrategia alternativa más adecuada según el contexto.

#### 2. ¿Un problema difícil en teoría puede ser fácil en la práctica? ¿Cómo?

Sí. La teoría trabaja con el peor caso, pero muchas instancias reales tienen estructura que los algoritmos pueden aprovechar. Un problema NP-completo puede resolverse rápido en el 99% de los casos prácticos.

#### 3. Si P = NP, ¿qué pasaría con la criptografía moderna?

La seguridad de RSA y otros sistemas se basa en asumir que ciertos problemas son difíciles. Si P = NP, esos problemas serían resolubles eficientemente y la criptografía de clave pública colapsaría.

#### 4. Si mañana alguien encontrara un algoritmo polinomial para el Sprint Justo, ¿qué otros problemas caerían con él?

Caerían todos los problemas NP-completos: como todos se reducen entre sí (directa o indirectamente), un algoritmo polinomial para uno solo se puede encadenar para resolver cualquier otro. En la práctica, eso significaría que P = NP.

---

## Clase 9: DA Fuerza Bruta y DA Backtracking

### DA: Fuerza Bruta

#### 1. ¿Puede un algoritmo de fuerza bruta ser óptimo? ¿En qué casos?

Sí, cuando el espacio de búsqueda es pequeño o no hay estructura aprovechable. Ejemplo: búsqueda en arreglo desordenado.

#### 2. ¿Qué significa que un problema sea NP-completo en términos de fuerza bruta?

Que no se conoce algoritmo eficiente exacto. La fuerza bruta es la única garantía de solución correcta.

#### 3. Si se reduce el espacio de búsqueda a la mitad, ¿cuánto mejora en O(2ⁿ)?

Solo un paso menos: O(2ⁿ⁻¹) = O(2ⁿ)/2. La complejidad no cambia de orden. El costo sigue siendo exponencial.

#### 4. ¿Cuándo se preferiría fuerza bruta sobre un algoritmo más eficiente pero aproximado?

Cuando el costo de una solución incorrecta es inaceptable y el espacio es tratable.

#### 5. ¿Qué tienen en común todos los ejemplos vistos hoy?

Todos generan candidatos sistemáticamente y los evalúan uno a uno sin atajos.

#### 6. En el problema del candado de 3 dígitos, ¿por qué la fuerza bruta fue la respuesta correcta?

*(De las diapositivas.)* Cuando el espacio era pequeño y necesitábamos certeza. La fuerza bruta no es una rendición. Es una decisión de diseño consciente, justificada, y a veces la única honesta.

### DA: Backtracking

#### 1. ¿Por qué backtracking siempre encuentra una solución si existe, mientras que greedy no lo garantiza?

Backtracking explora sistemáticamente todo el espacio de búsqueda y retrocede cada vez que llega a un callejón sin salida, garantizando que ninguna rama quede sin intentar. Greedy toma decisiones irrevocables que pueden bloquear el camino a la solución global sin posibilidad de corrección.

#### 2. ¿Qué pasaría si elimináramos la condición esFactible del algoritmo de N-reinas?

El algoritmo seguiría encontrando soluciones, pero exploraría el árbol completo sin descartar ninguna rama, volviendo al costo de la fuerza bruta. El tiempo de ejecución crecería exponencialmente sin ninguna ganancia.

#### 3. ¿Cuáles son las cinco operaciones del esquema general de backtracking y qué rol cumple cada una?

Solución verifica si el estado actual es una respuesta completa y válida. Extender genera las formas posibles de avanzar. Factible decide si una extensión candidata es viable. Registrar incorpora esa extensión al estado actual. Borrar la deshace para explorar otras alternativas.

#### 4. En coloreo de grafos con k colores, ¿cuándo decimos que asignar un color a un nodo es factible?

Una asignación de color a un nodo es factible cuando ninguno de sus vecinos ya coloreados tiene asignado ese mismo color. La condición se verifica recorriendo únicamente los nodos adyacentes que ya fueron procesados.

#### 5. ¿En qué tipo de problemas backtracking tiene peor desempeño relativo? ¿Cuándo conviene usarlo de todas formas?

Backtracking tiene peor desempeño cuando el espacio de estados es grande y las condiciones de poda son débiles, acercándose al comportamiento de fuerza bruta. Conviene usarlo de todas formas cuando el problema es NP-completo y no existe un algoritmo más eficiente conocido, ya que al menos garantiza encontrar la solución si existe.

---

## Clase 10: DA Ramificación y Poda (Branch & Bound)

#### 1. ¿Por qué la función de cota debe ser optimista?

Si la cota subestimara el valor real alcanzable, podría descartar nodos que sí llevan al óptimo. Al ser optimista, garantizamos que si la cota no supera la mejor solución conocida, ninguna expansión de ese nodo puede mejorarla.

#### 2. ¿Qué diferencia hay entre podar por infactibilidad y podar por cota?

Podar por infactibilidad descarta caminos que violan restricciones del problema. Podar por cota descarta caminos que, aunque factibles, no pueden mejorar la mejor solución ya encontrada. B&B hace las dos cosas.

#### 3. ¿Por qué los ítems se ordenan por p/w antes de aplicar el algoritmo de la Mochila?

Para que la cota fraccional sea lo más ajustada posible. Al tomar primero los ítems más eficientes, la fracción del último ítem representa el mejor escenario alcanzable desde ese nodo.

#### 4. ¿Es posible que Best-First visite más nodos que Backtracking?

Sí. Si la cota es muy laxa, casi ningún nodo es podado y se recorren todos igualmente. Además, la cola de prioridad tiene costo adicional por cada inserción y extracción, sin garantía de mejora en el peor caso.

#### 5. ¿Qué pasa con la poda por cota si el problema no tiene función objetivo?

Sin función objetivo no hay ni "mejor solución conocida" ni valor que acotar, así que la poda por cota desaparece: solo queda podar por infactibilidad, y B&B se reduce a Backtracking.

---

## Clase 11: DA Programación Dinámica 1

#### 1. ¿Puede resolverse un Sudoku con Programación Dinámica?

No directamente, porque el Sudoku no tiene subestructura óptima clara ni subproblemas bien definidos que se reutilicen. Es un problema de satisfacción de restricciones que se aborda mejor con backtracking.

#### 2. ¿En qué se parece Top-Down a División y Conquista? ¿En qué se diferencia fundamentalmente?

Ambos dividen el problema en subproblemas y los resuelven recursivamente. La diferencia es que en DyC los subproblemas son disjuntos, mientras que en PD se solapan y por eso es necesario memorizar los resultados.

### Votaciones de clase (agregadas desde las diapositivas)

*Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la misma clase.*

#### 3. Votación: se resuelve un problema de maximización con branch and bound y la mejor solución encontrada vale 50. ¿Cuándo se puede podar un nodo? A) Cuando el valor acumulado hasta ese nodo es menor que 50. B) Cuando la cota superior de lo que se puede lograr desde ese nodo es 50 o menos. C) Cuando la cota inferior de lo que se puede lograr desde ese nodo es menor que 50. D) Cuando el nodo está más profundo que el de la mejor solución encontrada.

B. Se poda cuando ni en el escenario más favorable (la cota superior) se puede superar la mejor solución conocida. El valor acumulado no alcanza para decidir, porque lo que falta decidir todavía puede sumar.

#### 4. Votación: si Fib pudiera anotar cada valor la primera vez que lo calcula y consultarlo después, ¿cuántas sumas haría para calcular fib(30)? A) Unas 2,7 millones. B) Unas 1,3 millones. C) 29. D) 435.

C. 29, porque cada valor de fib(2) a fib(30) necesita exactamente una suma y se calcula una sola vez. Sin anotar, fib(30) hace 2.692.537 llamadas.

#### 5. Votación: en la calle del disparador, "robo la casa más rica disponible y descarto sus vecinas" da 25, que es el máximo. ¿Qué podemos concluir? A) Que es correcta en cualquier calle. B) Nada todavía. C) Que conviene empezar por la casa más pobre. D) Que falla solo en calles cortas.

B. Nada todavía: que funcione en un ejemplo no prueba que funcione en cualquier calle. Para confiar en un greedy hay que demostrar la propiedad de elección ávida.

#### 6. Votación: memoización y tabulación son las dos O(n) para Fibonacci. ¿Qué ventaja concreta tiene bottom-up? A) Es asintóticamente más rápida. B) Calcula menos subproblemas. C) No usa la pila de recursión, así que no se desborda cuando n es muy grande. D) No necesita casos base.

C. No usa la pila de recursión. Las dos tienen la misma complejidad temporal y calculan los mismos subproblemas, y la tabla igual necesita sus casos base.

#### 7. Votación: con n casas, ¿cuántos subproblemas distintos hay que resolver para calcular robar(n − 1)? A) 2ⁿ. B) n². C) n. D) n/2.

C. n: uno por cada casa, de robar(0) a robar(n − 1), aunque el árbol de recursión los repita. Por eso la PD queda en n subproblemas × O(1) = O(n).

#### 8. Votación: ¿en cuál de estos problemas la PD no aporta nada frente a la recursión directa? A) Fibonacci. B) Ordenar con MergeSort. C) Camino mínimo en un mapa. D) El ladrón con mil casas.

B. MergeSort, porque las dos mitades nunca comparten subproblemas: no hay nada repetido para guardar.

#### 9. Votación: en la calle circular, robar(i) no sabe si se robó la casa 0. ¿Cómo lo resolvemos? A) Resolver dos calles rectas, una sin la primera casa y otra sin la última, y quedarse con la mejor. B) Resolver la calle recta y sacar la más barata de las dos puntas si usa ambas. C) Pegar dos copias de la calle. D) Cambiar solo la última celda.

A. Se parte en dos casos de calle recta y se toma el máximo. Moraleja: si el subproblema no recuerda algo que se necesita, se parte en casos o se agrega un parámetro.

#### 10. Votación: durante la iteración k de Floyd, ¿qué pasa con los valores de la fila k y la columna k? A) No cambian. B) Son las que más cambian. C) Pueden cambiar, así que hay que copiar la matriz. D) Solo cambian las que valen ∞.

A. No cambian: ir de i a k pasando por k cuesta C[i][k] + C[k][k] = C[i][k] + 0. Por eso Floyd puede trabajar sobre una sola matriz de n × n.

#### 11. Votación: con monedas {1, 3, 4} y la tabla llena hasta x = 5 (m = 0, 1, 2, 1, 1, 2), ¿qué cuenta llena m(6)? A) 1 + m(2). B) 1 + min(m(5), m(3), m(2)). C) min(m(5), m(3), m(2)). D) 1 + m(5).

B. Se prueba cada moneda como la última y se suma esa moneda: 1 + min(2, 1, 2) = 2 (dos monedas de 3). La A es la elección greedy y da 3.

---

## Clase 12: DA Programación Dinámica 2

#### 1. ¿Puede un problema tener subestructura óptima pero no subproblemas solapados? ¿Qué técnica usarías en ese caso?

Sí, ocurre en problemas como Merge Sort: hay subestructura óptima pero los subproblemas son disjuntos. En ese caso, Divide & Conquer es suficiente y más natural; agregar memoización no aportaría ninguna mejora.

#### 2. ¿Por qué la mochila 0/1 necesita PD y la mochila fraccionaria se resuelve con Greedy?

En la mochila fraccionaria siempre conviene tomar primero el objeto con mayor valor por kilo, lo que hace que la elección greedy sea globalmente óptima. En la 0/1 no se puede fraccionar, por lo que una elección localmente buena puede bloquear combinaciones mejores.

#### 3. ¿Qué hace que un problema sea "difícil"? ¿Es una propiedad del problema o del enfoque elegido?

La dificultad no es solo del problema sino de cómo lo formulamos. Un problema exponencial con fuerza bruta puede volverse polinomial si encontramos la estructura correcta de subproblemas. La técnica no cambia el problema; cambia la forma en que lo vemos.

#### 4. ¿Se les ocurre un problema cotidiano que tenga estructura de PD?

Ejemplos posibles: planificar una dieta semanal maximizando nutrición con presupuesto fijo, elegir qué estudiar cada día antes de un examen con energía limitada, calcular la ruta más rápida en una ciudad con tráfico variable. El patrón es siempre el mismo: decisiones secuenciales donde el estado futuro depende de decisiones pasadas.

### Votaciones de clase (agregadas desde las diapositivas)

*Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la misma clase.*

#### 5. Votación: casas en fila con valores [5, 7, 6, 1, 2, 4], sin robar dos vecinas, con dp[i] = max(dp[i-1], dp[i-2] + v[i]). ¿Cuánto vale dp en la última casa? A) 12. B) 13. C) 15. D) 25.

C. 15. La tabla queda 5, 7, 11, 11, 13, 15 (por ejemplo, casas de valor 5 + 6 + 4).

#### 6. Votación: en la distancia de edición, ¿cuánto vale la celda edit("ins", "i")? A) 0. B) 1. C) 2. D) 4.

C. 2: la "i" ya coincide y alcanza con borrar la "n" y la "s".
