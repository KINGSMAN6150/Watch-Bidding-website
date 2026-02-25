module.exports = {
    'backend/**/*.js': [
        'bash -c "cd backend && npx eslint --fix"',
        'bash -c "cd backend && npx prettier --write"',
    ],
};
