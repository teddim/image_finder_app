function findPhotos(urls) {
  var request = require('request');

  var Photo = function(url) {
    this.faceIds = [];
    this.faceCoordinates = [];
    this.mainUrl = url;
  };

  var CollectionOfPhotos = function() {
    this.targetPhotoId = '';
    // example: {url: [id1,id2,id3], url2: [id4], url3: [id5,id6,id7]}
    this.allUrlsAndFaceIds = [];
    this.faceIdData = {};

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
        return Object.keys(that.allUrls);
      },
      getAllFaceIds: function() {
        var faceIds = [];
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
      }
    }
  };

  var faceDetection = function(dataUrl) {
    var dataUrl = {'url': dataUrl};
    console.log("dataUrl:" + dataUrl);
    //if dataUrls.length is 0 then return the getFaceIdData and call findSimilars?
    var options={
                'APIkey':process.env.OXFORD_API_SECOND_KEY
              };

    request({
             url: 'https://api.projectoxford.ai/face/v0/detections',
             headers: {'Access-Control-Allow-Origin': '*', 'Ocp-Apim-Subscription-Key': process.env.OXFORD_API_SECOND_KEY},
             method:"POST",
             body: JSON.stringify(dataUrl)
           },function(error,response,body){
                console.log("body:" + body);
                 //get the faceId of the photo and push it onto the id list

                var parsedBody = JSON.parse(body);
                console.log(parsedBody);
                //I no longer have named photos...so I need to figure out another way of doing this
                // photo1.faceIds.push(parsedBody[0]["faceId"]);
                // photo1.faceCoordinates.push(parsedBody[0]["faceRectangle"]);
               // call FaceDetection with an array that has the first element cut off?
             });
  }

  var findSimilars = function (faceIdData) {

    var options={
                'APIkey':process.env.OXFORD_API_SECOND_KEY
              };
    var temp = [];
    var func = function(data){
      temp.push(data);
      console.log(temp);
    }
    request({
             url: 'https://api.projectoxford.ai/face/v0/findsimilars',
             headers: {'Access-Control-Allow-Origin': '*', 'Ocp-Apim-Subscription-Key': process.env.OXFORD_API_SECOND_KEY},
             method:"POST",
             body: JSON.stringify(faceIdData)
           },function(error,response,body){
                console.log("body:" + body);
                 //get the faceId of the photo and push it onto the id list
                var parsedBody = JSON.parse(body);
                 console.log("body: "+ parsedBody);
             });

  }

  var userPhotoCollection = new CollectionOfPhotos();

  ////////////////////////////////////////////////////////////
    // need to get the urls from cloudinary
    //below is temporary so I can test other components

    urls = ["http://res.cloudinary.com/isityou/image/upload/v1434088990/get_faces/codersgonnacode.png",
    "http://res.cloudinary.com/isityou/image/upload/v1433997424/preset_folder/yv7u6cn6x8p9ahhqngti.jpg"
    ];
  ////////////////////////////////////////////////////////////


////////////this doesn't work either, still need to figure out promises
  var matchedFaceIds = urls.forEach(function(url){faceDetection(url);}).then(findSimilars(userPhotoCollection.getFaceIdData()));

  var matchedUrls = matchedFaceIds.map(function(faceId) {return userPhotoCollection.getPhotoUrlFromFaceId(faceId)});

//////////////this will return an object with the matchedUrls (not a string)
  return 'matchedUrls';

}

module.exports = findPhotos;
