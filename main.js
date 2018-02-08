$.getJSON('https://wittoswidgets.azurewebsites.net/ActiveLearningToolServices.aspx?method=annotations', function (json) {
    for (var i = 0; i < json['categories'].length; ++i) {
        var category = json['categories'][i];
        $('#annotations').append('<div class="checkbox"><label style="color:white!important;font-size:15px;"><input type="checkbox" name="optionsCheckboxes" > <span class="checkbox-material"><span class="check" style="width:15px;height:15px;"></span></span>' + category['name'] + '</input></label></div><div style="border-left: 45px solid #1F3249;" class="annotChild" id="' + 'annotation' + i + '"></div>');

        for (var j = 0; j < category['items'].length; ++j) {
            var item = category['items'][j];
            $('#annotation' + i).append('<div class="checkbox" ><label style="color:white!important;font-size:14px;"><input type="checkbox" class="optionsCheckboxes" name="optionsCheckboxes"> <span class="checkbox-material"><span class="check" style="width:14px;height:14px;"></span></span>' + item + '</label></div>');
        }
    }
});

$('.dropdown-menu').children().on('click', function () {
    $('#dropdown').find('a').first().text($(this).text());
    $('#dropdown').find('a').first().append('<b class="caret"></b>');
});

$('#clear-all').on('click', function () {
    $('#search-history').empty();
});

$('#clear-all-kwords').on('click', function (){
    $('input:checkbox').removeAttr('checked');
    $('.selection').contents().unwrap();
});

$('#search-bar').keypress(function (e) {
    if (e.which == 13 && $('#search-bar').val() !== '') {
        $('#search-history').append('<div class="search-item"><i class="fa fa-times" style="color:white;"></i> ' + $('#search-bar').val() + '<br></div>');
        $('#search-bar').val('');

        $('.search-item > i').on('click', function () {
            $(this).parent().remove();
        });

        return false;
    }
});

$('.search-item > i').on('click', function () {
    $(this).parent().remove();
});


function selectHTML() {
    
    try {
        if (window.ActiveXObject) {
            var c = document.selection.createRange();
            return c.htmlText;
        }
        var w = getSelection().getRangeAt(0);
        if (w.startOffset === w.endOffset){
            return ""
        }
        else{
        var nNd = document.createElement("span");
        nNd.setAttribute("class", "selection");
        
        w.surroundContents(nNd);
        return nNd.innerHTML;}
    } catch (e) {
        if (window.ActiveXObject) {
            return document.selection.createRange();
        } else {
            return getSelection();
        }
    }
}

var documents;
$.getJSON('https://wittoswidgets.azurewebsites.net/ActiveLearningToolServices.aspx?method=documents', function (json) {
    documents = json['documents'];
    load_document(0);
});

var index = 0;
$('#arrow-left').on('click', function () {
    if (index === 0)
        index = documents.length - 1;
    else
        index = index - 1

    load_document(index);
});

$('#arrow-right').on('click', function () {
    index = (index + 1) % documents.length;

    load_document(index);
});

function load_document(i) {
    $.getJSON('https://wittoswidgets.azurewebsites.net/ActiveLearningToolServices.aspx?method=document&id=' + documents[i]['id'], function (json) {
        $('#title').html(json['metadata']['title']);
        $('#abstract').html(json['documentAbstract']);
        $('#content').html(json['sections'][0]['content']);

        $('#authors').empty();
        for (var i = 0; i < json['metadata']['authors'].length; ++i) {
            var fullname = json['metadata']['authors'][i]['givenName'] + ' ' + json['metadata']['authors'][i]['surName'];
            $('#authors').append('<div id="author' + i + '" class="author">' + fullname + '</div>');
        }
    });
}

$(function() {
    var mytext = "";

    $('#center').mouseup( function() {
        mytext = selectHTML();
        $('.selection').css({"background":"yellow","font-weight":"bold"});
    });

    $('#validate').click( function(){
        if (mytext != ""){
        $('#historyList').append('<p>' + mytext + '</p>');
        index = (index +1) % documents.length;
        load_document(index);
        }
        mytext = "";
    });
});

$('.checkbox').on('click', function(){
  console.log($(this).contents());
});