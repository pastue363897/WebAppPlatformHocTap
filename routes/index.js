var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();



/* GET home page. */
router.get('/', function (req, res, next) {
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
    Limit: 9
  };

  docClient.scan(params2, function (err, data) {
    if (err) {
      console.log(JSON.stringify(err));
    }
    else {
      let sess = req.session;
      console.log(req.session);
      if(sess.user) {
        console.log("Yes");
        res.render('index.ejs', { khs: data.Items, uname: sess.user });
      }
      else {
        console.log("No");
        res.render('index.ejs', { khs: data.Items, uname: null });
      }
    }
  })
});

router.post('/signin', function (req, res, next) {
  var params4 = {
    TableName: 'UserKH',
    KeyConditionExpression: '#user = :val',
    ExpressionAttributeNames: {
      '#user': 'Username'
    },
    ExpressionAttributeValues: {
      ':val': req.body.username,
    },
    ReturnConsumedCapacity: 'NONE',
  };

  docClient.query(params4, function (err, data) {
    if (err) {
      console.log(JSON.stringify(err));
    }
    else {
      console.log(JSON.stringify(data));
      if(data.Items.length != 0) {
        let us = data.Items[0];
        if(req.body.pass == us.Pass) {
          req.session.user = us.Username;
          req.session.type = 1;
          console.log("Success");
          res.redirect('/');
        }
        else {
          console.log("Fail");
          res.redirect('/');
        }
      }
    }
  });
});

router.get('/logout', function (req, res, next) {
  req.session.destroy((err) => {
    if(err)
      console.log(err);
  });
  res.redirect('/');
});

/* thanh toán */
router.get('/pay', function(req, res, next) {
  res.render('pay.ejs', { title: 'Express', uname: null });
  // res.render('index.ejs', { khs: data.Items, uname: null });
});

/* trang chi tiết khóa học */
router.get('/coursedetail', function(req, res, next) {
  res.render('coursedetail', { title: 'Express', uname: null });
});

/* trang người bán khóa học */
router.get('/dangkhoahoc', function(req, res, next) {
  res.render('dangkhoahoc', { title: 'Express', uname: null });
});

router.get('/khoahocdadang', function(req, res, next) {
  res.render('khoahocdadang.ejs', { title: 'Express', uname: null });
});

/* ------ Xử lý giao diện của admin -----*/

/* trang chủ admin */
router.get('/admin-indexadmin', function(req, res, next) {
  res.render('admin/indexadmin.ejs', { title: 'Express'});
});
/* trang đăng nhập admin */
router.get('/admin-login', function(req, res, next) {
  res.render('admin/login.ejs', { title: 'Express'});
});
/* trang quản lý chủ đề */
router.get('/admin-chude', function(req, res, next) {
  res.render('admin/chude', { title: 'Express'});
});

module.exports = router;
