// @ts-check

import { defineScriptConfig } from 'nhb-scripts';
import { updateCollection, updateRoutes } from './scripts/updateTemplate.mjs';
import { expressMongooseZodTemplate } from './scripts/moduleTemplate.mjs';

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
		wrapPrefixWith: '`',
	},
	build: {
		distFolder: 'dist',
		commands: [{ cmd: 'tsc' }, { cmd: 'tsc-alias' }],
		waitingMessage: ' 📦 Building Your Express Application...',
	},
	count: {
		defaultPath: 'src',
		excludePaths: ['node_modules', 'dist', 'public'],
	},
	module: {
		force: false,
		defaultTemplate: 'express-mongoose-zod',
		templates: {
			'express-mongoose-zod': {
				createFolder: true,
				destination: 'src/app/modules',
				files: (moduleName) => expressMongooseZodTemplate(moduleName, true),
				onComplete: (moduleName) => {
					updateCollection(moduleName);
					updateRoutes(moduleName, true);
				},
			},
		},
	},
});
