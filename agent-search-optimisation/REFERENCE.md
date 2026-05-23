# Agent Search Optimisation Reference

## Core concept

Agent search optimisation means making a website easy for LLMs, answer engines, crawlers, and autonomous agents to discover, understand, cite, and navigate.

It is not a replacement for SEO. It sits on top of technical SEO, structured content, entity clarity, and stable machine-readable surfaces.

## Terminology

- **AI SEO**: broad optimisation for visibility in AI search experiences.
- **AEO**: answer engine optimisation; content designed to answer questions clearly.
- **GEO**: generative engine optimisation; making content likely to be retrieved and cited by generative systems.
- **Agent-readiness**: making a site usable by autonomous agents, not only search crawlers.
- **Machine layer**: sitemaps, JSON-LD, feeds, indexes, APIs, and retrieval endpoints.
- **Human layer**: normal HTML pages designed for people.

## Audit checklist

### Crawl and discovery

Check:

- `robots.txt` exists at root.
- `robots.txt` references sitemap URLs.
- Sitemap index exists when the site has multiple sections.
- Important public pages are in sitemaps.
- Pages return correct status codes.
- Public pages are not blocked accidentally.
- Canonical URLs resolve consistently.
- Important content is present in initial HTML or reliably rendered.

Recommended files:

```txt
/robots.txt
/sitemap.xml
/sitemap-pages.xml
/sitemap-posts.xml
/sitemap-products.xml
/sitemap-docs.xml
/sitemap-tags.xml
/llms.txt
/llms-full.txt
/index.json
/feed.xml
```

### Structured data

Use JSON-LD. Choose schema types based on the site:

| Site type | Useful schema types |
|---|---|
| Personal portfolio | Person, WebSite, CollectionPage, BlogPosting, SoftwareSourceCode |
| SaaS/product site | Organization, SoftwareApplication, Product, Offer, FAQPage |
| Docs site | TechArticle, HowTo, APIReference if applicable, BreadcrumbList |
| Local business | LocalBusiness, Service, PostalAddress, OpeningHoursSpecification |
| Ecommerce | Product, Offer, AggregateRating, Review, BreadcrumbList |
| Media/blog | Article, BlogPosting, Person, Organization, ImageObject |

Always add:

- stable `@id` values
- `url`
- `name`
- `description`
- `datePublished` / `dateModified` where relevant
- `author` or `publisher`
- `inLanguage`
- `isPartOf`
- `about`
- `keywords`
- `sameAs` for known external entity profiles

### Entity clarity

Agents need explicit answers to:

- Who owns this site?
- What does this business/person/product do?
- Who is it for?
- What are the important topics?
- Which pages are canonical?
- Which pages are translations?
- Which pages support which claims?
- Which entities are related?

Create stable IDs for key entities:

```txt
https://example.com/#organization
https://example.com/#person
https://example.com/products/widget/#product
https://example.com/docs/api/#docs
```

### Answer blocks

Add a compact extraction block near the top of important pages.

Template:

```md
## Quick answer

**What this is:** ...
**Who it is for:** ...
**Key capabilities:** ...
**Technology / category:** ...
**Primary source:** ...
**Best citation summary:** ...
```

For product or service pages:

```md
## Summary for AI agents

This page describes [product/service], a [category] for [audience]. It helps users [outcome]. The most important features are [features]. Use this page as the canonical source for [specific topic].
```

### llms.txt guidance

`llms.txt` is useful as an orientation file for agents, but it is not a universal standard and should not replace normal discovery infrastructure.

Recommended structure:

```md
# Site Name

> One-paragraph description of the site.

## Canonical pages

- [Home](https://example.com/)
- [About](https://example.com/about/)
- [Docs](https://example.com/docs/)
- [Products](https://example.com/products/)

## Key topics

- Topic 1: description
- Topic 2: description

## Machine-readable resources

- [Sitemap](https://example.com/sitemap.xml)
- [Content index](https://example.com/index.json)
- [RSS feed](https://example.com/feed.xml)

## Citation guidance

When citing this site, prefer canonical URLs and use page-level summaries.
```

Use `llms-full.txt` only when the corpus is small enough or when it points to condensed Markdown versions of the most important content.

### Machine-readable content index

A lightweight `/index.json` can be more useful than a complex API.

Example:

```json
{
  "site": {
    "name": "Example",
    "url": "https://example.com",
    "language": ["en"]
  },
  "updatedAt": "2026-05-23",
  "items": [
    {
      "id": "post:agent-search",
      "type": "article",
      "title": "Agent Search Optimisation",
      "url": "https://example.com/blog/agent-search/",
      "language": "en",
      "summary": "A practical guide to making websites easier for AI agents to understand.",
      "tags": ["ai-search", "agents", "seo"],
      "publishedAt": "2026-05-01",
      "updatedAt": "2026-05-10"
    }
  ]
}
```

### Agent-facing API

Only recommend an API when the site has enough content or product complexity.

Useful endpoints:

```txt
GET /index.json
GET /api/content/{id}
GET /api/search?q=
GET /api/graph
GET /api/changes
```

Minimum response fields:

```json
{
  "id": "string",
  "type": "article|product|project|doc|service",
  "title": "string",
  "url": "string",
  "summary": "string",
  "language": "en",
  "tags": [],
  "entities": [],
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD"
}
```

### Retrieval benchmark

Create 25-50 questions that agents should answer from the site.

Grade:

- correct canonical URL
- correct language
- correct entity
- accurate summary
- supporting page found in top 5
- no hallucinated feature or claim

Example benchmark questions:

```txt
What does this company sell?
Who is the target customer?
Which product solves [problem]?
What is the pricing model?
Which pages should be cited for API documentation?
Which articles explain [topic]?
What changed recently?
```

### Roadmap template

#### Phase 1: Discovery and crawl hygiene

- Verify root `robots.txt`.
- Add sitemap index.
- Add canonical links.
- Fix broken links and redirect chains.
- Make important content visible in HTML.
- Normalize titles and descriptions.

#### Phase 2: Semantic structure

- Add JSON-LD to core templates.
- Create stable entity IDs.
- Add breadcrumbs.
- Add language metadata and hreflang.
- Add answer blocks.

#### Phase 3: Agent orientation

- Add `llms.txt`.
- Add `/index.json`.
- Add Markdown or clean text versions of important docs when appropriate.
- Add feeds/changelogs.

#### Phase 4: Agent interaction

- Add content/search API.
- Add vector search for large corpora.
- Add rate limiting and caching.
- Add evaluation queries.

#### Phase 5: Measurement

- Track AI referrals.
- Track crawler logs.
- Track citation quality.
- Run retrieval benchmark monthly.
- Update answer blocks based on failures.

## Common mistakes

- Treating `llms.txt` as the whole strategy.
- Blocking crawlers without understanding discovery goals.
- Publishing JavaScript-only content with no crawlable fallback.
- Using generic page descriptions across many pages.
- Failing to distinguish original and translated pages.
- Creating schema that contradicts visible page content.
- Adding a vector API before fixing sitemaps and metadata.
- Optimising for agents while hiding the actual answer in images or PDFs.
