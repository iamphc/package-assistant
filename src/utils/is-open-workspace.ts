import * as vscode from 'vscode';
const fs = require('fs');
const { exec } = require('child_process');
/**
 * first step this plugin:
 * find node_modules folder in current project
 */
const isOpenWorkSpace = (): Promise<any> => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    return Promise.resolve(workspaceFolders);
  }
  return Promise.reject('workspace not founding!');
};

export default isOpenWorkSpace;