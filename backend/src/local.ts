// const app = require('./index');
import { app } from './app';
const port = process.env.LOCAL_PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
