import * as vscode from 'vscode';
const fs = require('fs');
const { exec } = require('child_process');
import isOpenWorkSpace from './is-open-workspace';
import isFileExist from './is-files-exist';
import transformPath from './transform-path';

type FileInfo = {
  filePath: string,
  rootPath: string
};
type DepName = string;
type DepVersion = string;
export type DepTuple = [DepName, DepVersion];
/**
 * first step this plugin:
 * find node_modules folder in current project
 */

export const autoInstall = async (fileInfo: FileInfo, depOrList?: string | (DepTuple[]), version?: string) => {
  const path = transformPath(fileInfo.filePath);
  // read Package.json file
  const data = await vscode.workspace.fs.readFile(vscode.Uri.file(path));
  const packageJson = JSON.parse(data.toString());
  if (!packageJson.dependencies && !packageJson.devDependencies) {
    return Promise.reject('no dependencies would be installed, please check your package.json file configuration!');
  }
  // generate dependencies tree
  // install dependencies
  // generate install command
  const commandStr = depOrList instanceof Array ? depOrList.reduce((pre, [depName, depVersion]) => pre + `${depName}@${depVersion} `, '') : `${depOrList}@${version}`
  const command = 'npm install ' + commandStr;
  const options = { cwd: fileInfo.rootPath };
  exec(command, options, (error: any, stdout: any, stderr: any) => {});

  const terminal = vscode.window.createTerminal();
  terminal.sendText(command, true);
  terminal.show();
  vscode.window.onDidCloseTerminal((closedTerminal) => {
    if (closedTerminal === terminal) {
      vscode.window.showInformationMessage('install finished!');
    }
});
};