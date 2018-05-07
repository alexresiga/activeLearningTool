var $ = require("jquery");

function login() {
    console.log('login');
    $.ajax({
        url: 'login' + '?' + $.param({
            username: $('input[name=user]').val(),
            password: $('input[name=password]').val()
        }),
        dataType: 'text',
        type: 'POST',
        statusCode: {
            401: function () {
                alert('Invalid user/password combination');
            },
            200: function (response) {
                document.cookie = ('annotaurus-token=' + response);
                window.location.href = '/'
            }
        }
    });
}

$('input[name=password]').keyup(function(event) {
    if (event.keyCode === 13) {
        $("#login-button").click();
    }
});

$(document).ready(function () {
    // handle login
    $('#login-button').on('click', function () {
        login();
    });
});
