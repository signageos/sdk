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
import TimingCommandManagement from '../../../Command/TimingCommandManagement';
import IFile from '@signageos/front-applet/es6/FrontApplet/Offline/Cache/IFile';

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
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async listFiles(): Promise<string[]> {
		const listFilesCommand = await this.timingCommandManagement.create<OfflineCacheListFiles>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheListFiles,
			},
		});
		while (true) {
			const filesListedCommands = await this.timingCommandManagement.getList<OfflineCacheFilesListed>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: listFilesCommand.receivedAt.toISOString(),
				type: OfflineCacheFilesListed,
			});
			if (filesListedCommands.length > 0) {
				return filesListedCommands[0].command.fileUids;
			}
			await wait(500);
		}
	}

	public async loadFile(uid: string): Promise<IFile> {
		const loadFileCommand = await this.timingCommandManagement.create<OfflineCacheLoadFile>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheLoadFile,
				uid,
			},
		});
		while (true) {
			const fileLoadedCommands = await this.timingCommandManagement.getList<OfflineCacheFileLoaded>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: loadFileCommand.receivedAt.toISOString(),
				type: OfflineCacheFileLoaded,
			});
			if (fileLoadedCommands.length > 0) {
				return fileLoadedCommands[0].command.file;
			}
			await wait(500);
		}
	}

	public async getChecksumFile(uid: string, hashType: string): Promise<string> {
		const getChecksumFileCommand = await this.timingCommandManagement.create<OfflineCacheGetChecksumRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheGetChecksumRequest,
				uid,
				hashType,
			},
		});
		while (true) {
			const getChecksumCommands = await this.timingCommandManagement.getList<OfflineCacheGetChecksumResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: getChecksumFileCommand.receivedAt.toISOString(),
				type: OfflineCacheGetChecksumResult,
			});
			if (getChecksumCommands.length > 0) {
				return getChecksumCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async validateChecksumFile(uid: string, hash: string, hashType: string): Promise<boolean> {
		const validateChecksumCommand = await this.timingCommandManagement.create<OfflineCacheValidateChecksumRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheValidateChecksumRequest,
				uid,
				hash,
				hashType,
			},
		});
		while (true) {
			const validateChecksumCommands = await this.timingCommandManagement.getList<OfflineCacheValidateChecksumResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: validateChecksumCommand.receivedAt.toISOString(),
				type: OfflineCacheValidateChecksumResult,
			});
			if (validateChecksumCommands.length > 0) {
				return validateChecksumCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async loadOrSaveFile(uid: string, uri: string, headers?: { [key: string]: string } | undefined): Promise<IFile> {
		const loadOrSaveCommand = await this.timingCommandManagement.create<OfflineCacheLoadOrSaveFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheLoadOrSaveFileRequest,
				uid,
				uri,
				headers,
			},
		});
		while (true) {
			const loadOrSaveCommands = await this.timingCommandManagement.getList<OfflineCacheLoadOrSaveFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: loadOrSaveCommand.receivedAt.toISOString(),
				type: OfflineCacheLoadOrSaveFileResult,
			});
			if (loadOrSaveCommands.length > 0) {
				return loadOrSaveCommands[0].command.file;
			}
			await wait(500);
		}
	}

	public async deleteFile(uid: string): Promise<void> {
		const deleteFileCommand = await this.timingCommandManagement.create<OfflineCacheDeleteFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheDeleteFileRequest,
				uid,
			},
		});
		while (true) {
			const deleteFileCommands = await this.timingCommandManagement.getList<OfflineCacheDeleteFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: deleteFileCommand.receivedAt.toISOString(),
				type: OfflineCacheDeleteFileResult,
			});
			if (deleteFileCommands.length > 0) {
				return deleteFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async listContents(): Promise<string[]> {
		const listContentsCommand = await this.timingCommandManagement.create<OfflineCacheListContentRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheListContentRequest,
			},
		});
		while (true) {
			const listContentsResults = await this.timingCommandManagement.getList<OfflineCacheListContentResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: listContentsCommand.receivedAt.toISOString(),
				type: OfflineCacheListContentResult,
			});
			if (listContentsResults.length > 0) {
				return listContentsResults[0].command.result;
			}
			await wait(500);
		}
	}

	public async loadContent(uid: string): Promise<string> {
		const command = await this.timingCommandManagement.create<OfflineCacheLoadContentRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheLoadContentRequest,
				uid,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<OfflineCacheLoadContentResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: OfflineCacheLoadContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async saveContent(uid: string, content: string): Promise<void> {
		const command = await this.timingCommandManagement.create<OfflineCacheSaveContentRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheSaveContentRequest,
				uid,
				content,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<OfflineCacheSaveContentResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: OfflineCacheSaveContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}

	public async deleteContent(uid: string): Promise<void> {
		const command = await this.timingCommandManagement.create<OfflineCacheDeleteContentRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: OfflineCacheDeleteContentRequest,
				uid,
			},
		});
		while (true) {
			const results = await this.timingCommandManagement.getList<OfflineCacheDeleteContentResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: command.receivedAt.toISOString(),
				type: OfflineCacheDeleteContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
			await wait(500);
		}
	}
}
