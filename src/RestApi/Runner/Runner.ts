import { fillDataToEntity } from '../mapper';

export interface IRunner {
	uid: string;
	name: string;
	title: string;
	organizationUid: string;
	description?: string;
	tagUids?: string[];
	supportedPlatforms?: string[];
	latestVersion?: string;
}

export type IRunnerCreatable = Pick<IRunner, 'name' | 'title' | 'description' | 'tagUids'>;
export type IRunnerUpdatable = Partial<Pick<IRunner, 'name' | 'title' | 'description' | 'tagUids'>>;

export class Runner implements IRunner {
	public readonly uid: IRunner['uid'];
	public readonly name: IRunner['name'];
	public readonly title: IRunner['title'];
	public readonly organizationUid: IRunner['organizationUid'];
	public readonly description?: IRunner['description'];
	public readonly tagUids?: IRunner['tagUids'];
	public readonly supportedPlatforms?: IRunner['supportedPlatforms'];
	public readonly latestVersion?: IRunner['latestVersion'];

	constructor(data: IRunner) {
		fillDataToEntity(this, data);
	}
}
