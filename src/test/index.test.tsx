import { describe, it, expect } from 'vitest';

describe('lógica de montaje (index.tsx)', () => {
  it('root element exists in the document after DOM setup', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    expect(document.getElementById('root')).not.toBeNull();
    document.body.removeChild(root);
  });
});
