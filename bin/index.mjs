#!/usr/bin/env node

// @ts-check

/** @import {PackageJson} from 'type-fest'; */

import {
	confirm,
	intro,
	isCancel,
	note,
	outro,
	select,
	spinner,
	text,
} from '@clack/prompts';
import chalk from 'chalk';
import { execa } from 'execa';
import { capitalizeString } from 'nhb-toolbox';
import fs from 'node:fs';
import { rm as rmAsync } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
		'zod',
		'chalk@4.1.2',
	],
	mongoose: ['mongoose'],
	prisma: [],
	drizzle: [],
});

const devDeps = /* @__PURE__ */ Object.freeze({
	common: [
		'@eslint/js',
		'@types/bcrypt',
		'@types/cookie-parser',
		'@types/cors',
		'@types/express',
		'@types/jsonwebtoken',
		'@types/multer',
		'@types/node',
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
		'typescript',
		'typescript-eslint',
	],
	mongoose: ['vercel'],
	prisma: [],
	drizzle: [],
});

/** Show cancel message with outro and graceful exit */
function showCancelMessage() {
	outro(chalk.redBright('🛑 Process cancelled by user!'));
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

// ----------------------
// ! Entry
// ----------------------
intro(chalk.cyan('🚀 Create Express + TypeScript App with "nhb-express"'));

const projectName = normalizeResult(
	await text({
		message: chalk.yellowBright('📂 Project name:'),
		initialValue: 'my-server',
		validate: (v) => (v.trim() ? undefined : 'Project name is required!'),
	}),
);

const dbChoice = /** @type {'mongoose' | 'prisma' | 'drizzle'} */ (
	normalizeResult(
		await select({
			message: chalk.cyanBright('🛢️ Select a database:'),
			options: [
				{ value: 'mongoose', label: 'MongoDB + Mongoose', hint: 'default' },
				{ value: 'prisma', label: 'PostgreSQL + Prisma (Coming Soon...)' },
				{ value: 'drizzle', label: 'PostgreSQL + Drizzle (Coming Soon...)' },
			],
			initialValue: 'mongoose',
		}),
	)
);

const pkgManager = normalizeResult(
	await select({
		message: chalk.yellowBright('📦 Choose a package manager:'),
		options: [
			{ value: 'pnpm', label: 'pnpm' },
			{ value: 'npm', label: 'npm' },
			{ value: 'yarn', label: 'yarn' },
		],
		initialValue: 'pnpm',
	}),
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
		message: chalk.redBright(`⛔ ${projectName} already exists. Overwrite?`),
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
	description: `Express TypeScript ${capitalizeString(dbChoice)} Server`,
	scripts: {
		dev: 'nodemon',
		start: 'node dist/server.js',
		deploy: 'nhb-build && vercel --prod',
		build: 'nhb-build',
		format: 'nhb-format',
		lint: 'nhb-lint',
		fix: 'nhb-fix',
		commit: 'nhb-commit',
		count: 'nhb-count',
		module: 'nhb-module',
		secret: 'node secret.mjs',
	},
	author: {
		name: 'Nazmul Hassan',
		email: 'nazmulnhb@gmail.com',
	},
	license: 'ISC',
	keywords: [projectName, 'server', 'express', 'typescript', dbChoice],
};

fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

mimicClack(chalk.cyanBright('🔄️ Installing dependencies...'));

await installDeps(
	pkgManager,
	targetDir,
	[...deps.common, ...deps[dbChoice]],
	[...devDeps.common, ...devDeps[dbChoice]],
);

mimicClack(chalk.green('✅ Dependencies installed!'), false);

note(
	chalk.cyan(`cd ${projectName}\n${pkgManager} run dev`),
	chalk.yellowBright('⏭️ Next Steps'),
);

outro(chalk.green('🎉 Project created successfully!'));

// ----------------------
// ! Helpers
// ----------------------

/**
 * * Mimic clack left vertical line before a message
 * @param {string} message message to print
 * @param {boolean} [suffix=true] If true, adds a pipe in new line
 */
export function mimicClack(message, suffix = true) {
	console.log(
		chalk.gray('│\n') +
			chalk.green('◇  ') +
			message +
			(suffix ? chalk.gray('\n│') : ''),
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
 * Remove an existing directory with spinner feedback
 * @param {string} targetDir
 */
async function removeExistingDir(targetDir) {
	const s = spinner();
	s.start(chalk.yellowBright('⛔ Removing existing directory'));

	try {
		await rmAsync(targetDir, { recursive: true, force: true });
		s.stop(chalk.green('✅ Existing directory removed!'));
	} catch (err) {
		s.stop(chalk.redBright('❌ Failed to remove directory!', err));
		process.exit(0);
	}
}
