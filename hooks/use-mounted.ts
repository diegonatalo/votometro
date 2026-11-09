import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** true só no navegador, depois da hidratação (no servidor e na hidratação é false). */
export function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
