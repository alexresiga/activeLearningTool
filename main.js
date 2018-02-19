var checkBoxes = [];
var annotations = [];
var ceva = [];
$.getJSON('https://wittoswidgets.azurewebsites.net/ActiveLearningToolServices.aspx?method=annotations', function (json) {
    for (var i = 0; i < json['categories'].length; ++i) {
        var category = json['categories'][i];

        $('#annotations').append('<div class="checkbox"><label style="color:white!important;font-size:15px;"><input type="checkbox" name="optionsCheckboxes" class="optionsCheckboxes" value="' + category['name'] + '"><span class="checkbox-material"><span class="check" style="width:15px;height:15px;"></span></span>' + category['name'] + '</input></label></div><div style="border-left: 45px solid #1F3249;" class="annotChild" id="' + 'annotation' + i + '"></div>');

        for (var j = 0; j < category['items'].length; ++j) {
            var item = category['items'][j];

            $('#annotation' + i).append('<div class="checkbox " ><label style="color:white!important;font-size:14px;"><input type="checkbox" class="optionsCheckboxes" name="optionsCheckboxes" value="' + item + '"> <span class="checkbox-material"><span class="check " style="width:14px;height:14px;"></span></span>' + item + '</label></div>');
        }
    }
    checkBoxes = $('.checkbox');
    ceva = $('input:checkbox');
});

$('.dropdown-menu').children().on('click', function () {
    $('#dropdown').find('a').first().text($(this).text());
    $('#dropdown').find('a').first().append('<b class="caret"></b>');
});

$('#clear-all').on('click', function () {
    $('#search-history').empty();
});

$('#clear-all-kwords').on('click', function () {
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
        if (w.startOffset === w.endOffset) {
            return ""
        }
        else {
            var nNd = document.createElement("span");
            nNd.setAttribute("class", "selection");

            w.surroundContents(nNd);
            return nNd.innerHTML;
        }
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
    for (var i = 0; i < documents.length; ++i) {
        if (documents[i].completed === true) {
            console.log(documents[i]);
            counter++;
        }
    }
    load_document(0);
    console.log(documents[0].annotations);
    if ('annotations' in documents[0]) {
        var lista = documents[0].annotations;
        console.log(lista);
        for (var ii = 0; ii < lista.length; ++ii) {
            for (var j = 0; j < ceva.length; ++j) {
                if (lista === ceva[j].defaultValue) {
                    $(ceva[j]).prop('checked', true);
                }
            }
        }
    }

});
$('#all').on('click', function () {
    $.getJSON('http://localhost:9000/documents?completed=all', function (json) {
        documents = json['documents'];
        load_document(0);
        for (var i = 0; i < documents.length; ++i) {
            if (documents[i].completed === true) {
                console.log(documents[i]);
                counter++;
            }
        }
    });
});
$('#complete').on('click', function () {
    $.getJSON('http://localhost:9000/documents?completed=true', function (json) {
        documents = json['documents'];
        if (json['documents'].length === 0) {
            $('#title').empty();
            $('#title').append("There are no completed documents yet!");
            $('#abstract').empty();
            $('#authors').empty();
            $('#content').empty();
            $('#contentHeader').empty();
            $('#abstractHeader').empty();

        }
        else {
            counter = documents.length;
            load_document(0);
            $('#procentage').empty();
            $('#procentage').append(documents.length + '/' + documents.length + ' (' + ((documents.length / documents.length).toFixed(2)) * 100 + '%)');
            $('#bar').css('width', (((documents.length / documents.length).toFixed(2)) * 100 + '%'));
        }
    });

});

$('#incomplete').on('click', function () {
    $.getJSON('http://localhost:9000/documents?completed=false', function (json) {
        documents = json['documents'];
        if (json['documents'].length === 0) {
            $('#title').empty();
            $('#title').append("There are no uncompleted documents left!");
            $('#abstract').empty();
            $('#authors').empty();
            $('#content').empty();
            $('#contentHeader').empty();
            $('#abstractHeader').empty();

        }
        else {
            counter = 0;
            $('#procentage').empty();
            $('#procentage').append(counter + '/' + documents.length + ' (' + ((counter / (documents.length + 1)).toFixed(2)) * 100 + '%)');
            $('#bar').css('width', (((counter / documents.length).toFixed(2)) * 100 + '%'));
            load_document(0);
        }
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

        documents = json['documents'];
        $('#title').html(json['metadata']['title']);
        $('#abstract').html(json['documentAbstract']);
        $('#content').html(json['sections'][0]['content']);
        $('input:checkbox').removeAttr('checked');
        $('#authors').empty();
        for (var i = 0; i < json['metadata']['authors'].length; ++i) {
            var fullname = json['metadata']['authors'][i]['givenName'] + ' ' + json['metadata']['authors'][i]['surName'];
            $('#authors').append('<div id="author' + i + '" class="author">' + fullname + '</div>');
        }
        $('#procentage').empty();
        $('#procentage').append(counter + '/' + documents.length + ' (' + ((counter / documents.length).toFixed(2)) * 100 + '%)');
        $('#bar').css('width', (((counter / documents.length).toFixed(2)) * 100 + '%'));
        $('#procentage-list').empty();
        $('#procentage-list').append(index + 1 + '/' + documents.length + ' (' + (((index + 1) / documents.length).toFixed(2)) * 100 + '%)');
        $('#bar-list').css('width', (((index + 1) / documents.length).toFixed(2)) * 100 + '%');

        if (documents[i] !== undefined && 'annotations' in documents[i]) {

            var lista = documents[i].annotations;
            console.log(lista);
            for (var ii = 0; ii < lista.length; ++ii) {
                for (var j = 0; j < ceva.length; ++j) {
                    if (lista[ii] === ceva[j].defaultValue) {
                        $(ceva[j]).prop('checked', true);
                    }
                }
            }
        }


    });
}

$(document).ready(function () {
    var mytext = "";
    $('#center').mouseup(function () {
        mytext = selectHTML();
        $('.selection').css({"background": "yellow", "font-weight": "bold"});
    });

    $('#validate').click(function () {
        for (var i = 0; i < ceva.length; ++i) {
            if ($(ceva[i]).prop('checked')) {
                annotations.push(ceva[i].defaultValue);
            }
        }
        if (annotations.length > 0) {
            $.ajax('http://localhost:9000/documents?id=' + index, {
                data: JSON.stringify({'completed': 'true', 'annotations': annotations}),
                contentType: 'application/json',
                type: 'POST'
            });
            $('#historyList').append('<div class="history_element" style="cursor:pointer;" id="' + index + '">' + annotations.join(', ') + '</div>');
            index = (index + 1) % documents.length;

            load_document(index);
            counter++;
            $('#procentage').empty();
            $('#procentage').append(counter + '/' + documents.length + ' (' + ((counter / documents.length).toFixed(2)) * 100 + '%)');
            $('#bar').css('width', ((counter / documents.length).toFixed(2)) * 100 + '%');

            //preparing next document
            checkBoxes = annotations;
            annotations = [];
            $('input:checkbox').removeAttr('checked');
        }
        else {
            alert("Cannot validate without checking any annotations!");
        }
    });
});

$('#historyList').on('click', 'div', function () {
    index = parseInt($(this).attr('id'));
    load_document(index);
    for (var i = 0; i < checkBoxes.length; ++i) {
        for (var j = 0; j < ceva.length; ++j) {
            if (checkBoxes[i] === ceva[j].defaultValue) {
                $(ceva[j]).prop('checked', true);
            }
        }
    }
});