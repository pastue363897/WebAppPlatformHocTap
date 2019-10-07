const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();
// Lấy ra tên các bài học của 1 khóa học
var params = {
    TableName: 'BaiHoc',
    IndexName: 'BaiHoc_KhoaHocIndex', // optional (if querying an index)
    KeyConditionExpression: '#ids = :v1', // a string representing a constraint on the attribute
    ProjectionExpression: "TenBH",
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        '#ids': 'IdKhoaHoc'
    },
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
      ':v1': 1
    },
    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
};
docClient.query(params, function(err, data) {
    if(err) {
        console.log(JSON.stringify(err));
    }
    else {
        console.log(JSON.stringify(data));
    }
});
// Lấy ra tên các khóa học của 1 user
var params = {
    TableName: 'BaiHoc',
    IndexName: 'BaiHoc_UsernameBKHIndex',
    FilterExpression: '#user = :val', // a string representing a constraint on the attribute
    ProjectionExpression: "TenKH",
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        '#user': 'UsernameBKH'
    },
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
      ':val': 'pres0002'
    },
    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
};
docClient.scan(params, function(err, data) {
    if(err) {
        console.log(JSON.stringify(err));
    }
    else {
        console.log(JSON.stringify(data));
    }
});