import * as vscode from 'vscode';

export interface SearchConfig {
  query: string;
  caseSensitive: boolean;
  useRegex: boolean;
  matchWholeWord: boolean;
}

export class AIService {
  private readonly apiKey: string | undefined;
  private readonly apiEndpoint: string;
  private readonly modelId: string;

  constructor() {
    const configuration = vscode.workspace.getConfiguration('aiSearchPrompt');
    this.apiKey = configuration.get('apiKey');
    this.apiEndpoint =
      configuration.get('apiEndpoint') ||
      'https://api.openai.com/v1/chat/completions';
    this.modelId = configuration.get('modelId') || 'gpt-4o';
  }

  public async generateSearchQuery(prompt: string): Promise<SearchConfig> {
    if (!this.apiKey) {
      throw new Error(
        'API key not configured. Please set it in extension settings.'
      );
    }

    try {
      // Call your preferred AI service API (OpenAI, Azure, etc.)
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelId,
          messages: [
            {
              role: 'system',
              content: `Generate a VS Code search query from the following prompt: "${prompt}".
              Return a JSON object with the following properties:
              - query: the search string
              - caseSensitive: boolean indicating if search should be case sensitive
              - useRegex: boolean indicating if search should use regular expressions
              - matchWholeWord: boolean indicating if search should match whole words only
              - Do not wrap response in backticks or any other formatting. Return valid JSON.
              JSON format:
              {
                query: string,
                caseSensitive: boolean,
                useRegex: boolean,
                matchWholeWord: boolean
              }  
            `,
            },
          ],
          max_tokens: 150,
          temperature: 0.3,
          n: 1,
        }),
      });

      // Parse the response
      const data = (await response.json()) as any;
      const responseText = data.choices[0].message.content.trim();
      const searchConfig = JSON.parse(responseText);

      return {
        query: searchConfig.query || '',
        caseSensitive: !!searchConfig.caseSensitive,
        useRegex: !!searchConfig.useRegex,
        matchWholeWord: !!searchConfig.matchWholeWord,
      };
    } catch (error) {
      console.error('Error calling AI service:', error);
      throw new Error(`Failed to generate search query: ${error}`);
    }
  }
}
