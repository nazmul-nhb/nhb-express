// @ts-check

import { defineScriptConfig, generateModule, runExeca } from 'nhb-scripts';
import { createDrizzlePostgresSchema } from './scripts/createSchema.mjs';
import { expressDrizzlePostgresTemplate } from './scripts/moduleTemplate.mjs';
import { updateDrizzleInstance } from './scripts/updateDrizzle.mjs';
import { updateCollection, updateRoutes } from './scripts/updateTemplate.mjs';

export default defineScriptConfig({
	format: {
		args: ['--write'],
		files: ['src', 'nhb.scripts.config.mjs', 'eslint.config.mjs', 'drizzle.config.ts'],
		ignorePath: '.prettierignore',
	},
	lint: { folders: ['src'], patterns: ['**/*.ts'] },
	fix: { folders: ['src'], patterns: ['**/*.ts'] },
	commit: {
		runFormatter: true,
		emojiBeforePrefix: true,
		wrapPrefixWith: '`',
	},
	build: {
		distFolder: 'dist',
		commands: [{ cmd: 'tsc' }, { cmd: 'tsc-alias' }],
		waitingMessage: ' 📦 Building Your Express Application...',
	},
	count: {
		defaultPath: 'src',
		excludePaths: ['node_modules', 'dist'],
	},
	module: {
		force: false,
		defaultTemplate: 'express-drizzle-postgres',
		templates: {
			'express-drizzle-postgres': {
				createFolder: true,
				destination: 'src/app/modules',
				files: expressDrizzlePostgresTemplate,
				onComplete: async (moduleName) => {
					generateModule(moduleName, {
						createFolder: false,
						defaultTemplate: 'drizzle-schema',
						templates: {
							'drizzle-schema': {
								createFolder: false,
								destination: 'src/drizzle/schema',
								files: createDrizzlePostgresSchema,
							},
						},
					});
					updateCollection(moduleName);
					updateRoutes(moduleName, true);
					updateDrizzleInstance(moduleName);
					await runDrizzleMigration(moduleName);
				},
			},
			'drizzle-postgres-schema': {
				createFolder: false,
				destination: 'src/drizzle/schema',
				files: createDrizzlePostgresSchema,
				onComplete: async (schemaName) => {
					updateDrizzleInstance(schemaName);
					await runDrizzleMigration(schemaName);
				},
			},
		},
	},
});

/**
 * * Run Drizzle migration related commands.
 * @param {string} schemaName Name of the schema to append with the migration filename.
 */
async function runDrizzleMigration(schemaName) {
	await runExeca(
		'drizzle-kit',
		['generate', `--name=${schemaName}`, '--config=drizzle.config.ts'],
		{ stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' }
	);
	await runExeca('drizzle-kit', ['push', '--force', '--config=drizzle.config.ts'], {
		stdout: 'inherit',
		stderr: 'inherit',
		stdin: 'inherit',
	});
	// await runExeca(
	// 	'drizzle-kit',
	// 	['drop', '--config=drizzle.config.ts'],
	// 	{ stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' }
	// );
	// await runExeca(
	// 	'drizzle-kit',
	// 	['migrate', '--config=drizzle.config.ts'],
	// 	{ stdout: 'inherit', stderr: 'inherit', stdin: 'inherit' }
	// );
}
