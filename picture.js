/**
 * Created by Thibault on 12/11/2017.
 */
$(document).ready(function () {

    var url = "http://cdn.mos.cms.futurecdn.net/741927a5fd5d9d4db4e8851b1f2aabce-970-80.jpg";
    var API_KEY = "acc_dc8ba00c2d274a1";
    var API_SECRET = "7340b7dea32cc987905db48c575efd11";
    $.ajax({
        type: 'GET',
        url: 'https://api.imagga.com/v1/colors?url=' + url,
        dataType: 'json',
        success: function (data) {
            console.log(data);
        }, beforeSend: function (req) {
            req.setRequestHeader('Authorization', 'Basic ' + btoa(API_KEY + ":" + API_SECRET));
        }
    });
});


// Color extraction API : Documentatie
// https://docs.imagga.com/?php#colors
