import codestyle from '@signageos/codestyle/eslint.config.mjs';

export default [
	...codestyle,
	{
		ignores: [
			'node_modules/',
			'dist/',
			'dist-test/',
			'coverage/',
			'tests/',
			'**/*.config.js',
			'**/*.config.mjs',
			'.prettierrc.mjs',
			'.mocharc.*.json',
			'package.json',
			'**/*.d.ts',
			'**/*.js',
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
];
