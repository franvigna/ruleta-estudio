# Preguntas teóricas: Programación Avanzada

*Respuestas armadas a partir del apunte de clases. Las marcadas con (parcial) aparecen, o se desprenden directamente, de consignas de parciales anteriores.*

---

## Clase 1: CC Fundamentos

### Algoritmos y eficiencia

#### 1.1 ¿Qué es un algoritmo y qué características debe cumplir?

Es un conjunto ordenado de instrucciones bien definidas, no ambiguas y finitas que permite resolver un problema computacional. Debe ser **preciso** (orden exacto de los pasos, sin ambigüedad), **determinista** (misma entrada, mismo resultado), **finito** (termina en una cantidad finita de pasos) y **efectivo** (cada paso se ejecuta en tiempo finito y logra el efecto esperado).

#### 1.2 ¿Puede un mismo problema resolverse con distintos algoritmos? ¿Qué estrategias de diseño se ven en la materia?

Sí, un mismo problema admite varios algoritmos. Las estrategias de diseño son fuerza bruta, división y conquista, programación dinámica, algoritmos ávidos (greedy), backtracking y ramificación y poda. En cuanto a estructura, un algoritmo puede ser iterativo o recursivo.

#### 1.3 ¿Qué es la eficiencia de un algoritmo y qué recursos se tienen en cuenta?

Es la medida del costo en recursos que necesita el algoritmo para hacer su tarea: es más eficiente cuantos menos recursos consume. Los recursos principales son el **tiempo de ejecución** y el **espacio de almacenamiento**. También se consideran la claridad de la solución y la facilidad de codificación.

#### 1.4 ¿Qué problemas aparecen al medir y comparar algoritmos, y cómo se resuelve cada uno?

* **Tamaño de la entrada**: no cuesta lo mismo buscar en 10 elementos que en 1.000.000. Se resuelve expresando el tiempo en función del tamaño: T(n).
* **Valores de la entrada**: con el mismo tamaño, no cuesta lo mismo encontrar el elemento en la primera posición que no encontrarlo. Se resuelve analizando peor, mejor y caso medio.
* **Procesador**: el mismo algoritmo tarda distinto en máquinas distintas. Se resuelve contando operaciones elementales en vez de medir segundos, para que la medida sea independiente de máquina, lenguaje y compilador.

#### 1.5 ¿Qué son el peor caso, el mejor caso y el caso medio?

Son las tres formas de evaluar el costo según cómo venga la entrada. El peor caso, Tmax(n), es la entrada que más trabajo genera; el mejor caso, Tmin(n), la que menos; el caso medio, Tprom(n), el promedio suponiendo todas las entradas equiprobables. En búsqueda secuencial: peor caso, el elemento no está o es el último (n comparaciones); mejor caso, está primero (1 comparación); caso medio, está en una posición intermedia. El caso medio da una idea más ajustada del comportamiento real, pero puede ser muy difícil de analizar.

#### 1.6 ¿Qué es una operación elemental?

Una sentencia de costo constante: asignar o consultar una variable simple, comparar dos valores simples, operaciones aritméticas elementales, acceder a una posición de un arreglo o desreferenciar un puntero. La gran mayoría de las sentencias tienen costo constante, aunque esa constante k no sea la misma para todas.

#### 1.7 ¿Qué diferencia hay entre el análisis empírico y el teórico? ¿Qué ventajas tiene el teórico?

El **empírico** mide tiempos reales de ejecución para entradas concretas en una máquina concreta; su desventaja es que hay que codificar el algoritmo. El **teórico** cuenta operaciones básicas y hace análisis asintótico. Ventajas del teórico: se hace a priori, sin escribir código; vale para todas las instancias; es independiente del lenguaje, de la máquina y de la pericia del programador.

#### 1.8 ¿Cuáles son los pasos de un estudio empírico?

Definir el caso de prueba, implementar el algoritmo, generar entradas de distintos tamaños (10, 100, 1000…), ejecutar y medir el tiempo en cada una, registrar los resultados, graficar tiempo contra tamaño y deducir la complejidad a partir de la forma de la curva.

### Cálculo de T(n) y notación asintótica

#### 1.9 ¿Cómo se calcula T(n) para secuencias, condicionales y bucles?

* **Secuencia**: la suma de los tiempos de cada sentencia.
* **Condicional**: el tiempo de la condición más el de la rama más costosa (vale igual para if/elsif/else).
* **Bucle con límite constante**: costo constante.
* **Bucle cuyo límite depende de n**: n por el costo del cuerpo.
* **Bucles anidados**: se multiplican las iteraciones (si el interno depende del externo, se resuelve la sumatoria).
* **Variable de control no lineal**: depende de cómo evoluciona; si se duplica en cada vuelta (c = c · 2 hasta N), da log N iteraciones.
* **Llamada a función**: el costo de la función; si es recursiva, da lugar a una relación de recurrencia.

#### 1.10 ¿Qué significa T(n) ∈ O(f(n))?

Que existen constantes positivas c y n₀ tales que T(n) ≤ c · f(n) para todo n ≥ n₀. Se lee "tiene velocidad de crecimiento f(n)": T(n) no crece más rápido que f(n), salvo constantes. O(f(n)) no es un número sino el **conjunto** de todas las funciones que no crecen más rápido que f(n), por eso se escribe con ∈.

#### 1.11 ¿Qué diferencia hay entre O, Ω y Θ?

* **O(f(n))**: cota superior, T no crece más rápido que f.
* **Ω(f(n))**: cota inferior, T no crece más lento que f.
* **Θ(f(n))**: orden exacto, T crece igual que f (las dos cotas coinciden).

#### 1.12 ¿Qué dicen las reglas de la suma y del producto?

**Suma**: si dos fragmentos se ejecutan uno después del otro, la complejidad total es la del mayor de los dos (se aplica, por ejemplo, a un if/else). **Producto**: si un fragmento se ejecuta dentro de otro, las complejidades se multiplican. Aplicada a bucles: el costo de un for es la cantidad de iteraciones por el costo del cuerpo; para while y do-while se toma la cantidad de iteraciones del peor caso.

#### 1.13 ¿Por qué no importa la base del logaritmo en Big O?

Porque cambiar de base equivale a multiplicar log n por una constante, y las constantes se descartan. Por eso O(log₂ n) = O(log₃ n) = O(log n).

#### 1.14 ¿Cuáles son los órdenes de complejidad más comunes y dónde aparecen?

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

#### 1.15 ¿Por qué la velocidad de crecimiento determina el tamaño de problema que se puede resolver?

Porque fija cuántos datos se procesan en un tiempo razonable. Según la tabla del apunte, con O(n) se manejan del orden de 10⁸ elementos, con O(n log n) unos 4,5 · 10⁶, con O(n²) unos 10.000, con O(n³) unos 500, con O(2ⁿ) unos 27 y con O(n!) apenas 11. Una mejora de hardware no compensa un mal orden de crecimiento.

#### 1.16 ¿Cómo se estima el tiempo de ejecución para otro tamaño de entrada a partir de una medición? (parcial)

Se parte de T(n) = c · f(n). Con la medición conocida se despeja c, y con ese c se evalúa el nuevo tamaño. Ejemplo del apunte: selección ordena 2000 elementos en 10 s → c = 10 / 2000² = 2,5 · 10⁻⁶ → T(5000) = 2,5 · 10⁻⁶ · 5000² = 62,5 s. Para saber cuántos elementos entran en un tiempo dado se despeja n de la misma ecuación.

#### 1.17 ¿Qué cambia si la computadora es k veces más rápida? (parcial)

La constante c se divide por k, así que para el mismo n el tiempo se divide por k (en el apunte: 90 s con selección pasan a 30 s en una máquina 3 veces más rápida). El orden de complejidad no cambia. La cantidad de elementos extra que se pueden procesar en el mismo tiempo depende de f: en O(n) se procesan k veces más, en O(n²) solo √k veces más, en O(2ⁿ) apenas se suma una cantidad fija de elementos.

#### 1.18 Si duplicar la entrada de inserción duplicó el tiempo, ¿en qué condiciones se hizo la prueba? (parcial)

Una relación lineal entre n y el tiempo en inserción solo se da en el mejor caso: el vector ya estaba ordenado, porque ahí inserción es O(n).

#### 1.19 ¿Qué es la complejidad espacial? ¿Puede diferir de la temporal entre dos versiones del mismo algoritmo? (parcial)

Es la memoria adicional que necesita el algoritmo en función de n. Dos versiones pueden tener el mismo tiempo y distinto espacio: el factorial iterativo es O(n) en tiempo y O(1) en espacio; el recursivo también es O(n) en tiempo, pero O(n) en espacio porque cada llamada guarda su registro de activación en la pila.

#### 1.20 ¿Cuándo no se puede mejorar la complejidad de un algoritmo? (parcial)

Cuando ya alcanza una cota inferior del problema. Si no hay ninguna estructura u orden que aprovechar, hay que revisar cada elemento al menos una vez, así que O(n) es lo mínimo (buscar en un arreglo desordenado o el máximo, por ejemplo). En ordenamiento por comparación, ningún algoritmo baja de n log n. Si la entrada tiene estructura (por ejemplo, está ordenada), sí se puede bajar: de O(n) a O(log n) con búsqueda binaria.

### Ordenamientos elementales y sus propiedades

#### 1.21 ¿Cómo funciona el ordenamiento por selección y cuál es su complejidad?

En cada pasada busca el mínimo del sub-arreglo restante y lo coloca en su posición; hace n - 1 pasadas porque en la última se ordenan los dos elementos que quedan. Hace siempre n(n-1)/2 comparaciones, así que es Θ(n²). No cambia si el arreglo ya está ordenado, porque siempre recorre todo el sub-arreglo para encontrar el mínimo.

#### 1.22 ¿Cómo funciona el ordenamiento por inserción y cuál es su complejidad en mejor y peor caso?

Toma cada elemento y lo desplaza hacia la izquierda hasta su lugar dentro de la parte ya ordenada. Peor caso: arreglo en orden inverso, cada elemento se compara con todos los anteriores, n(n-1)/2 → O(n²). Mejor caso: arreglo ordenado, el mientras corta en la primera comparación, n - 1 → O(n).

#### 1.23 ¿Por qué inserción no tiene un Θ único? ¿Qué se entiende cuando se dice "inserción es O(n²)"?

Porque su cota en el mejor caso (n) y en el peor caso (n²) no coinciden, a diferencia de selección. Cuando se dice "es O(n²)" sin aclarar, por convención se habla del peor caso.

#### 1.24 ¿Qué es el centinela en inserción y qué mejora?

Si se coloca en la posición 0 un valor menor que todos (por ejemplo 0 o -1 si todos son positivos), ningún elemento puede pasarlo, y se elimina la condición pos ≥ 0 del mientras. Se logra con una primera pasada de selección. Cuesta n - 1 comparaciones extra y ahorra n(n-1)/2 controles de índice: **mejora la constante, no el orden**.

#### 1.25 ¿Cuándo conviene selección y cuándo inserción?

Selección conviene cuando cada posición guarda mucha información, porque hace menos movimientos de datos que inserción (inserción desplaza muchas veces). Inserción conviene con datos casi ordenados, porque reduce mucho las operaciones, y cuando se necesita estabilidad o procesar en línea.

#### 1.26 ¿Qué significa que un algoritmo sea sensible a la entrada?

Que su tiempo de ejecución varía significativamente según cómo viene la entrada (mejor, peor o caso promedio). Inserción es sensible (n - 1 contra n(n-1)/2); selección no (n(n-1)/2 siempre); burbujeo no lo es, salvo en su versión optimizada.

#### 1.27 ¿Qué significa que un algoritmo de ordenamiento sea estable?

Que ante dos elementos con la misma clave de ordenamiento, se conserva su orden original en el resultado. Inserción y burbujeo son estables; selección no.

#### 1.28 ¿Qué significa que un algoritmo sea en línea?

Que puede procesar los datos a medida que llegan, sin tener todos disponibles desde el principio. Inserción y burbujeo son en línea; selección no, porque necesita conocer todos los elementos para encontrar el menor.

#### 1.29 ¿Qué significa que un algoritmo sea en el lugar?

Que ordena usando solo una cantidad constante de espacio adicional, sobre el propio vector original. Selección e inserción son en el lugar.

#### 1.30 Compará selección, inserción y burbujeo según las cuatro características.

| | Selección | Inserción | Burbujeo |
| --- | --- | --- | --- |
| Sensible a la entrada | No | Sí | No (sí el optimizado) |
| Estable | No | Sí | Sí |
| En línea | No | Sí | Sí |
| En el lugar | Sí | Sí | Sí |
| Complejidad (peor caso) | O(n²) | O(n²) | O(n²) |

### Más sobre análisis (agregado desde las diapositivas)

#### 1.31 ¿Las cotas O, Ω y Θ corresponden al peor, al mejor y al caso medio?

No. Acotan una **función**, no un caso. El mejor y el peor caso son entradas distintas, cada una con su propia T(n), y cualquiera de las tres cotas se puede aplicar a cualquiera de los casos. Es la misma definición tres veces: cambia solo el sentido de la desigualdad.

#### 1.32 ¿Qué significa escribir T(n) = O(f(n))?

Es la abreviatura que usa casi toda la bibliografía para T(n) ∈ O(f(n)) y significa exactamente lo mismo. Pero ese signo no se comporta como una igualdad: se lee "es de orden", no "es igual a".

#### 1.33 ¿Cuánto cuesta el caso promedio de la búsqueda secuencial?

Suponiendo que el elemento está en el arreglo y puede estar en cualquier posición con la misma probabilidad, se suman los costos de cada caso (1, 2, …, n comparaciones) y se divide por la cantidad de casos. En promedio se recorre la mitad del arreglo, y la mitad de algo que crece linealmente sigue creciendo linealmente: O(n).

#### 1.34 ¿Cómo se deduce la complejidad a partir de un estudio empírico?

Se mide con entradas de tamaño creciente, duplicando cada vez, repitiendo cada medición varias veces, promediando y descartando las primeras corridas (la máquina todavía está "entrando en calor"). Después se mira qué le pasa al tiempo cuando se duplica n: en la búsqueda secuencial el tiempo se multiplica aproximadamente por 2 en cada fila, lo que confirma que es lineal. Si se multiplicara por 4, sería cuadrático.

#### 1.35 ¿Cómo se calcula el costo de un condicional según el caso analizado?

Un condicional cuesta evaluar la condición más ejecutar una rama. Los casos difieren solo en qué se supone sobre cuál rama se ejecuta: en el caso promedio se pondera cada rama por la fracción de veces que se toma (f₁ + f₂ = 1). En la práctica se trabaja con el peor caso, así que la regla operativa es la condición más la rama más cara.

#### 1.36 ¿Cuándo aparece la complejidad exponencial O(2ⁿ) en un algoritmo recursivo?

Cuando hay dos o más llamadas internas y el problema se reduce **restando**, no dividiendo, como en Fibonacci ingenuo. Si el problema se divide (como en MergeSort), no hay crecimiento exponencial.

#### 1.37 ¿Qué se considera un tiempo "razonable" en la tabla de tamaños máximos de entrada?

Se estima un segundo de cómputo. La tabla muestra cuántos datos se pueden procesar en ese tiempo según la complejidad, en función de cuántas operaciones hace la computadora por segundo.

---

## Clase 2: DA Recursividad, CC Relaciones de Recurrencia y CC Teorema Maestro

### Recursividad

#### 2.1 ¿Qué es una función recursiva y qué partes debe tener?

Es una función que se llama a sí misma en su propio cuerpo. Debe tener un **caso base**, con la condición de corte que no vuelve a recurrir, y un **caso recursivo**, donde se llama a sí misma con una entrada más pequeña. Puede haber más de un caso base o más de un caso recursivo, pero no menos.

#### 2.2 ¿Qué diferencia hay entre recursividad directa e indirecta?

En la directa, la función se invoca a sí misma. En la indirecta, una función llama a otra y esa otra llama a la original, alternándose (ejemplo: EsPar llama a EsImpar y EsImpar llama a EsPar).

#### 2.3 ¿Qué es una función wrapper y para qué sirve con la recursión?

Es una función que el llamador invoca y que a su vez invoca a otra. Se usa para ocultar parámetros auxiliares de la recursión: Sumar(lista) llama a _sumarRecursivo(lista, 0), así el usuario no tiene que pasar el índice inicial.

#### 2.4 ¿Qué es el stack de llamadas y qué pasa con él en un algoritmo recursivo?

Es la estructura que almacena la información de las subrutinas activas del programa. Cada llamada apila un registro de activación nuevo, y se desapila cuando la llamada termina. En la recursión, se apila un registro por cada llamada pendiente, así que la profundidad de la recursión determina cuánta memoria se usa.

#### 2.5 ¿Qué es un stack overflow y cuándo ocurre?

Es el desbordamiento de la pila: si no hay caso base (o nunca se alcanza), ningún registro se desapila y la pila crece hasta agotar la memoria disponible.

#### 2.6 ¿Cuáles son los errores comunes al escribir recursión?

* **Sin caso base**: la recursión nunca corta.
* **Caso base inalcanzable**: existe, pero el parámetro se aleja de él (Sumatoria(n + 1) con base en n = 0).
* **El problema no se reduce**: se llama con la misma entrada (BuscarElemento(lista, objetivo) sin achicar la lista).

#### 2.7 ¿Cuándo conviene la recursividad y cuándo la iteración?

Iteración: cuando el rendimiento o la memoria son críticos (sistemas embebidos, datos masivos), el problema es lineal (recorrer una lista, sumar números) o no se puede correr riesgo por profundidad de llamadas. Recursividad: cuando la estructura es recursiva por naturaleza (árboles, grafos, sistemas de archivos), en división y conquista (QuickSort, MergeSort), o cuando se prioriza claridad sobre micro-optimización. Regla práctica: si se resuelve con un for, iterá; si al iterar ves que necesitás una pila, usá recursividad.

### Relaciones de recurrencia

#### 2.8 ¿Qué es una relación de recurrencia y qué partes tiene?

Es una ecuación que expresa el costo T(n) de un algoritmo en función del costo de instancias más pequeñas del mismo problema. Tiene un caso base, con un valor concreto, y un caso recursivo, expresado en función de algo menor que n.

#### 2.9 ¿Cómo se plantea la recurrencia a partir del código?

Se mira cuántas llamadas recursivas hace cada invocación, con qué tamaño, y cuánto cuesta el trabajo fuera de ellas. Factorial: una llamada con n - 1 más trabajo constante → T(n) = T(n - 1) + k₂, con T(1) = k₁. Contar dígitos: una llamada con n/10 → T(n) = T(n/10) + k₁. Fibonacci: dos llamadas → T(n) = T(n - 1) + T(n - 2) + k.

#### 2.10 ¿En qué consiste el método de sustitución o telescópico?

En "desenrollar" la recurrencia con sustituciones sucesivas hasta el caso base. Se reemplaza T(n - 1) por su propia expresión, luego T(n - 2), y así hasta encontrar el patrón general en función de i (en factorial, T(n) = T(n - i) + i · k₂). Después se despeja i para llegar al caso base (n - i = 1 → i = n - 1), se reemplaza y queda una expresión cerrada (k₁ + (n - 1) · k₂), de la que se obtiene el orden: O(n).

#### 2.11 ¿Qué es el árbol de recursión y cuándo conviene usarlo?

Es una representación donde cada llamada es un nodo y en él se anota su costo local (lo que hace sin contar a sus hijos). El costo total se obtiene sumando por niveles: si el costo por nivel es constante, el total es ese costo por la altura; si crece o decrece, se suma la serie. Conviene cuando hay más de una llamada recursiva, porque la telescopía se complica, y cuando se quiere intuición visual del comportamiento.

#### 2.12 ¿Por qué Fibonacci recursivo es O(2ⁿ)?

Porque cada llamada genera dos llamadas más, así que cada nivel del árbol duplica el trabajo del anterior: el árbol crece exponencialmente. Además recalcula muchas veces los mismos subproblemas (fib(3) y fib(2) aparecen repetidos).

#### 2.13 ¿Por qué contar dígitos y búsqueda binaria dan O(log n)?

Porque en cada paso el tamaño se divide por una constante (10 o 2) y el trabajo fuera de la llamada es constante. Se necesitan i pasos hasta que n/bⁱ llega al caso base, es decir, i = log_b n.

### Teorema Maestro

#### 2.14 ¿Para qué sirve el Teorema Maestro y a qué recurrencias se aplica?

Permite obtener el orden de una recurrencia sin hacer el desarrollo completo. Aplica a recurrencias de la forma T(n) = a · T(n/b) + nᶜ, donde **a** es la cantidad de subproblemas que genera cada llamada, **b** el factor en que se reduce el tamaño, y **nᶜ** el costo del trabajo fuera de la recursión (partir y combinar).

#### 2.15 ¿Qué condiciones deben cumplirse para aplicarlo?

Al menos un subproblema (a > 0); a entero, no fraccionario; el problema debe reducirse (b > 1); el trabajo extra no puede ser negativo (c ≥ 0); el trabajo fuera de la recursión debe ser polinómico (nᶜ) y positivo; a y b deben ser constantes, no depender de n.

#### 2.16 ¿Cuáles son los tres casos del teorema?

* **Caso 1**: logb(a) < c → T(n) = O(nᶜ). Domina el trabajo por nivel.
* **Caso 2**: logb(a) = c → T(n) = O(nᶜ · log n). Ambos son comparables.
* **Caso 3**: logb(a) > c → T(n) = O(n^logb(a)). Dominan las llamadas recursivas.

#### 2.17 ¿Cuál es la intuición detrás de los tres casos?

El teorema compara dos fuerzas: cuánto crece la cantidad de subproblemas (logb(a)) contra cuánto cuesta el trabajo por nivel (c). El costo del nivel i es aⁱ · (n/bⁱ)ᶜ = nᶜ · (a/bᶜ)ⁱ. Si a/bᶜ < 1 el trabajo decrece nivel a nivel y domina la raíz (caso 1); si es 1, cada nivel cuesta lo mismo y se multiplica por la cantidad de niveles, de ahí el log (caso 2); si es mayor que 1, crece hacia abajo y dominan las hojas (caso 3).

#### 2.18 ¿Cuál es la receta para aplicarlo?

1) Identificar a, b y c. 2) Calcular logb(a). 3) Compararlo con c. 4) Aplicar el caso. Ejemplo, búsqueda binaria T(n) = 1 · T(n/2) + n⁰: a = 1, b = 2, c = 0; log₂(1) = 0 = c → caso 2 → O(log n). Ejemplo, T(n) = 4 · T(n/2) + n: log₂(4) = 2 > 1 → caso 3 → O(n²).

#### 2.19 Dar ejemplos de recurrencias donde no se puede aplicar el Teorema Maestro y explicar por qué.

* T(n) = 2T(n - 1) + n²: el tamaño se resta, no se divide; no hay b.
* T(n) = 2ⁿ · T(n/2) + n²: a depende de n.
* T(n) = 2T(n/2) + n / log n: el trabajo extra no es polinómico.
* T(n) = ½ T(n/2) + n: a fraccionario.
* T(n) = T(3n/2) + n: el problema crece (b < 1).
* T(n) = 64T(n/8) - n²: trabajo extra negativo.
* T(n) = T(n/2) + n(2 - cos n): no es polinómico.

#### 2.20 ¿Por qué T(n) = T(n - 1) + n no se resuelve con el Teorema Maestro y cuánto da?

Porque el tamaño se reduce restando 1, no dividiendo: no tiene la forma a · T(n/b). Por sustitución: T(n) = T(1) + 2 + 3 + … + n = T(1) + n(n+1)/2 - 1 → O(n²). Es la recurrencia del peor caso de QuickSort.

#### 2.21 ¿Cuándo conviene telescopía, árbol de recursión o Teorema Maestro?

Telescopía: recurrencias simples o cuando se quiere el desarrollo exacto paso a paso. Árbol de recursión: cuando se quiere intuición visual del comportamiento. Teorema Maestro: cuando la recurrencia tiene la forma aT(n/b) + nᶜ y se quiere la respuesta rápido.

---

## Clase 3: DA División y Conquista

### Fundamentos

#### 3.1 ¿En qué consiste la técnica de División y Conquista?

Un problema grande se divide en subproblemas más chicos del mismo tipo, cada uno se resuelve en forma independiente y luego las soluciones parciales se combinan. Si los subproblemas siguen siendo grandes, se aplica la misma idea recursivamente hasta llegar a casos que se resuelven directamente.

#### 3.2 ¿Cuáles son los tres pasos formales?

* **Dividir**: partir el problema de tamaño n en subproblemas de tamaño n/b.
* **Conquistar**: resolver recursivamente cada subproblema.
* **Combinar**: operar sobre las soluciones parciales para obtener la del problema original.

La recurrencia resultante es T(n) = a · T(n/b) + f(n), donde f(n) es el costo de dividir y combinar.

#### 3.3 ¿Por qué hace falta una estrategia distinta a los ordenamientos elementales?

Burbujeo, selección e inserción son O(n²): si el arreglo crece 10 veces, el tiempo crece 100 veces. Con 10⁶ elementos serían del orden de 10¹² operaciones. Comparar todos con todos ya no sirve; hay que dividir el problema.

#### 3.4 ¿Siempre conviene aplicar División y Conquista?

No. Buscar el máximo de un arreglo desordenado cuesta O(n) tanto en forma lineal como dividiendo a la mitad y quedándose con el mayor de cada parte. La pregunta clave es si la división reduce el trabajo o solamente lo redistribuye.

### Búsqueda binaria y potencia

#### 3.5 ¿Cómo funciona la búsqueda binaria como División y Conquista y cuál es su complejidad?

Requiere el arreglo ordenado. Caso base: sub-arreglo de tamaño 0 o 1. Dividir: se mira el elemento del medio y se decide con qué mitad quedarse. Conquistar: se llama recursivamente solo sobre esa mitad. Combinar: es trivial, no hay nada que juntar. T(n) = T(n/2) + 1 → a = 1, b = 2, c = 0 → caso 2 → O(log n). Su árbol es una cadena de log₂ n + 1 niveles con costo constante.

#### 3.6 ¿Cómo se calcula Xⁿ con División y Conquista y por qué es O(log n)?

Si n es par, Xⁿ = X^(n/2) · X^(n/2); si es impar, X · X^((n-1)/2) · X^((n-1)/2). La clave es calcular la media potencia **una sola vez** y guardarla en una variable, así hay una única llamada: T(n) = T(n/2) + c → O(log n).

### MergeSort

#### 3.7 ¿Cómo funciona la fusión ordenada y cuánto cuesta?

Recorre los dos arreglos ordenados a la vez, toma siempre el menor de los dos elementos actuales y avanza en ese arreglo; cuando uno se agota, copia lo que queda del otro. Es lineal en la cantidad total de elementos: O(n).

#### 3.8 ¿Cómo funciona MergeSort y qué hace en cada paso de DyC? (parcial)

Dividir: parte el arreglo a la mitad. Conquistar: ordena recursivamente cada mitad. Combinar: fusiona las dos mitades ordenadas con la fusión ordenada. El caso base es un arreglo de 0 o 1 elementos.

#### 3.9 ¿Cuál es la recurrencia de MergeSort y cómo se resuelve con los tres métodos?

T(n) = 2T(n/2) + n - 1 (contando las comparaciones de la fusión). Telescopía: T(n) = Σ (n - 2ⁱ) para i de 0 a log₂n - 1 = n · log₂ n - (n - 1) → O(n log n). Árbol: log₂ n + 1 niveles, cada uno cuesta n → O(n log n). Teorema Maestro: a = 2, b = 2, c = 1 (el -1 no cambia la clase); log₂(2) = 1 = c → caso 2 → O(n log n).

#### 3.10 ¿Por qué el árbol de MergeSort cuesta n por nivel y cuántos niveles tiene?

Porque en cada nivel los sub-arreglos, sumados, siempre tienen los n elementos, y la fusión es lineal en ellos. Tiene log₂ n + 1 niveles porque el tamaño se divide a la mitad en cada nivel.

#### 3.11 ¿Cómo se argumenta que MergeSort es correcto?

Por inducción: si MergeSort ordena correctamente arreglos de tamaño n/2, y la fusión preserva el orden, entonces ordena correctamente arreglos de tamaño n.

#### 3.12 ¿Qué limitaciones tiene MergeSort?

Necesita un arreglo auxiliar de tamaño n para la fusión: O(n) de memoria adicional, así que **no es en el lugar** (inserción y selección sí lo son). Además, durante la fusión el acceso a memoria no es secuencial, lo que puede perjudicar el uso de caché en arreglos muy grandes.

#### 3.13 ¿MergeSort es estable? ¿Es sensible a la entrada? (parcial)

Es **estable**: en la fusión, ante empate (A[i] ≤ B[j]) toma primero el elemento de la mitad izquierda, que venía antes en el original. **No es sensible**: siempre divide a la mitad y la fusión siempre recorre los n elementos, así que es O(n log n) en todos los casos, sin importar cómo venga la entrada.

### QuickSort

#### 3.14 ¿Cómo funciona QuickSort?

Elige un elemento llamado pivote y reorganiza el arreglo (partición, O(n)) para que todo lo menor quede a su izquierda y todo lo mayor a su derecha. Después ordena recursivamente cada lado. La división ya hace el trabajo útil; la combinación es trivial. Responde a la pregunta de si se puede ordenar sin memoria extra.

#### 3.15 ¿Qué estrategias hay para elegir el pivote y qué problema tiene cada una?

* **Primer o último elemento**: funciona bien con entrada aleatoria, pero es O(n²) si la entrada ya está ordenada.
* **Pivote aleatorio**: más seguro, pero generar buenos números aleatorios es costoso respecto del resto del algoritmo.
* **Mediana de tres**: la mediana entre el primero, el último y el del medio; da particiones más balanceadas.

#### 3.16 ¿Cuáles son las recurrencias de QuickSort en mejor, peor y caso general?

* Mejor caso (pivote siempre al medio): T(n) = 2T(n/2) + O(n) → O(n log n).
* Peor caso (pivote siempre en un extremo): T(n) = T(n - 1) + O(n) → O(n²); el árbol es una cadena de n + 1 niveles.
* Caso general (pivote en proporción k): T(n) = T(n/k) + T((k-1)n/k) + O(n) → O(n log n).

#### 3.17 ¿En qué condición el peor caso de QuickSort es O(n²) y cómo se mitiga? (parcial)

Cuando el pivote cae consistentemente en un extremo, por ejemplo tomando el primer elemento de un arreglo ya ordenado: cada partición deja un lado vacío y el otro con n - 1 elementos. Se mitiga eligiendo mejor el pivote: aleatorio o mediana de tres.

#### 3.18 ¿Por qué aunque el pivote parta 90/10 QuickSort sigue siendo O(n log n)?

Porque T(n) = T(n/10) + T(9n/10) + cn solo cambia la altura del árbol, que sigue siendo proporcional a log n, y cada nivel sigue costando a lo sumo n. El peor caso aparece únicamente con una mala elección consistente del pivote.

#### 3.19 ¿QuickSort es estable? ¿Qué memoria usa?

No es estable. Ordena en el propio arreglo (O(1) extra en el array) pero usa O(log n) en la pila de recursión.

#### 3.20 Compará MergeSort y QuickSort.

| | MergeSort | QuickSort |
| --- | --- | --- |
| Peor caso | O(n log n) garantizado | O(n²), mitigable con buen pivote |
| Caso promedio | O(n log n) | O(n log n) |
| Memoria extra | O(n) | O(1) en el array + O(log n) en el stack |
| Estable | Sí | No |
| Dónde hace el trabajo | Al combinar (fusión) | Al dividir (partición) |

#### 3.21 ¿Cuál es el límite inferior del ordenamiento por comparación?

Cualquier algoritmo que ordene solo comparando pares necesita al menos log(n!) comparaciones para alguna entrada. Como log(n!) es del mismo orden que log(nⁿ) = n log n, **ningún ordenamiento por comparación puede ser mejor que n log n**. Por eso MergeSort y HeapSort son asintóticamente óptimos.

#### 3.22 ¿Qué es QuickSelect y en qué se diferencia de QuickSort?

Encuentra el k-ésimo elemento más pequeño sin ordenar todo el arreglo, usando la partición de QuickSort. La diferencia es que después de partir sigue solo por el lado donde está la posición k, no por los dos. En el caso promedio T(n) = T(n/2) + n → caso 1 → O(n); en el peor, T(n) = T(n - 1) + n → O(n²). La solución naive de ordenar todo y tomar la posición k cuesta O(n log n).

---

## Clase 4: TDA Montículos y Cola de Prioridad

#### 4.1 ¿Qué es una cola de prioridad y cuál es su interfaz?

Es una cola en la que cada elemento tiene asociada una prioridad: se insertan en cualquier orden y se extrae siempre el de mayor prioridad (no es FIFO). Su interfaz: crear la cola, insertar un elemento, extraer el primero (el de mayor prioridad) y consultar el primero sin sacarlo.

#### 4.2 ¿Qué costo tienen sus operaciones según cómo se implemente?

| Implementación | Insertar | Obtener el de mayor prioridad |
| --- | --- | --- |
| Lista ordenada | O(n) | O(1) |
| Lista desordenada | O(1) | O(n) |
| Montículo binario | O(log n) | O(log n) |

El montículo es la opción consistente: ninguna operación se degrada a lineal.

#### 4.3 ¿Qué es un montículo (heap)?

Un árbol binario completo o casi completo que cumple dos condiciones a la vez. **Condición de forma**: todos los niveles están llenos salvo quizás el último, que se llena de izquierda a derecha. **Condición de orden**: cada nodo es menor o igual que sus hijos (montículo de mínimo) o mayor o igual (de máximo). Toda operación termina reacomodando la estructura hasta que ambas condiciones quedan restauradas.

#### 4.4 ¿Cómo se representa un heap en un arreglo? (parcial)

Como el árbol es completo, se guarda por niveles en un vector, sin nodos ni referencias. Con la raíz en la posición 1 (la 0 queda sin usar): el hijo izquierdo de i está en 2i, el derecho en 2i + 1, y el padre de i en ⌊i/2⌋.

#### 4.5 ¿Cómo se inserta un elemento (sift-up)?

Se coloca al final del arreglo, en la primera posición libre del último nivel, y se lo hace "flotar": mientras sea menor que su padre (en un min-heap) se intercambia con él. Termina cuando el padre es menor o igual, o cuando llega a la raíz.

#### 4.6 ¿Cómo se extrae la raíz (sift-down)?

Se guarda la raíz, se la reemplaza por el último elemento y se lo "hunde": en cada paso se compara con sus dos hijos y se intercambia con el menor de ellos (en un min-heap), hasta que es menor o igual que ambos o queda como hoja.

#### 4.7 ¿Cuál es la complejidad de insertar y de extraer?

Inserción: mejor caso O(1), si el nuevo elemento ya es mayor que su padre; peor caso, cuando es un nuevo mínimo y sube hasta la raíz, tantas comparaciones como nodos en ese camino. Extraer es análogo hacia abajo. En ambos casos el costo es proporcional a la altura del árbol, y como el árbol es completo la altura es ⌊log₂ n⌋: **O(log n)** garantizado.

#### 4.8 ¿Qué pasa con los elementos repetidos? ¿Cómo se logra estabilidad?

El heap admite repetidos sin problema: la condición de orden no exige unicidad. Pero no garantiza ningún orden entre elementos iguales. Para que ante empate salga primero el que se insertó antes, se guarda cada elemento como una tupla (prioridad, contador, valor), donde el contador crece con cada inserción y actúa como criterio secundario de comparación.

#### 4.9 ¿Cuándo NO conviene usar un heap?

Si solo necesitás el mínimo una vez (un recorrido lineal O(n) es más simple); si los datos ya llegan ordenados y no entran nuevos (alcanza una cola simple); o si necesitás buscar por un valor arbitrario (el heap no tiene esa operación).

#### 4.10 ¿Cómo funciona HeapSort y qué ventajas tiene?

Se arma el heap con todos los elementos y se extraen uno a uno: salen ordenados. Es O(n log n). Frente a QuickSort, garantiza O(n log n) incluso en el peor caso. Frente a MergeSort, es en el lugar: no necesita memoria extra proporcional a n.

#### 4.11 ¿Cómo se construye un heap a partir de un arreglo en O(n)?

Insertando uno a uno costaría O(n log n). Con el **truco de Floyd** se hace sift-down desde la posición n/2 (el último nodo con al menos un hijo) hacia la raíz. Es O(n) porque la mayoría de los nodos están en los niveles bajos y casi no tienen que bajar: solo la raíz puede bajar toda la altura. En un heap de 15 nodos: 1 · 3 + 2 · 2 + 4 · 1 + 8 · 0 = 11 < 15 movimientos.

#### 4.12 ¿Qué relación tiene el heap con el algoritmo de Dijkstra?

Dijkstra necesita en cada paso el nodo no visitado de menor distancia acumulada, que es exactamente lo que da una cola de prioridad. Con un heap, Dijkstra baja de O(V²) a O((V + E) log V).

#### 4.13 Compará QuickSort, MergeSort y HeapSort.

| | Promedio | Peor caso | Memoria extra |
| --- | --- | --- | --- |
| QuickSort | O(n log n) | O(n²) | O(log n) |
| MergeSort | O(n log n) | O(n log n) | O(n) (no in-place) |
| HeapSort | O(n log n) | O(n log n) | O(1) in-place (O(log n) si el hundir es recursivo) |

#### 4.14 ¿Cómo se mantiene la mediana de un flujo de datos con dos heaps?

Se usan un max-heap con la mitad de valores menores y un min-heap con la mitad de mayores, balanceados en tamaño. Cada nuevo valor se inserta según sea menor o mayor que la mediana actual, y si los tamaños se desbalancean se pasa la raíz de un heap al otro. La mediana se lee de las raíces (o su promedio si la cantidad es par). Cada inserción es O(log n), contra O(n) de insertar ordenado en un vector.

---

## Clase 5: DA Algoritmos Ávidos

### Fundamentos

#### 5.1 ¿Qué es un algoritmo ávido (greedy)?

Un algoritmo que siempre hace la elección que parece mejor en el momento: elige el óptimo local con la esperanza de llegar al óptimo global. Nunca revisa una decisión ya tomada.

#### 5.2 ¿Qué propiedades debe tener un problema para que greedy funcione?

**Subestructura óptima**: la solución óptima del problema contiene las soluciones óptimas de sus subproblemas. **Propiedad de elección ávida**: la elección localmente óptima forma parte de alguna solución óptima global; es difícil de probar y se demuestra, por ejemplo, por intercambio.

#### 5.3 ¿Qué significa subestructura óptima y cómo se reconoce?

Que tomar la mejor decisión ahora no arruina el resto, y que el subproblema que queda se resuelve de forma óptima con el mismo criterio. Se reconoce preguntando: si tengo la solución óptima y corto el problema en cualquier punto, ¿lo que queda también es óptimo? Suele darse en problemas secuenciales o acumulativos (rutas, intervalos, secuencias, selección de a un elemento). No se da cuando las decisiones tienen efectos secundarios entre sí o el valor de una elección depende de las otras; ahí se usa programación dinámica.

#### 5.4 ¿Qué es la "trampa ávida"?

Que elegir lo mejor ahora puede ser lo peor al final: la elección localmente óptima bloquea la solución globalmente óptima. En el ejemplo del árbol, elegir siempre el hijo de mayor valor da 10 + 9 + 2 = 21, cuando el óptimo es 10 + 3 + 25 = 38.

#### 5.5 ¿Cuáles son las ventajas y desventajas de greedy?

Ventajas: simple de implementar, eficiente en tiempo y memoria, suficiente para muchos problemas reales. Desventajas: no siempre es óptimo, es difícil de probar y puede requerir una transformación previa (como ordenar).

### Cambio de moneda

#### 5.6 ¿Cuál es el criterio greedy del cambio de moneda y qué complejidad tiene?

Entregar la mayor cantidad posible de la denominación más grande sin pasarse, y seguir con la siguiente (con DIV y MOD). Es O(n) en la cantidad de denominaciones; como esa lista es fija, el bucle no depende del monto y en la práctica es O(1).

#### 5.7 ¿El cambio greedy es siempre óptimo?

No. Es óptimo con sistemas canónicos de denominaciones (como el argentino o el euro) y falla con sistemas arbitrarios. Con 100, 200, 500, 800 y 1000 para pagar 2400, greedy da 1000 + 1000 + 200 + 200 (4 piezas) cuando el óptimo es 800 · 3 (3 piezas). Para el caso general hace falta programación dinámica.

### Plan de actividades

#### 5.8 ¿En qué consiste el problema de selección de actividades y qué criterio greedy es óptimo?

Hay n actividades con inicio sᵢ y fin fᵢ que compiten por un recurso exclusivo; dos son compatibles si sus intervalos [sᵢ, fᵢ) no se solapan. Se busca el conjunto compatible de tamaño máximo. El criterio óptimo es elegir la actividad que **termina antes** entre las compatibles con las ya elegidas, porque deja libre el recurso lo antes posible y desbloquea más actividades futuras. Se demuestra óptimo por intercambio.

#### 5.9 ¿Qué complejidad tiene el selector de actividades?

O(n log n) si hay que ordenar las actividades por hora de fin; O(n) si ya vienen ordenadas, porque solo se recorren una vez comparando el inicio de cada una con el fin de la última elegida.

### Huffman

#### 5.10 ¿Para qué sirven los códigos de longitud variable y qué es un código libre de prefijos?

ASCII gasta 8 bits por carácter sin importar su frecuencia. Con códigos de longitud variable, los símbolos más frecuentes reciben códigos más cortos y el mensaje ocupa menos. Para poder decodificar sin ambigüedad el código debe ser **libre de prefijos**: ningún código es prefijo de otro (0, 10, 110, 111 sirve; 0, 01, 011 no).

#### 5.11 ¿Cómo se construye el árbol de Huffman?

Se crea una hoja por símbolo con su frecuencia y se insertan en un min-heap. Mientras quede más de un nodo, se extraen los dos de menor frecuencia y se los fusiona en un nodo interno cuya frecuencia es la suma, que vuelve al heap. El nodo que queda es la raíz; el código de cada símbolo es el camino desde la raíz hasta su hoja.

#### 5.12 ¿Qué complejidad tiene Huffman?

O(n log n): se hacen O(n) fusiones, y cada extracción e inserción en el heap cuesta O(log n).

#### 5.13 ¿Por qué Huffman es óptimo?

Por intercambio: si en un árbol óptimo los dos nodos más profundos no fueran los de menor frecuencia, se podrían intercambiar con ellos sin aumentar el costo. El costo del árbol es Σ frecuencia(símbolo) × profundidad(símbolo), y poner los más frecuentes más cerca de la raíz minimiza esa suma. Resultado: Huffman produce siempre el código libre de prefijos de costo mínimo para esas frecuencias.

#### 5.14 Compará los tres ejemplos de greedy de la clase.

| | Cambio de moneda | Plan de actividades | Huffman |
| --- | --- | --- | --- |
| Criterio | Mayor denominación posible | Menor hora de fin compatible | Fusionar los dos de menor frecuencia |
| ¿Siempre óptimo? | No, falla con denominaciones arbitrarias | Sí, por intercambio | Sí, por intercambio |
| Complejidad | O(n) en denominaciones | O(n log n) con orden, O(n) sin | O(n log n) por el heap |

### Otros problemas greedy

#### 5.15 ¿Por qué la mochila fraccionaria se resuelve con greedy?

Se calcula el valor por kilo de cada objeto, se ordena de mayor a menor y se toma cada uno entero mientras entre; del último se toma la fracción que completa la capacidad. Como se pueden llevar fracciones, la capacidad se aprovecha al 100% y siempre conviene llenar cada kilo con el producto que más vale por kilo. Si se tomara una unidad de peso de un producto con menor valor por kilo existiendo todavía uno mejor, cambiarla por la mejor aumentaría el valor total.

#### 5.16 ¿Cuál es la estrategia greedy en el problema del combustible?

Recargar en la última estación alcanzable con el tanque actual, es decir, cargar lo más tarde posible sin quedarse sin combustible. Así se minimiza la cantidad de paradas.

#### 5.17 ¿Un greedy que asigna siempre el par de menor costo disponible garantiza la asignación óptima?

No (ejercicio de Ollivanders). Elegir siempre el menor costo restante puede dejarle a otro mago solo varitas caras: la mejor opción de un mago puede ser una varita que ya se le asignó a otro. El algoritmo es O(n² log n), mucho mejor que el O(n!) de probar todas las asignaciones, pero no garantiza el óptimo.

---

## Clase 6: GR Fundamentos y GR Recorridos

### Fundamentos

#### 6.1 ¿Qué es un grafo?

Un conjunto V de vértices (o nodos) y un conjunto E de aristas que los conectan. Permite modelar problemas como redes de ciudades y rutas, redes sociales, circuitos o estructuras químicas.

#### 6.2 ¿Qué es un grafo dirigido, uno no dirigido y uno ponderado?

En uno **dirigido** las aristas tienen sentido: en (v, w), v es la cola y w la cabeza. En uno **no dirigido** la conexión es simétrica. Es **ponderado** cuando cada arista tiene un valor numérico (peso). Dos vértices unidos por una arista son **adyacentes**.

#### 6.3 ¿Qué es el grado de un vértice?

La cantidad de vecinos directos. En un grafo no dirigido, cada arista suma 1 al grado de cada extremo. En uno dirigido se distingue grado de entrada (in-degree) y de salida (out-degree). Un vértice de grado 0 es un nodo aislado. En un grafo de dependencias, grado de entrada 0 indica un nodo inicial y grado de salida 0 un nodo final.

#### 6.4 ¿Qué es una matriz de adyacencia y qué es una lista de adyacencia?

La **matriz** es una tabla de V × V donde la celda (i, j) vale 1 (o el peso) si hay arista entre i y j, y 0 si no. La **lista** es un arreglo de V listas, una por vértice, donde cada una contiene solo los vecinos directos de ese vértice.

#### 6.5 ¿Cuándo conviene cada representación? (parcial)

| | Matriz | Lista |
| --- | --- | --- |
| Espacio | O(V²) | O(V + E) |
| ¿Existe la arista (u, v)? | O(1) | O(grado(u)) |
| Recorrer vecinos de u | O(V) | O(grado(u)) |
| Mejor para | Grafos densos | Grafos dispersos |

No hay una universalmente mejor: depende del grafo y de las operaciones, y la elección impacta en la eficiencia de los algoritmos. En un grafo disperso la matriz desperdicia espacio con ceros.

#### 6.6 ¿Qué es un camino, un ciclo y un árbol?

Un **camino** es una secuencia de vértices sin repetir, donde cada uno está conectado con el siguiente. Un **ciclo** es un camino que termina en el vértice donde empezó. Un **árbol** es un grafo no dirigido, conexo y sin ciclos.

#### 6.7 ¿Qué diferencia hay entre un camino euleriano y uno hamiltoniano?

El **euleriano** recorre cada **arista** exactamente una vez (puede repetir vértices). El **hamiltoniano** recorre cada **vértice** exactamente una vez (no necesita usar todas las aristas). Si además empiezan y terminan en el mismo vértice son circuito de Euler o ciclo de Hamilton, y el grafo se llama euleriano o hamiltoniano.

#### 6.8 ¿Cuál es la condición de existencia de un camino o circuito euleriano? ¿Por qué 0 o 2 vértices impares? (parcial)

Circuito: 0 vértices de grado impar. Camino abierto: exactamente 2 vértices de grado impar, que son necesariamente el inicio y el fin. La razón es que cada vez que el recorrido pasa por un vértice intermedio usa una arista para entrar y otra para salir, así que consume las aristas de a pares; solo el vértice donde arranca y el vértice donde termina pueden quedar con una arista suelta.

#### 6.9 ¿Por qué el problema de Euler es fácil y el de Hamilton es difícil?

Para Euler alcanza con contar grados (verificar la existencia es O(V + E)) y encontrarlo es O(E): es polinomial. Para Hamilton no se conoce ninguna condición simple; hay que explorar combinaciones y en el peor caso es exponencial: es NP-completo. El Problema del Viajante (TSP) es su versión más famosa.

#### 6.10 ¿Por qué saber que existe un circuito euleriano no alcanza para construirlo?

Porque la existencia se decide mirando solo los grados de los vértices, mientras que construir la ronda exige recorrer el grafo consumiendo efectivamente todas las aristas, eligiendo en qué orden.

### Recorridos

#### 6.11 ¿Para qué se recorre un grafo?

Para encontrar los vértices alcanzables desde uno dado, encontrar un camino entre dos vértices, averiguar si hay ciclos, procesar los nodos que cumplan una condición, entre otras cosas.

#### 6.12 ¿Cómo funciona DFS y qué estructuras usa? (parcial)

Búsqueda en profundidad: expande cada camino hasta su límite antes de explorar alternativas. Usa un **conjunto de visitados** y una **pila** con los nodos por visitar; también puede implementarse en forma recursiva, usando implícitamente la pila de llamadas.

#### 6.13 ¿Qué permite hacer DFS?

Recorrer los nodos accesibles desde un nodo inicial (en grafos dirigidos y no dirigidos), detectar ciclos, detectar subgrafos y componentes conexas, encontrar árboles de recorrido y obtener un orden topológico. Además habilita análisis avanzados: clasificación de aristas, componentes biconexas y fuertemente conexas, puentes y puntos de articulación.

#### 6.14 ¿Cómo funciona BFS y qué estructuras usa? (parcial)

Búsqueda en anchura: parte del nodo inicial, visita todos sus vecinos, después los vecinos de los vecinos, y así. Usa una **cola**: como primero se encolan los vecinos a distancia 1, luego los de distancia 2, etc., recorre el grafo en orden de distancia al inicio. Por eso, además de recorrer, calcula la distancia en saltos (cantidad de aristas) a cada nodo alcanzable.

#### 6.15 ¿Cómo se representa el "infinito" de las distancias en BFS?

Con un centinela como -1 (simple, sin ambigüedad porque las distancias nunca son negativas), con un valor gigante como Integer.MAX_VALUE (cuidado con el overflow al sumar) o con el infinito real del lenguaje (float('inf'), Infinity), que es lo más fiel al ∞.

#### 6.16 ¿Qué complejidad tienen DFS y BFS y de qué depende? (parcial)

O(V + E) con lista de adyacencia: cada vértice se visita una vez y cada arista se revisa una vez. Con matriz de adyacencia pasan a O(V²), porque recorrer los vecinos de cada nodo exige revisar su fila entera. En un grafo completo no dirigido E = V(V - 1)/2, así que también tienden a O(V²).

#### 6.17 Compará DFS y BFS. ¿Cuándo conviene cada uno? (parcial)

| | DFS | BFS |
| --- | --- | --- |
| Estructura | Pila (o recursión) | Cola |
| Orden | Primero en profundidad | Por niveles de distancia |
| Distancias mínimas | No | Sí, en grafos no ponderados |
| Ciclos y componentes conexas | Sí | Sí |
| Análisis avanzados | Sí (puentes, articulaciones, biconexas) | No |
| Uso típico | Exploración exhaustiva, orden topológico | Camino más corto en saltos |
| Complejidad | O(V + E) | O(V + E) |

#### 6.18 ¿Cómo detecta DFS un ciclo?

Con las aristas de retroceso. En un grafo dirigido, si se encuentra una arista hacia un nodo que todavía está en la pila de llamadas, hay un ciclo. En uno no dirigido, si un vecino ya fue visitado y no es el padre desde el que se llegó, hay un ciclo.

#### 6.19 ¿Cómo se determinan las componentes conexas?

Dos nodos están en la misma componente si existe un camino entre ellos. Se lanza un recorrido (DFS o BFS) desde cada nodo no visitado: cada lanzamiento marca una componente completa, así que la cantidad de lanzamientos es la cantidad de componentes.

#### 6.20 ¿Qué es un orden topológico y cuándo existe?

Una secuencia lineal de todos los nodos de un grafo dirigido tal que, para cada arista (u, v), u aparece antes que v. Existe si y solo si el grafo es un **DAG** (dirigido acíclico): con un ciclo, ningún orden puede respetar todas las dependencias. Puede haber varios órdenes válidos.

#### 6.21 ¿Cómo se obtiene un orden topológico?

Con DFS en post-orden inverso: se ejecuta DFS y cada vez que se termina de procesar un nodo (se cierra su llamada) se lo apila en una pila auxiliar; al final, desapilar da la secuencia. Si el DFS encuentra una arista de retroceso, hay ciclo y no hay orden. Alternativa tipo BFS (Kahn): se procesan primero los nodos con grado de entrada 0 y se van quitando sus aristas; si al terminar quedan nodos sin procesar, hay un ciclo.

---

## Clase 7: GR Caminos Mínimos y GR Árboles Abarcadores

### Caminos mínimos

#### 7.1 ¿Qué problema resuelve Dijkstra y qué requisitos tiene el grafo? (parcial)

Halla los caminos de menor costo desde un nodo origen a todos los demás. Sirve para grafos ponderados, dirigidos o no (una arista no dirigida equivale a dos dirigidas de igual peso), con pesos **no negativos**. Es un algoritmo greedy.

#### 7.2 ¿Cómo funciona Dijkstra?

Inicializa todas las distancias en ∞ y la del origen en 0. En cada paso elige el nodo no visitado de menor distancia acumulada, lo cierra (su distancia queda definitiva) y relaja sus aristas salientes: para cada sucesor w, si distancia[w] > distancia[v] + peso(v, w), actualiza distancia[w] y guarda v como predecesor de w. Termina cuando no quedan nodos por cerrar.

#### 7.3 ¿Por qué es seguro cerrar el nodo de menor distancia?

Por la **propiedad de cierre**. Si Dijkstra cierra w con distancia d[w], cualquier camino alternativo más corto a w debería pasar por algún nodo u todavía no visitado, pero d[u] ≥ d[w] porque w se eligió por ser el mínimo, y sumar aristas de peso positivo solo aumenta el costo. Contradicción: la distancia de w ya es definitiva. Se apoya en la subestructura óptima: si el camino mínimo de A a C pasa por B, el tramo A→B también es mínimo.

#### 7.4 ¿Por qué Dijkstra falla con pesos negativos?

Porque una arista negativa puede hacer que un camino que parecía peor se vuelva mejor más adelante, y Dijkstra nunca revisa un nodo ya cerrado. Tampoco sirve ignorar los tramos negativos y correr Dijkstra sobre el resto: eso altera el grafo y el resultado.

#### 7.5 ¿Para qué sirve el vector de predecesores?

Para reconstruir el camino, no solo su costo: desde el destino se sigue el predecesor hacia atrás hasta llegar al origen.

#### 7.6 ¿Qué implementaciones de Dijkstra hay y cuándo conviene cada una?

Con cola de prioridad (heap): O((V + E) log V), aproximadamente O(E log V); conviene en grafos ralos, con pocas aristas. Sin cola, buscando el mínimo linealmente en cada paso: O(V²); conviene en grafos densos. El diseño algorítmico y la estructura de datos no son independientes: la operación cara es encontrar el mínimo, y el heap la baja de O(n) a O(log n).

#### 7.7 Compará BFS, Dijkstra y Bellman-Ford.

| | BFS | Dijkstra | Bellman-Ford |
| --- | --- | --- | --- |
| Pesos | Sin pesos o todos iguales | No negativos | Admite negativos y detecta ciclos negativos |
| Complejidad | O(V + E) | O((V + E) log V) con heap, O(V²) sin heap | O(V · E) |
| Cuándo | Importa la cantidad de saltos | Pesos reales no negativos | Puede haber pesos negativos; más general pero más lento |

#### 7.8 ¿Por qué BFS es un caso particular de Dijkstra? (parcial)

Cuando todas las aristas pesan lo mismo, el costo de un camino es proporcional a la cantidad de saltos, que es exactamente lo que BFS minimiza. Si algún tramo pesa distinto, BFS deja de alcanzar y hace falta Dijkstra.

#### 7.9 ¿Qué es un ciclo negativo y qué algoritmo lo detecta?

Un ciclo cuyas aristas suman un peso negativo: recorrerlo una y otra vez baja el costo indefinidamente, así que no existe camino mínimo. Lo detecta Bellman-Ford, que a diferencia de Dijkstra no da por cerrado un nodo y permite que su distancia siga mejorando; si después de las relajaciones todavía se puede mejorar alguna, hay un ciclo negativo.

### Árboles abarcadores mínimos

#### 7.10 ¿Qué es un árbol abarcador de costo mínimo (MST)?

Un subgrafo que es **árbol** (conexo y sin ciclos), **abarcador** (incluye todos los vértices del grafo original) y de **costo mínimo** (sus aristas suman lo menor posible). Se obtiene de un grafo no dirigido, ponderado y conexo, y tiene V - 1 aristas. Se usa para minimizar costos de conexión: cableado, rutas aéreas, redes eléctricas o de suministro, logística.

#### 7.11 ¿Qué dicen las propiedades de corte y de ciclo?

**Corte**: dada una partición de los vértices en dos conjuntos no vacíos, la arista de peso mínimo que los une pertenece al MST. **Ciclo**: en cualquier ciclo, si una arista pesa más que todas las demás del ciclo, no puede pertenecer al MST.

#### 7.12 ¿Cómo funciona Prim? (parcial)

Hace crecer un único árbol desde un vértice inicial cualquiera. Mantiene una cola de prioridad con las aristas que salen del árbol; en cada paso extrae la de menor peso, y si su destino no está en el árbol, lo incorpora junto con la arista e inserta las aristas del nuevo vértice. Si el destino ya estaba en el árbol, la descarta. Termina cuando incorporó todos los vértices.

#### 7.13 ¿Qué complejidad tiene Prim y cuándo conviene la versión sin cola de prioridad?

Con cola de prioridad es O(E log V): cada arista entra y sale de la cola a lo sumo una vez (O(E log E)) y log E ≤ 2 log V. En grafos densos (E ≈ V²) eso da O(V² log V), y la versión con matriz de adyacencia y sin cola logra O(V²), que es mejor.

#### 7.14 ¿Qué es Union-Find y qué operaciones tiene?

Una estructura que mantiene una partición de elementos en conjuntos disjuntos; al inicio cada elemento es su propio conjunto. **find(x)** devuelve el representante del conjunto de x; **union(x, y)** fusiona los conjuntos de x e y. Dos elementos están en el mismo conjunto si y solo si find(x) == find(y).

#### 7.15 ¿Qué implementaciones de Union-Find hay y cuánto cuestan?

| Implementación | union | find |
| --- | --- | --- |
| Quick-find | O(V) | O(1) |
| Quick-union | O(altura) | O(altura) |
| Weighted quick-union | O(log V) | O(log V) |
| Weighted + compresión de caminos | casi O(1) amortizado | casi O(1) amortizado |

El ideal O(1) en ambas está demostrado que no se puede lograr.

#### 7.16 ¿Cómo funciona Kruskal y cómo controla que no se cierren ciclos? (parcial)

Parte de cada vértice como un árbol aislado. Pone las aristas en una cola de prioridad por peso y las va sacando de menor a mayor: si find(u) ≠ find(v), la arista une dos componentes distintas y no forma ciclo, así que la agrega y hace union(u, v); si no, la descarta. Termina al tener V - 1 aristas (árbol) o cuando no quedan aristas (bosque).

#### 7.17 ¿Qué complejidad tiene Kruskal?

O(E log E), dominada por ordenar las aristas. Con weighted quick-union o compresión de caminos las operaciones de Union-Find no dominan (con quick-union simple el total podría subir a O(E · V)). Como E < V², log E < 2 log V, así que O(E log E) = O(E log V).

#### 7.18 Compará Prim y Kruskal. ¿Cuándo conviene cada uno? (parcial)

| | Prim | Kruskal |
| --- | --- | --- |
| Punto de partida | Un nodo inicial | Todas las aristas |
| Estructura auxiliar | Cola de prioridad | Cola de prioridad + Union-Find |
| Complejidad | O(E log V) | O(E log E) |
| Cómo crece | Un único árbol | Varios fragmentos que se fusionan |
| Conviene en | Grafos densos (con matriz, O(V²)) | Grafos dispersos (E ≈ V) |

#### 7.19 ¿Por qué el enfoque greedy de Prim y Kruskal es correcto?

Por la propiedad de corte. Prim agrega la arista mínima que cruza el corte (árbol, resto de los vértices), así que debe estar en el MST. Kruskal acepta cada arista solo si es mínima en su corte correspondiente, y una arista rechazada es la más pesada (o empata) del ciclo que cerraría. Las decisiones locales nunca descartan una opción mejor.

#### 7.20 ¿Prim y Kruskal dan siempre el mismo árbol? ¿Y el mismo costo? (parcial)

El árbol puede no ser el mismo: si hay aristas de igual peso puede haber varios MST, y cada algoritmo (o el mismo con otro desempate u otro vértice inicial) puede devolver uno distinto. El costo total, en cambio, es siempre el mismo, porque ambos devuelven un árbol de costo mínimo y ese mínimo es único.

#### 7.21 ¿En qué se diferencian Prim y Dijkstra si ambos usan una cola de prioridad?

Dijkstra prioriza la distancia acumulada desde el origen y devuelve caminos mínimos; Prim prioriza solo el peso de la arista que conecta con el árbol y devuelve un árbol de costo total mínimo.

#### 7.22 ¿Qué variantes del problema de árbol abarcador mínimo existen y cómo se encaran?

* **Grafo disconexo**: se obtiene un bosque abarcador mínimo (Minimum Spanning Forest).
* **Pesos duplicados**: el MST puede no ser único.
* **MST máximo**: se niegan los pesos de las aristas antes de operar, o se altera el algoritmo.
* **Con restricciones**: que pase por cierto vértice está garantizado (el árbol abarca todos); que no pase por un vértice, se retira el vértice; que pase por cierta arista, se la fuerza al principio; que no pase por cierta arista, se la quita al principio.
* **Aristas críticas**: son las que aparecen en todos los MST.
* **MST dinámico** (el grafo cambia): es un problema muy complejo.

---

## Clase 8: GR Coloreo y CC Conceptos Avanzados

### Coloreo

#### 8.1 ¿Qué problema modela el coloreo de grafos y dónde aparece?

Problemas de asignación con restricciones: cada vértice es una entidad a clasificar y cada arista una incompatibilidad entre dos entidades. Aparece en el scheduling de exámenes (materias con alumnos en común), la asignación de registros en compiladores (variables que se usan a la vez) y las frecuencias de radio (antenas cercanas). La pregunta es cuál es la mínima cantidad de categorías para repartir elementos en conflicto.

#### 8.2 ¿Qué es colorear un grafo y qué es el número cromático?

Colorear es asignar un color a cada vértice de modo que dos adyacentes nunca tengan el mismo color, minimizando la cantidad de colores. El **número cromático C(G)** es la mínima cantidad de colores necesaria. Cualquier coloreo válido usa c(G) colores (minúscula), no necesariamente mínimo: c(G) ≥ C(G).

#### 8.3 ¿Cuánto cuesta colorear por fuerza bruta?

Para un k fijo hay kⁿ asignaciones (cada uno de los n vértices elige uno de k colores), y en el peor caso hay que probar k de 1 a n: Σ kⁿ ≤ n · nⁿ. Con k = 3 y 50 vértices serían unos 23 millones de años a mil millones de asignaciones por segundo.

#### 8.4 ¿Por qué el coloreo óptimo es NP-completo y qué se hace en la práctica?

Verificar un coloreo es fácil: se revisa cada arista en tiempo polinomial. Pero encontrar el de mínima cantidad de colores no tiene algoritmo eficiente conocido. En la práctica se usan heurísticas: buscan una solución buena en tiempo polinomial, aunque no siempre la óptima.

#### 8.5 ¿Cómo funciona el coloreo secuencial (greedy)?

Recorre los vértices en un orden y le asigna a cada uno el menor color que no use ninguno de sus vecinos ya coloreados. En el secuencial el orden es el original, sin reordenar. Es O(V + E), el más simple, pero el más sensible al orden de entrada.

#### 8.6 ¿Cómo funciona Welsh-Powell y por qué tiende a dar mejores resultados? (parcial)

Ordena los vértices por grado decreciente y aplica el mismo coloreo greedy. Procesar primero los vértices más conectados, que son los más restrictivos, reduce los conflictos futuros desde el inicio; por eso tiene la mayor probabilidad de acercarse a C(G). Cuesta O(V log V + E): el ordenamiento domina sobre el coloreo O(V + E).

#### 8.7 ¿Cómo funciona Matula y en qué se diferencia de Welsh-Powell?

Ordena por grado creciente. La complejidad es la misma, O(V log V + E); cambia la estrategia: procesar primero los menos conectados da más libertad inicial pero genera más conflictos al llegar a los de alto grado. En la práctica tiende a dar peores resultados que Welsh-Powell.

#### 8.8 ¿Alguna de estas heurísticas garantiza el número cromático?

No. Ninguna garantiza C(G); solo aproximan. Las tres son polinomiales y el resultado depende del orden (incluso del desempate entre vértices de igual grado).

| | Secuencial | Welsh-Powell | Matula |
| --- | --- | --- | --- |
| Orden | Arbitrario | Grado decreciente | Grado creciente |
| Complejidad | O(V + E) | O(V log V + E) | O(V log V + E) |
| ¿Garantiza C(G)? | No | No | No |

En el peor caso, con grafos densos, el coloreo greedy puede llegar a O(V²).

#### 8.9 ¿Cuál es el número cromático de algunas familias de grafos?

Grafo sin aristas (no conexo, vértices aislados): 1. Lineal: 2. Ciclo: 2 si es par, 3 si es impar. Estrella: 2. Completo Kₖ: k. n-partito completo: n. Planar: C(G) ≤ 4 por el Teorema de los Cuatro Colores.

#### 8.10 ¿Cómo se modela un problema de horarios como coloreo y qué indica cada elemento? (parcial)

Cada materia o conferencia es un vértice; dos que no pueden coincidir (por compartir alumnos o asistentes) se unen con una arista; cada color es una franja horaria o sesión. La cantidad de colores es la cantidad de sesiones necesarias, y la cantidad de vértices con un mismo color indica cuántas salas simultáneas hacen falta en esa sesión. Se resuelve con una heurística como Welsh-Powell, O(V log V + E).

### P, NP y NP-completitud

#### 8.11 ¿Qué significa que un algoritmo sea eficiente en teoría?

Que su tiempo crece como un polinomio en el tamaño de la entrada (n, n², n³…). No significa rápido sino que escala razonablemente: n³ puede ser lento en la práctica pero sigue siendo manejable. Lo que se quiere evitar son 2ⁿ, n! y similares.

#### 8.12 ¿Qué es la clase P?

El conjunto de problemas que se pueden resolver en tiempo polinomial: ordenar (MergeSort, O(n log n)), búsqueda binaria, camino mínimo con Dijkstra, detectar ciclos, entre otros. Estar en P es garantía de escalabilidad, no de simplicidad.

#### 8.13 ¿Qué significa NP y qué NO significa?

NP es Nondeterministic Polynomial time, no "No Polinomial". Se trabaja con problemas de decisión (respuesta sí o no). Un problema está en NP si, dada una solución candidata, se puede **verificar** en tiempo polinomial. La pregunta no es si se resuelve rápido, sino si se chequea rápido.

#### 8.14 ¿Cuál es la diferencia entre resolver y verificar? Dar un ejemplo.

En Subset Sum (¿hay un subconjunto de tareas que sume exactamente el objetivo?), verificar una propuesta es sumarla: O(n). Resolver exige probar subconjuntos: O(2ⁿ). Con 12 tareas son 4096 subconjuntos; con 40, un billón, y verificar sigue costando una suma. Esa asimetría es la definición de NP.

#### 8.15 ¿Por qué P ⊆ NP? ¿Qué es el problema P vs NP?

Todo lo que se resuelve rápido también se verifica rápido: se resuelve y se compara. El problema abierto es si P = NP, es decir, si todo lo que se verifica rápido también se puede resolver rápido. La mayoría cree que P ≠ NP, pero no está demostrado; es uno de los Problemas del Milenio.

#### 8.16 ¿Qué es reducir un problema a otro?

Transformar cualquier instancia del problema A en una instancia del problema B, en tiempo polinomial, de modo que resolver B dé la respuesta de A. Es adaptar un problema nuevo al molde de uno que ya se sabe resolver. Ejemplo: armar horarios de exámenes se reduce a coloreo de grafos.

#### 8.17 ¿Para qué sirve reducir?

Para transferir dificultad. Si A se reduce a B y B es fácil (está en P), A también es fácil. Si A se reduce a B y A es difícil, B es al menos igual de difícil. El segundo uso es el más poderoso: permite demostrar que un problema es difícil sin buscar su algoritmo. Ejemplo: Partición se reduce a Sprint Justo tomando objetivo = suma total / 2 (si la suma es impar, la respuesta es directamente "no").

#### 8.18 ¿Qué es un problema NP-completo y uno NP-difícil?

**NP-completo**: está en NP (se verifica rápido) y todo problema de NP se reduce a él en tiempo polinomial; son los más difíciles dentro de NP. **NP-difícil**: cumple solo la segunda condición, es al menos tan difícil como cualquiera de NP, pero puede no estar en NP. Un algoritmo polinomial para un solo NP-completo demostraría P = NP.

#### 8.19 ¿Qué establece el teorema de Cook-Levin?

Que SAT (¿existe una asignación de variables booleanas que haga verdadera una fórmula?) es NP-completo; fue el primero (Cook 1971, Levin de forma independiente). Lo importante es el método: todo problema de NP se reduce a SAT, y eso permitió clasificar miles de problemas por reducciones encadenadas.

#### 8.20 Nombrá problemas NP-completos y pares de problemas parecidos con dificultad distinta.

NP-completos: SAT y 3-SAT, 3-coloreo, Clique, Partición, Subset Sum (Sprint Justo), Mochila y TSP (en su versión de decisión). Todos están conectados por reducciones: si uno cayera en P, caerían todos. Pares parecidos: camino de Euler (P) vs ciclo de Hamilton (NP-completo); 2-coloreo vs 3-coloreo; 2-SAT vs 3-SAT; camino más corto (P) vs camino simple más largo (NP-difícil).

#### 8.21 ¿Qué es un algoritmo pseudopolinomial?

Uno polinomial en el **valor** numérico de la entrada pero no en su **tamaño** en bits. Subset Sum con PD es O(n · objetivo): con objetivo 40 no hay problema, con un objetivo de 30 dígitos es gigantesco. Como un número W ocupa log W bits, O(n · W) es exponencial en el tamaño de la entrada; por eso no contradice que el problema sea NP-completo.

#### 8.22 ¿Qué se hace ante un problema NP-completo?

Dejar de buscar un algoritmo exacto y eficiente para el caso general y elegir una alternativa:

| Estrategia | Garantía | Costo | Cuándo |
| --- | --- | --- | --- |
| Exactos (p. ej. backtracking) | Óptimo | Exponencial en el peor caso | Instancia chica o con estructura aprovechable |
| Aproximación | Dentro de un margen del óptimo | Polinomial | Se necesita garantía de calidad |
| Heurísticas | Ninguna en teoría | Variable | Problema grande, alcanza con una buena solución |

Si solo hay que chequear una solución ya armada, no hace falta ninguna: verificar está en P.

#### 8.23 ¿Qué ventajas y límites tiene el marco teórico de P y NP?

Ventajas: saber que un problema es NP-completo evita buscar algo que probablemente no existe y orienta la elección de alternativas; además comunica mucho de forma compacta. Límites: trabaja con el peor caso, y muchas instancias reales de un NP-completo se resuelven rápido; y la clasificación depende del modelo de cómputo. La teoría da el marco; el contexto determina la estrategia.

#### 8.24 Dar ejemplos de problemas donde verificar es fácil y resolver es difícil.

Sprint Justo: encontrar un subconjunto de tareas que sume exactamente el objetivo puede tardar muchísimo, pero verificar uno ya armado toma segundos. Sudoku: encontrar la solución completa puede tardar mucho; verificar un tablero ya completo, segundos. Mochila: encontrar qué objetos maximizan el valor es difícil; chequear si una combinación cumple peso y valor es inmediato. Esa asimetría es lo que define a NP.

---

## Clase 9: DA Fuerza Bruta y DA Backtracking

### Fuerza bruta

#### 9.1 ¿Qué es la fuerza bruta y qué características tiene?

Una técnica que enumera todos los candidatos y evalúa cada uno. No usa la estructura del problema para descartar candidatos; si la solución existe y el espacio es finito, la encuentra; suele ser ineficiente para entradas grandes; y sirve como base de comparación para otros algoritmos.

#### 9.2 ¿Qué es el espacio de búsqueda y por qué hay que estimarlo antes?

Es el conjunto de todas las configuraciones posibles del problema; la fuerza bruta lo recorre generando y evaluando cada candidato. Hay que estimar su tamaño antes de elegir la estrategia: más variables implican un espacio más grande y un costo exponencial.

#### 9.3 ¿Cómo se calcula la complejidad de un algoritmo de fuerza bruta?

Tiempo ≈ (cantidad de candidatos) × (costo de evaluar uno). El espacio es lineal si los candidatos se generan sobre la marcha, pero si se guardan crece como la complejidad temporal.

| Ejemplo | Espacio de búsqueda | Costo |
| --- | --- | --- |
| Búsqueda secuencial | Posiciones del arreglo | O(n) |
| Divisores | Candidatos de 1 a √n | O(√n) |
| SAT | Asignaciones V/F | O(2ⁿ · m) |
| Superpermutación mínima | Órdenes de permutaciones | O((n!)! …) |

El método es el mismo en los cuatro: lo que cambia es el tamaño del espacio.

#### 9.4 ¿Por qué en divisores alcanza con llegar a √n? ¿Deja de ser fuerza bruta?

Porque los divisores vienen de a pares (d y n/d), así que al encontrar uno se obtiene el otro. Pasa de O(n) a O(√n), pero sigue probando candidatos uno por uno: es una mejora dentro de la fuerza bruta.

#### 9.5 ¿Cómo sería un ordenamiento por fuerza bruta?

El espacio de estados son las n! permutaciones del arreglo. Se genera cada permutación y se verifica si está ordenada (O(n)). La complejidad es O(n! · n).

#### 9.6 ¿Qué ventajas y límites tiene la fuerza bruta?

Ventajas: encuentra la solución si existe; prueba que no existe si no la hay; es simple de escribir y verificar; sirve de oráculo para probar otros algoritmos. Límites: crecimiento exponencial o factorial, inviable para entradas medianas, ignora información útil del problema y exige un espacio finito y numerable.

#### 9.7 ¿Cuándo conviene usar fuerza bruta?

Cuando el espacio de búsqueda es pequeño o acotado; cuando el costo de un error es inaceptable y se necesita una solución exacta garantizada; para verificar o comparar un algoritmo más eficiente; cuando el problema no ofrece estructura aprovechable; o como último recurso o primer experimento.

#### 9.8 ¿Qué lugar ocupa la fuerza bruta respecto de las demás técnicas?

Es el punto de partida: cada técnica de diseño es una forma de reducir el espacio de búsqueda. Fuerza bruta prueba todo; división y conquista resuelve partes chicas y combina; greedy sigue una sola rama; backtracking y ramificación y poda podan. También es la cota superior de NP: todo problema de NP se resuelve probando todos los certificados.

### Backtracking

#### 9.9 ¿Qué es backtracking?

Una técnica que construye candidatos a solución paso a paso y abandona cada candidato apenas detecta que no puede completarse en una solución válida, volviendo sobre sus pasos para extenderlo por otro camino.

#### 9.10 ¿Cómo se representa un problema de backtracking como árbol?

Cada nodo es un estado parcial, cada rama una decisión y cada hoja una solución o un callejón sin salida. El árbol puede ser enorme, pero no hace falta recorrerlo entero: si una decisión ya viola las condiciones, se abandona toda esa rama. Se recorre en profundidad (DFS).

#### 9.11 ¿En qué se diferencia backtracking de greedy y de fuerza bruta?

Greedy elige una vez y nunca vuelve atrás; backtracking deshace decisiones, por eso encuentra la solución si existe (siempre que el espacio sea finito y la poda no descarte soluciones válidas). Fuerza bruta genera configuraciones completas y recién ahí las verifica; backtracking poda ramas enteras apenas una decisión parcial es inválida.

#### 9.12 ¿Cuál es el esquema general de backtracking?

Si S es solución, se termina con éxito. Si no, para cada candidato x que extiende S: si es factible, se registra, se llama recursivamente, y si la llamada tuvo éxito se propaga el éxito sin deshacer; si falló, se borra x y se prueba el siguiente. Si ningún candidato sirvió, se devuelve falso y se vuelve atrás. Las cinco operaciones son EsSolucion, Extender, EsFactible, Registrar y Borrar.

#### 9.13 ¿Cómo se buscan todas las soluciones en lugar de la primera?

Simulando un fallo: al encontrar una solución, en vez de devolver verdadero se guarda una copia de S y se devuelve falso. El llamador cree que la rama falló, la deshace y sigue probando.

#### 9.14 ¿Cómo se resuelve N-reinas con backtracking?

Se ubica una reina por fila, empezando por la 0. En la fila actual se prueban columnas de izquierda a derecha hasta encontrar una sin conflicto; se registra y se pasa a la fila siguiente. Si ninguna columna sirve, se borra la reina de la fila anterior y se prueba su columna siguiente. Hay solución cuando hay N reinas.

#### 9.15 ¿Por qué conviene representar N-reinas con un arreglo en vez de una matriz?

Como hay una reina por fila, alcanza con un arreglo donde la posición es la fila y el valor la columna. Simplifica todo: solución es longitud N; registrar es agregar al final; borrar es quitar el último; extender es un solo ciclo sobre columnas; y la fila no hace falta chequearla porque el arreglo ya garantiza una reina por fila. Con matriz, extender requiere dos ciclos anidados y hay que chequear fila, columna y diagonales.

#### 9.16 ¿Cómo se detecta que dos reinas comparten diagonal?

Dos casillas están en la misma diagonal si tienen igual fila - columna o igual fila + columna. Factible significa además que la columna no se repita.

#### 9.17 ¿Qué es el coloreo exacto con backtracking y cuáles son sus operaciones?

Decidir si existe una k-coloración válida para un k dado (a diferencia del greedy, que puede usar más colores de los necesarios). Solución: todos los nodos coloreados válidamente. Extender: probar cada color para el nodo siguiente. Factible: ningún vecino ya coloreado tiene ese color. Registrar: asignar el color. Borrar: desasignarlo.

#### 9.18 ¿Cuáles son las operaciones de backtracking en un Sudoku 4×4?

S es la matriz con las pistas y 0 en las celdas vacías, recorridas de izquierda a derecha y de arriba hacia abajo. Solución: no quedan ceros. Extender: probar valores de 1 a 4 en la celda vacía actual. Factible: sin repetidos en fila, columna y cuadrante. Registrar: escribir el valor. Borrar: volver la celda a 0.

#### 9.19 ¿Qué es la poda y por qué importa tanto?

Abandonar una rama apenas se detecta que no lleva a una solución; es lo que separa al backtracking de la fuerza bruta. El desafío es encontrar condiciones de corte baratas de calcular que eliminen muchas ramas sin descartar soluciones. En 8 reinas: cualquier casilla 4.426.165.368 configuraciones; una por fila 8⁸ = 16.777.216; una por fila y columna 8! = 40.320; backtracking para todas las soluciones 15.720; para la primera, 876.

#### 9.20 ¿Cuál es el peor caso de backtracking?

Cuando la poda casi no corta y se recorre el árbol completo (para N-reinas por filas, del orden de Nᴺ nodos). Pasa cuando las restricciones solo se pueden verificar al final. Sigue siendo exponencial en el peor caso, aunque en la práctica puede ser órdenes de magnitud más rápido que la fuerza bruta.

---

## Clase 10: DA Ramificación y Poda

#### 10.1 ¿Por qué backtracking no alcanza para problemas de optimización?

Porque solo poda lo infactible. Si encuentra una solución de la mochila con ganancia $70 no puede detenerse: podría haber otra mejor sin explorar. Para garantizar el óptimo debe recorrer todas las ramas factibles, y en el peor caso eso equivale a fuerza bruta.

#### 10.2 ¿Qué es ramificación y poda (Branch and Bound)?

Una extensión de backtracking a problemas de optimización. Además de verificar factibilidad, calcula en cada nodo una cota del mejor valor alcanzable desde ahí y descarta la rama si esa cota no puede superar la mejor solución encontrada hasta el momento.

#### 10.3 ¿Qué es la función de cota?

Responde: dado el estado de un nodo, ¿cuál es el mejor valor que podría alcanzar cualquier solución que pase por él? Si no supera la mejor solución conocida, la rama se poda; si la supera, el nodo es prometedor y se expande. Es una estimación optimista, no la respuesta exacta.

#### 10.4 ¿Qué propiedades debe tener una buena función de cota?

* **Optimista**: nunca subestima el valor alcanzable (en maximización), así nunca poda una rama que mejoraba la solución.
* **Rápida de calcular**: si cuesta más que explorar la rama, no se gana nada.
* **Ajustada**: cuanto más cerca del valor real, más ramas poda.

#### 10.5 ¿Qué es un nodo prometedor en backtracking y en Branch and Bound?

En backtracking, un nodo es no prometedor si viola una restricción (infactibilidad). En B&B, además, es no prometedor si su cota no supera la mejor solución encontrada, aunque sea factible. B&B hace las dos podas y nunca descarta un nodo desde el que se pueda superar la mejor solución actual.

#### 10.6 ¿Cómo funciona la poda en un problema de maximización como la mochila?

Se mantiene la mejor ganancia encontrada (maxprofit) y para cada nodo se calcula una cota **superior** de la ganancia alcanzable desde él. Se poda por infactibilidad si el peso acumulado supera la capacidad, y por cota si la cota es menor o igual a maxprofit: ni en el escenario más favorable esa rama mejoraría lo que ya hay. Cada vez que se encuentra una solución mejor, maxprofit sube y se podan más nodos.

#### 10.7 ¿Cómo cambia la poda en un problema de minimización como el viajante?

La dirección se invierte: la cota es **inferior** (lo mínimo que podría costar cualquier tour que pase por ese nodo) y se poda si esa cota ya es mayor o igual al mejor tour conocido.

#### 10.8 ¿Qué tipos de recorrido puede usar Branch and Bound?

| | DFS | BFS | Best-First |
| --- | --- | --- | --- |
| Estructura | Pila o recursión | Cola FIFO | Cola de prioridad por cota |
| Próximo nodo | El último generado | El más antiguo | El de cota más prometedora |
| Memoria | Baja | Alta | Alta en el peor caso |

#### 10.9 ¿Por qué en Best-First hay que volver a comparar la cota al extraer un nodo?

Porque un nodo puede ser prometedor cuando se inserta y dejar de serlo mientras espera en la cola, si maxprofit creció mientras tanto. En el ejemplo del apunte, un nodo entró con cota $82 cuando maxprofit era $40, y al salir maxprofit ya era $90.

#### 10.10 En Best-First, ¿por qué se puede terminar apenas sale un nodo cuya cota no mejora? ¿Y por qué la primera solución completa que sale es la óptima?

Porque siempre sale el nodo con la mejor cota: si ese no mejora la mejor solución, ninguno de los pendientes puede hacerlo. En un recorrido en profundidad eso no vale, porque el nodo que sale no es el de mejor cota. Y la cota de una solución completa es su valor real: si salió primero, ninguna cota pendiente (que nunca es peor que el valor real) puede dar algo mejor.

#### 10.11 ¿Cuál es la cota en el problema de suma máxima de subconjuntos y qué tipos de poda aparecen?

Suma acumulada más todos los números que todavía no se decidieron: el mejor caso es incluir todo lo que queda. Con {10, 8, 7, 2} y W = 16, el nodo {10, 8} se poda por infactibilidad (18 > 16); el nodo {10, sin 8, sin 7} se poda por cota (12 no supera la mejor conocida, 15) aunque es factible. Esa segunda poda es la novedad de B&B.

#### 10.12 ¿Cómo se calcula la cota en la mochila 0/1?

Con los ítems ordenados por p/w: se toma la ganancia acumulada, se suman ítems enteros en ese orden mientras entren, y se suma la fracción del primer ítem que no entra entero que cabe en el peso restante. bound = (profit + Σ pⱼ de los que entran) + (W - totweight) · pₖ/wₖ, donde k es el primer ítem que no entra. Es la mochila fraccionaria sobre lo que falta decidir: un valor que ninguna solución entera puede superar.

#### 10.13 ¿Por qué conviene obtener una solución inicial con greedy antes de aplicar B&B?

Porque arrancar con una buena solución (maxprofit inicial alto, o un tour inicial corto) permite podar por cota desde el principio. En la mochila del apunte, el greedy entero por p/w da $80 como maxprofit inicial. En el TSP, el tour del vecino más cercano da 31 y se poda todo nodo con cota ≥ 31. El candidato inicial no tiene por qué ser óptimo ni único.

#### 10.14 ¿Qué cota se usa en el TSP?

Mínimos por fila: todo vértice se abandona exactamente una vez, así que cualquier tour cuesta al menos la suma de la salida más barata de cada vértice (21 en el ejemplo). Al avanzar, las salidas ya elegidas usan su costo real y las demás el mínimo de su fila, excluyendo aristas que ya no pueden usarse (entrar a un vértice que ya tiene entrada, o volver al origen antes de tiempo). Otras cotas posibles: mínimos por columna (19) o reducción de matriz (22); el óptimo real era 30.

#### 10.15 ¿Conviene siempre usar la cota más ajustada?

No necesariamente. Una cota más ajustada reduce los nodos visitados, pero si calcularla es muy costoso el tiempo total puede ser mayor. El objetivo es minimizar el tiempo total, no la cantidad de nodos.

#### 10.16 Compará backtracking y Branch and Bound.

| | Backtracking | Branch and Bound |
| --- | --- | --- |
| Objetivo | Factibilidad (una o todas las soluciones) | Optimización (la mejor) |
| Recorrido | DFS fijo | Flexible: BFS, DFS, Best-First |
| Poda | Infactibilidad | Infactibilidad + cota |
| Estructura | Pila o recursión | Pila, cola o cola de prioridad |
| Peor caso | Exponencial | Exponencial |
| Ventaja práctica | Encuentra soluciones válidas rápido | Llega al óptimo sin explorar todo el árbol |

La diferencia no está en la garantía del peor caso sino en el comportamiento en instancias reales.

#### 10.17 ¿Cuándo conviene Branch and Bound y cuándo no?

Conviene cuando hay una cota barata y ajustada, cuando se consigue temprano una buena solución (por ejemplo con greedy) y cuando la instancia es demasiado grande para fuerza bruta. No conviene cuando la cota es laxa y poda poco, cuando no hay forma de acotar una solución parcial o cuando la instancia es chica y la fuerza bruta alcanza. En el peor caso recorre tanto como la fuerza bruta, más el costo de calcular las cotas.

#### 10.18 ¿Qué lugar ocupa B&B en el panorama de paradigmas?

Greedy es rápido sin garantía de óptimo global; división y conquista resuelve subproblemas independientes; backtracking explora exhaustivamente podando infactibles (útil para factibilidad); B&B explora implícitamente todo el árbol podando además subóptimos (útil para optimización). Con la misma garantía de optimalidad: fuerza bruta evalúa todos los nodos, backtracking poda infactibles, B&B poda infactibles y subóptimos.

---

## Clase 11: DA Programación Dinámica 1

#### 11.1 ¿Qué problema resuelve la programación dinámica?

El de resolver muchas veces los mismos subproblemas. En Fibonacci recursivo, fib(30) hace 2.692.537 llamadas; si cada valor se anota la primera vez y se consulta después, alcanzan 29 sumas. Algunos problemas son difíciles solo porque los resolvemos mal.

#### 11.2 ¿Qué es la programación dinámica?

Una técnica que divide el problema en subproblemas más pequeños que se repiten, resuelve cada uno una sola vez, guarda su resultado y los combina para construir la solución completa. En un problema de optimización, esa solución es el óptimo global.

#### 11.3 ¿Qué condiciones debe cumplir un problema para aplicar PD?

**Subestructura óptima** (principio de optimalidad de Bellman): la solución óptima se arma con soluciones óptimas de subproblemas más chicos. **Subproblemas superpuestos**: al dividir recursivamente, el mismo subproblema aparece más de una vez. En el ladrón: robar(i) solo necesita robar(i - 1) y robar(i - 2), y robar(3) aparece en dos ramas del árbol.

#### 11.4 ¿Cómo se aplica la memoización (top-down)?

Se conserva la recursión y se agrega una memoria compartida por todas las llamadas: 1) agregar la memoria como parámetro; 2) definir la clave de cada subproblema; 3) al empezar, si la clave ya está en la memoria, devolver lo guardado; 4) antes de devolver un resultado calculado, guardarlo.

#### 11.5 ¿Cómo se aplica la tabulación (bottom-up)?

Se resuelven primero los subproblemas más chicos y se arman los grandes a partir de ellos, sin recursión: 1) ver de qué depende cada valor (grafo de dependencias); 2) decidir qué significa cada celda; 3) llenar la tabla en un orden donde las dependencias ya estén calculadas; 4) devolver la celda que responde el problema.

#### 11.6 ¿Qué diferencias hay entre top-down y bottom-up?

| Aspecto | Top-down (memoización) | Bottom-up (tabulación) |
| --- | --- | --- |
| Facilidad de implementación | ✅ | |
| Memoria con tabla densa | | ✅ |
| Memoria con tabla dispersa | ✅ | |
| Sin riesgo de stack overflow | | ✅ |
| Posibilidad de optimizar el espacio | | ✅ |
| Complejidad temporal | Igual | Igual |

Top-down parte de la recursión y solo calcula los subproblemas que se necesitan, por eso rinde mejor si la tabla es dispersa. Bottom-up no usa la pila de recursión y permite guardar solo las últimas celdas (FibSinTabla usa dos variables). En Fibonacci las dos son O(n): la ventaja concreta de bottom-up es que no se desborda la pila cuando n es muy grande.

#### 11.7 ¿Cuál es la receta de diseño de programación dinámica?

1) **Subproblema**: qué calcula f(…) y qué parámetros necesita. 2) **Decisión**: qué opciones hay en el último paso, lo que da la recurrencia (max o min). 3) **Caso base**: qué subproblemas se responden sin recursión. 4) **Orden**: de qué depende cada valor, para memoizar o llenar la tabla. 5) **Respuesta**: qué valor resuelve el problema original. 6) **Complejidad**: cantidad de subproblemas × costo de decidir.

#### 11.8 ¿Cómo se resuelve el problema del ladrón de casas con PD?

Subproblema: robar(i) = máximo botín con las casas 0..i. Decisión sobre la casa i: robarla (casas[i] + robar(i - 2)) o no (robar(i - 1)); se toma el máximo. Casos base: robar(0) = casas[0], robar(1) = max(casas[0], casas[1]). En tabla: dp[i] = max(dp[i-1], dp[i-2] + casas[i-1]). Complejidad: n subproblemas × O(1) = O(n), contra O(2ⁿ) por fuerza bruta. Como cada celda usa solo las dos anteriores, el espacio baja a O(1) con dos variables.

#### 11.9 ¿Por qué no alcanza con una estrategia ávida en el ladrón de casas?

"Robar la casa más rica disponible y descartar sus vecinas" puede dar el máximo en un ejemplo, pero que funcione en un caso no prueba que funcione en cualquier calle. Para que greedy sea correcto hay que demostrar la propiedad de elección ávida.

#### 11.10 ¿Qué se rompe en el ladrón con casas en círculo y cómo se resuelve?

La recurrencia de la calle recta no sabe si se robó la casa 0, y en el círculo la primera y la última son vecinas: puede devolver una solución que las usa a ambas. Se resuelve partiendo en dos casos de calle recta: sin la casa 0 y sin la última, y se toma el máximo; sigue siendo O(n). Moraleja: si el subproblema no recuerda algo que se necesita, se parte en casos o se agrega un parámetro.

#### 11.11 ¿Cuándo la PD no aporta nada frente a la recursión directa?

Cuando los subproblemas no se repiten. En MergeSort las dos mitades nunca comparten subproblemas: memoizar no ahorra nada y división y conquista es suficiente.

#### 11.12 ¿Qué calcula Floyd y cómo se plantea como PD?

El camino mínimo entre todo par de nodos de un grafo ponderado. Subproblema: dist(i, j, k) = mínima distancia de i a j usando solo nodos {1..k} como intermediarios. Recurrencia: dist(i, j, k) = min(dist(i, j, k-1), dist(i, k, k-1) + dist(k, j, k-1)), es decir, ver si pasar por k mejora el camino conocido. Se llena de k = 0 a k = n (bottom-up natural) y la respuesta es toda la tabla para k = n. Tiene tres bucles anidados sobre los V vértices: O(V³).

#### 11.13 ¿Qué calcula Warshall?

La clausura transitiva: para cada par de nodos, si existe algún camino entre ellos. Subproblema: C(i, j, k) = ¿existe camino de i a j usando solo nodos {1..k} como intermediarios? Se llena igual que Floyd, de k = 0 a k = n.

#### 11.14 ¿Por qué Floyd-Warshall es programación dinámica y no "un algoritmo de grafos" más?

Porque cumple las dos condiciones: subestructura óptima (si el camino mínimo de i a j pasa por k, los tramos i→k y k→j también son mínimos) y superposición (cada dist(i, k, k - 1) se reutiliza para toda una fila de celdas). Aunque la tabla tiene tres índices, se guarda en una sola matriz de n × n: durante la iteración k, la fila y la columna k no cambian.

#### 11.15 ¿Cómo se resuelve el cambio con mínima cantidad de monedas con PD?

Subproblema: m(x) = mínima cantidad de monedas para pagar exactamente x. Decisión, ¿cuál es la última moneda?: m(x) = 1 + min{ m(x - d) : d ∈ D, d ≤ x }. Caso base: m(0) = 0, y ∞ si ninguna moneda da un valor finito. Orden: x = 0, 1, …, M. Respuesta: m(M) (∞ significa que no se puede pagar). Complejidad: O(M · k) en tiempo y O(M) en espacio. Con D = {1, 3, 4} y M = 6, greedy da 3 monedas (4 + 1 + 1) y PD da 2 (3 + 3).

#### 11.16 ¿En qué se diferencia la PD de división y conquista y de greedy?

Con división y conquista comparte dividir en subproblemas y resolverlos recursivamente, pero en DyC los subproblemas son disjuntos y en PD se solapan, por eso PD guarda resultados. Con greedy comparte la subestructura óptima, pero greedy toma una sola decisión irrevocable por paso, mientras que PD evalúa todas las opciones de cada subproblema y elige la mejor, por eso garantiza el óptimo sin necesitar la propiedad de elección ávida.

---

## Clase 12: DA Programación Dinámica 2

#### 12.1 ¿Para qué sirve la programación dinámica? ¿Cuándo se utiliza? Dar un ejemplo resuelto bottom-up. (parcial)

Sirve para resolver problemas de optimización (o de conteo) cuyos subproblemas se repiten, calculando cada uno una sola vez. Se utiliza cuando el problema tiene subestructura óptima y subproblemas superpuestos. Ejemplo bottom-up, mochila con V = {200, 300, 150}, W = {3, 3, 1}, capacidad 4: se arma una tabla de objetos × capacidades (0 a 4), la fila 0 en ceros, y cada celda vale max(no tomar el objeto, su valor + la celda de la fila anterior con la capacidad menos su peso), si entra. La última celda da 450 (laptop + guitarra).

#### 12.2 ¿Qué agrega la versión 2 de la receta de PD?

Pensar el problema como tabla: 1) qué significa la celda (i, j); 2) decisión o recurrencia, mirando qué opciones tiene el último elemento; 3) caso base, normalmente la fila 0 y la columna 0; 4) orden de llenado, que lo dicta el grafo de dependencias; 5) respuesta: qué celda leer y cómo reconstruir la solución; 6) complejidad: celdas × trabajo por celda.

### LCS y distancia de edición

#### 12.3 ¿Qué es una subsecuencia y qué es la LCS?

Una subsecuencia se obtiene borrando caracteres sin cambiar el orden de los que quedan (no tienen que ser contiguos). La LCS es la subsecuencia común más larga entre dos cadenas. Por fuerza bruta habría que probar las 2ⁿ subsecuencias de una de ellas.

#### 12.4 ¿Cuál es la recurrencia de LCS?

lcs(i, j) = largo de la LCS entre los primeros i caracteres de A y los primeros j de B. Vale 0 si i = 0 o j = 0; si A[i] = B[j], lcs(i - 1, j - 1) + 1; si no, max(lcs(i - 1, j), lcs(i, j - 1)). Se llena fila por fila, de izquierda a derecha, así las tres celdas de las que depende ya están calculadas. Complejidad O(n · m).

#### 12.5 ¿Cómo se reconstruye la subsecuencia en LCS?

Desde la celda inferior derecha hacia atrás: si A[i] = B[j], ese carácter es parte de la LCS, se anota y se mueve en diagonal; si no, se mueve hacia arriba si lcs(i - 1, j) ≥ lcs(i, j - 1), y si no hacia la izquierda. El valor está en la última celda; la solución, en el camino de vuelta.

#### 12.6 ¿Qué es la "PD sobre prefijos"?

Un patrón general de PD con tabla 2D: el subproblema es un par de prefijos (i, j); la tabla tiene (n + 1) · (m + 1) celdas con la fila 0 y la columna 0 como casos base; cada celda depende de vecinas ya calculadas; el valor está en la última celda y la solución se reconstruye volviendo. LCS y distancia de edición lo siguen.

#### 12.7 ¿Qué es la distancia de edición y cuál es su recurrencia?

El mínimo número de inserciones, borrados y sustituciones (costo 1 cada una) para transformar word1 en word2 (distancia de Levenshtein). edit(i, j) vale j si i = 0 y i si j = 0; si w1[i] = w2[j], edit(i - 1, j - 1); si no, 1 + min(edit(i - 1, j) borrar, edit(i, j - 1) insertar, edit(i - 1, j - 1) sustituir). Se llena fila por fila; respuesta edit(n, m); O(n · m) en tiempo y espacio.

#### 12.8 ¿Qué cambia entre LCS y distancia de edición? ¿Cómo se reconstruyen los cambios?

La estructura es casi idéntica; cambian la decisión (tres opciones y mínimo, en vez de máximo) y el caso base (la fila y columna 0 valen i o j, no 0). Para reconstruir, desde la última celda: si los caracteres coinciden, no hay operación y se mueve en diagonal; si el mínimo vino de (i - 1, j - 1) fue sustitución; de (i - 1, j), borrado; de (i, j - 1), inserción.

### Mochila 0/1

#### 12.9 ¿Qué es la mochila 0/1 y por qué no se resuelve con greedy?

Hay n objetos con valor y peso, y una capacidad W; cada objeto se lleva entero o no se lleva, y se maximiza el valor total sin exceder W. Greedy por valor/peso falla porque no se puede fraccionar y una elección localmente buena puede desperdiciar capacidad: con V = {60, 100, 120}, W = {10, 20, 30} y capacidad 50, greedy da 160 y el óptimo es 220.

#### 12.10 ¿Cuál es el subproblema y la recurrencia de la mochila 0/1?

Top-down: r(w, i) = máximo valor con capacidad w usando los objetos i…n-1. Vale 0 si i = n; r(w, i + 1) si el objeto i no entra (W[i] > w); y si entra, max(r(w, i + 1) no tomarlo, V[i] + r(w - W[i], i + 1) tomarlo). En tabla: t(i, j) = max(t(i - 1, j), V(i) + t(i - 1, j - W(i))) si W(i) ≤ j, y t(i - 1, j) si no. Cada fila agrega un objeto, cada columna es una capacidad y la celda es la mayor ganancia.

#### 12.11 ¿Por qué hace falta el caso "no entra" en la recurrencia?

Porque sin él la fórmula acepta capacidades negativas y elige objetos que no caben: en el ejemplo da 650, que es imposible (el óptimo es 450).

#### 12.12 ¿Cómo se sabe qué objetos se eligieron?

Recorriendo la tabla hacia atrás desde la última celda: si t[i][j] ≠ t[i-1][j], el objeto i se tomó, se anota y se resta su peso a j; si son iguales, no se tomó. Alternativa: guardar en cada celda una palabra de bits con los objetos elegidos, a costa de n bits más por celda.

#### 12.13 ¿Cuáles son los errores típicos en la mochila con PD?

No cortar cuando el objeto no entra (da 650); usar W[i] < j en vez de W[i] ≤ j (da 300, menos de lo posible); armar la tabla de n × W en vez de (n + 1) × (W + 1) (la última celda queda fuera de rango); usar greedy por valor/peso; y decir que O(n · W) es polinomial.

#### 12.14 ¿Por qué O(n · W) es pseudopolinomial?

Porque W ocupa unos log₂ W bits. Si b = log₂ W, entonces W = 2ᵇ y la complejidad es O(n · 2ᵇ): exponencial en el tamaño en bits de la entrada, aunque polinomial en el valor numérico de W.

### Síntesis de técnicas

#### 12.15 Compará todas las técnicas de diseño vistas.

| Técnica | Garantiza | Cuándo aplica | Costo típico |
| --- | --- | --- | --- |
| Fuerza bruta | Solución correcta | Siempre | Exponencial |
| División y conquista | Solución correcta | Subproblemas disjuntos | Según la recurrencia |
| Greedy | Óptimo global solo si se demuestra la propiedad greedy | Elección greedy segura | O(n log n) por el ordenamiento |
| Backtracking | Completitud | Espacio de búsqueda acotable | Exponencial (podado) |
| Ramificación y poda | Óptimo global | Función de cota disponible y simple | Exponencial (podado) |
| Programación dinámica | Óptimo global | Subestructura + solapamiento | Celdas × trabajo |

#### 12.16 ¿Qué garantiza cada técnica y cómo se elige cuál usar?

Greedy garantiza el óptimo si la propiedad greedy está demostrada; si no, ninguna garantía. División y conquista da una solución correcta si los subproblemas son independientes; si se solapan, repite trabajo. Backtracking explora todas las soluciones válidas podando por restricciones; podar además por valor es lo que agrega ramificación y poda. PD garantiza el óptimo si hay subestructura óptima, y es eficiente si los subproblemas se solapan y son pocos. No hay técnica perfecta: hay que elegir la adecuada según qué garantiza cada una.

#### 12.17 ¿Puede la tabla de PD guardar algo distinto de la respuesta del problema?

Sí. En la suma máxima de subrectángulos, la tabla guarda sumas parciales: PD[i][j] = suma de M[0][0] a M[i][j], calculada como PD[i-1][j] + PD[i][j-1] - PD[i-1][j-1] + M[i][j]. Con eso la suma de cualquier rectángulo se obtiene en O(1) con cuatro accesos, y el algoritmo baja de O(N⁶) a O(N⁴). La tabla no guarda el resultado sino información intermedia que acelera un paso interno; estos casos son más difíciles de detectar que Fibonacci.

#### 12.18 ¿Cómo se usa la PD en problemas de conteo?

Igual que en optimización, pero la recurrencia suma las formas de llegar en lugar de tomar el máximo o el mínimo. Ejemplo: contar de cuántas formas una abeja llega de una celda a otra del panal moviéndose solo en ciertas direcciones.
