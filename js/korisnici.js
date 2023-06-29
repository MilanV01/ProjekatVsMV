$(document).ready(function() {
    var apitoken = $('meta[name="apitoken"]').attr("content");
    var korisniciURL = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik?apitoken=' + apitoken;
    var token = localStorage.getItem("token");

    $.ajax({
        url: korisniciURL,
        type: 'GET',
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
        success: function(korisniciOdg) {
            var tabela = $('#korisnici tbody');

            $.each(korisniciOdg, function(index, korisnik) {
                var red = '<tr>';
                red += '<td>' + korisnik.id + '</td>';
                red += '<td>' + korisnik.imePrezime + '</td>';
                red += '<td>' + korisnik.email + '</td>';
                red += '<td>' + korisnik.telefon + '</td>';

                if (korisnik.lokacija) {
                    red += '<td><a href="odabrana_lokacija.html?id=' + korisnik.lokacija.id + '">' + korisnik.lokacija.naziv + '</a></td>';
                } else {
                    red += '<td></td>';
                }

                red += '<td><a href="uloga.html?id=' + korisnik.uloga.id + '">' + korisnik.uloga.naziv + '</a></td>';

                if (korisnik.uloga.naziv === 'благајник') {
                    red += '<td><a href="dogadjaji.html?id=' + korisnik.id + '">/</a></td>';
                } else {
                    red += '<td></td>';
                }

                if (korisnik.uloga.naziv === 'регистровани корисник' || korisnik.uloga.naziv === 'блокирани корisnik') {
                    red += '<td>/</td>';
                } else {
                    red += '<td></td>';
                }

                red += '<td><button class="izmeni">Измени</button><button class="obrisi">Обриши</button></td>';

                red += '</tr>';

                tabela.append(red);
            });
        }
    });
    $(document).on('click', '.izmeni', function(event) {
        event.preventDefault();
        
        // Dobijanje ID-a korisnika iz tabele
        var idKorisnika = $(this).closest('tr').find('td:first').text();
        
        // Redirekcija na stranicu za izmenu korisnika sa odgovarajućim ID-om
        window.location.href = 'izmena_korisnika.html?id=' + idKorisnika;
    });

    $(document).on('click', '.obrisi', function(event) {
        event.preventDefault();
        
        var idKorisnika = $(this).closest('tr').find('td:first').text();
        if (confirm("Da li ste sigurni da želite da obrišete korisnika?")) {
            $.ajax({
                url: 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik/' + idKorisnika + '?apitoken=' + apitoken,
                type: 'DELETE',
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
                success: function() {
                    alert('Korisnik je uspešno obrisan!, osvezite stranicu.');
                },
                error: function(odgovor) {
                    var greska = odgovor.responseJSON.message;
                    alert('Došlo je do greške prilikom brisanja korisnika: ' + greska);
                }
            });
        }
    });

});
