import axios from 'axios';

export async function suggestTags(name: string, description: string): Promise<string[]> {
  const prompt = `Suggest 3 concise tags for the following product.\nName: "${name}"\nDescription: "${description}"\nReturn as a comma-separated list.`;
  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'mistral',
    prompt,
    stream: false
  });

  const output = response.data.response;
  const tagsLine = output.split('\n')[0];
  return tagsLine
    .replace(/[\[\]"]+/g, '')
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}
