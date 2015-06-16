var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('photo_upload', { title: 'Upload Your Photos' });
});

module.exports = router;
