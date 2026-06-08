# Proyecto 4: OrbitalJS - Simulador de Órbitas Planetarias (NASA API)

**Conceptos de Cálculo:** Funciones Vectoriales, EDOs (Sistema Vectorial), Gravitación.
**Dificultad:** Media-Alta.

## 1. Resumen Ejecutivo
OrbitalJS es un simulador del sistema solar que combina datos posicionales reales de la NASA con la resolución numérica de las ecuaciones de movimiento gravitacional. Las posiciones y velocidades de los planetas se modelan como funciones vectoriales $r(t)$ en el espacio 2D, y su evolución temporal se obtiene resolviendo el sistema de EDOs derivado de la Segunda Ley de Newton. La API NASA JPL Horizons -gratuita y pública- proporciona efemérides reales que sirven como condiciones iniciales del integrador. El usuario puede lanzar una nave espacial y observar cómo su trayectoria (función vectorial) se curva por la atracción gravitacional de cada planeta.

## 2. Fundamentos Matemáticos Ampliados

### 2.1 Funciones Vectoriales y Trayectorias
La posición de cada cuerpo celeste es una función vectorial del tiempo $r:\mathbb{R}\rightarrow\mathbb{R}^{2}$:
$r(t)=(x(t),y(t))$

La velocidad $v(t)=r^{\prime}(t)=(x^{\prime}(t),y^{\prime}(t))$ y la aceleración $a(t)=r^{\prime\prime}(t)$ son las derivadas primera y segunda de esta función vectorial. El simulador dibuja las curvas paramétricas $r(t)$ como órbitas en pantalla, haciendo visual el concepto de función vectorial.

### 2.2 EDOs del Movimiento Gravitacional
Por la Segunda Ley de Newton y la Ley de Gravitación Universal, la aceleración de un cuerpo de masa m bajo la influencia de N cuerpos es:
$d^{2}r_{i}/dt^{2} = G \sum m(r - r_{1}) / r_{i}^{3}$

Este sistema vectorial de EDOs de segundo orden se reduce a un sistema de primer orden introduciendo $v_{i}=dr_{i}/dt$; el estado completo del sistema es el vector $[r_{1},v_{1},r_{2},v_{2},...,r_{n},v_{n}]$, con 4N componentes para N cuerpos en 2D.

### 2.3 Condiciones Iniciales desde la NASA
La API JPL Horizons devuelve las posiciones (X, Y) en UA y velocidades (VX, VY) en UA/día de cualquier planeta en cualquier fecha. Estas son las condiciones iniciales exactas del integrador:
* $r(t_{0}) = (X\_NASA, Y\_NASA)$
* $v(t_{0}) = (VX\_NASA, VY\_NASA)$

Usar datos reales valida matemáticamente el modelo: si el integrador reproduce las posiciones futuras que la NASA ya conoce, la implementación es correcta. Esta verificación es parte de la documentación del proyecto.

### 2.4 Conservación de Energía como Verificador
La energía mecánica total del sistema debe conservarse (sistema hamiltoniano). El error numérico se cuantifica midiendo la variación porcentual de E a lo largo de la simulación:
$E = \sum V_{i} G m_{i} m_{j} / |r_{i}-r_{j}|$
$Error = |E(t)-E(t_{0})| / |E(t_{0})| \times 100\%$

Monitorear $E(t)$ en tiempo real es una prueba automática de la precisión del integrador: Euler muestra drift notable mientras RK4 conserva E con $<0.01\%$ de error.

## 3. Arquitectura del Software

### 3.1 Módulos Principales

| Módulo | Función | Concepto de Cálculo |
| :--- | :--- | :--- |
| **NASA Data Fetcher** | Consulta JPL Horizons API para posiciones y velocidades reales | REST API + parsing de texto plano |
| **N-Body Solver (RK4)** | Resuelve sistema vectorial de EDOs para N planetas simultáneamente | RK4 con paso adaptativo |
| **Renderer de Órbitas** | Dibuja $r(t)$ como curva paramétrica animada en canvas 2D | p5.js con trails de trayectoria |
| **Lanzador de Nave** | Permite colocar nave con velocidad inicial y seguir su trayectoria | Función vectorial interactiva |
| **Monitor de Energía** | Gráfica $E(t)$ en tiempo real para verificar conservación | Chart.js con alerta de drift |

### 3.2 Ciclo Principal del Integrador (pseudocódigo)

```javascript
// Obtener datos NASA JPL Horizons
const url = '[https://ssd.jpl.nasa.gov/api/horizons.api](https://ssd.jpl.nasa.gov/api/horizons.api)' +
'?format=json&COMMAND=499' + // 499 = Marte
'&OBJ_DATA=NO&MAKE_EPHEM=YES' +
'&EPHEM_TYPE=VECTORS&CENTER=500@10' // Sol como centro

// Función de aceleración gravitacional N-cuerpos
function gravity(bodies) {
  return bodies.map((b, i) => {
    let ax = 0, ay = 0;
    bodies.forEach((other, j) => {
      if (i === j) return;
      const dx = other.x - b.x, dy = other.y - b.y;
      const r3 = Math.pow(dx*dx + dy*dy, 1.5);
      ax += G * other.m * dx / r3;
      ay += G * other.m * dy / r3;
    });
    return { ax, ay };
  });
}
```

## 4. Mejoras y Extensiones Propuestas

*
**Transferencia de Hohmann:** Calcular la maniobra orbital más eficiente (dos impulsos) para mover la nave entre planetas, conectando con trabajo e integrales de línea.


*
**Modo histórico:** Reproducir la posición real de los planetas en fechas históricas (ej. primer alunizaje, lanzamiento del Voyager) usando la API.


*
**Puntos de Lagrange:** Calcular y visualizar los 5 puntos de equilibrio gravitacional del sistema Sol-Tierra donde una nave puede quedar estacionaria.


*
**Perturbaciones:** Agregar un cuerpo masivo externo y mostrar cómo perturba las órbitas, relacionando con el problema de los tres cuerpos.


*
**Zoom adaptativo:** Sistema de cámara que sigue automáticamente el cuerpo más interesante (nave, cometa) con zoom fluido.



5. Stack Tecnológico Recomendado

| Tecnología | Instalación | Rol en el Proyecto |
| --- | --- | --- |
| **NASA JPL Horizons** | Gratuita, sin key | Efemérides de posición/velocidad de planetas; URL: ssd.jpl.nasa.gov/api/horizons.api |
| **p5.js 1.x** | npm/CDN | Canvas 2D para animación de órbitas con trails y control interactivo de la nave |
| **odex 2.x** | npm | Solucionador RK4/RK45 adaptativo para el sistema N-cuerpos vectorial |
| **Chart.js 4.x** | npm | Monitor de energía $E(t)$ y momento angular $L(t)$ en panel lateral |
| **dat.GUI** | npm/CDN | Panel de control compacto para constante G, paso de tiempo y selección de planetas |

## 6. Plan de Desarrollo por Fases

*
**Fase 1: NASA API + Parser (1 semana):** Conectar JPL Horizons, parsear efemérides y extraer posiciones/velocidades iniciales.


* **Fase 2: N-Body Solver (1.5 semanas):** Implementar RK4 para el sistema vectorial. Validar reproduciendo la órbita terrestre anual.


*
**Fase 3: Animación p5.js (1 semana):** Renderizar órbitas con trails, escala correcta y actualización en tiempo real.


*
**Fase 4: Nave y Trayectoria (0.5 semanas):** Lanzador interactivo, cálculo y visualización de la trayectoria de la nave.


*
**Fase 5: Monitor de Energía y Docs (1 semana):** Panel de conservación de energía, documentación matemática y video de presentación.



## 7. Valor Pedagógico y Técnico

*
**Concreta las funciones vectoriales:** $r(t)=(x(t),y(t))$ deja de ser abstracta y se convierte en la órbita visible de Marte en pantalla.


*
**Muestra por qué las EDOs son inseparables de la física:** Sin integrar $r^{\prime\prime}=F/m$ es imposible predecir dónde estará un planeta mañana.


*
**Conecta la API de la NASA con el Cálculo:** Los datos que usa el simulador son los mismos que usan las misiones espaciales reales.


*
**Prueba de calidad de código:** La conservación de energía como invariante matemático se convierte en una prueba de calidad del código.


*
**Análisis Numérico:** Introduce la diferencia entre solución analítica (imposible para $N>2$ cuerpos) y numérica (siempre posible), motivando el Análisis Numérico.



## 8. Conclusiones

OrbitalJS pone el sistema solar en el navegador del usuario, resolviendo en JavaScript las mismas ecuaciones que usó la NASA para enviar el Voyager fuera del sistema solar. El MVP de 5 semanas entrega el sistema solar interior animado con datos reales, el integrador RK4 validado y el lanzador de naves interactivo. Es el proyecto de mayor impacto visual de los cinco y el que más claramente demuestra la conexión directa entre funciones vectoriales, EDOs y el movimiento real de los planetas.
