import express from 'express';
import suggestTagsRouter from './routes/suggestTags';

const app = express();
app.use(express.json());
app.use('/suggest-tags', suggestTagsRouter);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
