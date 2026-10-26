# Research: Professional Portfolio Website

**Date**: 2026-10-26

## Content Format

**Decision**: Use JSON as the canonical content format, with one file for the
profile and one file for each repeatable portfolio section.

**Rationale**: Browser JavaScript can fetch and parse JSON natively. Explicit
fields support predictable validation and reuse for future resume generation
and job matching. Isolating sections in separate files limits a syntax or
loading failure to one section, allowing valid sections to render. The small
additional number of requests is a deliberate trade-off for fault isolation.
Descriptive text remains plain string values; no Markdown renderer is needed.

**Alternatives considered**:

- **One JSON file**: Easiest to keep as a single source and makes the fewest
  requests. However, invalid JSON syntax prevents parsing all sections at once.
- **Markdown**: Comfortable for prose, but it does not define structured
  records or native browser rendering. Rendering Markdown requires a parser;
  generated HTML also needs careful sanitization.
- **Hybrid JSON and Markdown**: Can make sense for substantial long-form
  writing, but adds formats and parsing dependencies without a current
  requirement.
- **JSON Schema runtime validation**: A formal schema can document shapes, but
  browser-native JSON parsing does not validate application-level fields.
  Adding a schema validator dependency is not justified for this small static
  site; use small explicit runtime checks and document the data contract.

## Build Tool and Framework

**Decision**: Use plain static files with browser-native HTML, CSS, and
JavaScript. Do not add a build tool or framework for v1.

**Rationale**: The application has a single page, no complex routing, no
server-side rendering, and no compile-time requirement. GitHub Pages serves
static assets directly. Native technologies minimize dependencies and keep
deployment simple.

**Alternatives considered**:

- **Framework**: Could help with a larger interactive application, but adds a
  toolchain and dependencies without solving a current requirement.
- **Build tool**: Could bundle or transform assets, but there is no build-time
  need in the specified v1 scope.

## Content, Presentation, and Rendering Boundaries

**Decision**: Keep public content in `data/`, styles in `assets/css/`, and
loading, validation, and rendering in `assets/js/`. A small application entry
coordinates loading and display; rendering functions build the semantic page.

**Rationale**: Content changes remain possible without altering layout or
rendering logic. Distinct modules permit future additions while avoiding
premature component frameworks or abstractions. Render descriptive content as
text rather than interpreting it as HTML.

**Alternatives considered**:

- **Content embedded in HTML or JavaScript**: Simplifies loading but couples
  content edits to presentation/code.
- **One large script**: May be sufficient initially, but makes validation,
  loading, and rendering harder to evolve independently.
- **Many small modules or per-section packages**: Unnecessary until actual
  complexity requires those boundaries.

## Malformed Content and Failure Isolation

**Decision**: Load section files independently, validate each section and
record, retain valid content, omit invalid records, and show one short
visitor-friendly notice when data has been skipped or a section is unavailable.

**Rationale**: Separate files allow a JSON syntax error in one section to leave
other sections parseable. After parsing, application-level validation catches
missing required fields and invalid types. Optional values receive documented
fallbacks. Unknown fields are ignored for forward compatibility.

**Alternatives considered**:

- **Fail the entire page on any invalid section**: Simple but conflicts with the
  explicit requirement to preserve valid portfolio sections.
- **Silently omit invalid content**: Preserves page functionality but hides
  the fact that some expected content was unavailable.
- **Recover individual records from syntactically invalid JSON**: Ordinary JSON
  parsing is document-level; recovering around syntax errors would require a
  more complex format or parser not justified for v1.

## GitHub Pages and Repository-Subpath URLs

**Decision**: Use document-relative references such as `./assets/css/styles.css`
and `./data/projects.json` for assets and content.

**Rationale**: A project site is served below a repository-name path. A
domain-root URL such as `/assets/...` starts at the host root and can omit that
path. Relative references resolve under the deployed site path without a
build-time base setting.

**Alternatives considered**:

- **Root-relative paths**: Appropriate only when hosting at the domain root or
  when a base prefix is consistently configured; fragile for a repository
  subpath.
- **Build-time base URL configuration**: Supports multiple environments but
  introduces configuration and/or a build step that this static site does not
  need.

## References

- [GitHub Pages: What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [MDN: Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN: JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [JSON Schema: Getting started](https://json-schema.org/learn/getting-started-step-by-step)
- [CommonMark Specification](https://spec.commonmark.org/0.31.2/)
- [Marked documentation](https://marked.js.org/)
- [MDN: Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent)
- [MDN: Element.innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)
- [MDN: Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
- [MDN: URL() constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)
