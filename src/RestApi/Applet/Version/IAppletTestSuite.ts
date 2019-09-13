
export interface IAppletTestSuiteUpdatable {
	binary: string;
}

export interface IAppletTestSuiteCreatable extends IAppletTestSuiteUpdatable {
}

interface IAppletTestSuite extends IAppletTestSuiteCreatable {
	appletUid: string;
	appletVersion: string;
	identifier: string;
}

export default IAppletTestSuite;
