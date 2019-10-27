const aws = require('../aws_header.js');

const dateFormat = require('dateformat');
const multiparty = require('connect-multiparty'), multipartyMiddleware = multiparty();
const fs = require('fs');
const zlib = require('zlib');
const bodyParser = require('body-parser');

let docClient = new aws.AWS.DynamoDB.DocumentClient();

function putHoaDon(req, IdHoaDon) {
    return new Promise((resolve, reject) => {
        let d = new Date();
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'HoaDon',
            Item: {
                "IdHoaDon": Number(IdHoaDon),
                "UsernameKH": req.session.user,
                "UsernameBKH": req.body.UsernameBKH,
                "IdKhoaHoc": Number(req.body.IdKhoaHoc),
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
        let d = new Date();
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'UserKH',
            Key: { // The primary key of the item (a map of attribute name to AttributeValue)
                Username: req.session.user,
                Email: req.session.email
            },
            UpdateExpression: 'SET SoTien = SoTien - :value',
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

function updateSoTien2(req, newValue) {
    return new Promise((resolve, reject) => {
        let d = new Date();
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'UserBKH',
            Key: { // The primary key of the item (a map of attribute name to AttributeValue)
                Username: req.session.user,
                Email: req.session.email
            },
            UpdateExpression: 'SET SoTien = SoTien + :value',
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
        let maxcount = 1;
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
                    fileName: IdKhoaHoc.toString() + '_' + listID[maxcount - 1].toString() + '.' + req.files['file' + maxcount].name.split('.').pop()
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
            console.log(req.files['anhkhoahoc'].name);
            let b = req.body;
            console.log(req.files['file' + count].name);
            var params1 = {
                TableName: 'BaiHoc',
                Item: {
                    "TenChuDe": b.tenchude,
                    "SoTT": count,
                    "DoDai": 0,
                    "MoTaKH": b.mota,
                    "TenKH": b.tenkhoahoc,
                    "IdKhoaHoc": IdKhoaHoc,
                    "GiaTien": Number(b.giatien),
                    "UsernameBKH": req.session.user,
                    "IdBaiHoc": listID[count - 1],
                    "TenBH": b['tenbaihoc' + count],
                    "Data": "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/video/" + IdKhoaHoc.toString() + '_' + listID[count - 1].toString() + '.' + req.files['file' + count].name.split('.').pop(),
                    "TomTat": b['tomtat' + count],
                    "Thumbnail": "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/image/" + IdKhoaHoc + '.' + req.files.anhkhoahoc.name.split('.').pop(),
                    "DangBan": 1
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
                    console.log("gqgqq: " + count);
                    console.log(JSON.stringify(data.Items));
                    if (count == maxcount)
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

function performSaveImage(req, res, file, name) {
    var s3 = new aws.AWS.S3();
    var buffer = fs.readFileSync(file.path);

    var startTime = new Date();
    var partNum = 0;
    var partSize = 1024 * 1024 * 5; // 5mb chunks except last part
    var numPartsLeft = Math.ceil(buffer.length / partSize);

    var multipartParams = {
        Bucket: 'dktpm12a-n22-publicdata',
        Key: "lessons-data/image/" + name,
        ContentType: file.type,
        ACL: 'public-read'
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

function performSaveVideo(req, res, file, name) {
    var s3 = new aws.AWS.S3();
    var buffer = fs.readFileSync(file.path);

    var startTime = new Date();
    var partNum = 0;
    var partSize = 1024 * 1024 * 5; // 5mb chunks except last part
    var numPartsLeft = Math.ceil(buffer.length / partSize);

    var multipartParams = {
        Bucket: 'dktpm12a-n22-publicdata',
        Key: "lessons-data/video/" + name,
        ContentType: file.type,
        ACL: 'public-read'
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

            if (tryNum < 5) {
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
/*
function getBaiHocKhoaHocLocal(idKH) {
    var params1 = {
        TableName: 'BaiHoc',
        IndexName: 'BaiHoc_KhoaHocIndex',
        KeyConditionExpression: '#ids = :v1',
        ExpressionAttributeNames: {
            '#ids': 'IdKhoaHoc'
        },
        ExpressionAttributeValues: {
            ':v1': Number(idKH)
        },
        ScanIndexForward: false,
        ReturnConsumedCapacity: 'TOTAL',
    };
    docClient.query(params1, function (err, data) {
        if (err) {
            console.log(JSON.stringify(err));
            reject();
        }
        else {
            console.log(JSON.stringify(data.Items));
            //return data.Items;
            resolve(data.Items);
        }
    });
}*/

function goKhoaHoc(req, res, IdBaiHoc, IdKhoaHoc) {
    return new Promise((resolve, reject) => {
        var params1 = {
            TableName: 'BaiHoc',
            Key: {
                IdBaiHoc: IdBaiHoc,
                IdKhoaHoc: IdKhoaHoc
            },
            ExpressionAttributeValues: {
                ':value': Number(0)
            },
            UpdateExpression: 'SET DangBan = :value',
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        docClient.update(params1, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject();
            }
            else {
                resolve();
            }
        });
    });
}

function updateCacBaiHoc(req, res, lst, newLessonCount) {
    return new Promise((resolve, reject) => {
        console.log("Stage 1");
        let IdKhoaHoc = lst[0].IdKhoaHoc;
        let s3Operation = {
            changeImage: false,
            add: [],
            remove: []
        }
        console.log("Stage 2");
        if (req.files.anhkhoahoc.name != '') {
            s3Operation.changeImage = true;
            let filespec = {
                file: req.files.anhkhoahoc,
                fileName: (lst[0].IdKhoaHoc).toString() + '.' + req.files.anhkhoahoc.name.split('.').pop()
            }
            s3Operation.add.push(filespec);
        }
        console.log("Stage 3");
        if (newLessonCount > lst.length) {
            // Phase 1: Define files that will upload (to create new and update existing ones)
            console.log("Stage 4A-1");
            let listIDNew = [];
            let filesLaterUse = [];
            for (let i = lst.length; i < newLessonCount; i++)
                listIDNew.push(Number(Math.floor(Math.random() * 999999999999998) + 1));
            for (let i = 0; i < lst.length; i++) {
                if (req.files['file' + (i + 1).toString()].name != '') {
                    let filespec = {
                        file: req.files['file' + (i + 1).toString()],
                        fileName: IdKhoaHoc.toString() + '_' + lst[i].IdBaiHoc.toString() + '.' + req.files['file' + (i + 1).toString()].name.split('.').pop()
                    }
                    s3Operation.add.push(filespec);
                }
            }
            console.log("Stage 4A-2");
            for (let i = lst.length; i < newLessonCount; i++) {
                let filespec = {
                    file: req.files['file' + (i + 1).toString()],
                    fileName: IdKhoaHoc.toString() + '_' + listIDNew[i - lst.length].toString() + '.' + req.files['file' + (i + 1).toString()].name.split('.').pop()
                }
                s3Operation.add.push(filespec);
                filesLaterUse.push(filespec);
            }
            // Phase 2: Perform database function
            // Update lower indexes
            console.log("Stage 4A-3");
            for (let i = 0; i < lst.length; i++) {
                let b = req.body;
                var params1 = {
                    TableName: 'BaiHoc',
                    Key: {
                        "IdBaiHoc": lst[i].IdBaiHoc,
                        "IdKhoaHoc": lst[i].IdKhoaHoc
                    },
                    ExpressionAttributeNames: {
                        "#TenChuDe": 'TenChuDe',
                        "#MoTaKH": 'MoTaKH',
                        "#TenKH": 'TenKH',
                        "#GiaTien": 'GiaTien',
                        "#TenBH": 'TenBH',
                        "#TomTat": 'TomTat',
                    },
                    ExpressionAttributeValues: {
                        ":TenChuDe": b.tenchude,
                        ":MoTaKH": b.mota,
                        ":TenKH": b.tenkhoahoc,
                        ":GiaTien": Number(b.giatien),
                        ":TenBH": b['tenbaihoc' + (i + 1).toString()],
                        ":TomTat": b['tomtat' + (i + 1).toString()],
                    },
                    UpdateExpression: 'SET #TenChuDe = :TenChuDe , #TenKH = :TenKH , #MoTaKH = :MoTaKH , #GiaTien = :GiaTien , #TenBH = :TenBH , #TomTat = :TomTat',
                    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
                };
                if(s3Operation.changeImage == true) {
                    params1.ExpressionAttributeNames[":Thumbnail"] = "Thumbnail";
                    params1.ExpressionAttributeNames["#Thumbnail"] = "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/image/" + (lst[0].IdKhoaHoc).toString() + '.' + req.files.anhkhoahoc.name.split('.').pop();
                    params1.UpdateExpression += " , #Thumbnail = :Thumbnail";
                }
                docClient.update(params1, function (err, data) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                    else {
                        //console.log(JSON.stringify(data.Items));
                    }
                });
            }
            console.log("Stage 4A-4");
            for (let i = lst.length; i < newLessonCount; i++) {
                let b = req.body;
                var params1 = {
                    TableName: 'BaiHoc',
                    Item: {
                        "TenChuDe": b.tenchude,
                        "SoTT": i + 1,
                        "DoDai": 0,
                        "MoTaKH": b.mota,
                        "TenKH": b.tenkhoahoc,
                        "IdKhoaHoc": Number(IdKhoaHoc),
                        "GiaTien": Number(b.giatien),
                        "UsernameBKH": req.session.user,
                        "IdBaiHoc": listIDNew[i - lst.length],
                        "TenBH": b['tenbaihoc' + (i + 1).toString()],
                        "Data": "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/video/" + filesLaterUse[i - lst.length].fileName,
                        "TomTat": b['tomtat' + (i + 1).toString()],
                        "Thumbnail": "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/image/" + (lst[0].IdKhoaHoc).toString() + '.' + req.files.anhkhoahoc.name.split('.').pop(),
                        "DangBan": 1
                    },
                    ConditionExpression: 'attribute_not_exists(IdHoaDon)',
                    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
                };

                docClient.put(params1, function (err, data) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                    else {
                        console.log(JSON.stringify(data.Items));
                    }
                });
            }
            console.log("Stage 4A-5");
            resolve(s3Operation);
        }
        else if (newLessonCount < lst.length) {
            console.log("Stage 4B-1");
            for (let i = 0; i < newLessonCount; i++) {
                console.log('File ' + i)
                if (req.files['file' + (i + 1).toString()].name != '') {
                    let filespec = {
                        file: req.files['file' + (i + 1).toString()],
                        fileName: IdKhoaHoc.toString() + '_' + lst[i].IdBaiHoc.toString() + '.' + req.files['file' + (i + 1).toString()].name.split('.').pop()
                    }
                    s3Operation.add.push(filespec);
                }
            }
            console.log("Stage 4B-2");
            for (let i = newLessonCount; i < lst.length; i++) {
                console.log('Remove File ' + i)
                let fileName = lst[i].Data.split('/').pop();
                s3Operation.remove.push(fileName);
            }
            // Phase 2: Perform database function
            // Update with new lesson count
            for (let i = 0; i < newLessonCount; i++) {
                let b = req.body;
                var params1 = {
                    TableName: 'BaiHoc',
                    Key: {
                        "IdBaiHoc": lst[i].IdBaiHoc,
                        "IdKhoaHoc": lst[i].IdKhoaHoc
                    },
                    ExpressionAttributeNames: {
                        "#TenChuDe": 'TenChuDe',
                        "#MoTaKH": 'MoTaKH',
                        "#TenKH": 'TenKH',
                        "#GiaTien": 'GiaTien',
                        "#TenBH": 'TenBH',
                        "#TomTat": 'TomTat',
                    },
                    ExpressionAttributeValues: {
                        ":TenChuDe": b.tenchude,
                        ":MoTaKH": b.mota,
                        ":TenKH": b.tenkhoahoc,
                        ":GiaTien": Number(b.giatien),
                        ":TenBH": b['tenbaihoc' + (i + 1).toString()],
                        ":TomTat": b['tomtat' + (i + 1).toString()],
                    },
                    UpdateExpression: 'SET #TenChuDe = :TenChuDe , #TenKH = :TenKH , #MoTaKH = :MoTaKH , #GiaTien = :GiaTien , #TenBH = :TenBH , #TomTat = :TomTat',
                    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
                };
                if(s3Operation.changeImage == true) {
                    params1.ExpressionAttributeNames[":Thumbnail"] = "Thumbnail";
                    params1.ExpressionAttributeNames["#Thumbnail"] = "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/image/" + (lst[0].IdKhoaHoc).toString() + '.' + req.files.anhkhoahoc.name.split('.').pop();
                    params1.UpdateExpression += " , #Thumbnail = :Thumbnail";
                }
                docClient.update(params1, function (err, data) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                    else {
                        //console.log(JSON.stringify(data.Items));
                    }
                });
            }
            for (let i = newLessonCount; i < lst.length; i++) {
                var params1 = {
                    TableName: 'BaiHoc',
                    Key: {
                        "IdBaiHoc": lst[i].IdBaiHoc,
                        "IdKhoaHoc": lst[i].IdKhoaHoc
                    },
                    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
                };
                docClient.delete(params1, function (err, data) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                    else {
                        //console.log(JSON.stringify(data.Items));
                    }
                });
            }

            console.log("Stage 4B-3");
            resolve(s3Operation);
        }
        else {
            for (let i = 0; i < lst.length; i++) {
                let filespec = {
                    file: req.files['file' + (i + 1).toString()],
                    fileName: IdKhoaHoc.toString() + '_' + lst[i].IdBaiHoc.toString() + '.' + req.files['file' + (i + 1).toString()].name.split('.').pop()
                }
                s3Operation.add.push(filespec);
            }
            // Phase 2: Perform database function
            // Update with new lesson count
            for (let i = 0; i < lst.length; i++) {
                let b = req.body;
                var params1 = {
                    TableName: 'BaiHoc',
                    Key: {
                        "IdBaiHoc": lst[i].IdBaiHoc,
                        "IdKhoaHoc": lst[i].IdKhoaHoc
                    },
                    ExpressionAttributeNames: {
                        "#TenChuDe": 'TenChuDe',
                        "#MoTaKH": 'MoTaKH',
                        "#TenKH": 'TenKH',
                        "#GiaTien": 'GiaTien',
                        "#TenBH": 'TenBH',
                        "#TomTat": 'TomTat',
                    },
                    ExpressionAttributeValues: {
                        ":TenChuDe": b.tenchude,
                        ":MoTaKH": b.mota,
                        ":TenKH": b.tenkhoahoc,
                        ":GiaTien": Number(b.giatien),
                        ":TenBH": b['tenbaihoc' + (i + 1).toString()],
                        ":TomTat": b['tomtat' + (i + 1).toString()],
                    },
                    UpdateExpression: 'SET #TenChuDe = :TenChuDe , #TenKH = :TenKH , #MoTaKH = :MoTaKH , #GiaTien = :GiaTien , #TenBH = :TenBH , #TomTat = :TomTat',
                    ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
                };
                if(s3Operation.changeImage == true) {
                    params1.ExpressionAttributeNames[":Thumbnail"] = "Thumbnail";
                    params1.ExpressionAttributeNames["#Thumbnail"] = "https://dktpm12a-n22-publicdata.s3.amazonaws.com/lessons-data/image/" + (lst[0].IdKhoaHoc).toString() + '.' + req.files.anhkhoahoc.name.split('.').pop();
                    params1.UpdateExpression += " , #Thumbnail = :Thumbnail";
                }
                docClient.update(params1, function (err, data) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                    else {
                        //console.log(JSON.stringify(data.Items));
                    }
                });
            }
            resolve(s3Operation);
        }
    });
}

function removeVideo(req, res, fileName) {
    var s3 = new aws.AWS.S3();
    var params = { Bucket: 'dktpm12a-n22-publicdata', Key: 'lessons-data/video/' + fileName };
    s3.deleteObject(params, (err, data) => {
        if (err) console.log(err);
    });
}

function themChuDe(req) {
    return new Promise((resolve, reject) => {
        let d = new Date();
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'ChuDe',
            Item: {
                "TenChuDe": req.body.tenChuDe
            },
            ConditionExpression: 'attribute_not_exists(TenChuDe)',
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        docClient.put(params1, function (err, data) {
            if (err) {
                console.log(JSON.stringify(err));
                reject("Chủ đề bị trùng");
            }
            else {
                console.log(JSON.stringify(data.Items));
                resolve(data.Items);
            }
        });
    });
}

function xoaChuDe(req) {
    return new Promise((resolve, reject) => {
        let d = new Date();
        // Lấy ra tên các bài học của 1 khóa học
        var params1 = {
            TableName: 'ChuDe',
            Key: {
                "TenChuDe": req.body.tenChuDe
            },
            ReturnConsumedCapacity: 'TOTAL', // optional (NONE | TOTAL | INDEXES)
        };
        docClient.delete(params1, function (err, data) {
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
    updateSoTien: updateSoTien,
    updateSoTien2: updateSoTien2,
    putCacBaiHoc: putCacBaiHoc,
    goKhoaHoc: goKhoaHoc,
    performSaveImage: performSaveImage,
    performSaveVideo: performSaveVideo,
    updateCacBaiHoc: updateCacBaiHoc,
    removeVideo: removeVideo,
    themChuDe: themChuDe,
    xoaChuDe: xoaChuDe
};
