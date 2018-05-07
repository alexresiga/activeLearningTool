// FIXME: convert to strict ES6

let $ = require("jquery");
window.jQuery = $;
require('bootstrap');
let popper = require('popper.js').default;
let Noty = require("noty");

//require(".login");

// export for others scripts to use

$(function () {
    let GET_ALL_DOCUMENTS = '/allDocuments';
    let GET_DOCUMENT = '/document';
    let GET_LABELS_FOR_TASK = '/labels-for-task';
    let POST_DOCUMENT = '/document';

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

            getUrl = encodeURI(getUrl);

            $.ajaxSetup({
                headers: {
                    'Authorization': getCookie("annotaurus-token")
                }
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

    function getParsedKeywords(keywords) {
        let parsedKeywords = [];
        keywords.forEach(function (keyword) {
            parsedKeywords.push(parseKeyword(keyword));
        });
        return parsedKeywords;
    }

    function parseKeyword(keyword) {
        if (keyword.startsWith("title:"))
            return removeQuotes(keyword.substring(6));

        if (keyword.startsWith("abstract:"))
            return removeQuotes(keyword.substring(9));

        if (keyword.startsWith("content:"))
            return removeQuotes(keyword.substring(8));

        return removeQuotes(keyword);
    }

    function removeQuotes(string) {
        if (string.startsWith("\"") && string.endsWith("\""))
            return string.substring(1, string.length - 1);
        return string;
    }

    function refreshAllDocuments() {
        $('#buttons').find('.active').click();
    }

    function getDocument(name) {
        console.log("getDocument: " + name);
        return new Promise(function (resolve) {
            $.ajaxSetup({
                headers: {
                    'Authorization': getCookie("annotaurus-token")
                }
            });
            $.getJSON(GET_DOCUMENT + '?name=' + name, function (json) {
                resolve(json);
            });
        });
    }

    function getLabelsForTask() {
        return new Promise(function (resolve) {
            $.ajaxSetup({
                headers: {
                    'Authorization': getCookie("annotaurus-token")
                }
            });
            $.getJSON(GET_LABELS_FOR_TASK, function (json) {
                resolve(json);
            });
        });
    }

    function sendAnnotations(name, json) {
        $.ajaxSetup({
            headers: {
                'Authorization': getCookie("annotaurus-token")
            }
        });
        $.ajax(POST_DOCUMENT + '?name=' + name, {
            data: JSON.stringify(json),
            contentType: 'application/json',
            type: 'POST'
        });
    }

    function loadTaskLabels() {
        return new Promise(function (resolve) {
            getLabelsForTask().then(function (json) {
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
        $('#percentage').empty().append(validatedID.length + '/' + documentsList.length + ' (' + p + '%)');
        $('#bar').css('width', p + '%');

        let currentIndex = (documentsList.length > 0) ? (index + 1) : 0;
        p = (documentsList.length > 0) ? (Number((currentIndex / documentsList.length * 100).toFixed(0))) : 0;
        $('#percentage-list').empty().append(currentIndex + '/' + documentsList.length + ' (' + p + '%)');
        $('#bar-list').css('width', p + '%');
    }

    function loadDocument(i) {
        refreshPercentages();

        $('#contentHeader').text("CONTENT");
        $('#abstractHeader').text("ABSTRACT");

        getDocument(documentsList[i]['name']).then(function (json) {
            let documentJson = json['document'];
            console.log("document ID:");
            console.log(documentsList[i]['name']);
            console.log("loadDocument (annotations)");
            console.log(json.annotations);
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

            if (!$.isEmptyObject(json['annotations']) && json['annotations']['relevant'] === 'true') {
                let annotations = json['annotations']['annotations'];
                $('#relevantInput').prop('checked', true);
                for (let i = 0; i < ceva.length; ++i) {
                    //console.log("ceva: " + i);
                    // if the annotation exists, check the corresponding box.  Otherwise remove any check that might exist.
                    annotations.includes(ceva[i].defaultValue) ? $(ceva[i]).prop('checked', true) : $(ceva[i]).prop('checked', false);
                }
                if (annotations.length > 0)
                    $('#center').css('border', '5px solid green');
            }
            else if (json['annotations']['relevant'] === "false" && json['annotations']['completed'] === "true") {
                $('#irrelevantInput').prop('checked', true);
                $('#annotations').css('opacity', '0.6');
                $('input:checkbox').removeAttr('checked');
                $("input:checkbox").click(function () {
                    return false;
                });
                $('#center').css('border', '5px solid #942e12');
            }
            else if (json['annotations']['warning'] === 'true') {
                $('#relevantInput').prop('checked', false);

                $('#center').css('border', '5px solid #FF7900');
            } else {
                clearAnnotationsForCurrentDoc();
            }
            // Highlight keywords
            getParsedKeywords(getKeywords()).forEach(function (keyword) {
                let encodedKeyword = htmlEncode(keyword.toLowerCase());
                highlightHtml($('#title'), encodedKeyword);
                highlightHtml($('#abstract'), encodedKeyword);
                highlightHtml($('#content'), encodedKeyword);
            });

        });
    }

    function highlightHtml(element, keyword) {
        let html = element.html().toLowerCase();
        let highlightIndexes = [];
        let htmlIndex = html.indexOf(keyword);

        let matches = 0;
        while (htmlIndex !== -1 && htmlIndex < html.length && matches < 500) {
            highlightIndexes.push(htmlIndex);
            htmlIndex = html.indexOf(keyword, htmlIndex + keyword.length + 1);
            ++matches;
        }

        console.log(matches);
        for (let i = highlightIndexes.length - 1; i >= 0; --i)
            highlightSubstring(element, highlightIndexes[i], keyword.length);
    }

    function htmlEncode(value){
        return $('<div/>').text(value).html();
    }

    /**
     * Clears all checked labels for current document.
     */
    function clearAnnotationsForCurrentDoc() {
        $('input:checkbox').removeAttr('checked');
        $('.selection').contents().unwrap();
        $('#relevantInput').prop("checked", false);
        $('#irrelevantInput').prop("checked", false);
        clearChildLabelsForCurrentDoc();
    }
    function clearChildLabelsForCurrentDoc() {
        $('#annotations').find(':checkbox').prop("checked", false);
    }
    function clearChildLabels(parent) {
        console.log("clearChildLabels for " + $(parent).val() + " with ID " + $(parent).attr("id"));
        let parentId = "#annotation" + $(parent).attr("id");
        $(parentId).find(":checkbox").each(function(i, c) {
            //console.log("Child: " + $(c).val());
            $(c).prop("checked", false);
        });
    }

    $('.dropdown-menu').children().on('click', function () {
        $('#dropdown').find('a').first().text($(this).text()).append('<b class="caret"></b>');
    });

    $('.dropdown-toggle').off('click');

    $('#clear-all').on('click', function () {
        $('#search-history').empty();
        refreshAllDocuments();
    });

    $('#clear-all-labels').on('click', function () {
        clearAnnotationsForCurrentDoc()
    });

    $('#default-labels').on('click', function () {
        loadDocument(index);
        new Noty(
            {
                type: "info",
                theme: "bootstrap-v3",
                layout: "topCenter",
                timeout: 2000,
                progressBar: false,
                text: "Reverting changes"
            }
        ).show();
    });

    // FIXME: this should remove the cookie beginning with "annotaurus-token="
    $('#log-out').on('click', function () {
        document.cookie = '';
        window.location.href = 'login';
    });

    $('#search-bar').keypress(function (e) {

        if (e.which === 13 && $('#search-bar').val() !== '') {
            // console.log($('$('#center').text():contains($('#search-bar').val())'));

            // let search = $('#search-bar').val();
            // let text = $('#center').text();
            // let idk = new RegExp(search.toString(), "\i");
            // console.log(text.search(idk));

            // FIXME: only do this if the term doesn't already exist in the list
            $('#search-history').prepend('<div class="search-item"><i class="fa fa-times" style="color:white;"></i> ' + $('#search-bar').val() + '<br></div>');
            $('#search-bar').val('');

            $('.search-item > i').on('click', function () {
                console.log('da');
                $(this).parent().remove();
                refreshAllDocuments();
            });

            refreshAllDocuments();

            // FIXME: the count isn't right
            // new Noty(
            //     {
            //         type: "info",
            //         theme: "bootstrap-v3",
            //         layout: "topCenter",
            //         timeout: 2000,
            //         progressBar: false,
            //         text: documentsList.length + " matches"
            //     }
            // ).show();
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

    function noDocuments(string) {
        $('#title').empty().append(string);
        $('#abstract').empty();
        $('#authors').empty();
        $('#content').empty();
        $('#contentHeader').text("");
        $('#abstractHeader').text("");
        $('#center').css('border', 'none');
        refreshPercentages();
    }

    $('#complete').on('click', function () {
        getAllDocuments('true').then(function (json) {
            documentsList = json['documents'];

            if (documentsList.length === 0) {
                noDocuments("There are no completed documents yet!");
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
                noDocuments("There are no uncompleted documents left!");
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

        //annotations.length > 0) {
        if ($('#relevantInput').prop('checked')) {
            sendAnnotations(documentsList[index]['name'], {
                'completed': 'true',
                'relevant': 'true',
                'warning': 'false',
                'annotations': annotations
            });

            new Noty(
                {
                    type: "success",
                    theme: "bootstrap-v3",
                    layout: "topCenter",
                    timeout: 2000,
                    progressBar: false,
                    text: "Validated Document"
                }
            ).show();

            $('#historyList').append('<div class="history_element" style="cursor:pointer;" id="' + index + '"><div style="color:green;float:left;margin-right:2px;"><i class="fa fa-circle fa-sm"></i></div>' + annotations.join(', ') + '</div>');

            if (!validatedID.includes(documentsList[index]['id']))
                validatedID.push(documentsList[index]['id']);

            if ($('#incomplete').hasClass('active')) {
                documentsList.splice(index, 1);
                index--;
                if (documentsList.length === 0) {
                    noDocuments("There are no uncompleted documents left!");
                }
            }

            index = (index + 1) % documentsList.length;
            loadDocument(index);
        }
        else if ($('#irrelevantInput').prop('checked')) {
            sendAnnotations(documentsList[index]['name'], {
                'completed': 'true',
                'relevant': 'false',
                'warning': 'false',
                'annotations': annotations
            });

            new Noty(
                {
                    type: "error",
                    theme: "bootstrap-v3",
                    layout: "topCenter",
                    timeout: 2000,
                    progressBar: false,
                    text: "Irrelevant Document"
                }
            ).show();

            $('#historyList').append('<div class="history_element" style="cursor:pointer;" id="' + index + '"><div style="color:#942e12;float:left;margin-right:2px;"><i class="fa fa-circle fa-sm"></i></div> Irrelevant</div>');
            if ($('#incomplete').hasClass('active')) {
                documentsList.splice(index, 1);
                index--;
                if (documentsList.length === 0)
                    noDocuments("There are no uncompleted documents left!");
            }
            if (!validatedID.includes(documentsList[index]['id']))
                validatedID.push(documentsList[index]['id']);

            index = (index + 1) % documentsList.length;
            loadDocument(index);
        }
        else
            new Noty(
                {
                    type: "error",
                    theme: "bootstrap-v3",
                    layout: "topCenter",
                    timeout: 2000,
                    progressBar: false,
                    text: "Cannot validate without checking any annotations!"
                }
            ).show();
    });

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    $(document).ready(function () {
        console.log("I'm ready!");

        $('.btn').click(function () {
            $('#all').css('background-color', '#4D6A8A');
            $('#all').css('color', '#fff');
            $('.active').removeClass("active");
            $(this).addClass("active");
        });

        // FIXME: this needs to check for the presence of a cookie starting with "annotaurus-token="
        if (document.cookie === "") {
            window.location.href = "login";
        }

        let annotaurusCookie = getCookie("annotaurus-token");
        console.log("Cookie: " + annotaurusCookie);
        let tokenJson = parseJwt(annotaurusCookie);
        $('#user').text(tokenJson.username);

        $.ajaxSetup({
            headers: {
                'Authorization': getCookie("annotaurus-token")
            }
        });

        loadTaskLabels().then(function () {
            $('#all').click();

            // TO BE UNCOMMENTED FOR HIGHLIGHTING FEATURE
            // let myText = "";
            // $('#center').mouseup(function () {
            //     myText = selectHTML();
            //     $('.selection').css({"background": "yellow", "font-weight": "bold"});
            // });
        });
    });

    // Irrelevant behavior
    $('#irrelevantInput').on('change', function () {
        // toggle click state
        //relevant_click_state = (relevant_click_state == true);
        if ($(this).prop("checked")) {
            console.log("Check as irrelevant");
            clearAnnotationsForCurrentDoc();
            $(this).prop("checked", true);
            $('#annotations').css('opacity', '0.6');
            // $('input:checkbox').removeAttr('checked');
            // $("input:checkbox").click(function () {
            //     return false;
            // });
        } else {
            console.log("Remove irrelevant check");
            $(this).prop("checked", false);
        }
    });

    // Going back to relevant behavior
    $('#relevantInput').on('change', function () {
        if (! $(this).prop("checked")) {
            console.log("Clearing relevant and children...");
            clearChildLabelsForCurrentDoc();
        }
        $('#annotations').css('opacity', '1');
    });

    $('#annotations').on('click', '.PARENT', function () {
        $('#relevantInput').prop('checked', true);
        if ($(this).prop('checked') === true) {
            console.log("adding check to label");
            //$(this).prop('checked', true);
            $('input.child' + $(this).attr('id') + ':checkbox').prop('checked', true);
        }
        else {
            console.log("unchecking children of " + "'" + $(this).val() + "'");
            clearChildLabels(this);
            //$('input.child' + $(this).attr('id') + ':checkbox').removeAttr('checked');
        }

    });

    // Check parent if any of the children is checked
    $('#annotations').on('click', '.children', function () {
        $('input.annotParent' + $(this).attr('id') + ':checkbox').prop('checked', true);
        $('#relevantInput').prop("checked", true);
    });

    // Mark document if it contains errors
    $('#warning').on('click', function () {
        sendAnnotations(documentsList[index]['name'], {
            'completed': 'false',
            'relevant': 'false',
            'warning': 'true',
            'annotations': []
        });
        new Noty(
            {
                type: "warning",
                theme: "bootstrap-v3",
                layout: "topCenter",
                timeout: 2000,
                progressBar: false,
                text: "Document error reported"
            }
        ).show();
        index = (index + 1) % documentsList.length;
        loadDocument(index);
    });

    function highlightSubstring(elem, index, length) {
        let str = elem.html();

        str = str.substr(0, index) +
            '<span class="highlighted">' +
            str.substr(index, length) +
            '</span>' +
            str.substr(index + length);

        elem.html(str);
    }

    document.onkeyup = function (e) {
        if ($('#search-bar').is(':focus')) {
            return;
        }
        if (e.which === 37)
            $('#arrow-left').click();
        else if (e.which === 39)
            $('#arrow-right').click();
        else if (e.which === 86)
            $('#validate').click();
        else if (e.which === 87)
            $('#warning').click();
    };

    // FIXME: something isn't right here...
    function parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    $('.fa-question-circle').on('click', function () {
        $('#HelpModal').modal();
    });
});