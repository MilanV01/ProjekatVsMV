$(document).ready(function() {
    var apitoken = $('meta[name="apitoken"]').attr("content");
    var lokacijeURL = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija?apitoken=' + apitoken;
    var token = localStorage.getItem("token");

    var daniUNedelji = ['Понедељак', 'Уторак', 'Среда', 'Четвртак', 'Петак', 'Субота', 'Недеља'];

    $.ajax({
      url: lokacijeURL,
      type: 'GET',
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      success: function(odgovor) {
        var tabela = $('#lokacijeBody');

        $.each(odgovor, function(index, lokacija) {
          var red = '<tr>';
          red += '<td>' + lokacija.id + '</td>';
          red += '<td>' + lokacija.naziv + '</td>';
          red += '<td>' + lokacija.grad + '</td>';
          red += '<td>' + lokacija.adresa + '</td>';
          red += '<td>' + lokacija.opis + '</td>';
          red += '<td>';

          $.each(lokacija.radnoVreme, function(day, time) {
            var nazivDana = daniUNedelji[day];
            red += '<div><strong>' + nazivDana + '</strong> ' + konvertujMinute(time.od) + '-' + konvertujMinute(time.do) + '</div>';
          });

          red += '</td>';
          
          var brojBlagajnika = lokacija.blagajnici.length;
          red += '<td>' + brojBlagajnika + '</td>';
          
          var brojDogadjaja = lokacija.dogadjaji.length;
          red += '<td>' + brojDogadjaja + '</td>';
          

          red += '<td><button class="izmeni">Измени</button><button class="obrisi">Обриши</button></td>';
          red += '</tr>';

          tabela.append(red);
        });
      }
    });

    function konvertujMinute(minuti) {
      var sati = Math.floor(minuti / 60);
      var mins = minuti % 60;

      var formatiraniSati = ('0' + sati).slice(-2);
      var formatiraniMinuti = ('0' + mins).slice(-2);

      return formatiraniSati + ':' + formatiraniMinuti;
    }

    $(document).on('click', '.izmeni', function(event) {
      event.preventDefault();
      
      var idLokacije = $(this).closest('tr').find('td:first').text();
      
      window.location.href = 'odabrana_lokacija.html?id=' + idLokacije;
  });

  $(document).on('click', '.obrisi', function(event) {
    event.preventDefault();
    
    var idLokacije = $(this).closest('tr').find('td:first').text();
    console.log(idLokacije);
    if (confirm("Da li ste sigurni da želite da obrišete korisnika?")) {
        $.ajax({
            url: 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija/' + idLokacije + '?apitoken=' + apitoken,
            type: 'DELETE',
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            success: function() {
                alert('Lokacija je uspešno obrisana!, osvezite stranicu.');
            },
            error: function(odgovor) {
                var greska = odgovor.odgovorJSON.message;
                alert('Došlo je do greške prilikom brisanja lokacije: ' + greska);
            }
        });
    }
});
  });