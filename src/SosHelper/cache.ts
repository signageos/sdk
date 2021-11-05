
const cacheMap = new WeakMap<Function, unknown>();

/**
 * Cache the first result of async function. Then always forever return cached value.
 * So the fn is called only once for the first time.
 * The result values are cached in memory & key is the input fn argument.
 */
export function cacheFunctionResult<Fn extends (...args: unknown[]) => Promise<unknown>>(fn: Fn): Fn {
	return async function (...args: unknown[]) {
		if (cacheMap.has(fn)) {
			return cacheMap.get(fn);
		}
		const promise = fn(...args);
		if (!(promise instanceof Promise)) {
			throw new Error(`Cache function result has to return instance of Promise`);
		}
		const result = await promise;
		cacheMap.set(fn, result);
		return result;
	} as Fn;
}
