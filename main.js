var checkBoxes = [];
var annotations = [];
$.getJSON('https://wittoswidgets.azurewebsites.net/ActiveLearningToolServices.aspx?method=annotations', function (json) {
    for (var i = 0; i < json['categories'].length; ++i) {
        var category = json['categories'][i];
        
        $('#annotations').append('<div class="checkbox"><label style="color:white!important;font-size:15px;"><input type="checkbox" name="optionsCheckboxes" > <span class="checkbox-material"><span class="check" style="width:15px;height:15px;"></span></span>' + category['name'] + '</input></label></div><div style="border-left: 45px solid #1F3249;" class="annotChild" id="' + 'annotation' + i + '"></div>');

        for (var j = 0; j < category['items'].length; ++j) {
            var item = category['items'][j];
            
            $('#annotation' + i).append('<div class="checkbox " ><label style="color:white!important;font-size:14px;"><input type="checkbox" class="optionsCheckboxes" name="optionsCheckboxes" value="' + item + '"> <span class="checkbox-material"><span class="check " style="width:14px;height:14px;"></span></span>' + item + '</label></div>');
        }
    }
    checkBoxes = $('.checkbox');
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
var index = 0;
var counter = 0;
$.getJSON('http://localhost:9000/documents?completed=all', function (json) {
    documents = json['documents'];
    load_document(0);
    
});
$('#all').on('click', function(){
    $.getJSON('http://localhost:9000/documents?completed=all', function (json){
        documents = json['documents'];
        load_document(0);
    });
});
$('#complete').on('click', function(){
    $.getJSON('http://localhost:9000/documents?completed=true', function (json){
        documents = json['documents'];
        if (json['documents'].length == 0){
            alert("There are no completed documents yet!");
            $('#all').css('background-color', '#4D6A8A');
            $('#all').css('color', '#fff');
            
        }
        else {
        load_document(0);
        }
    });
    
});

$('#incomplete').on('click', function(){
    $.getJSON('http://localhost:9000/documents?completed=false', function (json){
        documents = json['documents'];
        load_document(0);
    });
});

$('#arrow-left').on('click', function () {
    if (index === 0)
        index = documents.length - 1;
    else
        index = index - 1;

    load_document(index);
});

$('#arrow-right').on('click', function () {
    index = (index + 1) % documents.length;

    load_document(index);
});

function load_document(i) {
    $.getJSON('http://localhost:9000/documents?id=' + documents[i]['id'], function (json) {
        $('#title').html(json['metadata']['title']);
        $('#abstract').html(json['documentAbstract']);
        $('#content').html(json['sections'][0]['content']);

        $('#authors').empty();
        for (var i = 0; i < json['metadata']['authors'].length; ++i) {
            var fullname = json['metadata']['authors'][i]['givenName'] + ' ' + json['metadata']['authors'][i]['surName'];
            $('#authors').append('<div id="author' + i + '" class="author">' + fullname + '</div>');
        }
        $('#procentage').empty();
        $('#procentage').append(counter + '/' + documents.length + ' (' + ((counter/documents.length).toFixed(2))*100 + '%)');
        $('#bar').css('width', (((counter/documents.length).toFixed(2))*100 + '%'));
        $('#procentage-list').empty();
        $('#procentage-list').append(index+1 + '/' + documents.length + ' (' + (((index+1)/documents.length).toFixed(2))*100 + '%)');
        $('#bar-list').css('width', (((index+1)/documents.length).toFixed(2))*100 + '%');
    });
}

$(document).ready(function() {
    var mytext = "";
    $('#center').mouseup( function() {
        mytext = selectHTML();
        $('.selection').css({"background":"yellow","font-weight":"bold"});
    });

    $('#validate').click( function(){ 
        for (var i = 0; i < checkBoxes.length; ++i){
            if ($(checkBoxes[i]).find('input').prop('checked')){
                annotations.push($(checkBoxes[i]).text());
            }
        }
        if (annotations.length > 0){
        $.ajax('http://localhost:9000/documents?id='+index, {
            data : JSON.stringify({'completed': 'true', 'annotations': annotations}),
            contentType : 'application/json',
            type : 'POST'});
        $('#historyList').append('<p>' + annotations + '</p>');
        index = (index +1) % documents.length;
        
        load_document(index);
        counter++;
        $('#procentage').empty();
        $('#procentage').append(counter + '/' + documents.length + ' (' + ((counter/documents.length).toFixed(2))*100 + '%)');
        $('#bar').css('width', ((counter/documents.length).toFixed(2))*100 + '%');
        
        //preparing next document
        annotations = [];
        $('input:checkbox').removeAttr('checked');
    }
    else {
        alert("Cannot validate without making any annotations!");
    }
    });
});


$(document).ready(function() {
    
    $('.checkbox').on('click', function(){
        console.log($(this).val());
        console.log("da");
      });
});