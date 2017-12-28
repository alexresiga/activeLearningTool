$.getJSON('https://6c05830f-a7ef-42b2-a90a-0b3c35cef64c.mock.pstmn.io/annotations', function (json) {
    for (var i = 0; i < json['categories'].length; ++i) {
        var category = json['categories'][i];
        $('#annotations').append('<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"> <span class="checkbox-material"><span class="check"></span></span>' + category['name'] + '</input></label></div><div style="border-left: 45px solid #1F3249;" class="annotChild" id="' + 'annotation' + i + '"></div>');

        for (var j = 0; j < category['items'].length; ++j) {
            var item = category['items'][j];
            $('#annotation' + i).append('<div class="checkbox"><label><input type="checkbox" name="optionsCheckboxes"> <span class="checkbox-material"><span class="check"></span></span>' + item + '</label></div>');
        }
        $('#annotation' + i).append()
    }
});

$.getJSON('https://raw.githubusercontent.com/alexresiga/activeLearningTool/master/valid_filtered_0236.json', function(json) {
    $('#title').html(json['metadata']['title'])
    $('#abstract').html(json['documentAbstract'])
});
