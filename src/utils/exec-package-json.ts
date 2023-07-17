import * as vscode from 'vscode';
const fs = require('fs');
import isOpenWorkSpace from './is-open-workspace';
import isFileExist from './is-files-exist';
import transformPath from './transform-path';

type FileInfo = {
  filePath: string,
  rootPath: string
};

// 解析依赖的行数
const getDependencyLineNumber = (packageData: any, dep: string): number => {
  const lines = packageData.split('\n');
  for (let i = 0; i < lines.length; ++ i) {
    if (lines[i].includes(`"${dep}"`)) {
      return i;
    }
  }
  return -1;
};
// 删除依赖，并更新package.json
const deletePackage = (dep: any, packageData: any) => {
  vscode.window.showInformationMessage('test 删除依赖！');
};

// 更新依赖，并更新pakcage.json
const updatePackageVersion = (dep: any, packageData: any) => {
  vscode.window.showInformationMessage('test 更新依赖！');
};

// 新增依赖，并更新package.json
const addPackage = (dep: any, packageData: any) => {
  vscode.window.showInformationMessage('test 新增依赖！');
};

// 解析pakcage.json，从开发依赖和生产依赖中生成“依赖数组”
const getDependencies = async (filePath: string) => {
  const data = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(data);
  // 解析 package.json 文件，获取依赖列表
  const dependencies = [];
  // 处理开发依赖
  if (jsonData.dependencies) {
    for (const [dep, version] of Object.entries(jsonData.dependencies)) {
      const lineNumber = getDependencyLineNumber(data, dep);
      dependencies.push({ dep, version, lineNumber });
    }
  }
  // 处理生产依赖
  if (jsonData.devDependencies) {
    for (const [dep, version] of Object.entries(jsonData.devDependencies)) {
      const lineNumber = getDependencyLineNumber(data, dep);
      dependencies.push({ dep, version, lineNumber });
    }
  }
  return dependencies;
};

// 展示按钮
const showButtonOptions = (dep: any, packageData: any) => {
  vscode.window.showQuickPick(['删除依赖', '更新版本']).then(selectionOption => {
    if (selectionOption === '删除依赖') {
      deletePackage(dep.dep, packageData);
    }
    if (selectionOption === '更新版本') {
      updatePackageVersion(dep.dep, packageData);
    }
  });
};

// 处理editor
const execEditor = async (dependencies: any[], pathFile: string) => {
  if (!dependencies.length) {
    return Promise.reject('no dependencies');
  }
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return Promise.reject('no editor!');
  }
  const document = editor.document;
  const edit = new vscode.WorkspaceEdit();
  dependencies.forEach(dep => {
    const line = document.lineAt(dep.lineNumber);
    const insertPosition = new vscode.Position(line.lineNumber, line.range.end.character);

    // 在每个依赖行的末尾插入按钮
    const buttonDecoration = vscode.window.createTextEditorDecorationType({
      after: {
        contentText: '操作',
        margin: '0 10px'
      }
    });

    editor.setDecorations(buttonDecoration, [line.range]);

    editor.edit(editBuilder => {
      editBuilder.insert(insertPosition, ' ');
    });

    vscode.workspace.onDidChangeTextDocument(event => {
      if (event.contentChanges.some(change => change.text === ' ')) {
        // 按钮点击事件发生，处理用户选择
        showButtonOptions(dep, pathFile);
      }
    });
  });
  return Promise.resolve();
};

// 主程序
const execPackageJson = (): vscode.Disposable => {
  return vscode.commands.registerCommand('package-assistant.execPackageJson', () => {
    isOpenWorkSpace().then(async workspaceFolders => {
      return new Promise((resolve, reject) => {
        isFileExist('package.json', workspaceFolders)
          .then(info => resolve(info))
          .catch(err => reject(err));
      });
    }).then(fileInfo => {
      // 获取 package.json 文件路径
      const path = transformPath((fileInfo as FileInfo).filePath);
      // 解析 package.json 文件，获取依赖列表
      getDependencies(path).then(dependencies => {
        execEditor(dependencies, path);
      });
    }).catch(err => {
      vscode.window.showErrorMessage(err);
    });
  });
};

export default execPackageJson;