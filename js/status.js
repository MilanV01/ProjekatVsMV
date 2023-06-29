function kreirajKomponentuStatusaKorisnika() {
    const header = document.createElement('header');
    header.style.display = 'flex';
    header.style.justifyContent = 'flex-end';
    header.style.alignItems = 'center';
    header.style.padding = '10px';

    const statusKorisnika = document.createElement('div');
    statusKorisnika.id = 'status-korisnika';
    statusKorisnika.style.marginRight = '10px';
    statusKorisnika.style.color = '#BBFEBC';  

    const infoKorisnika = document.createElement('div');
    infoKorisnika.textContent = '';

    const dugmePrijava = document.createElement('button');
    dugmePrijava.id = 'dugme-prijava';
    dugmePrijava.textContent = 'Prijava';
    dugmePrijava.style.background = 'purple';  
    dugmePrijava.style.color = '#BBFEBC';  
    dugmePrijava.style.padding = '8px 16px';  
    dugmePrijava.style.borderRadius = '10px';  
    dugmePrijava.style.marginTop = '10px';
    dugmePrijava.style.marginLeft = '33%';
    dugmePrijava.addEventListener('click', function() {
      window.location.href = 'prijava.html';  
    });

    statusKorisnika.appendChild(infoKorisnika);
    statusKorisnika.appendChild(dugmePrijava);
    header.appendChild(statusKorisnika);

    document.documentElement.insertBefore(header, document.body);

    const tipKorisnika = localStorage.getItem('type');
    if (tipKorisnika) {
      infoKorisnika.textContent = `Пријављен као: ${tipKorisnika}`;
    }
}

kreirajKomponentuStatusaKorisnika();
