// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import findNodeModules from './utils/find-node-modules';
// import findPackageJson from './utils/find-package-json';
// import autoInstallPackages from './utils/auto-install-packages';
// import execPackageJson from './utils/exec-package-json';
import { DepTuple, autoInstall } from './utils/auto-install-packages';
import isOpenWorkSpace from './utils/is-open-workspace';
import isFileExist from './utils/is-files-exist';
const fs = require("fs");

type FileInfo = {
  filePath: string,
  rootPath: string
};

/**
 * dependencies valid or not
 * reference：semantic versioning
 * reference website：https://semver.org
 * @param dependency 
 * @returns 
 */
function isValidDependencyFormat(dependency: string) {
  let regex = /^[\^\~]{0,1}([\d]+\.)+[\d]+$/;
  return dependency === 'latest' || regex.test(dependency);
}

export function activate(context: vscode.ExtensionContext) {
	let previousDependencies: Record<string, any> = {};

  let watcher = vscode.workspace.createFileSystemWatcher("**/package.json");
  context.subscriptions.push(watcher);

  isOpenWorkSpace().then(async workspaceFolders => {
    return new Promise((resolve, reject) => {
      isFileExist('package.json', workspaceFolders)
        .then(info => resolve(info))
        .catch(err => reject(err));
    });
  }).then(fileInfo => {
    watcher.onDidChange(uri => {
      let packageJSON = JSON.parse(fs.readFileSync(uri.fsPath, 'utf8'));
      let dependencies = Object.assign({}, packageJSON.dependencies, packageJSON.devDependencies);
      
      const depInstallPendingList: DepTuple[] = [];

      for (let dep in dependencies) {
        const curVersion = dependencies[dep] as string;
        const previousVersion = previousDependencies[dep];
        if ((curVersion !== previousVersion) && isValidDependencyFormat(curVersion)) {
          depInstallPendingList.push([dep, curVersion]);
        }
      }

      if (depInstallPendingList.length) {
        autoInstall(fileInfo as FileInfo, depInstallPendingList);
        previousDependencies = dependencies;
      }
    });
  });
}

export function deactivate() {}
