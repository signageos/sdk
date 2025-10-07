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
		rules: {
			// Severity: HIGH (100 occurrences)
			// Member ordering violations - constructors and methods not in expected order
			'@typescript-eslint/member-ordering': 'warn',

			// Severity: MEDIUM (5 occurrences)
			// Unused variables in error handlers
			'@typescript-eslint/no-unused-vars': 'warn',

			// Severity: LOW (4 occurrences)
			// Prettier formatting issues (tabs vs spaces)
			'prettier/prettier': 'warn',

			// Severity: LOW (3 occurrences)
			// Empty interfaces that are equivalent to their supertype
			'@typescript-eslint/no-empty-object-type': 'warn',

			// Severity: LOW (3 occurrences)
			// Irregular whitespace characters in code
			'no-irregular-whitespace': 'warn',

			// Severity: LOW (2 occurrences)
			// Usage of Function type (should use explicit function signature)
			'@typescript-eslint/no-unsafe-function-type': 'warn',

			// Severity: LOW (2 occurrences)
			// Could use optional chaining instead of logical AND
			'@typescript-eslint/prefer-optional-chain': 'warn',

			// Severity: LOW (2 occurrences)
			// Namespace usage (deprecated in favor of ES modules)
			'@typescript-eslint/no-namespace': 'warn',

			// Severity: VERY LOW (1 occurrence)
			// Misused spread operator
			'@typescript-eslint/no-misused-spread': 'warn',

			// Severity: VERY LOW (1 occurrence)
			// @ts-comment usage without description
			'@typescript-eslint/ban-ts-comment': 'warn',
		},
	},
];
