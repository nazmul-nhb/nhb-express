// @ts-check

import { defineScriptConfig } from 'nhb-scripts';

export default defineScriptConfig({
    format: {
        args: ['--write'],
        files: ['bin',],
        ignorePath: '.prettierignore',
    },
    commit: {
        runFormatter: true,
    },
    count: {
        defaultPath: 'bin',
        excludePaths: ['node_modules', '.github']
    },
});
