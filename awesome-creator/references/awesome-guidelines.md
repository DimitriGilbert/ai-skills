# Awesome List Submission Guidelines

**Source:** https://github.com/sindresorhus/awesome/blob/main/pull_request_template.md

## Requirements for Your Pull Request

- Don't open a Draft / WIP pull request while you work on the guidelines. A pull request should be 100% ready and should adhere to all the guidelines when you open it.
- You have to review at least 2 other open pull requests. Try to prioritize unreviewed PRs. Just commenting "looks good" or simply marking the pull request as approved does not count. You have to actually point out mistakes or improvement suggestions.
- You have read and understood the instructions for creating a list.
- This pull request has a title in the format `Add Name of List`. It should not contain the word `Awesome`.
  - ✅ `Add Swift`
  - ✅ `Add Software Architecture`
  - ❌ `Update readme.md`
  - ❌ `Add Awesome Swift`
- Your entry here should include a short description of the project/theme of the list. **It should not describe the list itself.** The first character should be uppercase and the description should end in a dot. It should be an objective description and not a tagline or marketing blurb.
  - ✅ `- [iOS](…) - Mobile operating system for Apple phones and tablets.`
  - ✅ `- [Framer](…) - Prototyping interactive UI designs.`
  - ❌ `- [iOS](…) - Resources and tools for iOS development.`
  - ❌ `- [Framer](…) - prototyping interactive UI designs` (no period)
- Your entry should be added at the bottom of the appropriate category.
- The title of your entry should be title-cased and the URL to your list should end in `#readme`.
  - Example: `- [Software Architecture](https://github.com/simskij/awesome-software-architecture#readme) - The discipline of designing and building software.`
- No blockchain-related lists.
- The suggested Awesome list complies with the below requirements.

## Requirements for Your Awesome List

### Age Requirement

**Has been around for at least 30 days.** That means 30 days from either the first real commit or when it was open-sourced. Whatever is most recent.

### Quality Standards

- Run `awesome-lint` on your list and fix the reported issues.
- The default branch should be named `main`, not `master`.
- **Includes a succinct description of the project/theme at the top of the readme.**
  - ✅ `Mobile operating system for Apple phones and tablets.`
  - ✅ `Prototyping interactive UI designs.`
  - ❌ `Resources and tools for iOS development.`
  - ❌ `Awesome Framer packages and tools.`
- It's the result of hard work and the best you could possibly produce. If you have not put in considerable effort into your list, your pull request will be immediately closed.

### Naming Conventions

- **Repository:** The repo name should be in lowercase slug format: `awesome-name-of-list`.
  - ✅ `awesome-swift`
  - ✅ `awesome-web-typography`
  - ❌ `awesome-Swift`
  - ❌ `AwesomeWebTypography`

- **Heading:** The heading title should be in title case format: `# Awesome Name of List`.
  - ✅ `# Awesome Swift`
  - ✅ `# Awesome Web Typography`
  - ❌ `# awesome-swift`
  - ❌ `# AwesomeSwift`

### Repository Requirements

- Non-generated Markdown file in a GitHub repo.
- The repo should have `awesome-list` & `awesome` as GitHub topics. Add more relevant topics.
- Not a duplicate. Please search for existing submissions.
- **Only has awesome items.** Awesome lists are curations of the best, not everything.
- Does not contain items that are unmaintained, has archived repo, deprecated, or missing docs. If you really need to include such items, they should be in a separate Markdown file.

### Visual Requirements

- **Includes a project logo/illustration whenever possible.**
  - Either centered, fullwidth, or placed at the top-right of the readme.
  - The image should link to the project website or any relevant website.
  - **The image should be high-DPI.** Set it to a maximum of half the width of the original image.
  - Don't include both a title saying `Awesome X` and a logo with `Awesome X`. You can put the header image in a `#` (Markdown header) or `<h1>`.

- **Includes the Awesome badge.**
  - Should be placed on the right side of the readme heading.
  - Can be placed centered if the list has a centered graphics header.
  - Should link back to this list: `https://awesome.re`

### Entry Requirements

- Entries have a description, unless the title is descriptive enough by itself.
- Descriptions are objective, not marketing copy.
- All entries end with periods.

### Table of Contents

- **Has a Table of Contents section.**
  - Should be named `Contents`, not `Table of Contents`.
  - Should be the first section in the list.
  - Should only have one level of nested lists, preferably none.
  - **Must not feature `Contributing` or `Footnotes` sections.**

### License Requirements

- **Has an appropriate license.**
  - **We strongly recommend the CC0 license**, but any Creative Commons license will work.
  - A code license like MIT, BSD, Apache, GPL, etc, is not acceptable. Neither are WTFPL and Unlicense.
  - Place a file named `license` or `LICENSE` in the repo root with the license text.
  - **Do not** add the license name, text, or a `License` section to the readme.

### Contributing Guidelines

- **Has contribution guidelines.**
  - The file should be named `contributing.md`. The casing is up to you.
  - It can optionally be linked from the readme in a dedicated section titled `Contributing`, positioned at the top or bottom of the main content.
  - The section should not appear in the Table of Contents.

### Footnotes Section

- All non-important but necessary content (like extra copyright notices, hyperlinks to sources, pointers to expansive content, etc) should be grouped in a `Footnotes` section at the bottom of the readme.
- The section should not be present in the Table of Contents.

### Formatting Standards

- **Has consistent formatting and proper spelling/grammar.**
  - The link and description are separated by a dash.
    Example: `- [AVA](…) - JavaScript test runner.`
  - The description starts with an uppercase character and ends with a period.
  - Consistent and correct naming. For example, `Node.js`, not `NodeJS` or `node.js`.
- **Does not use hard-wrapping.**
- **Does not include a CI (e.g. GitHub Actions) badge.** You can still use a CI for linting, but the badge has no value in the readme.
- **Does not include an `Inspired by awesome-foo` or `Inspired by the Awesome project` link at the top of the readme.** The Awesome badge is enough.
