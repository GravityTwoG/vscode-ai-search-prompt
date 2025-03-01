import * as vscode from 'vscode';
import { AIService } from './ai-service';

export class SearchPromptViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'aiSearchPrompt';

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'submitPrompt':
          await this._processPrompt(message.text);
          break;
      }
    });
  }

  public async processPrompt(prompt: string) {
    if (!this._view) {
      vscode.window.showErrorMessage('Search prompt view is not available');
      return;
    }

    return this._processPrompt(prompt);
  }

  private async _processPrompt(prompt: string) {
    try {
      // Show loading indicator
      this._view?.webview.postMessage({ command: 'setLoading', value: true });

      // Call AI service
      const aiService = new AIService();
      const searchConfig = await aiService.generateSearchQuery(prompt);

      // Apply the search configuration
      await this._applySearchConfig(searchConfig);

      // Show confirmation
      vscode.window.showInformationMessage(
        `Search query generated: ${searchConfig.query}`
      );
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to process prompt: ${error}`);
    } finally {
      // Hide loading indicator
      this._view?.webview.postMessage({ command: 'setLoading', value: false });
    }
  }

  private async _applySearchConfig(config: {
    query: string;
    caseSensitive: boolean;
    useRegex: boolean;
    matchWholeWord: boolean;
  }) {
    // Set the search configuration
    await vscode.commands.executeCommand('workbench.action.findInFiles', {
      query: config.query,
      isRegex: config.useRegex,
      isCaseSensitive: config.caseSensitive,
      matchWholeWord: config.matchWholeWord,
    });
  }

  private _getHtmlForWebview() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                padding: 10px;
                font-family: var(--vscode-font-family);
            }
            .container {
                display: flex;
                flex-direction: column;
            }
            #promptInput {
                padding: 6px;
                margin-bottom: 10px;
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
            }
            button {
                padding: 6px 12px;
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                cursor: pointer;
            }
            button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <p>Enter a natural language prompt:</p>
            <input type="text" id="promptInput" placeholder="Find functions that handle user authentication...">
            <button id="submitButton">Generate Search</button>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            const promptInput = document.getElementById('promptInput');
            const submitButton = document.getElementById('submitButton');
            
            submitButton.addEventListener('click', () => {
                submitPrompt();
            });
            
            promptInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submitPrompt();
                }
            });
            
            function submitPrompt() {
                const text = promptInput.value;
                if (text) {
                    vscode.postMessage({
                        command: 'submitPrompt',
                        text
                    });
                }
            }
        </script>
    </body>
    </html>`;
  }
}
