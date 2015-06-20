function findPhotos() {
// define how to keep track of photos
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

    var that = this;

    return {
      addTargetPhoto: function(photo) {
        that.targetPhotoId = photo.faceId[0] || '';
      },
      addPhoto: function(photo) {
        that.allUrlsAndFaceIds[photo.mainUrl] = photo.faceIds;
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
        var faceIdData["faceId"] = that.targetPhotoId;
        faceIdData["faceIds"] = this.getAllFaceIds;
        return faceIdData;
      }
    }
  };

// need to get the urls from cloudinary
//temp, eventually all of this needs to be received from the client side in a request

    var photo1 = new Photo("http://res.cloudinary.com/isityou/image/upload/v1434088990/get_faces/codersgonnacode.png");
    var photo2 = new Photo("http://res.cloudinary.com/isityou/image/upload/v1433997424/preset_folder/yv7u6cn6x8p9ahhqngti.jpg");

    var result = [photo1, photo2];
    var userPhotoCollection = new CollectionOfPhotos();
    result.forEach(function(photoFromCloudinary) {
          userPhotoCollection.addPhoto(photoFromCloudinary);
        });

    var params = {
      'subscription-key': process.env.OXFORD_API_SECOND_KEY
    };

    var comparisonPhotos = new CollectionOfPhotos();
    comparisonPhotos.addPhoto(photo1);
    console.log("photo1 Object:" + photo1);

    var dataUrl = {'url': 'http://res.cloudinary.com/isityou/image/upload/c_scale,w_597/v1433993584/jqtep3a6uqc80bhterye.jpg'};
    // {'url': photo1.mainUrl };

  // get the target photo from the user. This functionality has not been added to the view yet.
    // console.log("faceDetection results: " + faceDetection(dataUrl));
    faceDetection(dataUrl).then(findSimilars(faceIds));
    // comparisonPhotos.addTargetPhoto(photo1);
    // console.log("photo1 Ids:" + photo1.faceIds);

    // get the faceIds for each photo
    var photosUrls = comparisonPhotos.getPhotoUrls();
    // var photoIds = photoUrls.map(function(photoUrl) {
      // faceDetection(photoUrl);
    // })


  var faceDetection = function(dataUrls) {
    var options={
                'APIkey':process.env.OXFORD_API_SECOND_KEY
              };
    var temp = [];
    var func = function(data){
      temp.push(data);
      console.log(temp);
    }
    request({
             url: 'https://api.projectoxford.ai/face/v0/detections',
             headers: {'Access-Control-Allow-Origin': '*', 'Ocp-Apim-Subscription-Key': process.env.OXFORD_API_SECOND_KEY},
             method:"POST",
             body: JSON.stringify(dataUrl)
           },function(error,response,body){
                console.log("body:" + body);
                 //get the faceId of the photo and push it onto the id list
                var parsedBody = JSON.parse(body);
                 photo1.faceIds.push(parsedBody[0]["faceId"]);
                 photo1.faceCoordinates.push(parsedBody[0]["faceRectangle"]);
                 console.log("photo1 Ids:" + photo1.faceIds);
                 console.log(photo1);
                 console.log("this:" + this);

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
    return 'userPhotoCollection.allUrls';
}

module.exports = findPhotos;
