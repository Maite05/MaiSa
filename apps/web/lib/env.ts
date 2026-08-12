// Client-safe env access. NEXT_PUBLIC_* vars are inlined at build time by
// Next.js, so this is readable from both server and client components.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
