---
tema: cc-teorema-maestro
---

## ¿Para qué sirve el Teorema Maestro y a qué recurrencias se aplica?
<!-- id: t2.14 | tipo: teorica -->

Permite obtener el orden de una recurrencia sin hacer el desarrollo completo. Aplica a recurrencias de la forma T(n) = a · T(n/b) + nᶜ, donde **a** es la cantidad de subproblemas que genera cada llamada, **b** el factor en que se reduce el tamaño, y **nᶜ** el costo del trabajo fuera de la recursión (partir y combinar).

## ¿Qué condiciones deben cumplirse para aplicarlo?
<!-- id: t2.15 | tipo: teorica -->

Al menos un subproblema (a > 0); a entero, no fraccionario; el problema debe reducirse (b > 1); el trabajo extra no puede ser negativo (c ≥ 0); el trabajo fuera de la recursión debe ser polinómico (nᶜ) y positivo; a y b deben ser constantes, no depender de n.

## ¿Cuáles son los tres casos del teorema?
<!-- id: t2.16 | tipo: teorica -->

* **Caso 1**: logb(a) < c → T(n) = O(nᶜ). Domina el trabajo por nivel.
* **Caso 2**: logb(a) = c → T(n) = O(nᶜ · log n). Ambos son comparables.
* **Caso 3**: logb(a) > c → T(n) = O(n^logb(a)). Dominan las llamadas recursivas.

## ¿Cuál es la intuición detrás de los tres casos?
<!-- id: t2.17 | tipo: teorica -->

El teorema compara dos fuerzas: cuánto crece la cantidad de subproblemas (logb(a)) contra cuánto cuesta el trabajo por nivel (c). El costo del nivel i es aⁱ · (n/bⁱ)ᶜ = nᶜ · (a/bᶜ)ⁱ. Si a/bᶜ < 1 el trabajo decrece nivel a nivel y domina la raíz (caso 1); si es 1, cada nivel cuesta lo mismo y se multiplica por la cantidad de niveles, de ahí el log (caso 2); si es mayor que 1, crece hacia abajo y dominan las hojas (caso 3).

## ¿Cuál es la receta para aplicarlo?
<!-- id: t2.18 | tipo: teorica -->

1\) Identificar a, b y c. 2) Calcular logb(a). 3) Compararlo con c. 4) Aplicar el caso. Ejemplo, búsqueda binaria T(n) = 1 · T(n/2) + n⁰: a = 1, b = 2, c = 0; log₂(1) = 0 = c → caso 2 → O(log n). Ejemplo, T(n) = 4 · T(n/2) + n: log₂(4) = 2 > 1 → caso 3 → O(n²).

## Dar ejemplos de recurrencias donde no se puede aplicar el Teorema Maestro y explicar por qué.
<!-- id: t2.19 | tipo: teorica -->

* T(n) = 2T(n - 1) + n²: el tamaño se resta, no se divide; no hay b.
* T(n) = 2ⁿ · T(n/2) + n²: a depende de n.
* T(n) = 2T(n/2) + n / log n: el trabajo extra no es polinómico.
* T(n) = ½ T(n/2) + n: a fraccionario.
* T(n) = T(3n/2) + n: el problema crece (b < 1).
* T(n) = 64T(n/8) - n²: trabajo extra negativo.
* T(n) = T(n/2) + n(2 - cos n): no es polinómico.

## ¿Por qué T(n) = T(n - 1) + n no se resuelve con el Teorema Maestro y cuánto da?
<!-- id: t2.20 | tipo: teorica -->

Porque el tamaño se reduce restando 1, no dividiendo: no tiene la forma a · T(n/b). Por sustitución: T(n) = T(1) + 2 + 3 + … + n = T(1) + n(n+1)/2 - 1 → O(n²). Es la recurrencia del peor caso de QuickSort.

## ¿Cuándo conviene telescopía, árbol de recursión o Teorema Maestro?
<!-- id: t2.21 | tipo: teorica -->

Telescopía: recurrencias simples o cuando se quiere el desarrollo exacto paso a paso. Árbol de recursión: cuando se quiere intuición visual del comportamiento. Teorema Maestro: cuando la recurrencia tiene la forma aT(n/b) + nᶜ y se quiere la respuesta rápido.

## Resumen de Técnicas: ¿cuándo usar cada método?
<!-- id: r116bfe6950 | tipo: reflexion -->

| Método | Cuándo usarlo |
| --- | --- |
| Telescopía/Sustitución | Recurrencias simples, o cuando se desea obtener el desarrollo exacto paso a paso. |
| Árbol de recursión | Cuando se desea intuición visual del comportamiento recursivo |
| Teorema Maestro | Cuando la recurrencia tiene la forma T(n)=aT(n/b)+nᶜ y se desea obtener una respuesta rápidamente. |
