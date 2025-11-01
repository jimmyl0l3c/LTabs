# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## 0.4.1 - 2025-11-01

### Fixed

- Added missing `data_collection_permissions` to manifest (there is no data collection)

## 0.4.0 - 2025-11-01

### Fixed

- Attempt to fix search input not auto-focusing 🤞
- Pressing up/down arrows or enter when the list is empty is now ignored (previously caused error)

### Changed

- Clean settings
- Refactor search popup logic
- Refactor source structure
- Migrate to manifest v3
- Updated README

### Removed

- Combined search of tabs and bookmarks
- Unused theming options from settings
- Tab counter
- Unnecessary background scripts

## 0.3.1 - 2025-08-14

### Added

- Change selection using Up/Down arrows

### Changed

- First release as `L-Tabs`
- Redesigned UI
- Updated bootstrap

## 0.2 - 2018-09-12

- Change keybinding to F2
- Fix file not found error on tab select
- Close popup when tab focus is switched
- Reduce console spam
- Limit tab/bookmark titles to first 64 characters

## 0.1

- First release
