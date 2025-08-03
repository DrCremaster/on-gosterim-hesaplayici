function hesaplaEaa() {
  const kiloInput = document.getElementById('eaa_kilo');
  const sonucAlani = document.getElementById('eaaSonuc');
  const uyariAlani = document.getElementById('eaa_kilo_warning');

  let kilo = parseFloat(kiloInput.value);

  if (isNaN(kilo) || kilo <= 0) {
    uyariAlani.textContent = 'Lütfen geçerli bir kilo değeri girin.';
    sonucAlani.innerHTML = '';
    return;
  } else {
    uyariAlani.textContent = '';
  }

  const dusukDoz = (kilo * 0.1).toFixed(1);
  const yuksekDoz = (kilo * 0.3).toFixed(1);

  sonucAlani.innerHTML = `
    <div class="result-value">${dusukDoz}g - ${yuksekDoz}g</div>
    <div class="interpretation">
      <p class="formula">Kilonuzun her kilogramı için <strong>0.1g - 0.3g</strong>.</p>
    </div>
  `;
}