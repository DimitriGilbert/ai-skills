#!/usr/bin/env node

/**
 * Lightweight agent-readiness audit.
 *
 * Usage:
 *   node scripts/audit-agent-readiness.mjs https://example.com
 *
 * This script intentionally avoids heavy crawling. It checks the root page and
 * standard machine-readable resources, then reports signals useful for an
 * agent-search optimisation audit.
 */

const site = process.argv[2];

if (!site) {
  console.error("Usage: node scripts/audit-agent-readiness.mjs https://example.com");
  process.exit(1);
}

function normalizeBase(input) {
  const url = new URL(input);
  return `${url.protocol}//${url.host}`;
}

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "agent-search-readiness-audit/1.0"
      }
    });
    const text = await res.text();
    return {
      ok: res.ok,
      status: res.status,
      url: res.url,
      contentType: res.headers.get("content-type") || "",
      text
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      url,
      contentType: "",
      text: "",
      error: error.message
    };
  }
}

function hasPattern(text, regex) {
  return regex.test(text || "");
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : null;
}

function extractMetaDescription(html) {
  const match = html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    || html.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
  return match ? match[1].trim() : null;
}

function countMatches(text, regex) {
  return [...(text || "").matchAll(regex)].length;
}

const base = normalizeBase(site);

const targets = {
  home: `${base}/`,
  robots: `${base}/robots.txt`,
  sitemap: `${base}/sitemap.xml`,
  llms: `${base}/llms.txt`,
  llmsFull: `${base}/llms-full.txt`
};

const results = {};

for (const [key, url] of Object.entries(targets)) {
  results[key] = await fetchText(url);
}

const home = results.home.text;

const report = {
  site: base,
  checkedAt: new Date().toISOString(),
  resources: Object.fromEntries(
    Object.entries(results).map(([key, value]) => [
      key,
      {
        url: value.url,
        ok: value.ok,
        status: value.status,
        contentType: value.contentType,
        bytes: value.text.length,
        error: value.error || null
      }
    ])
  ),
  homepageSignals: {
    title: extractTitle(home),
    metaDescription: extractMetaDescription(home),
    canonical: hasPattern(home, /<link\s+[^>]*rel=["']canonical["'][^>]*>/i),
    hreflangCount: countMatches(home, /hreflang=["'][^"']+["']/gi),
    jsonLdBlocks: countMatches(home, /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>/gi),
    openGraph: hasPattern(home, /property=["']og:/i),
    twitterCard: hasPattern(home, /name=["']twitter:/i),
    headings: {
      h1: countMatches(home, /<h1[\s>]/gi),
      h2: countMatches(home, /<h2[\s>]/gi)
    }
  },
  discoverySignals: {
    robotsMentionsSitemap: hasPattern(results.robots.text, /^sitemap:\s*/gim),
    sitemapLooksXml: hasPattern(results.sitemap.text, /<(urlset|sitemapindex)[\s>]/i),
    llmsTxtPresent: results.llms.ok,
    llmsFullPresent: results.llmsFull.ok
  },
  recommendations: []
};

if (!results.robots.ok) report.recommendations.push("Add a root /robots.txt file and reference sitemap URLs.");
if (!results.sitemap.ok) report.recommendations.push("Add /sitemap.xml or a sitemap index.");
if (!report.homepageSignals.canonical) report.recommendations.push("Add canonical link tags to important pages.");
if (report.homepageSignals.jsonLdBlocks === 0) report.recommendations.push("Add JSON-LD structured data to templates.");
if (!report.discoverySignals.llmsTxtPresent) report.recommendations.push("Consider adding /llms.txt as an agent orientation file.");
if (!report.homepageSignals.metaDescription) report.recommendations.push("Add a unique meta description to the homepage.");
if (report.homepageSignals.h1 !== 1) report.recommendations.push("Use one clear H1 on the homepage.");

console.log(JSON.stringify(report, null, 2));
