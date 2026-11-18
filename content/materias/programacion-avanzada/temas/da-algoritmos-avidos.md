---
tema: da-algoritmos-avidos
---

## ¿Qué es un algoritmo ávido (greedy)?
<!-- id: t5.1 | tipo: teorica -->

Un algoritmo que siempre hace la elección que parece mejor en el momento: elige el óptimo local con la esperanza de llegar al óptimo global. Nunca revisa una decisión ya tomada.

## ¿Qué propiedades debe tener un problema para que greedy funcione?
<!-- id: t5.2 | tipo: teorica -->

**Subestructura óptima**: la solución óptima del problema contiene las soluciones óptimas de sus subproblemas. **Propiedad de elección ávida**: la elección localmente óptima forma parte de alguna solución óptima global; es difícil de probar y se demuestra, por ejemplo, por intercambio.

## ¿Qué significa subestructura óptima y cómo se reconoce?
<!-- id: t5.3 | tipo: teorica -->

Que tomar la mejor decisión ahora no arruina el resto, y que el subproblema que queda se resuelve de forma óptima con el mismo criterio. Se reconoce preguntando: si tengo la solución óptima y corto el problema en cualquier punto, ¿lo que queda también es óptimo? Suele darse en problemas secuenciales o acumulativos (rutas, intervalos, secuencias, selección de a un elemento). No se da cuando las decisiones tienen efectos secundarios entre sí o el valor de una elección depende de las otras; ahí se usa programación dinámica.

## ¿Qué es la “trampa ávida”?
<!-- id: t5.4 | tipo: teorica -->

Que elegir lo mejor ahora puede ser lo peor al final: la elección localmente óptima bloquea la solución globalmente óptima. En el ejemplo del árbol, elegir siempre el hijo de mayor valor da 10 + 9 + 2 = 21, cuando el óptimo es 10 + 3 + 25 = 38.

## ¿Cuáles son las ventajas y desventajas de greedy?
<!-- id: t5.5 | tipo: teorica -->

Ventajas: simple de implementar, eficiente en tiempo y memoria, suficiente para muchos problemas reales. Desventajas: no siempre es óptimo, es difícil de probar y puede requerir una transformación previa (como ordenar).

## ¿Cuál es el criterio greedy del cambio de moneda y qué complejidad tiene?
<!-- id: t5.6 | tipo: teorica -->

Entregar la mayor cantidad posible de la denominación más grande sin pasarse, y seguir con la siguiente (con DIV y MOD). Es O(n) en la cantidad de denominaciones; como esa lista es fija, el bucle no depende del monto y en la práctica es O(1).

## ¿El cambio greedy es siempre óptimo?
<!-- id: t5.7 | tipo: teorica -->

No. Es óptimo con sistemas canónicos de denominaciones (como el argentino o el euro) y falla con sistemas arbitrarios. Con 100, 200, 500, 800 y 1000 para pagar 2400, greedy da 1000 + 1000 + 200 + 200 (4 piezas) cuando el óptimo es 800 · 3 (3 piezas). Para el caso general hace falta programación dinámica.

## ¿En qué consiste el problema de selección de actividades y qué criterio greedy es óptimo?
<!-- id: t5.8 | tipo: teorica -->

Hay n actividades con inicio sᵢ y fin fᵢ que compiten por un recurso exclusivo; dos son compatibles si sus intervalos [sᵢ, fᵢ) no se solapan. Se busca el conjunto compatible de tamaño máximo. El criterio óptimo es elegir la actividad que **termina antes** entre las compatibles con las ya elegidas, porque deja libre el recurso lo antes posible y desbloquea más actividades futuras. Se demuestra óptimo por intercambio.

## ¿Qué complejidad tiene el selector de actividades?
<!-- id: t5.9 | tipo: teorica -->

O(n log n) si hay que ordenar las actividades por hora de fin; O(n) si ya vienen ordenadas, porque solo se recorren una vez comparando el inicio de cada una con el fin de la última elegida.

## ¿Para qué sirven los códigos de longitud variable y qué es un código libre de prefijos?
<!-- id: t5.10 | tipo: teorica -->

ASCII gasta 8 bits por carácter sin importar su frecuencia. Con códigos de longitud variable, los símbolos más frecuentes reciben códigos más cortos y el mensaje ocupa menos. Para poder decodificar sin ambigüedad el código debe ser **libre de prefijos**: ningún código es prefijo de otro (0, 10, 110, 111 sirve; 0, 01, 011 no).

## ¿Cómo se construye el árbol de Huffman?
<!-- id: t5.11 | tipo: teorica -->

Se crea una hoja por símbolo con su frecuencia y se insertan en un min-heap. Mientras quede más de un nodo, se extraen los dos de menor frecuencia y se los fusiona en un nodo interno cuya frecuencia es la suma, que vuelve al heap. El nodo que queda es la raíz; el código de cada símbolo es el camino desde la raíz hasta su hoja.

## ¿Qué complejidad tiene Huffman?
<!-- id: t5.12 | tipo: teorica -->

O(n log n): se hacen O(n) fusiones, y cada extracción e inserción en el heap cuesta O(log n).

## ¿Por qué Huffman es óptimo?
<!-- id: t5.13 | tipo: teorica -->

Por intercambio: si en un árbol óptimo los dos nodos más profundos no fueran los de menor frecuencia, se podrían intercambiar con ellos sin aumentar el costo. El costo del árbol es Σ frecuencia(símbolo) × profundidad(símbolo), y poner los más frecuentes más cerca de la raíz minimiza esa suma. Resultado: Huffman produce siempre el código libre de prefijos de costo mínimo para esas frecuencias.

## Compará los tres ejemplos de greedy de la clase.
<!-- id: t5.14 | tipo: teorica -->

| | Cambio de moneda | Plan de actividades | Huffman |
| --- | --- | --- | --- |
| Criterio | Mayor denominación posible | Menor hora de fin compatible | Fusionar los dos de menor frecuencia |
| ¿Siempre óptimo? | No, falla con denominaciones arbitrarias | Sí, por intercambio | Sí, por intercambio |
| Complejidad | O(n) en denominaciones | O(n log n) con orden, O(n) sin | O(n log n) por el heap |

## ¿Por qué la mochila fraccionaria se resuelve con greedy?
<!-- id: t5.15 | tipo: teorica -->

Se calcula el valor por kilo de cada objeto, se ordena de mayor a menor y se toma cada uno entero mientras entre; del último se toma la fracción que completa la capacidad. Como se pueden llevar fracciones, la capacidad se aprovecha al 100% y siempre conviene llenar cada kilo con el producto que más vale por kilo. Si se tomara una unidad de peso de un producto con menor valor por kilo existiendo todavía uno mejor, cambiarla por la mejor aumentaría el valor total.

## ¿Cuál es la estrategia greedy en el problema del combustible?
<!-- id: t5.16 | tipo: teorica -->

Recargar en la última estación alcanzable con el tanque actual, es decir, cargar lo más tarde posible sin quedarse sin combustible. Así se minimiza la cantidad de paradas.

## ¿Un greedy que asigna siempre el par de menor costo disponible garantiza la asignación óptima?
<!-- id: t5.17 | tipo: teorica -->

No (ejercicio de Ollivanders). Elegir siempre el menor costo restante puede dejarle a otro mago solo varitas caras: la mejor opción de un mago puede ser una varita que ya se le asignó a otro. El algoritmo es O(n² log n), mucho mejor que el O(n!) de probar todas las asignaciones, pero no garantiza el óptimo.

## ¿Podría Huffman construir un árbol subóptimo si el heap no estuviera bien implementado?
<!-- id: r969c954c4f | tipo: reflexion -->

Sí. La optimalidad depende de que en cada paso se fusionen exactamente los dos nodos de menor frecuencia: ese extractMin es el paso greedy completo. Si el heap lo devuelve mal (bug, no empates: los empates no cambian el costo final), el árbol sigue siendo un código válido y libre de prefijos, pero deja de ser el de menor cantidad de bits. La corrección de Huffman depende 100% de la corrección del heap.

## ¿Por qué el greedy de scheduling falla si el criterio es “menor duración” en vez de “menor fin”?
<!-- id: r86c087dfc3 | tipo: reflexion -->

Porque la duración no dice nada sobre cuánto tiempo libre deja para lo que sigue… sólo el momento en que termina lo dice. Contraejemplo rápido: A=[0,4], B=[5,9], C=[3,6]. C es la más corta, pero se solapa con A y con B, así que “menor duración” elige sólo C. El óptimo es {A,B}: el doble de actividades.

## ¿Qué propiedad comparten los tres problemas que hace que el greedy funcione (al menos en dos de ellos)?
<!-- id: r0f324a765d | tipo: reflexion -->

Los tres tienen subestructura óptima: después de la primera elección, lo que queda es una instancia más chica del mismo problema. Pero esa propiedad la tienen los tres siempre, incluso Cambio de Moneda cuando falla (por eso ahí funciona Programación Dinámica igual). Lo que además tienen Actividades y Huffman, y por eso greedy nunca falla en esos dos, es la propiedad de elección ávida: se puede demostrar por intercambio que la primera elección local siempre forma parte de alguna solución óptima global. Cambio de Moneda sólo cumple esta segunda propiedad con sistemas canónicos de denominaciones.
