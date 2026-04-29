export function vibrate(durationMs: number | number[] = 50): void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try { navigator.vibrate(durationMs); } catch { /* iOS Safari throws on some versions — silently no-op */ }
}
