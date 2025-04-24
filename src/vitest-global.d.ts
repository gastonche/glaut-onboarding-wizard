/* eslint-disable @typescript-eslint/no-empty-object-type */
import "@testing-library/jest-dom";

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
}
