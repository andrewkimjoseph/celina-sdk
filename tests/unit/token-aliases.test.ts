import { describe, expect, it } from "vitest";
import { createCelinaClient } from "../../src/index.js";
import { findKnownToken } from "../../src/config/chains.js";

const MENTO_LEGACY_ALIASES: Array<{ alias: string; symbol: string; address: string }> = [
  { alias: "cUSD", symbol: "USDm", address: "0x765de816845861e75a25fca122bb6898b8b1282a" },
  { alias: "cEUR", symbol: "EURm", address: "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73" },
  { alias: "cREAL", symbol: "BRLm", address: "0xe8537a3d056da446677b9e9d6c5db704eaab4787" },
  { alias: "CREAL", symbol: "BRLm", address: "0xe8537a3d056da446677b9e9d6c5db704eaab4787" },
  { alias: "eXOF", symbol: "XOFm", address: "0x73F93dcc49cB8A239e2032663e9475dd5ef29A08" },
  { alias: "cKES", symbol: "KESm", address: "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0" },
  { alias: "PUSO", symbol: "PHPm", address: "0x105d4A9306D2E55a71d2Eb95B81553AE1dC20d7B" },
  { alias: "cCOP", symbol: "COPm", address: "0x8a567e2ae79ca692bd748ab832081c45de4041ea" },
  { alias: "cGBP", symbol: "GBPm", address: "0xCCF663b1fF11028f0b19058d0f7B674004a40746" },
  { alias: "cCAD", symbol: "CADm", address: "0xff4Ab19391af240c311c54200a492233052B6325" },
  { alias: "cAUD", symbol: "AUDm", address: "0x7175504C455076F15c04A2F90a8e352281F492F9" },
  { alias: "cZAR", symbol: "ZARm", address: "0x4c35853A3B4e647fD266f4de678dCc8fEC410BF6" },
  { alias: "cGHS", symbol: "GHSm", address: "0xfAeA5F3404bbA20D3cc2f8C4B0A888F55a3c7313" },
  { alias: "cNGN", symbol: "NGNm", address: "0xE2702Bd97ee33c88c8f6f92DA3B733608aa76F71" },
  { alias: "CNGN", symbol: "NGNm", address: "0xE2702Bd97ee33c88c8f6f92DA3B733608aa76F71" },
  { alias: "cJPY", symbol: "JPYm", address: "0xc45eCF20f3CD864B32D9794d6f76814aE8892e20" },
  { alias: "cCHF", symbol: "CHFm", address: "0xb55a79F398E759E43C95b979163f30eC87Ee131D" },
];

describe("Mento legacy token aliases", () => {
  it.each(MENTO_LEGACY_ALIASES)(
    "findKnownToken($alias) → $symbol",
    ({ alias, symbol, address }) => {
      const token = findKnownToken(alias);
      expect(token?.symbol).toBe(symbol);
      expect(token?.address).toBe(address);
    },
  );

  it("resolves aliases case-insensitively", () => {
    expect(findKnownToken("ckes")?.symbol).toBe("KESm");
    expect(findKnownToken("cusd")?.symbol).toBe("USDm");
    expect(findKnownToken("puso")?.symbol).toBe("PHPm");
    expect(findKnownToken("exof")?.symbol).toBe("XOFm");
  });

  it("resolveToken returns canonical symbol for legacy input", () => {
    const client = createCelinaClient({ analyticsEnabled: false });
    const resolved = client.token.resolveToken("cKES");
    expect(resolved.symbol).toBe("KESm");
    expect(resolved.address).toBe("0x456a3D042C0DbD3db53D5489e98dFb038553B0d0");
    expect(resolved.decimals).toBe(18);
  });

  it("throws for unknown tokens", () => {
    const client = createCelinaClient({ analyticsEnabled: false });
    expect(() => client.token.resolveToken("cBRL")).toThrow(/Unknown token/);
    expect(() => client.token.resolveToken("NOTATOKEN")).toThrow(/Unknown token/);
  });
});
