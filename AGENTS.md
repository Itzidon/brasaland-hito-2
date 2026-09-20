# AGENTS.md — Brasaland

## Purpose

This file defines how any coding agent must operate inside the Brasaland monorepo.

All agents must understand the business context, technical constraints and current project status before modifying code.

## Mandatory context to read

Before making any change, the agent must read:

1. `CONTEXT.md`
2. `memory-bank/projectbrief.md`
3. `memory-bank/techContext.md`
4. `memory-bank/progress.md`
5. The `README.md` of any folder that will be modified

The agent must not start implementation before reviewing this context.

## Project structure

Application code must respect the existing monorepo structure:

- `uis/website` → public-facing Brasaland website
- `uis/backoffice` → internal Brasaland applications
- `services/` → backend services and APIs
- `.agents/rules/` → specific coding-agent rules
- `.agents/skills/` → reusable coding-agent skills
- `memory-bank/` → persistent project context

Do not create duplicate folders for functionality that already has an assigned location.

## Brasaland Talent Pipeline rules

The current internal application supports Brasaland's recruitment process.

The following business rules are mandatory:

- API status values must never be displayed directly to users.
- API stage values must never be displayed directly to users.
- Use human-readable Spanish labels in the UI.
- Internal candidate notes must only be visible in the candidate detail view.
- Candidate search and filters must work without a full page reload.
- The candidate registration form must include all fields required by the API.

## Development workflow

Before every commit, the agent must complete the following delivery workflow:

1. **Review context**
   - Re-read the relevant project context and rules.
   - Confirm that the implementation matches the Brasaland requirements.

2. **Review changes**
   - Run `git status`.
   - Run `git diff`.
   - Check that no unrelated files or accidental changes are included.

3. **Validate implementation**
   - Run the relevant build, lint or test commands available for the modified application.
   - Fix errors before continuing.
   - Manually verify the affected user-facing functionality when applicable.

4. **Verify business rules**
   - Confirm that raw API status and stage values are not visible in the UI.
   - Confirm that internal notes remain restricted to candidate detail views.
   - Confirm that the implementation follows the structure defined by the monorepo.

5. **Update project memory**
   - Update `memory-bank/progress.md` when features are completed or project status changes.
   - Update technical or business memory files when new decisions are introduced.

6. **Final delivery check**
   - Run `git status` again.
   - Confirm that the branch is correct.
   - Only then create the commit.

## Commit policy

Commits should:

- Have a clear and descriptive message.
- Include only changes related to the current task.
- Never include secrets, credentials or environment files containing sensitive values.
- Be created only after completing the delivery workflow above.

## When the agent must stop and ask

The agent must stop and request clarification when:

- A requested change conflicts with `CONTEXT.md`.
- A business rule is unclear.
- A change would require altering the backend API contract.
- Required information is missing.
- A destructive action could remove or overwrite existing work.
- A decision would significantly change the project architecture.

The agent must not invent business rules or API fields.

## Memory maintenance

The memory bank is active project context and must evolve with the repository.

When the project changes:

- Update `projectbrief.md` if the business scope changes.
- Update `techContext.md` if architecture or technology decisions change.
- Update `progress.md` when implementation progress changes.

Outdated memory must not be treated as valid project context.