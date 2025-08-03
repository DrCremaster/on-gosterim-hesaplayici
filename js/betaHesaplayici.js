// Fitness-hesaplama/js/betaHesaplayici.js
// Bu dosyanın çalışabilmesi için common.js'in HTML'de önce yüklenmesi gerekir.
function hesaplaBeta() {
    const result = validateInputAndGetResultDiv("b_kilo", "betaSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const minDoz = (kilo * 0.065).toFixed(1);
    const maxDoz = (kilo * 0.080).toFixed(1);
    const content = `
        <div class="result-value">${minDoz} - ${maxDoz} g/gün</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için <strong>0.065 - 0.080 gram</strong> .</p>
        </div>
    `;

    showResult(resultDiv, content);
}
