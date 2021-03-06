"use strict";
var API_KEY_PIC = "acc_c6274a775e513a3";
var API_SECRET_PIC = "3c00b5e6fe90ec044779c04c65137519";

var divpic = "#div_pic";
var divhex = "#div_hex_txt";
var divpicfile = "#div_pic_fil";
var divpictxt = "#div_pic_txt";

var inputhex = "#input_text_hex";
var inputUrl = "#input_text_pic";
var inputFile = "#input_file";


var hexOrPic = false;
var urlOrFile = false;

$(document).ready(function () {
    validateInput();
    submit();
    toggleButtonHexOrPic();
    toggleButtonUrlOrFile();
});


//region Show Input types

function toggleButtonHexOrPic() {
    $("#btn_hex_pic").click(function () {
        removeInput();
        toggleSubmit(false);
        hexOrPic = !hexOrPic;
        if (hexOrPic) {
            $("#btn_hex_pic").addClass("input_button_pic").val("Picture");
            $("#input_label_id").text("Please insert a picture by link or by file.");
            console.log("bla");
            $(divpic).show();
            $(divhex).hide();
        }
        else {
            $("#btn_hex_pic").removeClass("input_button_pic").val("Hex");
            $("#input_label_id").text("Please put in a hexadecimal value.");

            $(divpic).hide();
            $(divhex).show();
        }
    })
}

function toggleButtonUrlOrFile() {

    $("#btn_url_file").click(function () {
        removeInput();
        toggleSubmit(false);
        urlOrFile = !urlOrFile;
        if (urlOrFile) {
            $("#btn_url_file").addClass("input_button_pic").val("File");
            $(divpicfile).show();
            $(divpictxt).hide();
        } else {
            $("#btn_url_file").removeClass("input_button_pic").val("Url");
            $(divpictxt).show();
            $(divpicfile).hide();
        }
    })
}

//endregion


//region Validation
function validateInput() {

    $(inputhex).on("input", function () {
        var hex = $(inputhex).val();
        var isOk = /^[0-9A-F]{6}$/i.test(hex);
        showColorBackground(isOk);
        toggleSubmit(isOk);
    });

    $(inputUrl).on("input", function () {
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

function showColorBackground(isOk) {
    if (isOk)
        $(inputhex).css({"background-color": "#" + $(inputhex).val()});
    else
        $(inputhex).removeAttr("style");

}

function toggleSubmit(valid) {
    if (valid) $("#submit").show();
    else $("#submit").hide();
}

function validate_fileupload(fileName) {
    var allowed_extensions = new Array("jpg", "png");
    var file_extension = fileName.split('.').pop().toLowerCase(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.
    for (var i = 0; i <= allowed_extensions.length; i++) {
        if (allowed_extensions[i] == file_extension) {
            return true; // valid file extension
        }
    }

    return false;
}

//endregion


//region Submit
function submit() {
    $("#input_submit").click(function () {
        getVisibleValue();
    });
}

function getVisibleValue() {
    if ($(inputhex).is(":visible")) {
        getColorScheme($(inputhex).val());
    } else if ($(inputUrl).is(":visible")) {
        getImageColorsByUrl($(inputUrl).val());
    } else if ($(inputFile).is(":visible")) {
        getImageColorsByFile();
    }
}

//endregion


//region API Calls
//

function getColorScheme(color) {
    console.log(color);
    $.ajax({
        type: "GET",
        url: "https://cors-anywhere.herokuapp.com/http://www.colr.org/json/search_by_colors?colors=" + color,
        dataType: "json",
        success: function (data) {
            console.log(data);
            makeSquares(data);
        }, error: function () {
            alert("BAD HEX ! ")
        }
    });
}

function getImageColorsByUrl(uri) {
    $.ajax({
        type: 'GET',
        url: 'https://api.imagga.com/v1/colors?url=' + uri,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            filterData(data);
        }, beforeSend: function (req) {
            req.setRequestHeader('Authorization', 'Basic ' + btoa(API_KEY_PIC + ":" + API_SECRET_PIC));
        }, error: function () {
            alert("BAD URL")
        }
    });
}

function getImageColorsByFile() {
    var file = $(inputFile)[0].files[0];
    postFile(file);
}

function postFile(file) {
    /*var image = getBase64(file);
    var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    var blob = base64ToBlob(image, 'image/png');*/
    var formData = new FormData();
    formData.append('image', file);


    $.ajax({
        type: 'POST',
        url: 'https://api.imagga.com/v1/content',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log(data);
            getImageColorsById(data.uploaded[0].id)
        }, beforeSend: function (req) {
            req.setRequestHeader('Authorization', 'Basic ' + btoa(API_KEY_PIC + ":" + API_SECRET_PIC));
        }, error: function () {
            alert("BAD URL")
        }
    });
}

function getImageColorsById(id) {
    $.ajax({
        type: 'GET',
        url: 'https://api.imagga.com/v1/colors?content=' + id,
        dataType: 'json',
        success: function (data) {
            console.log(data);
            filterData(data);
        }, beforeSend: function (req) {
            req.setRequestHeader('Authorization', 'Basic ' + btoa(API_KEY_PIC + ":" + API_SECRET_PIC));
        }, error: function () {
            alert("BAD URL")
        }
    });
}

//endregion


//region Display Methods
function makeSquares(colors) {
    displaySchemes(colors);
}

function displaySchemes(result) {
    $.each(result.schemes, function (index, value) {
        $(".colors").append(
            $("<p/>").addClass("description").text(getTags(value)),
            $("<div/>").addClass("box").append(
                $("<img/>").addClass("shuffle").attr("src", "./media/shuffle.png"),
                $("<div/>")
                    .attr("id", "square_" + index)
                    .addClass("palette"),
                $("<img/>").addClass("pdf").attr("src", "./media/PDF.png")
            ));
        displayColors(value, index);
        console.log(value);
    })
}


function displayColors(value, index) {
    $.each(value.colors, function (i, va) {
        $("#square_" + index).append($("<div/>")
            .addClass('color_square')
            .css({'background-color': '#' + va}
            ).append($("<p/>").addClass("color_val").text("Hex: #" + va)))
    })
}


function getInformationAboutPalette() {
    $(".palette").click(function () {
        if ($(this).height() === 100) {
            $(this).animate({height: 50}, 400, function () {
                $(this).find("div").find("p").fadeOut("slow", "linear");
                $(this).next("img").hide();
                $(this).prev("img").hide();
            });
        }
        else {
            $('.palette').each(function (index, val) {
                if ($(this).height() === 100) {
                    $(this).animate({height: 50}, 400);
                    $(this).next("img").hide();
                    $(this).prev("img").hide();
                }
            });
            $(".color_val").fadeOut("slow", "linear");
            $(this).animate({height: 100}, 400, function () {
                $(this).find("div").find("p").fadeIn("slow", "linear");
                $(this).next("img").show();
                $(this).prev("img").show();
            });

        }
    });
}

function goBack() {
    $('.back').show()
        .click(function () {
            $(".colors").stop().fadeOut("slow", "linear", function () {
                $(".colors").css("display: none");
                $(".colors").empty();
                $(".form").stop().fadeIn("slow", "linear");
                $(".back").hide();
            })

        })
}


function hideForm() {
    $(".form").fadeOut("slow", "linear", function () {
        $(".cssload-wrap").fadeIn("slow", "linear");
    });
}

//endregion


//region Helpers

function removeInput() {
    $("#input_file").val("");
    $("#input_text_hex").val("");
    $("#input_text_pic").val("");
}

function filterData(json) {
    var result = json.results[0].info;
    var backgroundcolors = result.background_colors;
    var foregroundcolors = result.foreground_colors;
    console.log(backgroundcolors);
    console.log(foregroundcolors);
    if (backgroundcolors.length > 0)
        var query = makeQuery(backgroundcolors);
    if (foregroundcolors.length > 0)
        query += "," + makeQuery(foregroundcolors);
    getColorScheme(query);
}

function makeQuery(color) {
    var query = color[0].html_code.split("#")[1];
    for (var i = 0; i < 2; i++) {
        query += "," + color[i].html_code.split("#")[1];
    }
    return query;
}

function getTags(scheme) {
    if (scheme.tags.length === 0) return "# palette";
    var x = "";
    $.each(scheme.tags, function (index, value) {
        x += " #" + value.name + "   ";
    });
    return x;
}

//endregion



//region AJAX
$(document).ajaxStart(function () {
    hideForm();
});

$(document).ajaxStop(function () {
    $(".cssload-wrap").hide();
    $(".colors").fadeIn("slow", "linear");
    getInformationAboutPalette();
    goBack();
    clickPdf();
    clickShuffle();


});

//endregion


function clickShuffle(){
    $(".shuffle").click(function () {
        if($(this).next().css("flex-direction") === "row-reverse")
            $(this).next().css({"flex-direction": "row"});
        else
        $(this).next().css({"flex-direction": "row-reverse"});
    })
}


function clickPdf() {
    $(".pdf").click(function () {
        var array = [];
        var palette = $(this).prev('div');
        palette.children().each(function (index, value) {
            array.push($(value).css("background-color"))
        });
        generatePdf(array);
    })
}


function generatePdf(array) {
    var doc = new jsPDF();
    doc.setFont("Verdana");
    doc.text('Color', 100, 10);
    doc.text("By Thibault Derieuw", 85, 20);
    var yCor = 30;
    array.forEach(function (value) {

        var x = value.split("(")[1].split(")")[0];
        var rgb = x.split(",");
        var b = rgb.map(function (x) {
            x = parseInt(x).toString(16);
            return (x.length === 1) ? "0" + x : x;
        });
        b = "#" + b.join("");
        doc.setFillColor(parseInt(rgb[0].trim()), parseInt(rgb[1].trim()), parseInt(rgb[2].trim()));
        doc.rect(10, yCor, 20, 20, 'F');
        doc.text("RGB Value: " + x, 40, yCor + 8);
        doc.text("Hexadecimal value: " + b, 40, yCor + 16);
        yCor += 30;
    });
    doc.save('palette.pdf');
}
