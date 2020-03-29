import * as vscode from "vscode";
import translate from "./translate";

export const activate = (context: vscode.ExtensionContext) => {
  let disposable = vscode.commands.registerCommand(
    "extension.tureng",
    translate
  );

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
