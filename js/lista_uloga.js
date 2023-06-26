$(document).ready(function() {
    var apitoken = $('meta[name="apitoken"]').attr("content");
    var ulogeURL = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/uloga'+'?apitoken='+apitoken;
    var korisniciURL = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik'+'?apitoken='+apitoken;;
    var token = localStorage.getItem("token");


    $.ajax({
      url: ulogeURL,
      type: 'GET',
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      success: function(ulogeOdg) {
        var uloge = ulogeOdg;
        var tbody = $('#kontent');
  
        $.ajax({
          url: korisniciURL,
          type: 'GET',
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          success: function(korisniciOdg) {
            var korisnici = korisniciOdg;
  
            $.each(uloge, function(index, uloga) {
              var brojKorisnika = korisnici.filter(function(korisnik) {
                return korisnik.uloga.id === uloga.id;
              }).length;
  
              uloga.broj_korisnika = brojKorisnika;
  
              var red = $('<tr>');
              red.append($('<td>').text(uloga.id));
              red.append($('<td>').text(uloga.naziv));
              red.append($('<td>').text(uloga.opis));
              red.append($('<td>').text(uloga.broj_korisnika).addClass('broj-korisnika'));
  
              red.find('.broj-korisnika').click(function() {

              });
  
              tbody.append(red);
            });
          },
          error: function(odgovor) {
            console.log(odgovor);
          }
        });
      },
      error: function(odgovor) {
        console.log(odgovor);
      }
    });
  });