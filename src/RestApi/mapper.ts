
export function fillDataToEntity<T>(entity: T & { constructor: Function }, data: T) {
	for (const key in data) {
		entity[key] = data[key];
	}
	for (const key in entity) {
		if (!(key in data)) {
			Object.defineProperty(entity, key, { enumerable: false });
		}
	}
}