import express, { Router, Request, Response } from 'express'
import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import { check, validationResult } from 'express-validator';

import { Task } from '../@types/Task';
export const router: Router = express.Router();

const ddbClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE ?? "";

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
  .post('/', [
      check('id').isEmpty(),
      check('title').not().isEmpty(),
      check('content').not().isEmpty(),
      check('limit').not().isEmpty(), // .matches('^\d{4}\-\d{2}\-\d{2}$')
      check('state').isIn(["new", "progress", "done"])
    ],
    (req: Request, res: Response) => {
      const body = req.body;

      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
      }

      const task: Task = {
        "id": nanoid(),
        "title": body.title,
        "content": body.content,
        "limit": body.limit,
        "state": body.state,
      }

      const postData = {
        "TableName": tableName,
        "Item": task
      };

      ddbClient.put(postData, (err, data)=> {
        if (err) throw err;
        return res.json(data);
      });
    }
  )
  .patch('/:task_key', [
      check('title').not().isEmpty(),
      check('content').not().isEmpty(),
      check('limit').not().isEmpty(), // .matches('^\d{4}\-\d{2}\-\d{2}$')
      check('state').isIn(["new", "progress", "done"])
    ],
    (req: Request, res: Response) => {

      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
      }

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
        ConditionExpression: 'attribute_exists(id)',
        ReturnValues: 'UPDATED_NEW'
      };

      ddbClient.update(patchData, (err, data) => {
        if (err) {
          if(err.name == "ConditionalCheckFailedException"){
            res.status(404).json({"Error": "Task not found."});
            return;
          }else{
            throw err;
          }
        }
        res.json(data);
        return;
      });
    }
  )
  .delete('/:task_key', (req: Request, res: Response) => {
    const taskKey = req.params.task_key;
    const patchData = {
      TableName: tableName,
      Key: {
        id: taskKey
      },
      ConditionExpression: 'attribute_exists(id)',
    };

    ddbClient.delete(patchData, (err, data) => {
      if (err) {
        if(err.name == "ConditionalCheckFailedException"){
          res.status(404).json({"Error": "Task not found."});
          return;
        }else{
          throw err;
        }
      }
      res.json(data);
      return;
    });
  });

