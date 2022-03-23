import express, { Request, Response }  from 'express'

export const app = express();

import { router as tasks } from './apis/tasks'

app.get('/', (_: Request, res: Response) => {
  return res.json({"Updated": "Hello World!"});
});
app.use('/tasks', tasks);
