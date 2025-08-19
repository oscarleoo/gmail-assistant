# EmailHelper - AI Email Assistant for Gmail

Generate professional email responses using AI, right inside Gmail.

## ✨ Features

- **AI Email Generation**: Create contextual email responses using OpenAI
- **Thread Context**: Analyzes current email thread for better responses
- **Custom Instructions**: Add personal instructions for consistent tone
- **Keyboard Shortcuts**: Fast email generation without clicking

## 🚀 Quick Start

### 1. Download & Install

1. Download the extension files
2. Build the extension: `npm install && npm run build`
3. Open Chrome → `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" → Select the `dist` folder

### 2. Setup Gmail API (One-time, 5 minutes)

**Why needed?** To read email threads for context - your data stays private.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "EmailHelper-Personal"
3. Enable Gmail API
4. Create OAuth 2.0 Client ID (Application type: Chrome Extension)
5. Copy your `client_id`
6. Edit `src/manifest.json` in the extension folder:
   ```json
   "oauth2": {
     "client_id": "YOUR_CLIENT_ID_HERE",
     "scopes": ["https://www.googleapis.com/auth/gmail.readonly"]
   }
   ```
7. Run `npm run build` and reload extension in Chrome

### 3. Add OpenAI API Key

1. Go to Gmail
2. Press `Ctrl+Shift+S` (Settings)
3. Add your [OpenAI API key](https://platform.openai.com/api-keys)
4. Choose your preferred model (GPT-4o Mini recommended)

## 🎯 How to Use

| Shortcut       | Action                                 |
| -------------- | -------------------------------------- |
| `Ctrl+Shift+S` | Open settings                          |
| `Ctrl+Shift+A` | Generate email (uses thread context)   |
| `Ctrl+Shift+I` | Generate email with custom instruction |

### Usage:

1. Open any Gmail email thread
2. Press `Ctrl+Shift+A` to generate a response
3. Email is copied to clipboard - paste anywhere!

## 🔧 Development

```bash
npm install              # Install dependencies
npm run build           # Build extension (required after code changes)
```

**Development workflow:**

1. Make code changes
2. Run `npm run build`
3. Go to `chrome://extensions/` and click reload button on EmailHelper
4. Test changes in Gmail

**Note:** Chrome extensions require rebuilding and reloading after any code changes.

## 📝 Notes

- **Privacy**: Your Gmail data is accessed only through YOUR OAuth app
- **Cost**: You pay OpenAI directly for API usage (typically $0.01-0.10 per email)
- **Models**: GPT-4o Mini recommended for cost-effectiveness

## 🆘 Troubleshooting

- **"No thread detected"**: Open an email thread first
- **"Invalid API key"**: Check your OpenAI API key in settings
- **OAuth errors**: Verify your Google Cloud project setup
- **Changes not working**: Run `npm run build` and reload extension
