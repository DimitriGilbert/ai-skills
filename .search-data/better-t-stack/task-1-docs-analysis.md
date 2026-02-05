# Task 1: Documentation Deep Dive Analysis

## Research Objective
Analyze all documentation files in the Better-T-Stack repository to create a comprehensive understanding of the tool's features, usage patterns, and best practices.

## Context
You are researching the Better-T-Stack CLI tool to create comprehensive documentation for skill creation. The repository is located at `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`.

## Specific Tasks

### 1. Read All Documentation Files
Read and analyze all documentation files in `apps/web/content/docs/`:

**Main Documentation:**
- `index.mdx` - Main overview
- `bts-config.mdx` - Configuration file structure
- `project-structure.mdx` - Project structure explanation
- `faq.mdx` - Frequently asked questions
- `contributing.mdx` - Contribution guidelines
- `analytics.mdx` - Analytics information

**CLI Documentation:**
- `cli/index.mdx` - CLI commands overview
- `cli/options.mdx` - All CLI options reference
- `cli/compatibility.mdx` - Compatibility rules (already read)
- `cli/prompts.mdx` - Interactive prompts
- `cli/programmatic-api.mdx` - Programmatic API

**Guides:**
- `guides/index.mdx` - Guides overview
- `guides/cloudflare-alchemy.mdx` - Cloudflare Alchemy deployment guide

### 2. Extract Key Information
For each documentation file, extract:
- Main topics covered
- Key configuration options mentioned
- Usage patterns and examples
- Best practices mentioned
- Common workflows described
- Edge cases or special considerations

### 3. Identify Usage Patterns
Look for patterns in:
- How to use `init` vs `add` commands
- Recommended stack combinations
- When to use specific options
- Workflow patterns for different use cases
- Common gotchas mentioned

### 4. Document Best Practices
Extract best practices for:
- Choosing the right stack combinations
- Using configuration files
- Managing project updates
- Working with different runtimes
- Handling database setups

## Deliverables

Save your findings to `.search-data/better-t-stack/` as:

### `best-practices.md`
Structure:
```markdown
# Better-T-Stack Best Practices

## Choosing the Right Stack
### For Full-Stack Apps
### For Backend-Only
### For Frontend-Only
### For Native Apps

## Configuration Management
### bts.jsonc Management
### Environment Variables
### Project Updates

## Usage Patterns
### init vs add Commands
### Workflow Patterns
### Common Workflows

## Development Practices
### Testing
### Deployment
### Maintenance

## Performance Considerations
### Runtime Selection
### Database Selection
### Addon Selection

## Security Best Practices
### Authentication Setup
### Database Security
### Deployment Security
```

### `common-patterns.md`
Structure:
```markdown
# Common Usage Patterns

## Init Command Patterns
### Standard Full-Stack Setup
### Minimal Setup
### Multi-Frontend Setup

## Add Command Patterns
### Adding Addons
### Adding Deployment
### Updating Configuration

## Stack Combinations
### Recommended Combinations
### Common Use Cases
### Example Stacks

## Workflow Patterns
### Development Workflow
### Testing Workflow
### Deployment Workflow
```

## Research Sources
- Repository: https://github.com/AmanVarshney01/create-better-t-stack
- Local clone: `/home/didi/workspace/Code/skills/.search-data/better-t-stack/repo/`
- Documentation directory: `apps/web/content/docs/`

## Instructions
1. Read each documentation file carefully
2. Extract specific, actionable information
3. Provide code examples where applicable
4. Reference the source files for each finding
5. Organize information logically for skill creation
6. Save findings to the specified files in `.search-data/better-t-stack/`

## Notes
- Always reference the source file when extracting information
- Include specific file paths (e.g., `apps/web/content/docs/cli/options.mdx`)
- Provide concrete examples from the documentation
- Focus on information that would be useful for creating a skill
- Be thorough and comprehensive
