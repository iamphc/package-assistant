// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import findNodeModules from './utils/find-node-modules';
// import findPackageJson from './utils/find-package-json';
import autoInstallPackages from './utils/auto-install-packages';
import execPackageJson from './utils/exec-package-json';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// const disposableFindNodeModules = findNodeModules();
	// const disposableFindPackageJson = findPackageJson();
	const disposableAutoInstallPackages = autoInstallPackages();
	const disposablExecPackageJson = execPackageJson();

	context.subscriptions.push(disposableAutoInstallPackages, disposablExecPackageJson);
}

// This method is called when your extension is deactivated
export function deactivate() {}
