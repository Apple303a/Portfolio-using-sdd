# Tasks: Professional Portfolio Website

**Input**: Design documents from `specs/001-portfolio-site/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/portfolio-ui.md`, `quickstart.md`

**Verification policy**: Automated tests MUST NOT be created or run. Use the
manual review scenarios in `quickstart.md` and code review.

**Organization**: Tasks are grouped by user story to allow incremental delivery.
The story phases depend on the shared static page shell and content-loading
foundation described below.

## Phase 1: Setup

**Purpose**: Create the minimal static site layout described in `plan.md`.

- [X] T001 Create the semantic page shell and section placeholders in `index.html`
- [X] T002 [P] Create the site-wide responsive style foundation and focus styles in `assets/css/styles.css`
- [X] T003 [P] Create the browser application entry module in `assets/js/main.js`

## Phase 2: Foundational

**Purpose**: Establish the shared public data contract and resilient loading
behavior required by all portfolio sections.

- [X] T004 Create the versioned profile JSON source and profile fields in `data/profile.json`; `profile.name` MUST be "Non-empty after trimming; otherwise use a generic profile heading." If candidate details are unavailable, use visibly marked placeholders and require replacement before deployment.
- [X] T005 [P] Create the versioned skills, education, experience, projects, and achievements JSON sources in `data/skills.json`, `data/education.json`, `data/experience.json`, `data/projects.json`, and `data/achievements.json`; each file MUST contain `schemaVersion` `"1.0"` and an `items` array. Any placeholder entries MUST be visibly marked and replaced with candidate-approved content before deployment.
- [X] T006 Implement independent section fetching, response-status checks, JSON parsing, and section-level failure isolation in `assets/js/content.js`
- [X] T007 Implement shared field and record validators in `assets/js/content.js`; `skill.id`, `education.id`, `experience.id`, `project.id`, and `achievement.id` MUST respectively be "Non-empty and unique within skills", "Non-empty and unique within education", "Non-empty and unique within experience", "Non-empty and unique within projects", and "Non-empty and unique within achievements"; `profile.contact.email` MUST be omitted if it fails a basic email-shape check; `experience.endDate` MUST accept `null` for a current role; optional string arrays MUST retain only non-empty strings; invalid links MUST be omitted without discarding otherwise valid records; optional invalid fields and unknown fields MUST be ignored
- [X] T008 Implement safe DOM text rendering, valid `https:`/`mailto:` link checks, and one non-technical unavailable-content notice in `assets/js/render.js`
- [X] T009 Wire the entry module to load all section files concurrently and render usable sections plus a generic fallback when all useful content is unavailable in `assets/js/main.js`
- [X] T010 Validate project image paths as local relative assets and omit missing or invalid images without hiding the otherwise valid project record in `assets/js/content.js`

**Checkpoint**: Shared static shell can load independently versioned sections,
report partial content, and retain valid sections when another section fails.

## Phase 3: User Story 1 - Recruiter reviews the candidate quickly (Priority: P1)

**Goal**: Present the candidate's background clearly to recruiters and employers
on mobile, tablet, and desktop screens.

**Independent Test**: In a manual review, confirm a recruiter can locate the
candidate's professional summary, primary skills, and most recent experience
within one minute using visible page content and navigation; also inspect phone,
tablet, and desktop layouts for readability, keyboard operation, and horizontal
overflow.

### Implementation

- [X] T011 [US1] Render profile name, headline, summary, location, and valid contact methods in the profile section using `data/profile.json` and `assets/js/render.js`
- [X] T012 [US1] Render the skills section with optional category and level fields from `data/skills.json` in `assets/js/render.js`
- [X] T013 [US1] Render experience roles, organizations, date ranges, descriptions, achievements, and skills from `data/experience.json` in `assets/js/render.js`
- [X] T014 [US1] Render project titles, descriptions, roles, technologies, outcomes, local images, and valid links from `data/projects.json` in `assets/js/render.js`
- [X] T015 [US1] Render education qualifications, institutions, fields of study, dates, and descriptions from `data/education.json` in `assets/js/render.js`
- [X] T016 [US1] Render achievement titles, issuers, dates, descriptions, and valid links from `data/achievements.json` in `assets/js/render.js`
- [X] T017 [US1] Add responsive section spacing, readable typography, and narrow-screen navigation behavior in `assets/css/styles.css` and `index.html`
- [X] T018 [US1] Ensure section navigation targets only rendered sections and remains keyboard operable in `index.html` and `assets/js/render.js`
- [X] T019 [US1] Verify semantic heading hierarchy, visible keyboard focus, and WCAG 2.1 AA color contrast in `index.html` and `assets/css/styles.css`

**Checkpoint**: Recruiters can navigate and review the complete portfolio
presentation at supported viewport sizes.

## Phase 4: User Story 2 - Candidate updates content independently (Priority: P1)

**Goal**: Enable content updates and new entries without changing presentation
or rendering code.

**Independent Test**: Manually edit one section JSON document by changing a
value and adding a valid record; reload and confirm both changes appear without
editing HTML, styles, or JavaScript.

### Implementation

- [X] T020 [US2] Document section file locations, payload shapes, `"1.0"` schema version, required/optional fields, and valid record examples in `data/README.md` consistent with `specs/001-portfolio-site/data-model.md`
- [X] T021 [US2] Implement iteration over every valid record in each section array without hard-coded entry counts in `assets/js/render.js`
- [X] T022 [US2] Insert content values as text nodes rather than interpreting them as markup in `assets/js/render.js`
- [X] T023 [US2] In temporary copies of the profile and project JSON files, change a profile value and add a valid project record; verify both display without UI code changes, then discard the temporary copies and confirm no test content remains in release data under `data/`

**Checkpoint**: The candidate can make common content updates in data files
without rewriting the interface.

## Phase 5: User Story 3 - Candidate prepares for future AI and career tools (Priority: P2)

**Goal**: Preserve structured portfolio information for future resume and
job-matching workflows without shipping AI behavior in v1.

**Independent Test**: Review section data and content documentation to confirm
the profile and portfolio records retain stable IDs, explicit fields, dates,
skills, descriptions, links, and outcomes suitable for later reuse; confirm
there is no AI runtime or API credential.

### Implementation

- [X] T024 [US3] Confirm each repeatable content entry has a stable, non-empty ID unique within its section in `data/skills.json`, `data/education.json`, `data/experience.json`, `data/projects.json`, and `data/achievements.json`
- [X] T025 [US3] Preserve descriptive experience outcomes, project outcomes, and skill references as structured fields in `data/experience.json` and `data/projects.json`
- [X] T026 [US3] Document that AI-generated resumes, job-description matching, and skill-gap analysis are outside v1 and may consume the structured section data later in `data/README.md`
- [X] T027 [US3] Review the delivered static assets and content model to confirm no client-side API keys, AI service calls, or backend dependency are present in `index.html`, `assets/`, and `data/`

**Checkpoint**: The public content remains structured and reusable while v1
continues to run without AI features or secrets.

## Phase 6: Polish and Cross-Cutting Review

**Purpose**: Manually verify robustness, accessibility, performance, and static
deployment readiness without automated tests.

- [X] T028 [P] Review every data document against the required shapes and optional-field rules in `data/` and `specs/001-portfolio-site/data-model.md`
- [X] T029 [P] Manually inspect missing optional fields, malformed JSON in one section file, malformed records, duplicate IDs, unknown fields, and unavailable section behavior using temporary local copies of files under `data/`
- [X] T030 Manually inspect local static hosting, mobile/tablet/desktop layouts, keyboard flow, and contrast according to `specs/001-portfolio-site/quickstart.md`
- [X] T031 Review all CSS, JavaScript, image, and JSON references to ensure they are document-relative and resolve under a GitHub Pages repository subpath in `index.html` and `assets/`
- [ ] T032 Confirm candidate-specific content has been supplied, visibly marked placeholders have been replaced, and the project uses static files only without backend, database, build, test-suite, or runtime-service dependencies in `index.html`, `assets/`, and `data/`

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 — Setup**: Starts immediately; establishes the static document,
  style, and script entry points.
- **Phase 2 — Foundational**: Depends on the page shell and entry module from
  Phase 1; blocks user story rendering work.
- **Phase 3 — US1**: Depends on Phase 2; delivers the recruiter-facing
  portfolio.
- **Phase 4 — US2**: Depends on the shared data contract from Phase 2 and
  rendered sections from Phase 3; validates maintainable data-driven rendering.
- **Phase 5 — US3**: Depends on the structured data foundation from Phase 2;
  can proceed after US1 content shapes exist.
- **Phase 6 — Polish**: Depends on the desired story phases being complete.

### User Story Dependencies

- **US1 (P1)**: Begins after Phase 2. MVP; no dependency on later user stories.
- **US2 (P1)**: Begins after US1 (Phase 3); integrates with the completed
  section renderers to ensure content updates and additions are data-driven.
- **US3 (P2)**: Begins after Phase 2; may proceed in parallel with US1/US2 once
  the data contract is established.

### Parallel Opportunities

- T002 and T003 can proceed in parallel after T001 establishes the page entry.
- T004 and T005 can proceed in parallel after Phase 1.
- T006 and T007 share `assets/js/content.js`; implement them sequentially to
  avoid file conflicts. T008 uses `assets/js/render.js` and can proceed in
  parallel with data loading work.
- T011–T016 target the same renderer file and should be coordinated or applied
  sequentially unless separate section renderers are introduced deliberately.
- T020–T021 share `data/README.md`; perform together or sequentially.
- T025 and T026 affect independent content files and can be handled in parallel.
- T029–T030 are separate manual review activities and can proceed in parallel
  using temporary local copies.

## Implementation Strategy

1. Complete Setup and Foundational work to establish the data/rendering contract
   and resilient shell.
2. Deliver US1 as the MVP: populate and render all professional sections, then
   inspect responsive, keyboard, and contrast behavior manually.
3. Deliver US2 by confirming edits and additions remain data-only and documenting
   content authoring conventions.
4. Deliver US3 by preserving machine-readable fields and documenting the
   explicit AI-free v1 boundary.
5. Complete cross-cutting manual review using `quickstart.md`.

Automated tests are not included because the project constitution forbids their
creation and execution.
