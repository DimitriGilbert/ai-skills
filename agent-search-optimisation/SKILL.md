---
name: agent-search-optimisation
description: Audit and plan website optimisation for AI agents, AI search engines, answer engines, and LLM-based retrieval. Use when a user asks to optimise a website for agents, AI SEO, AEO, GEO, LLM discoverability, ChatGPT/Perplexity/Gemini visibility, llms.txt, structured data, sitemaps, or machine-readable content.
---

# Agent Search Optimisation

## Quick start

When given a website URL, produce an evidence-based optimisation plan for AI agents and AI search.

1. Crawl the public site surfaces:
   - homepage
   - robots.txt
   - sitemap.xml and sitemap index
   - llms.txt / llms-full.txt if present
   - key navigation pages
   - representative article, product, project, docs, pricing, and about pages
2. Audit agent-readiness:
   - crawlability and renderability
   - canonical URLs
   - sitemap coverage
   - structured data
   - language alternates
   - entity clarity
   - answer-oriented page summaries
   - machine-readable indexes or APIs
   - internal linking and topic hubs
3. Research current AI search best practices before making claims about current platforms.
4. Create a prioritized roadmap with:
   - quick wins
   - technical fixes
   - content changes
   - agent-facing data surfaces
   - measurement plan

## Workflow

### 1. Clarify the goal

Infer the likely goal from the user request. Ask only when necessary.

Common goals:
- increase AI answer citations
- make agents understand a product or portfolio
- expose documentation to coding agents
- improve local/business discovery in AI search
- prepare content for retrieval-augmented systems
- control AI crawler access

### 2. Collect evidence

Check these URLs where applicable:

```txt
{site}/
{site}/robots.txt
{site}/sitemap.xml
{site}/llms.txt
{site}/llms-full.txt
{site}/.well-known/
```

Also inspect at least 5 representative pages when the site has enough content:
- homepage
- about/company/profile page
- main collection/archive page
- one detail page
- one recent article/docs page

### 3. Score the site

Use a 0-3 score for each area:

| Area | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Crawlability | blocked/broken | partially crawlable | mostly crawlable | clean HTML + clear policy |
| Discovery | no sitemap | partial sitemap | complete sitemap | sitemap index + freshness |
| Structured data | none | basic metadata | JSON-LD on some templates | complete schema graph |
| Entity clarity | vague | some entities | clear entities | entity graph + IDs |
| Content extractability | thin/visual | prose only | summaries present | answer blocks + JSON |
| Language/canonicals | absent | inconsistent | mostly correct | canonical + hreflang complete |
| Agent surface | none | llms.txt only | index/feed | API/search/content endpoints |
| Measurement | none | traffic only | search console | AI/retrieval benchmark |

### 4. Recommend changes

Prioritize in this order unless the site context suggests otherwise:

1. Fix public crawl/discovery basics.
2. Add canonical URLs, metadata, and language alternates.
3. Add JSON-LD and entity IDs.
4. Add answer-oriented summaries to important pages.
5. Add topic hubs and internal links.
6. Add llms.txt as an orientation layer.
7. Add machine-readable content index.
8. Add semantic search/API only when the corpus is large enough.
9. Add measurement and recurring evaluation.

### 5. Deliver the plan

Structure the final answer as:

1. Executive summary
2. What I checked
3. Current strengths
4. Gaps and risks
5. Prioritized roadmap
6. Implementation details
7. Measurement plan
8. Open questions / assumptions

## Output rules

- Do not claim a file or feature exists unless verified.
- Mark unverified items clearly.
- Prefer durable web standards over hype.
- Treat `llms.txt` as additive, not a replacement for HTML, sitemaps, metadata, or structured data.
- Separate discovery from access control; robots.txt is not security.
- Include concrete examples when possible.
- Keep recommendations implementation-ready.
- Use current web research for AI search platform behavior, crawler policies, and new conventions.
- If the user provides a private repo or codebase, inspect implementation before suggesting exact code changes.

## Advanced features

See [REFERENCE.md](REFERENCE.md) for audit criteria, schema recommendations, `llms.txt` guidance, roadmap templates, and API examples.

See [EXAMPLES.md](EXAMPLES.md) for output examples and reusable prompts.

Use [scripts/audit-agent-readiness.mjs](scripts/audit-agent-readiness.mjs) for a lightweight first-pass technical audit.
