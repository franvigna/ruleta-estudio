---
tema: cc-relaciones-de-recurrencia
---

## ¿Qué es una relación de recurrencia y qué partes tiene?
<!-- id: t2.8 | tipo: teorica -->

Es una ecuación que expresa el costo T(n) de un algoritmo en función del costo de instancias más pequeñas del mismo problema. Tiene un caso base, con un valor concreto, y un caso recursivo, expresado en función de algo menor que n.

## ¿Cómo se plantea la recurrencia a partir del código?
<!-- id: t2.9 | tipo: teorica -->

Se mira cuántas llamadas recursivas hace cada invocación, con qué tamaño, y cuánto cuesta el trabajo fuera de ellas. Factorial: una llamada con n - 1 más trabajo constante → T(n) = T(n - 1) + k₂, con T(1) = k₁. Contar dígitos: una llamada con n/10 → T(n) = T(n/10) + k₁. Fibonacci: dos llamadas → T(n) = T(n - 1) + T(n - 2) + k.

## ¿En qué consiste el método de sustitución o telescópico?
<!-- id: t2.10 | tipo: teorica -->

En “desenrollar” la recurrencia con sustituciones sucesivas hasta el caso base. Se reemplaza T(n - 1) por su propia expresión, luego T(n - 2), y así hasta encontrar el patrón general en función de i (en factorial, T(n) = T(n - i) + i · k₂). Después se despeja i para llegar al caso base (n - i = 1 → i = n - 1), se reemplaza y queda una expresión cerrada (k₁ + (n - 1) · k₂), de la que se obtiene el orden: O(n).

## ¿Qué es el árbol de recursión y cuándo conviene usarlo?
<!-- id: t2.11 | tipo: teorica -->

Es una representación donde cada llamada es un nodo y en él se anota su costo local (lo que hace sin contar a sus hijos). El costo total se obtiene sumando por niveles: si el costo por nivel es constante, el total es ese costo por la altura; si crece o decrece, se suma la serie. Conviene cuando hay más de una llamada recursiva, porque la telescopía se complica, y cuando se quiere intuición visual del comportamiento.

## ¿Por qué Fibonacci recursivo es O(2ⁿ)?
<!-- id: t2.12 | tipo: teorica -->

Porque cada llamada genera dos llamadas más, así que cada nivel del árbol duplica el trabajo del anterior: el árbol crece exponencialmente. Además recalcula muchas veces los mismos subproblemas (fib(3) y fib(2) aparecen repetidos).

## ¿Por qué contar dígitos y búsqueda binaria dan O(log n)?
<!-- id: t2.13 | tipo: teorica -->

Porque en cada paso el tamaño se divide por una constante (10 o 2) y el trabajo fuera de la llamada es constante. Se necesitan i pasos hasta que n/bⁱ llega al caso base, es decir, i = log_b n.

## La telescopía funciona bien para recurrencias simples, pero es tediosa para las más complejas. ¿Existirá algún atajo?
<!-- id: r1d8b47241c | tipo: reflexion | nota: Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase. -->

Sí: el **Teorema Maestro**. Para recurrencias de la forma T(n) = a·T(n/b) + nᶜ alcanza con comparar logb(a) contra c para obtener el orden, sin hacer el desarrollo completo.
