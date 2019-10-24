const AWS = require('aws-sdk');
const dateFormat = require('dateformat');
var multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();
var fs = require('fs');
var zlib = require('zlib');
var bodyParser = require('body-parser');

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXM7JK7QTS5V66U2Z',
    secretAccessKey: 'lOUVG9/oFRJKW8GIxJhlOL0tRyhtxvdILkorK0Cm',
    sessionToken: 'FQoGZXIvYXdzEC0aDOs3ryEfI67YOSh1WCKFAqTZxKCxGPL+S+AFdoqCL18JK5UKN2bvW47eUVLEMPXapVq4mouUhYXFqqIt6/Jgwq1XnLS9mP3GG/SzaS4kZGtbSP5s43e+LHBBZaU1XBVRI90IPmWSjXQZ1u7ZV4TcwUhwupF1RNNnD9Z8CKiT4l4ZNC58+MMczo1eaPqZzyLyb/7zauWiQ7Sh5jm9q8o4HolkRdBUcBkrlmnnpBQPx4jZwv61wtS+zyddX41gJLvwEef3mE2Trm8FRr13ha5d+3jIMKmXkVP6BX/HwMf+cX+Kpk9oBDyr3BS6u85+Tvv2Bt/z/JxWuNiluSSgMXat/8Ju0UBdEEi4hHL+s/7djMWUkxorvSijtsTtBQ=='
});

let docClient = new AWS.DynamoDB.DocumentClient();

function putHoaDon(req, IdHoaDon) {
    return new Promise((resolve, reject) => {
        console.log("PUTHD: " + req.body.IdKhoaHoc);
        let d = new Date();
        console.log("1: " + Number(req.body.IdKhoaHoc));
        console.log("2: " + req.body.TenChuDe)
        console.log("3: " + req.body.TenChuDe)
        console.log("4: " + req.body.TenKH)
        console.log("5: " + req.body.MoTaKH)
        console.log("6: " + req.body.UsernameBKH)
        console.log("7: " + Number(req.body.GiaTien))
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
        console.log("UPDATESOTIEN: " + req.session.user);
        console.log("ERS: " + newValue)
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
                req.session.balance = newValue;
                console.log(JSON.stringify(data.Items));
                resolve(data.Items);
            }
        });
    });
}

function putCacBaiHoc(req, res) {
    return new Promise((resolve, reject) => {
        let hDefBaiHoc = "tenbaihoc";
        let hDefMota = "mota";
        let hDefFile = "file";
        let maxcount = 1;
        let uploadedImage = false;
        var IdKhoaHoc = Number(Math.floor(Math.random() * 999999999999998) + 1);
        let uploadJob = [];
        let work = {
            file: req.files['anhkhoahoc'],
            fileName: IdKhoaHoc + '.' + req.files.anhkhoahoc.name.split('.').pop()
        };
        uploadJob.push(work);
        var listID = [];
        console.log(req.files);
        while (true) {
            if (req.body['tenbaihoc' + maxcount]) {
                listID.push(Number(Math.floor(Math.random() * 999999999999998) + 1));
                let work2 = {
                    file: req.files['file' + maxcount],
                    fileName: IdKhoaHoc.toString() + '_' + listID[maxcount-1].toString() + '.' + req.files['file' + maxcount].name.split('.').pop()
                };
                uploadJob.push(work2)
                maxcount++;
            }
            else {
                maxcount -= 1;
                break;
            }
        }
        for (let count = 1; count <= maxcount; count++) {
            console.log(count);
            let fileImage = req.files['anhkhoahoc'];
            let fileVideo = req.files['file' + count];
            console.log(req.files['anhkhoahoc'].name);
            let b = req.body;
            console.log(req.files['file' + count].name);
            var params1 = {
                TableName: 'BaiHoc',
                Item: {
                    "TenChuDe": req.body.tenchude,
                    "SoTT": count,
                    "DoDai": 0,
                    "MoTaKH": req.body.mota,
                    "TenKH": req.body.tenkhoahoc,
                    "IdKhoaHoc": IdKhoaHoc,
                    "GiaTien": Number(req.body.giatien),
                    "UsernameBKH": req.session.user,
                    "IdBaiHoc": listID[count-1],
                    "TenBH": req.body['tenbaihoc' + count],
                    "Data": "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/video/" + IdKhoaHoc.toString() + '_' + listID[count-1].toString() + '.' + req.files['file' + count].name.split('.').pop(),
                    "TomTat": req.body['tomtat' + count],
                    "Thumbnail": "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/image/" + IdKhoaHoc + '.' + req.files.anhkhoahoc.name.split('.').pop(),
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
                    console.log("gqgqq: "+count);
                    console.log(JSON.stringify(data.Items));
                    if(count == maxcount)
                        resolve(uploadJob);
                    /*if (uploadedImage == false) {
                        console.log('')
                        uploadJob
                        PerformSaveImage(req, res, fileImage, IdKhoaHoc + '.' + req.files.anhkhoahoc.name.split('.').pop());
                        uploadedImage = true;
                    }
                    PerformSaveVideo(req, res, fileVideo, IdKhoaHoc.toString() + '_' + IdBaiHoc.toString() + '.' + req.files['file' + count].name.split('.').pop());*/
                }
            });
        }
    });
}

function PerformSaveImage(req, res, file, name) {
    var s3 = new AWS.S3();
    var buffer = fs.readFileSync(file.path);

    var startTime = new Date();
    var partNum = 0;
    var partSize = 1024 * 1024 * 5; // 5mb chunks except last part
    var numPartsLeft = Math.ceil(buffer.length / partSize);

    var multipartParams = {
        Bucket: 'dktpm12a-n22-publicdata',
        Key: "lessons-data/image/" + name,
        ContentType: file.type,
        ACL:'public-read'
    };

    var multipartMap = {
        Parts: []
    };

    console.log('Creating multipart upload for:', name);
    s3.createMultipartUpload(multipartParams, function (mpErr, multipart) {
        if (mpErr) return console.error('Error!', mpErr);
        console.log('Got upload ID', multipart.UploadId);

        for (var start = 0; start < buffer.length; start += partSize) {
            partNum++;
            var end = Math.min(start + partSize, buffer.length);
            var partParams = {
                Body: buffer.slice(start, end),
                Bucket: multipartParams.Bucket,
                Key: multipartParams.Key,
                PartNumber: String(partNum),
                UploadId: multipart.UploadId
            };

            console.log('Uploading part: #', partParams.PartNumber, ', Start:', start);
            uploadPart(s3, multipart, partParams, multipartParams, multipartMap, numPartsLeft, startTime);
        }
    });
}

function PerformSaveVideo(req, res, file, name) {
    var s3 = new AWS.S3();
    var buffer = fs.readFileSync(file.path);

    var startTime = new Date();
    var partNum = 0;
    var partSize = 1024 * 1024 * 5; // 5mb chunks except last part
    var numPartsLeft = Math.ceil(buffer.length / partSize);

    var multipartParams = {
        Bucket: 'dktpm12a-n22-publicdata',
        Key: "lessons-data/video/" + name,
        ContentType: file.type,
        ACL:'public-read'
    };

    var multipartMap = {
        Parts: []
    };

    console.log('Creating multipart upload for:', name);
    s3.createMultipartUpload(multipartParams, function (mpErr, multipart) {
        if (mpErr) return console.error('Error!', mpErr);
        console.log('Got upload ID', multipart.UploadId);

        for (var start = 0; start < buffer.length; start += partSize) {
            partNum++;
            var end = Math.min(start + partSize, buffer.length);
            var partParams = {
                Body: buffer.slice(start, end),
                Bucket: multipartParams.Bucket,
                Key: multipartParams.Key,
                PartNumber: String(partNum),
                UploadId: multipart.UploadId
            };

            console.log('Uploading part: #', partParams.PartNumber, ', Start:', start);
            uploadPart(s3, multipart, partParams, multipartParams, multipartMap, numPartsLeft, startTime);
        }
    });
}

function completeMultipartUpload(s3, startTime, doneParams) {
    s3.completeMultipartUpload(doneParams, function (err, data) {
        if (err) return console.error('An error occurred while completing multipart upload');
        //var delta = (new Date() - startTime) / 1000;
        //console.log('Completed upload in', delta, 'seconds');
        //console.log('Final upload data:', data);
    });
}

function uploadPart(s3, multipart, partParams, multipartParams, multipartMap, numPartsLeft, startTime, tryNum) {
    var tryNum = tryNum || 1;
    s3.uploadPart(partParams, function (multiErr, mData) {
        console.log('started');
        if (multiErr) {
            console.log('Upload part error:', multiErr);

            if (tryNum < 3) {
                console.log('Retrying upload of part: #', partParams.PartNumber);
                uploadPart(s3, multipart, partParams, tryNum + 1);
            } else {
                console.log('Failed uploading part: #', partParams.PartNumber);
            }
            // return;
        }

        multipartMap.Parts[this.request.params.PartNumber - 1] = {
            ETag: mData.ETag,
            PartNumber: Number(this.request.params.PartNumber)
        };
        console.log('Completed part', this.request.params.PartNumber);
        console.log('mData', mData);
        if (--numPartsLeft > 0) return; // complete only when all parts uploaded

        var doneParams = {
            Bucket: multipartParams.Bucket,
            Key: multipartParams.Key,
            MultipartUpload: multipartMap,
            UploadId: multipart.UploadId
        };

        console.log('Completing upload...');
        completeMultipartUpload(s3, startTime, doneParams);
    }).on('httpUploadProgress', function (progress) { console.log(Math.round(progress.loaded / progress.total * 100) + '% done') });
}

module.exports = {
    putHoaDon: putHoaDon,
    updateSoTien: updateSoTien,
    putCacBaiHoc: putCacBaiHoc,
    PerformSaveImage: PerformSaveImage,
    PerformSaveVideo: PerformSaveVideo
};
