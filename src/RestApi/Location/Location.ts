import { Feature, Point } from 'geojson';

import { fillDataToEntity } from '../mapper';

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
}

export interface ILocationCreate {
	name: string;
	feature: Feature<Point>;
	organizationUid: string;
	customId?: string;
	attachments?: string[];
	description?: string;
}

export interface ILocationUpdate {
	name?: string;
	feature?: Feature<Point>;
	customId?: string;
	attachments?: string[];
	description?: string;
}

export interface ILocationFilter {
	uid?: string;
	organizationUids?: string[];
	tagUids?: string[];
	name?: string;
	withDeviceNumber?: string;
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

	constructor(data: ILocation) {
		fillDataToEntity(this, data);
	}
}
