import { AISearchPromptConfig } from './config';

export interface SearchConfig {
  query: string;
  caseSensitive: boolean;
  useRegex: boolean;
  matchWholeWord: boolean;
}

const getSystemPrompt = (prompt: string) => `
You are assistant that helps to generate search queries for VS Code Search View.
Generate a VS Code search query from the following prompt: "${prompt}".
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
`;
export class AIService {
  private readonly apiKey: string;
  private readonly apiEndpoint: string;
  private readonly modelId: string;

  constructor(config: AISearchPromptConfig) {
    this.apiKey = config.apiKey;
    this.apiEndpoint = config.apiEndpoint;
    this.modelId = config.modelId;
  }

  public async generateSearchQuery(prompt: string): Promise<SearchConfig> {
    try {
      if (!this.apiKey) {
        throw new Error(
          'API key not configured. Please set it in extension settings.'
        );
      }

      if (!this.apiEndpoint) {
        throw new Error(
          'API endpoint not configured. Please set it in extension settings.'
        );
      }

      if (!this.modelId) {
        throw new Error(
          'Model ID not configured. Please set it in extension settings.'
        );
      }

      if (!prompt) {
        throw new Error('Prompt is empty.');
      }

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
              content: getSystemPrompt(prompt),
            },
          ],
          max_tokens: 150,
          temperature: 0.3,
          n: 1,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'search_config',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  caseSensitive: { type: 'boolean' },
                  useRegex: { type: 'boolean' },
                  matchWholeWord: { type: 'boolean' },
                },
                required: [
                  'query',
                  'caseSensitive',
                  'useRegex',
                  'matchWholeWord',
                ],
                additionalProperties: false,
              },
            },
          },
        }),
      });

      if (!response.ok || response.status !== 200) {
        throw new Error('Failed to generate search query');
      }

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
      throw new Error(`${error}`);
    }
  }
}
