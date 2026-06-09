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

const developmentProcess: CardItem[] = [
  {
    title: 'Convenciones de código',
    body: 'Archivos en kebab-case, prohibición de any, uso explícito de import type y documentación TSDoc/JSDoc en funciones públicas.',
  },
  {
    title: 'Control de calidad',
    body: 'Antes de integrar cambios se debe ejecutar bun run check para validar lint, formato, tipos y pruebas automatizadas.',
  },
  {
    title: 'Flujo de ramas',
    body: 'El desarrollo parte desde develop, se trabaja en ramas descriptivas y se integra mediante Pull Request con revisión.',
  },
  {
    title: 'Consumo responsable de APIs',
    body: 'Las consultas a NASA JPL Horizons deben ejecutarse de forma secuencial y con control de tasa; no se debe usar Promise.all para este flujo.',
  },
];

const futureWork: CardItem[] = [
  {
    title: 'Transferencia de Hohmann',
    body: 'Calcular maniobras orbitales eficientes de dos impulsos para transferir una nave entre órbitas planetarias.',
  },
  {
    title: 'Puntos de Lagrange',
    body: 'Visualizar puntos de equilibrio gravitacional en sistemas de dos cuerpos, especialmente Sol-Tierra o Tierra-Luna.',
  },
  {
    title: 'Modo histórico',
    body: 'Reproducir configuraciones planetarias de fechas importantes, como misiones Voyager, Apolo o eventos astronómicos relevantes.',
  },
  {
    title: 'Perturbaciones y problema de tres cuerpos',
    body: 'Permitir añadir cuerpos masivos externos para estudiar inestabilidad, resonancias y desviaciones de trayectorias.',
  },
  {
    title: 'Visualización 3D',
    body: 'Migrar el renderer mediante contratos existentes hacia WebGL o Three.js sin modificar la lógica física central.',
  },
  {
    title: 'Exportación científica',
    body: 'Guardar trayectorias, series de energía y estados del sistema para análisis externo o reportes académicos.',
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
    <main class="bg-base-200 text-base-content min-h-screen print:bg-white">
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 16mm;
            }

            html,
            body {
              background: #ffffff !important;
            }

            .doc-page {
              box-shadow: none !important;
              max-width: none !important;
              width: 100% !important;
              padding: 0 !important;
            }

            .doc-section {
              page-break-inside: avoid;
            }

            .print-page-break {
              break-before: page;
              page-break-before: always;
            }
          }
        `}
      </style>

      <article class="doc-page bg-base-100 mx-auto max-w-6xl px-5 py-8 shadow-xl md:px-10 lg:px-16 print:shadow-none">
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
          <div class="flex flex-wrap gap-2 text-sm">
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
                  <dd>Aplicación web interactiva y documentación académica exportable a PDF.</dd>
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
            En lugar de presentar el cálculo como una lista de fórmulas aisladas, el proyecto lo
            transforma en una simulación observable donde cada cuerpo celeste tiene posición,
            velocidad, aceleración, energía y trayectoria.
          </p>
          <p>
            El sistema utiliza datos reales de NASA JPL Horizons como condiciones iniciales. Esto
            significa que los planetas no aparecen en posiciones inventadas, sino a partir de
            vectores de estado astronómicos que incluyen posición y velocidad. A partir de esos
            datos, el motor físico calcula la evolución temporal mediante integración numérica. El
            usuario puede observar el movimiento orbital, comparar métodos de integración, revisar
            la deriva de energía y lanzar una nave para estudiar cómo una trayectoria se curva por
            interacción gravitacional.
          </p>
          <div class="grid gap-4 md:grid-cols-3">
            <For each={executiveMetrics}>
              {(item) => <InfoCard title={item.title} body={item.body} />}
            </For>
          </div>
        </Section>

        <Section id="problema" eyebrow="Planteamiento" title="Problema que resuelve">
          <p>
            En el curso de Cálculo II impartido en Jala University, e impartido por el profesor y
            licenciado Rafael Martinez Vargas, los temas de funciones vectoriales, derivadas,
            ecuaciones diferenciales e integración numérica pueden volverse abstractos si se
            estudian únicamente desde el papel. El estudiante puede manipular símbolos correctamente
            y aun así no comprender qué está modelando. OrbitalJS ataca precisamente ese punto:
            muestra que una función vectorial puede ser una órbita, que una derivada puede ser una
            velocidad real, que una segunda derivada puede convertirse en aceleración gravitacional
            y que un error numérico puede destruir una simulación aunque la interfaz parezca
            correcta.
          </p>
          <p>
            El problema no es solamente pedagógico. También es técnico. Simular órbitas requiere
            separar correctamente la lógica matemática de la interfaz, evitar dependencias
            innecesarias entre capas, controlar errores numéricos y validar que el comportamiento
            físico sea razonable. Una animación que dibuja círculos no demuestra mecánica celeste.
            Una simulación que calcula fuerzas, integra estados y monitorea energía sí puede
            defenderse académicamente.
          </p>
          <div class="alert border-primary bg-primary/10 text-base-content border-l-4">
            <div>
              <h3 class="font-bold">Tesis central del proyecto</h3>
              <p class="mt-2 leading-7">
                OrbitalJS no responde únicamente “cómo se ve una órbita”, sino “qué ecuaciones
                producen esa órbita, cómo se aproximan computacionalmente y cómo se verifica que la
                simulación no esté acumulando error físico inaceptable”.
              </p>
            </div>
          </div>
        </Section>

        <Section id="objetivos" eyebrow="Objetivos" title="Objetivos del sistema">
          <div class="grid gap-6 lg:grid-cols-2">
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6 print:break-inside-avoid">
              <h3 class="mb-3 text-xl font-bold">Objetivo general</h3>
              <p>
                Desarrollar una herramienta interactiva que permita visualizar y analizar el
                movimiento orbital de cuerpos celestes utilizando datos reales, funciones
                vectoriales, ecuaciones diferenciales ordinarias y métodos de integración numérica,
                con énfasis en la validación mediante conservación de energía.
              </p>
            </article>
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6 print:break-inside-avoid">
              <h3 class="mb-3 text-xl font-bold">Objetivo académico</h3>
              <p>
                Convertir los conceptos de Cálculo II en un caso de estudio funcional donde el
                estudiante pueda relacionar fórmulas con movimiento, trayectorias, errores,
                estabilidad y toma de decisiones técnicas.
              </p>
            </article>
          </div>
          <div class="border-base-300 bg-base-200/50 rounded-2xl border p-6">
            <h3 class="mb-4 text-xl font-bold">Objetivos específicos</h3>
            <ol class="list-decimal space-y-3 pl-6">
              <li>
                Modelar la posición de cada cuerpo celeste como una función vectorial dependiente
                del tiempo.
              </li>
              <li>
                Implementar un motor de integración numérica capaz de actualizar posiciones y
                velocidades bajo interacción gravitacional.
              </li>
              <li>
                Comparar Euler y RK4 para mostrar diferencias de precisión, estabilidad y deriva
                acumulada.
              </li>
              <li>
                Consumir datos de NASA JPL Horizons y convertirlos en condiciones iniciales
                utilizables por el simulador.
              </li>
              <li>
                Separar la lógica física, los casos de uso y la presentación mediante una
                arquitectura limpia y mantenible.
              </li>
              <li>
                Producir una documentación académica con soporte visual, fórmulas y explicación
                técnica exportable a PDF.
              </li>
            </ol>
          </div>
        </Section>

        <Section id="funcionalidades" eyebrow="Sistema" title="Funcionalidades principales">
          <p>
            Las funcionalidades no deben presentarse como botones aislados. Cada una tiene una razón
            matemática o técnica. La simulación orbital sirve para visualizar funciones vectoriales;
            la comparación de integradores sirve para estudiar error numérico; el monitor de energía
            sirve para validar la simulación; y los datos NASA sirven para conectar el proyecto con
            información astronómica real.
          </p>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <For each={coreFeatures}>
              {(item) => <InfoCard title={item.title} body={item.body} />}
            </For>
          </div>

          <ScreenshotSlot
            id="screenshot-dashboard-principal"
            title="Dashboard principal de simulación"
            description="El layout completo: panel de control, canvas orbital, controles de tiempo y panel lateral de datos o gráficas-"
            expectedCapture="Vista desktop completa de OrbitalJS en ejecución, preferentemente con órbitas visibles y paneles laterales abiertos."
            imageUrl="/images/xl-full.avif"
            alt="Simulación completa"
            heightClass="h-64 sm:h-80 md:h-[450px]"
          />

          <div class="mt-6 grid gap-6 md:grid-cols-3">
            <ScreenshotSlot
              id="screenshot-func-controles"
              title="Panel de control (Escritorio)"
              description="Muestra los controles para ajustar velocidad, pausar, avanzar paso a paso y cambiar el integrador o escenario físico."
              expectedCapture="Detalle de controles en desktop."
              imageUrl="/images/xl-controles.avif"
              alt="Panel de controles en escritorio"
              heightClass="h-48 sm:h-56 md:h-64"
            />
            <ScreenshotSlot
              id="screenshot-func-visualizador"
              title="Visualizador orbital (Escritorio)"
              description="Muestra el canvas interactivo con el Sol, órbitas de los planetas, trayectoria de la nave y de la transferencia, y de la cámara."
              expectedCapture="Detalle del visualizador en desktop."
              imageUrl="/images/xl-visualizador.avif"
              alt="Visualizador orbital en escritorio"
              heightClass="h-48 sm:h-56 md:h-64"
            />
            <ScreenshotSlot
              id="screenshot-func-logs"
              title="Registro de eventos (Escritorio)"
              description="Consola interactiva que reporta avisos críticos, impulsos de circularización e información de lanzamientos en tiempo real."
              expectedCapture="Detalle de logs en desktop."
              imageUrl="/images/xl-logs.avif"
              alt="Registro de logs en escritorio"
              heightClass="h-48 sm:h-56 md:h-64"
            />
          </div>
        </Section>

        <Section id="interfaz" eyebrow="Interfaz" title="Lectura guiada de la pantalla">
          <p>A continuación, se muestra los componentes de nuestro producto:</p>
          <div class="grid gap-4 md:grid-cols-2">
            <InfoCard
              title="Panel de control"
              body="Contiene parámetros de simulación, selección de escenarios, control de tiempo y posibles opciones de integrador. Su función es permitir experimentación sin modificar código."
            />
            <InfoCard
              title="Canvas orbital"
              body="Representa cuerpos, órbitas y trayectorias. Es la traducción visual de las funciones vectoriales r(t) calculadas por el motor físico."
            />
            <InfoCard
              title="Panel de diagnóstico"
              body="Presenta métricas como energía, deriva numérica, velocidades o estado del integrador. Este panel es crucial para justificar precisión física."
            />
            <InfoCard
              title="Panel teórico"
              body="Explica el fundamento matemático de lo observado. Su presencia separa al proyecto de un simulador meramente visual."
            />
          </div>

          <div class="mt-6 grid gap-6 md:grid-cols-2">
            <ScreenshotSlot
              id="screenshot-interfaz-sm-controles"
              title="Panel de control (Móvil)"
              description="Permite seleccionar escenarios y épocas históricas, pausar/iniciar el motor físico, ajustar la velocidad de simulación y cambiar el integrador."
              expectedCapture="Panel de control en formato móvil."
              imageUrl="/images/sm-controles.avif"
              alt="Panel de control en formato móvil"
              heightClass="h-64 sm:h-72 md:h-80"
            />
            <ScreenshotSlot
              id="screenshot-interfaz-sm-sim"
              title="Visualizador de órbitas (Móvil)"
              description="Muestra los cuerpos celestes y sus órbitas en tiempo real, permitiendo arrastrar para lanzar naves y gestos multitáctiles para hacer zoom y desplazar la cámara."
              expectedCapture="Visualizador de órbitas en formato móvil."
              imageUrl="/images/sm-sim.avif"
              alt="Visualizador de órbitas en formato móvil"
              heightClass="h-64 sm:h-72 md:h-80"
            />
            <ScreenshotSlot
              id="screenshot-interfaz-sm-legend"
              title="Leyenda de simulación (Móvil)"
              description="Muestra los elementos activos en el simulador: naves espaciales, elipses de transferencia, puntos de Lagrange e integradores numéricos en ejecución."
              expectedCapture="Panel de leyenda en formato móvil."
              imageUrl="/images/sm-legend.avif"
              alt="Leyenda de simulación en formato móvil"
              heightClass="h-64 sm:h-72 md:h-80"
            />
            <ScreenshotSlot
              id="screenshot-interfaz-sm-graphics"
              title="Gráficos y diagnóstico (Móvil)"
              description="Muestra el historial y la gráfica de energía mecánica total en tiempo real para verificar si la simulación conserva la física o si presenta deriva."
              expectedCapture="Panel de gráficos en formato móvil."
              imageUrl="/images/sm-graphics.avif"
              alt="Gráficos de energía en formato móvil"
              heightClass="h-64 sm:h-72 md:h-80"
            />
          </div>
        </Section>

        <Section id="matematica" eyebrow="Fundamento matemático" title="Modelo matemático y físico">
          <p>
            OrbitalJS se fundamenta en una idea central: el movimiento planetario puede
            representarse como una función vectorial cuyo cambio está determinado por fuerzas
            gravitacionales. La interfaz muestra la órbita, pero el núcleo matemático opera sobre
            vectores, derivadas, aceleraciones y energía.
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
            note="La aceleración de cada cuerpo depende de la masa y posición relativa de los demás cuerpos. Esto genera un sistema acoplado: mover un planeta afecta el campo gravitacional que sienten los otros."
          />

          <FormulaBlock
            title="Sistema de primer orden"
            formulas={[
              'drᵢ/dt = vᵢ',
              'dvᵢ/dt = aᵢ(r₁, r₂, ..., rₙ)',
              'state = [r₁, v₁, r₂, v₂, ..., rₙ, vₙ]',
            ]}
            note="Aunque la ecuación física original involucra segunda derivada, el simulador la resuelve como sistema de primer orden almacenando posición y velocidad en el estado."
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
            vuelve un problema de N cuerpos. En ese escenario, la solución cerrada general deja de
            ser práctica y se recurre a métodos numéricos. OrbitalJS implementa esta idea de forma
            visible: el estado del sistema se avanza por pasos temporales y cada paso aproxima la
            evolución real.
          </p>

          <FormulaBlock
            title="Idea general de integración temporal"
            formulas={[
              'estado(t + Δt) ≈ estado(t) + cambio calculado durante Δt',
              'rₙ₊₁ = rₙ + Δr',
              'vₙ₊₁ = vₙ + Δv',
            ]}
            note="El problema técnico consiste en calcular Δr y Δv con suficiente precisión para que la órbita no se deforme artificialmente."
          />

          <h3 class="text-base-content text-2xl font-bold">Euler vs RK4</h3>
          <p>
            Euler es útil como método introductorio porque muestra el mecanismo básico de avanzar
            una simulación. Su problema es que usa una sola pendiente por intervalo y acumula error
            rápidamente. RK4 mejora la aproximación calculando pendientes intermedias y
            combinándolas. En una simulación orbital, esta diferencia no es estética: puede decidir
            si una órbita se conserva, se expande artificialmente o colapsa.
          </p>

          <DataTable headers={['Criterio', 'Euler', 'RK4']} rows={comparisonRows} />

          <FormulaBlock
            title="Actualización RK4 simplificada"
            formulas={[
              'k₁ = f(tₙ, yₙ)',
              'k₂ = f(tₙ + Δt/2, yₙ + Δt·k₁/2)',
              'k₃ = f(tₙ + Δt/2, yₙ + Δt·k₂/2)',
              'k₄ = f(tₙ + Δt, yₙ + Δt·k₃)',
              'yₙ₊₁ = yₙ + (Δt/6)(k₁ + 2k₂ + 2k₃ + k₄)',
            ]}
            note="En OrbitalJS, y representa el estado físico completo: posiciones y velocidades de los cuerpos."
          />

          <ScreenshotSlot
            id="screenshot-euler-vs-rk4"
            title="Comparación visual Euler vs RK4"
            description="Esta captura muestra una comparación clara entre integradores. Euler evidencia una rápida deriva de energía y deformación orbital, mientras que RK4 mantiene una trayectoria estable."
            expectedCapture="Modo comparativo con trayectorias de ambos métodos y deriva de error asociada."
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
            energía permite convertir una propiedad física en un criterio de calidad del código. En
            un sistema gravitacional aislado, la energía mecánica total debería permanecer
            aproximadamente constante. Si la energía deriva demasiado, el integrador, el paso
            temporal o las constantes de escala pueden estar introduciendo error numérico
            significativo.
          </p>

          <FormulaBlock
            title="Energía mecánica total"
            formulas={[
              'E_total = T + U',
              'T = Σᵢ 1/2 · mᵢ · ||vᵢ||²',
              'U = -Σᵢ Σⱼ<i G · mᵢ · mⱼ / ||rᵢ - rⱼ||',
              'Drift(%) = |E_total(t) - E_total(0)| / |E_total(0)| · 100',
            ]}
            note="La deriva de energía no es un dato decorativo: es una señal de precisión numérica. Si crece demasiado, la simulación pierde credibilidad física."
          />

          <div class="alert border-warning bg-warning/10 text-base-content border-l-4">
            <div>
              <h3 class="font-bold">Criterio de interpretación</h3>
              <p class="mt-2 leading-7">
                Una deriva cercana a cero indica que el sistema está preservando razonablemente el
                comportamiento esperado. Una deriva creciente no siempre significa que el código
                está roto, pero sí exige revisar el paso temporal, el método de integración, las
                escalas o la cercanía entre cuerpos.
              </p>
            </div>
          </div>

          <div class="mt-6 grid gap-6 md:grid-cols-2">
            <ScreenshotSlot
              id="screenshot-panel-energia"
              title="Gráfica de conservación de energía"
              description="Muestra la evolución temporal de la energía cinética, potencial y mecánica total del sistema."
              expectedCapture="Gráfica de energía total."
              imageUrl="/images/xl-graphics.avif"
              alt="Gráfica de energía total"
              heightClass="h-56 sm:h-64 md:h-72"
            />
            <ScreenshotSlot
              id="screenshot-panel-validaciones"
              title="Panel de validación y deriva orbital"
              description="Muestra el error absoluto en UA y la tasa de deriva numérica acumulada de la órbita terrestre frente a las efemérides iniciales."
              expectedCapture="Panel de validación de error."
              imageUrl="/images/xl-validations.avif"
              alt="Panel de validación de error"
              heightClass="h-56 sm:h-64 md:h-72"
            />
          </div>
        </Section>

        <Section id="nasa" eyebrow="Datos reales" title="Integración con NASA JPL Horizons">
          <p>
            La integración con NASA JPL Horizons aporta valor porque conecta la simulación con
            efemérides reales. Una efeméride describe la posición y velocidad de un cuerpo celeste
            en un instante determinado. OrbitalJS usa estos vectores como condiciones iniciales. A
            partir de ahí, el integrador calcula la evolución temporal del sistema.
          </p>
          <p>
            El proceso debe tratarse con cuidado. El consumo de la API no debe hacerse en paralelo
            sin control. Para evitar saturación o bloqueos, el README del proyecto establece que las
            llamadas deben ejecutarse secuencialmente con pausas explícitas. Esta decisión es
            correcta: una herramienta académica pierde seriedad si su obtención de datos depende de
            un patrón agresivo de peticiones.
          </p>

          <div class="border-base-300 bg-base-200/50 rounded-2xl border p-6 print:break-inside-avoid">
            <h3 class="mb-4 text-xl font-bold">Flujo de datos</h3>
            <ol class="grid gap-4 md:grid-cols-5">
              <li class="bg-base-100 rounded-xl p-4 text-center font-semibold">
                NASA JPL Horizons
              </li>
              <li class="bg-base-100 rounded-xl p-4 text-center font-semibold">
                Fetcher secuencial
              </li>
              <li class="bg-base-100 rounded-xl p-4 text-center font-semibold">
                Parser de vectores
              </li>
              <li class="bg-base-100 rounded-xl p-4 text-center font-semibold">Estado inicial</li>
              <li class="bg-base-100 rounded-xl p-4 text-center font-semibold">Simulación</li>
            </ol>
          </div>

          <FormulaBlock
            title="Condiciones iniciales"
            formulas={['r(t₀) = (X_NASA, Y_NASA)', 'v(t₀) = (VX_NASA, VY_NASA)']}
            note="Estas condiciones iniciales permiten que el simulador parta de datos astronómicos verificables en lugar de valores arbitrarios."
          />
        </Section>

        <Section
          id="arquitectura"
          eyebrow="Ingeniería de software"
          title="Arquitectura limpia del proyecto"
        >
          <p>
            La arquitectura de OrbitalJS no debería documentarse como una lista de carpetas sin
            explicación. Su valor está en la separación de responsabilidades. La lógica física debe
            poder probarse sin Canvas, sin SolidJS y sin estado visual. La interfaz debe poder
            cambiar sin reescribir el integrador. Los datos NASA deben llegar mediante servicios
            controlados y no contaminar el dominio matemático.
          </p>

          <DataTable
            headers={['Capa', 'Responsabilidad', 'Valor técnico']}
            rows={architectureRows}
          />

          <div class="border-base-300 bg-neutral text-neutral-content print:bg-base-100 print:text-base-content rounded-2xl border p-6">
            <h3 class="mb-4 text-xl font-bold">Dirección de dependencias</h3>
            <pre class="bg-neutral-content/10 print:bg-base-200 overflow-x-auto rounded-xl p-5 font-mono text-sm leading-7">
              <code>{`Presentation / Features
        ↓
Application
        ↓
Core / Domain
        ↑
Shared types, constants and utilities`}</code>
            </pre>
            <p class="text-neutral-content/80 print:text-base-content/75 mt-4 leading-7">
              La dependencia correcta apunta hacia el dominio, no al revés. El core no debe conocer
              detalles de UI. Esta decisión facilita pruebas, refactors y una posible migración
              futura a WebGL o Three.js.
            </p>
          </div>

          <ScreenshotSlot
            id="screenshot-estructura-proyecto"
            title="Estructura de carpetas y capas"
            description="Organización jerárquica del árbol del proyecto expandido con las capas Core, Application, Features y Presentation."
            expectedCapture="Árbol src/core, src/application, src/features, src/presentation expandido parcialmente."
            imageUrl="/images/xl-informacion-extra.avif"
            alt="Estructura de carpetas del proyecto"
            heightClass="h-64 sm:h-72 md:h-80"
          />
        </Section>

        <Section id="stack" eyebrow="Stack tecnológico" title="Tecnologías utilizadas">
          <p>
            El stack debe justificarse por su función dentro del sistema. SolidJS se usa para la
            interfaz reactiva, TypeScript para proteger modelos y contratos, Canvas para renderizado
            2D, Chart.js para diagnóstico visual y Bun para el flujo de desarrollo. No se trata de
            listar herramientas populares, sino de explicar por qué cada una reduce fricción o
            mejora la calidad del proyecto.
          </p>
          <DataTable headers={['Tecnología', 'Uso', 'Justificación']} rows={stackRows} />
        </Section>

        <Section
          id="desarrollo"
          eyebrow="Proceso de construcción"
          title="Convenciones, testing y flujo de trabajo"
        >
          <p>
            La calidad del proyecto no depende únicamente del simulador funcionando. También depende
            de que el equipo pueda mantenerlo. Por eso el README establece reglas de nomenclatura,
            tipado, comentarios, consumo de APIs, commits y revisión de Pull Requests. Estas reglas
            son parte del valor académico: demuestran disciplina de ingeniería y reducen errores en
            un trabajo colaborativo.
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            <For each={developmentProcess}>
              {(item) => <InfoCard title={item.title} body={item.body} />}
            </For>
          </div>
          <div class="border-base-300 bg-base-200/50 rounded-2xl border p-6">
            <h3 class="mb-4 text-xl font-bold">Comandos clave</h3>
            <pre class="bg-base-100 overflow-x-auto rounded-xl p-5 font-mono text-sm leading-7">
              <code>{`bun install
bun run dev
bun run fetch:planets
bun run test
bun run type:check
bun run lint
bun run fmt:check
bun run check`}</code>
            </pre>
          </div>
        </Section>

        <Section
          id="originalidad"
          eyebrow="Valor diferencial"
          title="Originalidad frente a simuladores visuales simples"
        >
          <p>
            El riesgo de este proyecto es que sea percibido como una animación bonita del sistema
            solar. Para evitarlo, nos gustaría y debemos destacar lo siguiente: OrbitalJS no solo
            dibuja planetas; modela estados físicos, aproxima ecuaciones diferenciales, compara
            integradores y usa conservación de energía como verificador. Esa combinación lo coloca
            más cerca de una herramienta educativa de física computacional que de una maqueta
            visual.
          </p>
          <DataTable
            headers={['Aspecto', 'Simulador visual básico', 'OrbitalJS']}
            rows={[
              {
                first: 'Origen de datos',
                second: 'Posiciones manuales o decorativas.',
                third: 'Condiciones iniciales obtenidas desde NASA JPL Horizons.',
              },
              {
                first: 'Modelo físico',
                second: 'Animaciones predefinidas o círculos parametrizados.',
                third: 'Aceleración gravitacional calculada a partir de interacción entre cuerpos.',
              },
              {
                first: 'Rigor numérico',
                second: 'No expone método de integración ni error.',
                third: 'Compara Euler y RK4, mostrando precisión y estabilidad.',
              },
              {
                first: 'Validación',
                second: 'La simulación se juzga por apariencia.',
                third: 'La simulación se evalúa por conservación de energía y deriva numérica.',
              },
              {
                first: 'Valor educativo',
                second: 'Muestra el resultado final.',
                third: 'Explica modelo, cálculo, arquitectura y limitaciones.',
              },
            ]}
          />
        </Section>

        <Section
          id="limitaciones"
          eyebrow="Pensamiento crítico"
          title="Limitaciones actuales y riesgos técnicos"
        >
          <p>
            También debemos ser críticos con nuestro propio proyecto, ya que debemos reconocer los
            límites actuales (establecidos por tiempo, conocimientos, recursos, etc). Las siguientes
            limitaciones conviene conservarlas en la página para demostrar criterio técnico.
          </p>
          <div class="grid gap-4 md:grid-cols-2">
            <InfoCard
              title="Escala física simplificada"
              body="El sistema puede usar escalas ajustadas para que las órbitas sean visibles en pantalla. Esto debe explicarse para no confundir visualización con escala astronómica literal."
            />
            <InfoCard
              title="Modelo 2D"
              body="El plano 2D es suficiente para explicar funciones vectoriales y estabilidad numérica, pero no representa inclinaciones orbitales completas en 3D."
            />
            <InfoCard
              title="Error por paso temporal"
              body="Un dt demasiado grande puede deformar trayectorias incluso con RK4. La interfaz debe exponer o limitar este parámetro de forma responsable."
            />
            <InfoCard
              title="Dependencia de datos externos"
              body="NASA JPL Horizons aporta realismo, pero requiere manejo de fallos, fallback local y consumo secuencial para evitar errores o bloqueos."
            />
          </div>
        </Section>

        <Section id="pedagogico" eyebrow="Impacto académico" title="Valor pedagógico y técnico">
          <p>
            OrbitalJS tiene valor porque une dos perfiles de aprendizaje: el estudiante de Cálculo
            II (nuestros iguales) y el desarrollador de software (el equipo responsable de este
            proyecto, es decir, sus servidores). Para el primero, convierte fórmulas en movimiento.
            Para el segundo, muestra cómo diseñar una simulación con separación de capas, pruebas y
            validación. La página de documentación debe dejar clara esta doble lectura.
          </p>
          <div class="grid gap-6 lg:grid-cols-2">
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6 print:break-inside-avoid">
              <h3 class="mb-4 text-xl font-bold">Para Cálculo II</h3>
              <ul class="list-disc space-y-3 pl-5">
                <li>Las funciones vectoriales se interpretan como trayectorias orbitales.</li>
                <li>La derivada de posición se interpreta como velocidad.</li>
                <li>La segunda derivada se interpreta como aceleración gravitacional.</li>
                <li>Las EDOs explican por qué el movimiento depende del estado anterior.</li>
                <li>
                  La integración numérica muestra cómo aproximar soluciones cuando no hay fórmula
                  cerrada simple.
                </li>
              </ul>
            </article>
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6 print:break-inside-avoid">
              <h3 class="mb-4 text-xl font-bold">Para ingeniería de software</h3>
              <ul class="list-disc space-y-3 pl-5">
                <li>El dominio físico se mantiene aislado del framework.</li>
                <li>Los contratos permiten cambiar renderers sin reescribir el motor.</li>
                <li>El tipado estricto reduce errores en modelos matemáticos.</li>
                <li>El consumo de API se diseña con control de tasa y fallback.</li>
                <li>La energía funciona como métrica automática de calidad.</li>
              </ul>
            </article>
          </div>
        </Section>

        <Section id="mejoras" eyebrow="Extensiones" title="Mejoras futuras propuestas">
          <p>
            Las mejoras futuras no deben ser simples adornos. Deben ampliar el valor matemático o
            técnico. Las siguientes extensiones mantienen coherencia con el proyecto y pueden
            convertirse en nuevas fases de desarrollo.
          </p>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <For each={futureWork}>
              {(item) => <InfoCard title={item.title} body={item.body} />}
            </For>
          </div>
        </Section>
        <Section id="conclusiones" eyebrow="Cierre" title="Conclusiones">
          <div class="grid gap-6 lg:grid-cols-3">
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6 print:break-inside-avoid">
              <h3 class="mb-3 text-xl font-bold">Conclusión matemática</h3>
              <p>
                OrbitalJS demuestra que las funciones vectoriales, las derivadas y las ecuaciones
                diferenciales no son conceptos aislados. En conjunto permiten modelar trayectorias
                reales, velocidades, aceleraciones y sistemas dinámicos bajo interacción
                gravitacional.
              </p>
            </article>
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6 print:break-inside-avoid">
              <h3 class="mb-3 text-xl font-bold">Conclusión técnica</h3>
              <p>
                La arquitectura limpia permite separar simulación, datos, visualización y UI. Esta
                separación hace que el proyecto sea más mantenible, testeable y escalable que una
                implementación concentrada en componentes visuales.
              </p>
            </article>
            <article class="border-base-300 bg-base-100 rounded-2xl border p-6 print:break-inside-avoid">
              <h3 class="mb-3 text-xl font-bold">Conclusión académica</h3>
              <p>
                El proyecto supera una demostración visual básica porque vincula teoría,
                implementación, validación y documentación. Su valor está en explicar tanto el
                resultado como el proceso matemático y computacional que lo produce.
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
