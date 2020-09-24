
# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
