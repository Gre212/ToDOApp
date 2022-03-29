// Modules
import express, { Request, Response }  from 'express';
import cors from 'cors';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

// API endpoints
import { router as tasks } from './apis/tasks';

export const app = express();

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());


app.use(cors());
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

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());
