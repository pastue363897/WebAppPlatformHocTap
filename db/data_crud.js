const AWS = require('aws-sdk');
const dateFormat = require('dateformat');

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();

function putHoaDon(req, IdHoaDon) {
    return new Promise((resolve, reject) => {
        console.log("PUTHD: "+req.body.IdKhoaHoc);
        let d = new Date();
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'HoaDon',
            Item: {
                "IdHoaDon": Number(IdHoaDon),
                "UsernameKH": req.session.user,
                "IdKhoaHoc": Number(req.body.IdKhoaHoc),
                "TenChuDe": req.body.TenChuDe,
                "TenKH": req.body.TenKH,
                "MoTaKH": req.body.MoTaKH,
                "UsernameBKH": req.body.UsernameBKH,
                "NgayMua": dateFormat(d, "isoDate"),
                "GiaTien": Number(req.body.GiaTien)
            },
            ConditionExpression: 'attribute_not_exists(IdHoaDon)',
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        docClient.put(params1, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                console.log(JSON.stringify(data.Items));
                resolve(data.Items);
            }
        });
    });
}

function updateSoTien(req, newValue) {
    return new Promise((resolve, reject) => {
        console.log("UPDATESOTIEN: "+req.session.user);
        let d = new Date();
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'UserKH',
            Key: { // The primary key of the item (a map of attribute name to AttributeValue)
                Username: req.session.user,
                Email: req.session.email
            },
            UpdateExpression: 'SET SoTien = :value',
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
                ':value': Number(newValue)
            },
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        docClient.update(params1, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                console.log(JSON.stringify(data.Items));
                resolve(data.Items);
            }
        });
    });
}

module.exports = {
    putHoaDon: putHoaDon,
    updateSoTien: updateSoTien
};