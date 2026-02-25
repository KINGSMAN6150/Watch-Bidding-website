module.exports = {
    'backend/**/*.js': (filenames) => {
        const files = filenames.join(' ');
        return [
            `bash -c "cd backend && npx eslint --fix ${files}"`,
            `bash -c "cd backend && npx prettier --write ${files}"`,
        ];
    },
};
