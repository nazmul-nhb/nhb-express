# 🚀 Express TypeScript Server Scaffold with `nhb-express`

Quickly bootstrap a production‑ready **Express + TypeScript + Zod** server with a single command.

---

## ✨ Features

- ✅ **TypeScript** with `ts-node` and `nodemon` for development and pre-configured `tsconfig.json`
- ✅ **Express.js** pre‑configured with custom middlewares
- ✅ **Zod** for schema validation
- ✅ **Mongoose** for MongoDB integration (Postgres with ORMs coming soon...)
- ✅ **Chalk** for colorful logging
- ✅ **[nhb-scripts](https://www.npmjs.com/package/nhb-scripts)** for easy build, commit, module scaffolding, formatting, linting, and more
- ✅ **Scaffolding via CLI** – choose package manager, DB, etc.
- ✅ Built‑in **CI/CD workflow** for automatic deployment to Vercel
- ✅ Easily **extendable** _(Postgres/Prisma/Drizzle planned!)_

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
- Select a **database** (MongoDB default, more coming soon)
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

```text
<your-project-name>/
 |- .github/
 │   └─ workflows/
 │       └─ publish.yml     # GitHub Actions workflow for CI/CD (vercel deployment) 
 ├─ src/
 │   |─ app/
 │   |   ├─ classes/        # Utility classes e.g. `QueryBuilder`, `ErrorWihStatus`
 │   |   ├─ configs/        # App configurations
 │   |   ├─ constants/      # Constant values
 │   |   ├─ errors/         # Custom error processors/handlers
 │   |   ├─ middlewares/    # Custom Express middlewares
 │   |   ├─ modules/        # Feature modules (controllers, services, etc.)
 │   |   ├─ routes/         # Route definitions
 │   |   ├─ types/          # Types for the App
 │   |   └─ utilities/      # Helper functions
 │   |
 │   ├─ app.ts              # Express app setup
 │   ├─ index.d.ts          # Global type declarations
 │   └─ server.ts           # Server bootstrap
 │
 ├─ .env                    # Environment variables
 ├─ .gitignore              # Ignore files/folders from being pushed/committed
 ├─ .prettierignore         # Ignore files/folders from being formatted with prettier
 ├─ .prettierrc.json        # Prettier config
 ├─ eslint.config.mjs       # ESLint config (flat config, ready for TS)
 ├─ nhb.scripts.config.mjs  # Config for nhb-scripts
 ├─ nodemon.json            # Nodemon settings
 ├─ package.json
 ├─ README.md
 ├─ tsconfig.json           # Ready to use tsconfig
 └─ vercel.json             # Deployment config for Vercel
```

---

## ⚙️ CI/CD Workflow

A ready‑to‑use **GitHub Actions workflow** is included in:

```text
.github/workflows/publish.yml
```

✅ **What it does:**

- Runs on push to your main branch
- Builds your project
- Deploys automatically to **Vercel** (configured via `vercel.json`)

✅ **How to use:**

1. Push your project to a GitHub repository.
2. Add your Vercel tokens/secrets as GitHub repository secrets.
3. Every time you push to `main` and version is updated, GitHub Actions will trigger and deploy your server to Vercel.

You can customize the workflow to fit your own CI/CD needs (e.g., change branches, add tests, deploy elsewhere).

---

## 🛠️ nhb-scripts

This project comes integrated with **[nhb-scripts](https://www.npmjs.com/package/nhb-scripts)** — a cli package also by [Nazmul Hassan](https://github.com/nazmul-nhb):

✨ **What you get:**

- `pnpm run build` → builds your project
- `pnpm run commit` → guided commit with semantic messages
- `pnpm run module` → scaffolds new modules
- `pnpm run fix` → auto‑fix lint issues
- `pnpm run format` → formats with Prettier
- and more… configurable via `nhb.scripts.config.mjs`

You can explore and extend `nhb-scripts` in your project as needed.

---

## 🔧 Extending

Future versions of `nhb-express` will allow:

- Choosing Postgres (Prisma, Drizzle, etc.)

---

## ✨ Author

Made with ❤️ by [Nazmul Hassan](https://github.com/nazmul-nhb)
