import express, { Router, Request, Response } from 'express'
import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
const router: Router = express.Router();

// TODO: jsonから設定ファイルロードするように修正する
AWS.config.update({
  region: "ap-northeast-1",
  credentials: new AWS.SharedIniFileCredentials({
    profile: "express"
  })
});
const dynamodbOption = {
  endpoint: "http://dynamodb-local:8000" // TODO: .env に切り出す
}
const ddbClient = new AWS.DynamoDB.DocumentClient(dynamodbOption);
const tableName = "Tasks";

router.use(express.urlencoded({
  extended: true
}));
router.use(express.json());

// URI Prefix: /tasks
module.exports = router
  .get('/', (_: Request, res: Response) => {
    const params = {
      TableName: tableName
    }
    ddbClient.scan(params, (err, data) => {
      if (err) throw err; // AWSErrorなのでそのまま投げる
      res.json(data);
    });

  })
  .post('/', (req: Request, res: Response) => {
    const body = req.body;
    const postData = {
      "TableName": tableName,
      "Item": { // 自作のTask型を定義するとフロントとのやり取りがいい感じになりそう
        "accessKey": nanoid(),
        "title": body.title,
        "content": body.content,
        "limit": body.limit,
        "state": body.state,
      }
    };

    ddbClient.put(postData, (err, data)=> {
      if (err) throw err;
      return res.json(data);
    });

  })
  .patch('/:task_key', (req: Request, res: Response) => {
    const taskKey = req.params.task_key;
    const patchData = {
      TableName: tableName,
      Key: {
        accessKey: taskKey
      },
      UpdateExpression: 'set #title = :title, #content = :content, #state = :state, #limit = :limit',
      ExpressionAttributeNames : {
        '#title'   : 'title',
        '#content' : 'content',
        '#state'   : 'state',
        '#limit'   : 'limit'
      },
      ExpressionAttributeValues : {
        ':title'   : req.body.title,
        ':content' : req.body.content,
        ':state'   : req.body.state,
        ':limit'   : req.body.limit
      },
      ReturnValues: 'UPDATED_NEW'
    };

    ddbClient.update(patchData, (err, data) => {
        if (err) throw err;
      return res.json(data);
    });
  })
  .delete('/:task_key', (req: Request, res: Response) => {
    const taskKey = req.params.task_key;
    const patchData = {
      TableName: tableName,
      Key: {
        accessKey: taskKey
      }
    };

    ddbClient.delete(patchData, (err, data) => {
      if (err) throw err;
      return res.json(data);
    });
  });

