var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
var query = require('../db/query.js')
var crud = require('../db/data_crud.js')
var web_function = require('../db/web_function.js')
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'ASIAXM7JK7QTS5V66U2Z',
  secretAccessKey: 'lOUVG9/oFRJKW8GIxJhlOL0tRyhtxvdILkorK0Cm',
  sessionToken: 'FQoGZXIvYXdzEC0aDOs3ryEfI67YOSh1WCKFAqTZxKCxGPL+S+AFdoqCL18JK5UKN2bvW47eUVLEMPXapVq4mouUhYXFqqIt6/Jgwq1XnLS9mP3GG/SzaS4kZGtbSP5s43e+LHBBZaU1XBVRI90IPmWSjXQZ1u7ZV4TcwUhwupF1RNNnD9Z8CKiT4l4ZNC58+MMczo1eaPqZzyLyb/7zauWiQ7Sh5jm9q8o4HolkRdBUcBkrlmnnpBQPx4jZwv61wtS+zyddX41gJLvwEef3mE2Trm8FRr13ha5d+3jIMKmXkVP6BX/HwMf+cX+Kpk9oBDyr3BS6u85+Tvv2Bt/z/JxWuNiluSSgMXat/8Ju0UBdEEi4hHL+s/7djMWUkxorvSijtsTtBQ=='
});

let docClient = new AWS.DynamoDB.DocumentClient();

/* GET home page. */
router.get('/', function (req, res, next) {
  query.getAllKhoaHocIndex(9, null, req, res);
});

router.post('/signin', function (req, res, next) {
  if (req.body.pass.trim() === "")
    query.getAllKhoaHocIndex(9, "Password bị trống", req, res);
  else if (req.body.username.trim() === "")
    query.getAllKhoaHocIndex(9, "Username bị trống", req, res);
  web_function.signIn(req, res);
});

router.post('/signup', function (req, res, next) {
  if (req.body.Password.trim() === "")
    query.getAllKhoaHocIndex(9, "Password bị trống", req, res);
  else if (req.body.Email.trim() === "")
    query.getAllKhoaHocIndex(9, "Email bị trống", req, res);
  else if (req.body.Username.trim() === "")
    query.getAllKhoaHocIndex(9, "Username bị trống", req, res);
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
  query.getAllKhoaHocCourse(-1, req, res);
});

/* GET users listing. */
router.get('/course-owned', function (req, res, next) {
  let sess = req.session;
  //console.log("Step 1");
  if (sess.user) {
    if (sess.type == 1)
      query.getAllKhoaHocOwned(sess.user, null, req, res);
    else
      query.getAllKhoaHocIndex(9, "Bạn không thể xem khóa học đã sở hữu khi dùng tài khoản cho người soạn khóa học", req, res);
  }
  else {
    query.getAllKhoaHocIndex(9, "Bạn chưa đăng nhập, không thể xem danh sách các khóa học đã mua", req, res);
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
      query.getAllKhoaHocIndex(9, "Bạn không thể xem chi tiết khóa học khi dùng tài khoản cho người soạn khóa học. Hãy dùng tính năng sửa khóa học để xem", req, res);
    }
  }
  else {
    query.getAllKhoaHocIndex(9, "Bạn chưa đăng nhập, không thể xem chi tiết thông tin khóa học", req, res);
  }
});

router.get('/lesson', function (req, res, next) {
  let sess = req.session;
  if (sess.user) {
    if (sess.type == 1) {
      let a = query.getAllBaiHocKhoaHoc(req.query.q);
      a.then((Items) => {
        Items.sort((a, b) => (a.SoTT > b.SoTT) ? 1 : ((b.SoTT > a.SoTT) ? -1 : 0));
        console.log(Items);
        res.render('chitiet', { items: Items });
      });
    }
    else {
      query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
    }
  }
  else {
    query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
  }
});

router.get('/video', function (req, res, next) {
  let sess = req.session;
  if (sess.user) {
    if (sess.type == 1) {
      let a = query.getBaiHoc(req.query.idBH);
      a.then((Items) => {
        console.log(Items);
        let inps = { bh: Items[0] };
        res.render('video', inps);
      });
    }
    else {
      query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
    }
  }
  else {
    query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
  }
});

router.post('/purchase', function (req, res, next) {
  let sess = req.session;
  if (sess.user) {
    if (sess.type == 1) {
      let genID = Math.floor(Math.random() * 999999999999998) + 1;
      console.log(genID);
      console.log(req.body.IdKhoaHoc);
      let a = crud.putHoaDon(req, genID);
      a.then((Items) => {
        console.log(Items);
        let newMoney = req.session.balance - req.body.GiaTien;
        let b = crud.updateSoTien(req, newMoney);
        console.log("ERS: " + newMoney)
        b.then((Result) => {
          res.redirect('/lesson?q=' + req.body.IdKhoaHoc);
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
        res.redirect('/detail?idKH=' + req.body.IdKhoaHoc + '&error=invalidID');
      });
    }
    else {
      query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
    }
  }
  else {
    query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
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
    query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
  }
});

router.get('/khoahocdadang', function (req, res, next) {
  let sess = req.session;
  if (sess.user && sess.type == 2) {
    res.render('khoahocdadang', { title: 'Express', uname: null, errorMsg: null });
  }
  else {
    query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
  }
});

router.post('/taokhoahoc', multipartyMiddleware, function (req, res, next) {
  let sess = req.session;
  console.log(req.files);
  if (sess.user && sess.type == 2) {
    let a = crud.putCacBaiHoc(req, res);
    a.then((rer) => {
      crud.PerformSaveImage(req,res,rer[0].file, rer[0].fileName);
      for(let i = 1; i < rer.length; i++) {
        crud.PerformSaveVideo(req,res,rer[i].file, rer[i].fileName);
      }
      res.redirect('/khoahocdadang')
    })
  }
  else {
    query.getAllKhoaHocIndex(9, "Trang không tồn tại", req, res);
  }
});

module.exports = router;
