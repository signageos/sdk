# SDK Library

Library which allows you to fully manage signageOS applets, devices, management & monitoring using JS.

## Installation and prerequisities

```
npm install @signageos/sdk
```

### Environment variables

Mandatory ENV variables:

- SOS_API_URL="https://api.signageos.io"
- SOS_AUTH_CLIENT_ID="OAuthClientID"
- SOS_AUTH_SECRET="OAuthSecret"
- SOS_ACCOUNT_AUTH_CLIENT_ID="accountID"
- SOS_ACCOUNT_AUTH_SECRET="accountSecret"

You may visit the documentation [https://docs.signageos.io/api#rest-api-authentication] where you find out how to get the proper values.

Please see the `.env.dist` file where all mandatory ENV variables, required for SDK usage, are listed too.

## REST API

Just by setting ENV variables properly, you are ready to go and may usage the api.

```ecmascript 6
import {api} from "@signageos/sdk";

// retrieves the list of all devices
const devices = await api.device.list();

// retrieves the device info
const deviceInfo = await api.device.get('deviceUid');

// sets the device volume
await api.device.audio.set('deviceUid', {volume: 40});

// retrieves the list of all applets
const applets = await api.applet.list();

// ...
```

### Device

#### Application version

##### - get

Description: Get the version of sOS App on device.

| Argument                    | Description |
|-----------------------------|-------------|
| --deviceUid *(required)*    | device UID  |

Returns: `IDeviceAppVersion`

Example:
```ecmascript 6
const appV = await api.device.appVersion.get('deviceUid');
```

##### - set

#### Audio



## Development

### Running the tests

This SDK library contains several unit and integration tests,
You may locate inside the `sdk` root directory and run `npm run test` command. 

If you properly configured all the mandatory environment variables either in `.env` file inside the sdk root or on your machine, 
the integration tests will be launched too. Otherwise only unit test would be run and integrations tests would be skipped.

Tip: you may use existing `.env.dist` file for creating the `.env`.
