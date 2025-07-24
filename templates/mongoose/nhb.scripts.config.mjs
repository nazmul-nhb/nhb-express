// @ts-check

import { defineScriptConfig, expressMongooseZodTemplate } from 'nhb-scripts';

export default defineScriptConfig({
    format: {
        args: ['--write'],
        files: ['src'],
        ignorePath: '.prettierignore',
    },
    lint: { folders: ['src'], patterns: ['**/*.ts'] },
    fix: { folders: ['src'], patterns: ['**/*.ts'] },
    commit: {
        runFormatter: true,
    },
    build: {
        distFolder: 'dist',
        commands: [{ cmd: 'tsc', }],
    },
    count: {
        defaultPath: 'src',
        excludePaths: ['node_modules', 'dist', 'build']
    },
    module: {
        force: false,
        destination: 'src/app/modules',
        defaultTemplate: 'express-mongoose-zod',
        templates: {
            'express-mongoose-zod': {
                createFolder: true,
                destination: 'src/app/modules',
                files: expressMongooseZodTemplate
            }
        },
    }
});
