var AWS = require('aws-sdk');

AWS.config.update({
    region: "local",
    endpoint: "http://localhost:8000"
});

let dynamodb = new AWS.DynamoDB();

var paramsChuDe = {
    TableName: 'ChuDe',
    KeySchema: [
        {
            AttributeName: 'Id',
            KeyType: 'HASH',
        },
        {
            AttributeName: 'ChuDe', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'Id',
            AttributeType: 'N'
        },
        {
            AttributeName: 'ChuDe',
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
        }
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
                ProjectionType: 'INCLUDE', // (ALL | KEYS_ONLY | INCLUDE)
                NonKeyAttributes: [ // required / allowed only for INCLUDE
                    'TenKH',
                    'TenCD',
                    'GiaTien'
                    // ... more attribute names ...
                ],
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
                ProjectionType: 'INCLUDE', // (ALL | KEYS_ONLY | INCLUDE)
                NonKeyAttributes: [ // required / allowed only for INCLUDE
                    'IdKhoaHoc',
                    'TenKH',
                    'GiaTien'
                    // ... more attribute names ...
                ],
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
            AttributeName: 'Id', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'Username',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'Id',
            AttributeType: 'N', // (S | N | B) for string, number, binary
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
            AttributeName: 'Id', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'Username',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'Id',
            AttributeType: 'N', // (S | N | B) for string, number, binary
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
            AttributeName: 'Id',
            KeyType: 'HASH',
        },
        { // Optional RANGE key type for HASH + RANGE tables
            AttributeName: 'UsernameKH', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'Id',
            AttributeType: 'S', // (S | N | B) for string, number, binary
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
    LocalSecondaryIndexes: [
        {
            IndexName: 'HoaDon_IdKhoaHoc',
            KeySchema: [ 
                { // Required HASH type attribute - must match the table's HASH key attribute name
                    AttributeName: 'Id',
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