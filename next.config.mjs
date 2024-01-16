/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["lh3.googleusercontent.com", "ighnwriityuokisyadjb.supabase.co"],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    NEXT_SUPABASE_SERVICE_ROLE_KEY:
      process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || "",
    KNOCK_SECRET_API_KEY: process.env.KNOCK_SECRET_API_KEY || "",
    KNOCK_PUBLIC_API_KEY: process.env.KNOCK_PUBLIC_API_KEY || "",
    KNOCK_FEED_ID: process.env.KNOCK_FEED_ID || "",
  },
};

export default config;
