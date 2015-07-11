var express = require('express');
var findPhotos = require('../image-processing/find_photos');

var router = express.Router();


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('photo_upload', { title: 'Upload Your Photos'});
});

router.post('/', function(req, res, next) {
  var urls = req.body;
  findPhotos(res,urls);
});

module.exports = router;
