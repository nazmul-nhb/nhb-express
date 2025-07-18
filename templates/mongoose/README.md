# 🚀 Express TypeScript Server Scaffold with `nhb-express`

Quickly bootstrap a production‑ready **Express + TypeScript + Zod** server with a single command.

---

## ✨ Features

✅ **TypeScript** with `ts-node` and `nodemon` for development
✅ **Express 5** preconfigured
✅ **Zod** for schema validation
✅ **Mongoose** for MongoDB integration (Postgres with ORMs coming soon...)
✅ **Chalk** for colorful logging
✅ **nhb-scripts** for easy commit, module scaffolding, format, linting and more.
✅ **Scaffolding via CLI** – choose package manager, DB, etc.
✅ Easily extendable (Postgres/Prisma/Drizzle planned!)

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

* Choose a **project name**
* Select a **database** (MongoDB default, more coming soon)
* Pick your **package manager**

Your new server will be scaffolded in the chosen folder with all dependencies installed.

---

## 🚀 Quick Start

After running the CLI:

```bash
cd <your-project-name>
pnpm run dev     # or npm run dev / yarn dev / pnpm dev
```

---

<!-- ## 📁 Project Structure

```
<your-project-name>/
 ├─ src/
 │   ├─ server.ts
 │   ├─ routes/
 │   └─ schemas/
 ├─ scripts/
 │   ├─ build.mjs
 │   ├─ lint.mjs
 │   └─ ...
 ├─ package.json
 ├─ tsconfig.json
 └─ ...
```

--- -->

## 🔧 Extending

Future versions of `nhb-express` will allow:

* Choosing Postgres (Prisma, Drizzle, etc.)

---

## ✨ Author

Made with ❤️ by [Nazmul Hassan](https://github.com/nazmul-nhb)
