import express, { Router, Request, Response } from 'express'
import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
export const router: Router = express.Router();

// TODO: jsonから設定ファイルロードするように修正する
// AWS.config.update({
//   region: "ap-northeast-1",
//   credentials: new AWS.SharedIniFileCredentials({
//     profile: "express"
//   })
// });
// const dynamodbOption = {
//   endpoint: "http://dynamodb-local:8000" // TODO: .env に切り出す
// }
const ddbClient = new AWS.DynamoDB.DocumentClient();
const tableName = "Tasks-dev";

router.use(express.urlencoded({
  extended: true
}));
router.use(express.json());

// URI Prefix: /tasks
router
  .get('/', async (_: Request, res: Response) => {
    // TODO: any型を卒業する
    const fullScan: any = async (LastEvaluatedKey? : AWS.DynamoDB.DocumentClient.Key)=> {
      const params = {
        TableName: tableName,
        ExclusiveStartKey: LastEvaluatedKey
      }

      const result = await ddbClient.scan(params).promise();

      if(!result.Items) throw result;

      if(result.LastEvaluatedKey){
        const nextScanResult = await fullScan(result.LastEvaluatedKey);
        return result.Items.concat(nextScanResult);
      }else{
        return result.Items;
      }
    }

    const result = await fullScan();
    res.json(result);
  })
  .post('/', (req: Request, res: Response) => {
    const body = req.body;
    const postData = {
      "TableName": tableName,
      "Item": { // 自作のTask型を定義するとフロントとのやり取りがいい感じになりそう
        "id": nanoid(),
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
        id: taskKey
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
        id: taskKey
      }
    };

    ddbClient.delete(patchData, (err, data) => {
      if (err) throw err;
      return res.json(data);
    });
  });

