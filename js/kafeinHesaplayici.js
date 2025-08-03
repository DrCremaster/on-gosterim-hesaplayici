// Fitness-hesaplama/js/kafeinHesaplayici.js
// Bu dosyanın çalışabilmesi için common.js'in HTML'de önce yüklenmesi gerekir.
function hesaplaKafein() {
    const result = validateInputAndGetResultDiv("c_kilo", "kafeinSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const alt = kilo * 3;
    const ust = kilo * 6;
    const content = `
        <div class="result-value">${alt.toFixed(0)} - ${ust.toFixed(0)} mg</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için <strong> 3 - 6 mg </strong> .</p>
        </div>
    `;

    showResult(resultDiv, content);
}
