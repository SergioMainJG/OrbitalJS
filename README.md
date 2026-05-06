# OrbitalJS

## Miembros responsables del proyecto

- [Sabrina Ojeda](https://github.com/sabrinaAojeda)
- [Katherine Lopez](https://github.com/KathLoppz)
- [Luis Diaz](https://github.com/KathLoppz)
- [Joel Freire](#)
- [Sergio Arce](https://github.com/SergioMainJG)

## Descripción

Simulador de órbitas planetarias con datos reales de la NASA. Motor de integración numérica RK4 en TypeScript con SolidJS, visualización Canvas 2D y panel de energía con Chart.js.

## Requisitos previos

| Herramienta | Versión mínima | Para qué                            |
| :---------- | :------------- | :---------------------------------- |
| **Bun**     | 1.2.0+         | Runtime, package manager y bundler  |
| **Node.js** | 20.0.0+        | Fallback si Bun falla en algún paso |
| **Git**     | 2.40.0+        | Control de versiones                |

> **Nota:** Este proyecto usa **Bun** como package manager principal. Si no lo tienes, instálalo desde [bun.sh](https://bun.sh)

## Inicio rápido

```sh
git clone https://github.com/SergioMainJG/OrbitalJS.git
cd OrbitalJS
bun install
bun run dev       # http://localhost:3000
```

> **Nota**: No olviden copiar el `.env.template` a `.env`

## Scripts disponibles

| Comando                 | Acción                                              |
| :---------------------- | :-------------------------------------------------- |
| `bun run dev`           | Servidor de desarrollo con HMR                      |
| `bun run build`         | Build de producción en `/dist`                      |
| `bun run serve`         | Preview del build de producción                     |
| `bun run test`          | Tests en modo watch                                 |
| `bun run test:ci`       | Tests una sola vez (para CI)                        |
| `bun run test:coverage` | Tests con reporte de cobertura                      |
| `bun run type:check`    | Verifica tipos TypeScript sin compilar              |
| `bun run lint`          | Lint del código fuente                              |
| `bun run lint:fix`      | Lint con auto-corrección                            |
| `bun run fmt`           | Formatea todo el código                             |
| `bun run fmt:check`     | Verifica formato sin modificar                      |
| `bun run check`         | Lint + formato + tipos + tests (lo que corre el CI) |

> **Antes de un PR**, corre `bun run check` localmente. Si pasa, el CI pasará.

## Estructura del proyecto

```sh
.
├── .github/
│   └── workflows/
│       └── ci.yml              # Pipeline: lint a fmt a tipos a tests a build
├── .vscode/
│   ├── extensions.json         # Extensiones recomendadas (instálalas todas)
│   └── settings.json           # Configuración del editor para este proyecto
├── public/
│   └── data/
│       └── planets.json        # Datos orbitales reales (NASA/JPL Horizons)
├── src/
│   ├── constants/              # Constantes físicas y de configuración
│   ├── physics/                # Motor de simulación (pura lógica, sin UI)
│   ├── render/                 # Todo lo relacionado con Canvas 2D
│   ├── state/                  # Estado global de la aplicación (Solid stores)
│   ├── types/                  # Tipos TypeScript compartidos entre módulos
│   ├── ui/                     # Componentes de SolidJS
│   ├── utils/                  # Funciones utilitarias puras (sin estado, sin UI)
│   ├── test/
│   │   └── setup.ts            # Configuración global de Vitest (@testing-library/jest-dom)
│   ├── OrbitalJS.tsx           # Componente raíz (monta canvas + UI)
│   ├── index.css               # Estilos globales + directivas Tailwind v4
│   └── index.tsx               # Entry point (renderiza OrbitalJS en #root)
├── .gitattributes              # Normalización de line endings (LF en todos los OS)
├── .gitignore
├── .oxfmtrc.json               # Configuración del formatter oxfmt
├── .oxlintrc.json              # Reglas del linter oxlint
├── .prettierrc                 # Configuración de Prettier (.tsx, .html, .css)
├── bun.lock                    # Lockfile de dependencias (no editar a mano)
├── index.html                  # Entrada HTML de Vite
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Convenciones del equipo

### Nombres de archivos

- `kebab-case` para todos los archivos. Ejemplo: `rk4-integrator.ts`, `energy-panel.tsx`
- Componentes SolidJS también en kebab-case. Ejemplo: `orbit-canvas.tsx` (no `OrbitCanvas.tsx`)

### TypeScript

- **Prohibido `any`**: usa `unknown` si no sabes el tipo, luego narrowing con guards
- **Imports de tipos separados**: `import type { Planet } from '~/types'`
- **Sin `// @ts-ignore`**: usa `// @ts-expect-error` con descripción de por qué

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar integrador Verlet como alternativa a RK4
fix: corregir cálculo de energía potencial cuando r → 0
docs: actualizar README con nuevas instrucciones de setup
refactor: extraer camera transform a su propio módulo
test: agregar tests para el integrador RK4
```

### Flujo de trabajo

1. Crear rama desde `develop`con un significativo de los titulos descritos en los issues. Ejemplo: `fetching-parsing-jpl-horizons`: `git checkout -b`
2. Desarrollo + commits frecuentes
3. `bun run check` antes de push
4. PR hacia `develop` (no directo a `main`)
5. Al menos 1 revisión antes de mergear (Poner a quien desea que se revise la PR)

## Dependencias principales

| Paquete                                | Versión | Para qué                                    |
| :------------------------------------- | :------ | :------------------------------------------ |
| [solid-js](https://www.solidjs.com)    | ^1.9    | Framework UI reactivo (>>>react)            |
| [chart.js](https://www.chartjs.org)    | ^4.5    | Gráficas de energía en tiempo real          |
| [tailwindcss](https://tailwindcss.com) | ^4.2    | Estilos (CSS-first, sin tailwind.config.js) |
| [daisyui](https://daisyui.com)         | ^5.5    | Componentes UI sobre Tailwind               |

> **Tailwind v4**: No existe `tailwind.config.js`. La configuración es CSS-first: temas y plugins se definen en `index.css` o en `vite.config.ts`. DaisyUI v5 usa el mismo sistema.

## Extensiones de VS Code

Instala las extensiones listadas en `.vscode/extensions.json`. VS Code las sugerirá automáticamente al abrir el proyecto.

### Obligatorias

| Extensión                          | Para qué                                       |
| :--------------------------------- | :--------------------------------------------- |
| `solidjs-community.solid-snippets` | Snippets de SolidJS, autocompletado de signals |
| `bradlc.vscode-tailwindcss`        | Autocompletado de clases Tailwind v4           |
| `oxc.oxc-vscode`                   | Errores de oxlint inline en el editor          |
| `esbenp.prettier-vscode`           | Formateo al guardar                            |
| `vitest.explorer`                  | Correr tests desde el editor                   |

### Recomendadas

| Extensión                            | Para qué                                           |
| :----------------------------------- | :------------------------------------------------- |
| `pmneo.tsimporter`                   | Auto-imports de tipos y funciones                  |
| `usernamehw.errorlens`               | Errores TS inline, sin abrir el panel de problemas |
| `christian-kohler.path-intellisense` | Autocompletado en imports                          |

## Fallback a npm

```sh
npm install
npm run dev
```

> El campo `packageManager` en `package.json` está fijado a `bun@1.3.13`. Con npm, ignora ese campo.

## Aclaración sobre posible error en `vite.config.ts`

Se está usando [rolldown](https://rolldown.rs) en vez de [rollup](https://rollupjs.org), el nuevo motor que vite que

## Testing

Se va a crear una rama de testing. Se van a subir los archivos de testing, en los cuales ustedes tienen toda la libertad de modificar, cambiar nombre, etc. Aunque se espera que cumplan con las reglas estableciddas con las nomenclaturas, etc. El testing tiene proposito de disminuir errores en los merge y en tiempo de producción.
Yo, **Sergio Arce**, soy quien va a escribir el testing. Si no saben como usar `vitest` o realizar testing, no tengan duda en pasar la issue conmigo, o bien, usar alguna IA **(solamente asegurense de usar todo el issue completo como referencia)** para modificar el test.
Cada que hacen un commit, se ejecuta un commit de testing automatico, tanto en local como en github (el wf que implementé).

Voy a implementar el testing correspondiente a cada issue de cada sprint, y reitero, reimplementen si así lo consideran necesarios

## Production URL

> ### See the production in [orbitaljs](https://orbitaljs.sergioar.dev)
