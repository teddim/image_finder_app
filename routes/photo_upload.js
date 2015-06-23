var express = require('express');
var findPhotos = require('./find_photos');
var Q = require('q');

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
  // res.json({photos: [ 'http://res.cloudinary.com/isityou/image/upload/v1434892101/maria2_i05l5c.jpg',
  // 'http://res.cloudinary.com/isityou/image/upload/v1434854174/get_faces/maria.jpg' ]});
  // Q.fcall(findPhotos).then(function(urls) {res.json({photos: urls});}).done();

  // res.json({photos: findPhotos()});
  findPhotos(res);
});


module.exports = router;
