# GITHUB & CODE STANDARDS - 2-HOUR HACKATHON

## 1. 100% English Codebase (Strict Requirement)
Every single line of code and repository history MUST be written in **English**. No exceptions.
- **Identifiers:** All variables, functions, classes, components, files, folders, and database schemas must be named in English.
- **Comments & Documentation:** Any inline comments or technical notes must be in English.
- **Naming Conventions:**
  - Components / Classes: `PascalCase`
  - Variables / Functions / Methods: `camelCase`
  - Constants / Environment Variables: `UPPER_SNAKE_CASE`
  - Database / Keys: `snake_case`

## 2. Branching Strategy (`develop` -> `main`)
To move fast without breaking the final deliverable, we use a strict two-branch flow:
- **`develop` (Active Integration Branch):** All ongoing work goes here. Everything the team builds during the hackathon is integrated into `develop`.
- **`main` (Final Release Branch):** Untouched during development. We ONLY merge `develop` into `main` at the very end of the hackathon when the project is ready for final delivery/presentation.

### Sync Routine (Avoid Conflicts)
1. Coordinate with the team so two people do not edit the exact same file at the same time.
2. Always pull with rebase before pushing to `develop`:
   ```bash
   git pull --rebase origin develop
   git push origin develop
   ```
3. Never push broken syntax to `develop`. Ensure the project runs before pushing.

## 3. Conventional Commits (Strictly in English)
All commit messages must follow the **Conventional Commits** format in English:

```text
<type>(<scope>): <short imperative description>
```

### Allowed Types:
- `feat`: A new feature or functionality (e.g., `feat(core): implement main calculation logic`)
- `fix`: A bug fix (e.g., `fix(ui): resolve layout overflow on mobile`)
- `style`: Visual/UI adjustments or formatting (e.g., `style(dashboard): improve card contrast and spacing`)
- `refactor`: Code change that neither fixes a bug nor adds a feature (e.g., `refactor(api): simplify data fetching response`)
- `chore`: Setup, config, or dependencies (e.g., `chore(repo): add initial project configuration`)
- `docs`: Documentation updates (e.g., `docs(readme): add setup instructions`)

### Commit Rules:
- Written strictly in **English**.
- Use the **imperative mood** ("add", "fix", "update" — NOT "added", "fixed", "updates").
- Keep it concise (under 72 characters) and lowercase.
- No period (`.`) at the end.