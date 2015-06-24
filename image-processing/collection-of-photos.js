var CollectionOfPhotos = function(targetUrl, collectionUrls ) {

  this.targetUrl = targetUrl;
  this.targetFaceId = '0fee34e4-6011-498a-a82a-8567b4df1617';

  this.photos = [];

  this.faceIdData = {};
  this.matchedUrls = [];

  var that = this;

  collectionUrls.forEach(function(url) {
    console.log(url);
    that.photos.push({"url": url});
    console.log("that.photos",that.photos);
  });

  return {

    addFaceId: function(dataUrl,faceId) {
      console.log("faceId", faceId);
      that.photos.forEach(function(photo, index){
        that.photos[index]["faceId"] = faceId;
      })

      console.log("addFaceId", that.photos);
    },
    getPhotoUrls: function() {
      // console.log("getPhotoUrls", that.photos["url"]);
      return that.photos.map(function(photo){
        return photo["url"];
      })
    },
    getFaceIds: function() {
      console.log("that.photos", that.photos);
      var result = that.photos.map(function(photo){
        return photo.faceId;
    });
        console.log("getFaceIds:", result);
        return result;
    },
    getPhotoUrlFromFaceId: function(faceId) {
      var result = that.photos.filter(function(photo) {
        return photo["faceId"] === faceId;
      })[0]["url"];
      console.log("getPhotoUrlFromFaceId:", result);
      return result;
    },
    getFaceIdData: function() {
      var result = {};

      result["faceId"] = that.targetFaceId;
      result["faceIds"] = this.getFaceIds();
      console.log("getFaceIdData:", result);

      return result;
    },
    addMatchedUrls: function(matchedUrls) {
      that.matchedUrls = matchedUrls;
      console.log("addMatchedUrls:", that.matchedUrls);

    },
    getMatchedUrls: function() {
      console.log("getMatchedUrls", that.matchedUrls);
      return that.matchedUrls;
    }
  }
};

module.exports = CollectionOfPhotos;
