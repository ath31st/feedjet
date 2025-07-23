import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/user.routes.js';
import Logger from './utils/logger.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRoutes);

app.listen(port, () => {
  Logger.log(`[server]: Server is running at http://localhost:${port}`);
});
