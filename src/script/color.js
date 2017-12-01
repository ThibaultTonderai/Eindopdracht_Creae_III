/**
 * Created by Thibault on 12/11/2017.
 */
$(document).ready(function() {

    $.getJSON('http://www.colr.org/json/search_by_colors?colors=AAAAAA', function(data){
        $.each(data.schemes, function (index, value) {
            $('.colors').append($('<div/>').addClass('scheme'+index).css({"display":"flex"}));
            makeSquares(this.colors, index);

        });
    });

});

function makeSquares(colors, i){
    $.each(colors , function (index , value) {
        $('.scheme'+i).append(
            $('<div/>')
                .addClass('color')
                .css({'background-color': '#' + this})
                .css({'width' : '50px'})
                .css({'height': '50px'})
        );
    });
}


// Color extraction API : Documentatie
// https://docs.imagga.com/?php#colors

// API KEY:  acc_dc8ba00c2d274a1
// API SECRET: 7340b7dea32cc987905db48c575efd11


