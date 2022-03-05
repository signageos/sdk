import { random } from 'faker';

import { ILocation, ILocationCreate, ILocationUpdate } from '../../../../src/RestApi/Location/Location';

export type LocationCreateWithoutOrg = Omit<ILocationCreate, 'organizationUid'>;
export type LocationWithoutOrg = Omit<ILocation, 'organizationUid'>;

export const LOCATION_CREATE_1: LocationCreateWithoutOrg = {
	name: `SDK Location (0)`,
	feature: {
		type: 'Feature',
		properties: {
			name: 'Feature name 1',
			amenity: 'Baseball Stadium',
			popupContent: 'This is where the Rockies play!',
		},
		geometry: {
			type: 'Point',
			coordinates: [-11.11111, 11.11111],
		},
	},
	attachments: ['www.attachment-1.com', 'www.attachment-2.com'],
	description: 'test note 1',
	customId: 'custom-id-123',
};
export const LOCATION_CREATE_2: LocationCreateWithoutOrg = {
	name: `SDK Location (1)`,
	feature: {
		type: 'Feature',
		properties: {
			name: 'Feature name 2',
			amenity: 'Football Stadium',
			popupContent: 'This is where the pros play!',
		},
		geometry: {
			type: 'Point',
			coordinates: [-22.22222, 22.22222],
		},
	},
	attachments: ['www.attachment-3.com', 'www.attachment-4.com'],
	description: 'test note 2',
	customId: undefined,
};

export const LOCATION_UPDATE_1: Omit<ILocationUpdate, 'organizationUid'> = {
	name: `SDK Location (update-1)`,
	feature: {
		type: 'Feature',
		properties: {
			name: 'Feature name 2',
			amenity: 'Football Stadium',
			popupContent: 'This is where the pros play!',
		},
		geometry: {
			type: 'Point',
			coordinates: [-22.22222, 22.22222],
		},
	},
	attachments: ['www.attachment-3.com', 'www.attachment-4.com'],
	description: 'test note 2',
	customId: 'custom-id-456',
};

export const LOCATION_1: LocationWithoutOrg = {
	uid: random.uuid(),
	name: `SDK Location (2)`,
	feature: {
		type: 'Feature',
		properties: {
			name: 'Feature name 3',
			amenity: 'Baseball Stadium',
			popupContent: 'This is where the Rockies play!',
		},
		geometry: {
			type: 'Point',
			coordinates: [-11.11111, 11.11111],
		},
	},
	attachments: ['www.attachment-1.com', 'www.attachment-2.com'],
	description: 'test note 1',
	customId: 'custom-id-123',
	createdAt: new Date(),
	updatedAt: new Date(),
};
export const LOCATION_2: LocationWithoutOrg = {
	uid: random.uuid(),
	name: `SDK Location (3)`,
	feature: {
		type: 'Feature',
		properties: {
			name: 'Feature name 3',
			amenity: 'Football Stadium',
			popupContent: 'This is where the pros play!',
		},
		geometry: {
			type: 'Point',
			coordinates: [-22.22222, 22.22222],
		},
	},
	attachments: ['www.attachment-3.com', 'www.attachment-4.com'],
	description: 'test note 2',
	customId: undefined,
	createdAt: new Date(),
	updatedAt: new Date(),
};
