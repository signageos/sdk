/** @type {import("eslint").Linter.Config} */
module.exports = {
	...require('@signageos/codestyle/.eslintrc.js'),
	ignorePatterns: ['node_modules/', 'package.json'],
};
