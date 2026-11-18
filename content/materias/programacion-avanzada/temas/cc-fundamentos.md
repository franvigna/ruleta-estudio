---
tema: cc-fundamentos
---

## ¿Qué es un algoritmo y qué características debe cumplir?
<!-- id: t1.1 | tipo: teorica -->

Es un conjunto ordenado de instrucciones bien definidas, no ambiguas y finitas que permite resolver un problema computacional. Debe ser **preciso** (orden exacto de los pasos, sin ambigüedad), **determinista** (misma entrada, mismo resultado), **finito** (termina en una cantidad finita de pasos) y **efectivo** (cada paso se ejecuta en tiempo finito y logra el efecto esperado).

## ¿Puede un mismo problema resolverse con distintos algoritmos? ¿Qué estrategias de diseño se ven en la materia?
<!-- id: t1.2 | tipo: teorica -->

Sí, un mismo problema admite varios algoritmos. Las estrategias de diseño son fuerza bruta, división y conquista, programación dinámica, algoritmos ávidos (greedy), backtracking y ramificación y poda. En cuanto a estructura, un algoritmo puede ser iterativo o recursivo.

## ¿Qué es la eficiencia de un algoritmo y qué recursos se tienen en cuenta?
<!-- id: t1.3 | tipo: teorica -->

Es la medida del costo en recursos que necesita el algoritmo para hacer su tarea: es más eficiente cuantos menos recursos consume. Los recursos principales son el **tiempo de ejecución** y el **espacio de almacenamiento**. También se consideran la claridad de la solución y la facilidad de codificación.

## ¿Qué problemas aparecen al medir y comparar algoritmos, y cómo se resuelve cada uno?
<!-- id: t1.4 | tipo: teorica -->

* **Tamaño de la entrada**: no cuesta lo mismo buscar en 10 elementos que en 1.000.000. Se resuelve expresando el tiempo en función del tamaño: T(n).
* **Valores de la entrada**: con el mismo tamaño, no cuesta lo mismo encontrar el elemento en la primera posición que no encontrarlo. Se resuelve analizando peor, mejor y caso medio.
* **Procesador**: el mismo algoritmo tarda distinto en máquinas distintas. Se resuelve contando operaciones elementales en vez de medir segundos, para que la medida sea independiente de máquina, lenguaje y compilador.

## ¿Qué son el peor caso, el mejor caso y el caso medio?
<!-- id: t1.5 | tipo: teorica -->

Son las tres formas de evaluar el costo según cómo venga la entrada. El peor caso, Tmax(n), es la entrada que más trabajo genera; el mejor caso, Tmin(n), la que menos; el caso medio, Tprom(n), el promedio suponiendo todas las entradas equiprobables. En búsqueda secuencial: peor caso, el elemento no está o es el último (n comparaciones); mejor caso, está primero (1 comparación); caso medio, está en una posición intermedia. El caso medio da una idea más ajustada del comportamiento real, pero puede ser muy difícil de analizar.

## ¿Qué es una operación elemental?
<!-- id: t1.6 | tipo: teorica -->

Una sentencia de costo constante: asignar o consultar una variable simple, comparar dos valores simples, operaciones aritméticas elementales, acceder a una posición de un arreglo o desreferenciar un puntero. La gran mayoría de las sentencias tienen costo constante, aunque esa constante k no sea la misma para todas.

## ¿Qué diferencia hay entre el análisis empírico y el teórico? ¿Qué ventajas tiene el teórico?
<!-- id: t1.7 | tipo: teorica -->

El **empírico** mide tiempos reales de ejecución para entradas concretas en una máquina concreta; su desventaja es que hay que codificar el algoritmo. El **teórico** cuenta operaciones básicas y hace análisis asintótico. Ventajas del teórico: se hace a priori, sin escribir código; vale para todas las instancias; es independiente del lenguaje, de la máquina y de la pericia del programador.

## ¿Cuáles son los pasos de un estudio empírico?
<!-- id: t1.8 | tipo: teorica -->

Definir el caso de prueba, implementar el algoritmo, generar entradas de distintos tamaños (10, 100, 1000…), ejecutar y medir el tiempo en cada una, registrar los resultados, graficar tiempo contra tamaño y deducir la complejidad a partir de la forma de la curva.

## ¿Cómo se calcula T(n) para secuencias, condicionales y bucles?
<!-- id: t1.9 | tipo: teorica -->

* **Secuencia**: la suma de los tiempos de cada sentencia.
* **Condicional**: el tiempo de la condición más el de la rama más costosa (vale igual para if/elsif/else).
* **Bucle con límite constante**: costo constante.
* **Bucle cuyo límite depende de n**: n por el costo del cuerpo.
* **Bucles anidados**: se multiplican las iteraciones (si el interno depende del externo, se resuelve la sumatoria).
* **Variable de control no lineal**: depende de cómo evoluciona; si se duplica en cada vuelta (c = c · 2 hasta N), da log N iteraciones.
* **Llamada a función**: el costo de la función; si es recursiva, da lugar a una relación de recurrencia.

## ¿Qué significa T(n) ∈ O(f(n))?
<!-- id: t1.10 | tipo: teorica -->

Que existen constantes positivas c y n₀ tales que T(n) ≤ c · f(n) para todo n ≥ n₀. Se lee “tiene velocidad de crecimiento f(n)”: T(n) no crece más rápido que f(n), salvo constantes. O(f(n)) no es un número sino el **conjunto** de todas las funciones que no crecen más rápido que f(n), por eso se escribe con ∈.

## ¿Qué diferencia hay entre O, Ω y Θ?
<!-- id: t1.11 | tipo: teorica -->

* **O(f(n))**: cota superior, T no crece más rápido que f.
* **Ω(f(n))**: cota inferior, T no crece más lento que f.
* **Θ(f(n))**: orden exacto, T crece igual que f (las dos cotas coinciden).

## ¿Qué dicen las reglas de la suma y del producto?
<!-- id: t1.12 | tipo: teorica -->

**Suma**: si dos fragmentos se ejecutan uno después del otro, la complejidad total es la del mayor de los dos (se aplica, por ejemplo, a un if/else). **Producto**: si un fragmento se ejecuta dentro de otro, las complejidades se multiplican. Aplicada a bucles: el costo de un for es la cantidad de iteraciones por el costo del cuerpo; para while y do-while se toma la cantidad de iteraciones del peor caso.

## ¿Por qué no importa la base del logaritmo en Big O?
<!-- id: t1.13 | tipo: teorica -->

Porque cambiar de base equivale a multiplicar log n por una constante, y las constantes se descartan. Por eso O(log₂ n) = O(log₃ n) = O(log n).

## ¿Cuáles son los órdenes de complejidad más comunes y dónde aparecen?
<!-- id: t1.14 | tipo: teorica -->

| Orden | Nombre | Dónde aparece |
| --- | --- | --- |
| O(1) | Constante | Instrucciones que se ejecutan una vez, independientes de la entrada |
| O(log n) | Logarítmica | Búsqueda binaria |
| O(n) | Lineal | Bucles simples con cuerpo constante |
| O(n log n) | Cuasi-lineal | División y conquista (MergeSort) |
| O(n²) | Cuadrática | Bucles doblemente anidados; si n se duplica, el tiempo se cuadruplica |
| O(n³) | Cúbica | Triple anidación; si n se duplica, el tiempo se multiplica por 8 |
| O(nᵏ) | Polinómica | Elevada pero computable |
| O(2ⁿ) | Exponencial | Recursión con dos o más llamadas internas |
| O(n!) | Factorial | Probar todas las combinaciones |

## ¿Por qué la velocidad de crecimiento determina el tamaño de problema que se puede resolver?
<!-- id: t1.15 | tipo: teorica -->

Porque fija cuántos datos se procesan en un tiempo razonable. Según la tabla del apunte, con O(n) se manejan del orden de 10⁸ elementos, con O(n log n) unos 4,5 · 10⁶, con O(n²) unos 10.000, con O(n³) unos 500, con O(2ⁿ) unos 27 y con O(n!) apenas 11. Una mejora de hardware no compensa un mal orden de crecimiento.

## ¿Cómo se estima el tiempo de ejecución para otro tamaño de entrada a partir de una medición?
<!-- id: t1.16 | tipo: teorica | etiqueta: Tomada en parciales -->

Se parte de T(n) = c · f(n). Con la medición conocida se despeja c, y con ese c se evalúa el nuevo tamaño. Ejemplo del apunte: selección ordena 2000 elementos en 10 s → c = 10 / 2000² = 2,5 · 10⁻⁶ → T(5000) = 2,5 · 10⁻⁶ · 5000² = 62,5 s. Para saber cuántos elementos entran en un tiempo dado se despeja n de la misma ecuación.

## ¿Qué cambia si la computadora es k veces más rápida?
<!-- id: t1.17 | tipo: teorica | etiqueta: Tomada en parciales -->

La constante c se divide por k, así que para el mismo n el tiempo se divide por k (en el apunte: 90 s con selección pasan a 30 s en una máquina 3 veces más rápida). El orden de complejidad no cambia. La cantidad de elementos extra que se pueden procesar en el mismo tiempo depende de f: en O(n) se procesan k veces más, en O(n²) solo √k veces más, en O(2ⁿ) apenas se suma una cantidad fija de elementos.

## Si duplicar la entrada de inserción duplicó el tiempo, ¿en qué condiciones se hizo la prueba?
<!-- id: t1.18 | tipo: teorica | etiqueta: Tomada en parciales -->

Una relación lineal entre n y el tiempo en inserción solo se da en el mejor caso: el vector ya estaba ordenado, porque ahí inserción es O(n).

## ¿Qué es la complejidad espacial? ¿Puede diferir de la temporal entre dos versiones del mismo algoritmo?
<!-- id: t1.19 | tipo: teorica | etiqueta: Tomada en parciales -->

Es la memoria adicional que necesita el algoritmo en función de n. Dos versiones pueden tener el mismo tiempo y distinto espacio: el factorial iterativo es O(n) en tiempo y O(1) en espacio; el recursivo también es O(n) en tiempo, pero O(n) en espacio porque cada llamada guarda su registro de activación en la pila.

## ¿Cuándo no se puede mejorar la complejidad de un algoritmo?
<!-- id: t1.20 | tipo: teorica | etiqueta: Tomada en parciales -->

Cuando ya alcanza una cota inferior del problema. Si no hay ninguna estructura u orden que aprovechar, hay que revisar cada elemento al menos una vez, así que O(n) es lo mínimo (buscar en un arreglo desordenado o el máximo, por ejemplo). En ordenamiento por comparación, ningún algoritmo baja de n log n. Si la entrada tiene estructura (por ejemplo, está ordenada), sí se puede bajar: de O(n) a O(log n) con búsqueda binaria.

## ¿Cómo funciona el ordenamiento por selección y cuál es su complejidad?
<!-- id: t1.21 | tipo: teorica -->

En cada pasada busca el mínimo del sub-arreglo restante y lo coloca en su posición; hace n - 1 pasadas porque en la última se ordenan los dos elementos que quedan. Hace siempre n(n-1)/2 comparaciones, así que es Θ(n²). No cambia si el arreglo ya está ordenado, porque siempre recorre todo el sub-arreglo para encontrar el mínimo.

## ¿Cómo funciona el ordenamiento por inserción y cuál es su complejidad en mejor y peor caso?
<!-- id: t1.22 | tipo: teorica -->

Toma cada elemento y lo desplaza hacia la izquierda hasta su lugar dentro de la parte ya ordenada. Peor caso: arreglo en orden inverso, cada elemento se compara con todos los anteriores, n(n-1)/2 → O(n²). Mejor caso: arreglo ordenado, el mientras corta en la primera comparación, n - 1 → O(n).

## ¿Por qué inserción no tiene un Θ único? ¿Qué se entiende cuando se dice “inserción es O(n²)”?
<!-- id: t1.23 | tipo: teorica -->

Porque su cota en el mejor caso (n) y en el peor caso (n²) no coinciden, a diferencia de selección. Cuando se dice “es O(n²)” sin aclarar, por convención se habla del peor caso.

## ¿Qué es el centinela en inserción y qué mejora?
<!-- id: t1.24 | tipo: teorica -->

Si se coloca en la posición 0 un valor menor que todos (por ejemplo 0 o -1 si todos son positivos), ningún elemento puede pasarlo, y se elimina la condición pos ≥ 0 del mientras. Se logra con una primera pasada de selección. Cuesta n - 1 comparaciones extra y ahorra n(n-1)/2 controles de índice: **mejora la constante, no el orden**.

## ¿Cuándo conviene selección y cuándo inserción?
<!-- id: t1.25 | tipo: teorica -->

Selección conviene cuando cada posición guarda mucha información, porque hace menos movimientos de datos que inserción (inserción desplaza muchas veces). Inserción conviene con datos casi ordenados, porque reduce mucho las operaciones, y cuando se necesita estabilidad o procesar en línea.

## ¿Qué significa que un algoritmo sea sensible a la entrada?
<!-- id: t1.26 | tipo: teorica -->

Que su tiempo de ejecución varía significativamente según cómo viene la entrada (mejor, peor o caso promedio). Inserción es sensible (n - 1 contra n(n-1)/2); selección no (n(n-1)/2 siempre); burbujeo no lo es, salvo en su versión optimizada.

## ¿Qué significa que un algoritmo de ordenamiento sea estable?
<!-- id: t1.27 | tipo: teorica -->

Que ante dos elementos con la misma clave de ordenamiento, se conserva su orden original en el resultado. Inserción y burbujeo son estables; selección no.

## ¿Qué significa que un algoritmo sea en línea?
<!-- id: t1.28 | tipo: teorica -->

Que puede procesar los datos a medida que llegan, sin tener todos disponibles desde el principio. Inserción y burbujeo son en línea; selección no, porque necesita conocer todos los elementos para encontrar el menor.

## ¿Qué significa que un algoritmo sea en el lugar?
<!-- id: t1.29 | tipo: teorica -->

Que ordena usando solo una cantidad constante de espacio adicional, sobre el propio vector original. Selección e inserción son en el lugar.

## Compará selección, inserción y burbujeo según las cuatro características.
<!-- id: t1.30 | tipo: teorica -->

| | Selección | Inserción | Burbujeo |
| --- | --- | --- | --- |
| Sensible a la entrada | No | Sí | No (sí el optimizado) |
| Estable | No | Sí | Sí |
| En línea | No | Sí | Sí |
| En el lugar | Sí | Sí | Sí |
| Complejidad (peor caso) | O(n²) | O(n²) | O(n²) |

## ¿Las cotas O, Ω y Θ corresponden al peor, al mejor y al caso medio?
<!-- id: t1.31 | tipo: teorica -->

No. Acotan una **función**, no un caso. El mejor y el peor caso son entradas distintas, cada una con su propia T(n), y cualquiera de las tres cotas se puede aplicar a cualquiera de los casos. Es la misma definición tres veces: cambia solo el sentido de la desigualdad.

## ¿Qué significa escribir T(n) = O(f(n))?
<!-- id: t1.32 | tipo: teorica -->

Es la abreviatura que usa casi toda la bibliografía para T(n) ∈ O(f(n)) y significa exactamente lo mismo. Pero ese signo no se comporta como una igualdad: se lee “es de orden”, no “es igual a”.

## ¿Cuánto cuesta el caso promedio de la búsqueda secuencial?
<!-- id: t1.33 | tipo: teorica -->

Suponiendo que el elemento está en el arreglo y puede estar en cualquier posición con la misma probabilidad, se suman los costos de cada caso (1, 2, …, n comparaciones) y se divide por la cantidad de casos. En promedio se recorre la mitad del arreglo, y la mitad de algo que crece linealmente sigue creciendo linealmente: O(n).

## ¿Cómo se deduce la complejidad a partir de un estudio empírico?
<!-- id: t1.34 | tipo: teorica -->

Se mide con entradas de tamaño creciente, duplicando cada vez, repitiendo cada medición varias veces, promediando y descartando las primeras corridas (la máquina todavía está “entrando en calor”). Después se mira qué le pasa al tiempo cuando se duplica n: en la búsqueda secuencial el tiempo se multiplica aproximadamente por 2 en cada fila, lo que confirma que es lineal. Si se multiplicara por 4, sería cuadrático.

## ¿Cómo se calcula el costo de un condicional según el caso analizado?
<!-- id: t1.35 | tipo: teorica -->

Un condicional cuesta evaluar la condición más ejecutar una rama. Los casos difieren solo en qué se supone sobre cuál rama se ejecuta: en el caso promedio se pondera cada rama por la fracción de veces que se toma (f₁ + f₂ = 1). En la práctica se trabaja con el peor caso, así que la regla operativa es la condición más la rama más cara.

## ¿Cuándo aparece la complejidad exponencial O(2ⁿ) en un algoritmo recursivo?
<!-- id: t1.36 | tipo: teorica -->

Cuando hay dos o más llamadas internas y el problema se reduce **restando**, no dividiendo, como en Fibonacci ingenuo. Si el problema se divide (como en MergeSort), no hay crecimiento exponencial.

## ¿Qué se considera un tiempo “razonable” en la tabla de tamaños máximos de entrada?
<!-- id: t1.37 | tipo: teorica -->

Se estima un segundo de cómputo. La tabla muestra cuántos datos se pueden procesar en ese tiempo según la complejidad, en función de cuántas operaciones hace la computadora por segundo.

## ¿Por qué no utilizamos siempre el mejor algoritmo? Es más: si existe un algoritmo óptimo y eficiente… ¿por qué usaríamos uno peor?
<!-- id: r4fa31ad15c | tipo: reflexion | nota: Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase. -->

La eficiencia no es el único criterio: además del tiempo y la memoria importan la claridad de la solución y la facilidad de codificación. Y “el mejor” depende del contexto: inserción gana con datos casi ordenados y selección cuando cada posición guarda mucha información; MergeSort garantiza O(n log n) pero necesita O(n) de memoria extra; y con entradas chicas la diferencia entre órdenes casi no importa, así que puede convenir lo más simple.

## ¿Cómo se calcula en forma teórica el tiempo que tardará la ejecución de un fragmento de código?
<!-- id: re2518ea25d | tipo: reflexion | nota: Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase. -->

Contando operaciones elementales en función del tamaño de la entrada, sin ejecutar nada. Las sentencias simples cuestan una constante, una secuencia suma sus costos, un condicional cuesta la condición más la rama más cara y un bucle multiplica la cantidad de iteraciones por el costo del cuerpo (reglas de la suma y del producto). Con eso se arma T(n) y se expresa su orden con notación asintótica.

## ¿Y en forma empírica?
<!-- id: r547e25f579 | tipo: reflexion | nota: Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase. -->

Implementando el algoritmo y midiendo: se eligen entradas de tamaño creciente (duplicando cada vez), se ejecuta varias veces cada una, se promedia descartando las primeras corridas, y se grafica el tiempo contra el tamaño. Cómo cambia el tiempo al duplicar n muestra la complejidad. La desventaja es que hay que codificar y los resultados dependen de la máquina.

## ¿Puede resolverse exactamente el mismo problema con distintos algoritmos?
<!-- id: rba8cf66219 | tipo: reflexion | nota: Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase. -->

Sí. Un mismo problema admite varios algoritmos, con distintas estrategias de diseño (fuerza bruta, división y conquista, greedy, programación dinámica, backtracking, ramificación y poda) y estructura iterativa o recursiva. Ordenar, por ejemplo, se resuelve con selección, inserción, MergeSort, QuickSort o HeapSort, con costos y propiedades distintas.

## ¿Cuáles eran las cuatro características vistas para los algoritmos de ordenamiento?
<!-- id: r2df0374407 | tipo: reflexion | nota: Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase. -->

**Sensible a la entrada**: su tiempo varía según cómo viene la entrada. **Estable**: conserva el orden original de los elementos con igual clave. **En línea**: puede procesar los datos a medida que llegan. **En el lugar**: ordena usando solo espacio adicional constante.
