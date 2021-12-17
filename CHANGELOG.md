
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.7.1] - 2021-12-17
### Fixed
- No extra parameters in entity responses

## [1.7.0] - 2021-11-05
### Fixed
- Interface of applet.command entity payload

### Added
- Automatic detection of an authentication credentials from `@signageos/cli` tool's config `~/.sosrc`. So, if `SOS_AUTH_*` & `SOS_API_*` are not provided, the default from CLI to be used.
- Resource Device Applet Test. PUT & GET list

### Deprecated
- Never used sdk main constants & duplicated timing & timingCommand management exports from index file

## [1.6.4] - 2021-05-21
### Fixed
- added missing optional ntpServer field to DeviceDateTimeManagement.set

## [1.6.3] - 2021-03-11
### Fixed
- Uploading firmware accepts type

## [1.6.2] - 2021-03-02
### Fixed
- `DeviceTimerWeekday` has valid value for Sunday - `sun` instead of `sund`

## [1.6.1] - 2021-02-04
### Fixed
- `RestApi` constructor option `organizationUid` is optional

## [1.6.0] - 2021-01-30
### Added
- Added method to set device organization
- Added method to get list of device screenshots and method to take screenshot
- Added method to get list of emulators for given account and method to create new emulator
- Added method to delete old emulator

## [1.5.0] - 2021-01-22
### Added
- Helper from CLI for work with `.sosrc`

## [1.4.2] - 2020-10-30
### Deprecated
- `Api` constructor options was renamed. `accountAuth.accountId` => `accountAuth.tokenId` & `accountAuth.secret` => `accountAuth.token`.

### Fixed
- Singleton `api` instance account authentication using environment variables: `SOS_API_IDENTIFICATION`, `SOS_API_SECURITY_TOKEN`
- Throw unknown errors when server response format is invalid

## [1.4.1] - 2020-10-26
### Fixed
- Update interface of device schedule power actions with missing `succeededAt` and `failedAt` properties
- Default values for sdk imported `api` default singleton instance
- 3 attempts to call api in background, then throw error (adjustable by env var `SOS_REQUEST_MAX_ATTEMPTS`).

## [1.4.0] - 2020-10-22
### Fixed
- Attempts to retry if API request failed with 502, 504 http codes

### Added
- - Added method for deleting existing organization

## [1.3.5] - 2020-10-13
### Security
- Fix dependabot alerts

## [1.3.4] - 2020-09-24
### Fixed
- Custom error types correctly resolve instanceof calls to true

## [1.3.3] - 2020-09-03
### Fixed
- RestApi (Api) interface is exported from index file
- Organization and Device Verification create API resolves with created object
- Device verification uses correct POST instead of PUT

## [1.3.2] - 2020-07-31
### Fixed
- Broken Device Power Action requests (use correct POST http method instead of PUT)

## [1.3.1] - 2020-06-22
### Fixed
- Require contentType for applet version file update

## [1.3.0] - 2020-03-03
### Added
- Companies listing and their billing plan settings, organization's subscription type settings

### Fixed
- Audit npm dependencies

## [1.2.0] - 2020-01-05
### Added
- Create firmware version with multiple files
- Firmware version files management
- Create applet version with multiple files
- Applet version files management
- Get device authentication by authHash

### Fixed
- Create applet test suite (uses correct POST resource)
- Process non JSON api answers
- Timing command create (status code 202)

## [1.1.0] - 2019-09-21
### Added
- Create applet returns applet uid
- Create applet version accepts readable stream in addition to only string

## [1.0.0] - 2019-09-17
### Added
- Device management
- Applet management
- Organization management

### Changed
- Package was renamed to @signageos/sdk instead of @signageos/test

### Fixed
- Use environment variables SOS_API_URL, SOS_AUTH_CLIENT_ID & SOS_AUTH_SECRET instead

## [0.1.0] - 2018-08-23
### Added
- Initialize sdk library
- Package is available in npm registry https://www.npmjs.com/package/@signageos/test
- Timing REST API
- Timing features: HTML, console, offline cache, videos
- Timing Command REST API
