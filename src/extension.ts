import * as vscode from "vscode";
const Tureng = require("tureng");

const editor = vscode.window.activeTextEditor;

const translate = async () => {
  const selectedText = editor?.document.getText(editor.selection);

  if (!selectedText) {
    vscode.window.showErrorMessage("Not selected any text.");
    return;
  }

  const word = new Tureng(selectedText, "entr");

  word.Translate((list: any) => {
    console.log(list.Situation.IsFound);

    if (!list.Situation.IsFound) {
      if (!list.Situation.Suggestion) {
        vscode.window.showErrorMessage("Translations not found!");
        return;
      }

      const suggestions = list.Suggestions.join(", ");

      vscode.window.showWarningMessage("Suggestions: " + suggestions);
      return;
    }

    const results: [] = list.IsEn2Tr
      ? list.Translations.map((item: any) => item.TermTR)
      : list.Translations.map((item: any) => item.TermENG);

    const document = results.join("\n");

    vscode.window.showInformationMessage(document);
  });
};

export const activate = (context: vscode.ExtensionContext) => {
  console.log('Congratulations, your extension "vscode-tureng" is now active!');

  let disposable = vscode.commands.registerCommand("extension.tureng", () => {
    translate();
  });

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
