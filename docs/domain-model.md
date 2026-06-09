# OpsFlow Domain Model

## Core Entities

```
Project (required) → ownership boundary, key namespace
  ├── Epic (optional) → planning container
  │     ├── Issue (required project) → executable work item
  │     └── Issue
  └── Issue without epic
```

## Project

- Ownership boundary — issues and epics belong to exactly one project
- Key namespace — issue keys are formatted as `PROJECTKEY-NUMBER` (e.g., OPS-101)
- Contains epics and issues
- UI context — project switcher scopes views, filters, and saved views

### Fields
- `key` (unique, uppercase, 2-8 chars)
- `name`
- `description`
- `lead_id` (optional, references user)

## Epic

- Optional planning container
- Belongs to exactly one project
- Groups related issues
- Does not require its own key

### Statuses
- `planned`
- `in_progress`
- `done`
- `cancelled`

## Issue

- Executable work item
- Belongs to exactly one project (required)
- May optionally belong to one epic
- Has type, status, priority, assignee, reporter, comments, activity, SLA

### Issue Types
- `bug` — something is broken
- `task` — work to be done
- `story` — user-facing feature work
- `improvement` — enhancement to existing functionality
- `incident` — service disruption

### Issue Key Format
`PROJECTKEY-NUMBER` where NUMBER is auto-incremented per project.

Example: OPS-105, MRKT-42, MOB-7

## Important Distinctions

### Issue Type vs. Category

- **Issue Type** = what kind of work is this? (bug, task, story, improvement, incident)
- **Category** = what area/domain is affected? (access, billing, infrastructure, etc.)

Both fields coexist on the issue.

### Ticket vs. Issue

In OpsFlow, the two terms are currently synonymous. The backend database table
is still named `tickets` and backend module code uses "ticket" terminology. The
UI and API responses use "issue" terminology. This dual naming is a known
trade-off pending a future rename migration.

## API Route Structure

| Route | Description |
|-------|-------------|
| `GET /projects` | List all projects |
| `GET /projects/:key` | Get project by key |
| `GET /projects/:key/epics` | List epics for project |
| `GET /projects/:key/issues` | List issues for project |
| `GET /projects/:key/issues/:issueKey` | Get issue by key |
| `POST /projects/:key/issues` | Create issue under project |
| `PATCH /tickets/:id/status` | Legacy: update issue status |
| `PATCH /tickets/:id/assignee` | Legacy: update issue assignee |
| `GET /tickets/:id/comments` | Legacy: get comments |
| `POST /tickets/:id/comments` | Legacy: add comment |
| `GET /tickets/:id/activity` | Legacy: get activity |

## Migration Note

The backend table `tickets` was extended with project/epic columns rather than
renamed to `issues`. This avoids a risky full-table rename. Backend module code
continues to use "ticket" terminology. The UI exclusively uses "Issue/Issues".
