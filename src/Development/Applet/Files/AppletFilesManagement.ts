import * as path from 'path';
import * as fs from 'fs-extra';
import * as nativefs from 'fs';
import * as globby from 'globby';
import { loadPackage } from "../../../FileSystem/packageConfig";
import chalk from 'chalk';
import { log } from '../../../Console/log';
import * as Debug from 'debug';
import { IFileSystem } from '../../runtimeFileSystem';

const debug = Debug('@signageos/sdk:Development:Applet:AppletFilesManagement');

const DEFAULT_IGNORE_FILE = '.sosignore';
const GIT_IGNORE_FILE = '.gitignore';
const NPM_IGNORE_FILE = '.npmignore';

const IGNORE_FILES = [
	DEFAULT_IGNORE_FILE,
	NPM_IGNORE_FILE,
	GIT_IGNORE_FILE,
];

export interface IFilesOptions {
	/** Applet root path where the package.json is located */
	appletPath: string;
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
 * Provides a list of files that should be included in the applet package.
 * It is based on the package.json "files" property or .sosignore file (or .gitignore, .npmignore as failover).
 */
export class AppletFilesManagement {

	/**
	 * Lists all files that should be included in the applet package.
	 * It is based on the package.json "files" property or .sosignore file (or .gitignore, .npmignore as failover).
	 */
	public async listAppletFiles(options: IFilesOptions) {
		const appletFilePatterns = await this.getAppletFilePatterns(options);
		const resolvedFilePaths = await this.resolveIncludeFiles(options.appletPath, appletFilePatterns, options.fileSystems);

		debug('listed files', resolvedFilePaths);
		return resolvedFilePaths;
	}

	/**
	 * Returns the glob patterns that should be included in the applet package.
	 * Unlike the listAppletFiles, it does not resolve the patterns to the actual file paths.
	 */
	public async getAppletFilePatterns(options: IFilesOptions) {
		const packageConfig = await loadPackage(options.appletPath) ?? {};
		const ignoreBasePath = options.ignoreBasePath ?? options.appletPath;
		if (packageConfig.files) {
			if (!(packageConfig.files instanceof Array)) {
				throw new Error(`Invalid package.json "files" property. Expected array, got ${typeof packageConfig.files}.`);
			}
			return packageConfig.files;
		} else {
			return await this.resolveNotIgnoredFilePatterns(ignoreBasePath);
		}
	}

	private async resolveIncludeFiles(appletPath: string, files: string[], fileSystems: IFileSystem[] = [nativefs]) {
		debug('resolveIncludeFiles', appletPath, files);
		const alwaysFilePaths = [
			path.join(appletPath, 'package.json'),
		];
		const resolvedFilePathsSet = new Set<string>(alwaysFilePaths);

		for (const fileSystem of fileSystems) {
			const resolvedFilePaths: string[] = await globby(
				files,
				{
					cwd: appletPath,
					absolute: true,
					dot: true,
					fs: fileSystem,
				},
			);
			for (const resolvedFilePath of resolvedFilePaths) {
				resolvedFilePathsSet.add(resolvedFilePath);
			}
		}

		return [...resolvedFilePathsSet];
	}

	private async resolveNotIgnoredFilePatterns(ignoreBasePath: string) {
		const ignorePatterns = await this.getIgnorePatterns(ignoreBasePath);
		const reversedIgnorePatterns = ignorePatterns.map((pattern) => `!${pattern}`);
		return ['**/*', ...reversedIgnorePatterns];
	}

	private async getIgnorePatterns(ignoreBasePath: string) {
		for (const ignoreFileName of IGNORE_FILES) {
			const ignoreFilePath = path.join(ignoreBasePath, ignoreFileName);
			const ignoreFileExists = await fs.pathExists(ignoreFilePath);

			if (ignoreFileExists) {
				log('info', `Use ignore file: ${chalk.green.bold(ignoreFileName)}.`);
				const ignorePatterns = await this.parseIgnoreFile(ignoreFilePath);

				// node_modules is always ignored
				ignorePatterns.push('node_modules/');

				if (ignoreFileName === GIT_IGNORE_FILE) {
					// .git folder is not included in .gitignore file because it's automatically ignored
					ignorePatterns.push('.git');
				}
				return ignorePatterns;
			}
		}
		log('info', `No ignore file found in ${chalk.yellow.bold(ignoreBasePath)}.`);
		return [];
	}

	private async parseIgnoreFile(ignoreFilePath: string) {
		const ignoreFileBuffer = await fs.readFile(ignoreFilePath);
		const ignorePatterns = ignoreFileBuffer.toString()
		.split(/[\n\r]+/)
		.filter((line) => line)
		.filter((line) => !line.startsWith('#'));
		return ignorePatterns;
	}
}
