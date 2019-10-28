const express = require('express');
const router = express.Router();
const query = require('../db/query.js')
const crud = require('../db/data_crud.js')
const web_function = require('../db/web_function.js')
const multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();
const dateFormat = require('dateformat');

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
            query.getAllKhoaHocIndex("Bạn không thể xem khóa học đã sở hữu "
                + "khi dùng tài khoản cho người soạn khóa học", req, res);
    }
    else {
        query.getAllKhoaHocIndex("Bạn chưa đăng nhập, không thể xem danh sách "
            + "các khóa học đã mua", req, res);
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
            query.getAllKhoaHocIndex("Bạn không thể xem chi tiết khóa học khi dùng tài khoản cho "
                + "người soạn khóa học. Hãy dùng tính năng sửa khóa học để xem", req, res);
        }
    }
    else {
        query.getAllKhoaHocIndex("Bạn chưa đăng nhập, không thể xem chi tiết "
            + "thông tin khóa học", req, res);
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
            let a = crud.putHoaDon(req, genID);
            a.then((Items) => {
                let b = crud.updateSoTien(req, Number(req.body.GiaTien));
                let c = crud.updateSoTien2(req, Number(req.body.GiaTien));
                Promise.all([b,c]).then((Result) => {
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
            res.render('dangkhoahoc',
                { title: 'Express', uname: null, errorMsg: null, lChuDe: lds });
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
            res.render('khoahocdadang',
                { title: 'Express', uname: sess.user, errorMsg: null, ls: ls });
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
        Promise.all([a,b]).then((val) => {
                res.render('suakhoahoc',
                    { title: 'Express', uname: null, errorMsg: null, lChuDe: val[0], bh: val[1] });
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
            if (req.body['tenbaihoc' + (maxcount + 1).toString()]) {
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

router.get('/search', function (req, res, next) {
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

router.get('/about', function (req, res, next) {
    let sess = req.session;
    let vls = { uname: null, balance: null, owned: null, errorMsg: null, type: 0 };
    if (sess.user) {
        vls.uname = sess.user;
        vls.balance = sess.balance
        vls.type = sess.type;
        res.render('about', vls);
    }
    else {
        //console.log("No");
        res.render('about', vls);
    }
});

router.get('/admin', function (req, res, next) {
    res.redirect('admin-login');
});

router.get('/admin-indexadmin', function (req, res, next) {
    console.log(req.session.adminauthor);
    if (req.session.adminauthor == 'passport-admin-9AX5Q48V3') {
        let valuesets = {
            tongDoanhThu: 0,
            tongDoanhThu30Ngay: 0,
            tongThuVe30: 0,
            soHoaDon: 0,
            soHoaDon30Ngay: 0,
            soLuongUserBKH: 0,
            soLuongUserKH: 0,
            soKhoaHoc: 0,
            soKhoaHocBiGo: 0,
        }
        let oldday = new Date();
        oldday.setTime(oldday - 30*24*60*60*1000);
        let prms = [];
        prms[0] = query.getAllHoaDon(true);
        prms[1] = query.countAllUserBKH();
        prms[2] = query.countAllUserKH();
        prms[3] = query.getAllKhoaHoc();
        prms[4] = query.getAllHoaDonRecent(dateFormat(oldday, "isoDate"), true);
        Promise.all(prms).then((values) => {
            console.log(values);
            let q1 = values[0];
            for (var i = 0; i < q1.length; i++) {
                valuesets.tongDoanhThu += q1[i].GiaTien;
            }
            valuesets.soHoaDon = q1.length;
            let q2 = values[1], q3 = values[2], q4 = values[3], q5 = values[4];
            valuesets.soLuongUserBKH = q2['Count'];
            valuesets.soLuongUserKH = q3['Count'];
            valuesets.soKhoaHoc = q4.length;
            for (var i = 0; i < q4.length; i++) {
                valuesets.soKhoaHocBiGo += (q4[i].DangBan == 0) ? 1 : 0;
            }
            for (var i = 0; i < q5.length; i++) {
                valuesets.tongDoanhThu30Ngay += q5[i].GiaTien;
            }
            valuesets.soHoaDon30Ngay = q5.length;
            res.render('admin/indexadmin.ejs', { title: 'Express', valuesets: valuesets });
        }) 
    }
    else
        query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
});

router.get('/admin-login', function (req, res, next) {
    if (req.session.adminauthor != 'passport-admin-9AX5Q48V3') {
        res.render('admin/login.ejs', { title: 'Express' });
    }
    else
        res.redirect('admin-indexadmin');
});

router.post('/admin-loginquery', function (req, res, next) {
    if (req.session.adminauthor != 'passport-admin-9AX5Q48V3') {
        let a = query.findAdminPasscode();
        a.then((value) => {
            if (req.body.inputPassword == value[0].SettingValue) {
                req.session.adminauthor = "passport-admin-9AX5Q48V3";
                res.redirect('admin-indexadmin');
            }
            else {
                res.redirect('/admin-login');
            }
        });
    }
    else
        res.redirect('admin-indexadmin');
});

router.get('/admin-logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err)
            console.log(err);
    });
    res.redirect('/admin');
});

router.get('/admin-chude', function (req, res, next) {
    if (req.session.adminauthor == 'passport-admin-9AX5Q48V3') {
        let a = query.getAllChuDe();
        a.then((rps) => {
            res.render('admin/chude', { title: 'Express', lst: rps, errorMsg: null });
        })
    }
    else
        query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
});

router.post('/admin-themchude', function (req, res, next) {
    if (req.session.adminauthor == 'passport-admin-9AX5Q48V3') {
        let a = crud.themChuDe(req);
        a.then((rps) => {
            res.redirect('/admin-chude');
        }).catch((error) => {
            let a = query.getAllChuDe();
            a.then((rps) => {
                res.render('admin/chude', { title: 'Express', lst: rps, errorMsg: error });
            });
        });
    }
    else
        query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
});

router.post('/admin-xoachude', function (req, res, next) {
    if (req.session.adminauthor == 'passport-admin-9AX5Q48V3') {
        let a = query.countKhoaHocByChuDe(req.body.tenChuDe);
        a.then((value) => {
            if (value.Count == 0) {
                let b = crud.xoaChuDe(req);
                b.then((rps) => {
                    res.redirect('/admin-chude');
                });
            }
            else {
                let a = query.getAllChuDe();
                a.then((rps) => {
                    res.render('admin/chude', {
                        title: 'Express', lst: rps,
                        errorMsg: "Chủ đề đã có khóa học dùng"
                    });
                });
            }
        });
    }
    else
        query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
});

router.get('/thongkekhoahoc', function (req, res, next) {
    let sess = req.session;
    if (sess.user && sess.type == 2) {
        let valuesets = {
            tongDoanhThu: 0,
            tongDoanhThu30Ngay: 0,
            soHoaDon: 0,
            soHoaDon30Ngay: 0,
            soKhoaHoc: 0,
            soKhoaHocBiGo: 0,
            soUserKH: 0,
        }
        let prms = [];
        let oldday = new Date();
        oldday.setTime(oldday - 30*24*60*60*1000);
        prms.push(query.getHoaDonByUsernameBKH(req.session.user));
        prms.push(query.getAllKhoaHocUser(req.session.user));
        prms.push(query.getHoaDonByUsernameBKHRecent(dateFormat(oldday, "isoDate"),req.session.user));
        Promise.all(prms).then((values) => {
            let uniqueBuyers = new Set();
            let q1 = values[0], q2 = values[1], q3 = values[2];
            for(var i = 0; i < q1.length; i++) {
                valuesets.tongDoanhThu += q1[i].GiaTien;
                uniqueBuyers.add(q1[i].UsernameKH);
            }
            valuesets.soUserKH = uniqueBuyers.size;
            valuesets.soHoaDon = q1.length;
            valuesets.soKhoaHoc = q2.length;
            valuesets.soKhoaHocBiGo = q2.length;
            for(var i = 0; i < q2.length; i++) {
                valuesets.soKhoaHocBiGo -= q2[i].DangBan;
            }
            for(var i = 0; i < q3.length; i++) {
                valuesets.tongDoanhThu30Ngay += q3[i].GiaTien;
            }
            valuesets.soHoaDon30Ngay = q3.length;
            let inps = {title: 'Express', uname: sess.user, errorMsg: null, valuesets: valuesets, listKhoaHoc: null};
            if(req.query.detail == 'yes') {
                let listKhoaHoc = new Map();
                for(var i = 0; i < q2.length; i++) {
                    listKhoaHoc.set(q2[i].IdKhoaHoc,{TenKH: q2[i].TenKH, count: 0, tong: 0});
                }
                for(var i = 0; i < q1.length; i++) {
                    let b = listKhoaHoc.get(q1[i].IdKhoaHoc);
                    if(b != undefined) {
                        b.count++;
                        b.tong += q1[i].GiaTien;
                        listKhoaHoc.set(q1[i].IdKhoaHoc, b);
                    }
                }
                inps.listKhoaHoc = listKhoaHoc;
            }
            res.render('thongkekhoahoc', inps);
        });
        
    }
    else {
        query.getAllKhoaHocIndex("Trang không tồn tại", req, res);
    }
});

module.exports = router;
