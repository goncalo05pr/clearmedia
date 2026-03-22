/**
 * URL publique (NEXT_PUBLIC_SITE_URL), sans slash final.
 */
export function getPublicSiteUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  return url ? url.replace(/\/$/, "") : null;
}
