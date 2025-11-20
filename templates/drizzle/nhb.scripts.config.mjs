// @ts-check

import {
	defineScriptConfig,
	generateModule,
	updateCollection,
	updateRoutes,
} from 'nhb-scripts';
import { createDrizzlePostgresSchema } from './scripts/createSchema.mjs';
import { expressDrizzlePostgresTemplate } from './scripts/moduleTemplate.mjs';
import { updateDrizzleInstance } from './scripts/updateDrizzle.mjs';
import { runExeca } from 'nhb-scripts';

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
					await runExeca(
						'drizzle-kit',
						['generate', '--name=drizzle', '--config=drizzle.config.ts'],
						{ stdout: 'inherit' }
					);
					// await runExeca(
					// 	'drizzle-kit',
					// 	['migrate', 'dev', '--config=drizzle.config.ts'],
					// 	{
					// 		stdout: 'inherit',
					// 	}
					// );
				},
			},
			'drizzle-postgres-schema': {
				createFolder: false,
				destination: 'src/drizzle/schema',
				files: createDrizzlePostgresSchema,
				onComplete: async (schemaName) => {
					updateDrizzleInstance(schemaName);
					await runExeca(
						'drizzle-kit',
						['generate', '--name=drizzle', '--config=drizzle.config.ts'],
						{ stdout: 'inherit' }
					);
					// await runExeca(
					// 	'drizzle-kit',
					// 	['migrate', 'dev', '--config=drizzle.config.ts'],
					// 	{
					// 		stdout: 'inherit',
					// 	}
					// );
				},
			},
		},
	},
});
