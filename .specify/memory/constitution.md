<!--
Sync Impact Report
Version change: placeholder scaffold -> 1.0.0
Modified principles:
- [PRINCIPLE_1_NAME] -> I. Professional Quality
- [PRINCIPLE_2_NAME] -> II. Responsive and Accessible Experience
- [PRINCIPLE_3_NAME] -> III. Data-UI Independence
- [PRINCIPLE_4_NAME] -> IV. Static, Reliable Deployment
- [PRINCIPLE_5_NAME] -> V. Maintainability and Minimal Complexity
Added sections:
- Additional Constraints
- Development Workflow
Removed sections:
- none
Deferred TODOs:
- none
-->

# Portfolio Constitution

## Core Principles

### I. Professional Quality
The portfolio website MUST present a polished, professional, recruiter-ready interface that communicates individual expertise, credibility, and career value. Content, visual hierarchy, and interaction patterns MUST support personal branding, hiring decisions, and professional trust.

### II. Responsive and Accessible Experience
The website MUST be fully responsive across mobile, tablet, and desktop viewports, with layouts, typography, and navigation adapting cleanly to each screen size. Semantic HTML, keyboard-accessible interactions, sufficient color contrast, and graceful handling of missing or malformed content MUST be treated as non-negotiable quality requirements.

### III. Data-UI Independence
Portfolio content MUST be stored independently from presentation logic so profile updates, project entries, skills, education, experience, and achievements can be changed without rewriting the interface. The content architecture MAY use JSON, Markdown, or a structured combination, but it MUST remain machine-readable, easy to extend, and compatible with future AI-assisted workflows.

### IV. Static, Reliable Deployment
The site MUST be deployable directly through GitHub Pages without requiring a custom backend, database, server-side runtime, or paid hosting. Core functionality MUST run as static assets only, with no required secrets or runtime service dependencies.

### V. Maintainability and Minimal Complexity
The implementation MUST prioritize clean, readable, modular code and avoid unnecessary abstraction, duplication, and overengineering. Native HTML, CSS, and JavaScript SHOULD be used by default; any dependency MUST have a clear justification, minimal scope, and no hidden operational cost.

## Additional Constraints
The portfolio architecture MUST support extensibility without requiring a rewrite of existing sections. Missing, malformed, or unknown optional content MUST fail gracefully and render with sensible fallbacks instead of breaking the page. Performance MUST remain lightweight, with fast load times, limited network requests, and no unnecessary assets. Future AI integration MUST preserve structured, machine-readable data while keeping API keys and secrets out of client-side code.

## Development Workflow
All changes MUST be reviewed manually for correctness, responsiveness, rendering quality, accessibility, and GitHub Pages compatibility. Automated tests are explicitly prohibited under this project policy; verification MUST rely on code review and manual inspection. Any significant architectural change or deviation from these principles MUST be explained before implementation and documented in the project record.

## Governance
This Constitution governs the portfolio project and supersedes ad hoc practice when requirements conflict. Amendments require clear documentation of the changed principle or policy, rationale for the decision, and review of impact on compatibility, accessibility, and deployment. Versioning follows semantic versioning: MAJOR for backward-incompatible governance changes, MINOR for new or materially expanded principles, and PATCH for clarifications or non-semantic edits. Compliance is reviewed through project review and manual verification before release, and any unresolved conflict or missing governance detail must be resolved before deployment.

**Version**: 1.0.0 | **Ratified**: 2026-10-26 | **Last Amended**: 2026-10-26
