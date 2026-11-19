---
tema: da-division-y-conquista
---

## ¿En qué consiste la técnica de División y Conquista?
<!-- id: t3.1 | tipo: teorica -->

Un problema grande se divide en subproblemas más chicos del mismo tipo, cada uno se resuelve en forma independiente y luego las soluciones parciales se combinan. Si los subproblemas siguen siendo grandes, se aplica la misma idea recursivamente hasta llegar a casos que se resuelven directamente.

## ¿Cuáles son los tres pasos formales?
<!-- id: t3.2 | tipo: teorica -->

* **Dividir**: partir el problema de tamaño n en subproblemas de tamaño n/b.
* **Conquistar**: resolver recursivamente cada subproblema.
* **Combinar**: operar sobre las soluciones parciales para obtener la del problema original.

La recurrencia resultante es T(n) = a · T(n/b) + f(n), donde f(n) es el costo de dividir y combinar.

## ¿Por qué hace falta una estrategia distinta a los ordenamientos elementales?
<!-- id: t3.3 | tipo: teorica -->

Burbujeo, selección e inserción son O(n²): si el arreglo crece 10 veces, el tiempo crece 100 veces. Con 10⁶ elementos serían del orden de 10¹² operaciones. Comparar todos con todos ya no sirve; hay que dividir el problema.

## ¿Siempre conviene aplicar División y Conquista?
<!-- id: t3.4 | tipo: teorica -->

No. Buscar el máximo de un arreglo desordenado cuesta O(n) tanto en forma lineal como dividiendo a la mitad y quedándose con el mayor de cada parte. La pregunta clave es si la división reduce el trabajo o solamente lo redistribuye.

## ¿Cómo funciona la búsqueda binaria como División y Conquista y cuál es su complejidad?
<!-- id: t3.5 | tipo: teorica -->

Requiere el arreglo ordenado. Caso base: sub-arreglo de tamaño 0 o 1. Dividir: se mira el elemento del medio y se decide con qué mitad quedarse. Conquistar: se llama recursivamente solo sobre esa mitad. Combinar: es trivial, no hay nada que juntar. T(n) = T(n/2) + 1 → a = 1, b = 2, c = 0 → caso 2 → O(log n). Su árbol es una cadena de log₂ n + 1 niveles con costo constante.

## ¿Cómo se calcula Xⁿ con División y Conquista y por qué es O(log n)?
<!-- id: t3.6 | tipo: teorica -->

Si n es par, Xⁿ = X^(n/2) · X^(n/2); si es impar, X · X^((n-1)/2) · X^((n-1)/2). La clave es calcular la media potencia **una sola vez** y guardarla en una variable, así hay una única llamada: T(n) = T(n/2) + c → O(log n).

## ¿Cómo funciona la fusión ordenada y cuánto cuesta?
<!-- id: t3.7 | tipo: teorica -->

Recorre los dos arreglos ordenados a la vez, toma siempre el menor de los dos elementos actuales y avanza en ese arreglo; cuando uno se agota, copia lo que queda del otro. Es lineal en la cantidad total de elementos: O(n).

## ¿Cómo funciona MergeSort y qué hace en cada paso de DyC?
<!-- id: t3.8 | tipo: teorica | etiqueta: Tomada en parciales -->

Dividir: parte el arreglo a la mitad. Conquistar: ordena recursivamente cada mitad. Combinar: fusiona las dos mitades ordenadas con la fusión ordenada. El caso base es un arreglo de 0 o 1 elementos.

## ¿Cuál es la recurrencia de MergeSort y cómo se resuelve con los tres métodos?
<!-- id: t3.9 | tipo: teorica -->

T(n) = 2T(n/2) + n - 1 (contando las comparaciones de la fusión). Telescopía: T(n) = Σ (n - 2ⁱ) para i de 0 a log₂n - 1 = n · log₂ n - (n - 1) → O(n log n). Árbol: log₂ n + 1 niveles, cada uno cuesta n → O(n log n). Teorema Maestro: a = 2, b = 2, c = 1 (el -1 no cambia la clase); log₂(2) = 1 = c → caso 2 → O(n log n).

## ¿Por qué el árbol de MergeSort cuesta n por nivel y cuántos niveles tiene?
<!-- id: t3.10 | tipo: teorica -->

Porque en cada nivel los sub-arreglos, sumados, siempre tienen los n elementos, y la fusión es lineal en ellos. Tiene log₂ n + 1 niveles porque el tamaño se divide a la mitad en cada nivel.

## ¿Cómo se argumenta que MergeSort es correcto?
<!-- id: t3.11 | tipo: teorica -->

Por inducción: si MergeSort ordena correctamente arreglos de tamaño n/2, y la fusión preserva el orden, entonces ordena correctamente arreglos de tamaño n.

## ¿Qué limitaciones tiene MergeSort?
<!-- id: t3.12 | tipo: teorica -->

Necesita un arreglo auxiliar de tamaño n para la fusión: O(n) de memoria adicional, así que **no es en el lugar** (inserción y selección sí lo son). Además, durante la fusión el acceso a memoria no es secuencial, lo que puede perjudicar el uso de caché en arreglos muy grandes.

## ¿MergeSort es estable? ¿Es sensible a la entrada?
<!-- id: t3.13 | tipo: teorica | etiqueta: Tomada en parciales -->

Es **estable**: en la fusión, ante empate (A[i] ≤ B[j]) toma primero el elemento de la mitad izquierda, que venía antes en el original. **No es sensible**: siempre divide a la mitad y la fusión siempre recorre los n elementos, así que es O(n log n) en todos los casos, sin importar cómo venga la entrada.

## ¿Cómo funciona QuickSort?
<!-- id: t3.14 | tipo: teorica -->

Elige un elemento llamado pivote y reorganiza el arreglo (partición, O(n)) para que todo lo menor quede a su izquierda y todo lo mayor a su derecha. Después ordena recursivamente cada lado. La división ya hace el trabajo útil; la combinación es trivial. Responde a la pregunta de si se puede ordenar sin memoria extra.

## ¿Qué estrategias hay para elegir el pivote y qué problema tiene cada una?
<!-- id: t3.15 | tipo: teorica -->

* **Primer o último elemento**: funciona bien con entrada aleatoria, pero es O(n²) si la entrada ya está ordenada.
* **Pivote aleatorio**: más seguro, pero generar buenos números aleatorios es costoso respecto del resto del algoritmo.
* **Mediana de tres**: la mediana entre el primero, el último y el del medio; da particiones más balanceadas.

## ¿Cuáles son las recurrencias de QuickSort en mejor, peor y caso general?
<!-- id: t3.16 | tipo: teorica -->

* Mejor caso (pivote siempre al medio): T(n) = 2T(n/2) + O(n) → O(n log n).
* Peor caso (pivote siempre en un extremo): T(n) = T(n - 1) + O(n) → O(n²); el árbol es una cadena de n + 1 niveles.
* Caso general (pivote en proporción k): T(n) = T(n/k) + T((k-1)n/k) + O(n) → O(n log n).

## ¿En qué condición el peor caso de QuickSort es O(n²) y cómo se mitiga?
<!-- id: t3.17 | tipo: teorica | etiqueta: Tomada en parciales -->

Cuando el pivote cae consistentemente en un extremo, por ejemplo tomando el primer elemento de un arreglo ya ordenado: cada partición deja un lado vacío y el otro con n - 1 elementos. Se mitiga eligiendo mejor el pivote: aleatorio o mediana de tres.

## ¿Por qué aunque el pivote parta 90/10 QuickSort sigue siendo O(n log n)?
<!-- id: t3.18 | tipo: teorica -->

Porque T(n) = T(n/10) + T(9n/10) + cn solo cambia la altura del árbol, que sigue siendo proporcional a log n, y cada nivel sigue costando a lo sumo n. El peor caso aparece únicamente con una mala elección consistente del pivote.

## ¿QuickSort es estable? ¿Qué memoria usa?
<!-- id: t3.19 | tipo: teorica -->

No es estable. Ordena en el propio arreglo (O(1) extra en el array) pero usa O(log n) en la pila de recursión.

## Compará MergeSort y QuickSort.
<!-- id: t3.20 | tipo: teorica -->

| | MergeSort | QuickSort |
| --- | --- | --- |
| Peor caso | O(n log n) garantizado | O(n²), mitigable con buen pivote |
| Caso promedio | O(n log n) | O(n log n) |
| Memoria extra | O(n) | O(1) en el array + O(log n) en el stack |
| Estable | Sí | No |
| Dónde hace el trabajo | Al combinar (fusión) | Al dividir (partición) |

## ¿Cuál es el límite inferior del ordenamiento por comparación?
<!-- id: t3.21 | tipo: teorica -->

Cualquier algoritmo que ordene solo comparando pares necesita al menos log(n!) comparaciones para alguna entrada. Como log(n!) es del mismo orden que log(nⁿ) = n log n, **ningún ordenamiento por comparación puede ser mejor que n log n**. Por eso MergeSort y HeapSort son asintóticamente óptimos.

## ¿Qué es QuickSelect y en qué se diferencia de QuickSort?
<!-- id: t3.22 | tipo: teorica -->

Encuentra el k-ésimo elemento más pequeño sin ordenar todo el arreglo, usando la partición de QuickSort. La diferencia es que después de partir sigue solo por el lado donde está la posición k, no por los dos. En el caso promedio T(n) = T(n/2) + n → caso 1 → O(n); en el peor, T(n) = T(n - 1) + n → O(n²). La solución naive de ordenar todo y tomar la posición k cuesta O(n log n).

## ¿Cuáles son los tres pasos de División y Conquista y qué hace cada uno en MergeSort específicamente?
<!-- id: r0e401abb40 | tipo: reflexion -->

Dividir: parte el arreglo a la mitad. Conquistar: ordena recursivamente cada mitad. Combinar: fusiona las dos mitades ordenadas con la fusión ordenada. El caso base es un arreglo de 0 o 1 elementos.

## ¿Por qué el árbol de recursión de MergeSort tiene costo O(n) por nivel, y cuántos niveles tiene?
<!-- id: r7a438b2970 | tipo: reflexion -->

Porque en cada nivel los sub-arreglos, sumados, siempre tienen los n elementos, y la fusión es lineal en ellos. Tiene log₂ n + 1 niveles porque el tamaño se divide a la mitad en cada nivel.

## ¿En qué condición el caso peor de QuickSort es O(n²) y cómo se puede mitigar?
<!-- id: r196a6792e8 | tipo: reflexion -->

Cuando el pivote cae consistentemente en un extremo, por ejemplo tomando el primer elemento de un arreglo ya ordenado: cada partición deja un lado vacío y el otro con n - 1 elementos. Se mitiga eligiendo mejor el pivote: aleatorio o mediana de tres.

## ¿Qué significa que un algoritmo de ordenamiento sea estable, y cuál de los dos algoritmos vistos cumple esa propiedad?
<!-- id: r16b5e82fd5 | tipo: reflexion -->

Que ante dos elementos con la misma clave de ordenamiento se conserva su orden original. De los dos, **MergeSort** es estable: en la fusión, ante un empate toma primero el elemento de la mitad izquierda, que venía antes. QuickSort no es estable.

## ¿Por qué la recurrencia T(n) = T(n-1) + n no puede resolverse con el Teorema Maestro, y cuál es su solución por sustitución?
<!-- id: r08f182b8ca | tipo: reflexion -->

Porque el tamaño se reduce restando 1, no dividiendo: no tiene la forma a · T(n/b). Por sustitución: T(n) = T(1) + 2 + 3 + … + n = T(1) + n(n+1)/2 - 1 → O(n²). Es la recurrencia del peor caso de QuickSort.
