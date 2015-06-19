$(document).ready(function() {
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

// look into a promise

  var dataURL = {'url':'http://res.cloudinary.com/isityou/image/upload/c_scale,w_597/v1433993584/jqtep3a6uqc80bhterye.jpg'};

  $.ajax({
    url: 'https://api.projectoxford.ai/face/v0/detections?' + $.param(params),
    type: 'POST',
    dataType: "json",
    contentType: "application/json",
    crossDomain: true,
    // data: "{'faceId1': '','faceId2': '' }",
    data: JSON.stringify(dataURL),
    success: function (data) {
      var html = '';
      $.each(data, function (index, photoObj) {
          // CollectionOfPhotos.photos.indexOf(this.data)
        console.log(photoObj);
      });
      console.log( html );

    }
  })
  .fail(function (x) {
      console.log("error:"+x.statusText+x.responseText);
  });
});
