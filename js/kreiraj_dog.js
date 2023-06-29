
$(document).ready(function() {
$('#kreiranje_forma').on('submit', function (e) {
 e.preventDefault();
var forma = new FormData();
forma.append("slika", document.getElementById('slika').files[0]);
forma.append("slug", document.getElementById('slug').value);
forma.append("naslov", document.getElementById('naslov').value);
forma.append("opis", document.getElementById('opis').value);
forma.append("kratakOpis", document.getElementById('kratki_opis').value);
forma.append("apitoken", $('meta[name="apitoken"]').attr('content'));

var token = localStorage.getItem("token");
    var apitoken = $('meta[name="apitoken"]').attr("content");

var config = {
  url: "https://vsis.mef.edu.rs/projekat/ulaznice/public_html/api/dogadjaj?apitoken="+apitoken,
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
    } else {
      console.log(odgovor);
    }
  },
  error: function (odgovor) {
    console.log(odgovor);
  },
};

$.ajax(config);
});
});
