import * as vscode from 'vscode';
import { getHTMLFromDocument, getHTMLRange } from './utils/parser';
import prettierHTML from './utils/prettier';

export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('pvts.prettier', prettierCodeHandler);

	context.subscriptions.push(disposable);
}

function prettierCodeHandler() {
	const originText = vscode.window.activeTextEditor?.document.getText() || '';
	const htmlStr = getHTMLFromDocument(originText);
	const range = getHTMLRange(originText);
	const textEdits = prettierHTML(htmlStr, range);
	const document = vscode.window.activeTextEditor?.document;
	
	let workspaceEdit = new vscode.WorkspaceEdit();
	workspaceEdit.set(document?.uri as vscode.Uri, textEdits as vscode.TextEdit[]);
	vscode.workspace.applyEdit(workspaceEdit);
}

export function deactivate() {}
