export interface IAppletVersionUpdatable {
	/** @deprecated used only for old single file applets. No more supported. */
	binary?: string | NodeJS.ReadableStream;
	/** @deprecated used only for old single file applets. No more supported. */
	frontAppletVersion?: string;
	entryFile?: string;
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
