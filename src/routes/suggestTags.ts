import express from 'express';
import { suggestTags } from '../services/tagSuggester';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Missing name or description' });
  }

  try {
    const suggestedTags = await suggestTags(name, description);
    res.json({ suggestedTags });
  } catch (err) {
    console.error('Error suggesting tags:', err);
    res.status(500).json({ error: 'Failed to generate tags' });
  }
});

export default router;
