/** Cross-field check the zod object schema can't express as cleanly: end must come after start when both are set. */
export function isValidTimeRange(startTime: string, endTime: string | undefined): boolean {
  if (!endTime) return true;
  return new Date(endTime).getTime() > new Date(startTime).getTime();
}
