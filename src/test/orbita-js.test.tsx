import { render, screen } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';

import { OrbitalJS } from '../orbita-js';

describe('<OrbitalJS />', () => {
  it('se renderiza sin lanzar errores', () => {
    render(() => <OrbitalJS />);
  });

  it('muestra el texto "Hello World"', () => {
    render(() => <OrbitalJS />);

    const el = screen.getByText('Hello World');

    expect(el).toBeTruthy();
  });

  it('usa un <h1> para el título principal', () => {
    render(() => <OrbitalJS />);
    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading.tagName.toLowerCase()).toBe('h1');
  });

  it('el heading contiene exactamente el texto esperado', () => {
    render(() => <OrbitalJS />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading.textContent?.trim()).toBe('Hello World');
  });

  it('aplica las clases de Tailwind correctas', () => {
    render(() => <OrbitalJS />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading.classList.contains('text-2xl')).toBe(true);
    expect(heading.classList.contains('font-bold')).toBe(true);
    expect(heading.classList.contains('to-blue-900')).toBe(true);
  });

  it('no tiene clases inesperadas fuera de las definidas', () => {
    render(() => <OrbitalJS />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect([...heading.classList].toSorted()).toMatchSnapshot();
  });
});
