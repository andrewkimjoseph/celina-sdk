import { afterEach, describe, expect, it, vi } from "vitest";
import { isMiniPayBrowser } from "../../src/utils/minipay.js";

describe("isMiniPayBrowser", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    if (originalWindow === undefined) {
      // @ts-expect-error cleanup
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
  });

  it("returns false when window is undefined", () => {
    // @ts-expect-error test SSR
    delete globalThis.window;
    expect(isMiniPayBrowser()).toBe(false);
  });

  it("returns false without isMiniPay flag", () => {
    globalThis.window = { ethereum: {} } as unknown as Window & typeof globalThis;
    expect(isMiniPayBrowser()).toBe(false);
  });

  it("returns true when window.ethereum.isMiniPay is true", () => {
    globalThis.window = {
      ethereum: { isMiniPay: true },
    } as unknown as Window & typeof globalThis;
    expect(isMiniPayBrowser()).toBe(true);
  });
});
