import '@testing-library/jest-dom';

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
