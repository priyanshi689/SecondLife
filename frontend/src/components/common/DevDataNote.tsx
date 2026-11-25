import { isBackendConfigured } from "@/services/api";
export function DevDataNote() {
  if (isBackendConfigured) return null;
  return <p className="mt-1 text-xs text-muted-foreground">Showing sample development data — connects to the real backend later.</p>;
}
