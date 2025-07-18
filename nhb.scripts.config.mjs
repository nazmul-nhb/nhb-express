// @ts-check

import { defineScriptConfig } from 'nhb-scripts';

export default defineScriptConfig({
    format: {
        args: ['--write'],
        files: ['bin', 'templates'],
        ignorePath: '.prettierignore',
    },
    commit: {
        runFormatter: false,
    },
    count: {
        defaultPath: 'bin',
        excludePaths: ['node_modules', 'dist', 'build']
    },
});
