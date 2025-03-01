import * as vscode from 'vscode';
import { SearchPromptViewProvider } from './search-prompt-view';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  console.log('AI Search Prompt extension is now active');

  // Register the custom search prompt view provider
  const searchPromptViewProvider = new SearchPromptViewProvider(
    context.extensionUri
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SearchPromptViewProvider.viewType,
      searchPromptViewProvider
    )
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand('ai-search-prompt.submitPrompt', () => {
      vscode.window
        .showInputBox({
          prompt: 'Enter your search prompt',
          placeHolder: 'Find functions that handle user authentication...',
        })
        .then((prompt) => {
          if (prompt) {
            // Forward to the view provider
            vscode.commands.executeCommand('aiSearchPrompt.focus');
            searchPromptViewProvider.processPrompt(prompt);
          }
        });
    })
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
