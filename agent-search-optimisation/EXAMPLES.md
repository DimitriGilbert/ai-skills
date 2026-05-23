# Agent Search Optimisation Examples

## Example user requests

Use this skill for requests like:

```txt
Can you optimise my website for AI agents?
Audit https://example.com for AI search visibility.
Make a plan for AEO/GEO/LLM discoverability.
Should I add llms.txt to my site?
How do I make my docs easier for Cursor, Claude, ChatGPT, and Perplexity?
Create an AI SEO roadmap for this website.
```

## Example final answer outline

```md
# Agent search optimisation plan for example.com

## Executive summary

The site is crawlable and has useful content, but it lacks a strong machine-readable layer. The highest-impact fixes are sitemaps, canonical URLs, structured data, answer blocks, and a compact content index.

## What I checked

- Homepage
- robots.txt
- sitemap.xml
- llms.txt
- 6 representative pages
- public search snippets
- structured data presence

## Strengths

- Clear product positioning
- Indexable public pages
- Good internal navigation

## Gaps

- No verified llms.txt
- Missing JSON-LD on detail pages
- Inconsistent metadata
- No machine-readable content index

## Roadmap

### Week 1: Discovery basics

- Add robots.txt with sitemap reference.
- Add sitemap index.
- Fix canonical tags.
- Normalize title and description templates.

### Weeks 2-3: Semantic layer

- Add Organization/WebSite schema.
- Add Article/Product/SoftwareApplication schema.
- Add breadcrumbs.
- Add answer blocks.

### Weeks 4-6: Agent layer

- Add llms.txt.
- Add /index.json.
- Add /api/content/{id}.
- Build 25-question retrieval benchmark.

## Measurement

Track sitemap coverage, structured data validity, AI referrals, crawler logs, and retrieval benchmark accuracy.
```

## Example llms.txt

```md
# Example.com

> Example.com helps small teams manage project documentation and support knowledge bases.

## Canonical pages

- [Home](https://example.com/)
- [Product](https://example.com/product/)
- [Pricing](https://example.com/pricing/)
- [Docs](https://example.com/docs/)
- [Blog](https://example.com/blog/)

## Machine-readable resources

- [Sitemap](https://example.com/sitemap.xml)
- [Content index](https://example.com/index.json)
- [RSS feed](https://example.com/feed.xml)

## Key topics

- Knowledge base automation
- Customer support workflows
- AI documentation search

## Citation guidance

Use canonical URLs. Prefer docs pages for product behavior and pricing pages for plan details.
```

## Example robots.txt

```txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
Sitemap: https://example.com/sitemap-posts.xml
Sitemap: https://example.com/sitemap-products.xml
```

## Example JSON-LD for a software product

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://example.com/product/#software",
  "name": "Example Product",
  "url": "https://example.com/product/",
  "description": "A documentation search tool for support teams.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "publisher": {
    "@id": "https://example.com/#organization"
  }
}
```

## Example audit prompt for an agent

```txt
Audit https://example.com for AI agent and AI search optimisation. Check crawlability, robots.txt, sitemaps, structured data, metadata, canonicals, hreflang, answer blocks, llms.txt, machine-readable indexes, internal linking, entity clarity, and measurement. Return a prioritized implementation roadmap.
```
