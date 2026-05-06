// import "@testing-library/jest-dom/vitest";
import { cleanup } from "@solidjs/testing-library";
import { afterEach } from "vitest";

//! Limpia el DOM después de cada test
afterEach(() => {
  cleanup();
});
