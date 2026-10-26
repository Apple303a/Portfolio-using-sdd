# Portfolio User Interface Contract

## Visitor-Facing Sections

The single-page site presents these named content areas when data is available:

- Profile and professional summary
- Skills
- Experience
- Projects
- Education
- Achievements

Navigation links target the corresponding sections on the current page. Missing
or unavailable sections do not leave broken navigation targets.

## Responsive and Accessible Behavior

- Content must remain available at mobile, tablet, and desktop widths without
  horizontal page scrolling.
- Use semantic landmarks and heading order to communicate the content
  hierarchy.
- All interactive controls and navigation must be keyboard-operable and have
  visible focus indication.
- Text and controls must meet WCAG 2.1 AA contrast requirements.
- Link labels must describe their destination; external links must not appear
  as unlabeled icons.
- Content values are displayed as text, not interpreted as HTML.

## Content Failure Behavior

- A missing or invalid section does not hide other valid sections.
- Invalid records are omitted while valid sibling records remain visible.
- Missing optional values are omitted or replaced with their documented
  fallback.
- Unknown fields do not change rendering or prevent valid records from
  appearing.
- If any content is unavailable or skipped, display one short,
  non-technical notice. Do not expose parser errors, stack traces, or file paths
  to visitors.
- If no usable portfolio content can be loaded, present a generic fallback and
  the notice rather than a blank page.

## Deployment and Navigation

- Asset and content references must resolve when the site is hosted at a
  repository subpath on GitHub Pages.
- Use document-relative asset/data URLs; do not assume the website is mounted
  at the hostname root.
- Section navigation uses in-page anchors; the first release does not expose
  backend endpoints or AI services.
