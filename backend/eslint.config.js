const pluginN = require('eslint-plugin-n');

module.exports = [
    pluginN.configs['flat/recommended'],
    {
        rules: {
            'no-unused-vars': ['error', { caughtErrors: 'all', caughtErrorsIgnorePattern: '^_' }],
            'no-console': 'off',
            'n/no-unpublished-require': 'off',
            'n/no-process-exit': 'off',
        },
    },
];
