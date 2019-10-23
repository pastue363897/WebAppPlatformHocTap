const AWS = require('aws-sdk');
const query = require('./query.js');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXM7JK7QT4KJENYRH',
    secretAccessKey: 'Z0AQpCrDpyWQvXOY7gp3RVbqEcTeDaquyBKE8KHM',
    sessionToken: 'FQoGZXIvYXdzECEaDPLk2DU7/5irkSFiWiKFAt1LHDtTCO9U1QevauUlM6k/MBp2XcGoFaNh2RNyV3Q3yxCv83ZTZPb1NbZRI1x4m6W25daC1eFDoIZnvEBl3iOXqmZ1FoARXIxUXC9zJyfgpxYkmzBIjza4SIAV4C6t9NND3uxZ0GDvySnp+pKwLag+VTT86kJ5foBx2OGba/Q1T8u/79L0edTdUsPijzIx7rahXcXk+QMf+icuw/8cd8L1oFh/jogN5vX1sY8Ac0NVsDYCeXZ4KiiwJU+9RuPtSdbr/5WWOdKdcqI1+FB8AhJ9+YD+M0jdLPfJFNlcrB+jQ9jlCxbIVwn/j0u1GziT04Z89jBfdPbm8XZ6F+a02hbKI67xMSi95cHtBQ=='
});

let docClient = new AWS.DynamoDB.DocumentClient();

function signIn(req, res) {
    let s = "";
    if(req.body.loai === "hoc") {
        s = "UserKH"
    }
    else if(req.body.loai === "ban") {
        s = "UserBKH"
    }
    var params4 = {
        TableName: s,
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
            if (data.Items.length != 0) {
                let us = data.Items[0];
                if (req.body.pass == us.Pass) {
                    req.session.user = us.Username;
                    req.session.email = us.Email;
                    req.session.balance = us.SoTien;
                    if(req.body.loai === "hoc") {
                        req.session.type = 1;
                    }
                    else if(req.body.loai === "ban") {
                        req.session.type = 2;
                    }
                    //console.log("Success");
                    query.getAllKhoaHocIndex(9, null, req, res);
                }
                else {
                    //console.log("Fail");
                    query.getAllKhoaHocIndex(9, "Username hoặc password không đúng", req, res);
                }
            }
            else {
                query.getAllKhoaHocIndex(9, "Username hoặc password không đúng", req, res);
            }
        }
    });
}

function signUp(req, res) {
    let s = "";
    let fixedMoney = 0;
    if(req.body.loai === "hoc") {
        s = "UserKH";
        fixedMoney = 200000;
    }
    else if(req.body.loai === "ban") {
        s = "UserBKH";
        fixedMoney = 1500000;
    }
    var params4 = {
        TableName: s,
        Item: {
            "Username": req.body.Username,
            "Pass": req.body.Password,
            "DiaChi": req.body.DiaChi,
            "Ten": req.body.Ten,
            "Email": req.body.Email,
            "SoTien": fixedMoney
        },
        ConditionExpression: 'attribute_not_exists(Username)',
        ReturnConsumedCapacity: 'NONE',
    };

    docClient.put(params4, function (err, data) {
        if (err) {
            console.log(JSON.stringify(err));
            query.getAllKhoaHocIndex(9, "Username đã tồn tại", req, res);
        }
        else {
            console.log(JSON.stringify(data));
            req.session.user = req.body.Username;
            req.session.email = req.body.Email;
            req.session.balance = fixedMoney;
            if(req.body.loai === "hoc") {
                req.session.type = 1;
            }
            else if(req.body.loai === "ban") {
                req.session.type = 2;
            }
            query.getAllKhoaHocIndex(9, null, req, res);
        }
    });
}

module.exports = {
    //getAllBaiHocKhoaHoc: getAllBaiHocKhoaHoc,
    signIn: signIn,
    signUp: signUp
}