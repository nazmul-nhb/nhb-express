# 🚀 Scaffold Express + TypeScript Server

<p>
  <a href="https://www.npmjs.com/package/nhb-express" aria-label="Downloads">
    <img src="https://img.shields.io/npm/dm/nhb-express.svg?label=DOWNLOADS&style=flat&color=red&logo=npm" alt="Downloads" />
  </a>
  <a href="https://www.npmjs.com/package/nhb-express" aria-label="Version">
    <img src="https://img.shields.io/npm/v/nhb-express.svg?label=nhb-express&style=flat&color=teal&logo=npm" alt="Latest Version" />
  </a>
  <a href="https://www.npmjs.com/package/nhb-express" aria-label="License">
    <img src="https://img.shields.io/npm/l/nhb-express.svg?label=LICENSE&style=flat&color=orange&logo=open-source-initiative" alt="License" />
  </a>
</p>

Quickly bootstrap a production‑ready **Express + TypeScript + Zod** server with a single command.

> 3 Built-in templates for `MongoDB + Mongoose`, `PostgreSQL + Prisma` and `PostgreSQL + Drizzle`

## ⚡ Compatibility

<img src="https://img.shields.io/badge/Node.js-Version%2022+-teal?style=flat&logo=node.js&logoColor=green" alt="Node.js 22+" />

### ✅ Requirements

- Node.js **22 or newer**
- Stable internet connection
- `npm`, `pnpm`, or `yarn` for installation

---

## ✨ Features

- ✅ **TypeScript** with `ts-node` and `nodemon` for development and pre-configured `tsconfig.json`
- ✅ **Express.js** pre‑configured with custom middlewares
- ✅ **Zod** for schema validation
- ✅ **Mongoose** for `MongoDB` integration
- ✅ **Drizzle** or **Prisma** for `PostgreSQL` integration
- ✅ **Stylog** from [`nhb-toolbox`](https://toolbox.nazmul-nhb.dev/docs/utilities/misc/stylog) for colorful logging
- ✅ **Biome** or **Prettier** + **ESLint** for code formatting and linting (your choice during setup)
- ✅ **[nhb-scripts](https://www.npmjs.com/package/nhb-scripts)** for easy build, commit, module scaffolding, and more
- ✅ **Scaffolding via CLI** – choose package manager, DB, ORM/ODM etc.
- ✅ Built‑in [**CI/CD workflow**](#️-cicd-workflow) for automatic deployment to Vercel

---

## 📦 Usage

You don’t need to install anything globally. Run directly with your favorite package manager:

```bash
# Using npx
npx nhb-express@latest

# Using pnpm
pnpm dlx nhb-express@latest

# Using yarn
yarn dlx nhb-express@latest
```

Follow the interactive prompts:

- Choose a **project name**
- Select a **database** and **ODM/ORM**. Default is `MongoDB` + `Mongoose`.
- Select between `Biome` or `Prettier`+`ESLint` as your **code formatter** and **linter**. Default is `Biome`.
- Pick your **package manager**

Your new server will be scaffolded in the chosen folder with all dependencies installed.

---

## 🚀 Quick Start

After running the CLI:

```bash
cd <your-project-name>
pnpm dev     # or npm run dev / yarn dev
# Runs on port: 4242
```

---

## 📁 Project Structure

### Mongoose

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
 ├─ 📁 public/                 # Folder contains static files
 |   └─ 🖼️ favicon.png         # Favicon to show in client application(s) if supported, e.g. Browsers
 │
 ├─ 📁 scripts/                # Helper scripts for development purpose
 │
 ├─ 📁 src/
 │   ├─ 📁 app/                # All source (*.ts) files
 │   |   ├─ 📁 classes/        # Utility classes e.g. `QueryBuilder`, `ErrorWihStatus`
 │   |   ├─ 📁 configs/        # App configurations
 │   |   ├─ 📁 constants/      # Constant values
 │   |   ├─ 📁 errors/         # Custom error processors/handlers
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
 ├─ 🚫 .prettierignore         # Ignore files/folders from being formatted with prettier (used if Prettier is selected as formatter)
 ├─ ⚙️ .prettierrc.json        # Prettier config (used if Prettier is selected as formatter)
 ├─ ⚙️ biome.json              # Biome config (used if Biome is selected as formatter)
 ├─ ⚙️ eslint.config.mjs       # ESLint config (used if Prettier + ESLint is selected: flat config, ready for TS)
 ├─ ⚙️ nhb.scripts.config.mjs  # Config for nhb-scripts
 ├─ ⚙️ nodemon.json            # Nodemon config
 ├─ ⚙️ package.json            # Auto-generated `package.json`
 ├─ 📃 README.md               # This file
 ├─ ⚙️ tsconfig.json           # Ready to use tsconfig
 └─ ⚙️ vercel.json             # Deployment config for Vercel
```

### Prisma

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
 │   |   ├─ 📁 configs/        # App configurations (CORS, Database, ENV etc.)
 │   |   ├─ 📁 constants/      # Constant values
 │   |   ├─ 📁 errors/         # Custom error Class/processors/handlers
 │   |   ├─ 📁 middlewares/    # Custom Express middlewares
 │   |   ├─ 📁 modules/        # Feature modules (controllers, services, etc.)
 │   |   ├─ 📁 routes/         # Route definitions
 │   |   ├─ 📁 types/          # Types for the App
 │   |   └─ 📁 utilities/      # Helper functions
 │   | 
 │   ├─ 📁 prisma/             # Prisma Client generated files
 │   |
 │   ├─ 📄 app.ts              # Express app setup
 │   ├─ 📄 index.d.ts          # Global type declarations
 │   └─ 📄 server.ts           # Server bootstrap
 │
 ├─ 🔒 .env                    # Environment variables
 ├─ 🚫 .gitignore              # Ignore files/folders from being pushed/committed
 ├─ 🚫 .prettierignore         # Ignore files/folders from being formatted with prettier (used if Prettier is selected as formatter)
 ├─ ⚙️ .prettierrc.json        # Prettier config (used if Prettier is selected as formatter)
 ├─ ⚙️ biome.json              # Biome config (used if Biome is selected as formatter)
 ├─ ⚙️ eslint.config.mjs       # ESLint config (used if Prettier + ESLint is selected: flat config, ready for TS)
 ├─ ⚙️ nhb.scripts.config.mjs  # Config for nhb-scripts
 ├─ ⚙️ nodemon.json            # Nodemon config
 ├─ ⚙️ prisma.config.ts        # Prisma config
 ├─ ⚙️ package.json            # Auto-generated `package.json`
 ├─ 📃 README.md               # Instructions and information
 ├─ ⚙️ tsconfig.json           # Ready to use tsconfig
 └─ ⚙️ vercel.json             # Deployment config for Vercel
```

### Drizzle

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
 ├─ 📁 migrations/             # Migration files (will be) generated by drizzle-kit 
 │
 ├─ 📁 public/                 # Folder contains static files
 |   └─ 🖼️ favicon.png         # Favicon to show in client application(s) if supported, e.g. Browsers
 │
 ├─ 📁 scripts/                # Helper scripts for development purpose
 │
 ├─ 📁 src/                    # All source (*.ts) files
 │   ├─ 📁 app/                # Application logic and internal configs
 │   |   ├─ 📁 configs/        # App configurations (CORS, ENV etc.)
 │   |   ├─ 📁 constants/      # Constant values
 │   |   ├─ 📁 errors/         # Custom error Class/processors/handlers
 │   |   ├─ 📁 middlewares/    # Custom Express middlewares
 │   |   ├─ 📁 modules/        # Feature modules (controllers, services, etc.)
 │   |   ├─ 📁 routes/         # Route configuration
 │   |   ├─ 📁 types/          # Types for the App
 │   |   └─ 📁 utilities/      # Helper functions
 │   |
 │   ├─ 📁 drizzle/            # Drizzle schema and initialization
 │   |   ├─ 📁 schema/         # Contains drizzle schemas
 │   |   └─ 📄 index.ts        # Drizzle initialization with all schemas
 │   |
 │   ├─ 📄 app.ts              # Express app setup
 │   ├─ 📄 index.d.ts          # Global type declarations
 │   └─ 📄 server.ts           # Server bootstrap
 │
 ├─ 🔒 .env                    # Environment variables
 ├─ 🚫 .gitignore              # Ignore files/folders from being pushed/committed
 ├─ 🚫 .prettierignore         # Ignore files/folders from being formatted with prettier (used if Prettier is selected as formatter)
 ├─ ⚙️ .prettierrc.json        # Prettier config (used if Prettier is selected as formatter)
 ├─ ⚙️ biome.json              # Biome config (used if Biome is selected as formatter)
 ├─ ⚙️ eslint.config.mjs       # ESLint config (used if Prettier + ESLint is selected: flat config, ready for TS)
 ├─ ⚙️ nhb.scripts.config.mjs  # Config for nhb-scripts
 ├─ ⚙️ nodemon.json            # Nodemon config
 ├─ ⚙️ package.json            # Auto-generated `package.json`
 ├─ 📃 README.md               # Instructions and information
 ├─ ⚙️ tsconfig.json           # Ready to use tsconfig
 └─ ⚙️ vercel.json             # Deployment config for Vercel
```

---

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

## 🛠️ nhb-scripts

This project comes integrated with **[nhb-scripts](https://www.npmjs.com/package/nhb-scripts)** — a cli package also by [Nazmul Hassan](https://github.com/nazmul-nhb):

✨ **What you get:**

- `npm/pnpm/yarn run build` → builds your project
- `npm/pnpm/yarn run commit` → guided commit with semantic messages
- `npm/pnpm/yarn run module` → scaffolds new modules
- `npm/pnpm/yarn run fix` → auto‑fix lint issues
- `npm/pnpm/yarn run format` → formats with Prettier
- and _more…_ configurable via `nhb.scripts.config.mjs`

You can explore and extend `nhb-scripts` in your project as needed.

---

## ✨ Author

Made with ❤️ by [Nazmul Hassan](https://github.com/nazmul-nhb)
