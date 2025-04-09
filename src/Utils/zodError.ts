import { ZodError } from 'zod';

export const zodError = (e: unknown, message: string) => {
	if (!(e instanceof ZodError)) {
		throw new Error(`Invalid zod error ${String(e)}`);
	}

	const formatted = e.flatten();
	throw new Error(
		`${message}:\n` +
			[
				...formatted.formErrors,
				...Object.entries(formatted.fieldErrors).map(([k, v]) => `\t${k}: ${v}`),
				// force-indent
			].join('\n'),
	);
};
