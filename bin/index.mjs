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
import { rm } from 'node:fs/promises';
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

/**
 * * Normalize clack result to string
 * @param {string | symbol} result
 * @returns {string}
 */
function normalizeResult(result) {
	if (isCancel(result)) {
		console.log(chalk.gray('⛔ Process cancelled by user!'));
		process.exit(0);
	}
	return typeof result === 'string' ? result : '';
}

// ----------------------
// Entry
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

// if exists, confirm overwrite
if (fs.existsSync(targetDir)) {
	const overwrite = await confirm({
		message: chalk.redBright(`⛔ ${projectName} already exists. Overwrite?`),
		initialValue: false,
	});

	if (isCancel(overwrite)) {
		outro(chalk.redBright('🛑 Cancelled by user!'));
		process.exit(0);
	}

	if (!overwrite) {
		outro(chalk.redBright('🛑 Cancelled by user!'));
		process.exit(0);
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
	version: '0.0.1',
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
	},
	author: {
		name: 'Nazmul Hassan',
		email: 'nazmulnhb@gmail.com',
	},
	license: 'ISC',
	keywords: ['server', 'express', 'typescript'],
};

fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgJson, null, 2));

mimicClack(chalk.cyanBright('🔄️ Installing dependencies...'));

await installDeps(
	pkgManager,
	targetDir,
	[...deps.common, ...deps[dbChoice]],
	[...devDeps.common, ...devDeps[dbChoice]],
);

mimicClack(chalk.green('✅ Dependencies installed!'));

note(
	chalk.cyan(`cd ${projectName}\n${pkgManager} run dev`),
	chalk.yellowBright('⏭️ Next Steps'),
);

outro(chalk.green('🎉 Project created successfully!'));

// ----------------------
// Helpers
// ----------------------

/**
 * Mimic clack left vertical line before a message
 * @param {string} message
 */
function mimicClack(message) {
	console.log(chalk.gray('│\n') + chalk.green('◇  ') + message + chalk.gray('\n│'));
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
	if (manager === 'pnpm') {
		await execa('pnpm', ['add', ...deps], { cwd, stdout: 'inherit' });
		await execa('pnpm', ['add', '-D', ...devDeps], { cwd, stdout: 'inherit' });
	} else if (manager === 'npm') {
		await execa('npm', ['install', '--progress', ...deps], {
			cwd,
			stdout: 'inherit',
			stderr: 'inherit',
		});
		await execa('npm', ['install', '--progress', '-D', ...devDeps], {
			cwd,
			stdout: 'inherit',
			stderr: 'inherit',
		});
	} else if (manager === 'yarn') {
		await execa('yarn', ['add', ...deps], { cwd, stdout: 'inherit' });
		await execa('yarn', ['add', '--dev', ...devDeps], { cwd, stdout: 'inherit' });
	}
}

/**
 * Remove an existing directory with spinner feedback
 * @param {string} targetDir
 */
async function removeExistingDir(targetDir) {
	const s = spinner();
	s.start(chalk.yellowBright('🗑️  Removing existing directory'));

	try {
		await rm(targetDir, { recursive: true, force: true });
		s.stop(chalk.green('✅ Existing directory removed!'));
	} catch (err) {
		s.stop(chalk.redBright('❌ Failed to remove directory', err));
		process.exit(0);
	}
}
