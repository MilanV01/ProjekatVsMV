$(document).ready(function() {
    var prijavaDugme = $('#prijava');

$('#prijava_forma').on('submit', function (a) {
    a.preventDefault();
    var poruka;
    var forma = new FormData();
    forma.append("email", $('#email').val());
    forma.append("password", $('#lozinka').val());
    forma.append("apitoken", $('meta[name="apitoken"]').attr('content'));


    var config = {
        "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/login",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Accept": "application/json"
        },
        "processData": false,
        "contentType": false,
        "data": forma,
        "dataType": 'json',
        "success": function(odgovor){
            if(odgovor.error !== undefined){
                poruka=odgovor.error;
                prijavaDugme.next('.error-message2').remove();
                prijavaDugme.after('<div class="error-message2">' + poruka + '</div>');
                $('#lozinka').val('');
            }
            else {
                var token = odgovor.token;
                var type = odgovor.type;
                localStorage.setItem('token', token);
                localStorage.setItem('type', type);
                if(type === 'администратор'){
                    window.location = 'admin.html';
                }
                else if(type === 'благајник'){
                    window.location = 'blagajnik.html';
                }
                else if(type === 'регистровани корисник'){
                    window.location = 'korisnik.html';
                }
                else if(type === 'блокирани корисник'){
                    window.location = 'index.html';
                }
            }
        },
        "error": function(odgovor){
            $('#lozinka').val('');
            poruka = odgovor.responseJSON.error;
            prijavaDugme.next('.error-message2').remove();
            prijavaDugme.after('<div class="error-message2">' + poruka + '</div>');
        }
    };
    $.ajax(config);
})
});