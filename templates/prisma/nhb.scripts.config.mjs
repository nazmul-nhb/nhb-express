// @ts-check

import { defineScriptConfig, runExeca } from 'nhb-scripts';
import { expressPrismaPostgresTemplate } from './scripts/moduleTemplate.mjs';
import { updatePrismaSchema } from './scripts/updateSchema.mjs';
import { updateCollection, updateRoutes } from './scripts/updateTemplate.mjs';

export default defineScriptConfig({
	format: {
		args: ['--write'],
		files: ['src', 'nhb.scripts.config.mjs'],
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
		excludePaths: ['node_modules', 'dist', 'generated', 'prisma', 'public'],
	},
	module: {
		force: false,
		destination: 'src/app/modules',
		defaultTemplate: 'express-prisma-postgres',
		templates: {
			'express-prisma-postgres': {
				createFolder: true,
				destination: 'src/app/modules',
				files: expressPrismaPostgresTemplate,
				onComplete: async (moduleName) => {
					updatePrismaSchema(moduleName);
					updateCollection(moduleName);
					updateRoutes(moduleName, true);
					await runExeca('prisma', ['generate'], { stdout: 'inherit' });
					await runExeca('prisma', ['migrate', 'dev', '--name', moduleName], {
						stdout: 'inherit',
					});
				},
			},
		},
	},
});
