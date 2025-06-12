# Task 3: Local LLM Tag Suggestion API

## 🎯 Goal
This service provides an endpoint to suggest product tags using a local LLM (Mistral via Ollama).

## ✅ How to Run

### 1. Install Ollama
Follow: https://ollama.com/download

```bash
ollama pull mistral
ollama run mistral
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm run dev
```

### 4. Test the API
```bash
curl -X POST http://localhost:3001/suggest-tags -H "Content-Type: application/json" \
-d '{ "name": "Wireless Earbuds", "description": "High-quality sound, Bluetooth 5.3, 20h battery life" }'
```

**Expected Output:**
```json
{ "suggestedTags": ["audio", "bluetooth", "earbuds"] }
```
