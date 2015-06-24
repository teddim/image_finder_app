var request = require('request');
var async   = require('async');
var CollectionOfPhotos = require('./collection-of-photos');

function findPhotos(res,urls) {

  var faceDetection = function(dataUrl, async_callback) {
    var dataUrl = {'url': dataUrl};
    console.log("dataUrl:" , dataUrl);
    var options={
                'APIkey':process.env.OXFORD_API_SECOND_KEY
              };

    request({
             url: 'https://api.projectoxford.ai/face/v0/detections',
             headers: {'Access-Control-Allow-Origin': '*', 'Ocp-Apim-Subscription-Key': process.env.OXFORD_API_SECOND_KEY},
             method:"POST",
             body: JSON.stringify(dataUrl)
           },function(error,response,body){
                // console.log("body:" + body);
                 //get the faceId of the photo and push it onto the id list

                var parsedBody = JSON.parse(body);
                console.log("faceDetection: ");
                console.log(parsedBody);
                userPhotoCollection.addFaceId(dataUrl,parsedBody[0].faceId);
                async_callback(null, parsedBody);

             });
  }

  var findSimilars = function (faceIdData, async_callback) {
    // console.log(faceIdData);
    var options={
                'APIkey':process.env.OXFORD_API_SECOND_KEY
              };

    request({
             url: 'https://api.projectoxford.ai/face/v0/findsimilars',
             headers: {'Access-Control-Allow-Origin': '*', 'Ocp-Apim-Subscription-Key': process.env.OXFORD_API_SECOND_KEY},
             method:"POST",
             body: JSON.stringify(faceIdData)
           },function(error,response,body){
                 //get the faceId of the photo and push it onto the id list
                var parsedBody = JSON.parse(body);
                 console.log("findSimilars: ");
                 console.log(parsedBody);
                 var matchedUrls = parsedBody.map(function(element) {
                   return userPhotoCollection.getPhotoUrlFromFaceId(element.faceId);
                 });
                 userPhotoCollection.addMatchedUrls(matchedUrls);
                 console.log('matchedUrls:',userPhotoCollection.getMatchedUrls());
                 async_callback(null, userPhotoCollection.getMatchedUrls());

             });
  }

  console.log("urls from the client:", urls["urls"]);

  var userPhotoCollection = new CollectionOfPhotos(urls["targeturl"], urls["urls"]);

  var urlsForCloudinary = userPhotoCollection.getPhotoUrls();

  var detectionRequests = [];

  urlsForCloudinary.forEach(function(url){
    console.log("url", url);
    detectionRequests.push(function(detection_callback) {
      faceDetection(url,detection_callback);
      });
  });

  async.series (detectionRequests,
    function(err, results) {
      var findSimilarsRequest = [];
      findSimilarsRequest.push(function(similars_callback) {
        findSimilars(userPhotoCollection.getFaceIdData(), similars_callback);
      });
      console.log("Find Similars results", results);

      async.series(findSimilarsRequest,
      function(err, results){
        console.log("final async results:", results[0]);
        res.send(results[0]);
      });
  });

}

module.exports = findPhotos;
