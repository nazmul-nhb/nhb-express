// @ts-check

import { defineScriptConfig, updateCollection, updateRoutes } from 'nhb-scripts';
import { createDrizzlePostgresSchema } from './scripts/createSchema.mjs';
import { expressDrizzlePostgresTemplate } from './scripts/moduleTemplate.mjs';
import { updateDrizzleInstance } from './scripts/updateDrizzle.mjs';

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
				onComplete: (moduleName) => {
					updateCollection(moduleName);
					updateRoutes(moduleName, true);
				},
			},
			'drizzle-postgres-schema': {
				createFolder: false,
				destination: 'src/drizzle/schema',
				files: createDrizzlePostgresSchema,
				onComplete: (schemaName) => {
					updateDrizzleInstance(schemaName);
				},
			},
		},
	},
});
