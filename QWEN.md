# Qwen Code Customization

This file contains custom instructions for interacting with Qwen Code in this project.

## Project Information
- Project Name: Questionnaire
- Main Technologies: 
  - Frontend: Vue 3, TypeScript, Vite
  - State Management: Pinia
  - Routing: Vue Router
  - UI Framework: Element Plus
  - Testing: Vitest, Vue Test Utils
  - Build Tool: Vite
  - Package Manager: pnpm
  - CSS Preprocessor: SCSS

## Code Style and Conventions
- Use Composition API with `<script setup>`.
- Use TypeScript for all Vue components and ts files.
- Follow the existing folder structure.
- Use PascalCase for component names.
- Use hyphen-case for file names.
- Use kebab-case for CSS class names.

## Common Tasks
1. To run the project: `pnpm dev`
2. To build the project: `pnpm build`
3. To run tests: `pnpm test`
4. To lint the code: `pnpm lint`

## Branching Strategy
- main: Production-ready code
- develop: Development branch
- feature/*: Feature branches
- hotfix/*: Hotfix branches

## Deployment
- The application is deployed automatically on merge to main branch.

## Additional Notes
- Always check the .env files for environment-specific variables.
- Make sure to update the README.md when adding new features or making significant changes.