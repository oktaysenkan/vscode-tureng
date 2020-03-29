import * as vscode from "vscode";
const Tureng = require("tureng");

const editor = vscode.window.activeTextEditor;

import config from "./configs";

const translate = () => {
  const selectedText = editor!.document.getText(editor!.selection);

  if (!selectedText) {
    vscode.window.showErrorMessage(config.TEXT_NOT_SELECTED);
    return;
  }

  const word = new Tureng(selectedText, config.TRANSLATION_LANGUAGES);

  word.Translate((list: any) => {
    if (!list.Situation.IsFound) {
      if (list.Suggestions.length < 1) {
        vscode.window.showErrorMessage(config.TRANSLATION_NOT_FOUND);
        return;
      }

      const suggestions = list.Suggestions.join(", ");
      vscode.window.showWarningMessage(`Suggestions: ${suggestions}`);
      return;
    }

    const results: [] = list.Translations.map((item: any) => {
      const language: string = list.IsEn2Tr ? item.TermTR : item.TermENG;

      const squareBracketIndex = language.indexOf("[");
      const parenthesIndex = language.indexOf("(");

      const separatorIndex =
        squareBracketIndex === -1 ? parenthesIndex : squareBracketIndex;

      const rawWord = language.substring(0, separatorIndex - 1);

      return rawWord;
    });

    const document = results.join(", ");

    vscode.window.showInformationMessage(document);
  });
};

export default translate;
