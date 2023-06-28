$(document).ready(function() {
    var apitoken = $('meta[name="apitoken"]').attr("content");
    var ulogaID = uzmiID('id'); // Funkcija za dobijanje vrednosti ID-a iz URL-a
    console.log(ulogaID);
    var ulogeURL = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/uloga?apitoken=' + apitoken;
    var token = localStorage.getItem("token");

    $.ajax({
        url: ulogeURL,
        type: 'GET',
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
        success: function(uloge) {
            var trazenaUloga = null;

            for (var i = 0; i < uloge.length; i++) {
                if (uloge[i].id == ulogaID) {
                    trazenaUloga = uloge[i];
                    break;
                }
            }
            if (trazenaUloga) {
                $('#ID').text(trazenaUloga.id);
                $('#naziv').text(trazenaUloga.naziv);
                $('#opis').text(trazenaUloga.opis);
            } else {
                alert('Uloga sa traženim ID-om nije pronađena.');
            }
        },
        error: function() {
            alert('Došlo je do greške prilikom dobijanja informacija o ulogama.');
        }
    });
      function uzmiID(id) {
        var pronadji = RegExp('[?&]' + id + '=([^&]*)').exec(window.location.search);
        return pronadji && decodeURIComponent(pronadji[1].replace(/\+/g, ' '));
        }
});
