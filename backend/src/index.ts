import express, { Application } from 'express'
const app: Application = express();
const port = 3000;

const tasks = require('./apis/tasks'); // import 文に書き直したい（統一したい）

app.use('/tasks', tasks);



app.listen(port, () => console.log(`Server running on port ${port}`));
