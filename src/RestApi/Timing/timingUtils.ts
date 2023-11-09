import * as _ from 'lodash';
import TimingCommandManagement from "./Command/TimingCommandManagement";
import { IStreamOperations } from "./Timing";
import TimingCommand from "./Command/TimingCommand";
import { StreamStateChanged, StreamStateChangedError, StreamStateChangedOnTracks, StreamStateType } from "@signageos/front-applet/es6/Monitoring/Stream/streamCommands";

export async function getStreamState(state: StreamStateType, updatedAt: Date, timingCommandManagement: TimingCommandManagement, deviceUid: string, appletUid: string): Promise<IStreamOperations> {
	const streamStateChangedCommands = await timingCommandManagement.getList<StreamStateChanged<StreamStateType>>({
		deviceUid,
		appletUid,
		receivedSince: updatedAt.toISOString(),
		type: StreamStateChanged,
	});
	const streamsByStateMap = _.groupBy(
		streamStateChangedCommands,
		(streamStateChangedCommand: TimingCommand<StreamStateChanged<StreamStateType>>) => streamStateChangedCommand.commandPayload.state);
	switch(state) {
		case 'onTracksChanged':
			return {
				getAll: async () => streamsByStateMap['onTracksChanged'].map(
					(streamStateChangedCommand_1: TimingCommand<StreamStateChangedOnTracks>) => _.pick(
						streamStateChangedCommand_1.commandPayload,
						'uri',
						'x',
						'y',
						'width',
						'height',
						'tracks'
					)),
			};
		case 'onError':
			return {
				getAll: async () => streamsByStateMap['onError'].map(
					(streamStateChangedCommand_1: TimingCommand<StreamStateChangedError>) => _.pick(
						streamStateChangedCommand_1.commandPayload,
						'uri',
						'x',
						'y',
						'width',
						'height',
						'errorMessage'
					)),
			};
		default:
			return {
				getAll: async () => streamsByStateMap[state].map(
					(streamStateChangedCommand_1: TimingCommand<StreamStateChanged<StreamStateType>>) => _.pick(
						streamStateChangedCommand_1.commandPayload,
						'uri',
						'x',
						'y',
						'width',
						'height',
					)),
			};
	}
}
