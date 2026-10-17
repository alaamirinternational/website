const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const origin = configuredUrl ? new URL(configuredUrl) : new URL("http://localhost:3000");
const isPublicOrigin = !["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
export const site = {
  name: "AlAamir International",
  url: origin.origin,
  indexingEnabled: Boolean(configuredUrl) && isPublicOrigin && origin.protocol === "https:" && process.env.SITE_INDEXING_ENABLED === "true",
};
