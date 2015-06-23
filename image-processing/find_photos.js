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
                async_callback(null, parsedBody);
                //I no longer have named photos...so I need to figure out another way of doing this
                // photo1.faceIds.push(parsedBody[0]["faceId"]);
                // photo1.faceCoordinates.push(parsedBody[0]["faceRectangle"]);
               // call FaceDetection with an array that has the first element cut off?
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
                 console.log('urls',userPhotoCollection.getMatchedUrls());
                 async_callback(null, userPhotoCollection.getMatchedUrls());

             });
  }

  var userPhotoCollection = new CollectionOfPhotos();
  urls = userPhotoCollection.getPhotoUrls();

  var detectionRequests = [];

  urls.forEach(function(url){
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
      console.log("results", results);

      async.series(findSimilarsRequest,
      function(err, results){
        console.log("final async results:", results);
        res.send(results);
      });
  });

}

module.exports = findPhotos;
