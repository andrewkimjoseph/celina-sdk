/** MiniPay injects isMiniPay on window.ethereum (EIP-1193). */
interface Window {
  ethereum?: import("viem").EIP1193Provider & {
    isMiniPay?: boolean;
  };
}
