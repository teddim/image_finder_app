var express = require('express');
var findPhotos = require('./find_photos');
var router = express.Router();


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("ocp-apim-subscription-key", process.env.OXFORD_API_SECOND_KEY);
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('photo_upload', { title: 'Upload Your Photos'});
});

router.post('/', function(req, res, next) {
  res.json({photos: findPhotos()});
});


module.exports = router;
