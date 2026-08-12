import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @maisa/ui ships TS source (not a prebuilt dist), so Next must transpile
  // it itself rather than treating it as an opaque pre-compiled dependency.
  transpilePackages: ["@maisa/ui", "@maisa/types"],
  // Pin the workspace root explicitly — otherwise Next auto-detects it from
  // *any* pnpm-lock.yaml it finds walking up, which can land outside this repo.
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
