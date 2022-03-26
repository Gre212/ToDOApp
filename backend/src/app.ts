// Modules
import express, { Request, Response }  from 'express';
import cors from 'cors';

// API endpoints
import { router as tasks } from './apis/tasks';

export const app = express();
app.use(cors({
  origin: "'*'",
  allowedHeaders: "'Content-Type,x-requested-with'"
}));
app.get('/', (_: Request, res: Response) => {
  return res.json({"Updated": "Hello World!"});
});
app.use('/tasks', tasks);
