
export interface IAppletVersionFileUpdatable {
	hash: string;
	size: number;
	content: NodeJS.ReadableStream;
}

export interface IAppletVersionFileCreatable extends IAppletVersionFileUpdatable {
	name: string;
	path: string;
	type: string;
}

const IAppletVersionFile = 'applet.version.file';
type IAppletVersionFile = Partial<IAppletVersionFileCreatable> & Pick<IAppletVersionFileCreatable, 'name' | 'path'>;

export default IAppletVersionFile;
