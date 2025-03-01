import * as vscode from 'vscode';

export interface SearchConfig {
  query: string;
  caseSensitive: boolean;
  useRegex: boolean;
  matchWholeWord: boolean;
}

export class AIService {
  private readonly apiKey: string | undefined;

  constructor() {
    // Get API key from extension settings
    this.apiKey = vscode.workspace
      .getConfiguration('aiSearchPrompt')
      .get('apiKey');
  }

  public async generateSearchQuery(prompt: string): Promise<SearchConfig> {
    if (!this.apiKey) {
      throw new Error(
        'API key not configured. Please set it in extension settings.'
      );
    }

    try {
      // Call your preferred AI service API (OpenAI, Azure, etc.)
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: `Generate a VS Code search query from the following prompt: "${prompt}".
                    Return a JSON object with the following properties:
                    - query: the search string
                    - caseSensitive: boolean indicating if search should be case sensitive
                    - useRegex: boolean indicating if search should use regular expressions
                    - matchWholeWord: boolean indicating if search should match whole words only`,
          max_tokens: 150,
          temperature: 0.3,
          n: 1,
        }),
      });

      // Parse the response
      const data = (await response.json()) as any;
      const responseText = data.choices[0].text.trim();
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
