import {
	OfflineCacheDeleteContentRequest,
	OfflineCacheDeleteContentResult,
	OfflineCacheDeleteFileRequest,
	OfflineCacheDeleteFileResult,
	OfflineCacheFileLoaded,
	OfflineCacheFilesListed,
	OfflineCacheGetChecksumRequest,
	OfflineCacheGetChecksumResult,
	OfflineCacheListContentRequest,
	OfflineCacheListContentResult,
	OfflineCacheListFiles,
	OfflineCacheLoadContentRequest,
	OfflineCacheLoadContentResult,
	OfflineCacheLoadFile,
	OfflineCacheLoadOrSaveFileRequest,
	OfflineCacheLoadOrSaveFileResult,
	OfflineCacheSaveContentRequest,
	OfflineCacheSaveContentResult,
	OfflineCacheValidateChecksumRequest,
	OfflineCacheValidateChecksumResult,
} from '@signageos/front-applet/es6/Monitoring/Offline/Cache/offlineCacheCommands';
import wait from '../../../../../Timer/wait';
import IFile from '@signageos/front-applet/es6/FrontApplet/Offline/Cache/IFile';
import AppletCommandManagement from '../../../../Applet/Command/AppletCommandManagement';

export interface IOfflineCache {
	listFiles(): Promise<string[]>;
	loadFile(uid: string): Promise<IFile>;
	getChecksumFile(uid: string, hashType: string): Promise<string>;
	validateChecksumFile(uid: string, hash: string, hashType: string): Promise<boolean>;
	loadOrSaveFile(uid: string, uri: string, headers?: { [key: string]: string }): Promise<IFile>;
	deleteFile(uid: string): Promise<void>;
	listContents(): Promise<string[]>;
	loadContent(uid: string): Promise<string>;
	saveContent(uid: string, content: string): Promise<void>;
	deleteContent(uid: string): Promise<void>;
}

/**
 * @description See the documentation
 * [Offline Cache for media files (File API)](https://developers.signageos.io/sdk/content/js-offline-cache-media-files)
 */
export default class OfflineCacheCommands implements IOfflineCache {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async listFiles(): Promise<string[]> {
		const listFilesCommand = await this.appletCommandManagement.send<OfflineCacheListFiles>(this.deviceUid, this.appletUid, {
			command: { type: OfflineCacheListFiles },
		});
		while (true) {
			const filesListedCommands = await this.appletCommandManagement.list<OfflineCacheFilesListed>(this.deviceUid, this.appletUid, {
				receivedSince: listFilesCommand.receivedAt,
				type: OfflineCacheFilesListed,
			});
			if (filesListedCommands.length > 0) {
				return filesListedCommands[0].command.fileUids;
			}
			await wait(500);
		}
	}

	public async loadFile(uid: string): Promise<IFile> {
		const loadFileCommand = await this.appletCommandManagement.send<OfflineCacheLoadFile>(this.deviceUid, this.appletUid, {
			command: { type: OfflineCacheLoadFile, uid },
		});
		while (true) {
			const fileLoadedCommands = await this.appletCommandManagement.list<OfflineCacheFileLoaded>(this.deviceUid, this.appletUid, {
				receivedSince: loadFileCommand.receivedAt,
				type: OfflineCacheFileLoaded,
			});
			if (fileLoadedCommands.length > 0) {
				return fileLoadedCommands[0].command.file;
			}
			await wait(500);
		}
	}

	public async getChecksumFile(uid: string, hashType: string): Promise<string> {
		const getChecksumFileCommand = await this.appletCommandManagement.send<OfflineCacheGetChecksumRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheGetChecksumRequest,
				uid,
				hashType,
			},
		});
		while (true) {
			const getChecksumCommands = await this.appletCommandManagement.list<OfflineCacheGetChecksumResult>(this.deviceUid, this.appletUid, {
				receivedSince: getChecksumFileCommand.receivedAt,
				type: OfflineCacheGetChecksumResult,
			});
			if (getChecksumCommands.length > 0) {
				return getChecksumCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async validateChecksumFile(uid: string, hash: string, hashType: string): Promise<boolean> {
		const validateChecksumCommand = await this.appletCommandManagement.send<OfflineCacheValidateChecksumRequest>(
			this.deviceUid,
			this.appletUid,
			{
				command: { type: OfflineCacheValidateChecksumRequest, uid, hash, hashType },
			},
		);
		while (true) {
			const validateChecksumCommands = await this.appletCommandManagement.list<OfflineCacheValidateChecksumResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: validateChecksumCommand.receivedAt,
					type: OfflineCacheValidateChecksumResult,
				},
			);
			if (validateChecksumCommands.length > 0) {
				return validateChecksumCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async loadOrSaveFile(uid: string, uri: string, headers?: { [key: string]: string } | undefined): Promise<IFile> {
		const loadOrSaveCommand = await this.appletCommandManagement.send<OfflineCacheLoadOrSaveFileRequest>(this.deviceUid, this.appletUid, {
			command: { type: OfflineCacheLoadOrSaveFileRequest, uid, uri, headers },
		});
		while (true) {
			const loadOrSaveCommands = await this.appletCommandManagement.list<OfflineCacheLoadOrSaveFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: loadOrSaveCommand.receivedAt,
				type: OfflineCacheLoadOrSaveFileResult,
			});
			if (loadOrSaveCommands.length > 0) {
				return loadOrSaveCommands[0].command.file;
			}
			await wait(500);
		}
	}

	public async deleteFile(uid: string): Promise<void> {
		const deleteFileCommand = await this.appletCommandManagement.send<OfflineCacheDeleteFileRequest>(this.deviceUid, this.appletUid, {
			command: { type: OfflineCacheDeleteFileRequest, uid },
		});
		while (true) {
			const deleteFileCommands = await this.appletCommandManagement.list<OfflineCacheDeleteFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: deleteFileCommand.receivedAt,
				type: OfflineCacheDeleteFileResult,
			});
			if (deleteFileCommands.length > 0) {
				return deleteFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async listContents(): Promise<string[]> {
		const listContentsCommand = await this.appletCommandManagement.send<OfflineCacheListContentRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheListContentRequest,
			},
		});
		while (true) {
			const listContentsResults = await this.appletCommandManagement.list<OfflineCacheListContentResult>(this.deviceUid, this.appletUid, {
				receivedSince: listContentsCommand.receivedAt,
				type: OfflineCacheListContentResult,
			});
			if (listContentsResults.length > 0) {
				return listContentsResults[0].command.result;
			}
			await wait(500);
		}
	}

	public async loadContent(uid: string): Promise<string> {
		const command = await this.appletCommandManagement.send<OfflineCacheLoadContentRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheLoadContentRequest,
				uid,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<OfflineCacheLoadContentResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: OfflineCacheLoadContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async saveContent(uid: string, content: string): Promise<void> {
		const command = await this.appletCommandManagement.send<OfflineCacheSaveContentRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheSaveContentRequest,
				uid,
				content,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<OfflineCacheSaveContentResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: OfflineCacheSaveContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async deleteContent(uid: string): Promise<void> {
		const command = await this.appletCommandManagement.send<OfflineCacheDeleteContentRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheDeleteContentRequest,
				uid,
			},
		});
		while (true) {
			const results = await this.appletCommandManagement.list<OfflineCacheDeleteContentResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: OfflineCacheDeleteContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
