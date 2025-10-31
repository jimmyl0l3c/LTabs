# L-Tabs

A fork of [FuzzyTabs](https://github.com/NathanMH/FuzzyTabs) extension with redesigned interface and additional features.

L-Tabs is an extension for fuzzy-finding an open tab to switch to.
Inspired by [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim).

## Usage

- Default keymap to open search: `F2`
- Search for any keywords, snippets, or substrings from the tab title
- Enter key automatically switches to the currently selected tab
- To focus a different tab, you can use up/down arrows.

## Planned changes/features

- Fix the autofocus issue
- Refactor/replace the fuzzy sort algorithm
- Scroll down when focusing items that overflow the window height
- Highlight the matched substrings
- Add debug option to show match score
- Hide tabs that have no match
- Frecency?
- Theming support?

## Permissions:

NOTE: These will be revised, some of these are most likely not required.

- tabs
- activeTab
- sessions
- bookmarks
- menus
- storage

## Disclaimers

L-Tabs does not collect or store any information about your browser, tabs, windows, or any other data.

L-Tabs does not access any external resources.
