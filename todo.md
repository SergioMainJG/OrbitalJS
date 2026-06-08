## OrbitalJS — Checklist Actualizado

### 🔴 CRÍTICO

**[BUG-1] Panel izquierdo sin scroll**

- **Dónde:** `left-panel.tsx` y `dashboard-layout.tsx`
- **Problema:** El contenedor del panel izquierdo tiene `overflow-visible` en mobile y no tiene `overflow-y-auto` en desktop. El contenido (controles + comparador + Hohmann + HowItWorks) excede la altura disponible sin forma de scrollear.
- **Fix:** En `left-panel.tsx` agregar `overflow-y-auto` y `panel-scroll` al div contenedor. En `dashboard-layout.tsx` asegurarse que la columna izquierda tenga `lg:overflow-hidden` reemplazado por `lg:overflow-y-auto`.

**[BUG-2] Hohmann: origen y destino por defecto son iguales (Mercury = Mercury)**

- **Dónde:** `simulation-store.ts` línea `hohmannParams`
- **Problema:** El store inicializa `{ origin: "Earth", target: "Mars" }` pero la imagen muestra Mercury → Mercury, lo que produce `null` en `calculation()` y muestra "Selecciona planetas distintos". Probablemente el estado se resetea mal.
- **Fix:** Verificar que `resetComparison()` y `handleScenarioChange()` no pisen `hohmannParams`. Agregar validación para que origin y target nunca sean iguales al inicializar.

**[BUG-3] Inversión de coordenada Y entre renderers**

- **Dónde:** `draw-bodies.ts` vs `draw-spaceship.ts`
- **Problema:** `draw-bodies.ts` usa `cy + body.y * scale` (Y sin invertir), `draw-spaceship.ts` usa `cy - body.y * scale` (Y invertida). Con vectores J2000 reales la nave aparece en el hemisferio opuesto a los planetas.
- **Fix:** Cambiar `draw-bodies.ts` para usar `cy - body.y * scale` consistentemente.

---

### 🟠 BUGS MENORES

**[BUG-4] Segundo impulso de Hohmann no implementado**

- **Dónde:** `hohmann-panel.tsx` → `handleLaunchHohmann()`
- **Problema:** Solo aplica Δv₁ al lanzar. La nave pasa de largo la órbita destino porque Δv₂ nunca se ejecuta. El informe ejecutivo describe explícitamente los dos impulsos.
- **Fix:** Detectar cuando la nave alcanza el apoapsis (distancia ≈ r₂) y aplicar Δv₂ tangencialmente en ese punto dentro del loop de física.

**[BUG-5] Log de simulación estático**

- **Dónde:** `simulation-store.ts` → `logMessages`, nunca se actualiza
- **Problema:** Las tres líneas iniciales son hardcodeadas y nunca cambian. Cambiar integrador, detectar colisión, drift de energía alto — nada se registra.
- **Fix:** Exportar `addLogMessage()` y llamarlo desde: cambio de integrador en `simulation-controls`, colisión en `spaceship-launcher`, drift > 1% en `energy-panel`.

**[BUG-6] Distancias r₁ y r₂ en Hohmann muestran valores incorrectos**

- **Dónde:** `hohmann-panel.tsx` → `calculation()`
- **Problema:** La imagen muestra r₁ = 1.017 UA y r₂ = 1.640 UA para Mercury → Mercury, que son valores de una iteración anterior sin limpiar. La distancia debería ser 0 o undefined para el mismo planeta.
- **Fix:** Está ligado a BUG-2; resolverlo limpia este síntoma.

---

### 🔵 ROADMAP PENDIENTE

**[FEAT-1] README.md**

- **Dónde:** raíz del proyecto, no existe
- **Qué incluir:** propósito pedagógico, stack técnico, cómo correr `bun run fetch:planets`, arquitectura de módulos (diagrama), capturas de pantalla, explicación matemática resumida de RK4 y conservación de energía.

**[FEAT-2] Cámara suave siguiendo la nave**

- **Dónde:** `solar-system-canvas.tsx` → bloque `followSpaceship`
- **Problema:** El follow actual mueve el offset bruscamente cada frame. No hay interpolación ni zoom adaptativo.
- **Fix:** Aplicar lerp al offset: `camera.offsetX += (targetX - camera.offsetX) * 0.05` por frame. Agregar zoom automático basado en velocidad de la nave.

**[FEAT-3] Eventos en log al cambiar época histórica**

- **Dónde:** `simulation-controls.tsx` → `handleEpochChange()`
- **Qué falta:** Registrar en el log qué época se cargó, cuántos planetas se obtuvieron y si hubo fallback a datos offline.

---

### Orden recomendado de ataque

| Prioridad | Tarea                       | Impacto               |
| --------- | --------------------------- | --------------------- |
| 1         | BUG-1 scroll panel          | Usabilidad bloqueante |
| 2         | BUG-3 coordenada Y          | Corrección física     |
| 3         | BUG-2 Hohmann mismo planeta | UX confusa            |
| 4         | BUG-4 segundo impulso       | Promesa pedagógica    |
| 5         | BUG-5 log dinámico          | Pulido                |
| 6         | FEAT-1 README               | Entregable explícito  |
| 7         | FEAT-2 cámara suave         | Experiencia visual    |
