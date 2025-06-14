import axios from 'axios';

interface OllamaResponse {
  response: string;
}

export async function suggestTags(name: string, description: string): Promise<string[]> {
  try {
    const prompt = `Given the product name: "${name}" and description: "${description}", 
    suggest 3-5 relevant tags as a comma-separated list. Only return the tags, nothing else.`;

    const response = await axios.post<OllamaResponse>('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt,
      stream: false
    });

    // Clean and parse the response
    const tags = response.data.response
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)
      .slice(0, 5); // Ensure max 5 tags

    return tags;
  } catch (error) {
    console.error('Error calling Ollama:', error);
    throw new Error('Failed to generate tags');
  }
}
