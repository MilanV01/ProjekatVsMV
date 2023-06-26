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
          imePrezimeInput.after('<div class="error-message">Име и презиме је прекратко</div>');
        } else if (imePrezime.length > 180) {
          $(this).css('outline', '2px solid orange');
          $(this).css('box-shadow', 'none');
          imePrezimeInput.next('.error-message').remove();
          imePrezimeInput.after('<div class="error-message">Име и презиме је предугачко</div>');
        } else {
          $(this).css('outline', '2px solid orange');
          $(this).css('box-shadow', 'none');
          imePrezimeInput.next('.error-message').remove();
          imePrezimeInput.after('<div class="error-message">Име и презиме није правилно написано</div>');
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
      telefonInput.after('<div class="error-message">Телефон није исправан</div>');
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
        lozinkaInput.after('<div class="error-message">Лозинка није довољно јака</div>');
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
        ponovljenaLozinkaInput.after('<div class="error-message">Лозинке се не поклапају</div>');
        ponovljenaLozinkaInput.css('outline', '2px solid orange');
      }
    });
  
      registracijaDugme.on('click', function() {
        var email = emailInput.val().trim();
  
        if (email === '') {
          emailInput.next('.error-message').remove();
          emailInput.after('<div class="error-message">Нисте унели имејл</div>');
          emailInput.css('outline', '2px solid orange');
        }
      });
  
      emailInput.on('input', function() {
        if (email != ''){
          emailInput.next('.error-message').remove();
          emailInput.css('outline', 'none');
          emailInput.css('box-shadow', '0 0 5px magenta');
      }});
  
      $('#lokacija').hide();
      $('#lokacija_label').hide();
  
      $('#uloga').on('change', function(e){
        if($('#uloga').val() == "2"){
            $('#lokacija').show();
            $('#lokacija_label').show();
        }else{
            $('#lokacija').hide();
            $('#lokacija_label').hide();
        }
    });
  
    $('#kreiranje_forma').on('submit', function (e) {
      e.preventDefault();
  
    var poruka;
    var forma = new FormData();
    forma.append("name", $('#ime_prezime').val());
    forma.append("email", $('#email').val());
    if (telefon != ''){
      forma.append("phone", $('#telefon').val());
    }
    forma.append("password", $('#lozinka').val());
    forma.append("userRoleId", $('#uloga').val());
    forma.append("locationId", $('#lokacija').val());
    forma.append("apitoken", $('meta[name="apitoken"]').attr('content'));

    // console.log(localStorage.getItem("token"));
    // za proveru
    var token = localStorage.getItem("token");
 

    var config = {
      url: "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik",
      method: "POST",
      timeout: 0,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      processData: false,
      contentType: false,
      data: forma,
      dataType: "json",
      success: function (odgovor) {
        if (odgovor.error !== undefined) {
          console.log(odgovor);
          // poruka = odgovor.responseJSON.message;
          // registracijaDugme.next(".error-message2").remove();
          // registracijaDugme.after('<div class="error-message2">' + poruka + "</div>");
          $('#email').val('');
        } else {
          console.log(odgovor);
          window.location = 'korisnici.html';
        }
      },
      error: function (odgovor) {
        console.log(odgovor);
        poruka = odgovor.responseJSON.message;
        registracijaDugme.next(".error-message2").remove();
        registracijaDugme.after('<div class="error-message2">' + poruka + "</div>");
      },
    };

    $.ajax(config);
  });
});