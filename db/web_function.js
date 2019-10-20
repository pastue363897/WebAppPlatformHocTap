const AWS = require('aws-sdk');

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();

function signIn(req, res) {
    var params4 = {
        TableName: 'UserKH',
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
            //console.log(JSON.stringify(data));
            if (data.Items.length != 0) {
                let us = data.Items[0];
                if (req.body.pass == us.Pass) {
                    req.session.user = us.Username;
                    req.session.email = us.Email;
                    req.session.type = 1;
                    req.session.balance = us.SoTien;
                    //console.log("Success");
                    res.redirect('/');
                }
                else {
                    //console.log("Fail");
                    res.redirect('/');
                }
            }
        }
    });
}

module.exports = {
    //getAllBaiHocKhoaHoc: getAllBaiHocKhoaHoc,
    signIn: signIn
}