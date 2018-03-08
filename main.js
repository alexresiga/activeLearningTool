GET_ALL_DOCUMENTS = 'http://67.205.179.173:9000/allDocuments';
GET_DOCUMENT = 'http://67.205.179.173:9000/document';
GET_ANNOTATIONS = 'http://67.205.179.173:9000/annotations';
POST_DOCUMENT = 'http://67.205.179.173:9000/document';

//LOCAL DOCUMENTS; COMMENT IT OUT FOR SERVER ONES
//GET_ALL_DOCUMENTS = 'http://localhost:9000/allDocuments';
//GET_DOCUMENT = 'http://localhost:9000/document';
//GET_ANNOTATIONS = 'http://localhost:9000/annotations';
//POST_DOCUMENT = 'http://localhost:9000/document';

let ceva = [];
let documentsList = [];
let index = 0;
let counter = 0;
let validatedID = [];

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

function loadDocument(i) {
    getDocument(documentsList[i]['id']).then(function (json) {
        let documentJson = json['document'];
        console.log(documentsList[i]['id']);
        $('#annotations').css('opacity', '1');
        $('input:checkbox').unbind("click");
        $('#relevantInput').prop('checked', false);
        $('#irrelevantInput').prop('checked', false);
        $('#documentName').html("Document: "+documentsList[i]['name']);
        $('#title').html(documentJson['metadata']['title']);
        $('#abstract').html(documentJson['documentAbstract']);
        $('#content').html(documentJson['sections'][0]['content']);
        $('#authors').empty();
        $('#center').css('border', 'none');
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
    $('#relevantInput').prop("checked", false);
});

$('#default-labels').on('click', function () {
    $('input:checkbox').removeAttr('checked');

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
        //console.log($('$('#center').text():contains($('#search-bar').val())'));
        let search = $('#search-bar').val();
        let text = $('#center').text();
        let idk = new RegExp(search.toString(), "\i");
        console.log(text.search(idk));
        $('#search-history').prepend('<div class="search-item"><i class="fa fa-times" style="color:white;"></i> ' + $('#search-bar').val() + '<br></div>');
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
        $('#center').css('border', 'none');
        documentsList = json['documents'];
        counter = 0;
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
            $('#center').css('border', 'none');
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
            $('#center').css('border', 'none');
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

        alertify.notify("Validated Document", 'success', 2);
        $('#historyList').append('<div class="history_element" style="cursor:pointer;" id="' + index + '"><div style="color:green;float:left;margin-right:2px;"><i class="fa fa-circle fa-sm"></i></div>'+ annotations.join(', ') + '</div>');

        index = (index + 1) % documentsList.length;
        loadDocument(index);

        if (!(validatedID.includes(documentsList[index]['id']))) {
            counter++;
            if (counter > documentsList.length)
                counter = documentsList.length;
        }
        else {
            validatedID.append(documentsList[index]['id']);
        }
        $('#procentage').empty().append(counter + '/' + documentsList.length + ' (' + ((counter / documentsList.length).toFixed(2)) * 100 + '%)');
        $('#bar').css('width', ((counter / documentsList.length).toFixed(2)) * 100 + '%');
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

        index = (index + 1) % documentsList.length;
        loadDocument(index);

        counter++;
        if (counter > documentsList.length)
            counter = documentsList.length;

        $('#procentage').empty().append(counter + '/' + documentsList.length + ' (' + ((counter / documentsList.length).toFixed(2)) * 100 + '%)');
        $('#bar').css('width', ((counter / documentsList.length).toFixed(2)) * 100 + '%');
    }
    else
        alertify.notify("Cannot validate without checking any annotations!", 'message', 3);
});

$(document).ready(function () {
    if (document.cookie === "")
    {
        window.location.href = "login.html";
    }
    $.ajaxSetup({
        headers: {
            'Authorization': document.cookie
        }
    });
    alertify.defaults.notifier.position = 'top-center';
    loadAnnotations().then(function () {
        $('#all').click();

        //TO BE UNCOMMENTED FOR HIGHLIGHTING FEATURE
        //let myText = "";
        //$('#center').mouseup(function () {
        //    myText = selectHTML();
        //    $('.selection').css({"background": "yellow", "font-weight": "bold"});
        //});
    });
});

//irrelevant behaviour
$('#irrelevantInput').on('click', function () {
    $('#annotations').css('opacity', '0.6');
    $('input:checkbox').removeAttr('checked');
    $("input:checkbox").click(function () {
        return false;
    });
});

//going back to relevant behaviour
$('#relevantInput').on('click', function () {
    $('#annotations').css('opacity', '1');
    $('input:checkbox').unbind("click");
});

//behaviour of child annotations when parent annotation is clicked
$('#annotations').on('click', '.PARENT', function () {
    if ($(this).prop('checked')) {
        $('input.child' + $(this).attr('id') + ':checkbox').prop('checked', true);
    }
    else {
        $('input.child' + $(this).attr('id') + ':checkbox').removeAttr('checked');
    }

});

//check parent if any of the children is checked
$('#annotations').on('click', '.children', function () {
    $('input.annotParent' + $(this).attr('id') + ':checkbox').prop('checked', true);
    $('#relevantInput').prop("checked", true);
});

//mark document if it contains errors
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
