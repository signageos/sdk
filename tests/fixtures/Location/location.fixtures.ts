import { random } from 'faker';

import { Api } from '../../../src';
import { ILocation, ILocationCreate, ILocationUpdate, Coordinates } from '../../../src/RestApi/Location/Location';
import { ORGANIZATION_TAG_1 } from '../Organization/Tag/organizationTag.fixtures';

export type LocationCreateWithoutOrg = Omit<ILocationCreate, 'organizationUid'>;
export type LocationWithoutOrg = Omit<ILocation, 'organizationUid'>;

export const handleCreateLocation = async (
	api: Api,
	params: { location: LocationCreateWithoutOrg; organizationUid: string },
) => {
	const locationPayload = {
		...params.location,
		organizationUid: params.organizationUid,
	};

	return api.location.create(locationPayload);
};

export const COORDINATES_1: Coordinates = { long: -122.40492, lat: 37.78119 }; // Address: ADDRESS_1
export const COORDINATES_2: Coordinates = { long: -74.011025, lat: 40.707085 }; // Address: ADDRESS_2

export const ADDRESS_1 = 'Howard Street, San Francisco, CA, USA'; // Coordinates: COORDINATES_1
export const ADDRESS_2 = '11 Wall Street, New York, New York 10005, United States'; // Coordinates: COORDINATES_2

export const LOCATION_CREATE_1: LocationCreateWithoutOrg = {
	name: `SDK Location (0)`,
	coordinates: COORDINATES_1,
	attachments: ['www.attachment-1.com', 'www.attachment-2.com'],
	description: 'test note 1',
	customId: 'custom-id-123',
};
export const LOCATION_CREATE_2: LocationCreateWithoutOrg = {
	name: `SDK Location (1)`,
	address: ADDRESS_1,
	attachments: ['www.attachment-3.com', 'www.attachment-4.com'],
	description: 'test note 2',
	customId: undefined,
};

export const LOCATION_UPDATE_1: Omit<ILocationUpdate, 'organizationUid'> = {
	name: `SDK Location (update-1)`,
	coordinates: COORDINATES_1,
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
export const LOCATION_3: LocationWithoutOrg = {
	uid: random.uuid(),
	name: `SDK Location (4)`,
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
	tagUids: [ORGANIZATION_TAG_1.uid],
	customId: undefined,
	createdAt: new Date(),
	updatedAt: new Date(),
};
