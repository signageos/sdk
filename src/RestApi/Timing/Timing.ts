
import { JSDOM } from 'jsdom';
import * as _ from 'lodash';
import ITiming from "./ITiming";
import TimingCommandManagement from "./Command/TimingCommandManagement";
import { TimingLoaded } from "@signageos/front-applet/es6/Monitoring/Timing/timingCommands";
import waitUntil from "../../Timer/waitUntil";
import TimingManagement from "./TimingManagement";
import { HtmlSnapshotTaken, TakeHtmlSnapshot } from "@signageos/front-applet/es6/Monitoring/Html/htmlCommands";
import wait from "../../Timer/wait";
import { ConsoleLogged } from '@signageos/front-applet/es6/Monitoring/Console/consoleCommands';
import TimingCommand from './Command/TimingCommand';
import {
	OfflineCacheFileLoaded,
	OfflineCacheFilesListed,
	OfflineCacheGetChecksumRequest,
	OfflineCacheGetChecksumResult,
	OfflineCacheListFiles,
	OfflineCacheLoadFile,
	OfflineCacheLoadOrSaveFileRequest,
	OfflineCacheLoadOrSaveFileResult,
	OfflineCacheValidateChecksumRequest,
	OfflineCacheValidateChecksumResult,
} from '@signageos/front-applet/es6/Monitoring/Offline/Cache/offlineCacheCommands';
import { VideoStateChanged } from '@signageos/front-applet/es6/Monitoring/Video/videoCommands';
import IVideoProperties from '@signageos/front-applet/es6/FrontApplet/Video/IVideoProperties';
import { fillDataToEntity } from '../mapper';
import {
	ICopyFileOptions,
	IFile as IFileSystemFile,
	IFilePath,
	IHeaders,
	IMoveFileOptions,
	IStorageUnit,
} from "@signageos/front-applet/es6/FrontApplet/FileSystem/types";
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
} from "@signageos/front-applet/es6/Monitoring/FileSystem/fileSystemCommands";
import IFile from "@signageos/front-applet/es6/FrontApplet/Offline/Cache/IFile";

export interface IHtml {
	getDOMDocument(): Promise<HTMLDocument>;
}

export interface IOffline {
	cache: {
		listFiles(): Promise<string[]>;
		loadFile(uid: string): Promise<IFile>;
		getChecksumFile(uid: string, hashType: string): Promise<string>;
		validateChecksumFile(uid: string, hash: string, hashType: string): Promise<boolean>;
		loadOrSaveFile(uid: string, uri: string, headers?: { [key: string]: string }): Promise<IFile>
	};
}

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

type ILogOperations = {
	getAll(since?: Date): Promise<string[]>;
};
export interface IConsole {
	log: ILogOperations;
	error: ILogOperations;
	warn: ILogOperations;
	info: ILogOperations;
	debug: ILogOperations;
}

type IVideoOperations = {
	getAll(since?: Date): Promise<IVideoProperties[]>;
};
export interface IVideo {
	play: IVideoOperations;
	stop: IVideoOperations;
	pause: IVideoOperations;
	ended: IVideoOperations;
	error: IVideoOperations;
}
const videoStates: VideoStateChanged['state'][] = ['play', 'stop', 'pause', 'ended', 'error'];

export default class Timing implements ITiming {

	// public readonly [P in keyof ITiming]: ITiming[P]; // Generalized TS doesn't support
	public readonly uid: ITiming['uid'];
	public readonly createdAt: ITiming['createdAt'];
	public readonly updatedAt: ITiming['updatedAt'];
	public readonly deviceUid: ITiming['deviceUid'];
	public readonly appletUid: ITiming['appletUid'];
	public readonly appletVersion: ITiming['appletVersion'];
	public readonly startsAt: ITiming['startsAt'];
	public readonly endsAt: ITiming['endsAt'];
	public readonly configuration: ITiming['configuration'];
	public readonly position: ITiming['position'];
	public readonly finishEvent: ITiming['finishEvent'];

	public readonly html: IHtml = {
		getDOMDocument: async () => {
			const takeHtmlSnapshotCommand = await this.timingCommandManagement.create<TakeHtmlSnapshot>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
					type: TakeHtmlSnapshot,
				},
			});
			while (true) {
				const timingCommands = await this.timingCommandManagement.getList<HtmlSnapshotTaken>({
					deviceUid: this.deviceUid,
					appletUid: this.appletUid,
					receivedSince: takeHtmlSnapshotCommand.receivedAt.toISOString(),
					type: HtmlSnapshotTaken,
				});
				if (timingCommands.length > 0) {
					return new JSDOM(timingCommands[0].commandPayload.html).window.document;
				}
				await wait(500);
			}
		},
	};
	public readonly console: IConsole = ['log', 'error', 'warn', 'info', 'debug'].reduce<any>(
		(consoleMemo: IConsole, level: string) => ({
			...consoleMemo,
			[level]: {
				getAll: async (since: Date = this.updatedAt) => {
					const timingCommands = await this.timingCommandManagement.getList<ConsoleLogged>({
						deviceUid: this.deviceUid,
						appletUid: this.appletUid,
						receivedSince: since.toISOString(),
						type: ConsoleLogged,
					});
					return _.flatMap(
						timingCommands
							.filter((timingCommand: TimingCommand<ConsoleLogged>) => timingCommand.commandPayload.level === level),
						(timingCommand: TimingCommand<ConsoleLogged>) => timingCommand.commandPayload.messages,
					);
				},
			},
		}),
		{},
	);
	public readonly offline: IOffline = {
		cache: {
			listFiles: async () => {
				const listFilesCommand = await this.timingCommandManagement.create<OfflineCacheListFiles>({
					deviceUid: this.deviceUid,
					appletUid: this.appletUid,
					commandPayload: {
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
						return filesListedCommands[0].commandPayload.fileUids;
					}
					await wait(500);
				}
			},
			loadFile: async (uid: string) => {
				const loadFileCommand = await this.timingCommandManagement.create<OfflineCacheLoadFile>({
					deviceUid: this.deviceUid,
					appletUid: this.appletUid,
					commandPayload: {
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
						return fileLoadedCommands[0].commandPayload.file;
					}
					await wait(500);
				}
			},
			getChecksumFile: async (uid: string, hashType: string) => {
				const getChecksumFileCommand = await this.timingCommandManagement.create<OfflineCacheGetChecksumRequest>({
					deviceUid: this.deviceUid,
					appletUid: this.appletUid,
					commandPayload: {
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
						return getChecksumCommands[0].commandPayload.result;
					}
					await wait(500);
				}
			},
			validateChecksumFile: async (uid: string, hash: string, hashType: string) => {
				const validateChecksumCommand = await this.timingCommandManagement.create<OfflineCacheValidateChecksumRequest>({
					deviceUid: this.deviceUid,
					appletUid: this.appletUid,
					commandPayload: {
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
						return validateChecksumCommands[0].commandPayload.result;
					}
					await wait(500);
				}
			},
			loadOrSaveFile: async (uid: string, uri: string, headers?: { [key: string]: string }) => {
				const loadOrSaveCommand = await this.timingCommandManagement.create<OfflineCacheLoadOrSaveFileRequest>({
					deviceUid: this.deviceUid,
					appletUid: this.appletUid,
					commandPayload: {
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
						return loadOrSaveCommands[0].commandPayload.file;
					}
					await wait(500);
				}
			},
		},
	};
	public readonly video: IVideo = videoStates.reduce<any>(
		(videoMemo: IVideo, state: VideoStateChanged['state']) => ({
			...videoMemo,
			[state]: {
				getAll: async (since: Date = this.updatedAt) => {
					const videoStateChangedCommands = await this.timingCommandManagement.getList<VideoStateChanged>({
						deviceUid: this.deviceUid,
						appletUid: this.appletUid,
						receivedSince: since.toISOString(),
						type: VideoStateChanged,
					});
					const videosByStateMap = _.groupBy(
						videoStateChangedCommands,
						(videoStateChangedCommand: TimingCommand<VideoStateChanged>) => videoStateChangedCommand.commandPayload.state,
					);
					const videosOfCurrentState = videosByStateMap[state].map(
						(videoStateChangedCommand: TimingCommand<VideoStateChanged>) => _.pick(
							videoStateChangedCommand.commandPayload,
							'uri',
							'x',
							'y',
							'width',
							'height',
						),
					);
					return videosOfCurrentState;
				},
			},
		}),
		{},
	);
	public readonly fileSystem: IFileSystem = {
		appendFile: async (filePath: IFilePath, content: string): Promise<void> => {
			const appendFileCommand = await this.timingCommandManagement.create<FileSystemAppendFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return appendFileCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		copyFile: async (sourceFilePath: IFilePath, destinationFilePath: IFilePath, options: ICopyFileOptions | {}): Promise<void> => {
			const copyFileCommand = await this.timingCommandManagement.create<FileSystemCopyFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listCopyFileCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		createDirectory: async (directoryPath: IFilePath): Promise<void> => {
			const createDirectoryCommand = await this.timingCommandManagement.create<FileSystemCreateDirectoryRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listCreateDirectoryCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		deleteFile: async (filePath: IFilePath, recursive: boolean): Promise<void> => {
			const deleteFileCommand = await this.timingCommandManagement.create<FileSystemDeleteFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listDeleteFileCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		downloadFile: async (filePath: IFilePath, sourceUri: string, headers?: IHeaders): Promise<void> => {
			const downloadFileCommand = await this.timingCommandManagement.create<FileSystemDownloadFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listDownloadFileCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		exists: async (filePath: IFilePath): Promise<boolean> => {
			const existsFileCommand = await this.timingCommandManagement.create<FileSystemExistsRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listExistsFileCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		extractFile: async (archiveFilePath: IFilePath, destinationDirectionPath: IFilePath, method: string): Promise<void> => {
			const extractFileCommand = await this.timingCommandManagement.create<FileSystemExtractFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listExtractFileCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		getFile: async (filePath: IFilePath): Promise<IFileSystemFile | null> => {
			const getFileCommand = await this.timingCommandManagement.create<FileSystemGetFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listGetFileCommands[0].commandPayload.file;
				}
				await wait(500);
			}
		},
		getFileChecksum: async (filePath: IFilePath, hashType: string): Promise<string> => {
			const getChecksumCommand = await this.timingCommandManagement.create<FileSystemGetFileChecksumRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return getChecksumCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		isDirectory: async (filePath: IFilePath) => {
			const isDirectoryCommand = await this.timingCommandManagement.create<FileSystemIsDirectoryRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return isDirectoryCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		listFiles: async (directoryPath: IFilePath) => {
			const listFilesCommand = await this.timingCommandManagement.create<FileSystemListFilesRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listFilesCommands[0].commandPayload.pathList;
				}
				await wait(500);
			}
		},
		listStorageUnits: async () => {
			const listStorageUnitsCommand = await this.timingCommandManagement.create<FileSystemListOfStorageUnitsRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listOfStorageUnitsCommands[0].commandPayload.storageUnits;
				}
				await wait(500);
			}
		},
		moveFile: async (sourceFilePath: IFilePath, destinationFilePath: IFilePath, options: IMoveFileOptions | {}): Promise<void> => {
			const moveFileCommand = await this.timingCommandManagement.create<FileSystemMoveFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listMoveFileCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
		readFile: async (filePath: IFilePath): Promise<string> =>  {
			const readFileCommand = await this.timingCommandManagement.create<FileSystemReadFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listReadFileCommands[0].commandPayload.data;
				}
				await wait(500);
			}
		},
		writeFile: async (filePath: IFilePath, content: string): Promise<void> => {
			const writeFileCommand = await this.timingCommandManagement.create<FileSystemWriteFileRequest>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				commandPayload: {
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
					return listWriteFileCommands[0].commandPayload.result;
				}
				await wait(500);
			}
		},
	};

	constructor(
		data: ITiming,
		private timingManagement: TimingManagement,
		private timingCommandManagement: TimingCommandManagement,
	) {
		fillDataToEntity(this, data);
	}

	public async onLoaded(since: Date = this.updatedAt) {
		return waitUntil(async () => {
			const timingCommands = await this.timingCommandManagement.getList<TimingLoaded>({
				deviceUid: this.deviceUid,
				appletUid: this.appletUid,
				receivedSince: since.toISOString(),
				type: TimingLoaded,
			});
			return timingCommands.length > 0;
		});
	}

	public async delete() {
		await this.timingManagement.delete(this.uid);
	}
}
