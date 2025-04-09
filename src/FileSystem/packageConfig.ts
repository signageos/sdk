import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as path from 'path';
import z from 'zod';
import { deserializeJSON } from '../Utils/json';
import { zodError } from '../Utils/zodError';

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

	/** Used as a explicit set of files (glob pattern) that are uploaded as applet, overrides the `files` field in package.json  */
	files?: string[];

	/** @deprecated Used only for single-file applets as backward compatibility. */
	dependencies?: IDependencies;
}

/**
 * A configuration of a package.json file.
 * This is interface with a subset of properties that are used by signageOS.
 */
export interface IPackageConfig extends Zod.TypeOf<typeof packageSchema> {
	/** Used as a name of uploaded applet */
	name?: string;
	/** Used as a version of uploaded applet */
	version?: string;
	/** signageOS specific configuration */
	sos?: ISosPackageConfig;
	/** Used as an entry file for uploaded applet */
	main?: string;
	/** Used as a explicit set of files (glob pattern) that are uploaded as applet. Overridable by `sos.files` */
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
export async function loadPackage(currentDirectory: string): Promise<IPackageConfig | null> {
	const packageJSONPath = path.join(currentDirectory, 'package.json');
	const packageJSONPathExists = await fs.pathExists(packageJSONPath);

	if (!packageJSONPathExists) {
		return null;
	}

	const packageRaw = await fs.readFile(packageJSONPath, { encoding: 'utf8' });
	const parsed = JSON.parse(packageRaw, deserializeJSON);

	try {
		return packageSchema.parse(parsed);
	} catch (e) {
		throw zodError(e, 'Invalid package.json structure');
	}
}

const depSchema = z
	.object({
		['@signageos/front-applet']: z.string(),
	})
	.catchall(z.string());

const packageSchema = z.object({
	name: z.string().optional(),
	version: z.string().optional(),
	sos: z
		.object({
			appletUid: z.string().optional(),
			tests: z.array(z.string()).optional(),
			files: z.array(z.string()).optional(),
			dependencies: depSchema.optional(),
		})
		.optional(),
	main: z.string().optional(),
	files: z.array(z.string()).optional(),
	dependencies: depSchema.optional(),
	devDependencies: depSchema.optional(),
});
