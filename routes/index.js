var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
var query = require('../db/query.js')
var crud = require('../db/data_crud.js')
var web_function = require('../db/web_function.js')
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();
var aws = require('../aws_header.js');
let docClient = new aws.AWS.DynamoDB.DocumentClient();

/* GET home page. */
router.get('/', function (req, res, next) {
  query.getAllKhoaHocIndex(null, req, res);
});

router.post('/signin', function (req, res, next) {
  if (req.body.pass.trim() === "")
    query.getAllKhoaHocIndex("Password bị trống", req, res);
  else if (req.body.username.trim() === "")
    query.getAllKhoaHocIndex("Username bị trống", req, res);
  web_function.signIn(req, res);
});

router.post('/signup', function (req, res, next) {
  if (req.body.Password.trim() === "")
    query.getAllKhoaHocIndex("Password bị trống", req, res);
  else if (req.body.Email.trim() === "")
    query.getAllKhoaHocIndex("Email bị trống", req, res);
  else if (req.body.Username.trim() === "")
    query.getAllKhoaHocIndex("Username bị trống", req, res);
  web_function.signUp(req, res);
});

router.get('/logout', function (req, res, next) {
  req.session.destroy((err) => {
    if (err)
      console.log(err);
  });
  res.redirect('/');
});

router.get('/course', function (req, res, next) {
  query.getAllKhoaHocCourse(req, res);
});

/* GET users listing. */
router.get('/course-owned', function (req, res, next) {
  let sess = req.session;
  //console.log("Step 1");
  if (sess.user) {
    if (sess.type == 1)
      //query.getAllKhoaHocOwned(sess.user, null, req, res);
      query.getAllKhoaHocOwned(req, res);
    else
      query.getAllKhoaHocIndex("Bạn không thể xem khóa học đã sở hữu khi dùng tài khoản cho người soạn khóa học", req, res);
  }
  else {
    query.getAllKhoaHocIndex("Bạn chưa đăng nhập, không thể xem danh sách các khóa học đã mua", req, res);
  }
});

router.get('/detail', function (req, res, next) {
  let sess = req.session;
  if (sess.user) {
    //console.log(sess.type);
    if (sess.type == 1) {
      let IdKhoaHoc = req.query.idKH;
      query.daMuaKhoaHoc(IdKhoaHoc, req, res);
    }
    else {
      query.getAllKhoaHocIndex("Bạn không thể xem chi tiết khóa học khi dùng tài khoản cho người soạn khóa học. Hãy dùng tính năng sửa khóa học để xem", req, res);
    }
  }
  else {
    query.getAllKhoaHocIndex("Bạn chưa đăng nhập, không thể xem chi tiết thông tin khóa học", req, res);
  }
});

router.get('/lesson', function (req, res, next) {
  let sess = req.session;
  if (sess.user) {
    if (sess.type == 1) {
      let a = query.getAllBaiHocKhoaHoc(req.query.q);
      a.then((Items) => {
        Items.sort((a, b) => (a.SoTT > b.SoTT) ? 1 : ((b.SoTT > a.SoTT) ? -1 : 0));
        //console.log(Items);
        res.render('chitiet', { items: Items });
      });
    }
    else {
      query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
    }
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

router.get('/video', function (req, res, next) {
  let sess = req.session;
  if (sess.user) {
    if (sess.type == 1) {
      let a = query.getBaiHoc(req.query.idBH);
      a.then((Items) => {
        //console.log(Items);
        let inps = { bh: Items[0] };
        res.render('video', inps);
      });
    }
    else {
      query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
    }
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

router.post('/purchase', function (req, res, next) {
  let sess = req.session;
  if (sess.user) {
    if (sess.type == 1) {
      let genID = Math.floor(Math.random() * 999999999999998) + 1;
      //console.log(genID);
      //console.log(req.body.IdKhoaHoc);
      let a = crud.putHoaDon(req, genID);
      a.then((Items) => {
        //console.log(Items);
        let newMoney = req.session.balance - req.body.GiaTien;
        let b = crud.updateSoTien(req, newMoney);
        //console.log("ERS: " + newMoney)
        b.then((Result) => {
          res.redirect('/lesson?q=' + req.body.IdKhoaHoc);
        }).catch((err) => {
          //console.log(err);
        });
      }).catch((err) => {
        //console.log(err);
        res.redirect('/detail?idKH=' + req.body.IdKhoaHoc + '&error=invalidID');
      });
    }
    else {
      query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
    }
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

/* trang người bán khóa học */
router.get('/dangkhoahoc', function (req, res, next) {
  let sess = req.session;
  if (sess.user && sess.type == 2) {
    let a = query.getAllChuDe();
    a.then((lds) => {
      res.render('dangkhoahoc', { title: 'Express', uname: null, errorMsg: null, lChuDe: lds });
    });
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

router.get('/khoahocdadang', function (req, res, next) {
  let sess = req.session;
  if (sess.user && sess.type == 2) {
    let a = query.getAllKhoaHocUser(req.session.user);
    a.then((ls) => {
      res.render('khoahocdadang', { title: 'Express', uname: sess.user, errorMsg: null, ls: ls });
    });
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

router.post('/taokhoahoc', multipartyMiddleware, function (req, res, next) {
  let sess = req.session;
  //console.log(req.files);
  if (sess.user && sess.type == 2) {
    if (!req.body['tenbaihoc1'])
      res.redirect('/khoahocdadang');
    else {
      let a = crud.putCacBaiHoc(req, res);
      a.then((rer) => {
        crud.performSaveImage(req, res, rer[0].file, rer[0].fileName);
        for (let i = 1; i < rer.length; i++) {
          crud.performSaveVideo(req, res, rer[i].file, rer[i].fileName);
        }
        res.redirect('/khoahocdadang');
      })
    }
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

router.get('/xoakhoahoc', function (req, res, next) {
  let sess = req.session;
  if (sess.user && sess.type == 2) {
    if (sess.user != req.query.user) {
      query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
    }
    let a = query.getAllBaiHocKhoaHoc(req.query.idKH);
    a.then((ls) => {
      let promiseArray = [];
      ls.forEach((f) => {
        promiseArray.push(crud.goKhoaHoc(req, res, f.IdBaiHoc, f.IdKhoaHoc));
      })
      Promise.all(promiseArray).then(s => {

      })
      res.redirect('/khoahocdadang');
    });
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

router.get('/suakhoahoc', function (req, res, next) {
  let sess = req.session;
  if (sess.user && sess.type == 2) {
    if (sess.user != req.query.user) {
      query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
    }
    let a = query.getAllChuDe();
    let b = query.getAllBaiHocKhoaHoc(req.query.idKH)
    let object = {};
    a.then((lds) => {
      b.then((object) => {
        res.render('suakhoahoc', { title: 'Express', uname: null, errorMsg: null, lChuDe: lds, bh: object });
      });
    });
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

router.post('/capnhatkhoahoc', multipartyMiddleware, function (req, res, next) {
  let sess = req.session;
  if (sess.user && sess.type == 2) {
    let maxcount = 0;
    while (true) {
      if (req.body['tenbaihoc' + (maxcount+1).toString()]) {
        maxcount++;
      }
      else break;
    }
    if (maxcount == 0)
      res.redirect('/khoahocdadang');
    else {
      let a = query.getAllBaiHocKhoaHoc(Number(req.body.idKH));
      a.then((lst) => {
        
        let b = crud.updateCacBaiHoc(req, res, lst, maxcount);
        b.then((rer) => {
          let i = 1;
          if (rer.changeImage == true)
            crud.performSaveImage(req, res, rer.add[0].file, rer.add[0].fileName);
          else
            i = 0;
          for (; i < rer.add.length; i++) {
            crud.performSaveVideo(req, res, rer.add[i].file, rer.add[i].fileName);
          }
          for (let j = 0; j < rer.remove.length; j++) {
            crud.removeVideo(req, res, rer.remove[j]);
          }
          res.redirect('/khoahocdadang');
        });
      });
    }
  }
  else {
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
  }
});

router.get('/search', function(req, res, next) {
  query.getKhoaHocSearch(req, res);
});

router.get('/testupload', multipartyMiddleware, function (req, res, next) {
  if (req.query.token == '7F1648A574-497A88B5DF114')
    res.render('testfileupload');
  else
    query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
});

router.post('/test-imagereupload', multipartyMiddleware, function (req, res, next) {
  //console.log(req.files);
  //crud.PerformSaveImage(req, res, req.files.file, req.files.file.name);
  res.redirect('/');
});

module.exports = router;
