/**
 * Proxy-based lazy loader for AgentKarmaService.
 *
 * Defers the `@agentkarma/sdk` import until the first actual use of
 * `client.agentKarma`. This avoids the `ERR_PACKAGE_PATH_NOT_EXPORTED`
 * error on Node.js v24.10.0+ where `@agentkarma/sdk` lacks an `"exports"`
 * field in its package.json.
 *
 * The Proxy exposes a synchronous `chain` property ("celo") and delegates
 * all other property/method access to a lazily-initialized AgentKarmaService
 * instance via dynamic `import()`.
 */
export function createAgentKarmaService(config?: unknown) {
  let instance: any = null;
  const getInstance = async () => {
    if (!instance) {
      const mod = await import("./agentkarma.service.js");
      instance = new mod.AgentKarmaService(config as any);
    }
    return instance;
  };

  // Fire-and-forget pre-init to warm the module cache
  getInstance().catch(() => {});

  return new Proxy({} as any, {
    get(_, prop: string) {
      // chain is always "celo" — no import needed
      if (prop === "chain") return "celo" as const;
      if (prop === "then") return undefined;
      return async (...args: unknown[]) => {
        const svc = await getInstance();
        const val = svc[prop];
        return typeof val === "function" ? val.apply(svc, args) : val;
      };
    },
  });
}