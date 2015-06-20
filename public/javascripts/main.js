$(document).ready(function() {

    // upload images to cloudinary

    $('#upload_widget_opener').cloudinary_upload_widget(
      { cloud_name: 'isityou', upload_preset: 'get_faces',
      'folder': 'get_faces', theme: 'minimal', thumbnail_transformation: { width: 200, height: 200, crop: 'limit' } },
      function(error, result) {
        $.ajax({
          url: '/photo_upload',
          type: 'POST',
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(result),
          success: function (photoUrls) {
            $.each(data, function (index, photoUrl) {
              console.log("photoUrl: " +photoUrl);
              var r = ("img src = '" + photoUrl + "'")
              $("#find_photos").append(r);
            });

          }
        })
        .fail(function (x) {
            console.log("error:"+x.statusText+x.responseText);
        });

    });
});
