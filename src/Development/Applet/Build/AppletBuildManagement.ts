import * as archiver from 'archiver';
import * as fs from 'fs-extra';
import * as path from 'path';
import {
	getAppletBuildRuntimeDir,
	getAppletPackageArchivePath,
	getAppletVersionBuildRuntimeDir,
	IFileSystem,
} from '../../runtimeFileSystem';
import { AppletFilesManagement } from '../Files/AppletFilesManagement';
import { AppletBuild } from './AppletBuild';

export interface IBuildOptions {
	/** Applet root path where the package.json is located */
	appletPath: string;
	/** Applet UID that is used for targeting the temporary build folder */
	appletUid: string;
	/** Applet version that is used for targeting the temporary build folder. It should match the version in package.json */
	appletVersion: string;
	/** If not provided, the default is appletPath */
	ignoreBasePath?: string;
	/**
	 * In some cases, there can be more file systems overlayed.
	 * For example in webpack, there is native fs and virtual fs.
	 * The virtual fs is used in webpack-dev-server to optimize build writes.
	 * It holds only the files that are compiled using webpack.
	 * In that case, pass following: [nativefs, virtualfs]
	 * By default, only native fs is used.
	 */
	fileSystems?: IFileSystem[];
}

/**
 * Manages applet builds for development.
 * Based on path to the applet root directory, uid and version, it builds into a single .package.zip file.
 * This is an alternative of the build that the server does when applet is uploaded.
 */
export class AppletBuildManagement {
	constructor(private appletFilesManagement: AppletFilesManagement) {}

	/**
	 * Builds an applet locally as a single .package.zip file.
	 */
	public async build(options: IBuildOptions) {
		const appletFilePaths = await this.appletFilesManagement.listAppletFiles(options);
		const packageArchivePath = await this.createPackageArchive(options, appletFilePaths);

		return new AppletBuild(options.appletUid, options.appletVersion, appletFilePaths, packageArchivePath, () =>
			getAppletBuildRuntimeDir(options.appletUid),
		);
	}

	private async createPackageArchive(options: IBuildOptions, appletFilePaths: string[]) {
		const archive = archiver('zip');
		const appletBuildPath = getAppletVersionBuildRuntimeDir(options.appletUid, options.appletVersion);
		await fs.ensureDir(appletBuildPath);

		const packageArchivePath = getAppletPackageArchivePath(options.appletUid, options.appletVersion);
		const archiveWriteStream = fs.createWriteStream(packageArchivePath);
		archive.pipe(archiveWriteStream);

		for (const appletFileAbsolutePath of appletFilePaths) {
			this.appendArchiveFileFromReversedOverlays(options, archive, appletFileAbsolutePath);
		}

		await archive.finalize();

		return packageArchivePath;
	}

	private appendArchiveFileFromReversedOverlays(options: IBuildOptions, archive: archiver.Archiver, appletFileAbsolutePath: string) {
		const fileSystems = options.fileSystems ?? [fs];
		// The last file system has priority because is the overlayed one
		const reversedFileSystems = [...fileSystems].reverse();

		const appletFileRelativePath = this.getAppletFileRelativePath(options.appletPath, appletFileAbsolutePath);
		for (const fileSystem of reversedFileSystems) {
			if (fileSystem.existsSync(appletFileAbsolutePath)) {
				archive.append(fileSystem.createReadStream(appletFileAbsolutePath), { name: appletFileRelativePath });
				return;
			}
		}
	}

	private getAppletFileRelativePath(appletPath: string, appletFileAbsolutePath: string) {
		const directoryAbsolutePathNormalized = path.normalize(appletPath);
		const fileAbsolutePathNormalized = path.normalize(appletFileAbsolutePath);

		return fileAbsolutePathNormalized.substring(directoryAbsolutePathNormalized.length + 1);
	}
}
