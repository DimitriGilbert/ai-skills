# Design Prompt Templates

Templates for delegating design tasks to the external model.

**Model flag**: Only add `-m provider/model` if the user explicitly specifies a model. Otherwise, omit it entirely and let opencode use the user's configured default.

## Component Design

```bash
opencode run \
  --dangerously-skip-permissions \
  "Create a [ComponentName] component.

Read for context:
  - src/styles/theme.css
  - src/components/[existing-similar].tsx

Create: src/components/[ComponentName].tsx

Requirements:
  - [framework: React/Vue/etc.]
  - Follow existing component patterns in the project
  - Use the project's design tokens/theme variables
  - Responsive: works on mobile and desktop
  - [specific visual requirements]

Produce production-quality code only. No comments unless complex logic."
```

## Page Design

```bash
opencode run \
  --dangerously-skip-permissions \
  "Design and implement the [PageName] page.

Read for context:
  - src/styles/theme.css
  - src/components/layout/Header.tsx
  - src/components/layout/Footer.tsx
  - src/pages/[existing-page].tsx

Create: src/pages/[PageName].tsx
Create: src/styles/[pageName].css (if needed)

Requirements:
  - Layout: [describe layout structure]
  - Sections: [list sections and their content]
  - Color scheme: [reference theme or specify]
  - Typography: [headings, body text sizes]
  - Spacing: [generous/tight/standard]
  - Animations: [none/subtle/pronounced]
  - Mobile-first responsive

Follow existing page patterns in the project."
```

## Style/Theme Update

```bash
opencode run \
  --dangerously-skip-permissions \
  "Update the styling for [scope].

Read for context:
  - src/styles/theme.css
  - src/styles/[target-file].css
  - src/components/[affected-components]

Modify: src/styles/[target-file].css

Requirements:
  - [what needs to change visually]
  - [constraints or reference points]
  - Must not break existing component styles

List every file you modify in your response."
```

## Design Review

```bash
opencode run \
  "Review the visual design and CSS implementation of these files.

Read:
  - [file1]
  - [file2]
  - [file3]

Evaluate:
  1. Visual quality — does it look polished or generic?
  2. Spacing consistency — are margins/paddings systematic?
  3. Typography — hierarchy clear? sizes appropriate?
  4. Color usage — consistent with theme? good contrast?
  5. Responsiveness — will it work on mobile?
  6. Code quality — any CSS anti-patterns?

Output a numbered list of specific issues with file:line references and suggested fixes."
```

## Full Redesign

```bash
opencode run \
  --dangerously-skip-permissions \
  "Redesign the [feature/page/component].

Read the current implementation:
  - [all relevant files]

Design goals:
  - [goal 1]
  - [goal 2]
  - [goal 3]

Design constraints:
  - Must use [framework/library]
  - Must keep [existing behavior/API]
  - Must follow [existing patterns]

Files to modify:
  - [list all files]

Produce the complete updated files. Do not leave placeholders or TODOs."
```
