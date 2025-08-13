# 🚀 Scaffold Express + TypeScript Server

<p>
  <a href="https://www.npmjs.com/package/nhb-express" aria-label="Downloads">
    <img src="https://img.shields.io/npm/dm/nhb-express.svg?label=DOWNLOADS&style=flat&color=red&logo=npm" alt="Downloads" />
  </a>
  <a href="https://www.npmjs.com/package/nhb-express" aria-label="Version">
    <img src="https://img.shields.io/npm/v/nhb-express.svg?label=nhb-express&style=flat&color=teal&logo=npm" alt="Latest Version" />
  </a>
  <!-- <a href="https://bundlephobia.com/result?p=nhb-express" aria-label="Bundle size">
    <img src="https://img.shields.io/bundlephobia/minzip/nhb-express?style=flat&color=purple&label=SIZE&logo=nodedotjs" alt="Bundle Size" />
  </a> -->
  <a href="https://www.npmjs.com/package/nhb-express" aria-label="License">
    <img src="https://img.shields.io/npm/l/nhb-express.svg?label=LICENSE&style=flat&color=orange&logo=open-source-initiative" alt="License" />
  </a>
</p>

Quickly bootstrap a production‑ready **Express + TypeScript + Zod** server with a single command.

> Currently limited to only `MongoDB` and `Mongoose`, `PostgreSQL` (`Prisma` and `Drizzle`) coming soon...

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
- ✅ **Mongoose** for MongoDB integration (PostgreSQL with ORMs coming soon...)
- ✅ **Chalk** for colorful logging
- ✅ **[nhb-scripts](https://www.npmjs.com/package/nhb-scripts)** for easy build, commit, module scaffolding, formatting, linting, and more
- ✅ **Scaffolding via CLI** – choose package manager, DB, etc.
- ✅ Built‑in [**CI/CD workflow**](#️-cicd-workflow) for automatic deployment to Vercel
- ✅ Easily **extendable** _(PostgreSQL+Prisma/Drizzle planned!)_

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
- Select a **database** (`MongoDB` default, more coming soon)
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

## 📁 Project Structure: Mongoose

```ini
📁 <your-project-name>/
 ├─ 📁 .github/
 │   └─ 📁 workflows/
 │       └─ ⚙️ publish.yml     # GitHub Actions workflow for CI/CD (vercel deployment) 
 ├─ 📁 .vscode/
 │   └─ 📄 settings.json       # VS Code Settings for better formatting
 ├─ 📁 src/
 │   ├─ 📁 app/
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
 ├─ 🚫 .prettierignore         # Ignore files/folders from being formatted with prettier
 ├─ ⚙️ .prettierrc.json        # Prettier config
 ├─ ⚙️ eslint.config.mjs       # ESLint config (flat config, ready for TS)
 ├─ ⚙️ nhb.scripts.config.mjs  # Config for nhb-scripts
 ├─ ⚙️ nodemon.json            # Nodemon config
 ├─ ⚙️ package.json            # Auto-generated `package.json`
 ├─ 📃 README.md               # Instructions
 ├─ 📄 secret.mjs              # Generate secrets for jwt (using crypto module, just run in cli: node pnpm/npm/yarn run secret)
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

## 🔧 Extending

Future versions of `nhb-express` will allow:

- Choosing PostgreSQL (Prisma, Drizzle, etc.)

---

## ✨ Author

Made with ❤️ by [Nazmul Hassan](https://github.com/nazmul-nhb)
