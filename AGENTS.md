# Asset Guard

## Product Context

Asset Guard is an asset management application.

There are two user roles:

- `admin`: Create asset types, create assets, assign assets to staff, and review asset assignment history.
- `staff`: Receive and work with assigned assets.

Core domains to preserve in the UI and data model:

- `asset-types`: Categories or templates for assets.
- `assets`: Individual trackable items.
- `staff`: Assignees for assets.
- `assignments`: Active asset-to-staff relationships.
- `assignment-history`: Historical log of assignment activity for auditing.

## Product Rules

- Treat assignment history as an audit trail. Do not design flows that silently overwrite or hide historical assignment events.
- Keep role boundaries explicit. Admin-only actions must not leak into staff-facing UI.
- Prefer workflows that make asset status, assignee, and timeline obvious.
- Always include loading, empty, error, and success states for admin management flows.

## Engineering Expectations

- Use TypeScript and the Next.js App Router patterns already present in this repo.
- Prefer Server Components by default; use Client Components only for interactivity that requires browser state or event handlers.
- Organize code by feature as the app grows. Keep asset types, assets, assignments, and history easy to locate.
- Keep business rules close to the feature they belong to and avoid duplicating role or assignment logic across pages.
- Preserve accessibility: semantic landmarks, labeled controls, keyboard support, and table/form usability.
- Build responsive layouts that work for admin dashboards and staff views on laptop and mobile screens.

## Testing Expectations

- Add tests for business-critical logic, especially assignment flows, role-gated UI, and audit/history behavior.
- Cover admin workflows such as creating an asset type, creating an asset, assigning an asset, and viewing assignment history.
- Prefer tests that protect behavior, not snapshots that only mirror markup.

## Working In This Repo

- `npm run dev` starts the local Next.js app.
- `npm run lint` is the current quality gate available in the repo.
- If new tooling is introduced for testing or formatting, keep it lightweight and document the expected commands near the setup.
