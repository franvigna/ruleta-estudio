---
tema: da-recursividad
---

## ¿Qué es una función recursiva y qué partes debe tener?
<!-- id: t2.1 | tipo: teorica -->

Es una función que se llama a sí misma en su propio cuerpo. Debe tener un **caso base**, con la condición de corte que no vuelve a recurrir, y un **caso recursivo**, donde se llama a sí misma con una entrada más pequeña. Puede haber más de un caso base o más de un caso recursivo, pero no menos.

## ¿Qué diferencia hay entre recursividad directa e indirecta?
<!-- id: t2.2 | tipo: teorica -->

En la directa, la función se invoca a sí misma. En la indirecta, una función llama a otra y esa otra llama a la original, alternándose (ejemplo: EsPar llama a EsImpar y EsImpar llama a EsPar).

## ¿Qué es una función wrapper y para qué sirve con la recursión?
<!-- id: t2.3 | tipo: teorica -->

Es una función que el llamador invoca y que a su vez invoca a otra. Se usa para ocultar parámetros auxiliares de la recursión: Sumar(lista) llama a _sumarRecursivo(lista, 0), así el usuario no tiene que pasar el índice inicial.

## ¿Qué es el stack de llamadas y qué pasa con él en un algoritmo recursivo?
<!-- id: t2.4 | tipo: teorica -->

Es la estructura que almacena la información de las subrutinas activas del programa. Cada llamada apila un registro de activación nuevo, y se desapila cuando la llamada termina. En la recursión, se apila un registro por cada llamada pendiente, así que la profundidad de la recursión determina cuánta memoria se usa.

## ¿Qué es un stack overflow y cuándo ocurre?
<!-- id: t2.5 | tipo: teorica -->

Es el desbordamiento de la pila: si no hay caso base (o nunca se alcanza), ningún registro se desapila y la pila crece hasta agotar la memoria disponible.

## ¿Cuáles son los errores comunes al escribir recursión?
<!-- id: t2.6 | tipo: teorica -->

* **Sin caso base**: la recursión nunca corta.
* **Caso base inalcanzable**: existe, pero el parámetro se aleja de él (Sumatoria(n + 1) con base en n = 0).
* **El problema no se reduce**: se llama con la misma entrada (BuscarElemento(lista, objetivo) sin achicar la lista).

## ¿Cuándo conviene la recursividad y cuándo la iteración?
<!-- id: t2.7 | tipo: teorica -->

Iteración: cuando el rendimiento o la memoria son críticos (sistemas embebidos, datos masivos), el problema es lineal (recorrer una lista, sumar números) o no se puede correr riesgo por profundidad de llamadas. Recursividad: cuando la estructura es recursiva por naturaleza (árboles, grafos, sistemas de archivos), en división y conquista (QuickSort, MergeSort), o cuando se prioriza claridad sobre micro-optimización. Regla práctica: si se resuelve con un for, iterá; si al iterar ves que necesitás una pila, usá recursividad.

## Pero… ¿cómo medimos el costo de un algoritmo recursivo?
<!-- id: rcf14b79c33 | tipo: reflexion | nota: Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase. -->

Planteando una **relación de recurrencia**: una ecuación que expresa T(n) en función del costo de instancias más chicas del mismo problema, con un caso base y un caso recursivo. Después se resuelve por telescopía, con un árbol de recursión o, si tiene la forma a·T(n/b) + nᶜ, con el Teorema Maestro.

## ¿Qué diferencias hay entre Recursividad e Iteración?
<!-- id: re752a3b543 | tipo: reflexion -->

| Recursividad | Iteración |
| --- | --- |
| + Código más expresivo | + Mayor eficiencia |
| + Natural para problemas con estructura recursiva | + Seguridad de memoria |
| - Overhead al invocar funciones | - Código más imperativo |
| - Riesgo de stack overflow | - Menos natural en estructuras recursivas (árboles/grafos) |
