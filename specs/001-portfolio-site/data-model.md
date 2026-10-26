# Data Model: Professional Portfolio Website

## Overview

The portfolio is a public, static collection of independently loadable JSON
documents. Each document has a top-level object containing a `schemaVersion`
and the payload for one section. All list entries have stable identifiers
within their section. The data is factual portfolio content, not AI-generated
content; future tools can consume the same structured records without being
part of v1.

## Document Shapes

Every file uses a JSON object at its root and includes the string field
`schemaVersion` with value `"1.0"`.

| File | Payload property | Payload type |
|---|---|---|
| `data/profile.json` | `profile` | One Profile object |
| `data/skills.json` | `items` | Array of Skill records |
| `data/education.json` | `items` | Array of Education records |
| `data/experience.json` | `items` | Array of Experience records |
| `data/projects.json` | `items` | Array of Project records |
| `data/achievements.json` | `items` | Array of Achievement records |

The payload property is required. A missing or incorrectly typed payload makes
that document's section unavailable, without affecting other section files.

## Entities

### Profile

Stored in `data/profile.json`; represents the candidate's identity and
professional summary.

| Field | Type | Requirement | Validation and fallback |
|---|---|---|---|
| `schemaVersion` | string | Required | Must equal `"1.0"`; an unsupported version makes only the profile document unavailable. |
| `profile` | object | Required | If missing or invalid, omit profile-specific values and show the content notice. |
| `profile.name` | string | Required | Non-empty after trimming; otherwise use a generic profile heading. |
| `profile.headline` | string | Optional | Non-empty text when supplied; omit if absent or invalid. |
| `profile.summary` | string | Optional | Plain text; omit if absent or invalid. |
| `profile.location` | string | Optional | Plain text; omit if absent or invalid. |
| `profile.contact` | object | Optional | Show only valid provided contact methods. |
| `profile.contact.email` | string | Optional | Validate basic email shape; omit invalid value. |
| `profile.contact.links` | array of Link | Optional | Render only valid links. |

### Link

Embedded by profile, project, and achievement records.

| Field | Type | Requirement | Validation and fallback |
|---|---|---|---|
| `label` | string | Required | Non-empty text; omit link if invalid. |
| `url` | string | Required | Must parse as an absolute `https:` or `mailto:` URL; otherwise omit link. |

### Skill

Stored in `data/skills.json`; represents a capability or area of expertise.

| Field | Type | Requirement | Validation and fallback |
|---|---|---|---|
| `id` | string | Required | Non-empty and unique within skills; duplicate entries after the first are omitted and reported through the content notice. |
| `name` | string | Required | Non-empty text; otherwise omit record. |
| `category` | string | Optional | Plain text; omit if absent or invalid. |
| `level` | string | Optional | Free-form descriptive value; omit if absent or invalid. |

### Education

Stored in `data/education.json`; represents an academic qualification or
credential.

| Field | Type | Requirement | Validation and fallback |
|---|---|---|---|
| `id` | string | Required | Non-empty and unique within education. |
| `institution` | string | Required | Non-empty text; otherwise omit record. |
| `qualification` | string | Optional | Plain text; omit if absent or invalid. |
| `fieldOfStudy` | string | Optional | Plain text; omit if absent or invalid. |
| `startDate` | string | Optional | ISO date or year-month; omit if invalid. |
| `endDate` | string | Optional | ISO date or year-month; omit if invalid. |
| `description` | string | Optional | Plain text; omit if absent or invalid. |

### Experience

Stored in `data/experience.json`; represents a role and its professional
outcomes.

| Field | Type | Requirement | Validation and fallback |
|---|---|---|---|
| `id` | string | Required | Non-empty and unique within experience. |
| `role` | string | Required | Non-empty text; otherwise omit record. |
| `organization` | string | Required | Non-empty text; otherwise omit record. |
| `startDate` | string | Optional | ISO date or year-month; omit if invalid. |
| `endDate` | string or null | Optional | ISO date or year-month; `null` may represent current role. |
| `description` | string | Optional | Plain text; omit if absent or invalid. |
| `achievements` | array of strings | Optional | Keep valid non-empty strings; omit invalid entries. |
| `skills` | array of strings | Optional | Keep valid non-empty skill names; omit invalid entries. |

### Project

Stored in `data/projects.json`; represents a selected piece of work and its
results.

| Field | Type | Requirement | Validation and fallback |
|---|---|---|---|
| `id` | string | Required | Non-empty and unique within projects. |
| `title` | string | Required | Non-empty text; otherwise omit record. |
| `description` | string | Optional | Plain text; omit if absent or invalid. |
| `role` | string | Optional | Plain text; omit if absent or invalid. |
| `technologies` | array of strings | Optional | Keep valid non-empty values; omit invalid entries. |
| `outcomes` | array of strings | Optional | Keep valid non-empty values; omit invalid entries. |
| `links` | array of Link | Optional | Render only valid links. |
| `image` | string | Optional | Relative path to a local asset; omit if invalid or absent. |

### Achievement

Stored in `data/achievements.json`; represents an award, certification, or
other notable accomplishment.

| Field | Type | Requirement | Validation and fallback |
|---|---|---|---|
| `id` | string | Required | Non-empty and unique within achievements. |
| `title` | string | Required | Non-empty text; otherwise omit record. |
| `issuer` | string | Optional | Plain text; omit if absent or invalid. |
| `date` | string | Optional | ISO date or year-month; omit if invalid. |
| `description` | string | Optional | Plain text; omit if absent or invalid. |
| `links` | array of Link | Optional | Render only valid links. |

## Relationships and Identity

- The portfolio collection comprises one Profile and zero or more records in
  Skills, Education, Experience, Projects, and Achievements.
- Each collection has its own document and validation boundary.
- Record IDs are unique within their section, not globally. They provide stable
  references for future tools and content updates.
- Skill names may be repeated across projects and experience; no foreign-key
  relationship is required in v1.
- No content is user-edited at runtime. The candidate updates the static source
  files before deployment.

## Validation and Failure Rules

1. Each file must parse as JSON and have the expected top-level object and
   `schemaVersion` of `"1.0"` and section payload shape. Failure marks only
   that section unavailable.
2. A section payload must be an array for list sections. A non-array payload
   marks only that section unavailable.
3. Validate records independently. Omit records missing required fields,
   records with wrong field types, and duplicate IDs; retain valid siblings.
4. Optional invalid fields and unknown fields are ignored. Valid fields on a
   record remain renderable if another optional field is invalid.
5. Optional missing values do not create empty labels or broken links.
6. When any file or record is omitted, show one concise, non-technical notice
   while keeping valid sections visible.
7. Use plain text rendering for data values. Do not treat content strings as
   markup. Links are limited to the permitted schemes described above.
8. If all useful content is unavailable, show the notice and a generic
   portfolio fallback rather than a blank page.

## Extensibility

Add data fields as optional first, ignore unrecognized fields in the current
renderer, and preserve stable IDs. Adding a new collection or visible section
requires a deliberate UI change and updated contract, but existing sections
remain independent and functional.
