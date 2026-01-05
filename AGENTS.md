# AI Agents Guide - sooniter.site

This project is a documentation site built with [Rspress](https://rspress.dev/).

## Project Structure

- `docs/`: Contains all the documentation content.
  - `zh/`: Chinese documentation and blog posts.
  - `en/`: English documentation.
  - `public/`: Static assets (images, etc.).
- `rspress.config.ts`: Rspress configuration file.
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `.prettierrc`: Prettier configuration for code formatting.

## Development Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the site for production.
- `pnpm preview`: Previews the production build locally.

### Linting and Formatting

We use Prettier to maintain a consistent code style.

- `pnpm lint`: Checks if the codebase adheres to the Prettier formatting rules.
- `pnpm format`: Automatically formats the codebase using Prettier.

Please ensure you run `pnpm format` before committing your changes.
