import {
	ICopyFileOptions,
	IFilePath,
	IHeaders,
	IMoveFileOptions,
	IStorageUnit,
	IFile as IFileSystemFile,
} from '@signageos/front-applet/es6/FrontApplet/FileSystem/types';
import TimingCommandManagement from '../../Command/TimingCommandManagement';
import {
	FileSystemAppendFileRequest,
	FileSystemAppendFileResult,
	FileSystemCopyFileRequest,
	FileSystemCopyFileResult,
	FileSystemCreateDirectoryRequest,
	FileSystemCreateDirectoryResult,
	FileSystemDeleteFileRequest,
	FileSystemDeleteFileResult,
	FileSystemDownloadFileRequest,
	FileSystemDownloadFileResult,
	FileSystemExistsRequest,
	FileSystemExistsResult,
	FileSystemExtractFileRequest,
	FileSystemExtractFileResult,
	FileSystemGetFileChecksumRequest,
	FileSystemGetFileChecksumResult,
	FileSystemGetFileRequest,
	FileSystemGetFileResult,
	FileSystemIsDirectoryRequest,
	FileSystemIsDirectoryResult,
	FileSystemListFilesRequest,
	FileSystemListFilesResult,
	FileSystemListOfStorageUnitsRequest,
	FileSystemListOfStorageUnitsResult,
	FileSystemMoveFileRequest,
	FileSystemMoveFileResult,
	FileSystemReadFileRequest,
	FileSystemReadFileResult,
	FileSystemWriteFileRequest,
	FileSystemWriteFileResult,
} from '@signageos/front-applet/es6/Monitoring/FileSystem/fileSystemCommands';
import wait from '../../../../Timer/wait';

/**
 * @description See the documentation [File System](https://sdk.docs.signageos.io/api/js/content/5.5.0/js-file-system)
 */
export interface IFileSystem {
	listStorageUnits(): Promise<IStorageUnit[]>;
	listFiles(directoryPath: IFilePath): Promise<IFilePath[]>;
	exists(filePath: IFilePath): Promise<boolean>;
	getFile(filePath: IFilePath): Promise<IFileSystemFile | null>;
	writeFile(filePath: IFilePath, content: string): Promise<void>;
	appendFile(filePath: IFilePath, content: string): Promise<void>;
	readFile(filePath: IFilePath): Promise<string>;
	copyFile(sourceFilePath: IFilePath, destinationFilePath: IFilePath, options: ICopyFileOptions | {}): Promise<void>;
	moveFile(sourceFilePath: IFilePath, destinationFilePath: IFilePath, options: IMoveFileOptions | {}): Promise<void>;
	deleteFile(filePath: IFilePath, recursive: boolean): Promise<void>;
	downloadFile(filePath: IFilePath, sourceUri: string, headers?: IHeaders): Promise<void>;
	extractFile(archiveFilePath: IFilePath, destinationDirectionPath: IFilePath, method: string): Promise<void>;
	getFileChecksum(filePath: IFilePath, hashType: string): Promise<string>;
	createDirectory(directoryPath: IFilePath): Promise<void>;
	isDirectory(filePath: IFilePath): Promise<boolean>;
}

export default class FileSystemCommands implements IFileSystem {
	constructor(
		private deviceUid: string,
		private appletUid: string,
		private timingCommandManagement: TimingCommandManagement,
	) {}

	public async listStorageUnits(): Promise<IStorageUnit[]> {
		const listStorageUnitsCommand = await this.timingCommandManagement.create<FileSystemListOfStorageUnitsRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemListOfStorageUnitsRequest,
			},
		});
		while (true) {
			const listOfStorageUnitsCommands = await this.timingCommandManagement.getList<FileSystemListOfStorageUnitsResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: listStorageUnitsCommand.receivedAt.toISOString(),
				type: FileSystemListOfStorageUnitsResult,
			});
			if (listOfStorageUnitsCommands.length > 0) {
				return listOfStorageUnitsCommands[0].command.storageUnits;
			}
			await wait(500);
		}
	}

	public async listFiles(directoryPath: IFilePath): Promise<IFilePath[]> {
		const listFilesCommand = await this.timingCommandManagement.create<FileSystemListFilesRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemListFilesRequest,
				filePath: directoryPath,
			},
		});
		while (true) {
			const listFilesCommands = await this.timingCommandManagement.getList<FileSystemListFilesResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: listFilesCommand.receivedAt.toISOString(),
				type: FileSystemListFilesResult,
			});
			if (listFilesCommands.length > 0) {
				return listFilesCommands[0].command.pathList;
			}
			await wait(500);
		}
	}

	public async exists(filePath: IFilePath): Promise<boolean> {
		const existsFileCommand = await this.timingCommandManagement.create<FileSystemExistsRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemExistsRequest,
				filePath,
			},
		});
		while (true) {
			const listExistsFileCommands = await this.timingCommandManagement.getList<FileSystemExistsResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: existsFileCommand.receivedAt.toISOString(),
				type: FileSystemExistsResult,
			});
			if (listExistsFileCommands.length > 0) {
				return listExistsFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getFile(filePath: IFilePath): Promise<IFileSystemFile | null> {
		const getFileCommand = await this.timingCommandManagement.create<FileSystemGetFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemGetFileRequest,
				filePath,
			},
		});
		while (true) {
			const listGetFileCommands = await this.timingCommandManagement.getList<FileSystemGetFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: getFileCommand.receivedAt.toISOString(),
				type: FileSystemGetFileResult,
			});
			if (listGetFileCommands.length > 0) {
				return listGetFileCommands[0].command.file;
			}
			await wait(500);
		}
	}

	public async writeFile(filePath: IFilePath, content: string): Promise<void> {
		const writeFileCommand = await this.timingCommandManagement.create<FileSystemWriteFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemWriteFileRequest,
				filePath,
				content,
			},
		});
		while (true) {
			const listWriteFileCommands = await this.timingCommandManagement.getList<FileSystemWriteFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: writeFileCommand.receivedAt.toISOString(),
				type: FileSystemWriteFileResult,
			});
			if (listWriteFileCommands.length > 0) {
				return listWriteFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async appendFile(filePath: IFilePath, content: string): Promise<void> {
		const appendFileCommand = await this.timingCommandManagement.create<FileSystemAppendFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemAppendFileRequest,
				filePath,
				content,
			},
		});
		while (true) {
			const appendFileCommands = await this.timingCommandManagement.getList<FileSystemAppendFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: appendFileCommand.receivedAt.toISOString(),
				type: FileSystemAppendFileResult,
			});
			if (appendFileCommands.length > 0) {
				return appendFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async readFile(filePath: IFilePath): Promise<string> {
		const readFileCommand = await this.timingCommandManagement.create<FileSystemReadFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemReadFileRequest,
				filePath,
			},
		});
		while (true) {
			const listReadFileCommands = await this.timingCommandManagement.getList<FileSystemReadFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: readFileCommand.receivedAt.toISOString(),
				type: FileSystemReadFileResult,
			});
			if (listReadFileCommands.length > 0) {
				return listReadFileCommands[0].command.data;
			}
			await wait(500);
		}
	}

	public async copyFile(sourceFilePath: IFilePath, destinationFilePath: IFilePath, options: {} | ICopyFileOptions): Promise<void> {
		const copyFileCommand = await this.timingCommandManagement.create<FileSystemCopyFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemCopyFileRequest,
				sourceFilePath,
				destinationFilePath,
				options,
			},
		});
		while (true) {
			const listCopyFileCommands = await this.timingCommandManagement.getList<FileSystemCopyFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: copyFileCommand.receivedAt.toISOString(),
				type: FileSystemCopyFileResult,
			});
			if (listCopyFileCommands.length > 0) {
				return listCopyFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async moveFile(sourceFilePath: IFilePath, destinationFilePath: IFilePath, options: {} | IMoveFileOptions): Promise<void> {
		const moveFileCommand = await this.timingCommandManagement.create<FileSystemMoveFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemMoveFileRequest,
				sourceFilePath,
				destinationFilePath,
				options,
			},
		});
		while (true) {
			const listMoveFileCommands = await this.timingCommandManagement.getList<FileSystemMoveFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: moveFileCommand.receivedAt.toISOString(),
				type: FileSystemMoveFileResult,
			});
			if (listMoveFileCommands.length > 0) {
				return listMoveFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async deleteFile(filePath: IFilePath, recursive: boolean): Promise<void> {
		const deleteFileCommand = await this.timingCommandManagement.create<FileSystemDeleteFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemDeleteFileRequest,
				filePath,
				recursive,
			},
		});
		while (true) {
			const listDeleteFileCommands = await this.timingCommandManagement.getList<FileSystemDeleteFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: deleteFileCommand.receivedAt.toISOString(),
				type: FileSystemDeleteFileResult,
			});
			if (listDeleteFileCommands.length > 0) {
				return listDeleteFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async downloadFile(filePath: IFilePath, sourceUri: string, headers?: IHeaders | undefined): Promise<void> {
		const downloadFileCommand = await this.timingCommandManagement.create<FileSystemDownloadFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemDownloadFileRequest,
				filePath,
				sourceUri,
				headers,
			},
		});
		while (true) {
			const listDownloadFileCommands = await this.timingCommandManagement.getList<FileSystemDownloadFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: downloadFileCommand.receivedAt.toISOString(),
				type: FileSystemDownloadFileResult,
			});
			if (listDownloadFileCommands.length > 0) {
				return listDownloadFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async extractFile(archiveFilePath: IFilePath, destinationDirectionPath: IFilePath, method: string): Promise<void> {
		const extractFileCommand = await this.timingCommandManagement.create<FileSystemExtractFileRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemExtractFileRequest,
				archiveFilePath,
				destinationDirectionPath,
				method,
			},
		});
		while (true) {
			const listExtractFileCommands = await this.timingCommandManagement.getList<FileSystemExtractFileResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: extractFileCommand.receivedAt.toISOString(),
				type: FileSystemExtractFileResult,
			});
			if (listExtractFileCommands.length > 0) {
				return listExtractFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getFileChecksum(filePath: IFilePath, hashType: string): Promise<string> {
		const getChecksumCommand = await this.timingCommandManagement.create<FileSystemGetFileChecksumRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemGetFileChecksumRequest,
				filePath,
				hashType,
			},
		});
		while (true) {
			const getChecksumCommands = await this.timingCommandManagement.getList<FileSystemGetFileChecksumResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: getChecksumCommand.receivedAt.toISOString(),
				type: FileSystemGetFileChecksumResult,
			});
			if (getChecksumCommands.length > 0) {
				return getChecksumCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async createDirectory(directoryPath: IFilePath): Promise<void> {
		const createDirectoryCommand = await this.timingCommandManagement.create<FileSystemCreateDirectoryRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemCreateDirectoryRequest,
				directoryPath,
			},
		});
		while (true) {
			const listCreateDirectoryCommands = await this.timingCommandManagement.getList<FileSystemCreateDirectoryResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: createDirectoryCommand.receivedAt.toISOString(),
				type: FileSystemCreateDirectoryResult,
			});
			if (listCreateDirectoryCommands.length > 0) {
				return listCreateDirectoryCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async isDirectory(filePath: IFilePath): Promise<boolean> {
		const isDirectoryCommand = await this.timingCommandManagement.create<FileSystemIsDirectoryRequest>({
			deviceUid: this.deviceUid,
			appletUid: this.appletUid,
			command: {
				type: FileSystemIsDirectoryRequest,
				filePath,
			},
		});
		while (true) {
			const isDirectoryCommands = await this.timingCommandManagement.getList<FileSystemIsDirectoryResult>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: isDirectoryCommand.receivedAt.toISOString(),
				type: FileSystemIsDirectoryResult,
			});
			if (isDirectoryCommands.length > 0) {
				return isDirectoryCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
