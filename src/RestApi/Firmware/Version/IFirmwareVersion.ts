export interface IFile {
	hash: string;
	content: NodeJS.ReadableStream;
	size: number;
}

export interface IFirmwareVersionUpdatable {
	uploaded: boolean;
}

export interface IFirmwareVersionCreatable {
	applicationType: string;
	version: string;
	files: Array<IFile>;
}

export interface IFirmwareVersion extends IFirmwareVersionUpdatable, IFirmwareVersionCreatable {
	uid: string;
	createdAt: Date;
}

export default IFirmwareVersion;
