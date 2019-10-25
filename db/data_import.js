var aws = require('../aws_header.js');
const fs = require('fs');

let docClient = new aws.AWS.DynamoDB.DocumentClient();

console.log('Start importing');

let allKhoaHoc = JSON.parse(fs.readFileSync(__dirname + '/khoahoc.json', 'utf-8'));

allKhoaHoc.forEach((khoahoc) => {
    let params = {
        TableName: "BaiHoc",
        Item: {
            "TenChuDe": khoahoc.TenChuDe,
            "SoTT": khoahoc.SoTT,
            "DoDai": khoahoc.DoDai,
            "MoTaKH": khoahoc.MoTaKH,
            "TenKH": khoahoc.TenKH,
            "IdKhoaHoc": khoahoc.IdKhoaHoc,
            "GiaTien": khoahoc.GiaTien,
            "UsernameBKH": khoahoc.UsernameBKH,
            "IdBaiHoc": khoahoc.IdBaiHoc,
            "TenBH": khoahoc.TenBH,
            "Data": khoahoc.Data,
            "TomTat": khoahoc.TomTat,
            "Thumbnail": khoahoc.Thumbnail,
            "DangBan": khoahoc.DangBan
        }
    };
    docClient.put(params, (err, data) => {
        if (err) {
            console.error(`Unable to add KH ${khoahoc.TenBH}, ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`KH created ${khoahoc.TenBH}`);
        }
    });
});

let allUserBKH = JSON.parse(fs.readFileSync(__dirname + '/user_bkh.json', 'utf-8'));

allUserBKH.forEach((user_bkh) => {
    let params = {
        TableName: "UserBKH",
        Item: {
            "Username": user_bkh.Username,
            "Pass": user_bkh.Pass,
            "DiaChi": user_bkh.DiaChi,
            "Ten": user_bkh.Ten,
            "Email": user_bkh.Email,
            "SoTien": user_bkh.SoTien
        }
    };
    docClient.put(params, (err, data) => {
        if (err) {
            console.error(`Unable to add user ${user_bkh.Username}, ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`User created ${user_bkh.Username}`);
        }
    });
});

let allUserKH = JSON.parse(fs.readFileSync(__dirname + '/user_kh.json', 'utf-8'));

allUserKH.forEach((user_bkh) => {
    let params = {
        TableName: "UserKH",
        Item: {
            "Username": user_bkh.Username,
            "Pass": user_bkh.Pass,
            "DiaChi": user_bkh.DiaChi,
            "Ten": user_bkh.Ten,
            "Email": user_bkh.Email,
            "SoTien": user_bkh.SoTien
        }
    };
    docClient.put(params, (err, data) => {
        if (err) {
            console.error(`Unable to add user ${user_bkh.Username}, ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`User created ${user_bkh.Username}`);
        }
    });
});

let allHoaDon = JSON.parse(fs.readFileSync(__dirname + '/hoadon.json', 'utf-8'));

allHoaDon.forEach((hoadon) => {
    let params = {
        TableName: "HoaDon",
        Item: {
            "IdHoaDon":hoadon.IdHoaDon,
            "UsernameKH":hoadon.UsernameKH,
            "IdKhoaHoc":hoadon.IdKhoaHoc,
            "NgayMua": hoadon.NgayMua,
            "GiaTien": hoadon.GiaTiendata
        }
    };
    docClient.put(params, (err, data) => {
        if (err) {
            console.error(`Unable to add receipt ${hoadon.Username}, ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`Receipt created ${hoadon.Username}`);
        }
    });
});

let allChuDe = JSON.parse(fs.readFileSync(__dirname + '/chude.json', 'utf-8'));

allChuDe.forEach((chude) => {
    let params = {
        TableName: "ChuDe",
        Item: {
            "Id": chude.Id,
            "TenChuDe": chude.TenChuDe
        }
    };
    docClient.put(params, (err, data) => {
        if (err) {
            console.error(`Unable to add topic ${chude.TenChuDe}, ${JSON.stringify(err, null, 2)}`);
        } else {
            console.log(`Topic created ${chude.TenChuDe}`);
        }
    });
});