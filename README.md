# VSCode Auto Update Dependencies Extension

[![Static Badge](https://img.shields.io/badge/pacakge_assistant-v0.0.1-blue)](https://github.com/iamphc/package-assistant)

## Overview

VSCode Auto Update Dependencies is a VSCode extension designed to automatically update your project dependencies. Simply modify the versions of dependencies in your project's `package.json` file, and VSCode will automatically recognize and update your `node_modules`.

## Features

- **Intelligent Recognition**: The extension can intelligently recognize changes in dependency versions in the `package.json` file and automatically update them.
- **Incremental Updates**: Only the dependencies whose versions have been modified will be updated. This avoids a full-scale dependency installation, saving time and resources.

## Usage

1. Install the extension: Search for "VSCode Auto Update Dependencies" in the VSCode extension marketplace and click install.
2. Modify dependencies: In your project's `package.json` file, modify the versions of the dependencies you want to update.
3. Automatic update: After saving the `package.json` file, VSCode will automatically recognize and start updating your `node_modules`.

## Notes

- Ensure that there is a `package.json` file in your project directory and that the file is correctly formatted.
- After modifying the dependency versions, make sure to save the `package.json` file to trigger the automatic update.

## Feedback and Suggestions

If you encounter any problems during use, or have any suggestions, feel free to submit them via [GitHub Issues](link).

## License

This project is licensed under the MIT License.
