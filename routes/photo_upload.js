var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('photo_upload', { title: 'Upload Your Photos' });
});

module.exports = router;
