import IOptions from './IOptions';
import { Paginator } from '../Lib/Pagination/paginator';

/**
 * Dependencies container for SDK components.
 * This encapsulates all common dependencies to make it easier to add new dependencies
 * without changing constructor signatures across many classes.
 */
export type Dependencies = {
	options: IOptions;
	paginator: Paginator;
};

/**
 * Creates a Dependencies container from the provided options.
 */
export function createDependencies(options: IOptions): Dependencies {
	return {
		options,
		paginator: new Paginator(options),
	};
}
