$.getJSON('https://6c05830f-a7ef-42b2-a90a-0b3c35cef64c.mock.pstmn.io/annotations', function (json) {
    for (var i = 0; i < json['categories'].length; ++i) {
        var category = json['categories'][i];
        $('#annotations').append('<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"> <span class="checkbox-material"><span class="check"></span></span>' + category['name'] + '</input></label></div><div style="border-left: 45px solid #1F3249;" class="annotChild" id="' + 'annotation' + i + '"></div>');

        for (var j = 0; j < category['items'].length; ++j) {
            var item = category['items'][j];
            $('#annotation' + i).append('<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"> <span class="checkbox-material"><span class="check"></span></span>' + item + '</label></div>');
        }
    }
});

$.getJSON('https://raw.githubusercontent.com/alexresiga/activeLearningTool/master/valid_filtered_0236.json', function (json) {
    $('#title').html(json['metadata']['title']);
    $('#abstract').html(json['documentAbstract']);
    $('#content').html(json['sections'][0]['content']);
    for (var i = 0; i < json['metadata']['authors'].length; ++i) {
        var fullname = json['metadata']['authors'][i]['givenName'] + ' ' + json['metadata']['authors'][i]['surName'];
        $('#authors').append('<div id="author' + i + '" class="author">' + fullname + '</div>');
    }
});

$('.dropdown-menu').children().on('click', function () {
    $('#dropdown').find('a').first().text($(this).text());
    $('#dropdown').find('a').first().append('<b class="caret"></b>');
});