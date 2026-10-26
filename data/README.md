# Portfolio content

Replace every `[PLACEHOLDER: ...]` value in these files with candidate-approved
content before deployment. The site intentionally shows placeholders so missing
candidate information is obvious; do not publish them as factual claims.

## Files and shapes

Each JSON file has a `schemaVersion` of `"1.0"`. The profile document stores one
object under `profile`; each other document stores records in an `items` array.
Keep each entry's `id` non-empty and unique within its file when adding or
editing records.

| File | Payload |
| --- | --- |
| `profile.json` | `profile`: `name`, optional `headline`, `summary`, `location`, and `contact` |
| `skills.json` | `items`: `id`, `name`, optional `category` and `level` |
| `education.json` | `items`: `id`, required `institution`, optional `qualification`, `fieldOfStudy`, `startDate`, `endDate`, and `description` |
| `experience.json` | `items`: `id`, required `role` and `organization`, optional `startDate`, `endDate`, `description`, `achievements`, and `skills` |
| `projects.json` | `items`: `id`, required `title`, optional `description`, `role`, `technologies`, `outcomes`, `links`, and `image` |
| `achievements.json` | `items`: `id`, required `title`, optional `issuer`, `date`, `description`, and `links` |

Dates use `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`; an experience `endDate` may be
`null` for a current role. Optional text arrays may contain only non-empty
strings. A link has a non-empty `label` and an absolute `https:` or `mailto:`
`url`. Project images must be local files under `assets/images/`; invalid or
unavailable images are omitted. The renderer treats every content value as
plain text, not HTML.

Example project record:

```json
{
  "id": "project-identifier",
  "title": "Project title",
  "description": "A short plain-text overview.",
  "role": "Your role",
  "technologies": ["Technology"],
  "outcomes": ["A factual result"],
  "links": [
    { "label": "View project", "url": "https://example.com/project" }
  ]
}
```

The loader validates each section independently. It keeps valid records,
omits invalid records and optional fields, ignores unknown fields, and shows
one brief notice if content is unavailable or skipped. Preserve the schema
version and stable record IDs as the data evolves.

## Future scope

AI-generated resumes, job-description matching, and skill-gap analysis are
outside v1. Future tools may consume this structured data, but the current site
has no AI runtime, API calls, or client-side credentials.
