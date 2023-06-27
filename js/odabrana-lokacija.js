$(document).ready(function() {
    var apitoken = $('meta[name="apitoken"]').attr("content");
    var lokacijaID = uzmiID('id');
    var lokacijaURL = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija/' + lokacijaID + '?apitoken=' + apitoken;
    var token = localStorage.getItem("token");

    $.ajax({
        url: lokacijaURL,
        type: 'GET',
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
        },
        success: function(lokacijaOdg) {
            $('#lokacija-id').val(lokacijaOdg.id);
            $('#naziv').val(lokacijaOdg.naziv);
            $('#adresa').val(lokacijaOdg.adresa);
            $('#grad').val(lokacijaOdg.grad);
            $('#opis').val(lokacijaOdg.opis);

            var radnoVremeHTML = '';
            var dani = ['Понедељак', 'Уторак', 'Среда', 'Четвртак', 'Петак', 'Субота', 'Недеља'];

            for (var i = 1; i <= 7; i++) {
                radnoVremeHTML += '<label for="radno-vreme-dan-' + i + '"> ' + dani[i-1] + ':</label>';

                var radnoVremeDan = lokacijaOdg.radnoVreme.find(function(dan) {
                    return dan.dan === i.toString();
                });

                var odSat = '-';
                var odMin = '-';
                var doSat = '-';
                var doMin = '-';

                if (radnoVremeDan) {
                    odSat = Math.floor(radnoVremeDan.od / 60);
                    odMin = radnoVremeDan.od % 60;
                    doSat = Math.floor(radnoVremeDan.do / 60);
                    doMin = radnoVremeDan.do % 60;
                }

                radnoVremeHTML += '&nbsp&nbsp&nbspОД: <select id="radno-vreme-dan-' + i + '-od-sat" name="radno-vreme-dan-' + i + '-od-sat">';
                for (var j = 0; j <= 23; j++) {
                    var selected = (j === odSat) ? 'selected' : '';
                    radnoVremeHTML += '<option value="' + j + '" ' + selected + '>' + j + '</option>';
                }
                radnoVremeHTML += '</select>';

                radnoVremeHTML += '<select id="radno-vreme-dan-' + i + '-od-min" name="radno-vreme-dan-' + i + '-od-min">';
                for (var k = 0; k <= 59; k++) {
                    var selected = (k === odMin) ? 'selected' : '';
                    radnoVremeHTML += '<option value="' + k + '" ' + selected + '>' + k + '</option>';
                }
                radnoVremeHTML += '</select>';

                radnoVremeHTML += '&nbspДО: <select id="radno-vreme-dan-' + i + '-do-sat" name="radno-vreme-dan-' + i + '-do-sat">';
                for (var j = 0; j <= 23; j++) {
                    var selected = (j === doSat) ? 'selected' : '';
                    radnoVremeHTML += '<option value="' + j + '" ' + selected + '>' + j + '</option>';
                }
                radnoVremeHTML += '</select>';

                radnoVremeHTML += '<select id="radno-vreme-dan-' + i + '-do-min" name="radno-vreme-dan-' + i + '-do-min">';
                for (var k = 0; k <= 59; k++) {
                    var selected = (k === doMin) ? 'selected' : '';
                    radnoVremeHTML += '<option value="' + k + '" ' + selected + '>' + k + '</option>';
                }
                radnoVremeHTML += '</select>';
            }

            $('#radno-vreme-container').html(radnoVremeHTML);
        }
    });

    $('#izmena-lokacije').submit(function(event) {
        event.preventDefault();
        var workingHours = [];
        for (var i = 1; i <= 7; i++) {
            var odSat = $('#radno-vreme-dan-' + i + '-od-sat').val();
            var odMin = $('#radno-vreme-dan-' + i + '-od-min').val();
            var doSat = $('#radno-vreme-dan-' + i + '-do-sat').val();
            var doMin = $('#radno-vreme-dan-' + i + '-do-min').val();
            
            if (odSat !== '0' || odMin !== '0' || doSat !== '0' || doMin !== '0') {
                var radnoVremeDan = {
                    dan: i.toString(),
                    od: parseInt(odSat) * 60 + parseInt(odMin),
                    do: parseInt(doSat) * 60 + parseInt(doMin)
                };
                
                workingHours.push(radnoVremeDan);
            }
        }
        
        var forma = {
            name: $('#naziv').val(),
            address: $('#adresa').val(),
            city: $('#grad').val(),
            description: $('#opis').val(),
            workingHours: JSON.stringify(workingHours),
            apitoken: $('meta[name="apitoken"]').attr('content')
        };
        
        var token = localStorage.getItem("token");

    
    
        $.ajax({
            url: 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija/' + lokacijaID+ '?apitoken=' + apitoken,
            type: 'PATCH',
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
            },
            processData: false,
            data: $.param(forma),
            dataType: "json",
            success: function() {
                prikaziPoruku('Локација је успешно измењена!', 'success');
            },
            error: function(odgovor) {
                var greska = odgovor.responseJSON.errors.name[0];
                prikaziPoruku('Дошло је до грешке приликом измене локације: ' + greska, 'error');
            }
        });
    });
    
});

function prikaziPoruku(poruka, tip) {
    var porukaElement = $('#poruka');
    porukaElement.text(poruka);
    porukaElement.removeClass().addClass(tip);
    porukaElement.removeClass('skriven');
}
function uzmiID(id) {
var pronadji = RegExp('[?&]' + id + '=([^&]*)').exec(window.location.search);
return pronadji && decodeURIComponent(pronadji[1].replace(/\+/g, ' '));
}