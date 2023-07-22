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
  // 读取Package.json文件
  const data = await vscode.workspace.fs.readFile(vscode.Uri.file(path));
  const packageJson = JSON.parse(data.toString());
  // TODO:默认npm
  if (!packageJson.dependencies && !packageJson.devDependencies) {
    return Promise.reject('没有任何可以安装的依赖，请检查您的package.json文件！');
  }
  // 生成依赖tree
  // 安装依赖
  // 生成命令
  const commandStr = depOrList instanceof Array ? depOrList.reduce((pre, [depName, depVersion]) => pre + `${depName}@${depVersion} `, '') : `${depOrList}@${version}`
  const command = 'npm install ' + commandStr;
  const options = { cwd: fileInfo.rootPath };
  exec(command, options, (error: any, stdout: any, stderr: any) => {});

  const terminal = vscode.window.createTerminal();
  terminal.sendText(command, true);
  terminal.show();
  vscode.window.onDidCloseTerminal((closedTerminal) => {
    if (closedTerminal === terminal) {
      vscode.window.showInformationMessage('依赖安装完成!');
    }
});
};