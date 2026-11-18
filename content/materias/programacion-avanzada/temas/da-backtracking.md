---
tema: da-backtracking
---

## ¿Qué es backtracking?
<!-- id: t9.9 | tipo: teorica -->

Una técnica que construye candidatos a solución paso a paso y abandona cada candidato apenas detecta que no puede completarse en una solución válida, volviendo sobre sus pasos para extenderlo por otro camino.

## ¿Cómo se representa un problema de backtracking como árbol?
<!-- id: t9.10 | tipo: teorica -->

Cada nodo es un estado parcial, cada rama una decisión y cada hoja una solución o un callejón sin salida. El árbol puede ser enorme, pero no hace falta recorrerlo entero: si una decisión ya viola las condiciones, se abandona toda esa rama. Se recorre en profundidad (DFS).

## ¿En qué se diferencia backtracking de greedy y de fuerza bruta?
<!-- id: t9.11 | tipo: teorica -->

Greedy elige una vez y nunca vuelve atrás; backtracking deshace decisiones, por eso encuentra la solución si existe (siempre que el espacio sea finito y la poda no descarte soluciones válidas). Fuerza bruta genera configuraciones completas y recién ahí las verifica; backtracking poda ramas enteras apenas una decisión parcial es inválida.

## ¿Cuál es el esquema general de backtracking?
<!-- id: t9.12 | tipo: teorica -->

Si S es solución, se termina con éxito. Si no, para cada candidato x que extiende S: si es factible, se registra, se llama recursivamente, y si la llamada tuvo éxito se propaga el éxito sin deshacer; si falló, se borra x y se prueba el siguiente. Si ningún candidato sirvió, se devuelve falso y se vuelve atrás. Las cinco operaciones son EsSolucion, Extender, EsFactible, Registrar y Borrar.

## ¿Cómo se buscan todas las soluciones en lugar de la primera?
<!-- id: t9.13 | tipo: teorica -->

Simulando un fallo: al encontrar una solución, en vez de devolver verdadero se guarda una copia de S y se devuelve falso. El llamador cree que la rama falló, la deshace y sigue probando.

## ¿Cómo se resuelve N-reinas con backtracking?
<!-- id: t9.14 | tipo: teorica -->

Se ubica una reina por fila, empezando por la 0. En la fila actual se prueban columnas de izquierda a derecha hasta encontrar una sin conflicto; se registra y se pasa a la fila siguiente. Si ninguna columna sirve, se borra la reina de la fila anterior y se prueba su columna siguiente. Hay solución cuando hay N reinas.

## ¿Por qué conviene representar N-reinas con un arreglo en vez de una matriz?
<!-- id: t9.15 | tipo: teorica -->

Como hay una reina por fila, alcanza con un arreglo donde la posición es la fila y el valor la columna. Simplifica todo: solución es longitud N; registrar es agregar al final; borrar es quitar el último; extender es un solo ciclo sobre columnas; y la fila no hace falta chequearla porque el arreglo ya garantiza una reina por fila. Con matriz, extender requiere dos ciclos anidados y hay que chequear fila, columna y diagonales.

## ¿Cómo se detecta que dos reinas comparten diagonal?
<!-- id: t9.16 | tipo: teorica -->

Dos casillas están en la misma diagonal si tienen igual fila - columna o igual fila + columna. Factible significa además que la columna no se repita.

## ¿Qué es el coloreo exacto con backtracking y cuáles son sus operaciones?
<!-- id: t9.17 | tipo: teorica -->

Decidir si existe una k-coloración válida para un k dado (a diferencia del greedy, que puede usar más colores de los necesarios). Solución: todos los nodos coloreados válidamente. Extender: probar cada color para el nodo siguiente. Factible: ningún vecino ya coloreado tiene ese color. Registrar: asignar el color. Borrar: desasignarlo.

## ¿Cuáles son las operaciones de backtracking en un Sudoku 4×4?
<!-- id: t9.18 | tipo: teorica -->

S es la matriz con las pistas y 0 en las celdas vacías, recorridas de izquierda a derecha y de arriba hacia abajo. Solución: no quedan ceros. Extender: probar valores de 1 a 4 en la celda vacía actual. Factible: sin repetidos en fila, columna y cuadrante. Registrar: escribir el valor. Borrar: volver la celda a 0.

## ¿Qué es la poda y por qué importa tanto?
<!-- id: t9.19 | tipo: teorica -->

Abandonar una rama apenas se detecta que no lleva a una solución; es lo que separa al backtracking de la fuerza bruta. El desafío es encontrar condiciones de corte baratas de calcular que eliminen muchas ramas sin descartar soluciones. En 8 reinas: cualquier casilla 4.426.165.368 configuraciones; una por fila 8⁸ = 16.777.216; una por fila y columna 8! = 40.320; backtracking para todas las soluciones 15.720; para la primera, 876.

## ¿Cuál es el peor caso de backtracking?
<!-- id: t9.20 | tipo: teorica -->

Cuando la poda casi no corta y se recorre el árbol completo (para N-reinas por filas, del orden de Nᴺ nodos). Pasa cuando las restricciones solo se pueden verificar al final. Sigue siendo exponencial en el peor caso, aunque en la práctica puede ser órdenes de magnitud más rápido que la fuerza bruta.

## ¿Por qué backtracking siempre encuentra una solución si existe, mientras que greedy no lo garantiza?
<!-- id: r595a07c9fc | tipo: reflexion -->

Backtracking explora sistemáticamente todo el espacio de búsqueda y retrocede cada vez que llega a un callejón sin salida, garantizando que ninguna rama quede sin intentar. Greedy toma decisiones irrevocables que pueden bloquear el camino a la solución global sin posibilidad de corrección.

## ¿Qué pasaría si elimináramos la condición esFactible del algoritmo de N-reinas?
<!-- id: r4facb9ca5b | tipo: reflexion -->

El algoritmo seguiría encontrando soluciones, pero exploraría el árbol completo sin descartar ninguna rama, volviendo al costo de la fuerza bruta. El tiempo de ejecución crecería exponencialmente sin ninguna ganancia.

## ¿Cuáles son las cinco operaciones del esquema general de backtracking y qué rol cumple cada una?
<!-- id: r5cf3b6d628 | tipo: reflexion -->

Solución verifica si el estado actual es una respuesta completa y válida. Extender genera las formas posibles de avanzar. Factible decide si una extensión candidata es viable. Registrar incorpora esa extensión al estado actual. Borrar la deshace para explorar otras alternativas.

## En coloreo de grafos con k colores, ¿cuándo decimos que asignar un color a un nodo es factible?
<!-- id: r1072a62203 | tipo: reflexion -->

Una asignación de color a un nodo es factible cuando ninguno de sus vecinos ya coloreados tiene asignado ese mismo color. La condición se verifica recorriendo únicamente los nodos adyacentes que ya fueron procesados.

## ¿En qué tipo de problemas backtracking tiene peor desempeño relativo? ¿Cuándo conviene usarlo de todas formas?
<!-- id: rec427455a4 | tipo: reflexion -->

Backtracking tiene peor desempeño cuando el espacio de estados es grande y las condiciones de poda son débiles, acercándose al comportamiento de fuerza bruta. Conviene usarlo de todas formas cuando el problema es NP-completo y no existe un algoritmo más eficiente conocido, ya que al menos garantiza encontrar la solución si existe.
