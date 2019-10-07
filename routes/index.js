var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', {pageName:'Home page', userName:'Ta Khanh Hoang'});
});

module.exports = router;
