const AWS = require('aws-sdk');
const query = require('./query.js');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXM7JK7QTS5V66U2Z',
    secredtAccessKey: 'lOUVG9/oFRJKW8GIxJhlOL0tRyhtxvdILkorK0Cm',
    sessionToken: 'FQoGZXIvYXdzEC0aDOs3ryEfI67YOSh1WCKFAqTZxKCxGPL+S+AFdoqCL18JK5UKN2bvW47eUVLEMPXapVq4mouUhYXFqqIt6/Jgwq1XnLS9mP3GG/SzaS4kZGtbSP5s43e+LHBBZaU1XBVRI90IPmWSjXQZ1u7ZV4TcwUhwupF1RNNnD9Z8CKiT4l4ZNC58+MMczo1eaPqZzyLyb/7zauWiQ7Sh5jm9q8o4HolkRdBUcBkrlmnnpBQPx4jZwv61wtS+zyddX41gJLvwEef3mE2Trm8FRr13ha5d+3jIMKmXkVP6BX/HwMf+cX+Kpk9oBDyr3BS6u85+Tvv2Bt/z/JxWuNiluSSgMXat/8Ju0UBdEEi4hHL+s/7djMWUkxorvSijtsTtBQ=='
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
