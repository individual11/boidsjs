# Contributing to boidsJS

First off, thank you for considering contributing to `boidsJS`! It's people like you that make open source such a great community.

## Code of Conduct

By participating in this project, you agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md). Please report any unacceptable behavior to david@individual11.com.

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please check if it already exists in the Issues tab. If not, open a new issue using the **Bug report** template. Please include clear reproduction steps and a minimal code snippet if possible.

### Suggesting Enhancements
Have an idea for a new feature? Awesome! Open an issue using the **Feature request** template. Let's discuss it before you start writing code to ensure it aligns with the [Roadmap](./ROADMAP.md).

### First Code Contribution
1. **Fork the repo** and create your branch from `main`.
2. **Install dependencies**: `yarn install`
3. **Run the demo**: `yarn dev` to see your changes locally live.
4. **Run the tests**: `yarn test` to make sure you haven't broken any existing behavior.
5. **Add tests**: If you're adding a feature, add unit tests. If you're fixing a bug, add a test that prevents it from recurring.
6. **Ensure tests pass**: `yarn test`
7. **Create a Pull Request**: Follow the PR template.

## Local Development Setup

The `boidsJS` library is built with Vite and TypeScript.

```bash
# Clone the repository (or your fork)
git clone https://github.com/individual11/boidsjs.git
cd boidsjs

# Install dependencies
yarn install

# Start the development server (loads a demo playground)
yarn dev

# Run the test suite
yarn test

# Check test coverage
yarn test:coverage

# Build the library for production
yarn build
```

## Pull Requests
- Fill in the required template.
- Do not include issue numbers in the PR title.
- Keep PRs focused. If you're fixing a bug and adding a feature, split them into two PRs.
