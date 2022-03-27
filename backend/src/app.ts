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
  return res.json({
    "endpoints": {
      "/tasks": {
        "GET": "get tasks",
        "POST": "create task"
      },
      "/tasks/{id}": {
        "PATCH": "update task",
        "DELETE": "delete task"
      }
    }
  });
});
app.use('/tasks', tasks);
