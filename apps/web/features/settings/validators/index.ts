/** Blocks a no-op save so we don't fire a PATCH for an unchanged name. */
export function hasNameChanged(current: string, next: string): boolean {
  return current.trim() !== next.trim();
}
