function findPhotos(urls) {
  var request = require('request');
  var Q = require('q');

  var Photo = function(url) {
    this.faceIds = [];
    this.faceCoordinates = [];
    this.mainUrl = url;
  };

  var CollectionOfPhotos = function() {
    this.targetPhotoId = '94fde889-b591-4216-b556-41eb3f7def22';
    // example: {url: [id1,id2,id3], url2: [id4], url3: [id5,id6,id7]}
    this.allUrlsAndFaceIds = {"http://res.cloudinary.com/isityou/image/upload/v1434854280/get_faces/heather.jpg": ['9212a496-a4a2-4697-ba35-e866bb43bef5']
    ,"http://res.cloudinary.com/isityou/image/upload/v1434891981/sue_v3l6yq.jpg": ['260d9d11-504a-4eff-8b0f-c51d5f10debc']
    ,"http://res.cloudinary.com/isityou/image/upload/v1433997424/preset_folder/yv7u6cn6x8p9ahhqngti.jpg" : ['985425cc-1ad4-43ee-b80d-2d6ee5797e25']
    ,"http://res.cloudinary.com/isityou/image/upload/v1434854174/get_faces/maria.jpg" : ['3a8d2c6a-deeb-4ddf-a17a-6c2716b911d8']
    ,"http://res.cloudinary.com/isityou/image/upload/v1434892101/maria2_i05l5c.jpg" : ['94fde889-b591-4216-b556-41eb3f7def22']
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

  var faceDetection = function(dataUrl) {
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
                //I no longer have named photos...so I need to figure out another way of doing this
                // photo1.faceIds.push(parsedBody[0]["faceId"]);
                // photo1.faceCoordinates.push(parsedBody[0]["faceRectangle"]);
               // call FaceDetection with an array that has the first element cut off?
             });
  }

  var findSimilars = function (faceIdData) {
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


var promised = Q("initialVal");
//var promised = deferred.promise;

// //look at the reduce syntax
urls.forEach(function (url) {
    promised = promised
                .then( function(val) { faceDetection(url); console.log("%j",val); return "success"; } , function(){return "error";});
  });

promised = promised
   .then( function(val) { findSimilars(userPhotoCollection.getFaceIdData()); console.log("lst promise %j",val); return true; },function(){return "error in findSimilars";} )

//deferred.resolve(userPhotoCollection.getMatchedUrls());

console.log("here we are : %j",promised);

return userPhotoCollection.getMatchedUrls();

}

module.exports = findPhotos;
