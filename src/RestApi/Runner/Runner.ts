import { fillDataToEntity } from '../mapper';

export interface IRunner {
	uid: string;
	name: string;
	title: string;
	description?: string;
}

export type IRunnerCreatable = Pick<IRunner, 'name' | 'title' | 'description'>;
export type IRunnernUpdatable = Partial<Pick<IRunner, 'name' | 'title' | 'description'>>;

export class Runner implements IRunner {
	public readonly uid: IRunner['uid'];
	public readonly name: IRunner['name'];
	public readonly title: IRunner['title'];
	public readonly description?: IRunner['description'];

	constructor(data: IRunner) {
		fillDataToEntity(this, data);
	}
}
