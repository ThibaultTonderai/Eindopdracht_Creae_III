"use strict";
var API_KEY_COL = "4oJkrNdyujNYxs9FGSBpw5SvaAeqXEUr2E3WjBhT";
var API_KEY_PIC = "acc_dc8ba00c2d274a1";
var API_SECRET_PIC = "7340b7dea32cc987905db48c575efd11";

var divpic = "#div_pic";
var divhex = "#div_hex_txt";
var divpicrad = "#div_pic_rad";
var divpicfile = "#div_pic_fil";
var divpictxt = "#div_pic_txt";

var inputhex = "#input_text_hex";
var inputUrl= "#input_text_pic";
var inputFile = "#input_file";

$(document).ready(function () {

    showInputType();
    validateInput();
    submit();
});

//region Show Input types
function showInputType() {

    $("input[name='HexOrPic']").on("change", function () {
        if (this.value == "pic") {
            showPictureInputs();

        } else {
            showHexInputs();
        }
    });
}

function showPictureInputs() {
    $(divpic).show();
    $(divhex).hide();
    $("input[name='FileOrUrl']").on("change", function () {
        if (this.value == "url") {
            $(divpictxt).show();
            $(divpicfile).hide();
        } else {
            $(divpicfile).show();
            $(divpictxt).hide();
        }
    });
}

function showHexInputs() {
    $(divpic).hide();
    $(divhex).show();
}

//endregion

//region Validation
function validateInput() {

    $(inputhex).on("change", function () {
        var hex = $(inputhex).val();
        var isOk  = /^#[0-9A-F]{6}$/i.test(hex);
        toggleSubmit(isOk);
    });

    $(inputUrl).on("change", function () {
       var url = $(inputUrl).val();
       var isOk = /(https?:\/\/.*\.(?:png|jpg))/i.test(url);
       toggleSubmit(isOk);
    });

    $(inputFile).on("change", function () {
       var file = $(inputFile)[0].files[0];
       var isOk = validate_fileupload(file.name);
       toggleSubmit(isOk);
    });

}

function toggleSubmit(valid){
    if(valid) $("#submit").show();
    else $("#submit").hide();
}

function validate_fileupload(fileName)
{
    var allowed_extensions = new Array("jpg","png");
    var file_extension = fileName.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.
    for(var i = 0; i <= allowed_extensions.length; i++)
    {
        if(allowed_extensions[i]==file_extension)
        {
            return true; // valid file extension
        }
    }

    return false;
}
//endregion

function submit() {
    $("#input_submit").click(function () {
       console.log("aalalalala");
    });
}


//region API Calls
function getColorScheme(){
    $.getJSON('http://www.colr.org/json/search_by_colors?colors=AAAAAA', function(data){
        $.each(data.schemes, function (index, value) {
            $('.colors').append($('<div/>').addClass('scheme'+index).css({"display":"flex"}));
            makeSquares(this.colors, index);

        });
    });
}

function getImageColorsByUrl(){
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
}

function getImageColorsByFile(){

}
//endregion