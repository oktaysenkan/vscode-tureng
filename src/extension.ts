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
    if (!list.Situation.IsFound) {
      if (!list.Situation.Suggestion) {
        vscode.window.showErrorMessage("Translations not found!");
        return;
      }

      const suggestions = list.Suggestions.join(", ");
      vscode.window.showWarningMessage(`Suggestions: ${suggestions}`);
      return;
    }

    const results: [] = list.Translations.map((item: any) => {
      const language: string = list.IsEn2Tr ? item.TermTR : item.TermENG;
      const spaceIndex = language.indexOf(" ");
      const rawWord = language.substring(0, spaceIndex);

      return rawWord;
    });

    const document = results.join(",");

    vscode.window.showInformationMessage(document);
  });
};

export const activate = (context: vscode.ExtensionContext) => {
  let disposable = vscode.commands.registerCommand("extension.tureng", () => {
    translate();
  });

  context.subscriptions.push(disposable);
};

export const deactivate = () => {};
