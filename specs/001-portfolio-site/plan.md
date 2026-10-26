# Implementation Plan: Professional Portfolio Website

**Branch**: `001-portfolio-site` | **Date**: 2026-10-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-portfolio-site/spec.md`

## Summary

Create a recruiter-facing, responsive static portfolio using vanilla HTML, CSS,
and JavaScript. Store public content as separate JSON documents for the profile
and each portfolio section. Load and validate each document independently so a
broken section cannot prevent valid sections from appearing. Keep content,
presentation, and rendering separate, use no framework or build step, and use
document-relative asset and data URLs so the site works under a GitHub Pages
repository subpath. First-release AI features are explicitly out of scope.

The detailed choices and alternatives are recorded in [research.md](./research.md).

## Technical Context

**Language/Version**: Browser-native HTML, CSS, and JavaScript; no runtime version
or transpilation target beyond current evergreen browsers is required.

**Primary Dependencies**: None. Use native browser APIs and no framework, runtime
package, or Markdown parser.

**Storage**: Static, public JSON files served with the site; no database or
server-side storage.

**Testing**: Automated tests are prohibited. Verification is manual code review
and visual, keyboard, responsive, and content-failure inspection only.

**Target Platform**: GitHub Pages project site, including hosting below a
repository-name path; current desktop and mobile browsers.

**Project Type**: Single-page static web application.

**Performance Goals**: Render a lightweight page without unnecessary assets or
network calls; request the small content files concurrently and avoid blocking
valid sections on an unrelated section's failure.

**Constraints**: No backend, database, paid hosting, client-side API secrets, or
AI functionality in the first release. Meet WCAG 2.1 AA color contrast and
support semantic structure and keyboard operation. Do not create or run
automated tests.

**Scale/Scope**: One candidate profile with profile, skills, education,
experience, projects, and achievements. Static public content; no accounts,
editing interface, or multi-user workflow.

## Constitution Check

### Pre-Design Gate

- **Professional quality**: Pass — recruiter-oriented content hierarchy and a
  visually consistent responsive design are in scope.
- **Responsive and accessible experience**: Pass — mobile, tablet, and desktop
  layouts, semantic HTML, keyboard operation, and WCAG 2.1 AA contrast are
  requirements.
- **Data-UI independence**: Pass — content is maintained in JSON files separate
  from rendering and presentation code.
- **Static, reliable deployment**: Pass — browser-only behavior and static files
  are compatible with GitHub Pages; no backend or runtime secrets are needed.
- **Maintainability and minimal complexity**: Pass — native web technologies
  and no framework or build tool are preferred.
- **Additional constraints**: Pass — validation and section isolation provide
  graceful handling; structured content leaves room for future AI consumers
  without shipping AI features now.
- **Development workflow**: Pass — only manual inspection and code review are
  planned; automated tests will not be created or run.

No pre-design gate violations or unresolved requirement clarifications remain.

## Design Decisions for Review

1. **Content format — JSON files, one per section (recommended).** JSON provides
   explicit fields for validation and reuse by future AI workflows. Markdown is
   simpler for long-form authoring but needs a parser and does not naturally
   validate records. A hybrid can support extensive prose but adds formats and
   parsing complexity without a current need. A single JSON document minimizes
   requests, but one syntax error makes that entire document unparseable.
   Separate section files isolate syntax and fetch failures so other sections
   can still render; the small additional request count is justified by the
   specified partial-content behavior.
2. **Build tool or framework — none for v1 (recommended).** GitHub Pages can
   serve static HTML, CSS, JavaScript, and JSON directly. A build step or
   framework would add dependencies and deployment complexity without a
   requirement for compilation, routing, or server-side rendering.
3. **Code organization — content, rendering, and presentation remain distinct.**
   Put portfolio content under `data/`, JavaScript loading/validation/rendering
   under `assets/js/`, styles under `assets/css/`, and local imagery under
   `assets/images/`. A small entry module coordinates section loading and
   rendering; section-specific rendering can be split further only when
   complexity warrants it.
4. **Malformed data — isolate, validate, omit, and notify (recommended).** Load
   section files independently and concurrently. Validate expected root and
   record shapes, ignore unknown fields, use fallbacks for absent optional
   fields, skip invalid records, and show one brief non-technical notice if
   content was skipped or a section could not be loaded. A JSON syntax error
   affects only its section file; it cannot be recovered record-by-record
   inside that same invalid JSON document.
5. **GitHub Pages paths — document-relative references (recommended).** Avoid
   domain-root paths such as `/assets/...`, which omit the repository-name
   prefix on project sites. Resolve `./assets/...` and `./data/...` relative to
   the served document. This remains compatible with a site hosted at a
   repository subpath without a build-time base-path setting.

These decisions recommend an implementation direction; they do not begin
implementation. The implementation phase may revisit a decision only with a
documented reason consistent with the constitution and specification.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-site/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── portfolio-ui.md
└── tasks.md              # Created by /speckit-tasks, not this plan
```

### Source Code (repository root)

```text
index.html
data/
├── profile.json
├── skills.json
├── education.json
├── experience.json
├── projects.json
└── achievements.json
assets/
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── content.js
│   └── render.js
└── images/
```

**Structure Decision**: Use a single static-site root, with section-specific
JSON content, styles, and browser JavaScript in distinct directories. No
`src/`/`dist/` build pipeline, backend, generated output, or automated-test
directory is planned. The contents of these paths are proposed for a future
implementation phase and are not created by this plan.

## Constitution Check (Post-Design)

- JSON preserves machine-readable content and future AI reuse while the chosen
  separate-file boundary meets partial rendering requirements.
- No build process or external runtime dependency is needed for GitHub Pages.
- Relative URLs address project-site subpaths without a server or generated
  base-path configuration.
- The validation and notice behavior matches the clarified malformed-content
  decision; unknown fields do not block supported content.
- Manual review and inspection are the only verification approach; no
  automated tests are planned.
- The file layout preserves independent content and presentation and allows
  section-level rendering to grow without imposing a framework.

**Gate result**: Pass. No constitution violations or complexity justifications
are required.

## Complexity Tracking

No constitution violations.
