import * as vscode from 'vscode';
const fs = require('fs');
import isOpenWorkSpace from './is-open-workspace';
type FileInfo = {
  filePath: string,
  rootPath: string
};
type PathType = string;
/**
 * first step this plugin:
 * find node_modules folder in current project
 */
const isFileExist = (filesName: string, workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined): Promise<PathType|FileInfo> => {
  if (!filesName || !workspaceFolders) {
    return Promise.reject('参数缺少！');
  }
  const nodeModulesPath = `${workspaceFolders?.[0]?.uri.fsPath}\\${filesName}`;
  return new Promise((resolve, reject) => {
    fs.access(nodeModulesPath, fs.constants.F_OK, (err: any) => {
      if (err) {
        reject(`没找到${filesName}`);
      };
      resolve({
        filePath: nodeModulesPath,
        rootPath: workspaceFolders?.[0]?.uri.fsPath
      });
    });
  });
};

export default isFileExist;