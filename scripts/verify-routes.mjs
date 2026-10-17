import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const origin = process.env.TEST_BASE_URL || "http://localhost:3000";
const apps = JSON.parse(await readFile(new URL("../.next/server/app-paths-manifest.json", import.meta.url), "utf8"));
const prerender = JSON.parse(await readFile(new URL("../.next/prerender-manifest.json", import.meta.url), "utf8"));
const routes = [...new Set([...Object.keys(apps).filter(path => path.endsWith("/page") && !path.includes("[") && !path.includes("_not-found") && !path.includes("_global-error")).map(path => path.slice(0, -5) || "/"), ...Object.keys(prerender.routes).filter(path => !path.startsWith("/_"))])];
let failures = 0;
const titles = new Set();
const descriptions = new Set();
const internalLinks = new Set();
for (const path of routes) {
  try {
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `HTTP ${response.status}`);
    const html = await response.text();
    if (response.headers.get("content-type")?.includes("text/html")) {
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, "Expected one H1");
      const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
      assert.ok(title && !titles.has(title), "Missing or duplicate title"); titles.add(title);
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
      assert.ok(description && !descriptions.has(description), "Missing or duplicate description"); descriptions.add(description);
      assert.match(html, /rel="canonical"/);
      assert.match(html, /property="og:title"/);
      assert.match(html, /name="twitter:card"/);
      assert.match(html, /name="robots" content="noindex/);
      assert.doesNotMatch(html, /<h[1-6][^>]*>\s*<\/h[1-6]>/, "Empty heading");
      const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
      assert.equal(new Set(ids).size, ids.length, "Duplicate IDs");
      for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
        const schema = JSON.parse(match[1]);
        assert.ok(schema["@context"] && schema["@type"]);
        assert.notEqual(schema["@type"], "TouristTrip", "Draft must not emit a trip");
        assert.notEqual(schema["@type"], "Article", "Draft must not emit an article");
      }
      for (const match of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
        const href = match[1].replaceAll("&amp;", "&");
        if (href.startsWith("#")) assert.ok(ids.includes(href.slice(1)), `Missing anchor ${href}`);
        else if (href.startsWith("/")) internalLinks.add(href);
      }
    }
    console.log(`PASS ${path}`);
  } catch (error) { failures++; console.error(`FAIL ${path}: ${error.message}`); }
}
for (const path of internalLinks) {
  if (routes.includes(path)) continue;
  const response = await fetch(new URL(path, origin));
  if (response.status !== 200) { failures++; console.error(`FAIL internal link ${path}: ${response.status}`); }
}
for (const path of ["/not-a-route", "/international-tours/not-a-country", "/international-tours/turkey/not-a-package", "/umrah/packages/not-a-package", "/hajj/packages/not-a-package", "/pakistan-tours/not-a-package", "/guides/not-a-guide"]) {
  const response = await fetch(new URL(path, origin), { headers: { "User-Agent": "Twitterbot" } });
  if (response.status !== 404) { failures++; console.error(`FAIL expected 404 ${path}: ${response.status}`); }
}
const search = await (await fetch(new URL("/guides?q=does-not-exist", origin))).text();
if (!search.includes("No guides match your search")) { failures++; console.error("FAIL guide search empty state"); }
const contact = await (await fetch(new URL("/contact?type=Hajj", origin))).text();
if (!/<option[^>]*selected[^>]*>Hajj<\/option>/.test(contact)) { failures++; console.error("FAIL enquiry context"); }
console.log(`${routes.length} routes, ${internalLinks.size} internal links, 7 unknown-slug checks, search and enquiry context: ${failures} failures.`);
process.exitCode = failures ? 1 : 0;
