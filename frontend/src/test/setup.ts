/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest';

// Provide window.matchMedia mock for motion and responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Provide scrollTo mock
window.scrollTo = (() => {}) as any;
