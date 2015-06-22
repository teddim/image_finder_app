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
      { cloud_name: 'isityou', upload_preset: 'get_faces',
      'folder': 'get_faces', theme: 'minimal', thumbnail_transformation: { width: 200, height: 200, crop: 'limit' },button_caption: 'Upload a Collection of Images', max_files: 20 },
      function(error, result) {
        $.post( "/photo_upload", JSON.stringify(result))
          .done(function( photoUrls ) {
            $.each( photoUrls["photos"], function( key, url ) {
              var imgSrc = ("<img src = '" + url + "'/>");
              $("#matched_photos").append(imgSrc);
            });
          });
    })
    // .fail(function (x) {
    //     console.log("error:"+x.statusText+x.responseText);
    // });

});
