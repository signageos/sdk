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
import IFile from '@signageos/front-applet/es6/FrontApplet/Offline/Cache/IFile';
import AppletCommandManagement from '../../../../Applet/Command/AppletCommandManagement';
import { waitUntilReturnValue } from '../../../../../Timer/waitUntil';
import IOfflineCache from '@signageos/front-applet/es6/FrontApplet/Offline/Cache/IOfflineCache';

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
		return await waitUntilReturnValue(async () => {
			const filesListedCommands = await this.appletCommandManagement.list<OfflineCacheFilesListed>(this.deviceUid, this.appletUid, {
				receivedSince: listFilesCommand.receivedAt,
				type: OfflineCacheFilesListed,
			});
			if (filesListedCommands.length > 0) {
				return filesListedCommands[0].command.fileUids;
			}
		});
	}

	public async loadFile(uid: string): Promise<IFile> {
		const loadFileCommand = await this.appletCommandManagement.send<OfflineCacheLoadFile>(this.deviceUid, this.appletUid, {
			command: { type: OfflineCacheLoadFile, uid },
		});
		return await waitUntilReturnValue(async () => {
			const fileLoadedCommands = await this.appletCommandManagement.list<OfflineCacheFileLoaded>(this.deviceUid, this.appletUid, {
				receivedSince: loadFileCommand.receivedAt,
				type: OfflineCacheFileLoaded,
			});
			if (fileLoadedCommands.length > 0) {
				return fileLoadedCommands[0].command.file;
			}
		});
	}

	public async getChecksumFile(uid: string, hashType: string): Promise<string> {
		const getChecksumFileCommand = await this.appletCommandManagement.send<OfflineCacheGetChecksumRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheGetChecksumRequest,
				uid,
				hashType,
			},
		});
		return await waitUntilReturnValue(async () => {
			const getChecksumCommands = await this.appletCommandManagement.list<OfflineCacheGetChecksumResult>(this.deviceUid, this.appletUid, {
				receivedSince: getChecksumFileCommand.receivedAt,
				type: OfflineCacheGetChecksumResult,
			});
			if (getChecksumCommands.length > 0) {
				return getChecksumCommands[0].command.result;
			}
		});
	}

	public async validateChecksumFile(uid: string, hash: string, hashType: string): Promise<boolean> {
		const validateChecksumCommand = await this.appletCommandManagement.send<OfflineCacheValidateChecksumRequest>(
			this.deviceUid,
			this.appletUid,
			{
				command: { type: OfflineCacheValidateChecksumRequest, uid, hash, hashType },
			},
		);
		return await waitUntilReturnValue(async () => {
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
		});
	}

	public async loadOrSaveFile(uid: string, uri: string, headers?: { [key: string]: string } | undefined): Promise<IFile> {
		const loadOrSaveCommand = await this.appletCommandManagement.send<OfflineCacheLoadOrSaveFileRequest>(this.deviceUid, this.appletUid, {
			command: { type: OfflineCacheLoadOrSaveFileRequest, uid, uri, headers },
		});
		return await waitUntilReturnValue(async () => {
			const loadOrSaveCommands = await this.appletCommandManagement.list<OfflineCacheLoadOrSaveFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: loadOrSaveCommand.receivedAt,
				type: OfflineCacheLoadOrSaveFileResult,
			});
			if (loadOrSaveCommands.length > 0) {
				return loadOrSaveCommands[0].command.file;
			}
		});
	}

	public async deleteFile(uid: string): Promise<void> {
		const deleteFileCommand = await this.appletCommandManagement.send<OfflineCacheDeleteFileRequest>(this.deviceUid, this.appletUid, {
			command: { type: OfflineCacheDeleteFileRequest, uid },
		});
		await waitUntilReturnValue(async () => {
			const deleteFileCommands = await this.appletCommandManagement.list<OfflineCacheDeleteFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: deleteFileCommand.receivedAt,
				type: OfflineCacheDeleteFileResult,
			});
			if (deleteFileCommands.length > 0) {
				return deleteFileCommands[0].command.result;
			}
		});
	}

	public async listContents(): Promise<string[]> {
		const listContentsCommand = await this.appletCommandManagement.send<OfflineCacheListContentRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheListContentRequest,
			},
		});
		return await waitUntilReturnValue(async () => {
			const listContentsResults = await this.appletCommandManagement.list<OfflineCacheListContentResult>(this.deviceUid, this.appletUid, {
				receivedSince: listContentsCommand.receivedAt,
				type: OfflineCacheListContentResult,
			});
			if (listContentsResults.length > 0) {
				return listContentsResults[0].command.result;
			}
		});
	}

	public async loadContent(uid: string): Promise<string> {
		const command = await this.appletCommandManagement.send<OfflineCacheLoadContentRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheLoadContentRequest,
				uid,
			},
		});
		return await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<OfflineCacheLoadContentResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: OfflineCacheLoadContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}

	public async saveContent(uid: string, content: string): Promise<void> {
		const command = await this.appletCommandManagement.send<OfflineCacheSaveContentRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheSaveContentRequest,
				uid,
				content,
			},
		});
		await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<OfflineCacheSaveContentResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: OfflineCacheSaveContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}

	public async deleteContent(uid: string): Promise<void> {
		const command = await this.appletCommandManagement.send<OfflineCacheDeleteContentRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: OfflineCacheDeleteContentRequest,
				uid,
			},
		});
		await waitUntilReturnValue(async () => {
			const results = await this.appletCommandManagement.list<OfflineCacheDeleteContentResult>(this.deviceUid, this.appletUid, {
				receivedSince: command.receivedAt,
				type: OfflineCacheDeleteContentResult,
			});
			if (results.length > 0) {
				return results[0].command.result;
			}
		});
	}

	public async decompressFile(_uid: string, _destinationUid: string, _method: string): Promise<void> {
		throw new Error('Not implemented');
	}

	public async saveFile(_uid: string, _uri: string, _headers?: { [p: string]: string }): Promise<void> {
		throw new Error('Not implemented');
	}
}
