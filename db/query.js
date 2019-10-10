const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000'
});

let docClient = new AWS.DynamoDB.DocumentClient();
// Lấy ra tên các bài học của 1 khóa học
var params1 = {
    TableName: 'BaiHoc',
    IndexName: 'BaiHoc_KhoaHocIndex', // optional (if querying an index)
    KeyConditionExpression: '#ids = :v1', // a string representing a constraint on the attribute
    ProjectionExpression: "TenBH",
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        '#ids': 'IdKhoaHoc'
    },
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
      ':v1': 1
    },
    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
};
docClient.query(params1, function(err, data) {
    if(err) {
        console.log(JSON.stringify(err));
    }
    else {
        console.log(JSON.stringify(data.Items));
    }
});
// Lấy ra tên các khóa học của 1 user
var params2 = {
    TableName: 'BaiHoc',
    IndexName: 'BaiHoc_UsernameBKHIndex',
    KeyConditionExpression: '#user = :val', // a string representing a constraint on the attribute
    ProjectionExpression: "TenKH, IdKhoaHoc",
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        '#user': 'UsernameBKH'
    },
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
      ':val': 'pres0002'
    },
    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
    //Select: "ALL_PROJECTED_ATTRIBUTES",
};

docClient.query(params2, function(err, data) {
    if(err) {
        console.log(JSON.stringify(err));
    }
    else { 
        var clean = data.Items.filter((arr, index, self) =>
        index === self.findIndex((t) => (t.save === arr.save && t.State === arr.State)))
        console.log(JSON.stringify(clean));
    }
});

// Check đã có 1 UserBKH có tên username nào đó hay chưa
var params3 = {
    TableName: 'UserBKH',
    KeyConditionExpression: '#user = :val', // a string representing a constraint on the attribute
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        '#user': 'Username'
    },
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
      ':val': 'pres0001'
    },
    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
    Select: "COUNT",
};

docClient.query(params3, function(err, data) {
    if(err) {
        console.log(JSON.stringify(err));
    }
    else { 
    //    var clean = data.Items.filter((arr, index, self) =>
    //    index === self.findIndex((t) => (t.save === arr.save && t.State === arr.State)))
        console.log(JSON.stringify(data));
    }
});

// Check đã có 1 UserKH có tên username nào đó hay chưa
var params4 = {
    TableName: 'UserKH',
    KeyConditionExpression: '#user = :val', // a string representing a constraint on the attribute
    ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
        '#user': 'Username'
    },
    ExpressionAttributeValues: { // a map of substitutions for all attribute values
      ':val': 'user0001'
    },
    ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
    Select: "COUNT",
};

docClient.query(params4, function(err, data) {
    if(err) {
        console.log(JSON.stringify(err));
    }
    else { 
    //    var clean = data.Items.filter((arr, index, self) =>
    //    index === self.findIndex((t) => (t.save === arr.save && t.State === arr.State)))
        console.log(JSON.stringify(data));
    }
});

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