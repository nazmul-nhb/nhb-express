#!/usr/bin/env node

// @ts-check

/** @import {PackageJson} from 'type-fest'; */

import { confirm, intro, isCancel, outro, select, spinner, text } from '@clack/prompts';
import chalk from 'chalk';
import { execa } from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @param {string | symbol } result */
const runCancel = (result) => {
	if (isCancel(result)) {
		console.log(chalk.gray('⛔ Process cancelled by user!'));
		process.exit(0);
	}
};

// ----------------------
// Entry
// ----------------------
intro(chalk.cyan('🚀 Create Express + TypeScript App with "nhb-express"'));

const projectName = await text({
	message: 'Project name:',
	initialValue: 'my-server',
	validate: (v) => (v.trim() ? undefined : 'Project name is required!'),
});

runCancel(projectName);

const dbChoice = await select({
	message: 'Select a database:',
	options: [
		{ value: 'mongoose', label: 'MongoDB + Mongoose', hint: 'default' },
		// { value: 'postgres', label: 'PostgreSQL (future support)' },
	],
	initialValue: 'mongoose',
});

runCancel(dbChoice);

const pkgManager = await select({
	message: 'Choose a package manager:',
	options: [
		{ value: 'pnpm', label: 'pnpm' },
		{ value: 'npm', label: 'npm' },
		{ value: 'yarn', label: 'yarn' },
	],
	initialValue: 'pnpm',
});

runCancel(pkgManager);

const targetDir = path.resolve(process.cwd(), projectName.toString());

// if exists, confirm overwrite
if (fs.existsSync(targetDir)) {
	const overwrite = await confirm({
		message: `${projectName.toString()} already exists. Overwrite?`,
	});
	if (!overwrite) {
		outro(chalk.yellow('🛑 Cancelled!'));
		process.exit(0);
	}
	fs.rmSync(targetDir, { recursive: true, force: true });
}

fs.mkdirSync(targetDir);

const templateDir = path.resolve(__dirname, '../templates', dbChoice.toString());

copyDir(templateDir, targetDir);

/** @type {PackageJson} */
const pkgJson = {
	name: projectName.toString(),
	version: '0.0.1',
	description: 'Express TypeScript Mongoose Server',
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

const deps = [
	'bcrypt',
	'cookie-parser',
	'cors',
	'dotenv',
	'express',
	'jsonwebtoken',
	'mongoose',
	'multer',
	'nhb-toolbox',
	'zod',
	'chalk@4.1.2',
];
const devDeps = [
	'@eslint/js',
	'@types/bcrypt',
	'@types/cookie-parser',
	'@types/cors',
	'@types/express',
	'@types/jsonwebtoken',
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
	'vercel',
];

const s = spinner();
s.start('Installing dependencies...');
await installDeps(pkgManager.toString(), targetDir, deps, devDeps);
s.stop(chalk.green('✓ Dependencies installed'));

outro(chalk.green('🎉 Project created successfully!'));
console.log(`\nNext steps:`);
console.log(chalk.cyan(`  cd ${projectName.toString()}`));
console.log(chalk.cyan(`  ${pkgManager.toString()} run dev`));

// ----------------------
// Helpers
// ----------------------

/**
 * Recursively copy a directory
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
 * Install dependencies with the chosen package manager
 * @param {string} manager
 * @param {string} cwd
 * @param {string[]} deps
 * @param {string[]} devDeps
 */
async function installDeps(manager, cwd, deps, devDeps) {
	if (manager === 'pnpm') {
		await execa('pnpm', ['add', ...deps], { cwd });
		await execa('pnpm', ['add', '-D', ...devDeps], { cwd });
	} else if (manager === 'npm') {
		await execa('npm', ['install', ...deps], { cwd });
		await execa('npm', ['install', '-D', ...devDeps], { cwd });
	} else if (manager === 'yarn') {
		await execa('yarn', ['add', ...deps], { cwd });
		await execa('yarn', ['add', '--dev', ...devDeps], { cwd });
	}
}
