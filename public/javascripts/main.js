
$(function () {

    $.ajax({
        url: 'https://api.projectoxford.ai/face/v0/detections?subscription-key=****',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        crossDomain: true,
        data: "{'url': 'http://res.cloudinary.com/isityou/image/upload/v1433997694/preset_folder/u58nswjjr78gfndfungf.jpg'}",
        success: function (data) {
            var html = '';
            $.each(data, function (commentIndex, comment) {
                html += 'faceid:' + comment['faceId']+"\r\n";
            });
            console.log('html' + html);

        }
    })
    .fail(function (x) {
        console.log("error:"+x.statusText+x.responseText);
    });
});
