const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();

console.log('Start importing');

let allKhoaHoc = JSON.parse(fs.readFileSync(__dirname + '/khoahoc.json', 'utf-8'));

allKhoaHoc.forEach((khoahoc) => {
    let params = {
        TableName: "BaiHoc",
        Item: {
            "TenCD": khoahoc.TenCD,
            "TenKH": khoahoc.TenKH,
            "IdKhoaHoc": khoahoc.IdKhoaHoc,
            "GiaTien": khoahoc.GiaTien,
            "UsernameBKH": khoahoc.UsernameBKH,
            "IdBaiHoc": khoahoc.IdBaiHoc,
            "TenBH": khoahoc.TenBH,
            "Data": khoahoc.Data,
            "TomTat": khoahoc.TomTat
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
            "Id": user_bkh.Id,
            "DiaChi": user_bkh.DiaChi,
            "Ten": user_bkh.Ten
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