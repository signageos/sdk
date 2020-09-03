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
- SOS_API_IDENTIFICATION="apiAccountID"
- SOS_API_SECURITY_TOKEN="apiAccountSecret"

You may visit the documentation [https://docs.signageos.io/api#rest-api-authentication] where you find out how to get the proper values.

Please see the `.env.dist` file where all mandatory ENV variables, required for SDK usage, are listed too.

## REST API

### Singleton
Just by setting ENV variables properly, you are ready to go and may use the api.

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

### Instantiating
```ecmascript 6
import {Api} from "@signageos/sdk";

const api = new Api(
	{
		url: 'https://api.signageos.io', // Optional
		organizationAuth: {
			clientId: 'OAuthClientID',
			secret: 'OAuthSecret',
		},
		accountAuth: {
			accountId: 'apiAccountID',
			securityToken: 'apiAccountSecret',
		},
		version: 'v1', // Optional
	},
);

// retrieves the list of all devices
const devices = await api.device.list();

// ...
```

### Documentation

The complete SDK documentation may be generated by [typedoc](https://typedoc.org/) by running the command:
```
$ npm i && npm run docs
```

Once generated, the `docs` directory will contain the generated documentation.

The most useful documentation pages:

- [index](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/index.html) 


- [Organization management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/organizationmanagement.html) 
- [Device management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/devicemanagement.html)
- [Applet management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/appletmanagement.html)
- [Timing management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/timingmanagement.html)
- [Timing Command management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/timingcommandmanagement.html)

## Development

### Running the tests

This SDK library contains several unit and integration tests,
You may locate inside the `sdk` root directory and run `npm run test` command. 

If you properly configured all the mandatory environment variables either in `.env` file inside the sdk root or on your machine,
and you set  
the integration tests will be launched too. Otherwise only unit test would be run and integrations tests would be skipped.

Tip: you may use existing `.env.dist` file for creating the `.env`.
