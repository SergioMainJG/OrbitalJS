import { type Component } from 'solid-js';

const DocumentationPage: Component = () => {
  const contributors = [
    { name: 'Sabrina Ojeda', github: 'https://github.com/sabrinaAojeda' },
    { name: 'Katherine Lopez', github: 'https://github.com/KathLoppz' },
    { name: 'Luis Diaz', github: 'https://github.com/KathLoppz' }, // As defined in README
    { name: 'Joel Freire', github: 'https://github.com/JoelFreire-dev' },
    { name: 'Sergio Arce', github: 'https://github.com/SergioMainJG' },
  ];

  return (
    <div class="h-full w-full overflow-y-auto bg-[#0a0a1a] p-4 md:p-6 lg:p-8">
      <div class="mx-auto max-w-5xl space-y-12 pb-16">
        {/* Hero Section */}
        <section class="relative overflow-hidden rounded-2xl border border-indigo-900/40 bg-gradient-to-br from-[#111130]/90 to-[#0c0c24]/90 p-6 shadow-[0_0_50px_rgba(99,102,241,0.08)] md:p-10">
          <div class="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl"></div>
          <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"></div>

          <div class="relative space-y-4">
            <span class="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400"></span>
              Documentación del Proyecto
            </span>
            <h1 class="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl">
              Proyecto OrbitalJS
            </h1>
            <p class="max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">
              Un simulador del sistema solar de alta fidelidad que combina datos orbitales reales
              (NASA JPL Horizons API) con la resolución matemática de sistemas de EDOs
              gravitacionales empleando integradores numéricos avanzados.
            </p>
          </div>
        </section>

        {/* Propósito y Objetivos */}
        <section class="grid gap-6 md:grid-cols-2">
          <div class="space-y-4 rounded-xl border border-slate-800 bg-[#13132a]/60 p-6 backdrop-blur-sm">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-slate-200">Propósito del Proyecto</h2>
            <p class="text-xs leading-relaxed text-slate-400">
              OrbitalJS es una herramienta educativa e interactiva diseñada para la enseñanza y el
              aprendizaje de la mecánica celeste, la astrodinámica y los métodos de integración
              numérica. Su objetivo es concretar conceptos abstractos del cálculo vectorial y físico
              (tales como funciones vectoriales $r(t)$ de la trayectoria, derivadas de velocidad y
              aceleración, y sistemas de EDOs de segundo orden) haciéndolos completamente visuales y
              manipulables.
            </p>
          </div>

          <div class="space-y-4 rounded-xl border border-slate-800 bg-[#13132a]/60 p-6 backdrop-blur-sm">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-slate-200">Objetivo General</h2>
            <p class="text-xs leading-relaxed text-slate-400">
              Desarrollar un simulador dinámico que integre la posición y velocidad en tiempo real
              de cuerpos celestes reales, permitiendo experimentar con transferencias orbitales
              (maniobras de Hohmann), estudiar la deriva numérica de energía mecánica ($Drift$), y
              observar la influencia gravitatoria mutua de N-cuerpos de forma interactiva en la web.
            </p>
          </div>
        </section>

        {/* Objetivos Específicos */}
        <section class="space-y-6 rounded-xl border border-slate-800 bg-[#13132a]/40 p-6">
          <h2 class="border-l-4 border-indigo-500 pl-3 text-xl font-bold text-slate-200">
            Objetivos Específicos
          </h2>
          <div class="grid gap-4 md:grid-cols-3">
            <div class="space-y-2">
              <span class="text-xs font-bold text-indigo-400">01. Conexión de Datos Reales</span>
              <p class="text-xs leading-relaxed text-slate-400">
                Consultar de manera segura y secuencial la API JPL Horizons de la NASA para obtener
                vectores de estado cartesianos J2000 precisos.
              </p>
            </div>
            <div class="space-y-2">
              <span class="text-xs font-bold text-indigo-400">
                02. Integración de Física de Precisión
              </span>
              <p class="text-xs leading-relaxed text-slate-400">
                Implementar el solucionador Runge-Kutta de 4.º Orden (RK4) para resolver el sistema
                vectorial de EDOs gravitacionales con un error de deriva de energía menor al
                $0.01\%$.
              </p>
            </div>
            <div class="space-y-2">
              <span class="text-xs font-bold text-indigo-400">03. Interactividad de Vuelo</span>
              <p class="text-xs leading-relaxed text-slate-400">
                Permitir el lanzamiento manual de naves espaciales y el cálculo de la maniobra de
                Hohmann con dos impulsos para simular transferencias interplanetarias.
              </p>
            </div>
          </div>
        </section>

        {/* Cómo Resuelve / Flujo y Operación */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-slate-200">Solución y Guía de Operación</h2>

          <div class="grid gap-6 md:grid-cols-2">
            <div class="space-y-4 rounded-xl border border-slate-800 bg-[#13132a]/40 p-6">
              <h3 class="text-lg font-bold text-indigo-300">¿Cómo lo resuelve la aplicación?</h3>
              <p class="text-xs leading-relaxed text-slate-400">
                La aplicación utiliza la <strong>Segunda Ley de Newton</strong> combinada con la{' '}
                <strong>Ley de Gravitación Universal</strong> para formular la aceleración de cada
                cuerpo en base a su distancia y masa relativa a todos los demás cuerpos.
              </p>
              <p class="text-xs leading-relaxed text-slate-400">
                Este sistema de EDOs de segundo orden es reducido a un sistema de primer orden y
                resuelto paso a paso en tiempo real mediante el solucionador <strong>RK4</strong>.
              </p>
              <p class="text-xs leading-relaxed text-slate-400">
                La deriva de energía potencial y cinética ($Drift$) se grafica constantemente para
                garantizar al usuario la validez física de la simulación.
              </p>
            </div>

            <div class="space-y-4 rounded-xl border border-slate-800 bg-[#13132a]/40 p-6">
              <h3 class="text-lg font-bold text-indigo-300">Flujo de Trabajo y Operación</h3>
              <div class="space-y-3">
                <div class="flex gap-3">
                  <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                    1
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-semibold text-slate-300">
                      Selección de Escenario e Integrador
                    </h4>
                    <p class="text-[11px] text-slate-400">
                      Elige entre escenarios (Sistema Solar J2000, Tierra-Luna, Estrella Binaria,
                      etc.) y selecciona el integrador (RK4 para precisión o Euler para analizar
                      drift).
                    </p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                    2
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-semibold text-slate-300">Lanzamiento de la Nave</h4>
                    <p class="text-[11px] text-slate-400">
                      Haz clic y arrastra sobre la Tierra (u otro cuerpo de inicio) en el Canvas
                      para aplicar dirección y magnitud de velocidad inicial con el launcher
                      interactivo.
                    </p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                    3
                  </div>
                  <div class="space-y-0.5">
                    <h4 class="text-xs font-semibold text-slate-300">
                      Maniobra Hohmann y Diagnósticos
                    </h4>
                    <p class="text-[11px] text-slate-400">
                      Calcula la transferencia interplanetaria mediante el Hohmann Panel, observa la
                      circularización orbital automática y monitoriza la energía en tiempo real.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Arquitectura y Patrones */}
        <section class="space-y-6 rounded-xl border border-slate-800 bg-[#13132a]/40 p-6">
          <h2 class="text-2xl font-bold text-slate-200">Arquitectura de Limpieza y Patrones</h2>

          <p class="text-xs leading-relaxed text-slate-400">
            El proyecto sigue estrictamente los principios de <strong>Clean Architecture</strong>{' '}
            (Arquitectura Limpia) y divide sus responsabilidades en 5 capas desacopladas, lo que
            garantiza la testabilidad y el mantenimiento offline:
          </p>

          <div class="grid gap-4 md:grid-cols-5">
            <div class="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span class="text-[10px] font-bold text-indigo-400 uppercase">1. Dominio / Core</span>
              <p class="text-[10px] text-slate-400">
                Fórmulas de física pura, integradores numéricos RK4/Euler y cálculo de drift de
                energía sin frameworks.
              </p>
            </div>
            <div class="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span class="text-[10px] font-bold text-indigo-400 uppercase">2. Aplicación</span>
              <p class="text-[10px] text-slate-400">
                Casos de uso puros (cargar escenario, comparar integradores), servicios de fachada e
                inyección de dependencias.
              </p>
            </div>
            <div class="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span class="text-[10px] font-bold text-indigo-400 uppercase">3. Features</span>
              <p class="text-[10px] text-slate-400">
                Componentes de SolidJS, stores de estado reactivo locales y orquestación de señales.
              </p>
            </div>
            <div class="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span class="text-[10px] font-bold text-indigo-400 uppercase">4. Presentación</span>
              <p class="text-[10px] text-slate-400">
                Dibujado 2D en Canvas (cámara de proyección, launcher, órbitas) y layouts
                responsivos de pantalla.
              </p>
            </div>
            <div class="space-y-1 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <span class="text-[10px] font-bold text-indigo-400 uppercase">5. Shared</span>
              <p class="text-[10px] text-slate-400">
                Constantes físicas reales (G, masas, radios) y utilidades transversales (fetcher y
                parser de JPL Horizons).
              </p>
            </div>
          </div>

          <div class="space-y-4 pt-2">
            <h3 class="text-sm font-bold text-slate-300">Patrones de Diseño Clave Aplicados</h3>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-1">
                <h4 class="text-xs font-semibold text-indigo-300">
                  Patrón Registry / Dependency Injection
                </h4>
                <p class="text-[11px] text-slate-400">
                  El core utiliza abstracciones (`Renderer`) inyectadas en tiempo de ejecución.
                  Permite migrar de un Canvas 2D a WebGL 3D sin alterar las ecuaciones matemáticas
                  del simulador.
                </p>
              </div>
              <div class="space-y-1">
                <h4 class="text-xs font-semibold text-indigo-300">Patrón Gateway / Facade</h4>
                <p class="text-[11px] text-slate-400">
                  Abstrae la API externa JPL Horizons y su compleja lógica de búsqueda en
                  HorizonsService, aislando la estructura interna de la aplicación de cambios de la
                  NASA.
                </p>
              </div>
              <div class="space-y-1">
                <h4 class="text-xs font-semibold text-indigo-300">
                  Patrón State Store Unidireccional
                </h4>
                <p class="text-[11px] text-slate-400">
                  SolidJS stores unifican y exponen señales reactivas de lectura, mientras que las
                  mutaciones físicas ocurren en el Runtime de forma secuencial, garantizando
                  coherencia.
                </p>
              </div>
              <div class="space-y-1">
                <h4 class="text-xs font-semibold text-indigo-300">
                  Patrón Strategy (Integradores)
                </h4>
                <p class="text-[11px] text-slate-400">
                  El motor de física desacopla el cálculo del paso de simulación mediante una
                  interfaz común para Euler y Runge-Kutta 4, facilitando la adición de futuros
                  resolvedores.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stack Tecnológico */}
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-slate-200">Stack Tecnológico del Proyecto</h2>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#13132a]/40 p-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-400">
                JS/TS
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-300">TypeScript</h4>
                <p class="text-[10px] text-slate-500">Tipado estricto sin `any`</p>
              </div>
            </div>

            <div class="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#13132a]/40 p-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-bold text-indigo-400">
                Solid
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-300">SolidJS</h4>
                <p class="text-[10px] text-slate-500">Framework UI reactivo y veloz</p>
              </div>
            </div>

            <div class="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#13132a]/40 p-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-sm font-bold text-purple-400">
                CSS4
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-300">Tailwind CSS v4</h4>
                <p class="text-[10px] text-slate-500">Ajustes responsivos y DaisyUI 5</p>
              </div>
            </div>

            <div class="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#13132a]/40 p-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10 text-sm font-bold text-pink-400">
                Bun
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-300">Bun Runtime</h4>
                <p class="text-[10px] text-slate-500">Gestor de paquetes, runner y tests</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contribuidores */}
        <section class="space-y-6 rounded-xl border border-slate-800 bg-gradient-to-br from-[#13132a]/80 to-[#0c0c24]/80 p-6 md:p-8">
          <div class="space-y-2 text-center">
            <h2 class="text-2xl font-black text-slate-200">Créditos del Proyecto</h2>
            <p class="text-xs text-slate-400">
              Equipo de ingenieros responsables del desarrollo y la validación matemática de
              OrbitalJS
            </p>
          </div>

          <div class="flex flex-wrap justify-center gap-4 pt-2">
            {contributors.map((c) => (
              <a
                href={c.github}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all duration-300 hover:border-indigo-500/50 hover:bg-indigo-950/20 hover:text-indigo-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                {c.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export { DocumentationPage };
