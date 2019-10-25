var aws = require('../aws_header.js');

let docClient = new aws.AWS.DynamoDB.DocumentClient();

var scanObjectsOM = [];

function getAllBaiHocKhoaHoc(idKH) {
    return new Promise((resolve, reject) => {
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'BaiHoc',
            IndexName: 'BaiHoc_KhoaHocIndex', // optional (if querying an index)
            KeyConditionExpression: '#ids = :v1', // a string representing a constraint on the attribute
            ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
                '#ids': 'IdKhoaHoc'
            },
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':v1': Number(idKH)
            },
            ScanIndexForward: false,
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        docClient.query(params1, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                //console.log(JSON.stringify(data.Items));
                //return data.Items;
                
                resolve(data.Items.sort((a, b) => (a.SoTT > b.SoTT) ? 1 : ((b.SoTT > a.SoTT) ? -1 : 0)));
            }
        });
    });
}

function getBaiHoc(idBH) {
    return new Promise((resolve, reject) => {
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'BaiHoc',
            KeyConditionExpression: '#ids = :v1',
            ExpressionAttributeNames: {
                '#ids': 'IdBaiHoc'
            },
            ExpressionAttributeValues: {
                ':v1': Number(idBH)
            },
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        docClient.query(params1, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                //console.log(JSON.stringify(data.Items));
                //return data.Items;
                resolve(data.Items);
            }
        });
    });
}

function getHoaDon(idHoaDon) {
    return new Promise((resolve, reject) => {
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'HoaDon',
            KeyConditionExpression: '#ids = :v1',
            ExpressionAttributeNames: {
                '#ids': 'IdHoaDon'
            },
            ExpressionAttributeValues: {
                ':v1': Number(idHoaDon)
            },
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        docClient.query(params1, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                //console.log(JSON.stringify(data.Items));
                //return data.Items;
                resolve(data.Items);
            }
        });
    });
}

function getKhoaHocByIdKhoaHoc(item) {
    return new Promise((resolve, reject) => {
        var params2 = {
            TableName: 'BaiHoc',
            IndexName: 'BaiHoc_KhoaHocIndex',
            KeyConditionExpression: 'IdKhoaHoc = :va',
            ExpressionAttributeValues: {
                ':va': item.IdKhoaHoc,
                ':va2': 1
            },
            FilterExpression: 'SoTT = :va2'

        };
        docClient.query(params2, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                //console.log(JSON.stringify(data.Items[0]));
                resolve(data.Items[0]);
            }
        });
    });
}

function getHoaDonIdKhoaHocByUsername(UsernameKH) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'HoaDon',
            ExpressionAttributeNames: {
                '#uc': 'UsernameKH'
            },
            ExpressionAttributeValues: {
                ':ucvalue': UsernameKH
            },
            ProjectionExpression: 'IdKhoaHoc',
            FilterExpression: '#uc = :ucvalue',
            ReturnConsumedCapacity: 'TOTAL',
        };
        docClient.scan(params, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                resolve(data.Items);
            }
        });
    });
}

async function getAllKhoaHocOwned(req, res) {
    let array = await getHoaDonIdKhoaHocByUsername(req.session.user);

    let promiseArray = array.map(getKhoaHocByIdKhoaHoc);

    Promise.all(promiseArray).then(result => {
        let sess = req.session;
        let vls = { khs: result, uname: sess.user, owned: true, balance: sess.balance, errorMsg: null, type: 1 };
        res.render('course.ejs', vls);
    });
}

//getAllBaiHocKhoaHoc(1);
// Lấy ra tên các khóa học của 1 user
function getAllKhoaHocUser(username) {
    return new Promise((resolve, reject) => {
        var params2 = {
            TableName: 'BaiHoc',
            IndexName: 'BaiHoc_UsernameBKHIndex',
            KeyConditionExpression: '#user = :val', // a string representing a constraint on the attribute
            ProjectionExpression: "TenKH, IdKhoaHoc, Thumbnail, DangBan",
            ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
                '#user': 'UsernameBKH',
                '#stt': 'SoTT'
            },
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':val': username,
                ':bhs': 1
            },
            FilterExpression: '#stt = :bhs',
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
            //Select: "ALL_PROJECTED_ATTRIBUTES",
        };

        docClient.query(params2, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject(err);
            }
            else {
                resolve(data.Items);
            }
        });
    });
}

//checkUserKHExist('user0002');
// Để create một khóa học
/*
    Create tất cả các item vào bảng BaiHoc (các item này đã chứa dữ liệu của KhoaHoc)
*/

// Để update một khóa học
/*
    Update các thuộc tính của khóa học trong tất cả item của bài học
*/

// Để create một user thì putItem bình thường
// Để thống kê 1 khóa học
/*
    Bước 1: Scan các hóa đơn có SortKey IdKhoaHoc truyền vào
    Bước 2: Duyệt trên kết quả tính tổng tiền mà KhoaHoc đó làm được, đồng thời số lượng các hóa đơn
     cũng là số người mua.
*/

// Để thóng kê chung các khóa học
/*
    Gọi thống kê từng khóa học đẩy vào mảng nội bộ trong NodeJS.
    Gọi thống tất cả các khóa học User đó có (Danh sách khóa học query 2), đẩy vào mạng.
    Duyệt trên mảng nội bộ đó xuất ra các thông tin chung
*/

// Để người user xem khóa học đã mua
/*
    Chỉ có thể là user đó chọn từ 1 danh sách, danh sách này chỉ đơn giản là scan các HoaDon
    có UsernameKH = user đó
    Lấy Id khóa học đó gọi query 1 sẽ ra 1 danh sách bài học. Từ đây lấy link data của bài học
*/

// Để người user mua khóa học
/*
    Gọi scan các HoaDon có UsernameKH = user đó VÀ IdKhoaHoc = Id đó, nếu kết quả = 0 là chưa
    mua. Khi đó đã bik là chưa mua thì route và trang mua.
    Mua rồi thì create vào HoaDon 
*/

// Lấy tất cả chủ đề khóa học: Scan bảng ChuDe
// Lấy thông tin khóa học theo chủ đề: Query trên index BaiHoc_ChuDeIndex với ChuDe = ?
// Lấy thông tin tất cả các khóa học: Scan trên index BaiHoc_KhoaHocIndex
// 
// Get all khoá học
function internalGetAllKhoaHoc() {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'BaiHoc',
            ExpressionAttributeNames: {
                '#stt': 'SoTT',
            },
            ExpressionAttributeValues: {
                ':bhs': Number(1),
            },
            FilterExpression: '#stt = :bhs ',
            ProjectionExpression: "TenChuDe, TenKH, MoTaKH, IdKhoaHoc, GiaTien, UsernameBKH",
            ReturnConsumedCapacity: 'TOTAL',
        };
        docClient.scan(params, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                //console.log(JSON.stringify(data));
                resolve(data.Items);
            }
        });
    });
}

let getAllKhoaHocIndex = async function (errorMsg, req, res) {
    let rst = await internalGetAllKhoaHoc();
    //console.log(rst);
    Promise.all(rst).then(result => {
        let sess = req.session;
        let f = result.length;
        if (f > 9)
            f = 9;
        let vls = { khs: result.slice(0,9), uname: null, balance: null, owned: null, errorMsg: null, type: 0 };
        //console.log(req.session);
        vls.errorMsg = errorMsg;
        if (sess.user) {
            //console.log("Yes");
            vls.uname = sess.user;
            vls.balance = sess.balance
            vls.type = sess.type;
            res.render('index.ejs', vls);
        }
        else {
            //console.log("No");
            res.render('index.ejs', vls);
        }
    });
}

let getAllKhoaHocCourse = async function (req, res) {
    let rst = await internalGetAllKhoaHoc();

    Promise.all(rst).then(result => {
        let sess = req.session;
        let vls = { khs: result, uname: null, balance: null, owned: false, errorMsg: null, type: 0 };
        if (sess.user) {
            //console.log("Yes");
            vls.uname = sess.user;
            vls.balance = sess.balance;
            vls.type = sess.type;
            res.render('course.ejs', vls);
        }
        else {
            //console.log("No");
            res.render('course.ejs', vls);
        }
    });
}

function isDaMuaKhoaHoc(IdKhoaHoc, req) {
    return new Promise((resolve, reject) => {
        //console.log(IdKhoaHoc);
        var params = {
            TableName: 'HoaDon',
            IndexName: 'HoaDon_UsernameKHIndex', // optional (if querying an index)
            KeyConditionExpression: 'UsernameKH = :value AND IdKhoaHoc = :ids', // a string representing a constraint on the attribute
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':value': req.session.user,
                ':ids': Number(IdKhoaHoc),
            }
        };
        docClient.query(params, function (err, data) {
            if (err) {
                console.error(JSON.stringify(err));
                resolve(null);
            }
            else {
                //console.log(data.Items.length);
                resolve(data.Items.length);
            }
        });
    });
}

let daMuaKhoaHoc = async function (IdKhoaHoc, req, res) {
    //console.log("OK Step 1")
    var pm = isDaMuaKhoaHoc(IdKhoaHoc, req);
    pm.then((data) => {
        if (data == 0) {
            let a = getAllBaiHocKhoaHoc(IdKhoaHoc);
            a.then((Items) => {
                //console.log(req.session.balance);
                //console.log(Number(req.session.balance));
                let input = { uname: req.session.user, items: Items, balance: Number(req.session.balance), errorMsg: null };
                if (req.query.error == "invalidID") {
                    input.errorMsg = "Có lỗi xảy ra khi thanh toán, vui lòng thử lại."
                }
                res.render('pay.ejs', input);
            });
        }
        else {
            res.redirect('/lesson?q=' + IdKhoaHoc);
        }
    });
};

function getAllChuDe() {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'ChuDe'
        };
        docClient.scan(params, function (err, data) {
            if (err) {
                console.error(JSON.stringify(err));
                reject("NO");
            }
            else {
                //console.log(data.Items);
                resolve(data.Items);
            }
        });
    });
}

function findKhoaHocKeyword(keyword) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: 'BaiHoc',
            ExpressionAttributeNames: {
                '#stt': 'SoTT',
                '#tenkh': 'TenKH',
                '#mota': 'MoTa',
            },
            ExpressionAttributeValues: {
                ':bhs': Number(1),
                ':value': keyword,
                ':value2': keyword
            },
            FilterExpression: '#stt = :bhs and (contains(#tenkh, :value) or contains(#mota, :value2))',
            ProjectionExpression: "TenChuDe, TenKH, MoTaKH, IdKhoaHoc, GiaTien, UsernameBKH",
            ReturnConsumedCapacity: 'TOTAL',
        };
        docClient.scan(params, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                //console.log(JSON.stringify(data));
                resolve(data.Items);
            }
        });
    });
}

let getKhoaHocSearch = async function (req, res) {
    let rst = await findKhoaHocKeyword(req.query.q);
    Promise.all(rst).then(result => {
        let sess = req.session;
        let vls = { khs: result, uname: null, balance: null, owned: false, errorMsg: null, type: 0 };
        if (sess.user) {
            //console.log("Yes");
            vls.uname = sess.user;
            vls.balance = sess.balance;
            vls.type = sess.type;
            res.render('course-search.ejs', vls);
        }
        else {
            //console.log("No");
            res.render('course-search.ejs', vls);
        }
    });
}

module.exports = {
    getAllBaiHocKhoaHoc: getAllBaiHocKhoaHoc,
    getAllKhoaHocUser: getAllKhoaHocUser,
    getAllKhoaHocCourse: getAllKhoaHocCourse,
    getAllKhoaHocIndex: getAllKhoaHocIndex,
    getAllKhoaHocOwned: getAllKhoaHocOwned,
    isDaMuaKhoaHoc: isDaMuaKhoaHoc,
    daMuaKhoaHoc: daMuaKhoaHoc,
    getBaiHoc: getBaiHoc,
    getHoaDon: getHoaDon,
    getAllChuDe: getAllChuDe,
    getKhoaHocSearch: getKhoaHocSearch
}
