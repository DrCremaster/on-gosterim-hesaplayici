function hesaplaGlutamin() {
  const kiloInput = document.getElementById("glutamin_kilo");
  const sonucDiv = document.getElementById("glutaminSonuc");
  const kilo = parseFloat(kiloInput.value);

  if (isNaN(kilo) || kilo <= 0) {
    sonucDiv.innerHTML = "<span class='input-warning'>Lütfen geçerli bir kilonuzu girin.</span>";
    return;
  }

  const minDoz = (kilo * 0.1).toFixed(1);
  const maxDoz = (kilo * 0.3).toFixed(1);

  const content = `
    <div class="result-value">${minDoz} - ${maxDoz} g/gün</div>
    <div class="interpretation">
      <p class="formula">Kilonuzun her kilogramı için <strong>0.1 - 0.3 gram</strong> .</p>
    </div>
  `;
  sonucDiv.innerHTML = content;
}
