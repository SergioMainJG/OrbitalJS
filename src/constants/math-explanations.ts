export const GRAVITATION_EXPLANATION =
  "La fuerza gravitacional entre dos cuerpos es directamente proporcional al producto de sus masas e inversamente proporcional al cuadrado de la distancia que los separa.";

export const NEWTON_EXPLANATION =
  "La aceleracion de un cuerpo es igual a la fuerza neta dividida por su masa. Esto convierte el problema gravitacional en un sistema de ecuaciones diferenciales.";

export const EDO_EXPLANATION =
  "Reducimos la ecuacion de segundo orden (posicion) a dos ecuaciones de primer orden: una para la posicion y otra para la velocidad. Esto permite integrar numericamente.";

export const RK4_EXPLANATION =
  "RK4 es un metodo de integracion numerica con error O(Δt⁴). Evalua la pendiente en cuatro puntos intermedios para obtener una estimacion mucho mas precisa que Euler.";

export const ENERGY_CONSERVATION_EXPLANATION =
  "En un sistema aislado sin fuerzas disipativas, la energia mecanica total (cinetica + potencial) se conserva. Esto sirve como verificacion de la precision del integrador.";

export const EULER_EXPLANATION =
  "Euler es un metodo de primer orden con error O(Δt). En cada paso usa solo la pendiente al inicio del intervalo. Es simple pero acumula error rapidamente.";

export const ENERGY_PANEL_TOOLTIP = [
  "La energia total E = K + U deberia mantenerse constante",
  "en un sistema hamiltoniano sin fuerzas externas.",
  "La deriva porcentual mide la precision del integrador.",
  "RK4 conserva energia mejor que Euler.",
];

export const COMPARISON_TOOLTIP_EULER = "Euler: error O(Δt) → converge linealmente";
export const COMPARISON_TOOLTIP_RK4 = "RK4: error O(Δt⁴) → converge mucho mas rapido";
