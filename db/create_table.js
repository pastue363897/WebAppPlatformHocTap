var aws = require('../aws_header.js');

let dynamodb = new aws.AWS.DynamoDB();

var paramsChuDe = {
    TableName: 'ChuDe',
    KeySchema: [
        {
            AttributeName: 'Id',
            KeyType: 'HASH',
        },
        {
            AttributeName: 'TenChuDe', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'Id',
            AttributeType: 'N'
        },
        {
            AttributeName: 'TenChuDe',
            AttributeType: 'S'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 4,
        WriteCapacityUnits: 1, 
    }
};
dynamodb.createTable(paramsChuDe, function(err, data) {
    if (err)
        console.log(JSON.stringify(err,null,2));
});

var paramsBaiHoc = {
    TableName: 'BaiHoc',
    KeySchema: [
        {
            AttributeName: 'IdBaiHoc',
            KeyType: 'HASH'
        },
        {
            AttributeName: 'IdKhoaHoc', 
            KeyType: 'RANGE'
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'IdBaiHoc',
            AttributeType: 'N' // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'IdKhoaHoc',
            AttributeType: 'N' // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'UsernameBKH',
            AttributeType: 'S' // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'TenChuDe',
            AttributeType: 'S' // (S | N | B) for string, number, binary
        },
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 4, 
        WriteCapacityUnits: 1, 
    },
    GlobalSecondaryIndexes: [ // optional (list of GlobalSecondaryIndex)
        { 
            IndexName: 'BaiHoc_KhoaHocIndex', 
            KeySchema: [
                { // Required HASH type attribute
                    AttributeName: 'IdKhoaHoc',
                    KeyType: 'HASH'
                },
                { // Optional RANGE key type for HASH + RANGE secondary indexes
                    AttributeName: 'UsernameBKH',
                    KeyType: 'RANGE'
                }
            ],
            Projection: { // attributes to project into the index
                ProjectionType: 'ALL', // (ALL | KEYS_ONLY | INCLUDE)
            /*    NonKeyAttributes: [ // required / allowed only for INCLUDE
                    'TenKH',
                    'TenChuDe',
                    'GiaTien',
                    'SoTT',
                    // ... more attribute names ...
                ],*/
            },
            ProvisionedThroughput: { // throughput to provision to the index
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 1,
            },  
        },
        { 
            IndexName: 'BaiHoc_UsernameBKHIndex', 
            KeySchema: [
                { // Required HASH type attribute
                    AttributeName: 'UsernameBKH',
                    KeyType: 'HASH'
                },
                { // Optional RANGE key type for HASH + RANGE secondary indexes
                    AttributeName: 'IdKhoaHoc',
                    KeyType: 'RANGE'
                }
            ],
            Projection: { // attributes to project into the index
                ProjectionType: 'ALL', // (ALL | KEYS_ONLY | INCLUDE)
           /*     NonKeyAttributes: [ // required / allowed only for INCLUDE
                    'IdKhoaHoc',
                    'TenKH',
                    'GiaTien',
                    'SoTT',
                    // ... more attribute names ...
                ],*/
            },
            ProvisionedThroughput: { // throughput to provision to the index
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 1,
            },
        },
        {
            IndexName: 'BaiHoc_ChuDeIndex', 
            KeySchema: [
                { // Required HASH type attribute
                    AttributeName: 'TenChuDe',
                    KeyType: 'HASH'
                },
                { // Optional RANGE key type for HASH + RANGE secondary indexes
                    AttributeName: 'IdKhoaHoc',
                    KeyType: 'RANGE'
                }
            ],
            Projection: { // attributes to project into the index
                ProjectionType: 'ALL', // (ALL | KEYS_ONLY | INCLUDE)
            },
            ProvisionedThroughput: { // throughput to provision to the index
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 1,
            },
        }
    ]
};
dynamodb.createTable(paramsBaiHoc, function(err, data) {
    if (err)
        console.log(JSON.stringify(err,null,2));
});

var paramsUserBKH = {
    TableName: 'UserBKH',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'Username',
            KeyType: 'HASH',
        },
        { // Optional RANGE key type for HASH + RANGE tables
            AttributeName: 'Email', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'Username',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'Email',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        }
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 4, 
        WriteCapacityUnits: 1, 
    }
};

dynamodb.createTable(paramsUserBKH, function(err, data) {
    if (err)
        console.log(JSON.stringify(err,null,2));
});

var paramsUserKH = {
    TableName: 'UserKH',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'Username',
            KeyType: 'HASH',
        },
        { // Optional RANGE key type for HASH + RANGE tables
            AttributeName: 'Email', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'Username',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'Email',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        }
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 4, 
        WriteCapacityUnits: 1, 
    }
};

dynamodb.createTable(paramsUserKH, function(err, data) {
    if (err)
        console.log(JSON.stringify(err,null,2));
});

var paramsHoaDon = {
    TableName: 'HoaDon',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'IdHoaDon',
            KeyType: 'HASH',
        },
        { // Optional RANGE key type for HASH + RANGE tables
            AttributeName: 'UsernameKH', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'IdHoaDon',
            AttributeType: 'N', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'UsernameKH',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'IdKhoaHoc',
            AttributeType: 'N', // (S | N | B) for string, number, binary
        }
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 4, 
        WriteCapacityUnits: 1, 
    },
    GlobalSecondaryIndexes: [ // optional (list of GlobalSecondaryIndex)
        { 
            IndexName: 'HoaDon_UsernameKHIndex', 
            KeySchema: [
                { // Required HASH type attribute
                    AttributeName: 'UsernameKH',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'IdKhoaHoc',
                    KeyType: 'RANGE'
                }
            ],
            Projection: { // attributes to project into the index
                ProjectionType: 'ALL', // (ALL | KEYS_ONLY | INCLUDE)
            /*    NonKeyAttributes: [ // required / allowed only for INCLUDE
                    'TenKH',
                    'TenChuDe',
                    'GiaTien',
                    'SoTT',
                    // ... more attribute names ...
                ],*/
            },
            ProvisionedThroughput: { // throughput to provision to the index
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 1,
            },  
        }
    ],
    LocalSecondaryIndexes: [
        {
            IndexName: 'HoaDon_IdKhoaHoc',
            KeySchema: [ 
                { // Required HASH type attribute - must match the table's HASH key attribute name
                    AttributeName: 'IdHoaDon',
                    KeyType: 'HASH',
                },
                { // alternate RANGE key attribute for the secondary index
                    AttributeName: 'IdKhoaHoc', 
                    KeyType: 'RANGE', 
                }
            ],
            Projection: { // required
                ProjectionType: 'INCLUDE', // (ALL | KEYS_ONLY | INCLUDE)
                NonKeyAttributes: [ // required / allowed only for INCLUDE
                    'GiaTien',
                    'NgayMua'
                ],
            },
        }
    ]
};

dynamodb.createTable(paramsHoaDon, function(err, data) {
    if (err)
        console.log(JSON.stringify(err,null,2));
});