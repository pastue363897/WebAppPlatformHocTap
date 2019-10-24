var aws = require('../aws_header.js');
const query = require('./query.js');

let docClient = new aws.AWS.DynamoDB.DocumentClient();

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
