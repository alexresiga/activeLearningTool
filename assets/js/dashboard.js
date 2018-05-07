$(document).ready(function () {
    let userCount = 0;

    $('.dropdown-content').children().on('click', function () {
        console.log(this.innerText);
        //$('.dropbtn').find('a').first().text($(this).innerText).append('<b class="caret"></b>');
        $('.dropbtn').text(this.innerText).append('<i class="fa fa-caret-down">');
    });
    $('#saveNewUser').on('click', function () {
        if ($('#username').val() !== '') {
            $('#userTable tr:last').after('<tr id="' + userCount + '"><td>' + $('#username').val() + '</td><td><input type=\'checkbox\' name=\'record\'></td></tr>');
            $('#username').val('');
        }
        else
        {
            alert('Username cannot be empty!\n');
        }
    });

    $("#delete-row").click(function(){
        $("table tbody").find('input[name="record"]').each(function(){
            if($(this).is(":checked")){
                $(this).parents("tr").remove();
            }
        });
    });


    $("#update-row").click(function () {
       $("table tbody").find('input[name="record"]').each(function () {
           if($(this).is(":checked")){

           }
       });
    });
});