// Modules
import express, { Request, Response }  from 'express';

// API endpoints
import { router as tasks } from './apis/tasks';

export const app = express();
app.get('/', (_: Request, res: Response) => {
  return res.json({"Updated": "Hello World!"});
});
app.use('/tasks', tasks);
