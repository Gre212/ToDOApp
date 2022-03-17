const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-northeast-1",
  endpoint: 'http://dynamodb-local:8000', // TODO: .env に切り出す
  credentials: new AWS.SharedIniFileCredentials({
    profile: 'express'
  })
});
const dynamodb = new AWS.DynamoDB();

const dynamoCreateParams = {
  TableName: "Tasks",
  KeySchema: [{
    AttributeName: "accessKey",
    KeyType: "HASH"
  }, ],
  AttributeDefinitions: [{
    AttributeName: "accessKey",
    AttributeType: "S"
  }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
};

dynamodb.createTable(dynamoCreateParams, function (err, data) {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err));
  } else {
    console.log("Created table. Table description JSON:", JSON.stringify(data));
  }
});
