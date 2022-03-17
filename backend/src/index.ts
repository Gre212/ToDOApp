import express, { Application, Request, Response } from 'express'
const app: Application = express();
const port = 3000;

app.get('/user', (_: Request, res: Response) => {
  res.json([{
    id: 1,
    name: "Taro"
  }, {
    id: 2,
    name: "Jiro"
  }]);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
