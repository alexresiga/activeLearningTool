function login() {
    console.log('login');
    $.ajax({
        // url: 'http://67.205.179.173:9000/login',
        url: 'http://localhost:9000/login',
        data: {
            username: $('input[name=user]').val(),
            password: $('input[name=password]').val()
        },
        dataType: 'text',
        type: 'GET',
        statusCode: {
            401: function () {
                alert('Invalid user/password combination');
            },
            200: function (response) {
                document.cookie = response;
                window.location.href = 'index.html'
            }
        }
    });
}

$('input[name=password]').keyup(function(event) {
    if (event.keyCode === 13) {
        $("#login-button").click();
    }
});