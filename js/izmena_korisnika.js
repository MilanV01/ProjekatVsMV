        $(document).ready(function() {
            var apitoken = $('meta[name="apitoken"]').attr("content");
            var idKorisnika = uzmiID('id');
            var korisnikURL = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik/' + idKorisnika + '?apitoken=' + apitoken;
            var ulogeURL = 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/uloga?apitoken=' + apitoken;
            var token = localStorage.getItem("token");
          
            $.ajax({
              url: korisnikURL,
              type: 'GET',
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
              },
              success: function(korisnik) {
                $('#idKorisnika').val(korisnik.id);
                $('#imePrezime').val(korisnik.imePrezime);
                $('#email').val(korisnik.email);
                $('#telefon').val(korisnik.telefon);
                $('#lozinka').val(korisnik.lozinka);
          
                $.ajax({
                  url: ulogeURL,
                  type: 'GET',
                  headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                  },
                  success: function(uloge) {
                    var ulogaSelect = $('#uloga');
                    uloge.forEach(function(uloga) {
                      ulogaSelect.append($('<option>', {
                        value: uloga.id,
                        text: uloga.naziv
                      }));
                    });
          
                    ulogaSelect.val(korisnik.uloga.id);
          
                    if (korisnik.uloga && korisnik.uloga.naziv === 'благајник') {
                      $('#lokacijaDiv').show(); 
                      $.ajax({
                        url: 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija?apitoken=' + apitoken,
                        type: 'GET',
                        headers: {
                          Accept: "application/json",
                          Authorization: "Bearer " + token,
                        },
                        success: function(lokacije) {
                          var lokacijeSelect = $('#lokacija');
                          lokacije.forEach(function(lokacija) {
                            lokacijeSelect.append($('<option>', {
                              value: lokacija.id,
                              text: lokacija.naziv
                            }));
                          });
          
                          var blagajnikId = korisnik.id; 
          
                          function getNazivLokacije(blagajnikId, lokacije) {
                            for (var i = 0; i < lokacije.length; i++) {
                              for (var j = 0; j < lokacije[i].blagajnici.length; j++) {
                                if (lokacije[i].blagajnici[j].id === blagajnikId) {
                                  return lokacije[i].id;
                                }
                              }
                            }
                          }
          
                          // Dobijanje naziva lokacije na osnovu ID-ja blagajnika
                          var nazivLokacije = getNazivLokacije(blagajnikId, lokacije);
          
                          lokacijeSelect.val(nazivLokacije);
          
                        },
                        error: function(error) {
                          console.log('greška prilikom dobijanja lokacija.');
                          console.log(error);
                        }
                      });
                    } else {
                      $('#lokacijaDiv').hide();
                    }
                  },
                  error: function(error) {
                    console.log('greška prilikom dobijanja uloga.');
                    console.log(error);
                  }
                });
              },
              error: function(error) {
                console.log('greška prilikom dobijanja korisnika.');
                console.log(error);
              }
            });
          
            function uzmiID(id) {
                var pronadji = RegExp('[?&]' + id + '=([^&]*)').exec(window.location.search);
                return pronadji && decodeURIComponent(pronadji[1].replace(/\+/g, ' '));
                }
          
           function azurirajPrikazLokacije() {
               var uloga = $('#uloga').val();
               var lokacijaElement = document.getElementById("lokacija");

               if (uloga == 2) {
                  if (!lokacijaElement.options.length) {
                    $.ajax({
                     url: 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/lokacija?apitoken=' + apitoken,
                     type: 'GET',
                     headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                      },
                       success: function(lokacije) {
                        var lokacijeSelect = $('#lokacija');
                         lokacije.forEach(function(lokacija) {
                           lokacijeSelect.append($('<option>', {
                             value: lokacija.id,
                             text: lokacija.naziv
                           }));
                         });
                         $('#lokacijaDiv').show();
               
                       },
                       error: function(error) {
                         console.log('greška prilikom dobijanja lokacija.');
                         console.log(error);
                       }
                     });
                   } else {
                     $('#lokacijaDiv').show(); 
                   }
                 } else {
                   $('#lokacijaDiv').hide(); 
               }
            };
          $('#uloga').on('change', function() {
               azurirajPrikazLokacije();
             }); 
           
            $('#izmenaForma').submit(function(event) {
              event.preventDefault();
              var korisnikId = $('#idKorisnika').val();
              var imePrezime = $('#imePrezime').val();
              var email = $('#email').val();
              var telefon = $('#telefon').val();
              var lozinka = $('#lozinka').val();
              var uloga = $('#uloga').val();
              var lokacija = $('#lokacija').val();

              var forma = {
                name: imePrezime,
                email: email,
                phone: telefon,
                password: lozinka,
                userRoleId: uloga,
                locationId: lokacija,
                apitoken: apitoken
              };
          
              $.ajax({
                url: 'https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/korisnik/' + korisnikId + '?apitoken=' + apitoken,
                type: 'PATCH',
                headers: {
                  Accept: "application/json",
                  Authorization: "Bearer " + token,
                },
                processData: false,
                data: $.param(forma),
                dataType: "json",
                success: function() {
                prikaziPoruku('Korisnik je uspešno izmenjen!', 'success');
                },
                error: function(odgovor) {
                    var greska = odgovor.responseJSON.errors;

                     if (greska.email) {
                       greska=odgovor.responseJSON.errors.email[0];
                      }
                      if (greska.phone) {
                        greska=odgovor.responseJSON.errors.phone[0];
                    }
                  prikaziPoruku('Došlo je do greške prilikom izmene korisnika: ' + greska, 'error');
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
