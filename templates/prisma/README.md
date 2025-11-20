# 🚀 Express TypeScript Prisma (PostgreSQL) Server

Bootstrapped with [**nhb-express**](https://www.npmjs.com/package/nhb-express)

---

## 📦 Features

- ✅ **TypeScript** with `ts-node` and `nodemon` for development and pre-configured `tsconfig.json`
- ✅ **Express.js** pre‑configured with custom middlewares
- ✅ **Zod** for schema validation
- ✅ **Prisma** for PostgreSQL integration
- ✅ **Stylog** from [`nhb-toolbox`](https://toolbox.nazmul-nhb.dev/docs/utilities/misc/stylog) for colorful logging
- ✅ **[nhb-scripts](https://www.npmjs.com/package/nhb-scripts)** for easy build, commit, module scaffolding, formatting, linting, and more. [see below](#️-scripts)
- ✅ **Scaffolding via CLI** – choose package manager, DB, etc.
<!-- - ✅ Built‑in [**CI/CD workflow**](#️-cicd-workflow) for automatic deployment to Vercel -->
- ✅ Pre‑set configs for ESLint, Prettier, and `nhb-scripts`

---

## 🚀 Development

Install dependencies (already done by `nhb-express` scaffold)

Run in development mode:

```bash
pnpm dev     # or npm run dev / yarn dev
# Runs on port: 4242 by default
```

---

## 📁 Structure

```ini
📁 <your-project-name>/
 ├─ 📁 .github/
 │   └─ 📁 workflows/
 │       └─ ⚙️ publish.yml     # GitHub Actions workflow for CI/CD (vercel deployment) 
 │
 ├─ 📁 .vscode/
 │   ├─ 📄 extensions.json     # Recommended Extensions for VS Code
 │   └─ 📄 settings.json       # VS Code Settings for better formatting
 │
 ├─ 📁 prisma/
 │   └─ 📄 schema.prisma       # Prisma Schema file
 │
 ├─ 📁 public/                 # Folder contains static files
 |   └─ 🖼️ favicon.png         # Favicon to show in client application(s) if supported, e.g. Browsers
 │
 ├─ 📁 scripts/                # Helper scripts for development purpose
 │
 ├─ 📁 src/
 │   ├─ 📁 app/                # All source (*.ts) files
 │   |   ├─ 📁 configs/        # App configurations (Database, ENV etc.)
 │   |   ├─ 📁 constants/      # Constant values
 │   |   ├─ 📁 errors/         # Custom error Class/processors/handlers
 │   |   ├─ 📁 middlewares/    # Custom Express middlewares
 │   |   ├─ 📁 modules/        # Feature modules (controllers, services, etc.)
 │   |   ├─ 📁 routes/         # Route definitions
 │   |   ├─ 📁 types/          # Types for the App
 │   |   └─ 📁 utilities/      # Helper functions
 │   |
 │   ├─ 📄 app.ts              # Express app setup
 │   ├─ 📄 index.d.ts          # Global type declarations
 │   └─ 📄 server.ts           # Server bootstrap
 │
 ├─ 🔒 .env                    # Environment variables
 ├─ 🚫 .gitignore              # Ignore files/folders from being pushed/committed
 ├─ 🚫 .prettierignore         # Ignore files/folders from being formatted with prettier
 ├─ ⚙️ .prettierrc.json        # Prettier config
 ├─ ⚙️ eslint.config.mjs       # ESLint config (flat config, ready for TS)
 ├─ ⚙️ nhb.scripts.config.mjs  # Config for nhb-scripts
 ├─ ⚙️ nodemon.json            # Nodemon config
 ├─ ⚙️ package.json            # Auto-generated `package.json`
 ├─ 📃 README.md               # This file
 ├─ ⚙️ tsconfig.json           # Ready to use tsconfig
 └─ ⚙️ vercel.json             # Deployment config for Vercel
```

---

## 🛠️ Scripts

- `pnpm/npm/yarn run dev` – Start in dev mode with `nodemon` and `ts-node`
- `pnpm/npm/yarn run start` – Run the built server
- `pnpm/npm/yarn run deploy` – Build the project and deploy to Vercel (`nhb-build && vercel --prod`)
- `pnpm/npm/yarn run build` – Build the project for production (`nhb-build`)
- `pnpm/npm/yarn run format` – Format the codebase (`nhb-format`)
- `pnpm/npm/yarn run lint` – Lint the code (`nhb-lint`)
- `pnpm/npm/yarn run fix` – Auto‑fix lint issues (`nhb-fix`)
- `pnpm/npm/yarn run commit` – Guided commit workflow (`nhb-commit`)
- `pnpm/npm/yarn run count` – Count exports (`nhb-count`)
- `pnpm/npm/yarn run module` – Scaffold new modules (`nhb-module`)
- `pnpm/npm/yarn run delete` – Delete any file/folder from the CLI (`nhb-delete`)
- `pnpm/npm/yarn run secret` – Generate secrets for jwt (using crypto module, just run in cli: node pnpm/npm/yarn run secret)

---
<!-- 
## ⚙️ CI/CD Workflow

A ready‑to‑use **GitHub Actions workflow** is included in:

```ini
.github/workflows/publish.yml
```

✅ **What it does:**

- Runs on push to your main branch
- Builds your project
- Deploys automatically to **Vercel** (configured via `vercel.json`)

✅ **How to use:**

1. Push your project to a GitHub repository.
2. Add your Vercel tokens/secrets as GitHub repository secrets:
    Go to `Settings >> Secrets and variables >> Actions >> Repository secrets` and add these variables:
    - `VERCEL_ORG_ID`
    - `VERCEL_PROJECT_ID`
    - `VERCEL_TOKEN`
3. Every time you push to `main` and _version is updated_, GitHub Actions will trigger and deploy your server to Vercel.

You can customize the workflow to fit your own CI/CD needs (e.g., change branches, add tests, deploy elsewhere).

---

Made with ❤️ by [Nazmul Hassan](https://github.com/nazmul-nhb)

**Powered by `nhb-express`** 🚀 -->
