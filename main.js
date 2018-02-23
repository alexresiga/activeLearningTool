GET_ALL_DOCUMENTS = 'http://localhost:9000/allDocuments';
GET_DOCUMENT = 'http://localhost:9000/document';
GET_ANNOTATIONS = 'https://wittoswidgets.azurewebsites.net/ActiveLearningToolServices.aspx?method=annotations';
POST_DOCUMENT = 'http://localhost:9000/document';


let ceva = [];
let documentsList = [];
let index = 0;
let counter = 0;

function getAllDocuments(completedType) {
    return new Promise(function (resolve) {
        $.getJSON(GET_ALL_DOCUMENTS + '?completed=' + completedType, function (json) {
            resolve(json);
        });
    });
}

function getDocument(id) {
    return new Promise(function (resolve) {
        $.getJSON(GET_DOCUMENT + '?id=' + id, function (json) {
            resolve(json);
        });
    });
}

function getAnnotations() {
    return new Promise(function (resolve) {
        $.getJSON(GET_ANNOTATIONS, function (json) {
            resolve(json);
        });
    });
}

function sendAnnotations(id, json) {
    $.ajax(POST_DOCUMENT + '?id=' + id, {
        data: JSON.stringify(json),
        contentType: 'application/json',
        type: 'POST'
    });
}

function loadAnnotations() {
    return new Promise(function (resolve) {
        getAnnotations().then(function (json) {
            for (let i = 0; i < json['categories'].length; ++i) {
                let category = json['categories'][i];

                $('#annotations').append('<div class="checkbox"><label style="color:white!important;font-size:15px;"><input type="checkbox" name="optionsCheckboxes" class="optionsCheckboxes" value="' + category['name'] + '"><span class="checkbox-material"><span class="check" style="width:15px;height:15px;"></span></span>' + category['name'] + '</input></label></div><div style="border-left: 45px solid #1F3249;" class="annotChild" id="' + 'annotation' + i + '"></div>');

                for (let j = 0; j < category['items'].length; ++j) {
                    let item = category['items'][j];
                    $('#annotation' + i).append('<div class="checkbox " ><label style="color:white!important;font-size:14px;"><input type="checkbox" class="optionsCheckboxes" name="optionsCheckboxes" value="' + item + '"> <span class="checkbox-material"><span class="check " style="width:14px;height:14px;"></span></span>' + item + '</label></div>');
                }
            }

            ceva = $('input:checkbox');
            resolve();
        });
    });
}

function loadDocument(i) {
    getDocument(documentsList[i]['id']).then(function (json) {
        let documentJson = json['document'];

        $('#title').html(documentJson['metadata']['title']);
        $('#abstract').html(documentJson['documentAbstract']);
        $('#content').html(documentJson['sections'][0]['content']);
        $('#authors').empty();

        for (let i = 0; i < documentJson['metadata']['authors'].length; ++i) {
            let fullName = documentJson['metadata']['authors'][i]['givenName'] + ' ' + documentJson['metadata']['authors'][i]['surName'];
            $('#authors').append('<div id="author' + i + '" class="author">' + fullName + '</div>');
        }

        $('#procentage').empty().append(counter + '/' + documentsList.length + ' (' + ((counter / documentsList.length).toFixed(2)) * 100 + '%)');
        $('#bar').css('width', (((counter / documentsList.length).toFixed(2)) * 100 + '%'));

        $('#procentage-list').empty().append(index + 1 + '/' + documentsList.length + ' (' + (((index + 1) / documentsList.length).toFixed(2)) * 100 + '%)');
        $('#bar-list').css('width', (((index + 1) / documentsList.length).toFixed(2)) * 100 + '%');

        $('input:checkbox').removeAttr('checked');

        if (!$.isEmptyObject(json['annotations'])) {
            let annotations = json['annotations']['annotations'];
            console.log("Documentul cu numarul " + i + " are tagurile: " + annotations);

            for (let i = 0; i < ceva.length; ++i) {
                if (annotations.includes(ceva[i].defaultValue))
                    $(ceva[i]).prop('checked', true);
            }
        }
        else if (json['suggestions'].length > 0) {
            for (let i = 0; i < ceva.length; ++i) {
                if (json['suggestions'].includes(ceva[i].defaultValue))
                    $(ceva[i]).prop('checked', true);
            }
        }
    });
}

$('.dropdown-menu').children().on('click', function () {
    $('#dropdown').find('a').first().text($(this).text()).append('<b class="caret"></b>');
});

$('#clear-all').on('click', function () {
    $('#search-history').empty();
});

$('#clear-all-kwords').on('click', function () {
    $('input:checkbox').removeAttr('checked');
    $('.selection').contents().unwrap();
});

$('#search-bar').keypress(function (e) {
    if (e.which === 13 && $('#search-bar').val() !== '') {
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
            let c = document.selection.createRange();
            return c.htmlText;
        }
        let w = getSelection().getRangeAt(0);
        if (w.startOffset === w.endOffset) {
            return ""
        }
        else {
            let nNd = document.createElement("span");
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

$('#all').on('click', function () {
    getAllDocuments('all').then(function (json) {
        documentsList = json['documents'];

        for (let i = 0; i < documentsList.length; ++i) {
            if (documentsList[i].completed === true)
                counter++;
        }

        loadDocument(0);
    });
});

$('#complete').on('click', function () {
    getAllDocuments('true').then(function (json) {
        documentsList = json['documents'];

        if (documentsList.length === 0) {
            $('#title').empty().append("There are no completed documents yet!");
            $('#abstract').empty();
            $('#authors').empty();
            $('#content').empty();
            $('#contentHeader').empty();
            $('#abstractHeader').empty();
        }
        else {
            counter = documentsList.length;
            $('#procentage').empty().append(documentsList.length + '/' + documentsList.length + ' (' + ((documentsList.length / documentsList.length).toFixed(2)) * 100 + '%)');
            $('#bar').css('width', (((documentsList.length / documentsList.length).toFixed(2)) * 100 + '%'));

            loadDocument(0);
        }
    });

});

$('#incomplete').on('click', function () {
    getAllDocuments('false').then(function (json) {
        documentsList = json['documents'];

        if (documentsList.length === 0) {
            $('#title').empty().append("There are no uncompleted documents left!");
            $('#abstract').empty();
            $('#authors').empty();
            $('#content').empty();
            $('#contentHeader').empty();
            $('#abstractHeader').empty();
        }
        else {
            counter = 0;
            $('#procentage').empty().append(counter + '/' + documentsList.length + ' (' + ((counter / (documentsList.length + 1)).toFixed(2)) * 100 + '%)');
            $('#bar').css('width', (((counter / documentsList.length).toFixed(2)) * 100 + '%'));

            loadDocument(0);
        }
    });
});

$('#arrow-left').on('click', function () {
    if (index === 0)
        index = documentsList.length - 1;
    else
        index = index - 1;

    loadDocument(index);
});

$('#arrow-right').on('click', function () {
    index = (index + 1) % documentsList.length;

    loadDocument(index);
});

$('#historyList').on('click', 'div', function () {
    index = parseInt($(this).attr('id'));
    loadDocument(index);
});

$('#validate').on('click', function () {
    let annotations = [];
    for (let i = 0; i < ceva.length; ++i) {
        if ($(ceva[i]).prop('checked')) {
            annotations.push(ceva[i].defaultValue);
        }
    }

    if (annotations.length > 0) {
        sendAnnotations(documentsList[index]['id'], {
            'completed': 'true',
            'relevant': 'true',
            'warning': 'false',
            'annotations': annotations
        });

        $('#historyList').append('<div class="history_element" style="cursor:pointer;" id="' + index + '">' + annotations.join(', ') + '</div>');

        index = (index + 1) % documentsList.length;
        loadDocument(index);

        counter++;
        if (counter > documentsList.length)
            counter = documentsList.length;

        $('#procentage').empty().append(counter + '/' + documentsList.length + ' (' + ((counter / documentsList.length).toFixed(2)) * 100 + '%)');
        $('#bar').css('width', ((counter / documentsList.length).toFixed(2)) * 100 + '%');
    }
    else
        alert("Cannot validate without checking any annotations!");
});

$(document).ready(function () {
    new Noty({
        text: 'Some notification text',
        layout: 'center'
    }).show();

    loadAnnotations().then(function () {
        $.ajaxSetup({
            headers: {
                'Authorization': document.cookie
            }
        });

        $('#all').click();

        let myText = "";
        $('#center').mouseup(function () {
            myText = selectHTML();
            $('.selection').css({"background": "yellow", "font-weight": "bold"});
        });
    });
});