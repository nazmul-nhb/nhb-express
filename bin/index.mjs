#!/usr/bin/env node

// @ts-check

/** @import { PackageJson } from 'type-fest'; */

import { confirm, intro, isCancel, note, outro, select, spinner, text } from '@clack/prompts';
import { execa } from 'execa';
import { capitalizeString } from 'nhb-toolbox';
import { Stylog } from 'nhb-toolbox/stylog';
import fs from 'node:fs';
import { rm as rmAsync } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const yellow = Stylog.ansi16('yellow');
const cyan = Stylog.ansi16('cyanBright');
const gray = Stylog.ansi16('blackBright');
const green = Stylog.ansi16('green');
const red = Stylog.ansi16('red');
const blue = Stylog.ansi16('blue');

const deps = /* @__PURE__ */ Object.freeze({
	common: [
		'bcrypt',
		'cloudinary',
		'cookie-parser',
		'cors',
		'dotenv',
		'express',
		'jsonwebtoken',
		'multer',
		'nhb-toolbox',
		'nodemailer',
		'serve-favicon',
		'zod',
	],
	mongoose: ['mongoose'],
	prisma: ['@prisma/adapter-pg', '@prisma/client', '@prisma/client-runtime-utils', 'pg'],
	drizzle: ['drizzle-orm', 'drizzle-zod', 'postgres'],
});

const devDeps = /* @__PURE__ */ Object.freeze({
	common: [
		'@eslint/js',
		'@types/bcrypt',
		'@types/cookie-parser',
		'@types/cors',
		'@types/express',
		'@types/jsonwebtoken',
		'@types/ms',
		'@types/multer',
		'@types/node',
		'@types/nodemailer',
		'@types/serve-favicon',
		'@typescript-eslint/eslint-plugin',
		'@typescript-eslint/parser',
		'eslint',
		'eslint-config-prettier',
		'eslint-plugin-prettier',
		'globals',
		'nhb-scripts',
		'nodemon',
		'prettier',
		'ts-node',
		'tsc-alias',
		'tsconfig-paths',
		'typescript',
		'typescript-eslint',
		'vercel',
	],
	mongoose: [],
	prisma: ['prisma', 'tsx'],
	drizzle: ['drizzle-kit', 'tsx'],
});

const scripts = /* @__PURE__ */ Object.freeze({
	common: {
		dev: 'nodemon',
		start: 'node dist/server.js',
		deploy: 'nhb-build && vercel --prod',
		build: 'nhb-build',
		format: 'nhb-format',
		lint: 'nhb-lint',
		fix: 'nhb-fix',
		commit: 'nhb-commit',
		count: 'nhb-count',
		delete: 'nhb-delete',
	},
	mongoose: {
		module: 'nhb-module -t express-mongoose-zod -d src/app/modules',
		secret: 'node secret.mjs',
	},
	drizzle: {
		'build:gen':
			'drizzle-kit generate --name=drizzle --config=drizzle.config.ts && nhb-build',
		gen: 'drizzle-kit generate --name=drizzle --config=drizzle.config.ts',
		migrate: 'drizzle-kit migrate --config=drizzle.config.ts',
		drop: 'drizzle-kit drop --config=drizzle.config.ts',
		push: 'drizzle-kit push --config=drizzle.config.ts',
		pull: 'drizzle-kit pull --config=drizzle.config.ts',
		export: 'drizzle-kit export --config=drizzle.config.ts',
		check: 'drizzle-kit check --config=drizzle.config.ts',
		'drizzle:up': 'drizzle-kit up --config=drizzle.config.ts',
		studio: 'drizzle-kit studio --config=drizzle.config.ts',
		schema: 'nhb-module -t drizzle-postgres-schema -d src/drizzle/schema',
		module: 'nhb-module -t express-drizzle-postgres -d src/app/modules',
		secret: 'node scripts/generateSecret.mjs',
	},
	prisma: {
		'build:gen': 'prisma generate && nhb-build',
		migrate: 'prisma migrate dev',
		gen: 'prisma generate',
		studio: 'prisma studio',
		module: 'nhb-module -t express-prisma-postgres -d src/app/modules',
		secret: 'node scripts/generateSecret.mjs',
	},
});

// ----------------------
// ! Entry
// ----------------------
intro(cyan.bold.toANSI('🚀 Create Express + TypeScript App with "nhb-express"'));

const projectName = normalizeResult(
	await text({
		message: yellow.bold.toANSI('📂 Project Name:'),
		placeholder: 'e.g. my-server',
		validate: (v) => (v.trim() ? undefined : 'Project name is required!'),
	})
);

const dbChoice = /** @type {'mongoose' | 'prisma' | 'drizzle'} */ (
	normalizeResult(
		await select({
			message: yellow.bold.toANSI('📁 Select Database + ODM/ORM:'),
			options: [
				{ value: 'mongoose', label: 'MongoDB + Mongoose', hint: 'default' },
				{
					value: 'drizzle',
					label: 'PostgreSQL + Drizzle',
					hint: 'Driver: postgres-js',
				},
				{
					value: 'prisma',
					label: 'PostgreSQL + Prisma',
					hint: 'Driver: "pg" with "@prisma/adapter-pg" & "prisma-client-js"',
				},
			],
			initialValue: 'mongoose',
		})
	)
);

const pkgManager = normalizeResult(
	await select({
		message: yellow.bold.toANSI('📦 Choose a Package Manager:'),
		options: [
			{ value: 'pnpm', label: 'pnpm' },
			{ value: 'npm', label: 'npm' },
			{ value: 'yarn', label: 'yarn' },
		],
		initialValue: 'pnpm',
	})
);

const targetDir = path.resolve(process.cwd(), projectName);

/**
 * * Rename a file to a dotfile
 * @param {string} fileName
 */
function renameDotFile(fileName) {
	fs.renameSync(path.join(targetDir, fileName), path.join(targetDir, `.${fileName}`));
}

// ! if exists, confirm overwrite
if (fs.existsSync(targetDir)) {
	const overwrite = await confirm({
		message: red.bold.toANSI(`⛔ "${projectName}" already exists. Overwrite?`),
		initialValue: false,
	});

	if (isCancel(overwrite)) {
		showCancelMessage();
	}

	if (!overwrite) {
		showCancelMessage();
	}

	await removeExistingDir(targetDir);
}

fs.mkdirSync(targetDir);

const templateDir = path.resolve(__dirname, '../templates', dbChoice);

copyDir(templateDir, targetDir);

renameDotFile('env');
renameDotFile('gitignore');

/** @type {PackageJson} */
const pkgJson = {
	name: projectName,
	version: '0.1.0',
	description: `Express TypeScript ${capitalizeString(dbChoice)} (${dbChoice === 'mongoose' ? 'MongoDB' : 'PostgreSQL'}) Server`,
	scripts: {
		...scripts.common,
		...scripts[dbChoice],
	},
	author: {
		name: 'Nazmul Hassan',
		email: 'nazmulnhb@gmail.com',
		url: 'https://nazmul-nhb.dev',
	},
	license: 'ISC',
	keywords: [projectName, 'server', 'express', 'typescript', dbChoice],
};

fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

mimicClack(blue.toANSI('🔄️ Installing dependencies...'));

await installDeps(
	pkgManager,
	targetDir,
	[...deps.common, ...deps[dbChoice]],
	[...devDeps.common, ...devDeps[dbChoice]]
);

await runMigration(dbChoice);

mimicClack(green.toANSI('✅ Dependencies installed!'), false);

note(yellow.toANSI(`cd ${projectName}\n${pkgManager} run dev`), blue.toANSI('🛈 Next Steps'));

outro(green.toANSI(`🎉 Project "${projectName}" has been created successfully!`));

// ----------------------
// ! Helpers
// ----------------------

/** * Show cancel message with outro and graceful exit */
function showCancelMessage() {
	outro(red.toANSI('🛑 Process cancelled by user!'));
	process.exit(0);
}

/**
 * * Normalize clack result to string
 * @param {string | symbol} result
 * @returns {string}
 */
function normalizeResult(result) {
	if (isCancel(result)) {
		showCancelMessage();
	}
	return typeof result === 'string' ? result?.trim() : '';
}

/**
 * * Mimic clack left vertical line before a message
 * @param {string} message message to print
 * @param {boolean} [suffix=true] If true, adds a pipe in new line
 */
export function mimicClack(message, suffix = true) {
	console.log(
		gray.toANSI('│\n') + green.toANSI('◇  ') + message + (suffix ? gray.toANSI('\n│') : '')
	);
}

/**
 * * Recursively copy a directory
 * @param {string} src
 * @param {string} dest
 */
function copyDir(src, dest) {
	fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
		const s = path.join(src, entry.name);
		const d = path.join(dest, entry.name);
		if (entry.isDirectory()) {
			fs.mkdirSync(d, { recursive: true });
			copyDir(s, d);
		} else {
			fs.copyFileSync(s, d);
		}
	});
}

/**
 * * Install dependencies with the chosen package manager
 * @param {string} manager
 * @param {string} cwd
 * @param {string[]} deps
 * @param {string[]} devDeps
 */
async function installDeps(manager, cwd, deps, devDeps) {
	/** @type {import('execa').Options} */
	const options = { cwd, stdout: 'inherit', stderr: 'inherit' };

	if (manager === 'pnpm') {
		await execa('pnpm', ['add', ...deps], options);
		await execa('pnpm', ['add', '-D', ...devDeps], options);
	} else if (manager === 'npm') {
		await execa('npm', ['install', '--progress', ...deps], options);
		await execa('npm', ['install', '--progress', '-D', ...devDeps], options);
	} else if (manager === 'yarn') {
		await execa('yarn', ['add', ...deps], options);
		await execa('yarn', ['add', '--dev', ...devDeps], options);
	}
}

/**
 * * Remove an existing directory with spinner feedback
 * @param {string} targetDir
 */
async function removeExistingDir(targetDir) {
	const s = spinner();
	s.start(red.toANSI(`⛔ Removing existing "${projectName}" directory`));

	try {
		await rmAsync(targetDir, { recursive: true, force: true });
		s.stop(green.toANSI(`✅ Existing "${projectName}" directory has been removed!`));
	} catch (error) {
		s.stop(red.toANSI(`❌ Failed to remove directory: "${projectName}"!`));
		console.error(error);
		process.exit(0);
	}
}

/**
 * * Run migration and generate for `prisma` and `drizzle`.
 * @param {'mongoose' | 'prisma' | 'drizzle'} orm
 */
async function runMigration(orm) {
	/** @type {import('execa').Options} */
	const options = { stdout: 'inherit', stderr: 'inherit' };

	switch (orm) {
		case 'drizzle':
			await execa(
				'drizzle-kit',
				['generate', '--name=drizzle', '--config=drizzle.config.ts'],
				options
			);
			await execa('drizzle-kit', ['migrate', '--config=drizzle.config.ts'], options);
			break;
		case 'prisma':
			await execa('prisma', ['generate'], options);
			await execa('prisma', ['migrate', 'dev', '--name', 'init'], options);
			break;
	}
}
