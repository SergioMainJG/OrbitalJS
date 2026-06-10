import { For, Show } from 'solid-js';
import type { Component } from 'solid-js';

import Section from './documentation/section';
import InfoCard from './documentation/info-card';
import type { CardItem } from './documentation/info-card';
import FormulaBlock from './documentation/formula-block';
import DataTable from './documentation/data-table';
import type { TableRow } from './documentation/data-table';
import ScreenshotSlot from './documentation/screenshot-slot';

const projectMembers = [
  'Sabrina Ojeda',
  'Katherine Lopez',
  'Luis Diaz',
  'Joel Freire',
  'Sergio Arce',
];

const executiveMetrics: CardItem[] = [
  {
    title: 'Dominio académico',
    body: 'Cálculo II aplicado a funciones vectoriales, ecuaciones diferenciales ordinarias, integración numérica y conservación de energía mecánica.',
  },
  {
    title: 'Dominio técnico',
    body: 'Simulación científica en TypeScript, arquitectura limpia, SolidJS, Canvas 2D, Chart.js y consumo controlado de datos reales desde NASA JPL Horizons.',
  },
  {
    title: 'Resultado observable',
    body: 'El usuario puede visualizar órbitas, comparar integradores, lanzar una nave y verificar si la simulación conserva la energía del sistema.',
  },
];

const coreFeatures: CardItem[] = [
  {
    title: 'Simulación orbital en tiempo real',
    body: 'Representa cuerpos celestes como puntos dinámicos en un plano 2D, con trayectorias acumuladas que hacen visible la función vectorial de posición.',
  },
  {
    title: 'Integrador RK4',
    body: 'Usa Runge-Kutta de cuarto orden para aproximar el movimiento gravitacional con mejor estabilidad que métodos elementales como Euler.',
  },
  {
    title: 'Comparación Euler vs RK4',
    body: 'Permite observar cómo el método de Euler acumula error más rápido y cómo RK4 preserva con mayor fidelidad la geometría orbital.',
  },
  {
    title: 'Monitor de energía',
    body: 'Calcula energía cinética, energía potencial gravitatoria y deriva porcentual para usar una propiedad física como criterio de validación.',
  },
  {
    title: 'Datos NASA JPL Horizons',
    body: 'Obtiene posiciones y velocidades planetarias reales para que la simulación parta de condiciones iniciales astronómicas verificables.',
  },
  {
    title: 'Lanzamiento de nave',
    body: 'Permite introducir una trayectoria artificial dentro del campo gravitacional para estudiar cómo la velocidad inicial afecta el recorrido.',
  },
];

const mathConcepts: CardItem[] = [
  {
    title: 'Funciones vectoriales',
    body: 'Cada cuerpo se modela mediante r(t) = (x(t), y(t)). La órbita no se describe como y = f(x), sino como una curva paramétrica dependiente del tiempo.',
  },
  {
    title: 'Derivadas de posición',
    body: 'La velocidad es la primera derivada de la posición y la aceleración es la segunda derivada. Esto conecta el movimiento visible con cálculo diferencial.',
  },
  {
    title: 'EDOs de movimiento',
    body: 'La aceleración depende de la posición relativa entre cuerpos. Por eso el sistema se expresa como ecuaciones diferenciales acopladas.',
  },
  {
    title: 'Integración numérica',
    body: 'Como el problema de N cuerpos no tiene solución analítica general, el simulador aproxima el estado futuro paso a paso.',
  },
  {
    title: 'Conservación de energía',
    body: 'En un sistema gravitacional ideal, la energía mecánica total debe permanecer aproximadamente constante. La deriva mide error numérico.',
  },
  {
    title: 'Validación computacional',
    body: 'Una simulación no es correcta solo porque se vea bien. Debe conservar invariantes físicos y reproducir trayectorias razonables.',
  },
];

const architectureRows: TableRow[] = [
  {
    first: 'Core / Domain',
    second: 'Física pura, integradores, diagnósticos, validadores y contratos base.',
    third: 'No depende de SolidJS ni del DOM; permite pruebas unitarias y simulaciones aisladas.',
  },
  {
    first: 'Application',
    second: 'Casos de uso, servicios, registros e integración con fuentes externas.',
    third: 'Orquesta flujos sin contaminar el dominio con detalles visuales.',
  },
  {
    first: 'Features',
    second: 'Módulos funcionales con componentes SolidJS y stores reactivos.',
    third: 'Agrupa simulación, comparación, teoría y experiencia de usuario.',
  },
  {
    first: 'Presentation',
    second: 'Renderizado Canvas 2D, cámara, layout, overlays y componentes compartidos.',
    third: 'Implementa la visualización sin modificar la lógica matemática.',
  },
  {
    first: 'Shared',
    second: 'Constantes, tipos y utilidades transversales.',
    third: 'Evita duplicación y centraliza valores físicos y configuraciones comunes.',
  },
];

const stackRows: TableRow[] = [
  {
    first: 'SolidJS',
    second: 'Interfaz reactiva de alto rendimiento.',
    third:
      'Permite construir paneles, controles y documentación interactiva con bajo costo de renderizado.',
  },
  {
    first: 'TypeScript',
    second: 'Tipado estático para modelos físicos y contratos.',
    third: 'Reduce errores en vectores, cuerpos, estados del integrador y servicios externos.',
  },
  {
    first: 'Bun',
    second: 'Runtime y package manager principal.',
    third: 'Acelera instalación, ejecución de scripts y flujo de desarrollo.',
  },
  {
    first: 'Canvas 2D',
    second: 'Renderizado de órbitas, cuerpos, trayectorias y overlays.',
    third: 'Adecuado para simulación 2D fluida sin introducir complejidad innecesaria de 3D.',
  },
  {
    first: 'Chart.js',
    second: 'Gráficas de energía y deriva numérica.',
    third: 'Convierte la validación física en una lectura visual directa.',
  },
  {
    first: 'Tailwind CSS v4 + DaisyUI',
    second: 'Sistema visual responsive y componentes reutilizables.',
    third: 'Facilita coherencia visual y exportación a una documentación presentable.',
  },
];

const comparisonRows: TableRow[] = [
  {
    first: 'Precisión local',
    second: 'Euler evalúa una sola pendiente por paso; es simple, pero tosco.',
    third: 'RK4 evalúa cuatro pendientes y combina sus resultados, reduciendo error local.',
  },
  {
    first: 'Estabilidad orbital',
    second: 'Euler tiende a deformar órbitas con rapidez cuando el paso temporal es grande.',
    third: 'RK4 mantiene trayectorias más estables durante más tiempo.',
  },
  {
    first: 'Costo computacional',
    second: 'Euler es barato porque calcula una aceleración por paso.',
    third:
      'RK4 cuesta más, pero el aumento de precisión justifica el uso en una simulación educativa.',
  },
  {
    first: 'Valor pedagógico',
    second: 'Euler muestra claramente cómo aparece el error numérico.',
    third: 'RK4 muestra cómo un método más sofisticado corrige parte de ese error.',
  },
];

type ReferenceItem = {
  citation: string;
  description: string;
  url?: string;
};

const references: ReferenceItem[] = [
  {
    citation: 'NASA JPL Horizons System',
    url: 'https://ssd.jpl.nasa.gov/horizons/',
    description: ' — Fuente oficial de efemérides y vectores de estado planetarios.',
  },
  {
    citation: "Feynman Lectures on Physics, Vol. 1, Ch. 9: Newton's Laws of Dynamics",
    url: 'https://www.feynmanlectures.caltech.edu/I_09.html',
    description: ' — Explicación intuitiva de órbitas mediante cálculo numérico.',
  },
  {
    citation: 'Burden, R. L., & Faires, J. D. (2010). Numerical Analysis (9th ed.)',
    url: 'https://isbnsearch.org/isbn/9780538733519',
    description: ' — Fundamento teórico y de estabilidad para métodos Euler y Runge-Kutta.',
  },
  {
    citation: 'Newton, I. (1687). Philosophiae Naturalis Principia Mathematica',
    description: ' — Fundamento clásico de la ley de gravitación universal.',
  },
  {
    citation: 'Stewart, J. (2015). Calculus: Early Transcendentals (8th ed.)',
    url: 'https://isbnsearch.org/isbn/9781285741550',
    description:
      ' — Base conceptual para funciones vectoriales, derivadas y cálculo multivariable.',
  },
  {
    citation: 'Documentación Oficial de SolidJS',
    url: 'https://docs.solidjs.com/',
    description: ' — Framework reactivo de grano fino utilizado para la interfaz del simulador.',
  },
  {
    citation: 'Documentación Oficial de Chart.js',
    url: 'https://www.chartjs.org/docs/latest/',
    description: ' — Biblioteca utilizada para graficar el historial de energía mecánica.',
  },
];

const DocumentationPage: Component = () => {
  return (
    <main class="bg-base-200 text-base-content min-h-screen">
      <article class="doc-page bg-base-100 mx-auto max-w-6xl px-5 py-8 shadow-xl md:px-10 lg:px-16">
        <header class="bg-neutral text-neutral-content relative overflow-hidden rounded-[2rem] p-8 md:p-12 print:rounded-none print:bg-white print:p-0 print:text-black">
          <div class="relative z-10 max-w-4xl">
            <p class="text-primary-content/80 mb-4 text-sm font-semibold tracking-[0.28em] uppercase print:text-black">
              Documentación académica y técnica
            </p>
            <h1 class="text-4xl font-black tracking-tight md:text-6xl">OrbitalJS</h1>
            <p class="text-neutral-content/90 mt-4 text-xl font-semibold print:text-black">
              Simulador de órbitas planetarias con datos reales de NASA JPL Horizons
            </p>
            <p class="text-neutral-content/75 mt-6 max-w-3xl text-lg leading-8 print:text-black">
              OrbitalJS integra mecánica celeste, funciones vectoriales, ecuaciones diferenciales
              ordinarias e integración numérica para convertir conceptos de Cálculo II en una
              experiencia visual, verificable y técnicamente rigurosa.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <span class="badge badge-primary badge-lg">Funciones vectoriales</span>
              <span class="badge badge-primary badge-lg">EDOs</span>
              <span class="badge badge-primary badge-lg">RK4</span>
              <span class="badge badge-primary badge-lg">NASA Data</span>
              <span class="badge badge-primary badge-lg">SolidJS</span>
            </div>
          </div>
        </header>

        <nav class="border-base-300 bg-base-100/95 sticky top-0 z-20 my-8 rounded-2xl border p-4 shadow-sm backdrop-blur print:hidden">
          <div class="flex w-full flex-wrap items-center gap-2 text-sm">
            <a class="btn btn-ghost btn-sm" href="#resumen">
              Resumen
            </a>
            <a class="btn btn-ghost btn-sm" href="#problema">
              Problema
            </a>
            <a class="btn btn-ghost btn-sm" href="#funcionalidades">
              Funcionalidades
            </a>
            <a class="btn btn-ghost btn-sm" href="#matematica">
              Matemática
            </a>
            <a class="btn btn-ghost btn-sm" href="#numerico">
              Análisis numérico
            </a>
            <a class="btn btn-ghost btn-sm" href="#nasa">
              NASA
            </a>
            <a class="btn btn-ghost btn-sm" href="#arquitectura">
              Arquitectura
            </a>
            <a class="btn btn-ghost btn-sm" href="#lighthouse">
              Lighthouse
            </a>
            <a class="btn btn-ghost btn-sm" href="#conclusiones">
              Conclusiones
            </a>
          </div>
        </nav>

        <Section id="ficha" eyebrow="Datos generales" title="Ficha del proyecto">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="border-base-300 bg-base-200/50 rounded-2xl border p-6">
              <h3 class="text-base-content mb-4 text-lg font-bold">Equipo responsable</h3>
              <ul class="space-y-2">
                <For each={projectMembers}>
                  {(member) => (
                    <li class="flex gap-2">
                      <span class="text-primary">•</span>
                      <span>{member}</span>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class="border-base-300 bg-base-200/50 rounded-2xl border p-6">
              <h3 class="text-base-content mb-4 text-lg font-bold">Clasificación académica</h3>
              <dl class="space-y-3">
                <div>
                  <dt class="text-base-content font-semibold">Área</dt>
                  <dd>Cálculo II, física computacional y simulación científica.</dd>
                </div>
                <div>
                  <dt class="text-base-content font-semibold">Dificultad</dt>
                  <dd>
                    Media-alta, por combinar modelo físico, métodos numéricos, visualización y datos
                    reales.
                  </dd>
                </div>
                <div>
                  <dt class="text-base-content font-semibold">Producto</dt>
                  <dd>Aplicación web interactiva y documentación académica.</dd>
                </div>
              </dl>
            </div>
          </div>
        </Section>

        <Section id="resumen" eyebrow="Resumen ejecutivo" title="Qué es OrbitalJS y por qué existe">
          <p>
            OrbitalJS es un simulador del sistema solar construido como una aplicación web
            educativa. Su propósito es mostrar que una órbita no es una imagen decorativa ni una
            animación arbitraria: es el resultado de resolver numéricamente un sistema de ecuaciones
            diferenciales derivado de la Ley de Gravitación Universal y de la Segunda Ley de Newton.
          </p>
          <p>
            El sistema utiliza datos reales de NASA JPL Horizons como condiciones iniciales. Esto
            significa que los planetas no aparecen en posiciones inventadas, sino a partir de
            vectores de estado astronómicos que incluyen posición y velocidad.
          </p>
          <div class="grid gap-4 md:grid-cols-3">
            <For each={executiveMetrics}>
              {(item) => <InfoCard title={item.title} body={item.body} />}
            </For>
          </div>
        </Section>

        <Section id="problema" eyebrow="Planteamiento" title="Problema que resuelve">
          <p>
            En el curso de Cálculo II los temas de funciones vectoriales, derivadas, ecuaciones
            diferenciales e integración numérica pueden volverse abstractos si se estudian
            únicamente desde el papel. OrbitalJS ataca precisamente ese punto: muestra que una
            función vectorial puede ser una órbita, que una derivada puede ser una velocidad real,
            que una segunda derivada puede convertirse en aceleración gravitacional y que un error
            numérico puede destruir una simulación aunque la interfaz parezca correcta.
          </p>
          <div class="alert border-primary bg-primary/10 text-base-content border-l-4">
            <div>
              <h3 class="font-bold">Tesis central del proyecto</h3>
              <p class="mt-2 leading-7">
                OrbitalJS no responde únicamente "cómo se ve una órbita", sino "qué ecuaciones
                producen esa órbita, cómo se aproximan computacionalmente y cómo se verifica que la
                simulación no esté acumulando error físico inaceptable".
              </p>
            </div>
          </div>
        </Section>

        <Section id="funcionalidades" eyebrow="Sistema" title="Funcionalidades principales">
          <p>
            Las funcionalidades no deben presentarse como botones aislados. Cada una tiene una razón
            matemática o técnica.
          </p>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <For each={coreFeatures}>
              {(item) => <InfoCard title={item.title} body={item.body} />}
            </For>
          </div>
          <ScreenshotSlot
            id="screenshot-dashboard-principal"
            title="Dashboard principal de simulación"
            description="El layout completo: panel de control, canvas orbital, controles de tiempo y panel lateral de datos."
            expectedCapture="Vista desktop completa de OrbitalJS en ejecución."
            imageUrl="/images/xl-full.avif"
            alt="Simulación completa"
            heightClass="h-64 sm:h-80 md:h-[450px]"
          />
          <div class="mt-8 grid gap-6 md:grid-cols-2">
            <ScreenshotSlot
              id="screenshot-visualizador"
              title="Visualizador 2D del Canvas"
              description="Representación gráfica interactiva del Sol, los planetas y naves en órbita con estelas de trayectoria."
              expectedCapture="Vista del canvas orbital 2D interactivo."
              imageUrl="/images/xl-visualizador.avif"
              alt="Visualizador Canvas"
              heightClass="h-48 md:h-64"
            />
            <ScreenshotSlot
              id="screenshot-controles"
              title="Panel de Controles de Simulación"
              description="Permite pausar/reproducir, ajustar la velocidad (hasta 10x), cambiar de integrador (Euler/RK4) y configurar parámetros de visualización."
              expectedCapture="Controles de la simulación física."
              imageUrl="/images/xl-controles.avif"
              alt="Panel de Controles"
              heightClass="h-48 md:h-64"
            />
            <ScreenshotSlot
              id="screenshot-logs"
              title="Registro de Eventos (Logs)"
              description="Bitácora reactiva que notifica cambios de integradores, lanzamientos de naves y alertas de deriva de energía."
              expectedCapture="Registro de logs en tiempo real."
              imageUrl="/images/xl-logs.avif"
              alt="Registro de logs"
              heightClass="h-48 md:h-64"
            />
            <ScreenshotSlot
              id="screenshot-informacion-extra"
              title="Cálculo de Órbitas Hohmann y Lagrange"
              description="Visualización interactiva y cálculos en tiempo real de maniobras de transferencia y puntos de equilibrio gravitacional."
              expectedCapture="Panel teórico de Hohmann y Lagrange."
              imageUrl="/images/xl-informacion-extra.avif"
              alt="Cálculo de Hohmann y Lagrange"
              heightClass="h-48 md:h-64"
            />
          </div>
        </Section>

        <Section id="matematica" eyebrow="Fundamento matemático" title="Modelo matemático y físico">
          <p>
            OrbitalJS se fundamenta en una idea central: el movimiento planetario puede
            representarse como una función vectorial cuyo cambio está determinado por fuerzas
            gravitacionales.
          </p>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <For each={mathConcepts}>
              {(item) => <InfoCard title={item.title} body={item.body} />}
            </For>
          </div>
          <FormulaBlock
            title="Función vectorial de posición"
            formulas={[
              'r: ℝ → ℝ²',
              'r(t) = (x(t), y(t))',
              "v(t) = r'(t) = (x'(t), y'(t))",
              "a(t) = r''(t)",
            ]}
            note="La posición no se reduce a una función y = f(x). Una órbita puede retroceder, curvarse y cerrar ciclos; por eso se modela mejor como curva paramétrica."
          />
          <FormulaBlock
            title="Gravitación universal y aceleración"
            formulas={[
              'F = G · (m₁m₂ / ||r₂ - r₁||²)',
              'aᵢ = G · Σⱼ≠ᵢ mⱼ · (rⱼ - rᵢ) / ||rⱼ - rᵢ||³',
            ]}
            note="La aceleración de cada cuerpo depende de la masa y posición relativa de los demás cuerpos."
          />
        </Section>

        <Section
          id="numerico"
          eyebrow="Análisis numérico"
          title="Por qué se necesita integración numérica"
        >
          <p>
            Para dos cuerpos bajo condiciones ideales existe una descripción analítica clásica. Sin
            embargo, cuando se simulan varios cuerpos interactuando simultáneamente, el sistema se
            vuelve un problema de N cuerpos donde la solución cerrada general deja de ser práctica.
          </p>
          <h3 class="text-base-content text-2xl font-bold">Euler vs RK4</h3>
          <p>
            Euler es útil como método introductorio porque muestra el mecanismo básico de avanzar
            una simulación. RK4 mejora la aproximación calculando pendientes intermedias y
            combinándolas.
          </p>
          <DataTable headers={['Criterio', 'Euler', 'RK4']} rows={comparisonRows} />
          <ScreenshotSlot
            id="screenshot-euler-vs-rk4"
            title="Comparación visual Euler vs RK4"
            description="Euler evidencia una rápida deriva de energía y deformación orbital, mientras que RK4 mantiene una trayectoria estable."
            expectedCapture="Modo comparativo con trayectorias de ambos métodos."
            imageUrl="/images/xl-euler-vs-rk4.avif"
            alt="Comparación visual de integradores Euler vs RK4"
            heightClass="h-64 sm:h-72 md:h-80 lg:h-96"
          />
        </Section>

        <Section
          id="energia"
          eyebrow="Validación física"
          title="Conservación de energía como prueba de calidad"
        >
          <p>
            Una simulación científica no debe evaluarse solo por apariencia. La conservación de
            energía permite convertir una propiedad física en un criterio de calidad del código.
          </p>
          <FormulaBlock
            title="Energía mecánica total"
            formulas={[
              'E_total = T + U',
              'T = Σᵢ 1/2 · mᵢ · ||vᵢ||²',
              'U = -Σᵢ Σⱼ<i G · mᵢ · mⱼ / ||rᵢ - rⱼ||',
              'Drift(%) = |E_total(t) - E_total(0)| / |E_total(0)| · 100',
            ]}
            note="La deriva de energía no es un dato decorativo: es una señal de precisión numérica."
          />
          <div class="mt-8 grid gap-6 md:grid-cols-2">
            <ScreenshotSlot
              id="screenshot-graficas-energia"
              title="Monitor Gráfico de Energía"
              description="Gráfica en tiempo real de la energía cinética (Ecin), potencial (Epot) y energía total mecánica. Permite ver el desfasaje o estabilidad de la simulación."
              expectedCapture="Gráficas de energía mecánica."
              imageUrl="/images/xl-graphics.avif"
              alt="Gráficas de Energía"
              heightClass="h-48 md:h-64"
            />
            <ScreenshotSlot
              id="screenshot-validaciones"
              title="Panel de Validación Numérica"
              description="Comprobación en tiempo real del error de posición absoluto respecto a la órbita de referencia de la Tierra, alertando si se excede el umbral tolerado."
              expectedCapture="Panel de validación de error en UA."
              imageUrl="/images/xl-validations.avif"
              alt="Panel de validaciones"
              heightClass="h-48 md:h-64"
            />
          </div>
        </Section>

        <Section id="nasa" eyebrow="Datos reales" title="Integración con NASA JPL Horizons">
          <p>
            La integración con NASA JPL Horizons aporta valor porque conecta la simulación con
            efemérides reales. Una efeméride describe la posición y velocidad de un cuerpo celeste
            en un instante determinado. OrbitalJS usa estos vectores como condiciones iniciales.
          </p>
          <div class="alert border-info bg-info/10 text-base-content mt-4 border-l-4">
            <div>
              <h3 class="font-bold">Intercepción de peticiones y CORS (Cloudflare Worker)</h3>
              <p class="mt-2 leading-7">
                Dado que la API pública de la NASA no está configurada para admitir cabeceras CORS
                en entornos web de producción (bloqueando las peticiones directas desde el
                navegador), el simulador utiliza un <strong>Cloudflare Worker</strong> como proxy
                inverso:
              </p>
              <ul class="mt-2 list-disc space-y-1 pl-6">
                <li>
                  URL del Proxy: <code>https://jpl-cors-proxy.arce-roldan-sergio.workers.dev</code>
                </li>
                <li>
                  <strong>Función:</strong> El worker intercepta la llamada, añade las cabeceras
                  estándar <code>Access-Control-Allow-Origin: *</code>, redirige la consulta a los
                  servidores de JPL NASA de forma segura y devuelve la respuesta al cliente sin
                  bloqueos de seguridad en el navegador.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          id="arquitectura"
          eyebrow="Ingeniería de software"
          title="Arquitectura limpia del proyecto"
        >
          <p>
            La arquitectura de OrbitalJS tiene su valor en la separación de responsabilidades. La
            lógica física debe poder probarse sin Canvas, sin SolidJS and sin estado visual.
          </p>
          <DataTable
            headers={['Capa', 'Responsabilidad', 'Valor técnico']}
            rows={architectureRows}
          />
        </Section>

        <Section id="lighthouse" eyebrow="Rendimiento" title="Métricas de Lighthouse">
          <p>
            El rendimiento y la accesibilidad han sido optimizados para garantizar que el simulador
            funcione con total fluidez a 60 FPS en una amplia gama de dispositivos. A continuación
            se detallan las puntuaciones obtenidas en las auditorías de Lighthouse para entornos
            móviles y de escritorio.
          </p>
          <div class="mt-8 grid gap-6 md:grid-cols-2">
            <ScreenshotSlot
              id="screenshot-lighthouse-mobile"
              title="Puntuación en Dispositivos Móviles (Mobile)"
              description="Análisis de rendimiento, accesibilidad, mejores prácticas y SEO en emulación móvil."
              expectedCapture="Reporte Lighthouse móvil con puntuaciones óptimas."
              imageUrl="/images/lh-cel.avif"
              alt="Lighthouse Móvil"
              heightClass="h-48 md:h-64"
            />
            <ScreenshotSlot
              id="screenshot-lighthouse-desktop"
              title="Puntuación en Ordenadores (Desktop)"
              description="Análisis de rendimiento, accesibilidad, mejores prácticas y SEO en entornos de escritorio."
              expectedCapture="Reporte Lighthouse desktop con puntuaciones óptimas."
              imageUrl="/images/lh-lap.avif"
              alt="Lighthouse Escritorio"
              heightClass="h-48 md:h-64"
            />
          </div>
        </Section>

        <Section id="stack" eyebrow="Stack tecnológico" title="Tecnologías utilizadas">
          <p>El stack debe justificarse por su función dentro del sistema.</p>
          <DataTable headers={['Tecnología', 'Uso', 'Justificación']} rows={stackRows} />
          <div class="mt-8">
            <h3 class="text-base-content mb-4 text-2xl font-bold">
              Diseño Adaptativo (Mobile first & Responsiveness)
            </h3>
            <p class="mb-6 leading-7">
              El simulador ha sido diseñado utilizando CSS flexible y rejillas (Grid y Flexbox) para
              garantizar que la experiencia interactiva sea fluida y completamente utilizable tanto
              en ordenadores de escritorio como en dispositivos móviles. A continuación se muestran
              capturas de la interfaz adaptada a pantallas móviles.
            </p>
            <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              <ScreenshotSlot
                id="screenshot-mobile-sim"
                title="Canvas en Móvil"
                description="Visualización del canvas en pantallas estrechas con zoom optimizado."
                expectedCapture="Canvas en modo móvil."
                imageUrl="/images/sm-sim.avif"
                alt="Canvas en Móvil"
                heightClass="h-56"
              />
              <ScreenshotSlot
                id="screenshot-mobile-controles"
                title="Controles en Móvil"
                description="Adaptación vertical de los selectores de escenario y velocidad."
                expectedCapture="Panel de controles en móvil."
                imageUrl="/images/sm-controles.avif"
                alt="Controles en Móvil"
                heightClass="h-56"
              />
              <ScreenshotSlot
                id="screenshot-mobile-graphics"
                title="Gráficas en Móvil"
                description="Ajuste adaptativo de las gráficas Chart.js de energía."
                expectedCapture="Monitor de energía en móvil."
                imageUrl="/images/sm-graphics.avif"
                alt="Gráficas en Móvil"
                heightClass="h-56"
              />
              <ScreenshotSlot
                id="screenshot-mobile-legend"
                title="Leyenda en Móvil"
                description="Panel de leyenda e información adaptado para pantallas táctiles."
                expectedCapture="Leyenda en móvil."
                imageUrl="/images/sm-legend.avif"
                alt="Leyenda en móvil"
                heightClass="h-56"
              />
            </div>
          </div>
        </Section>

        <Section id="conclusiones" eyebrow="Cierre" title="Conclusiones">
          <div class="grid gap-6 lg:grid-cols-3">
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6">
              <h3 class="mb-3 text-xl font-bold">Conclusión matemática</h3>
              <p>
                OrbitalJS demuestra que las funciones vectoriales, las derivadas y las ecuaciones
                diferenciales no son conceptos aislados. En conjunto permiten modelar trayectorias
                reales bajo interacción gravitacional.
              </p>
            </article>
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6">
              <h3 class="mb-3 text-xl font-bold">Conclusión técnica</h3>
              <p>
                La arquitectura limpia permite separar simulación, datos, visualización y UI, lo que
                hace que el proyecto sea más mantenible, testeable y escalable.
              </p>
            </article>
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6">
              <h3 class="mb-3 text-xl font-bold">Conclusión académica</h3>
              <p>
                El proyecto supera una demostración visual básica porque vincula teoría,
                implementación, validación y documentación.
              </p>
            </article>
          </div>
        </Section>

        <Section id="referencias" eyebrow="Bibliografía" title="Referencias sugeridas">
          <ol class="list-decimal space-y-3 pl-6">
            <For each={references}>
              {(ref) => (
                <li class="text-base-content/85 leading-7">
                  <Show when={ref.url} fallback={<span class="font-semibold">{ref.citation}</span>}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary font-semibold transition-colors duration-200 hover:underline"
                    >
                      {ref.citation}
                    </a>
                  </Show>
                  {ref.description}
                </li>
              )}
            </For>
          </ol>
        </Section>
      </article>
    </main>
  );
};

export default DocumentationPage;
