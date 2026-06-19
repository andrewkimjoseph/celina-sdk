/** True when running inside the MiniPay in-app browser (SSR/Node-safe). */
export function isMiniPayBrowser(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.ethereum?.isMiniPay === true;
}
