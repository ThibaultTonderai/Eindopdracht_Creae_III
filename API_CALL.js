
var apiKey = "4oJkrNdyujNYxs9FGSBpw5SvaAeqXEUr2E3WjBhT";
$(document).ready(function() {
    $.ajax({
        url: "https://api.nasa.gov/planetary/apod?api_key=4oJkrNdyujNYxs9FGSBpw5SvaAeqXEUr2E3WjBhT"
    }).then(function(data) {
        $('.explanation').append(data.explanation);
        $('.title').append(data.title);
        $('.copyright').append(data.copyright);
        $('.picture').attr('src', data.url);
        downloadCanvas(this , data.url ,'nasa')
    });


});
function downloadCanvas(link, canvasId, filename) {
    link.href =  canvasId;
    link.download = filename;
}
