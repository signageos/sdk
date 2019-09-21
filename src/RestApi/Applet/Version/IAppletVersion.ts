
export interface IAppletVersionUpdatable {
	binary: string | NodeJS.ReadableStream;
	frontAppletVersion: string;
}

export interface IAppletVersionCreatable extends IAppletVersionUpdatable {
	version: string;
}

interface IAppletVersion extends IAppletVersionCreatable {
	appletUid: string;
	createdAt: Date;
	updatedAt: Date | null;
	publishedSince: Date | null;
	deprecatedSince: Date | null;
	builtSince: Date | null;
}

export default IAppletVersion;
