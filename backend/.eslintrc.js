module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:node/recommended',
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
        'node/no-unpublished-require': 'off',
    },
};
