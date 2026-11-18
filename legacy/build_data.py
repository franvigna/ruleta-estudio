import re, json, markdown

TOPICS = [
 ("fund","CC: Fundamentos","CC Fundamentos","CC"),
 ("recur","DA: Recursividad","Recursividad","DA"),
 ("rel","CC: Relaciones de Recurrencia","Recurrencias","CC"),
 ("tm","CC: Teorema Maestro","Teorema Maestro","CC"),
 ("dyc","DA: División y Conquista","División y Conquista","DA"),
 ("heap","TDA: Montículos - Cola de Prioridad","Montículos","TDA"),
 ("greedy","DA: Algoritmos Ávidos","Ávidos","DA"),
 ("grfund","GR: Fundamentos","GR Fundamentos","GR"),
 ("recorr","GR: Recorridos","Recorridos","GR"),
 ("cam","GR: Caminos Mínimos","Caminos Mínimos","GR"),
 ("mst","GR: Árboles Abarcadores","Árboles Abarcadores","GR"),
 ("col","GR: Coloreo","Coloreo","GR"),
 ("np","CC: Conceptos Avanzados","Conceptos Avanzados","CC"),
 ("fb","DA: Fuerza Bruta","Fuerza Bruta","DA"),
 ("bt","DA: Backtracking","Backtracking","DA"),
 ("bb","DA: Ramificación y Poda","Ramificación y Poda","DA"),
 ("pd1","DA: Programación Dinámica 1","Prog. Dinámica 1","DA"),
 ("pd2","DA: Programación Dinámica 2","Prog. Dinámica 2","DA"),
]

def quotes(s):
    out=[];o=True
    for ch in s:
        if ch=='"':
            out.append('“' if o else '”'); o=not o
        else: out.append(ch)
    return ''.join(out)

def md(s):
    h=markdown.markdown(quotes(s.strip()), extensions=['tables'])
    h=h.replace('<table>','<div class="tbl"><table>').replace('</table>','</table></div>')
    return h

def blocks(path):
    """yield (h2, h3, question, body)"""
    h2=h3=None; q=None; body=[]
    for line in open(path).read().split('\n')+['## END']:
        if line.startswith('#### ') or line.startswith('### ') or line.startswith('## ') or line.strip()=='---':
            if q is not None: yield h2,h3,q,'\n'.join(body).strip()
            q=None; body=[]
            if line.startswith('#### '): q=line[5:].strip()
            elif line.startswith('### '): h3=line[4:].strip()
            elif line.startswith('## '): h2=line[3:].strip(); h3=None
        elif q is not None:
            body.append(line)

items=[]
# ---------- teóricas
def topic_teo(num):
    c,s=map(int,num.split('.'))
    if c==1: return 'fund'
    if c==2: return 'recur' if s<=7 else ('rel' if s<=13 else 'tm')
    if c==6: return 'grfund' if s<=10 else 'recorr'
    if c==7: return 'cam' if s<=9 else 'mst'
    if c==8: return 'col' if s<=10 else 'np'
    if c==9: return 'fb' if s<=8 else 'bt'
    return {3:'dyc',4:'heap',5:'greedy',10:'bb',11:'pd1',12:'pd2'}[c]

teo={}
for h2,h3,q,b in blocks('legacy/preguntas_teoricas.md'):
    m=re.match(r'(\d+\.\d+)\s+(.*)',q); num,text=m.group(1),m.group(2)
    parcial='(parcial)' in text
    text=text.replace('(parcial)','').strip()
    teo[num]=(text,b)
    items.append(dict(id='t'+num,t=topic_teo(num),k='teo',q=md(text),a=md(b),n='',
                      badge='Tomada en parciales' if parcial else '',ref=num))

# ---------- para pensar
SEC={'Clase 1':'fund','Clase 3':'dyc','Clase 4':'heap','Clase 5':'greedy','Clase 10':'bb','Clase 11':'pd1','Clase 12':'pd2'}
SUB={'DA: Recursividad':'recur','CC: Relaciones de Recurrencia':'rel','CC: Teorema Maestro':'tm',
     'GR: Fundamentos':'grfund','GR: Recorridos de Grafos':'recorr','GR: Caminos Mínimos':'cam',
     'GR: Árboles Abarcadores':'mst','GR: Coloreo':'col','CC: Conceptos Avanzados':'np',
     'DA: Fuerza Bruta':'fb','DA: Backtracking':'bt'}
NOTE='Las diapositivas no traen respuesta para esta pregunta: está armada con la teoría de la misma clase.'
COMPOSED={
 '¿Por qué no utilizamos siempre':'La eficiencia no es el único criterio: además del tiempo y la memoria importan la claridad de la solución y la facilidad de codificación. Y "el mejor" depende del contexto: inserción gana con datos casi ordenados y selección cuando cada posición guarda mucha información; MergeSort garantiza O(n log n) pero necesita O(n) de memoria extra; y con entradas chicas la diferencia entre órdenes casi no importa, así que puede convenir lo más simple.',
 '¿Cómo se calcula en forma teórica':'Contando operaciones elementales en función del tamaño de la entrada, sin ejecutar nada. Las sentencias simples cuestan una constante, una secuencia suma sus costos, un condicional cuesta la condición más la rama más cara y un bucle multiplica la cantidad de iteraciones por el costo del cuerpo (reglas de la suma y del producto). Con eso se arma T(n) y se expresa su orden con notación asintótica.',
 '¿Y en forma empírica?':'Implementando el algoritmo y midiendo: se eligen entradas de tamaño creciente (duplicando cada vez), se ejecuta varias veces cada una, se promedia descartando las primeras corridas, y se grafica el tiempo contra el tamaño. Cómo cambia el tiempo al duplicar n muestra la complejidad. La desventaja es que hay que codificar y los resultados dependen de la máquina.',
 '¿Puede resolverse exactamente el mismo problema':'Sí. Un mismo problema admite varios algoritmos, con distintas estrategias de diseño (fuerza bruta, división y conquista, greedy, programación dinámica, backtracking, ramificación y poda) y estructura iterativa o recursiva. Ordenar, por ejemplo, se resuelve con selección, inserción, MergeSort, QuickSort o HeapSort, con costos y propiedades distintas.',
 '¿Cuáles eran las cuatro características':'**Sensible a la entrada**: su tiempo varía según cómo viene la entrada. **Estable**: conserva el orden original de los elementos con igual clave. **En línea**: puede procesar los datos a medida que llegan. **En el lugar**: ordena usando solo espacio adicional constante.',
 'Pero… ¿cómo medimos el costo':'Planteando una **relación de recurrencia**: una ecuación que expresa T(n) en función del costo de instancias más chicas del mismo problema, con un caso base y un caso recursivo. Después se resuelve por telescopía, con un árbol de recursión o, si tiene la forma a·T(n/b) + nᶜ, con el Teorema Maestro.',
 'La telescopía funciona bien':'Sí: el **Teorema Maestro**. Para recurrencias de la forma T(n) = a·T(n/b) + nᶜ alcanza con comparar logb(a) contra c para obtener el orden, sin hacer el desarrollo completo.',
}
DYC={'1.':'3.8','2.':'3.10','3.':'3.17','5.':'2.20'}
for h2,h3,q,b in blocks('legacy/preguntas_para_reflexionar.md'):
    cl=h2.split(':')[0]
    tp=SEC.get(cl) or SUB.get(h3)
    text=re.sub(r'^\d+\.\s+','',q)
    body='\n'.join(l for l in b.split('\n') if not l.startswith('*Sin respuesta')).strip()
    note=''; badge=''
    if not body:
        note=NOTE
        for k,v in COMPOSED.items():
            if text.startswith(k): body=v
        if not body and tp=='dyc':
            n=q.split()[0]
            if n=='4.': body='Que ante dos elementos con la misma clave de ordenamiento se conserva su orden original. De los dos, **MergeSort** es estable: en la fusión, ante un empate toma primero el elemento de la mitad izquierda, que venía antes. QuickSort no es estable.'
            else: body=teo[DYC[n]][1]
    assert body, q
    if body.startswith('*(De las diapositivas.)*'):
        body=body.replace('*(De las diapositivas.)*','').strip(); badge='Agregada desde las diapositivas'
    qh=md(text)
    if text.startswith('Votación:'):
        badge='Votación de clase'; note='Las diapositivas no marcan la opción correcta: la respuesta sale de la teoría de la clase.'
        stem=text[len('Votación:'):].strip()
        parts=re.split(r'\s([A-D])\)\s',' '+stem)
        stem=parts[0].strip(); opts=[(parts[i],parts[i+1].strip()) for i in range(1,len(parts),2)]
        qh='<p>'+quotes(stem)+'</p><ol class="opts">'+''.join(f'<li><b>{L}</b> {quotes(o)}</li>' for L,o in opts)+'</ol>'
    import hashlib
    items.append(dict(id='r'+hashlib.md5(text.encode()).hexdigest()[:10],t=tp,k='ref',q=qh,a=md(body),n=note,badge=badge,ref=''))

data=dict(topics=[dict(id=a,name=b,short=c,area=d) for a,b,c,d in TOPICS],items=items)
for tid in [t[0] for t in TOPICS]:
    print(tid, sum(1 for i in items if i['t']==tid and i['k']=='teo'), sum(1 for i in items if i['t']==tid and i['k']=='ref'))
json.dump(data,open('legacy/data.json','w'),ensure_ascii=False)
print(len(items))
