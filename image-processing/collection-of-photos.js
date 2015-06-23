var Photo   = require('./photo');

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

module.exports = CollectionOfPhotos;
