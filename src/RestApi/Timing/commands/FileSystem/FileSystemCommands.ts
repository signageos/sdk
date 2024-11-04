import {
	ICopyFileOptions,
	IFilePath,
	IHeaders,
	IMoveFileOptions,
	IStorageUnit,
	IFile as IFileSystemFile,
} from '@signageos/front-applet/es6/FrontApplet/FileSystem/types';
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
import AppletCommandManagement from '../../../Applet/Command/AppletCommandManagement';

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
		private appletCommandManagement: AppletCommandManagement,
	) {}

	public async listStorageUnits(): Promise<IStorageUnit[]> {
		const listStorageUnitsCommand = await this.appletCommandManagement.send<FileSystemListOfStorageUnitsRequest>(
			this.deviceUid,
			this.appletUid,
			{
				command: {
					type: FileSystemListOfStorageUnitsRequest,
				},
			},
		);
		while (true) {
			const listOfStorageUnitsCommands = await this.appletCommandManagement.list<FileSystemListOfStorageUnitsResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: listStorageUnitsCommand.receivedAt,
					type: FileSystemListOfStorageUnitsResult,
				},
			);
			if (listOfStorageUnitsCommands.length > 0) {
				return listOfStorageUnitsCommands[0].command.storageUnits;
			}
			await wait(500);
		}
	}

	public async listFiles(directoryPath: IFilePath): Promise<IFilePath[]> {
		const listFilesCommand = await this.appletCommandManagement.send<FileSystemListFilesRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemListFilesRequest,
				filePath: directoryPath,
			},
		});
		while (true) {
			const listFilesCommands = await this.appletCommandManagement.list<FileSystemListFilesResult>(this.deviceUid, this.appletUid, {
				receivedSince: listFilesCommand.receivedAt,
				type: FileSystemListFilesResult,
			});
			if (listFilesCommands.length > 0) {
				return listFilesCommands[0].command.pathList;
			}
			await wait(500);
		}
	}

	public async exists(filePath: IFilePath): Promise<boolean> {
		const existsFileCommand = await this.appletCommandManagement.send<FileSystemExistsRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemExistsRequest,
				filePath,
			},
		});
		while (true) {
			const listExistsFileCommands = await this.appletCommandManagement.list<FileSystemExistsResult>(this.deviceUid, this.appletUid, {
				receivedSince: existsFileCommand.receivedAt,
				type: FileSystemExistsResult,
			});
			if (listExistsFileCommands.length > 0) {
				return listExistsFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getFile(filePath: IFilePath): Promise<IFileSystemFile | null> {
		const getFileCommand = await this.appletCommandManagement.send<FileSystemGetFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemGetFileRequest,
				filePath,
			},
		});
		while (true) {
			const listGetFileCommands = await this.appletCommandManagement.list<FileSystemGetFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: getFileCommand.receivedAt,
				type: FileSystemGetFileResult,
			});
			if (listGetFileCommands.length > 0) {
				return listGetFileCommands[0].command.file;
			}
			await wait(500);
		}
	}

	public async writeFile(filePath: IFilePath, content: string): Promise<void> {
		const writeFileCommand = await this.appletCommandManagement.send<FileSystemWriteFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemWriteFileRequest,
				filePath,
				content,
			},
		});
		while (true) {
			const listWriteFileCommands = await this.appletCommandManagement.list<FileSystemWriteFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: writeFileCommand.receivedAt,
				type: FileSystemWriteFileResult,
			});
			if (listWriteFileCommands.length > 0) {
				return listWriteFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async appendFile(filePath: IFilePath, content: string): Promise<void> {
		const appendFileCommand = await this.appletCommandManagement.send<FileSystemAppendFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemAppendFileRequest,
				filePath,
				content,
			},
		});
		while (true) {
			const appendFileCommands = await this.appletCommandManagement.list<FileSystemAppendFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: appendFileCommand.receivedAt,
				type: FileSystemAppendFileResult,
			});
			if (appendFileCommands.length > 0) {
				return appendFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async readFile(filePath: IFilePath): Promise<string> {
		const readFileCommand = await this.appletCommandManagement.send<FileSystemReadFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemReadFileRequest,
				filePath,
			},
		});
		while (true) {
			const listReadFileCommands = await this.appletCommandManagement.list<FileSystemReadFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: readFileCommand.receivedAt,
				type: FileSystemReadFileResult,
			});
			if (listReadFileCommands.length > 0) {
				return listReadFileCommands[0].command.data;
			}
			await wait(500);
		}
	}

	public async copyFile(sourceFilePath: IFilePath, destinationFilePath: IFilePath, options: {} | ICopyFileOptions): Promise<void> {
		const copyFileCommand = await this.appletCommandManagement.send<FileSystemCopyFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemCopyFileRequest,
				sourceFilePath,
				destinationFilePath,
				options,
			},
		});
		while (true) {
			const listCopyFileCommands = await this.appletCommandManagement.list<FileSystemCopyFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: copyFileCommand.receivedAt,
				type: FileSystemCopyFileResult,
			});
			if (listCopyFileCommands.length > 0) {
				return listCopyFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async moveFile(sourceFilePath: IFilePath, destinationFilePath: IFilePath, options: {} | IMoveFileOptions): Promise<void> {
		const moveFileCommand = await this.appletCommandManagement.send<FileSystemMoveFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemMoveFileRequest,
				sourceFilePath,
				destinationFilePath,
				options,
			},
		});
		while (true) {
			const listMoveFileCommands = await this.appletCommandManagement.list<FileSystemMoveFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: moveFileCommand.receivedAt,
				type: FileSystemMoveFileResult,
			});
			if (listMoveFileCommands.length > 0) {
				return listMoveFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async deleteFile(filePath: IFilePath, recursive: boolean): Promise<void> {
		const deleteFileCommand = await this.appletCommandManagement.send<FileSystemDeleteFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemDeleteFileRequest,
				filePath,
				recursive,
			},
		});
		while (true) {
			const listDeleteFileCommands = await this.appletCommandManagement.list<FileSystemDeleteFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: deleteFileCommand.receivedAt,
				type: FileSystemDeleteFileResult,
			});
			if (listDeleteFileCommands.length > 0) {
				return listDeleteFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async downloadFile(filePath: IFilePath, sourceUri: string, headers?: IHeaders | undefined): Promise<void> {
		const downloadFileCommand = await this.appletCommandManagement.send<FileSystemDownloadFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemDownloadFileRequest,
				filePath,
				sourceUri,
				headers,
			},
		});
		while (true) {
			const listDownloadFileCommands = await this.appletCommandManagement.list<FileSystemDownloadFileResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: downloadFileCommand.receivedAt,
					type: FileSystemDownloadFileResult,
				},
			);
			if (listDownloadFileCommands.length > 0) {
				return listDownloadFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async extractFile(archiveFilePath: IFilePath, destinationDirectionPath: IFilePath, method: string): Promise<void> {
		const extractFileCommand = await this.appletCommandManagement.send<FileSystemExtractFileRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemExtractFileRequest,
				archiveFilePath,
				destinationDirectionPath,
				method,
			},
		});
		while (true) {
			const listExtractFileCommands = await this.appletCommandManagement.list<FileSystemExtractFileResult>(this.deviceUid, this.appletUid, {
				receivedSince: extractFileCommand.receivedAt,
				type: FileSystemExtractFileResult,
			});
			if (listExtractFileCommands.length > 0) {
				return listExtractFileCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async getFileChecksum(filePath: IFilePath, hashType: string): Promise<string> {
		const getChecksumCommand = await this.appletCommandManagement.send<FileSystemGetFileChecksumRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemGetFileChecksumRequest,
				filePath,
				hashType,
			},
		});
		while (true) {
			const getChecksumCommands = await this.appletCommandManagement.list<FileSystemGetFileChecksumResult>(this.deviceUid, this.appletUid, {
				receivedSince: getChecksumCommand.receivedAt,
				type: FileSystemGetFileChecksumResult,
			});
			if (getChecksumCommands.length > 0) {
				return getChecksumCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async createDirectory(directoryPath: IFilePath): Promise<void> {
		const createDirectoryCommand = await this.appletCommandManagement.send<FileSystemCreateDirectoryRequest>(
			this.deviceUid,
			this.appletUid,
			{
				command: {
					type: FileSystemCreateDirectoryRequest,
					directoryPath,
				},
			},
		);
		while (true) {
			const listCreateDirectoryCommands = await this.appletCommandManagement.list<FileSystemCreateDirectoryResult>(
				this.deviceUid,
				this.appletUid,
				{
					receivedSince: createDirectoryCommand.receivedAt,
					type: FileSystemCreateDirectoryResult,
				},
			);
			if (listCreateDirectoryCommands.length > 0) {
				return listCreateDirectoryCommands[0].command.result;
			}
			await wait(500);
		}
	}

	public async isDirectory(filePath: IFilePath): Promise<boolean> {
		const isDirectoryCommand = await this.appletCommandManagement.send<FileSystemIsDirectoryRequest>(this.deviceUid, this.appletUid, {
			command: {
				type: FileSystemIsDirectoryRequest,
				filePath,
			},
		});
		while (true) {
			const isDirectoryCommands = await this.appletCommandManagement.list<FileSystemIsDirectoryResult>(this.deviceUid, this.appletUid, {
				receivedSince: isDirectoryCommand.receivedAt,
				type: FileSystemIsDirectoryResult,
			});
			if (isDirectoryCommands.length > 0) {
				return isDirectoryCommands[0].command.result;
			}
			await wait(500);
		}
	}
}
