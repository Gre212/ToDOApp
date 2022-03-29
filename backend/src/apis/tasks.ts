import express, { Router, Request, Response } from 'express'
import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import { check, validationResult } from 'express-validator';
import moment from 'moment';

import { Task } from '../@types/Task';
export const router: Router = express.Router();

const tableName = process.env.DYNAMODB_TABLE ?? "";

const ddbClient = process.env.IS_OFFLINE?
                  new AWS.DynamoDB.DocumentClient({
                    endpoint: process.env.DYNAMODB_CUSTOM_ENDPOINT
                  }) :
                  new AWS.DynamoDB.DocumentClient() ;

router.use(express.urlencoded({
  extended: true
}));
router.use(express.json());

// URI Prefix: /tasks
router
  .get('/', (req: Request, res: Response) => {
    const state = req.query.State ?? "new";
    const lastId = req.query.lastId;
    const lastState = req.query.lastState;
    const lastCreatedAt = req.query.lastCreatedAt;
    const titleQuery = req.query.titleQuery ?? "";
    const exclusiveStartKey =
      lastId && lastState && lastCreatedAt ?
      { "Id": lastId , "State": lastState, "CreatedAt": lastCreatedAt } as AWS.DynamoDB.DocumentClient.Key :
      undefined;
    const defaultGetLimit = 10;
    const getLimit =
      Number(req.query.limit) != NaN ?
      Number(req.query.limit ?? defaultGetLimit) :
      defaultGetLimit;

    const params = {
      TableName: tableName,
      ExclusiveStartKey: exclusiveStartKey,
      IndexName: "State_CreatedAt_index",
      KeyConditionExpression: '#State = :state',
      ExpressionAttributeNames: {
        '#State': 'State'
      },
      ExpressionAttributeValues: {
        ':state': state
      },
      ScanIndexForward: false,
      Limit: getLimit
    } as AWS.DynamoDB.DocumentClient.QueryInput;
    ddbClient.query(params, (err, data) => {
      if(err) throw err;
      if(titleQuery != ""){
        data.Items = data.Items?.filter((e) => e.Title.includes(titleQuery));
        data.Count = data.Items?.length;
      }
      return res.json(data);
    });
  })
  .post('/', [
      check('Id').isEmpty(),
      check('Title').not().isEmpty(),
      check('Content').not().isEmpty(),
      check('Limit').not().isEmpty(), // .matches('^\d{4}\-\d{2}\-\d{2}$')
      check('State').isIn(["new", "progress", "done"])
    ],
    (req: Request, res: Response) => {
      const body = req.body;

      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
      }

      const task: Task = {
        "Id": nanoid(),
        "Title": body.Title,
        "Content": body.Content,
        "Limit": body.Limit,
        "State": body.State,
        "CreatedAt": moment().format("YYYY-MM-DD_HH:mm:ss"),
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
      check('Title').not().isEmpty(),
      check('Content').not().isEmpty(),
      check('Limit').not().isEmpty(), // .matches('^\d{4}\-\d{2}\-\d{2}$')
      check('State').isIn(["new", "progress", "done"])
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
          Id: taskKey,
        },
        UpdateExpression: 'set #title = :title, #content = :content, #state = :state, #limit = :limit',
        ExpressionAttributeNames : {
          '#title'   : 'Title',
          '#content' : 'Content',
          '#state'   : 'State',
          '#limit'   : 'Limit'
        },
        ExpressionAttributeValues : {
          ':title'   : req.body.Title,
          ':content' : req.body.Content,
          ':state'   : req.body.State,
          ':limit'   : req.body.Limit
        },
        ConditionExpression: 'attribute_exists(Id)',
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
        Id: taskKey
      },
      ConditionExpression: 'attribute_exists(Id)',
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

