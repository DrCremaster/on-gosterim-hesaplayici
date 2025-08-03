function hesaplaBcaa() {
  const kiloInput = document.getElementById("bcaa_kilo");
  const sonucDiv = document.getElementById("bcaaSonuc");
  const kilo = parseFloat(kiloInput.value);

  if (isNaN(kilo) || kilo <= 0) {
    sonucDiv.innerHTML = "<span class='input-warning'>Lütfen geçerli bir kilonuzu girin.</span>";
    return;
  }

  // Standart kullanım: 0.03-0.05 g/kg/gün
  const standartMinDoz = (kilo * 0.03).toFixed(1);
  const standartMaxDoz = (kilo * 0.05).toFixed(1);

  // Ağır egzersiz için kullanım: 0.1 g/kg/gün
  const agirEgzersizDoz = (kilo * 0.1).toFixed(1);

  const content = `
    <div class="result-value">${standartMinDoz} - ${standartMaxDoz} g/gün</div>
    <div class="interpretation">
      <p class="formula-text">Standart Kullanım: ${standartMinDoz} - ${standartMaxDoz} g <strong>(0.03-0.05 g/kg)</strong></p>
      <p class="formula-text">Ağır Egzersiz: ${agirEgzersizDoz} g <strong>(0.1 g/kg)</strong></p>
    </div>
  `;
  sonucDiv.innerHTML = content;
}
