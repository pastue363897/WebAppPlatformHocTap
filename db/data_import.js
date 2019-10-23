const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXM7JK7QT4KJENYRH',
    secretAccessKey: 'Z0AQpCrDpyWQvXOY7gp3RVbqEcTeDaquyBKE8KHM',
    sessionToken: 'FQoGZXIvYXdzECEaDPLk2DU7/5irkSFiWiKFAt1LHDtTCO9U1QevauUlM6k/MBp2XcGoFaNh2RNyV3Q3yxCv83ZTZPb1NbZRI1x4m6W25daC1eFDoIZnvEBl3iOXqmZ1FoARXIxUXC9zJyfgpxYkmzBIjza4SIAV4C6t9NND3uxZ0GDvySnp+pKwLag+VTT86kJ5foBx2OGba/Q1T8u/79L0edTdUsPijzIx7rahXcXk+QMf+icuw/8cd8L1oFh/jogN5vX1sY8Ac0NVsDYCeXZ4KiiwJU+9RuPtSdbr/5WWOdKdcqI1+FB8AhJ9+YD+M0jdLPfJFNlcrB+jQ9jlCxbIVwn/j0u1GziT04Z89jBfdPbm8XZ6F+a02hbKI67xMSi95cHtBQ=='
});

let docClient = new AWS.DynamoDB.DocumentClient();

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
            "GiaTien": hoadon.GiaTien,
            "TenChuDe": hoadon.TenChuDe,
            "TenKH": hoadon.TenKH,
            "MoTaKH": hoadon.MoTaKH,
            "UsernameBKH": hoadon.UsernameBKH
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