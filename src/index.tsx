import { render } from 'solid-js/web';
// oxlint-disable-next-line import/no-unassigned-import
import './index.css'; // This import is require if we want to apply tailwind in the project

import { OrbitalJS } from './orbita-js';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
  );
}

render(() => <OrbitalJS />, root!);
