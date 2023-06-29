$(document).ready(function() {
    var token = localStorage.getItem("token");
  
    $('#radno-vreme-div').on('change', '.sat-od', function() {
      var radnoVremeOd = $(this).val();
      var minutOd = $(this).siblings('.minut-od');
      var satDo = $(this).siblings('.sat-do');
      var minutDo = $(this).siblings('.minut-do');
  
      if (radnoVremeOd) {
        satDo.prop('disabled', false);
        minutDo.prop('disabled', false);
      } else {
        satDo.prop('disabled', true);
        minutDo.prop('disabled', true);
      }
    });
  
    $('#kreiranje-lokacije').submit(function(event) {
      event.preventDefault();
      var workingHours = [];
      for (var i = 1; i <= 7; i++) {
        var odSat = $('.dan-container:nth-child(' + i + ') .sat-od').val();
        var odMin = $('.dan-container:nth-child(' + i + ') .minut-od').val();
        var doSat = $('.dan-container:nth-child(' + i + ') .sat-do').val();
        var doMin = $('.dan-container:nth-child(' + i + ') .minut-do').val();
  
        if (odSat !== '' || odMin !== '' || doSat !== '' || doMin !== '') {
          var radnoVremeDan = {
            dan: i,
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
  
      console.log(workingHours);
  
      $.ajax({
        url: 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija',
        type: 'POST',
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
        processData: false,
        data: $.param(forma),
        dataType: "json",
        success: function() {
          prikaziPoruku('Локација је успешно креирана!', 'success');
        },
        error: function(odgovor) {
          var greska = odgovor.responseJSON.errors.name[0];
          prikaziPoruku('Дошло је до грешке приликом креирања локације: ' + greska, 'error');
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
  