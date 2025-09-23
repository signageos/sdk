import { isEqual } from 'lodash';

/**
 * Compares two configuration objects, handling encrypted values properly.
 */
export function areConfigurationsEqual(
	config1: Record<string, string | number | boolean>,
	config2: Record<string, string | number | boolean>,
): boolean {
	if (config1 === config2) {
		return true;
	}

	if (typeof config1 !== 'object' || typeof config2 !== 'object' || !config1 || !config2) {
		return config1 === config2;
	}

	const keys1 = Object.keys(config1);
	const keys2 = Object.keys(config2);

	if (keys1.length !== keys2.length) {
		return false;
	}

	for (const key of keys1) {
		if (!keys2.includes(key)) {
			return false;
		}

		const value1 = config1[key];
		const value2 = config2[key];

		// For non-encrypted values, do deep comparison
		if (!isEqual(value1, value2)) {
			return false;
		}
	}

	return true;
}
