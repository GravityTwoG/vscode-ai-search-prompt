import * as vscode from 'vscode';
import { AIService } from './ai-service';
import { getConfig } from './config';

export class SearchViewDecorator {
  private disposables: vscode.Disposable[] = [];
  private searchBoxObserver: MutationObserver | undefined;
  private promptInput: HTMLInputElement | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  public activate() {
    // Register our CSS in the workbench
    const styleVscodeUri = vscode.Uri.joinPath(
      this.context.extensionUri,
      'media',
      'searchPrompt.css'
    );

    this.disposables.push(
      vscode.workspace.registerTextDocumentContentProvider('ai-search-prompt', {
        provideTextDocumentContent: () => {
          return `@import url("${styleVscodeUri}");`;
        },
      })
    );

    // Register command to open prompt
    this.disposables.push(
      vscode.commands.registerCommand(
        'ai-search-prompt.openPrompt',
        this.showPromptInput.bind(this)
      )
    );

    // Inject our UI when the search view becomes visible
    this.injectPromptUI();

    // Listen for when search view becomes visible
    this.disposables.push(
      vscode.window.onDidChangeVisibleTextEditors(() => {
        if (vscode.window.activeTextEditor) {
          setTimeout(() => this.injectPromptUI(), 500);
        }
      })
    );
  }

  private async showPromptInput() {
    const prompt = await vscode.window.showInputBox({
      prompt: 'Enter a natural language description for your search',
      placeHolder: 'Find functions that handle user authentication...',
      ignoreFocusOut: true,
    });

    if (prompt) {
      await this.processPrompt(prompt);
    }
  }

  private async processPrompt(prompt: string) {
    try {
      // Show progress indicator
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Generating search query...',
          cancellable: false,
        },
        async () => {
          const aiService = new AIService(getConfig());
          const searchConfig = await aiService.generateSearchQuery(prompt);

          // Apply the search configuration
          await this.applySearchQuery(searchConfig);
        }
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to generate search query: ${error}`
      );
    }
  }

  private async applySearchQuery(config: {
    query: string;
    caseSensitive: boolean;
    useRegex: boolean;
    matchWholeWord: boolean;
  }) {
    // Focus the search view first
    await vscode.commands.executeCommand('workbench.view.search');

    // Set the search configuration
    await vscode.commands.executeCommand('workbench.action.findInFiles', {
      query: config.query,
      isRegex: config.useRegex,
      isCaseSensitive: config.caseSensitive,
      matchWholeWord: config.matchWholeWord,
    });
  }

  private injectPromptUI() {
    // We need to use DOM manipulation to inject our UI
    // This requires access to the VS Code webview DOM

    // Note: This approach requires enabling the proposed API
    // See: https://code.visualstudio.com/api/advanced-topics/using-proposed-api

    // This is not achievable with the current stable VS Code API
    // We would need custom DOM injection which is outside the VS Code extension API

    console.log('Search view decoration - trying to inject UI');
  }

  public dispose() {
    this.disposables.forEach((d) => d.dispose());

    if (this.searchBoxObserver) {
      this.searchBoxObserver.disconnect();
    }

    if (this.promptInput) {
      this.promptInput.remove();
    }
  }
}
