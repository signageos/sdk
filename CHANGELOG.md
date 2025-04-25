# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Building applet using `dev.applet.startHotReload()` method waits for the initial build before serving the applet. It fixes some edge `--hot-reload` cases for older devices.

## [1.27.3] - 2025-04-15
### Fixed
- Add support for `sos.files` field in package.json, which overrides the `files` for applet upload.

## [1.27.2] - 2025-03-24
### Fixed
- Allow node.js 20 or higher instead of strictly 20 for dependency `@signageos/forward-server-bridge`

## [1.27.1] - 2025-03-24
### Fixed
- Allow node.js 20 or higher instead of strictly 20

## [1.27.0] - 2025-03-03
### Added
- Allow starting AppletServer within the same process (not detached) as a default behavior
- Accept logs and errors from connected device and show them in the console

## [1.26.2] - 2025-02-27
### Added
- Added `api.customScript` for management of Custom Scripts

## [1.26.1] - 2025-02-24
### Fixed
- Dependency on non existing package `@signageos/forward-server-bridge@0.0.1`

## [1.26.0] - 2025-02-21
### Added
- Development SDK automatically sharing the built applet over proxy server called Forward Server Bridge (so the device doesn't have to be in the same network as the development machine)

## [1.25.0] - 2025-02-16
### Added
- Extend applet commands in Timing for full JS API support for testing

## [1.24.0] - 2024-08-09
### Added
- Add `api.organization.token` for management of Organization Tokens (`get`, `create`, `delete`)

### Deprecated
- `api.timingCommand` - `api.applet.command` should be used instead

### Fixed
- Tests related to `Location`
- `BulkOperation` test for `INSTALL_PACKAGE_FROM_URI` and `INSTALL_PACKAGE` operations

## [1.23.0] - 2024-05-10
### Added
- Snooze/unsnooze alerts per device
- Pagination for `device.alive.list` method using `getNextPage` method on result Array

## [1.22.0] - 2024-02-22
### Added
- Add new telemetry types
- Add new management capabilities
- Add `api.device.extendedManagementUrl.list` method
- Add `api.device.extendedManagementUrl.set` method

## [1.21.0] - 2023-08-29
### Added
- Add urlLauncherAddress field to PeerRecoverySettings when enabled equals true
- add package management unit tests

### Fixed
- correct device aliveAt type to possible null value
- `set` method for device peer recovery

## [1.20.0] - 2023-07-19
### Added
- Finalize bulk operations implementation

### Fixed
- Fix timings comparator in `update` timing function
- `setTelemetryIntervals` returns error when value is more than 1 year

## [1.19.2] - 2023-04-04
### Fixed
- `finishEvent` field has `data` of type `any` in `ITiming` interface which corresponds with docs
- `device.set` v2 method accepts connectionMethod

## [1.19.1] - 2023-04-01
### Fixed
- Development API - Reload devices when no one has connected yet
- Development API - Hot Reload works correctly even on Windows systems

## [1.19.0] - 2023-03-29
### Added
- Management of `.sosrc` run control file
- New Development API under `dev` namespace/import

## [1.18.0] - 2023-02-20
### Added
- `setTelemetryIntervals` method for device telemetry interval configuration

## [1.17.1] - 2023-01-16
### Fixed
- JSDocs and the generated TypeDoc API reference documentation

## [1.17.0] - 2023-01-02
### Added
- Support for profiles inside the ~/.sosrc file using ini `[profile xxx]` sections and SOS_PROFILE env. var. 

## [1.16.1] - 2022-12-16
### Fixed
- Device dateTime `list` return correctly named object DeviceDateTime not DeviceVolume
- Factories `createApiV1` and `createApiV2` have correct default API URL `https://api.signageos.io`

## [1.16.0] - 2022-11-17

### Added
- Organization method to update organization title

## [1.15.0] - 2022-10-21

### Added
- Device screenshot `listLastScreenshotsByDevices` method to fetch list of last screenshots for devices. One last screenshot for each device
- Device brand property
- Filter by `organizationUid` into `emulator.list()` method
- Bulk operation method to archive bulk operations
- Device OS version property
- Optional field `autoEnableTimeoutMs` when disabling device peer recovery
- Device auto recovery
- Update types for bulk operations
- Device is returned after Emulator creation
- Field `duid` to Device entity
- Telemetry schema for `MANAGEMENT_CAPABILITIES` and `FRONT_CAPABILITIES` types

## [1.14.0] - 2022-08-03
### Added
- Listing organizations by `companyUid` in filter

## [1.13.0] - 2022-07-18
### Added
- Device `list` (v2) new field `connectionMethod`, which can be `http` or `websocket`
- Device `get` (v2) new field `connectionMethod`, which can be `http` or `websocket`
- Device `set` (v2) set fields `name` and `connectionMethod` (http/websocket)
- Load TextEncoder and TextDecoder as global variables if not defined already
- Optional preventing building applet when file uploaded
- SDK version in User-Agent header (e.g.: `signageOS_SDK/1.0.3`) and optional custom client versions

### Deprecated
- Device `list` (v1)
- Device `get` (v1)
- Deprecated device `set` (v1)

## [1.12.0] - 2022-07-01
### Added
- Version 2 of device endpoints to fetch list of devices or device by uid
- Device peer recovery `list` method to fetch list of peer recoveries
- Device peer recovery `set` method to set peer recovery

## [1.11.0] - 2022-06-03

### Added
- Device alive `list` method to fetch list of devices with alive time
- Device alive `get` method to fetch one device with alive time
- Device telemetry `listLatest` method to fetch list of devices with telemetries
- Device telemetry `getLatestByUid` method to fetch one device by uid with telemetries

## [1.10.1] - 2022-05-06
### Fixed
- Incorrect URL path on updating device application version
- Policy management use wrong auth tokens
- Usage of @signageos/lib dependency

## [1.10.0] - 2022-04-21
### Added
- `Location` attachments upload management. On `Add` attached file can be added. On `Delete` attached files can be deleted
- Enable and disable monitoring methods on Timing instance

### Fixed
- Management entities are serializable using JSON.stringify() and methods and nested objects still works

## [1.9.0] - 2022-04-06
### Added
- Alert and alert rules management
- File system & cache methods in timing

### Fixed
- Wrong naming in video timing events

## [1.8.0] - 2022-03-18
### Added
- Policy management
- Latest telemetry data for given device & type
- Assignment and unassignment policy to device
- Device policy status for given device & policy & item type or list for given device by filter
- Array `supportedResolutions` into Device entity
- Bulk Operations
- Location `create`, `list` (multiple), `get` (single), `update` and `delete`
- Organization tag `get one`, `create`, `update` and `delete`
- Organization tag to location `assign` and `unassign`
- Location to device `assign` and `unassign`
- Location `create` and `update` methods, simplification of the `feature` parameter into two `coordinates: { lat: number; long: number }` and `address: string`. Where now the feature params is obtained programmatically from the `mapbox` API


### Deprecated
- Marked properties `binary` and `frontDisplayVersion` in Applet Version SDK as deprecated. They are meant to be used for single file applets which are no more supported.

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
