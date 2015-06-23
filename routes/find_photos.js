function findPhotos(res,urls) {
  var request = require('request');
  var async   = require('async');

  var Photo = function(url) {
    this.faceIds = [];
    this.faceCoordinates = [];
    this.mainUrl = url;
  };

  var CollectionOfPhotos = function() {
    this.targetPhotoId = '6d567ebf-9e2f-4195-b2a4-319441039a18';
    // example: {url: [id1,id2,id3], url2: [id4], url3: [id5,id6,id7]}
    this.allUrlsAndFaceIds = {"http://res.cloudinary.com/isityou/image/upload/v1434854280/get_faces/heather.jpg": ['559583ad-41b1-4eee-93b5-c878a82d98a8']
    ,"http://res.cloudinary.com/isityou/image/upload/v1434891981/sue_v3l6yq.jpg": ['f0b127b5-b250-4813-bcc7-1b7710d73b11']
    ,"http://res.cloudinary.com/isityou/image/upload/v1433997424/preset_folder/yv7u6cn6x8p9ahhqngti.jpg" : ['9c0f6965-cfbe-4348-9e90-bdbec367e314']
    ,"http://res.cloudinary.com/isityou/image/upload/v1434854174/get_faces/maria.jpg" : ['114746fc-9655-4deb-9ca0-6b9543945582']
    ,"http://res.cloudinary.com/isityou/image/upload/v1434892101/maria2_i05l5c.jpg" : ['6d567ebf-9e2f-4195-b2a4-319441039a18']
    };
    this.faceIdData = {};
    this.matchedUrls = [];

    var that = this;
    return {
      addTargetPhoto: function(photo) {
        that.targetPhotoId = photo.faceId[0] || '';
      },
      addPhoto: function(photo) {
        that.allUrlsAndFaceIds[photo.mainUrl] = [];
      },
      addPhotoFaceId: function(photo) {
        that.allUrlsAndFaceIds[photo.mainUrl] = photo.faceIds[0];
      },
      getPhotoUrls: function() {
        return Object.keys(that.allUrlsAndFaceIds);
      },
      getAllFaceIds: function() {
        var faceIds = []
        for (key in that.allUrlsAndFaceIds) {
          faceIds = faceIds.concat(that.allUrlsAndFaceIds[key]);
        }
        return faceIds;
      },
      getPhotoUrlFromFaceId: function(targetFaceId) {
        for (photoUrl in that.allUrlsAndFaceIds) {
          var faceIdmatch = that.allUrlsAndFaceIds[photoUrl].filter(function(faceId) {
            return faceId === targetFaceId;
          });
          if (faceIdmatch.length === 1) {
            return photoUrl;
          }
        }
      },
      getFaceIdData: function() {
        that.faceIdData["faceId"] = that.targetPhotoId;
        that.faceIdData["faceIds"] = this.getAllFaceIds();
        return that.faceIdData;
      },
      addMatchedUrls: function(matchedUrls) {
        that.matchedUrls = matchedUrls;
      },
      getMatchedUrls: function() {
        console.log("get", that.matchedUrls);
        return that.matchedUrls;
      }
    }
  };

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

  ////////////////////////////////////////////////////////////
    // need to get the urls from cloudinary
    //below is temporary so I can test other components

    urls = ["http://res.cloudinary.com/isityou/image/upload/v1434854280/get_faces/heather.jpg"
    ,"http://res.cloudinary.com/isityou/image/upload/v1434891981/sue_v3l6yq.jpg"
    ,"http://res.cloudinary.com/isityou/image/upload/v1433997424/preset_folder/yv7u6cn6x8p9ahhqngti.jpg"
    ,"http://res.cloudinary.com/isityou/image/upload/v1434854174/get_faces/maria.jpg"
    ,"http://res.cloudinary.com/isityou/image/upload/v1434892101/maria2_i05l5c.jpg"
    ];
  ////////////////////////////////////////////////////////////
var dataRequests = [];


urls.forEach(function(url){
  console.log("url", url);
  dataRequests.push(function(async_callback) {
    faceDetection(url,async_callback);
    });
});
// dataRequests.push(function(async_callback) {
// })
//   console.log("data Requests", dataRequests);


async.series (dataRequests,
  function(err, results) {
    var anotherDataRequest = [];
    anotherDataRequest.push(function(async_callback2) {
      findSimilars(userPhotoCollection.getFaceIdData(), async_callback2);
    });
    // build the object with the faceids from the results array
    // request( {}, function() { do something with results }
    console.log("results", results);
    // new_results = results.map(
      // function(result) {
      //   console.log(result);
      // });
    async.series(anotherDataRequest,
    function(err, results){
      console.log("final async results:", results);
      res.send(results);
    });
});

}

module.exports = findPhotos;
