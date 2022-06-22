# SDK Library

Library which allows you to fully manage signageOS applets, devices, management & monitoring using JS.

## Installation and prerequisites

```
npm install @signageos/sdk
```

### Environment variables

Mandatory ENV variables:

in `.env` file:

```
# Organization API SECURITY TOKENS
SOS_AUTH_CLIENT_ID="...OAuthClientID..."
SOS_AUTH_SECRET="...OAuthSecret..."

# Account API SECURITY TOKENS
SOS_API_IDENTIFICATION="...apiSecurityTokenID..."
SOS_API_SECURITY_TOKEN="...apiSecurityToken..."
```

Optional ENV variable adjustment (with default values):

```
SOS_API_URL="https://api.signageos.io"
SOS_REQUEST_MAX_ATTEMPTS="3"
```

#### How to obtain Organization API SECURITY TOKENS

1. Go to `Box` in the side menu select `Organize` and sub menu `Organizations`
2. In organizations select your organization (or create new one)
3. In top tabs select `API tokens`
4. Click on button `Add new token` and generate new values
5. Generated values can be used in `.env` file `SOS_AUTH_CLIENT_ID` is `Token ID` and `SOS_AUTH_SECRET` is
   `Token Secret`

#### How to obtain Account API SECURITY TOKENS

1. Go to `Box` in the top navigation menu click on account icon
2. In drop down menu select `My profile`
3. Scroll to the bottom of the page, click on button `Add new token` and generate new values
4. Generate values can be used in `.env` file `SOS_API_IDENTIFICATION` is `Token ID` and `SOS_API_SECURITY_TOKEN` is
   `Token Secret`

You may read articles about setting up SDK & Rest API:

-   [signageOS REST APIs for device management](https://docs.signageos.io/hc/en-us/articles/4405231278482)
-   [REST-API-Authentication](https://docs.signageos.io/hc/en-us/articles/4405239033234)
-   [Getting started with REST APIs](https://docs.signageos.io/hc/en-us/articles/4405231428114)

Please see the `.env.dist` file where all mandatory ENV variables, required for SDK usage, are listed too.

## REST API

### Credentials in code

Just by setting ENV variables properly, you are ready to go and may use the api. If not ENV variables provided to
node.js app, it tries to get values from user's `~/.sosrc` which is configured by
[`@signageos/cli`](https://github.com/signageos/cli) dependency.

```ecmascript 6
import { createApiV1 } from "@signageos/sdk";

const api = createApiV1(
	{
		url: 'https://api.signageos.io', // Optional
		organizationAuth: {
			clientId: '...OAuthClientID...',
			secret: '...OAuthSecret...',
		},
		accountAuth: {
			tokenId: '...apiSecurityTokenID...',
			token: '...apiSecurityToken...',
		},
	},
);

// retrieves the list of all devices
const devices = await api.device.list();

// ...
```

```ecmascript 6
import { createApiV2 } from "@signageos/sdk";

const api = createApiV2(
	{
		url: 'https://api.signageos.io', // Optional
		organizationAuth: {
			clientId: '...OAuthClientID...',
			secret: '...OAuthSecret...',
		},
		accountAuth: {
			tokenId: '...apiSecurityTokenID...',
			token: '...apiSecurityToken...',
		},
	},
);

// retrieves the list of all devices
const devices = await api.device.list();

// ...
```

### Credentials from ENV Variables

```ecmascript 6
import { createApiV1 } from "@signageos/sdk";

// takes parameters from env vars
const api = createApiV1();

// retrieves the list of all devices
const devices = await api.device.list();

// ...
```

```ecmascript 6
import { createApiV2 } from "@signageos/sdk";

// takes parameters from env vars
const api = createApiV2();

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

-   [index](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/index.html)

-   [Organization management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/organizationmanagement.html)
-   [Device management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/devicemanagement.html)
-   [Applet management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/appletmanagement.html)
-   [Timing management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/timingmanagement.html)
-   [Timing Command management](https://signageos-documentation.s3.eu-central-1.amazonaws.com/sdk/latest/classes/timingcommandmanagement.html)

## Development

### Running the tests

Setup `env` variables:

```
RUN_INTEGRATION_TESTS=true // Controls if integration tests are running
SOS_ORGANIZATION_UID=[ORGANIZATION_UID] // Add `organizationUid` on which will be the tests running
```

This SDK library contains several unit and integration tests, You may locate inside the `sdk` root directory and run
`npm run test` command.

If you properly configured all the mandatory environment variables either in `.env` file inside the sdk root or on your
machine, and you set  
the integration tests will be launched too. Otherwise only unit test would be run and integrations tests would be
skipped.

Tip: you may use existing `.env.dist` file for creating the `.env`.
