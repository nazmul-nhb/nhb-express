// @ts-check

import { defineScriptConfig } from 'nhb-scripts';

export default defineScriptConfig({
	format: {
		args: ['--write'],
		files: [
			'bin',
			'templates/mongoose/src',
			// 'templates/prisma/src',
			'templates/drizzle/src',
			'nhb.scripts.config.mjs',
		],
		ignorePath: '.prettierignore',
	},
	commit: {
		runFormatter: false,
		wrapPrefixWith: '`',
	},
	count: {
		defaultPath: 'bin',
		excludePaths: ['node_modules', '.github'],
	},
});
