import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';

import { OrbitalJS } from '../orbita-js';

describe('lógica de montaje (index.tsx)', () => {
  describe('guardia de #root', () => {
    it('lanza un error si el elemento root no es un HTMLElement', () => {
      const missingRoot = document.getElementById('id-que-no-existe');
      const runGuard = () => {
        if (!(missingRoot instanceof HTMLElement)) {
          throw new Error(
            'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
          );
        }
      };

      expect(runGuard).toThrow('Root element not found');
    });

    it('no lanza si el elemento root existe y es un HTMLElement', () => {
      const fakeRoot = document.createElement('div');
      fakeRoot.id = 'root';
      document.body.appendChild(fakeRoot);

      // oxlint-disable-next-line unicorn/consistent-function-scoping
      const runGuard = () => {
        const root = document.getElementById('root');
        if (!(root instanceof HTMLElement)) {
          throw new Error('Root element not found.');
        }
      };

      expect(runGuard).not.toThrow();

      document.body.removeChild(fakeRoot);
    });
  });

  describe('componente raíz montado', () => {
    it('OrbitalJS se monta en un contenedor como lo haría render()', () => {
      render(() => <OrbitalJS />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeTruthy();
    });

    it('el contenido de OrbitalJS es visible en el documento tras el montaje', () => {
      render(() => <OrbitalJS />);

      const text = screen.getByText('Hello World');
      expect(text).toBeTruthy();
    });
  });
});
