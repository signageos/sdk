import * as nativefs from 'fs';
import * as path from 'path';
import * as os from "os";

export const PACKAGE_ARCHIVE_FILENAME = '.package.zip';

export const RUNTIME_DIRNAME = 'signageos';
const APPLET_BUILDS_DIRNAME = 'applet_builds';

export type IFileSystem = typeof nativefs;

export function getAppletPackageArchivePath(appletUid: string, appletVersion: string) {
	const appletBuildPath = getAppletVersionBuildRuntimeDir(appletUid, appletVersion);
	return path.join(appletBuildPath, PACKAGE_ARCHIVE_FILENAME);
}

export function getAppletVersionBuildRuntimeDir(appletUid: string, appletVersion: string) {
	const tempDir = path.join(getAppletBuildRuntimeDir(appletUid), appletVersion);
	return tempDir;
}

export function getAppletBuildRuntimeDir(appletUid: string) {
	const tempDir = path.join(os.tmpdir(), RUNTIME_DIRNAME, APPLET_BUILDS_DIRNAME, appletUid);
	return tempDir;
}
