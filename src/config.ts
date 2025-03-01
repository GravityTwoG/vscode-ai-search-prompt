import * as vscode from 'vscode';

export interface AISearchPromptConfig {
  apiKey: string;
  apiEndpoint: string;
  modelId: string;
}

export const getConfig = (): AISearchPromptConfig => {
  const configuration = vscode.workspace.getConfiguration('aiSearchPrompt');
  const apiKey = configuration.get<string>('apiKey') || '';
  const apiEndpoint =
    configuration.get<string>('apiEndpoint') ||
    'https://api.openai.com/v1/chat/completions';
  const modelId = configuration.get<string>('modelId') || 'gpt-4o';

  return {
    apiKey,
    apiEndpoint,
    modelId,
  };
};
