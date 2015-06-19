var express = require('express');
var router = express.Router();


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("ocp-apim-subscription-key", process.env.OXFORD_API_SECOND_KEY);
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('photo_upload', { title: 'Upload Your Photos' });
});

module.exports = router;
