export function fillDataToEntity<T extends object>(entity: T, data: T) {
	for (const key in data) {
		entity[key] = data[key];
	}
	for (const key in entity) {
		if (!(key in data)) {
			const descriptor = Object.getOwnPropertyDescriptor(entity, key);
			if (descriptor) {
				Object.defineProperty(entity, key, { enumerable: false });
			}
		}
	}
}
