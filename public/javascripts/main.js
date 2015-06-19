$(document).ready(function() {


// define how to keep track of photos

    var Photo = function(url) {
      this.faceIds = [];
      this.faceCoordinates = [];
      this.mainUrl = url;
    };

    var CollectionOfPhotos = function() {
      this.targetPhotoId = '';
      this.allFaceIds = [];
      this.allUrls = [];

      var that = this;

      return {
        addTargetPhoto: function(photo) {
          that.targetPhotoId = photo.faceId[0] || '';
        },
        addPhoto: function(photo) {
          that.allUrls.push(photo.mainUrl);
          that.allFaceIds.concat(photo.faceIds)
        },
        getPhotoUrls: function() {
          return that.allUrls;
        },

      }
    };

    // upload images to cloudinary

    $('#upload_widget_opener').cloudinary_upload_widget(
      { cloud_name: 'isityou', upload_preset: 'get_faces',
      'folder': 'get_faces', theme: 'minimal', thumbnail_transformation: { width: 200, height: 200, crop: 'limit' } },
      function(error, result) {
        var userPhotoCollection = new CollectionOfPhotos();
        result.forEach(function(photoFromCloudinary) {
          userPhotoCollection.addPhoto(photoFromCloudinary);
        });
      }
    );


  var params = {
     // Specify your subscription key
     'subscription-key': '****'
    //  'subscription-key': process.env.OXFORD_API_SECOND_KEY
     // Specify values for optional parameters, as needed
     // analyzesFaceLandmarks: "false",
     // analyzesAge: "false",
     // analyzesGender: "false",
     // analyzesHeadPose: "false",
  };

  // need to get the urls from cloudinary
  var samplePhoto1 = new Photo('http://res.cloudinary.com/isityou/image/upload/c_scale,w_597/v1433993584/jqtep3a6uqc80bhterye.jpg');
  var comparisonPhotos = new CollectionOfPhotos();
  comparisonPhotos.addPhoto(samplePhoto1);
  console.log("samplePhoto1 Object:" + samplePhoto1);

  var dataUrl = {'url': samplePhoto1.mainUrl };

// get the target photo from the user. This functionality has not been added to the view yet.
  console.log("faceDetection results: " + faceDetection(dataUrl));
  // comparisonPhotos.addTargetPhoto(samplePhoto1);
  console.log("samplePhoto1 Ids:" + samplePhoto1.faceIds);

  // get the faceIds for each photo
  var photosUrls = comparisonPhotos.getPhotoUrls();
  // var photoIds = photoUrls.map(function(photoUrl) {
    // faceDetection(photoUrl);
  // })


  function faceDetection (dataUrl) {
    $.ajax({
      url: 'https://api.projectoxford.ai/face/v0/detections?' + $.param(params),
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      crossDomain: true,
      // data: "{'faceId1': '','faceId2': '' }",
      data: JSON.stringify(dataUrl),
      success: function (data) {
        $.each(data, function (index, photoObj) {
          //get the faceId of the photo and push it onto the id list
            samplePhoto1.faceIds.push(photoObj.faceId);
            console.log("ajax request faceId: " + photoObj.faceId);
            console.log("samplePhoto1 Ids:" + samplePhoto1.faceIds);
        });

      }
    })
    .fail(function (x) {
        console.log("error:"+x.statusText+x.responseText);
    });
  }

  function findSimilars (faceId, faceIds) {
    $.ajax({
      url: 'https://api.projectoxford.ai/face/v0/findsimilars' + $.param(params),
      type: 'POST',
      dataType: "json",
      contentType: "application/json",
      crossDomain: true,
      // data: "{'faceId1': '','faceId2': '' }",
      data: JSON.stringify(faceId, faceIds),
      success: function (data) {
        console.log(data);
      }
    })
    .fail(function (x) {
        console.log("error:"+x.statusText+x.responseText);
    });
  }

});
