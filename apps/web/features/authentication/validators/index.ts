/** Beyond zod's length check: nudge users toward a password that isn't trivially guessable. Non-blocking (UI hint, not a hard requirement). */
export function passwordStrengthHint(password: string): string | null {
  if (password.length === 0) return null;
  if (password.length < 8) return "Use at least 8 characters.";
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9\W]/.test(password);
  if (!hasLetter || !hasNumberOrSymbol) return "Mix letters with a number or symbol for a stronger password.";
  return null;
}
