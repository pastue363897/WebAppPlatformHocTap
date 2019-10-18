var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
var query = require('../db/query.js')
var web_function = require('../db/web_function.js')

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();

/* GET users listing. */
router.get('/', function(req, res, next) {
    query.getAllKhoaHocCourse(-1,req,res);
});

/* GET users listing. */
router.get('/owned', function(req, res, next) {
    let sess = req.session;
    if(sess.user)
        query.getAllKhoaHocOwned(sess.user,null,req,res);
    else
    {
        query.getAllKhoaHocIndex(9, "Bạn chưa đăng nhập, không thể xem danh sách các khóa học đã mua", req, res);
    }
});

module.exports = router;
