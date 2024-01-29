import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as path from 'path';
import { deserializeJSON } from '../Utils/json';

/**
 * Dependencies that are used in signageOS applets to use correct front-applet version.
 */
type IDependencies = {
	['@signageos/front-applet']: string;
	[packageName: string]: string;
};

/**
 * A specific configuration for signageOS applets.
 * There can be some signageOS configuration used by server to build and test applets.
 */
export interface ISosPackageConfig {
	appletUid?: string;
	tests?: string[];
	/** @deprecated Used only for single-file applets as backward compatibility. */
	dependencies?: IDependencies;
}

/**
 * A configuration of a package.json file.
 * This is interface with a subset of properties that are used by signageOS.
 */
export interface IPackageConfig {
	/** Used as a name of uploaded applet */
	name: string;
	/** Used as a version of uploaded applet */
	version: string;
	/** signageOS specific configuration */
	sos?: ISosPackageConfig;
	/** Used as an entry file for uploaded applet */
	main: string;
	/** Used as a explicit set of files (glob pattern) that are uploaded as applet */
	files?: string[];
	dependencies?: IDependencies;
	devDependencies?: IDependencies;
}

/**
 * Save new data to package.json file.
 * It's merged with previous content of package.json file.
 */
export async function saveToPackage(currentDirectory: string, data: Partial<IPackageConfig>) {
	const previousContent = (await loadPackage(currentDirectory)) ?? {};
	const packageJSONPath = path.join(currentDirectory, 'package.json');
	const newContent = _.merge({}, previousContent, data);
	await fs.writeFile(packageJSONPath, JSON.stringify(newContent, undefined, 2) + '\n');
}

/**
 * Load package.json file from current directory.
 */
export async function loadPackage(currentDirectory: string): Promise<Partial<IPackageConfig> | null> {
	const packageJSONPath = path.join(currentDirectory, 'package.json');
	const packageJSONPathExists = await fs.pathExists(packageJSONPath);

	if (!packageJSONPathExists) {
		return null;
	}

	const packageRaw = await fs.readFile(packageJSONPath, { encoding: 'utf8' });
	return JSON.parse(packageRaw, deserializeJSON);
}
