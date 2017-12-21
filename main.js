$.getJSON('https://6c05830f-a7ef-42b2-a90a-0b3c35cef64c.mock.pstmn.io/annotations', function (json) {
    for (var i = 0; i < json['categories'].length; ++i) {
        var category = json['categories'][i];
        $('#annotations').append('<li>' + '<input type="checkbox">' + category['name'] + '<ul id="' + 'annotation' + i + '"></ul>' + '</li>');

        for (var j = 0; j < category['items'].length; ++j) {
            var item = category['items'][j];
            $('#annotation' + i).append('<li>' + '<input type="checkbox">' + item + '</li>');
        }
        $('#annotation' + i).append()
    }
});

$.getJSON('http://redmine.wittos.com/attachments/download/3726/valid_filtered_0236.json', function(json) {
    $('#title').html(json['metadata']['title'])
    $('#abstract').html(json['documentAbstract'])
    $('#')
});