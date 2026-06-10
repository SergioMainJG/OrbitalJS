import type { Component } from 'solid-js';

export const DocumentLinks: Component = () => {
  return (
    <div class="flex gap-2 sm:gap-4">
      {/* Enlace al primer PDF */}
      <a
        href="/informe-orbitaljs.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary btn-xs sm:btn-sm font-semibold"
      >
        Ver Informe
      </a>

      {/* Enlace al segundo PDF */}
      <a
        href="/poster-orbitaljs.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-outline btn-xs sm:btn-sm font-semibold"
      >
        Ver Poster
      </a>
    </div>
  );
};
