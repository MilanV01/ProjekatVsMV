$(document).ready(function() {
  var imePrezimeInput = $('#ime_prezime');
  var telefonInput = $('#telefon');
  var lozinkaInput = $('#lozinka');
  var ponovljenaLozinkaInput = $('#ponovljena_lozinka');
  var emailInput = $('#email');
  var registracijaDugme = $('#registracija');



  imePrezimeInput.on('input', function() {
    var regex =/^[А-ЯЉЊШЂЧЋЖЏ][а-яčćžđšžљњшђчћжџ]+(?:[\s-][А-ЯЉЊШЂЧЋЖЏ][а-яčćžđšžљњшђчћжџ]+)+$|^[A-ZŠĐŽČĆ][a-zčćžđšž]+(?:[\s-][A-ZŠĐŽČĆ][a-zčćžđšž]+)+$/;
    var imePrezime = imePrezimeInput.val().trim();

    if (regex.test(imePrezime)) {
      $(this).css('outline', 'none');
      $(this).css('box-shadow', '0 0 5px magenta');
      imePrezimeInput.next('.error-message').remove();
    } else {
      if (imePrezime.length < 5) {
        $(this).css('outline', '2px solid orange');
        $(this).css('box-shadow', 'none');
        imePrezimeInput.next('.error-message').remove();
        imePrezimeInput.after('<div class="error-message">Ime i prezime je prekratko.</div>');
      } else if (imePrezime.length > 180) {
        $(this).css('outline', '2px solid orange');
        $(this).css('box-shadow', 'none');
        imePrezimeInput.next('.error-message').remove();
        imePrezimeInput.after('<div class="error-message">Ime i prezime je predugo.</div>');
      } else {
        $(this).css('outline', '2px solid orange');
        $(this).css('box-shadow', 'none');
        imePrezimeInput.next('.error-message').remove();
        imePrezimeInput.after('<div class="error-message">Ime i prezime nije ispravno napisano.</div>');
      }
    }
    });


telefonInput.on('input', function() {
  var regex = /^\+[1-9]\d{8,13}$/;
  var telefon = telefonInput.val().trim();

  if (telefon === '' || regex.test(telefon)) {
    $(this).css('box-shadow', '0 0 5px magenta');
    $(this).css('outline', 'none');
    telefonInput.next('.error-message').remove();
  } else {
    $(this).css('box-shadow', 'none');
    telefonInput.next('.error-message').remove();
    $(this).css('outline', '2px solid orange');
    telefonInput.after('<div class="error-message">Telefon nije ispravan.</div>');
  }})

  lozinkaInput.on('input', function() {
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;
    var lozinka = lozinkaInput.val();
    if (regex.test(lozinka)) {
    $(this).css('outline', 'none');
    $(this).css('box-shadow', '0 0 5px magenta');
      lozinkaInput.next('.error-message').remove();
    } else {
      $(this).css('outline', '2px solid orange');
      $(this).css('box-shadow', 'none');
      lozinkaInput.next('.error-message').remove();
      lozinkaInput.after('<div class="error-message">Lozinka nije dovoljno jaka.</div>');
    }
  });

  ponovljenaLozinkaInput.on('blur', function() {
    var ponovljenaLozinka = ponovljenaLozinkaInput.val();
    var lozinka = lozinkaInput.val();

    if (lozinka === ponovljenaLozinka) {
      $(this).css('outline', 'none');
      $(this).css('box-shadow', '0 0 5px magenta');
      ponovljenaLozinkaInput.next('.error-message').remove();
    } else {
      ponovljenaLozinkaInput.next('.error-message').remove();
      ponovljenaLozinkaInput.after('<div class="error-message">Lozinke se ne poklapaju.</div>');
      ponovljenaLozinkaInput.css('outline', '2px solid orange');
    }
  });

    registracijaDugme.on('click', function() {
      var email = emailInput.val().trim();

      if (email === '') {
        emailInput.next('.error-message').remove();
        emailInput.after('<div class="error-message">Niste uneli email.</div>');
        emailInput.css('outline', '2px solid orange');
      } else {

      }
    });

    emailInput.on('input', function() {
      if (email != ''){
        emailInput.next('.error-message').remove();
        emailInput.css('outline', 'none');
        emailInput.css('box-shadow', '0 0 5px magenta');
    }});

  $('#reg_forma').on('submit', function (e) {
    e.preventDefault();

  var poruka;
  var forma = new FormData();
  forma.append("name", $('#ime_prezime').val());
  forma.append("email", $('#email').val());
  forma.append("phone", $('#telefon').val());
  forma.append("password", $('#lozinka').val());
  forma.append("apitoken", $('meta[name="apitoken"]').attr('content'));

  var config = {
    "url": "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/register",
    "method": "POST",
    "timeout": 0,
    "headers": {
        "Accept": "application/json"
    },
    "processData": false,
    "data": forma,
    "dataType": 'json',
    'success': function(odgovor){
          if(odgovor.error !== undefined){
            poruka=odgovor.error;
            registracijaDugme.next('.error-message2').remove();
            registracijaDugme.after('<div class="error-message2">' + poruka + '</div>');
              $('#email').val('');
          }
          else {
              poruka=odgovor.error;
              window.location = 'prijava.html';
          }
      },
    'error': function(odgovor){
      poruka=odgovor.error;
      console.log(poruka);
    }
};
$.ajax(config);
})
});

