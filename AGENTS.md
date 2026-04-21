# AGENTS.md - Guide for AI Coding Agents

This document provides guidelines for AI agents working on the Ignis CLI codebase.

## Build, Test & Development Commands

```bash
# Install dependencies
npm install

# Link CLI globally for testing
npm link

# Run CLI locally
npm run dev              # Runs: ./bin/ignis.js
ignis --help             # After npm link

# Test (currently no tests configured)
npm test                 # Shows: "Error: no test specified"
```

**To add tests:** Install Jest (`npm install --save-dev jest`) and configure in `package.json`.

---

## Code Style Guidelines

### Language & Module System
- **Language:** JavaScript (ES6+), **CommonJS modules** (NOT ESM)
- Always use `require()` for imports and `module.exports` for exports
- Do NOT use `import`/`export` syntax

### Imports
Use `const` for all imports, order alphabetically by module name, one per line.

```javascript
const fs = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
```

### Quotes & Semicolons
- **Use double quotes** (`"`) for all strings
- **Use semicolons** at the end of every statement
- No trailing commas in objects

```javascript
// ✅ CORRECT
const message = "Hello world";
const config = { key: "value", another: "data" };

// ❌ WRONG
const message = 'Hello world';
const config = { key: "value", another: "data", };
```

### Naming Conventions
- **Variables/Functions:** camelCase
- **Constants:** UPPER_SNAKE_CASE for true constants
- **Command files:** camelCase (e.g., `deleteCommand`, not `delete-command`)
- **File names:** camelCase (e.g., `helper.js`, `genericGenerator.js`)

```javascript
// ✅ CORRECT
const isValidUrl = true;
const DEFAULT_TIMEOUT = 5000;
function deleteCommand(program) { }

// ❌ WRONG
const is_valid_url = true;
const DeleteCommand = function() { };
```

### Formatting & Indentation
- **Indentation:** 2 spaces (soft tabs)
- **Line length:** Max 100 characters
- **No blank lines inside function bodies** unless logically separating blocks
- **One blank line** between top-level declarations

```javascript
// ✅ CORRECT
function processData(input) {
  const result = transform(input);

  if (result) {
    return result.value;
  }

  return defaultValue;
}
```

### Async/Await Pattern
- Prefer `async/await` over Promise chains
- Always wrap async operations in `try/catch`
- Handle errors with descriptive messages

```javascript
async function createProject(targetPath) {
  try {
    await fs.ensureDir(targetPath);
    await fs.copy(templatePath, targetPath);
    console.log("✅ Project created successfully");
  } catch (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }
}
```

### Error Handling
- Use `try/catch` for all async operations
- Throw `Error` objects with descriptive messages
- Console errors should be user-friendly (use emojis for CLI)

### CLI Commands (commander.js)
- Command functions register themselves and return nothing
- Name handlers as `functionName(program)` pattern
- Use `console.error()` for errors, `console.log()` for success

```javascript
function initCommand(program) {
  program
    .command('init')
    .description('Initialize a new project')
    .option('-n, --name <name>', 'Project name')
    .action(async (options) => { /* implementation */ });
}

module.exports = initCommand;
```

## File Structure
```
ignis-cli/
├── bin/ignis.js           # CLI entry point (orchestrates commands)
├── commands/*.js          # Each command exports a register function
├── config/frameworks.json # Configuration file
├── utils/*.js             # Helper functions (named exports)
├── generators/*.js        # Generator logic
└── package.json
```

Commands register themselves to the commander program. The main `bin/ignis.js` imports and invokes each command.

### Key Dependencies
- `commander` - CLI argument parsing
- `inquirer` - Interactive prompts (use `inq.default.prompt()`)
- `fs-extra` - File operations (preferred over native `fs`)
- `path` - Path manipulation (use `path.resolve()`, NOT string concatenation)

---

## Important Notes

1. **No TypeScript** in this project - plain JavaScript only
2. **No ESLint/Prettier** configured - follow this guide manually
3. **Config file** (`frameworks.json`) is JSON, not JS - do not add comments
4. **Template paths** use `path.resolve()` for cross-platform compatibility
5. **Always validate inputs** from CLI arguments before processing
