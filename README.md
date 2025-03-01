# AI Search Prompt for VS Code

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=yourname.ai-search-prompt)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Transform natural language descriptions into powerful search queries using AI. This extension adds an AI-powered prompt field to the VS Code Search panel, making it easier to find exactly what you're looking for.

## Features

- **Natural Language Search**: Describe what you're looking for in plain English
- **Smart Query Generation**: AI converts your description into an optimized search query
- **Automatic Search Options**: Automatically configures regex, case sensitivity, and whole word matching based on your prompt
- **Seamless Integration**: Works directly within VS Code's existing Search panel

<!-- ![AI Search Prompt Demo](images/demo.gif) -->

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "AI Search Prompt"
4. Click Install

Alternatively, you can install the VSIX file directly:

1. Download the .vsix file from the [latest release](https://github.com/yourusername/ai-search-prompt/releases)
2. In VS Code, go to Extensions
3. Click the "..." menu in the top-right of the Extensions panel
4. Select "Install from VSIX..." and choose the downloaded file

## Usage

1. Open the Search panel (Ctrl+Shift+F / Cmd+Shift+F)
2. You'll see a new "AI Search Prompt" section
3. Enter your search description in natural language
4. Click "Generate Search" or press Enter
5. The AI will generate and apply an appropriate search query

### Example Prompts

- "Find functions that handle user authentication"
- "Look for TODO comments that mention database connections"
- "Search for case sensitive occurrences of API_KEY"
- "Find regex patterns that validate email addresses"
- "Look for whole word matches of 'data' in JavaScript files"

## Configuration

Set up your AI service API key in the extension settings:

1. Go to Settings (Ctrl+, / Cmd+,)
2. Search for "AI Search Prompt"
3. Enter your API key

```json
{
  "aiSearchPrompt.apiKey": "your-api-key-here",
  "aiSearchPrompt.apiEndpoint": "https://api.openai.com/v1/completions"
}
```

## Requirements

- VS Code 1.60.0 or later
- Internet connection (for AI service API calls)
- API key for the AI service (OpenAI by default)

## How It Works

When you submit a prompt:

1. The extension sends your natural language prompt to an AI model
2. The AI analyzes your intent and generates a search configuration
3. The extension applies this configuration to VS Code's search functionality
4. The search results appear just as they would with a manual search

## Privacy & Security

Your search prompts are sent to the configured AI service. No other VS Code or workspace data is transmitted. Your API key is stored in VS Code's secure storage and is only used for communicating with the AI service.

## Known Issues

- Large workspaces may take longer to search after query generation
- Some highly technical or domain-specific terminology might not be interpreted correctly

## Release Notes

### 0.1.0

- Initial release
- Basic prompt-to-search functionality
- Integration with VS Code Search panel
- Support for case sensitivity, regex, and whole word options

## Contributing

Contributions are welcome! Check out the [contribution guidelines](CONTRIBUTING.md) for more information.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This extension is licensed under the [MIT License](LICENSE).

## Acknowledgements

- VS Code Extension API
- OpenAI for providing the AI backend capabilities

---

**Enjoy searching smarter, not harder!**
