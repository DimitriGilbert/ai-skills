# Awesome List Examples

This document provides annotated examples from real Awesome lists to illustrate best practices.

## Example 1: Proper Header and Badge Placement

**Source:** awesome-ios

```markdown
# Awesome iOS

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated list of awesome iOS ecosystem, including Objective-C and Swift Projects
```

**Key Points:**
- Title is title case: `# Awesome iOS`
- Badge is on the right side of the heading
- Badge links to `https://awesome.re`
- Succinct, objective description of what the list covers

## Example 2: Proper Entry Format

**Good Examples:**

```markdown
- [Alamofire](https://github.com/Alamofire/Alamofire#readme) - Elegant HTTP Networking in Swift.
- [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON#readme) - The better way to deal with JSON data in Swift.
- [Kingfisher](https://github.com/onevcat/Kingfisher#readme) - A lightweight and pure Swift implemented library for downloading and caching images.
```

**Key Points:**
- All GitHub links end with `#readme`
- Descriptions start with uppercase
- All descriptions end with periods
- Objective descriptions (no "best", "amazing")
- Clear explanations of what the project does

**Bad Examples:**

```markdown
❌ - [Alamofire](https://github.com/Alamofire/Alamofire) - best networking library
❌ - [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON#readme) - The best JSON handler
❌ - [Kingfisher](https://github.com/onevcat/Kingfisher#readme) - An amazing image library
```

**Problems:**
- Missing `#readme` in first example
- Marketing language: "best", "amazing"
- Missing period in first example
- Vague descriptions

## Example 3: Table of Contents

**Source:** awesome-python

```markdown
## Contents

- [Administration](#administration)
- [Asset Management](#asset-management)
- [Audio](#audio)
- [Authentication](#authentication)
- [Build Tools](#build-tools)
- [Caching](#caching)
- [ChatOps](#chatops)
```

**Key Points:**
- Section is named "Contents" (not "Table of Contents")
- Links are anchor links to section headers
- Typically one level (no nested bullets)
- First section in the README
- Excludes "Contributing" and "Footnotes"

## Example 4: Category Organization

**Source:** awesome-swift

```markdown
## Libraries

- [Alamofire](https://github.com/Alamofire/Alamofire#readme) - Elegant HTTP Networking.
- [Moya](https://github.com/Moya/Moya#readme) - Network abstraction layer.

## Tools

- [SwiftLint](https://github.com/realm/SwiftLint#readme) - A tool to enforce Swift style.
- [SwiftFormat](https://github.com/nicklockwood/SwiftFormat#readme) - Code formatting.
```

**Key Points:**
- Clear category names (title case)
- Related items grouped together
- Logical organization
- Consistent formatting within categories

## Example 5: Description Styles

**Project Type:**
```markdown
- [SnapKit](https://github.com/SnapKit/SnapKit#readme) - A Swift Autolayout DSL.
```

**Library Type:**
```markdown
- [RxSwift](https://github.com/ReactiveX/RxSwift#readme) - Reactive Programming in Swift.
```

**Tool Type:**
```markdown
- [SwiftGen](https://github.com/SwiftGen/SwiftGen#readme) - A code generator for assets.
```

**Framework Type:**
```markdown
- [Vapor](https://github.com/vapor/vapor#readme) - A server-side Swift web framework.
```

**Key Points:**
- Noun-based descriptions
- Clear about project type
- Concise but informative
- Avoid "tool for X" pattern when possible

## Example 6: Contributing Section

```markdown
## Contributing

Please see [contributing.md](contributing.md)
```

**Key Points:**
- Links to separate `contributing.md` file
- Brief and to the point
- Placed at top or bottom of main content
- NOT included in Table of Contents

## Example 7: Footnotes Section

```markdown
## Footnotes

- The list is a curated selection of projects.
- Some entries may be archived but historically significant.
```

**Key Points:**
- Contains ancillary information
- NOT included in Table of Contents
- Placed at very bottom of README
- Used for non-essential but necessary information

## Example 8: Repository Structure

```
awesome-topic/
├── README.md           # Main list
├── CONTRIBUTING.md     # Contribution guidelines
├── LICENSE             # CC0 license file
└── logo.png            # Optional project logo
```

**Key Points:**
- Simple structure
- LICENSE file in root (not LICENSE.md)
- Separate CONTRIBUTING.md
- Optional logo in root

## Common Patterns to Follow

### Badge Placement
```markdown
# Awesome Topic [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
```
OR
```markdown
# Awesome Topic

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
```

### Description Format
```markdown
> Brief, objective description of what this list covers.
```

### Entry Template
```markdown
- [Project Name](https://github.com/user/project#readme) - What it does in one sentence.
```

### Category Template
```markdown
## Category Name

- [Project](https://github.com/user/project#readme) - Description.
- [Another Project](https://github.com/user/another#readme) - Description.
```

## Anti-Patterns to Avoid

### ❌ Marketing Language
```markdown
- Best framework for X
- Amazing library
- Revolutionary tool
- The ultimate solution
```

### ❌ Self-Referential
```markdown
- Resources for X development
- Tools to help with X
- Collection of X projects
```

### ❌ Vague Descriptions
```markdown
- A tool for X
- A library for X
- Something that does X
```

### ❌ Inconsistent Formatting
```markdown
- [Project](https://github.com/user/project) - Description (no period)
- [Another Project](https://github.com/user/another#readme) - description (lowercase)
- [Third Project](https://github.com/user/third#readme) Description (no dash)
```

## Quick Reference Checklist

For each entry, verify:
- [ ] GitHub link includes `#readme`
- [ ] Description ends with period
- [ ] Description starts with uppercase
- [ ] No marketing language
- [ ] Clear what the project does
- [ ] Active maintenance

For the overall list:
- [ ] Awesome badge present
- [ ] Title is title case
- [ ] Succinct description at top
- [ ] Contents section (named "Contents")
- [ ] CONTRIBUTING.md exists
- [ ] LICENSE file (CC0)
- [ ] No hard-wrapping
- [ ] Consistent formatting
