import * as vscode from "vscode";
const Tureng = require("tureng");

const editor = vscode.window.activeTextEditor;

import config from "./configs";

const translate = async (text?: string) => {
  const selectedText = text || editor?.document.getText(editor?.selection);

  if (!selectedText) {
    const inputText = await vscode.window.showInputBox({
      placeHolder: "Turkish or English"
    });

    if (inputText) {
      translate(inputText);
    }

    return;
  }

  const word = new Tureng(selectedText, config.TRANSLATION_LANGUAGES);

  word.Translate(async (list: any) => {
    if (!list.Situation.IsFound) {
      if (list.Suggestions.length < 1) {
        vscode.window.showErrorMessage(config.TRANSLATION_NOT_FOUND);
        return;
      }

      const suggestions: [] = list.Suggestions;
      const suggestionsButtons = suggestions.splice(0, 3);
      const document = suggestions.join(", ");

      const selection = await vscode.window.showWarningMessage(
        `Suggestions: ${document}`,
        ...suggestionsButtons
      );

      if (selection) {
        translate(selection);
      }

      return;
    }

    const results: [] = list.Translations.map((item: any) => {
      const sentence: string = list.IsEn2Tr ? item.TermTR : item.TermENG;

      const squareBracketIndex = sentence.indexOf("[");
      const parenthesIndex = sentence.indexOf("(");

      const separatorIndex =
        squareBracketIndex === -1 ? parenthesIndex : squareBracketIndex;

      const word = sentence.substring(0, separatorIndex - 1);

      return word;
    });

    const document = results.join(", ");

    vscode.window.showInformationMessage(document);
  });
};

export default translate;
