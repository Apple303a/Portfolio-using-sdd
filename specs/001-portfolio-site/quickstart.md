# Quickstart: Manual Portfolio Review

This guide describes manual inspection after implementation. It does not add
or run automated tests.

## Prerequisites

- A current desktop browser.
- A local static-file server to allow the browser to fetch JSON content.
- A checkout containing the portfolio source files.

## Run Locally

From the project root, start a simple static server:

```powershell
py -m http.server 8000
```

Open `http://localhost:8000/` in the browser. Stop the server with `Ctrl+C`
after inspection.

## Manual Review Scenarios

1. **Primary portfolio review**: Confirm profile, skills, experience, projects,
   education, and achievements display with expected titles and readable text.
2. **Responsive layout**: Inspect narrow mobile, tablet, and desktop viewport
   sizes. Confirm navigation remains usable and no page-level horizontal
   scrolling or clipped content appears.
3. **Keyboard and accessibility**: Navigate without a mouse, check visible
   focus, follow in-page links, inspect semantic headings/landmarks, and review
   text and control contrast against WCAG 2.1 AA requirements.
4. **Content update**: Edit a value or add a valid record in one section JSON
   file. Reload and confirm it appears without changing presentation or
   rendering code.
5. **Malformed section recovery**: In a temporary local copy, make one
   section's JSON invalid. Reload and confirm unaffected sections remain
   visible and a brief, non-technical notice appears. Restore the valid source
   file after this check.
6. **Malformed record recovery**: In a temporary local copy, add a record with
   a missing required field and an unknown optional field. Confirm the invalid
   record is omitted, valid siblings still appear, and the notice is shown.
7. **GitHub Pages subpath compatibility**: Review generated and authored
   references for document-relative URLs. After deployment, open the project
   site at its repository path and confirm CSS, scripts, images, and JSON load.

## Expected Outcome

The site remains usable with valid content, content changes do not require
presentation edits, malformed data affects only the relevant section or
record, and the static site functions under both local hosting and a GitHub
Pages repository subpath.
