# Skill Pattern Analysis

Analysis of existing skill files to identify patterns, best practices, and templates for creating new Convex skills.

**Analyzing Files:**
- `/home/didi/workspace/Code/skills/gh-profile/SKILL.md` (1,260 lines)
- `/home/didi/workspace/Code/skills/anthropic-frontend-design/SKILL.md` (43 lines)

**Date:** January 17, 2026

---

## 1. YAML Frontmatter Structure

### Required Fields
All skills MUST include YAML frontmatter with these fields:

```yaml
---
name: skill-name
description: Clear, actionable description of when to use this skill
license: LICENSE_TYPE or "Complete terms in LICENSE.txt"
---
```

### Field Analysis

#### `name` Field
- **Format:** Lowercase, hyphenated (e.g., `gh-profile`, `frontend-design`)
- **Purpose:** Unique identifier for the skill
- **Best Practice:** Short, memorable, reflects the skill's domain

#### `description` Field
- **Format:** Single paragraph (no line breaks within the description)
- **Key Components:**
  1. **What it does:** "Create distinctive, production-grade..."
  2. **When to use it:** "Use this skill when the user asks to..."
  3. **Specific examples:** "(examples include websites, landing pages, dashboards...)"
  4. **Key differentiator:** "Generates creative, polished code that avoids generic AI aesthetics."

- **Best Practice Pattern:**
  ```
  [Action verb] [what it creates] [quality level].
  Use this skill when [trigger conditions].
  [Examples/scope].
  [Unique value proposition/differentiator].
  ```

#### `license` Field
- **Options:**
  - `MIT` (direct reference)
  - `Apache-2.0`
  - `Complete terms in LICENSE.txt` (reference to separate file)
- **Best Practice:** Use standard SPDX identifiers or reference external file

---

## 2. Content Organization Patterns

### Pattern 1: Comprehensive Guide (gh-profile)
**Structure:** 1,260 lines of exhaustive documentation
**Approach:** Encyclopedia-style reference
**Best For:** Complex technical domains with many components

**Organization:**
```
1. Introduction paragraph
2. "What Users Want" section
3. "What You Provide" section
4. Understanding the Domain
5. Trends & Best Practices
6. How to Help Users (with skill levels)
7. Component Reference Guide (extensive code examples)
8. Specialized Topics (Achievements, AI, Security)
9. Templates (ready-to-use)
10. Troubleshooting
11. Generator Tools
12. Inspiration & Resources
13. Advanced Automation
14. Your Approach (philosophy)
15. Quick Start Commands
```

### Pattern 2: Focused Guide (frontend-design)
**Structure:** 43 lines of essential guidance
**Approach:** Philosophy + guidelines
**Best For:** Creative/subjective domains where flexibility is key

**Organization:**
```
1. Introduction paragraph
2. Design Thinking (process/philosophy)
3. Frontend Aesthetics Guidelines (principles + anti-patterns)
```

---

## 3. "What Users Want" vs "What You Provide" Pattern

### Section Structure

#### "What Users Want" Section
**Purpose:** Help the AI identify when users need this skill

**Pattern:**
```markdown
# What Users Want

Users typically want help with [DOMAIN] when they:
- [Goal 1 - what they're trying to achieve]
- [Goal 2 - problem they're solving]
- [Goal 3 - outcome they desire]
- [Goal 4 - specific feature they need]
- [Goal 5 - integration they want]
```

**Example from gh-profile:**
```markdown
Users typically want help with GitHub profile customization when they:
- Want to stand out to recruiters and collaborators
- Need to showcase their skills, projects, and achievements
- Want to add dynamic stats cards, streaks, and visualizations
- Are looking for automation with GitHub Actions
- Need inspiration from templates and examples
```

**Best Practices:**
- Start with "Users typically want help with [domain] when they:"
- Use bullet points with action verbs
- Focus on user goals/problems, not technical solutions
- Include specific, concrete examples
- Cover different use cases (beginner to advanced)

#### "What You Provide" Section
**Purpose:** Define the scope and capabilities of the skill

**Pattern:**
```markdown
# What You Provide

You provide comprehensive [DOMAIN] guidance, including:
- [Capability 1]
- [Capability 2]
- [Capability 3]
- ...
- [Advanced capability N]
```

**Example from gh-profile:**
```markdown
You provide comprehensive GitHub profile customization guidance, including:
- Complete profile README creation from scratch
- Theme selection and customization (dracula, radical, tokyonight...)
- Stats cards and metrics (GitHub Stats, Streak Stats, Top Languages...)
- GitHub Actions automation for dynamic content
- Advanced automation with Python scripts and GraphQL
- Best practices for performance, security, and accessibility
```

**Best Practices:**
- Start with "You provide comprehensive [domain] guidance, including:"
- Use bullet points
- Group related capabilities
- Order from basic to advanced
- Be specific about tools/services covered
- Include both "how-to" and "best practices"

---

## 4. Section Structures and Headings

### Heading Hierarchy Pattern

```markdown
# Main Level 1 (used 2-3 times total)
  ## Level 2 (major sections)
    ### Level 3 (subsections)
      #### Level 4 (rare, only for detailed breakdowns)
```

### Common Level 1 Headings

Both skills use these strategic L1 headings:
- `# What Users Want` - User intent identification
- `# What You Provide` - Skill capability definition
- `# Understanding [Domain]` - Foundational knowledge
- `# Templates` - Ready-to-use examples
- `# Common Issues & Solutions` - Troubleshooting

### Common Level 2 Headings

- `## Initial Assessment` - How to start helping
- `## Step-by-Step Guidance` - Process instructions
- `## Quick Start` - Fast path for beginners
- `## Component Reference` - Detailed component docs
- `## Best Practices` - Recommendations
- `## Advanced [Topic]` - Deep dives for experts

---

## 5. Code Example Formatting

### Code Block Patterns

#### 1. Basic Code Blocks with Context
```markdown
### Component Name

**File:** `path/to/file.ext`

```markdown
[Code here]
```

**Parameters Explained:**
- `param1` - Description
- `param2` - Description
```

#### 2. Before/After Comparisons (for security/best practices)
```markdown
**BAD:**
```yaml
[Dangerous code]
```

**GOOD:**
```yaml
[Safe code]
```
```

#### 3. Multi-File Examples
```markdown
**File:** `.github/workflows/file.yml`
```yaml
[Workflow code]
```

**In README.md:**
```markdown
[Usage code]
```
```

#### 4. Copy-Paste Ready Templates
```markdown
Copy this entire block and paste it into your README.md:

```markdown
[Complete ready-to-use template]
```
```

### Code Example Best Practices

1. **Always specify language** in fenced code blocks (```markdown, ```yaml, ```python)
2. **Provide file paths** when code goes in specific files
3. **Explain parameters** after the code block
4. **Use placeholder values** that are obvious (YOUR_USERNAME, YOUR_TOKEN)
5. **Include comments** in code for clarity
6. **Provide complete examples** (not snippets that need context)
7. **Show multiple variations** when applicable (themes, configurations)

---

## 6. Use of Templates

### Template Section Structure

```markdown
# Templates

## [Template Name] Template

```markdown
[Complete, copy-paste ready template]
```

**When to use:** [Use case description]
**Customization tips:** [What to modify]
```

### Template Categories

#### 1. Beginner-Friendly Templates
- Minimal structure
- Clear comments
- Obvious placeholders
- Immediate visual results

#### 2. Role-Specific Templates
- Recruitment-optimized
- Student/Junior
- Open Source Contributor
- Enterprise/Professional

#### 3. Style-Based Templates
- Minimalist
- Creative/Artistic
- Themed (Dracula, Tokyo Night)
- Storytelling/Timeline

### Template Best Practices

1. **Complete and working** - templates should run as-is (with placeholder replacement)
2. **Well-commented** - explain what each section does
3. **Modular** - easy to add/remove sections
4. **Responsive** - work on mobile/desktop
5. **Accessible** - follow WCAG guidelines
6. **Themed consistently** - matching colors, fonts, spacing

---

## 7. Troubleshooting Sections

### Structure Pattern

```markdown
# Common Issues & Solutions

## [Problem Name]

**Problem:** [Clear description of what goes wrong]

**Solutions:**
1. [Solution 1 - most likely]
2. [Solution 2 - next most likely]
3. [Solution 3 - edge case]

**Prevention:** [How to avoid this issue in the future]
```

### Troubleshooting Categories

1. **Setup Issues** - Initial installation/configuration problems
2. **Display Issues** - Visual/rendering problems
3. **Performance Issues** - Speed, loading, optimization
4. **Integration Issues** - Third-party service problems
5. **Security Issues** - Vulnerabilities, exposure

### Best Practices

- **Problem-first structure** - state the problem clearly before solutions
- **Multiple solutions** - offer 3-5 solutions ordered by likelihood
- **Actionable steps** - specific commands or actions, not vague advice
- **Prevention tips** - how to avoid the issue
- **Cross-references** - link to related sections

---

## 8. Quick Start Guides

### Three-Tier Quick Start Pattern

```markdown
# Quick Start Commands

```markdown
# Basic [X] (5 minutes)
1. [First step]
2. [Second step]
3. [Third step]

# Enhanced [X] (15 minutes)
4. [Fourth step]
5. [Fifth step]
6. [Sixth step]

# Advanced [X] (1 hour)
7. [Complex step]
8. [Advanced step]
9. [Expert step]
```
```

### Alternative: Single Quick Start Section

```markdown
## Quick Start: Your First [X] in 5 Minutes

**Step 1: [Action]**
[Detailed instructions]

**Step 2: [Action]**
[Detailed instructions]

**Step 3: [Action]**
[Detailed instructions]

**That's it!** You now have [working result].
```

### Quick Start Best Practices

1. **Time estimates** - set clear expectations (5 min, 15 min, 1 hour)
2. **Minimal prerequisites** - assume lowest reasonable skill level
3. **Immediate results** - first steps should produce visible output
4. **Clear success criteria** - how users know it worked
5. **Next steps** - what to do after quick start

---

## 9. Handling Different Skill Levels

### Level-Based Sections Pattern

```markdown
## For Complete Beginners (No Experience Yet)

### Quick Start: Your First [X] in 5 Minutes
[Step-by-step with hand-holding]

### ✅ Setup Checklist
[Verification steps]

## For Beginners Wanting Enhancement
[Add features one at a time]

## For Intermediate Users (Existing [X], Want Enhancement)
[Build on existing foundation]

## For Advanced Users (Want Automation & Customization)
[Deep technical content]
```

### Level-Appropriate Content

#### Beginner Level
- **Focus:** Quick wins, visible results
- **Detail:** Step-by-step, hand-holding
- **Prerequisites:** Minimal
- **Tools:** Generators, templates, GUIs
- **Examples:** Complete copy-paste solutions
- **Troubleshooting:** Common issues with simple fixes

#### Intermediate Level
- **Focus:** Customization, best practices
- **Detail:** Explain why, not just how
- **Prerequisites:** Basic familiarity
- **Tools:** Manual editing, some automation
- **Examples:** Modular components
- **Troubleshooting:** Diagnostic approaches

#### Advanced Level
- **Focus:** Optimization, automation, architecture
- **Detail:** Deep dives, edge cases, internals
- **Prerequisites:** Strong domain knowledge
- **Tools:** Scripts, APIs, workflows, custom solutions
- **Examples:** Patterns, frameworks, advanced techniques
- **Troubleshooting:** Root cause analysis

### Skill Level Indicators

Use clear section headers:
- "For Complete Beginners"
- "For Beginners Wanting Enhancement"
- "For Intermediate Users"
- "For Advanced Users"

Or use diagnostic questions:
- "If you have no [X] yet:"
- "If you have an existing [X]:"
- "For customization goals:"

---

## 10. Common Structural Patterns

### Pattern A: Comprehensive Reference (gh-profile style)

**Best For:** Technical domains with many components, tools, and use cases

**Structure:**
1. YAML Frontmatter
2. Introduction paragraph (2-3 sentences)
3. What Users Want
4. What You Provide
5. Understanding the Domain (What/Why/How it works)
6. Trends & Best Practices (Current state of the art)
7. How to Help Users (Initial assessment + level-based guidance)
8. Component Reference Guide (Extensive code examples with parameters)
9. Specialized Topics (Deep dives on specific features)
10. Templates (Ready-to-use examples)
11. Common Issues & Solutions (Troubleshooting)
12. Tools & Resources (External links, generators)
13. Advanced Automation (For power users)
14. Your Approach (Philosophy/strategy)
15. Quick Start Commands (Fast paths)

**Length:** 1,000-1,500+ lines

### Pattern B: Focused Guide (frontend-design style)

**Best For:** Creative/subjective domains, philosophy-driven skills

**Structure:**
1. YAML Frontmatter
2. Introduction paragraph (1-2 sentences)
3. Design Thinking / Philosophy (Process & mindset)
4. Guidelines (Principles + anti-patterns)
5. Execution notes (Implementation guidance)

**Length:** 40-100 lines

### Pattern C: Balanced Approach (Hybrid)

**Best For:** Most technical skills

**Structure:**
1. YAML Frontmatter
2. Introduction (2-3 sentences)
3. What Users Want
4. What You Provide
5. Quick Start (Immediate value)
6. Level-Based Guidance (Beginner → Advanced)
7. Core Concepts (Understanding)
8. Component Reference (Code examples)
9. Best Practices (Recommendations)
10. Templates (Ready-to-use)
11. Troubleshooting (Problem-solving)
12. Resources (External links)

**Length:** 300-600 lines

---

## 11. Best Practices Observed

### Content Quality

1. **Be Specific, Not Generic**
   - ✅ "Add GitHub Stats Card with dracula theme"
   - ❌ "Add statistics"

2. **Provide Complete Examples**
   - Include all necessary code, not snippets
   - Show file paths
   - Explain all parameters

3. **Anticipate Problems**
   - Proactive troubleshooting sections
   - Common pitfalls highlighted
   - Security considerations

4. **Respect User's Skill Level**
   - Multiple paths for different experience levels
   - Don't overwhelm beginners with advanced topics
   - Don't bore experts with basics

5. **Use Formatting Effectively**
   - Bold for emphasis
   - Code blocks for technical content
   - Lists for options/steps
   - Headers for scannability

### Structure & Navigation

1. **Logical Flow**
   - Start with user intent (What Users Want)
   - Define capabilities (What You Provide)
   - Provide quick wins (Quick Start)
   - Deep dive progressively (Beginner → Advanced)

2. **Scannable Headers**
   - Clear hierarchy (H1 → H2 → H3)
   - Action-oriented titles ("How to Help Users")
   - Specific topic labels ("GitHub Actions Cron Reference")

3. **Cross-References**
   - Link between related sections
   - Reference earlier content
   - Point to external resources

4. **Multiple Entry Points**
   - Quick start for impatient users
   - Comprehensive reference for detail-oriented users
   - Templates for copy-paste users

### Code & Examples

1. **Copy-Paste Ready**
   - Complete, working examples
   - Clear placeholders (YOUR_USERNAME)
   - Include necessary boilerplate

2. **Explain Parameters**
   - List all parameters after code blocks
   - Show examples of different values
   - Mention required vs optional

3. **Multiple Variations**
   - Show different themes/configurations
   - Provide simple and complex examples
   - Cover common use cases

4. **File Context**
   - Always specify file paths
   - Show multi-file workflows
   - Explain file relationships

### Tone & Voice

1. **Direct and Actionable**
   - ✅ "Create a repository named `YOUR_USERNAME`"
   - ❌ "You might want to consider creating..."

2. **Encouraging but Realistic**
   - Set clear expectations
   - Acknowledge complexity
   - Celebrate progress

3. **Professional Yet Accessible**
   - Clear explanations
   - Industry terminology defined
   - Assume intelligence, not prior knowledge

---

## 12. Recommended Section Templates

### Section Template: What Users Want

```markdown
# What Users Want

Users typically want help with [DOMAIN] when they:
- [Primary goal - what they're trying to achieve]
- [Secondary goal - specific outcome they desire]
- [Common problem - pain point they're experiencing]
- [Integration need - connecting with other tools/services]
- [Learning goal - skill they want to develop]
```

### Section Template: What You Provide

```markdown
# What You Provide

You provide comprehensive [DOMAIN] guidance, including:
- [Core capability 1 - fundamental feature]
- [Core capability 2 - essential functionality]
- [Advanced capability 1 - intermediate feature]
- [Advanced capability 2 - expert-level feature]
- [Best practice area 1 - optimization/security/performance]
- [Best practice area 2 - maintenance/scalability]
- [Troubleshooting - problem-solving assistance]
```

### Section Template: Quick Start

```markdown
## Quick Start: Your First [X] in 5 Minutes

**Step 1: [Action Name]**
[Concrete instruction with command/code]

**Step 2: [Action Name]**
[Concrete instruction with command/code]

**Step 3: [Action Name]**
[Concrete instruction with command/code]

**Step 4: Verify**
[How to confirm it works]

**That's it!** You now have [basic working result]. Ready to level up? Continue below.

#### ✅ Setup Checklist

Before moving forward, verify:
- [ ] [Verification 1 - specific check]
- [ ] [Verification 2 - specific check]
- [ ] [Verification 3 - specific check]

Not seeing expected results? See [Troubleshooting](#troubleshooting)
```

### Section Template: Component Reference

```markdown
## [Component Category]

### [Component Name] - [Brief Description]

```markdown
[Complete, working code example]
```

**Parameters Explained:**
- `param1` (required) - [What it does]
- `param2` (optional) - [What it does, default value]
- `param3` (optional) - [What it does, options]

**Common Variations:**

```markdown
# Option 1: [Variation name]
[Code for option 1]

# Option 2: [Variation name]
[Code for option 2]
```

**When to Use:** [Use case description]
**Best Practices:** [Recommendations]
```

### Section Template: Troubleshooting

```markdown
## [Problem Name]

**Problem:** [Clear description of what goes wrong, symptoms users see]

**Solutions:**
1. **[Most likely cause]**
   - [Action to take]
   - [How to verify fix]

2. **[Second most likely cause]**
   - [Action to take]
   - [How to verify fix]

3. **[Edge case or advanced issue]**
   - [Action to take]
   - [How to verify fix]

**Prevention:** [How to avoid this issue in the future]

**Still having issues?** Check [Related Section](#link) or [External Resource](url)
```

### Section Template: Level-Based Guidance

```markdown
## For Complete Beginners (No [X] Yet)

### Quick Start: Your First [X] in 5 Minutes

[Step-by-step guide with hand-holding]

#### ✅ Setup Checklist

- [ ] [Check 1]
- [ ] [Check 2]
- [ ] [Check 3]

## For Beginners Wanting Enhancement

Once you have [basic X], add these features one at a time:

```markdown
1. [Feature 1] - [What it does]
2. [Feature 2] - [What it does]
3. [Feature 3] - [What it does]
```

## For Intermediate Users (Existing [X], Want Enhancement)

```markdown
1. [Advanced feature 1]
2. [Advanced feature 2]
3. [Advanced feature 3]
```

## For Advanced Users (Want Automation & Customization)

```markdown
1. Set up [automation mechanism]
   - [Detail 1]
   - [Detail 2]
   - [Detail 3]

2. Create custom [scripts/solutions]
   - [Detail 1]
   - [Detail 2]

3. Optimize [performance/security]
   - [Detail 1]
   - [Detail 2]
```
```

---

## 13. Skill Creation Template

Use this template as a starting point for new skills. Adapt the structure based on complexity and domain.

```markdown
---
name: skill-name
description: [Action verb] [what it creates] [quality level]. Use this skill when [trigger conditions]. [Examples/scope]. [Unique value proposition].
license: MIT
---

[2-3 sentence introduction that explains what this skill does and its value proposition.]

# What Users Want

Users typically want help with [DOMAIN] when they:
- [Primary goal - what they're trying to achieve]
- [Secondary goal - specific outcome]
- [Common problem - pain point]
- [Integration need - connecting tools]
- [Learning goal - skill development]

# What You Provide

You provide comprehensive [DOMAIN] guidance, including:
- [Core capability 1]
- [Core capability 2]
- [Advanced capability 1]
- [Advanced capability 2]
- [Best practices - optimization/security/performance]
- [Troubleshooting assistance]

# Understanding [DOMAIN]

## What is [X]?

[Brief explanation of the technology/domain - what it is, why it exists]

### Why Use [X]?

[Benefits and use cases - clear value proposition]

### How It Works

[High-level explanation of the mechanism - enough to understand, not overwhelming]

### Important Notes

- [Critical requirement 1]
- [Critical requirement 2]
- [Common pitfall to avoid]

# Quick Start: Your First [X] in 5 Minutes

**Step 1: [Action]**
[Concrete instruction with command/code]

**Step 2: [Action]**
[Concrete instruction with command/code]

**Step 3: [Action]**
[Concrete instruction with command/code]

**Step 4: Verify**
[How to confirm it works]

**That's it!** You now have [basic working result]. Ready to level up? Continue below.

#### ✅ Setup Checklist

Before moving forward, verify:
- [ ] [Verification 1]
- [ ] [Verification 2]
- [ ] [Verification 3]

Not seeing expected results? See [Troubleshooting](#common-issues--solutions)

# How to Help Users

## Initial Assessment

When a user requests help, first understand their needs:

1. **Current Status**: Do they have [X] already? What's their setup?
2. **Goals**: What are they trying to achieve?
3. **Style Preference**: [Option 1], [Option 2], [Option 3]?
4. **Technical Comfort**: Beginner needing guidance, or advanced wanting customization?
5. **Key Features**: What specific features do they need?

### Quick Diagnostic Questions

**If they have no [X] yet:**
- [Question 1]
- [Question 2]

**If they have existing [X]:**
- [Question 1]
- [Question 2]

**For customization goals:**
- [Question 1]
- [Question 2]

## Step-by-Step Guidance

### For Complete Beginners (No [X] Yet)

[Quick Start content from above, or reference it]

### For Beginners Wanting Enhancement

Once you have basic [X], add these features one at a time:

```markdown
1. [Feature 1] - [What it does]
2. [Feature 2] - [What it does]
3. [Feature 3] - [What it does]
```

### For Intermediate Users (Existing [X], Want Enhancement)

```markdown
1. [Advanced feature 1]
2. [Advanced feature 2]
3. [Advanced feature 3]
```

### For Advanced Users (Want Automation & Customization)

```markdown
1. Set up [automation mechanism]
   - [Detail 1]
   - [Detail 2]
   - [Detail 3]

2. Create custom [solutions]
   - [Detail 1]
   - [Detail 2]

3. Optimize [aspect]
   - [Detail 1]
   - [Detail 2]
```

# Component Reference Guide

All code snippets below go in [location] unless otherwise specified.

## [Component Category 1]

### [Component Name] - [Brief description]

```markdown
[Complete, working code example]
```

**Parameters Explained:**
- `param1` (required) - [What it does]
- `param2` (optional) - [What it does, default: value]
- `param3` (optional) - [What it does, options: a, b, c]

**Common Variations:**

```markdown
# Option 1: [Variation name]
[Code]

# Option 2: [Variation name]
[Code]
```

## [Component Category 2]

[Repeat pattern for each major component]

# Best Practices

## [Best Practice Area 1]

1. **[Practice Name]**
   - [Explanation]
   - [Example]

2. **[Practice Name]**
   - [Explanation]
   - [Example]

## [Best Practice Area 2]

[Continue pattern]

# Templates

## [Template Name] Template

```markdown
[Complete, copy-paste ready template]
```

**When to use:** [Use case]
**Customization tips:** [What to modify]

## [Another Template]

[Continue pattern for 2-3 templates]

# Common Issues & Solutions

## [Problem Name]

**Problem:** [Clear description of symptoms]

**Solutions:**
1. **[Most likely cause]**
   - [Action to take]
   - [How to verify]

2. **[Second cause]**
   - [Action to take]
   - [How to verify]

**Prevention:** [How to avoid]

# Tools & Resources

## [Tool Category]

1. **[Tool Name]** ⭐ [Rating/Status]
   - Web: [URL]
   - [What it does]
   - [When to use it]

# Your Approach

When helping users with [DOMAIN]:

1. **[Principle 1]**: [Explanation]
2. **[Principle 2]**: [Explanation]
3. **[Principle 3]**: [Explanation]

Remember: [Core philosophy/vision]

# Quick Reference

```markdown
# Basic [X] (5 minutes)
1. [Step 1]
2. [Step 2]
3. [Step 3]

# Enhanced [X] (15 minutes)
4. [Step 4]
5. [Step 5]
6. [Step 6]

# Advanced [X] (1 hour)
7. [Complex step]
8. [Advanced step]
9. [Expert step]
```
```

---

## 14. Anti-Patterns to Avoid

### Content Anti-Patterns

❌ **Too Vague**
```markdown
## Add Features
You can add various features to your profile.
```
✅ **Specific**
```markdown
## Add Stats Cards
Display your GitHub contributions, stars, and forks with a stats card.
```

❌ **Incomplete Examples**
```markdown
Add this to your README:
`![Stats](URL)`
```
✅ **Complete Examples**
```markdown
Add this to your README.md:
```markdown
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=YOUR_USERNAME&show_icons=true&theme=dracula)
```

Replace `YOUR_USERNAME` with your actual GitHub username.
```

❌ **No Skill Level Differentiation**
```markdown
## How to Use
[Complex, technical explanation without considering beginners]
```
✅ **Level-Appropriate Content**
```markdown
## For Complete Beginners
[Simple, step-by-step guide]

## For Advanced Users
[Technical deep dive with automation options]
```

### Structure Anti-Patterns

❌ **Wall of Text**
- Long paragraphs without breaks
- No headers or lists
- Hard to scan

✅ **Structured Content**
- Clear headings hierarchy
- Bullet points for lists
- Code blocks for technical content
- Bold for emphasis

❌ **No Entry Points**
- Must read entire document to get started
- No quick start
- No templates

✅ **Multiple Entry Points**
- Quick start for immediate results
- Comprehensive reference for deep dives
- Templates for copy-paste users

❌ **Poor Navigation**
- Vague section titles
- No cross-references
- Hard to find specific information

✅ **Clear Navigation**
- Specific, descriptive headings
- Cross-references between sections
- Logical flow from simple to complex

---

## 15. Summary: Key Takeaways

### Essential Elements (Every Skill Must Have)

1. **YAML Frontmatter** - name, description, license
2. **"What Users Want"** - Clear identification of user intent
3. **"What You Provide"** - Definition of skill capabilities
4. **Quick Start** - 5-minute path to first result
5. **Code Examples** - Complete, working, documented
6. **Troubleshooting** - Common problems and solutions

### Recommended Elements (Most Skills Should Have)

7. **Level-Based Guidance** - Beginner → Intermediate → Advanced paths
8. **Component Reference** - Detailed documentation of tools/features
9. **Templates** - Ready-to-use examples
10. **Best Practices** - Optimization, security, performance
11. **Tools & Resources** - External links and generators
12. **"Your Approach"** - Philosophy and strategy

### Optional Elements (Complex Skills)

13. **Understanding the Domain** - What/Why/How it works
14. **Trends** - Current state of the art
15. **Advanced Automation** - Scripts, workflows, APIs
16. **Inspiration** - Examples, case studies

### Formatting Rules

1. Use clear heading hierarchy (H1 → H2 → H3)
2. Always specify language in code blocks (```markdown, ```yaml)
3. Use placeholders that are obvious (YOUR_USERNAME, YOUR_TOKEN)
4. Provide file paths for code examples
5. Explain all parameters after code blocks
6. Use bold for emphasis, lists for options
7. Cross-reference related sections

### Writing Style

1. **Direct and actionable** - Tell users what to do, not what they might consider
2. **Specific, not vague** - Use concrete examples, not generalities
3. **Complete examples** - Full code, not snippets that need context
4. **Respect skill levels** - Provide multiple paths for different experience levels
5. **Encouraging but realistic** - Set clear expectations
6. **Professional yet accessible** - Clear explanations, define terminology

---

## 16. Applying This to Convex Skills

When creating Convex skills, follow this decision tree:

### Skill Complexity Assessment

**Is the domain highly technical with many components?**
- YES → Use Comprehensive Reference pattern (gh-profile style)
- NO → Continue to next question

**Is the domain creative/subjective with flexibility as key?**
- YES → Use Focused Guide pattern (frontend-design style)
- NO → Use Balanced Approach pattern (hybrid)

### Content Checklist for Convex Skills

Based on this analysis, Convex skills should include:

**Must Have:**
- [ ] YAML frontmatter with name, description, license
- [ ] "What Users Want" section
- [ ] "What You Provide" section
- [ ] Quick Start (5-minute path to first result)
- [ ] Level-based guidance (Beginner → Advanced)
- [ ] Complete code examples with parameters explained
- [ ] Troubleshooting section

**Should Have:**
- [ ] Understanding Convex section (What/Why/How)
- [ ] Component reference guide
- [ ] Ready-to-use templates (2-3 variations)
- [ ] Best practices (performance, security, patterns)
- [ ] "Your Approach" philosophy section

**Nice to Have:**
- [ ] Current trends in Convex ecosystem
- [ ] Advanced automation (scripts, workflows)
- [ ] External tools and resources
- [ ] Inspiration/examples from real projects

### Convex-Specific Considerations

1. **Convex is technical** - Likely needs Comprehensive Reference or Balanced Approach
2. **Multiple concepts** - Functions, schemas, auth, file storage, real-time
3. **Different use cases** - Web apps, APIs, real-time features
4. **Skill levels vary** - Beginners need basics, experts want optimization

---

## Conclusion

This analysis reveals two distinct skill patterns:

1. **Comprehensive Reference** (gh-profile): Encyclopedia-style, exhaustive documentation for complex technical domains with many components and use cases.

2. **Focused Guide** (frontend-design): Philosophy-driven, concise guidance for creative/subjective domains where flexibility is paramount.

For Convex skills, a **Balanced Approach** is likely optimal - combining the comprehensive nature of gh-profile with the focused principles of frontend-design, adapted to the technical complexity of Convex while maintaining clarity and actionability.

The key is **multiple entry points**: quick starts for immediate results, progressive deepening for learning, and comprehensive references for mastery - all while maintaining specific, complete examples and clear skill level differentiation.
