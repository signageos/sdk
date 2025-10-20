import codestyle from '@signageos/codestyle/eslint.config.mjs';

export default [
	...codestyle,
	{
		ignores: [
			'node_modules/',
			'dist/',
			'dist-test/',
			'coverage/',
			'**/*.config.js',
			'**/*.config.mjs',
			'.prettierrc.mjs',
			'.mocharc.*.json',
			'docs/**/*.js',
			'tests/',
		],
	},
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
			},
		},
	},
	{
		files: ['tests/**/*.ts'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.test.json',
			},
		},
	},
];
