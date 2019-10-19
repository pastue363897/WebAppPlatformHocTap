var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params2 = {
    TableName: 'BaiHoc',
    ExpressionAttributeNames: {
        '#stt': 'SoTT'
    },
    ExpressionAttributeValues: {
        ':bhs': 1
    },
    FilterExpression: '#stt = :bhs',
    ReturnConsumedCapacity: 'TOTAL',
};

docClient.scan(params2, function(err, data) {
    if(err) {
        console.log(JSON.stringify(err));
    }
    else {
        res.render('course.ejs', {khs: data.Items});
    }
})
});

module.exports = router;
