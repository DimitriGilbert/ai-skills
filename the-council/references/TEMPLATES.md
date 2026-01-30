# Councillor Templates

This document provides ready-to-use templates for councillor analyses and common specialist profiles.

**Format Version:** 1.0

## Standard Councillor Template

Use this format for all councillor analyses:

```markdown
# [Specialist Name] - Council Analysis

## Session Information
- **Session ID:** [session-id]
- **Question:** [Full question being analyzed]
- **Specialization:** [Your domain of expertise]
- **Format Version:** 1.0

---

## Executive Summary
**Position:** [Support / Oppose / Conditional / Needs More Information]

**One-sentence verdict:** [Clear statement of your position]

---

## Detailed Analysis

### Understanding the Question
[Restate the question in your own words to ensure understanding]

### Domain Perspective
[Analyze from your specialist's point of view]

### Key Considerations
- **Consideration 1:** [Analysis]
- **Consideration 2:** [Analysis]
- **Consideration 3:** [Analysis]

### Risks Identified
[What could go wrong from your domain's perspective?]

### Benefits Expected
[What benefits do you anticipate?]

---

## Evidence & Research

### Sources Consulted

#### Primary Sources
- **[Source Type]:** [Name] - [URL]
  - Key finding: [What this source reveals]
  - Relevance: [How it applies to the question]

- **Context7:** [library-name]
  - Query: [search query used]
  - Key finding: [Relevant information from docs]

- **Web Search:** [search query]
  - URL: [link to relevant result]
  - Key finding: [What was learned]

#### Secondary Sources
- [Additional sources as needed]

### Research Notes
[Any additional context from your research]

### Conflicting Evidence
[Note if sources disagree on key points]

---

## Artifacts Analyzed

### [Artifact Type: e.g., Code File / PR / Documentation]
**Path/URL:** [location]
**Analysis:**
- [Specific findings from this artifact]
- [Relevance to the question]
- [Any concerns or issues identified]

[Repeat for each artifact]

---

## Recommendations

### Primary Recommendation
[What you recommend, clearly stated]

### Implementation Considerations
[If your recommendation is adopted, what should be considered?]

### Alternative Approaches
[If your primary recommendation isn't feasible, what are the alternatives?]

---

## Confidence Level

**Overall Confidence:** [High / Medium / Low]

**Confidence Rationale:**
- [Why you are/aren't confident in this analysis]
- [What would increase confidence]

### Uncertainties
[What aspects remain uncertain and why]

---

## Open Questions

[Any aspects that require further investigation or clarification from the requester]

---

## Related Skills Used
- **[Skill name]:** [How it helped with analysis]

---

## Councillor Metadata
- **Analysis completed:** [timestamp]
- **Tools used:** [Context7, WebSearch, specific skills, etc.]
- **Self-assessment:** [Brief note on analysis quality/limitations]
```

## Concise Councillor Template

For simpler questions, use this streamlined format:

```markdown
# [Specialist Name] - Analysis

## Position
[Support / Oppose / Conditional]

## Key Findings
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

## Evidence
- **[Source]:** [URL] - [Key finding]
- **[Source]:** [URL] - [Key finding]

## Recommendation
[What you recommend]

## Confidence
[High/Medium/Low] - [Brief rationale]

## Notes
[Any additional context]
```

## Specialist Profile Templates

### Security Analyst

```markdown
# Security Analyst - Council Analysis

[Use standard template, adding:]

## Security Analysis

### Threat Model
- [Who are the potential attackers?]
- [What are the attack vectors?]
- [What is the impact of a breach?]

### Vulnerability Assessment
- [Known vulnerabilities in the approach]
- [OWASP Top 10 considerations]
- [Security best practices compliance]

### Mitigation Strategies
- [How to address identified security concerns]
- [Defense in depth approach]

### Security References
- OWASP: [Specific areas]
- NIST: [Relevant guidelines]
- CVE database: [Related vulnerabilities]
```

### Performance Engineer

```markdown
# Performance Engineer - Council Analysis

[Use standard template, adding:]

## Performance Analysis

### Performance Characteristics
- **Latency:** [Expected/observed]
- **Throughput:** [Expected/observed]
- **Resource usage:** [CPU, memory, I/O expectations]

### Bottlenecks Identified
- [Bottleneck 1]: [Impact and mitigation]
- [Bottleneck 2]: [Impact and mitigation]

### Scalability Assessment
- [How does this approach scale?]
- [Scaling limits and considerations]

### Performance Testing Recommendations
- [What should be tested and how]

### Performance References
- [Relevant performance benchmarks]
- [Industry standards for similar systems]
```

### UX/User Experience Specialist

```markdown
# UX Specialist - Council Analysis

[Use standard template, adding:]

## User Experience Analysis

### User Impact
- **Affected users:** [Who is impacted?]
- **User journey impact:** [How does this affect their workflow?]
- **Cognitive load:** [Complexity introduced]

### Accessibility Considerations
- [WCAG compliance: which levels and criteria]
- [Screen reader compatibility]
- [Keyboard navigation]

### Usability Assessment
- **Learnability:** [How easy to understand?]
- **Efficiency:** [Does it improve or hinder efficiency?]
- **Error prevention:** [How are errors prevented?]

### User Research Evidence
- [Relevant UX research findings]
- [Industry best practices]

### Recommendations
- [UX-specific recommendations]
```

### Backend Architect

```markdown
# Backend Architect - Council Analysis

[Use standard template, adding:]

## Architecture Analysis

### System Design
- **Architectural pattern:** [What pattern is used?]
- **Coupling:** [Tight/loose coupling implications]
- **Cohesion:** [How well are responsibilities organized?]

### Maintainability Assessment
- **Code organization:** [Clarity and structure]
- **Technical debt:** [What debt is introduced?]
- **Testability:** [How testable is this approach?]

### Data Considerations
- **Data consistency:** [Strong/eventual consistency needs]
- **Data migration:** [Migration complexity if applicable]
- **Data modeling:** [Appropriateness of data structure]

### Integration Points
- **External dependencies:** [What services/systems are depended on?]
- **API contracts:** [Interface definitions and stability]

### Implementation Complexity
- **Development effort:** [Estimated complexity]
- **Deployment complexity:** [What's needed for production?]
```

### DevOps/SRE Specialist

```markdown
# DevOps Specialist - Council Analysis

[Use standard template, adding:]

## Operations Analysis

### Deployment Considerations
- **Deployment strategy:** [Blue-green, canary, rolling, etc.]
- **Infrastructure requirements:** [What's needed?]
- **Configuration management:** [How is config managed?]

### Observability
- **Monitoring:** [What needs to be monitored?]
- **Logging:** [Log strategy and requirements]
- **Alerting:** [What conditions need alerts?]
- **Tracing:** [Distributed tracing needs]

### Reliability Assessment
- **SLO/SLA implications:** [How does this affect reliability targets?]
- **Failure modes:** [What can fail and what happens?]
- **Recovery procedures:** [How to recover from failures]

### Operational Burden
- **Day-to-day operations:** [What does this add to ops workload?]
- **On-call impact:** [Does this increase on-call burden?]
- **Runbook requirements:** [What procedures need documentation?]

### Cost Analysis
- **Infrastructure costs:** [Expected cost impact]
- **Operational costs:** [Time/effort requirements]
```

### Business Analyst

```markdown
# Business Analyst - Council Analysis

[Use standard template, adding:]

## Business Analysis

### Value Proposition
- **Business value:** [What value does this create?]
- **ROI assessment:** [Return on investment considerations]
- **Cost-benefit analysis:** [Are benefits worth the costs?]

### Market Considerations
- **Competitive landscape:** [How does this compare to alternatives?]
- **Market timing:** [Is this the right time?]
- **Customer demand:** [Is there evidence of user need?]

### Risk Assessment
- **Business risks:** [What business risks exist?]
- **Mitigation strategies:** [How to address business risks]
- **Contingency plans:** [What if this doesn't work?]

### Stakeholder Impact
- **Affected stakeholders:** [Who is impacted?]
- **Stakeholder concerns:** [What might stakeholders worry about?]

### Success Metrics
- **KPIs:** [What metrics indicate success?]
- **Measurement approach:** [How will success be measured?]
```

## Template Selection Guide

| Question Type | Recommended Template |
|---------------|---------------------|
| Security-sensitive decisions | Security Analyst template |
| Performance-critical decisions | Performance Engineer template |
| User-facing changes | UX Specialist template |
| Architecture/design decisions | Backend Architect template |
| Infrastructure changes | DevOps Specialist template |
| Product/feature decisions | Business Analyst template |
| Simple questions | Concise template |
| Complex/multi-domain questions | Standard template + specialist add-ons |

## Usage Tips

1. **Always cite sources:** Even for internal analysis, note where information comes from
2. **Be specific about confidence:** Distinguish between "I'm certain" and "I think likely"
3. **Acknowledge limitations:** What don't you know? What would improve the analysis?
4. **Use tools proactively:** Don't just rely on existing knowledge - research!
5. **Reference skills used:** If you used another skill, note it - helps with traceability

## Outcome Templates

Use these templates when presenting council decisions to users.

### Consensus Decision Template

```markdown
# Council Decision: [Title]

## Summary
**Decision:** [Clear statement of the decision]
**Confidence:** [High/Medium/Low]
**Consensus Level:** Unanimous / Strong / Weak

## Council Composition
- [Specialist 1]: [Domain]
- [Specialist 2]: [Domain]
- [Specialist 3]: [Domain]

## Key Findings
1. [Finding 1 - supported by which councillors]
2. [Finding 2 - supported by which councillors]
3. [Finding 3 - supported by which councillors]

## Rationale
[Why this decision was reached, summarizing councillor analyses]

## Trade-offs Accepted
- [Trade-off 1]: [What was sacrificed and why it's acceptable]
- [Trade-off 2]: [What was sacrificed and why it's acceptable]

## Implementation Notes
[Key considerations for implementing this decision]

## What Would Change This Decision
- [Condition 1 that would warrant reconsideration]
- [Condition 2 that would warrant reconsideration]
```

### Divergent Views Template

```markdown
# Council Analysis: [Title]

## Summary
The council could not reach consensus. Below are the positions with supporting evidence.

## Areas of Agreement
[Where councillors did agree]

## Position A: [Name]
**Advocates:** [Councillors supporting this]
**Summary:** [One-sentence summary]

### Key Arguments
1. [Argument with evidence]
2. [Argument with evidence]

### Best When
[Conditions where this position is preferable]

## Position B: [Name]
**Advocates:** [Councillors supporting this]
**Summary:** [One-sentence summary]

### Key Arguments
1. [Argument with evidence]
2. [Argument with evidence]

### Best When
[Conditions where this position is preferable]

## Chair's Recommendation
**Recommended:** [Position A / Position B / Hybrid / Defer]

**Rationale:**
[Why this recommendation despite the disagreement]

**If choosing differently:**
[What would make the other position preferable]
```

### Conditional Recommendation Template

```markdown
# Council Recommendation: [Title]

## Summary
**Recommendation:** [Action] IF [condition], OTHERWISE [alternative action]

## Council Composition
[List of specialists]

## Conditional Analysis

### If [Condition A]
**Recommendation:** [Action A]
**Rationale:** [Why this makes sense under condition A]
**Supported by:** [Councillors]

### If [Condition B]
**Recommendation:** [Action B]
**Rationale:** [Why this makes sense under condition B]
**Supported by:** [Councillors]

## How to Determine Which Condition Applies
[Guidance for the user on how to assess their situation]

## Questions to Answer
- [ ] [Question 1 to determine condition]
- [ ] [Question 2 to determine condition]

## Default Recommendation
If conditions are unclear: [Default action with rationale]
```
