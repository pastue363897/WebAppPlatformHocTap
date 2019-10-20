var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
var query = require('../db/query.js')
var crud = require('../db/data_crud.js')
var web_function = require('../db/web_function.js')

AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();

/* GET home page. */
router.get('/', function (req, res, next) {
  query.getAllKhoaHocIndex(9, null, req, res);
});

router.post('/signin', function (req, res, next) {
  web_function.signIn(req, res);
});

router.get('/logout', function (req, res, next) {
  req.session.destroy((err) => {
    if (err)
      console.log(err);
  });
  res.redirect('/');
});

router.get('/course', function (req, res, next) {
  query.getAllKhoaHocCourse(-1, req, res);
});

/* GET users listing. */
router.get('/course-owned', function (req, res, next) {
  let sess = req.session;
  //console.log("Step 1");
  if (sess.user && sess.type == 1) {
    query.getAllKhoaHocOwned(sess.user,null,req,res);
  }
  else {
    query.getAllKhoaHocIndex(9, "Bạn chưa đăng nhập, không thể xem danh sách các khóa học đã mua", req, res);
  }
});

router.get('/detail', function (req, res, next) {
  let sess = req.session;
  if (sess.user) {
    //console.log(sess.type);
    if(sess.type == 1) {
      let IdKhoaHoc = req.query.idKH;
      query.daMuaKhoaHoc(IdKhoaHoc, req, res);
    }
    else {
      res.redirect('/creator');
    }
  }
  else {
    res.redirect('/');
  }
});

router.get('/lesson', function (req, res, next) {
  let sess = req.session;
  console.log("Lesson comes");
  if (sess.user) {
    if(sess.type == 1) {
      console.log("Lesson comes 2");
      let a = query.getAllBaiHocKhoaHoc(req.query.q);
      a.then((Items) => {
        Items.sort((a,b) => (a.SoTT > b.SoTT) ? 1 : ((b.SoTT > a.SoTT) ? -1 : 0) );
        console.log(Items);
        res.render('chitiet', {items: Items});
      });
    }
    else {
      res.redirect('/creator');
    }
  }
  else {
    res.redirect('/');
  }
});

router.post('/video', function (req, res, next) {
  let sess = req.session;
  console.log("Lesson comes");
  if (sess.user) {
    if(sess.type == 1) {
      console.log("Lesson comes 2");
      let a = query.getAllBaiHocKhoaHoc(req.body.idBH);
      a.then((Items) => {
        console.log(Items);
        let inps = {bh: Items[0], backid: Number(req.body.prevIdBH), nextid: Number(req.body.nextIdBH)};
        res.render('video', inps);
      });
    }
    else {
      res.redirect('/creator');
    }
  }
  else {
    res.redirect('/');
  }
});

router.post('/purchase', function (req, res, next) {
  let sess = req.session;
  console.log("Lesson comes");
  if (sess.user) {
    if(sess.type == 1) {
      let genID = Math.floor(Math.random() * 999999999999998)+1;
      console.log(genID);
      console.log(req.body.IdKhoaHoc);
      let a = crud.putHoaDon(req,genID);
      a.then((Items) => {
        console.log(Items);
        let newMoney = req.session.balance - req.body.GiaTien;
        let b = crud.updateSoTien(req,newMoney);
        b.then((Result) => {
          res.redirect('/lesson?q=' + req.body.IdKhoaHoc);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
        res.redirect('/detail?idKH=' + req.body.IdKhoaHoc+'&error=invalidID');
      });
    }
    else {
      res.redirect('/creator');
    }
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;
