import '@testing-library/jest-dom/vitest';

Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: (): {
    matches: boolean;
    addListener: () => void;
    removeListener: () => void;
  } => ({
    matches: false,
    addListener: (): void => {},
    removeListener: (): void => {},
  }),
});
