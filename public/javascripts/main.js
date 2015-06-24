$(document).ready(function() {
      // upload images to cloudinary

    $('#target_photo').cloudinary_upload_widget(
      { cloud_name: 'isityou', upload_preset: 'get_faces',
      'folder': 'get_faces', theme: 'minimal', thumbnail_transformation: { width: 200, height: 200, crop: 'limit' }, button_caption: 'Upload a Target Image', multiple: false },
      function(error, result) {
        console.log("target: ", result[0].url);
        localStorage.setItem("target",result[0].url);
      }
    );

    $('#upload_widget_opener_collection').cloudinary_upload_widget(
      { cloud_name: 'isityou',
      upload_preset: 'get_faces',
      'folder': 'get_faces',
      theme: 'minimal',
      thumbnail_transformation: { width: 200, height: 200, crop: 'limit' },
      button_caption: 'Upload a Collection of Images',
      max_files: 20
      },
      function(error, results) {
        console.log("Cloudinary result:", results[0]);
        var cloudinaryUrls = results.map(function(result){
          return result.url;
          })
          console.log("cloudinaryUrls:", cloudinaryUrls);

        var resultObj = {};
        resultObj["targeturl"] = localStorage.getItem("target");
        resultObj["urls"] = cloudinaryUrls;
        // var json = JSON.stringify(resultObj);

        console.log("resultObj:", resultObj);
        // console.log("json:", json);
// debugger;

        $.post( "/photo_upload", "test")
          .done(function( photoUrls ) {
            console.log(photoUrls);
            $.each( photoUrls, function( key, url ) {
              var imgSrc = ("<img src = '" + url + "'/>");
              $("#matched_photos").append(imgSrc);
            });
          });
    })
    // .fail(function (x) {
    //     console.log("error:"+x.statusText+x.responseText);
    // });

});
