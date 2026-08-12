/** Loose check to nudge users toward pasting a real file link, not a page URL. */
export function looksLikeFileUrl(url: string): boolean {
  return /\.[a-z0-9]{2,5}($|\?)/i.test(url);
}
