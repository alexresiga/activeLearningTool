// GET_ALL_DOCUMENTS = 'http://67.205.179.173:9000/allDocuments';
// GET_DOCUMENT = 'http://67.205.179.173:9000/document';
// GET_ANNOTATIONS = 'http://67.205.179.173:9000/annotations';
// POST_DOCUMENT = 'http://67.205.179.173:9000/document';

//LOCAL DOCUMENTS; COMMENT IT OUT FOR SERVER ONES
GET_ALL_DOCUMENTS = 'http://localhost:9000/allDocuments';
GET_DOCUMENT = 'http://localhost:9000/document';
GET_ANNOTATIONS = 'http://localhost:9000/annotations';
POST_DOCUMENT = 'http://localhost:9000/document';

let ceva = [];
let documentsList = [];
let index = 0;
let counter = 0; // Gone but not forgotten... R.I.P.
let validatedID = [];

function getAllDocuments(completedType) {
    return new Promise(function (resolve) {
        let getUrl = GET_ALL_DOCUMENTS + '?completed=' + completedType;

        getKeywords().forEach(function (keyword) {
            getUrl += '&keyword=' + keyword;
        });

        $.getJSON(getUrl, function (json) {
            validatedID = [];
            json['documents'].forEach(function (document) {
                if (document.completed === true)
                    validatedID.push(document['id']);
            });
            resolve(json);
        });
    });
}

function getKeywords() {
    let keywords = [];
    $('.search-item').each(function (index, keyword) {
        keywords.push($(keyword).text().substring(1));
    });

    return keywords;
}

function refreshAllDocuments() {
    $('#buttons').find('.active').click();
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

                $('#annotations').append('<div class="checkbox" style="border-left: 35px solid #1F3249;"><label style="color:white!important;font-size:15px;"><input type="checkbox" id="' + i + '" name="optionsCheckboxes" class="optionsCheckboxes PARENT annotParent' + i + '" value="' + category['name'] + '"><span class="checkbox-material"><span class="check" style="width:15px;height:15px;"></span></span>' + category['name'] + '</input></label></div><div style="border-left: 55px solid #1F3249;" class="annotChild" id="' + 'annotation' + i + '"></div>');

                for (let j = 0; j < category['items'].length; ++j) {
                    let item = category['items'][j];
                    $('#annotation' + i).append('<div class="checkbox " ><label style="color:white!important;font-size:14px;"><input type="checkbox" id="' + i + '" class="optionsCheckboxes children child' + i + '" name="optionsCheckboxes" value="' + item + '"> <span class="checkbox-material"><span class="check " style="width:14px;height:14px;"></span></span>' + item + '</label></div>');
                }
            }

            ceva = $('input:checkbox');
            resolve();
        });
    });
}

function refreshPercentages() {
    let p = (documentsList.length > 0) ? (Number((validatedID.length / documentsList.length * 100).toFixed(0))) : 0;
    $('#procentage').empty().append(validatedID.length + '/' + documentsList.length + ' (' + p + '%)');
    $('#bar').css('width', p + '%');

    let currentIndex = (documentsList.length > 0) ? (index + 1) : 0;
    p = (documentsList.length > 0) ? (Number((currentIndex / documentsList.length * 100).toFixed(0))) : 0;
    $('#procentage-list').empty().append(currentIndex + '/' + documentsList.length + ' (' + p + '%)');
    $('#bar-list').css('width', p + '%');
}

function loadDocument(i) {
    refreshPercentages();
    getDocument(documentsList[i]['id']).then(function (json) {
        let documentJson = json['document'];
        console.log(documentsList[i]['id']);
        $('#annotations').css('opacity', '1');
        $('input:checkbox').unbind("click");
        $('#relevantInput').prop('checked', false);
        $('#irrelevantInput').prop('checked', false);
        $('#documentName').html("Document: " + documentsList[i]['name']);
        $('#title').html(documentJson['metadata']['title']);
        $('#abstract').html(documentJson['documentAbstract']);
        $('#content').html(documentJson['sections'][0]['content']);
        $('#authors').empty();
        $('#center').css('border', 'none');
        for (let i = 0; i < documentJson['metadata']['authors'].length; ++i) {
            let fullName = documentJson['metadata']['authors'][i]['givenName'] + ' ' + documentJson['metadata']['authors'][i]['surName'];
            $('#authors').append('<div id="author' + i + '" class="author">' + fullName + '</div>');
        }

        $('input:checkbox').removeAttr('checked');

        if (!$.isEmptyObject(json['annotations'])) {
            let annotations = json['annotations']['annotations'];
            $('#relevantInput').prop('checked', true);
            for (let i = 0; i < ceva.length; ++i) {
                if (annotations.includes(ceva[i].defaultValue))
                    $(ceva[i]).prop('checked', true);
            }
            if (annotations.length > 0)
                $('#center').css('border', '5px solid green');
        }

        else if (json['suggestions'].length > 0) {
            for (let i = 0; i < ceva.length; ++i) {
                if (json['suggestions'].includes(ceva[i].defaultValue))
                    $(ceva[i]).prop('checked', true);
            }

        }

        if (json['annotations']['relevant'] === "false" && json['annotations']['completed'] === "true") {
            $('#irrelevantInput').prop('checked', true);
            $('#annotations').css('opacity', '0.6');
            $('input:checkbox').removeAttr('checked');
            $("input:checkbox").click(function () {
                return false;
            });
            $('#center').css('border', '5px solid #942e12');
        }

        // Highlight keywords
        // TODO: make search case-insensitive

        getKeywords().forEach(function (keyword) {
            let centerHtml = $('#center').html().toLowerCase();
            let highlightIndexes = [];
            let htmlIndex = centerHtml.indexOf(keyword.toLowerCase());

            while (htmlIndex !== -1 && htmlIndex < centerHtml.length) {
                highlightIndexes.push(htmlIndex);
                htmlIndex = centerHtml.indexOf(keyword.toLowerCase(), htmlIndex + keyword.length);
            }

            for (let i = highlightIndexes.length - 1; i >= 0; i--)
                highlightSubstring(highlightIndexes[i], keyword.length);
        });

    });
}

$('.dropdown-menu').children().on('click', function () {
    $('#dropdown').find('a').first().text($(this).text()).append('<b class="caret"></b>');
});

$('#clear-all').on('click', function () {
    $('#search-history').empty();
    refreshAllDocuments();
});

$('#clear-all-kwords').on('click', function () {
    $('input:checkbox').removeAttr('checked');
    $('.selection').contents().unwrap();
    $('#relevantInput').prop("checked", false);
});

$('#default-labels').on('click', function () {
    $('input:checkbox').removeAttr('checked');
    $('#relevantInput').prop("checked", false);

    getDocument(documentsList[index]['id']).then(function (json) {
        if (json['suggestions'].length > 0) {
            for (let i = 0; i < ceva.length; ++i) {
                if (json['suggestions'].includes(ceva[i].defaultValue))
                    $(ceva[i]).prop('checked', true);
            }
        }
    });
});

$('#log-out').on('click', function () {
    document.cookie = '';
    window.location.href = 'login.html';
});

$('#search-bar').keypress(function (e) {
    if (e.which === 13 && $('#search-bar').val() !== '') {
        // console.log($('$('#center').text():contains($('#search-bar').val())'));

        // let search = $('#search-bar').val();
        // let text = $('#center').text();
        // let idk = new RegExp(search.toString(), "\i");
        // console.log(text.search(idk));

        $('#search-history').prepend('<div class="search-item"><i class="fa fa-times" style="color:white;"></i> ' + $('#search-bar').val() + '<br></div>');
        $('#search-bar').val('');

        $('.search-item > i').on('click', function () {
            console.log('da');
            $(this).parent().remove();
            refreshAllDocuments();
        });

        refreshAllDocuments();
    }
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
        $('#center').css('border', 'none');
        documentsList = json['documents'];

        if (documentsList.length === 0) {
            $('#title').empty().append("There are no documents that match the given keywords!");
            $('#abstract').empty();
            $('#authors').empty();
            $('#content').empty();
            $('#contentHeader').empty();
            $('#abstractHeader').empty();
            $('#center').css('border', 'none');
            refreshPercentages();
        }
        else {
            index = 0;
            loadDocument(0);
        }
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
            $('#center').css('border', 'none');
            refreshPercentages();
        }
        else {
            index = 0;
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
            $('#center').css('border', 'none');
            refreshPercentages();
        }
        else {
            index = 0;
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

        alertify.notify("Validated Document", 'success', 2);
        $('#historyList').append('<div class="history_element" style="cursor:pointer;" id="' + index + '"><div style="color:green;float:left;margin-right:2px;"><i class="fa fa-circle fa-sm"></i></div>' + annotations.join(', ') + '</div>');

        if (!validatedID.includes(documentsList[index]['id']))
            validatedID.push(documentsList[index]['id']);

        if ($('#incomplete').hasClass('active')) {
            documentsList.splice(index, 1);
            index--;
        }

        index = (index + 1) % documentsList.length;
        loadDocument(index);
    }
    else if ($('#irrelevantInput').prop('checked')) {
        sendAnnotations(documentsList[index]['id'], {
            'completed': 'true',
            'relevant': 'false',
            'warning': 'false',
            'annotations': annotations
        });
        alertify.notify("Irrelevant Document", 'error', 2);

        $('#historyList').append('<div class="history_element" style="cursor:pointer;" id="' + index + '"><div style="color:#942e12;float:left;margin-right:2px;"><i class="fa fa-circle fa-sm"></i></div> Irrelevant</div>');

        if (!validatedID.includes(documentsList[index]['id']))
            validatedID.push(documentsList[index]['id']);

        index = (index + 1) % documentsList.length;
        loadDocument(index);
    }
    else
        alertify.notify("Cannot validate without checking any annotations!", 'message', 3);
});

$(document).ready(function () {
    if (document.cookie === "") {
        window.location.href = "login.html";
    }

    let tokenJson = parseJwt(document.cookie);
    $('#user').text(tokenJson.username);

    $.ajaxSetup({
        headers: {
            'Authorization': document.cookie
        }
    });

    alertify.defaults.notifier.position = 'top-center';
    loadAnnotations().then(function () {
        $('#all').click();

        // TO BE UNCOMMENTED FOR HIGHLIGHTING FEATURE
        // let myText = "";
        // $('#center').mouseup(function () {
        //     myText = selectHTML();
        //     $('.selection').css({"background": "yellow", "font-weight": "bold"});
        // });
    });
});

// Irrelevant behaviour
$('#irrelevantInput').on('click', function () {
    $('#annotations').css('opacity', '0.6');
    $('input:checkbox').removeAttr('checked');
    $("input:checkbox").click(function () {
        return false;
    });
});

// Going back to relevant behaviour
$('#relevantInput').on('click', function () {
    $('#annotations').css('opacity', '1');
    $('input:checkbox').unbind("click");
});

// Behaviour of child annotations when parent annotation is clicked
$('#annotations').on('click', '.PARENT', function () {
    if ($(this).prop('checked')) {
        $('input.child' + $(this).attr('id') + ':checkbox').prop('checked', true);
    }
    else {
        $('input.child' + $(this).attr('id') + ':checkbox').removeAttr('checked');
    }

});

// Check parent if any of the children is checked
$('#annotations').on('click', '.children', function () {
    $('input.annotParent' + $(this).attr('id') + ':checkbox').prop('checked', true);
    $('#relevantInput').prop("checked", true);
});

// Mark document if it contains errors
$('#warning').on('click', function () {
    sendAnnotations(documentsList[index]['id'], {
        'completed': 'false',
        'relevant': 'false',
        'warning': 'true',
        'annotations': []
    });
    index = (index + 1) % documentsList.length;
    loadDocument(index);
});

function highlightSubstring(index, length) {
    let str = $('#center').html();

    str = str.substr(0, index) +
        '<span class="highlighted">' +
        str.substr(index, length) +
        '</span>' +
        str.substr(index + length);

    $('#center').html(str);
}

document.onkeyup = function (e) {
    if (e.which === 37)
        $('#arrow-left').click();
    else if (e.which === 39)
        $('#arrow-right').click();
    else if (e.which === 86)
        $('#validate').click();
    else if (e.which === 87)
        $('#warning').click();
};

function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}