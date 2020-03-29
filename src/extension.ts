import * as vscode from "vscode";
const Tureng = require("tureng");

const editor = vscode.window.activeTextEditor;

const translate = async () => {
  const selectedText = editor?.document.getText(editor.selection);

  if (selectedText) {
    const word = new Tureng(selectedText, "entr");
    word.Translate((list: any) => {
      vscode.window.showInformationMessage(selectedText);

      const result = list.IsEn2Tr
        ? list.Translations.map((item: any) => item.TermTR)
        : list.Translations.map((item: any) => item.TermENG);

      console.log(result);
    });
  } else {
    vscode.window.showErrorMessage("Not selected any text.");
  }
};

export const activate = (context: vscode.ExtensionContext) => {
  console.log('Congratulations, your extension "vscode-tureng" is now active!');

  let disposable = vscode.commands.registerCommand("extension.tureng", () => {
    translate();
  });

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
