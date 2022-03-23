// const serverlessExpress = require();
// const index = require('./index');

import serverlessExpress from '@vendia/serverless-express';
import { app } from './app';

export const handler = serverlessExpress({ app });

// exports.handler = (event, context) => serverlessExpress.proxy(server, event, context)
