---
tema: da-fuerza-bruta
---

## ¿Qué es la fuerza bruta y qué características tiene?
<!-- id: t9.1 | tipo: teorica -->

Una técnica que enumera todos los candidatos y evalúa cada uno. No usa la estructura del problema para descartar candidatos; si la solución existe y el espacio es finito, la encuentra; suele ser ineficiente para entradas grandes; y sirve como base de comparación para otros algoritmos.

## ¿Qué es el espacio de búsqueda y por qué hay que estimarlo antes?
<!-- id: t9.2 | tipo: teorica -->

Es el conjunto de todas las configuraciones posibles del problema; la fuerza bruta lo recorre generando y evaluando cada candidato. Hay que estimar su tamaño antes de elegir la estrategia: más variables implican un espacio más grande y un costo exponencial.

## ¿Cómo se calcula la complejidad de un algoritmo de fuerza bruta?
<!-- id: t9.3 | tipo: teorica -->

Tiempo ≈ (cantidad de candidatos) × (costo de evaluar uno). El espacio es lineal si los candidatos se generan sobre la marcha, pero si se guardan crece como la complejidad temporal.

| Ejemplo | Espacio de búsqueda | Costo |
| --- | --- | --- |
| Búsqueda secuencial | Posiciones del arreglo | O(n) |
| Divisores | Candidatos de 1 a √n | O(√n) |
| SAT | Asignaciones V/F | O(2ⁿ · m) |
| Superpermutación mínima | Órdenes de permutaciones | O((n!)! …) |

El método es el mismo en los cuatro: lo que cambia es el tamaño del espacio.

## ¿Por qué en divisores alcanza con llegar a √n? ¿Deja de ser fuerza bruta?
<!-- id: t9.4 | tipo: teorica -->

Porque los divisores vienen de a pares (d y n/d), así que al encontrar uno se obtiene el otro. Pasa de O(n) a O(√n), pero sigue probando candidatos uno por uno: es una mejora dentro de la fuerza bruta.

## ¿Cómo sería un ordenamiento por fuerza bruta?
<!-- id: t9.5 | tipo: teorica -->

El espacio de estados son las n! permutaciones del arreglo. Se genera cada permutación y se verifica si está ordenada (O(n)). La complejidad es O(n! · n).

## ¿Qué ventajas y límites tiene la fuerza bruta?
<!-- id: t9.6 | tipo: teorica -->

Ventajas: encuentra la solución si existe; prueba que no existe si no la hay; es simple de escribir y verificar; sirve de oráculo para probar otros algoritmos. Límites: crecimiento exponencial o factorial, inviable para entradas medianas, ignora información útil del problema y exige un espacio finito y numerable.

## ¿Cuándo conviene usar fuerza bruta?
<!-- id: t9.7 | tipo: teorica -->

Cuando el espacio de búsqueda es pequeño o acotado; cuando el costo de un error es inaceptable y se necesita una solución exacta garantizada; para verificar o comparar un algoritmo más eficiente; cuando el problema no ofrece estructura aprovechable; o como último recurso o primer experimento.

## ¿Qué lugar ocupa la fuerza bruta respecto de las demás técnicas?
<!-- id: t9.8 | tipo: teorica -->

Es el punto de partida: cada técnica de diseño es una forma de reducir el espacio de búsqueda. Fuerza bruta prueba todo; división y conquista resuelve partes chicas y combina; greedy sigue una sola rama; backtracking y ramificación y poda podan. También es la cota superior de NP: todo problema de NP se resuelve probando todos los certificados.

## ¿Puede un algoritmo de fuerza bruta ser óptimo? ¿En qué casos?
<!-- id: rcff93c280d | tipo: reflexion -->

Sí, cuando el espacio de búsqueda es pequeño o no hay estructura aprovechable. Ejemplo: búsqueda en arreglo desordenado.

## ¿Qué significa que un problema sea NP-completo en términos de fuerza bruta?
<!-- id: r15ac5e2e57 | tipo: reflexion -->

Que no se conoce algoritmo eficiente exacto. La fuerza bruta es la única garantía de solución correcta.

## Si se reduce el espacio de búsqueda a la mitad, ¿cuánto mejora en O(2ⁿ)?
<!-- id: r0fd5aa5352 | tipo: reflexion -->

Solo un paso menos: O(2ⁿ⁻¹) = O(2ⁿ)/2. La complejidad no cambia de orden. El costo sigue siendo exponencial.

## ¿Cuándo se preferiría fuerza bruta sobre un algoritmo más eficiente pero aproximado?
<!-- id: r96470168d7 | tipo: reflexion -->

Cuando el costo de una solución incorrecta es inaceptable y el espacio es tratable.

## ¿Qué tienen en común todos los ejemplos vistos hoy?
<!-- id: r2c47cda63c | tipo: reflexion -->

Todos generan candidatos sistemáticamente y los evalúan uno a uno sin atajos.

## En el problema del candado de 3 dígitos, ¿por qué la fuerza bruta fue la respuesta correcta?
<!-- id: r741b9320cd | tipo: reflexion | etiqueta: Agregada desde las diapositivas -->

Cuando el espacio era pequeño y necesitábamos certeza. La fuerza bruta no es una rendición. Es una decisión de diseño consciente, justificada, y a veces la única honesta.
