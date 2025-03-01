import * as vscode from 'vscode';
import { SearchViewDecorator } from './search-view-decorator';

export function activate(context: vscode.ExtensionContext) {
  console.log('AI Search Prompt extension is now active');

  // Add a button in the title area of the search view
  context.subscriptions.push(
    vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0)
  );

  // Create our search decorator
  const searchDecorator = new SearchViewDecorator(context);
  searchDecorator.activate();

  context.subscriptions.push({
    dispose: () => searchDecorator.dispose(),
  });

  // Register keyboard shortcut for quicker access
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'ai-search-prompt.quickPrompt',
      async () => {
        const result = await vscode.window.showInputBox({
          placeHolder: 'Describe what you want to search for...',
          prompt: 'AI Search Prompt',
        });

        if (result) {
          // Forward to processing
          vscode.commands.executeCommand('ai-search-prompt.openPrompt');
        }
      }
    )
  );
}

export function deactivate() {}
