import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
