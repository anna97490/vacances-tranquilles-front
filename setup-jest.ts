// import 'jest-preset-angular/setup-jest';
// import '@testing-library/jest-dom';
// setup-jest.ts
 import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

 setupZoneTestEnv();
// Configuration globale pour les tests
Object.defineProperty(window, 'CSS', { value: null });

// @ts-ignore
window.alert = jest.fn();

Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance']
    };
  }
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});

// Global test setup
// beforeEach(() => {
//   // Reset DOM before each test
//   document.body.innerHTML = '';
// });