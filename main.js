$.getJSON('annotations.json', function (json) {
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