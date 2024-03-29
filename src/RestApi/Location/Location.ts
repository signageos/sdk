import { Feature, Point } from 'geojson';

import { fillDataToEntity } from '../mapper';

export type Coordinates = { lat: number; long: number };

export type Address = string;

export interface ILocation {
	uid: string;
	name: string;
	feature: Feature<Point>;
	organizationUid: string;
	customId?: string;
	attachments: string[];
	description?: string;
	tagUids?: string[];
	createdAt: Date;
	updatedAt: Date;
	archivedAt?: Date;
}

/**
 * One of the `Coordinates` or `Address` must be always in the params. But just only one
 */
export interface ILocationCreate {
	name: ILocation['name'];
	coordinates?: Coordinates;
	address?: Address;
	customId: ILocation['customId'];
	description: ILocation['description'];
}

export interface ILocationUpdate {
	name?: string;
	coordinates?: Coordinates;
	address?: Address;
	customId?: string;
	description: ILocation['description'];
}

export interface ILocationFilter {
	uid?: ILocation['uid'];
}

export default class Location implements ILocation {
	public readonly uid: ILocation['uid'];
	public readonly name: ILocation['name'];
	public readonly feature: ILocation['feature'];
	public readonly organizationUid: ILocation['organizationUid'];
	public readonly customId: ILocation['customId'];
	public readonly attachments: ILocation['attachments'];
	public readonly description: ILocation['description'];
	public readonly tagUids: ILocation['tagUids'];
	public readonly createdAt: ILocation['createdAt'];
	public readonly updatedAt: ILocation['updatedAt'];
	public readonly archivedAt: ILocation['archivedAt'];

	constructor(data: ILocation) {
		fillDataToEntity(this, data);
	}
}
