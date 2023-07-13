import * as vscode from 'vscode';
const fs = require('fs');
const { exec } = require('child_process');
import isOpenWorkSpace from './is-open-workspace';
import isFileExist from './is-files-exist';
type FileInfo = {
  filePath: string,
  rootPath: string
};
/**
 * first step this plugin:
 * find node_modules folder in current project
 */

const autoInstall = async (fileInfo: FileInfo) => {
  // 读取Package.json文件
  const data = vscode.workspace.fs.readFile(vscode.Uri.file(fileInfo.filePath));
  const packageJson = JSON.parse(data.toString());
  // TODO:默认npm
  if (!packageJson.dependencies && !packageJson.devDependencies) {
    return Promise.reject('没有任何可以安装的依赖，请检查您的package.json文件！');
  }
  // 生成依赖tree
  // 安装依赖
  // 生成命令
  const command = 'npm install';
  const options = { cwd: fileInfo.rootPath };
  exec(command, options, (error: any, stdout: any, stderr: any) => {
    if (error) {
      vscode.window.showErrorMessage(`安装依赖失败：${error.message}`);
    }
    else {
      vscode.window.showInformationMessage('依赖安装成功！');
    }
  });
};

const autoInstallPackages = (): vscode.Disposable => {
  return vscode.commands.registerCommand('package-assistant.autoInstallPackages', () => {
		isOpenWorkSpace().then(async workspaceFolders => {
      return new Promise((resolve, reject) => {
        isFileExist('node_modules', workspaceFolders)
          .then(info => resolve(info))
          .catch(err => reject(err));
      });
      // const isPackageJExsist = isFileExist('package.json', workspaceFolders);
    }).then(fileInfo => {
      // vscode.window.showInformationMessage(filePath as string);
      autoInstall(fileInfo as FileInfo);
    }).catch(err => {
      vscode.window.showErrorMessage(err);
    });
	});
};

export default autoInstallPackages;