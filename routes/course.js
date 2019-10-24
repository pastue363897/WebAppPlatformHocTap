var express = require('express');
var router = express.Router();
const AWS = require('aws-sdk');
var query = require('../db/query.js')
var web_function = require('../db/web_function.js')

/*AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAXM7JK7QT4KJENYRH',
    secretAccessKey: 'Z0AQpCrDpyWQvXOY7gp3RVbqEcTeDaquyBKE8KHM',
    sessionToken: 'FQoGZXIvYXdzECEaDPLk2DU7/5irkSFiWiKFAt1LHDtTCO9U1QevauUlM6k/MBp2XcGoFaNh2RNyV3Q3yxCv83ZTZPb1NbZRI1x4m6W25daC1eFDoIZnvEBl3iOXqmZ1FoARXIxUXC9zJyfgpxYkmzBIjza4SIAV4C6t9NND3uxZ0GDvySnp+pKwLag+VTT86kJ5foBx2OGba/Q1T8u/79L0edTdUsPijzIx7rahXcXk+QMf+icuw/8cd8L1oFh/jogN5vX1sY8Ac0NVsDYCeXZ4KiiwJU+9RuPtSdbr/5WWOdKdcqI1+FB8AhJ9+YD+M0jdLPfJFNlcrB+jQ9jlCxbIVwn/j0u1GziT04Z89jBfdPbm8XZ6F+a02hbKI67xMSi95cHtBQ=='
});*/

let docClient = new AWS.DynamoDB.DocumentClient();

module.exports = router;
