// Fitness-hesaplama/js/sitrulinHesaplayici.js
// Bu dosyanın çalışabilmesi için common.js'in HTML'de önce yüklenmesi gerekir.
function hesaplaSitrulin() {
    const result = validateInputAndGetResultDiv("s_kilo", "sitrulinSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const minDoz = (kilo * 0.10).toFixed(1);
    const maxDoz = (kilo * 0.12).toFixed(1);
    const content = `
        <div class="result-value">${minDoz} - ${maxDoz} g/gün</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için <strong> 0.10 - 0.12 gram <strong>.</p>
        </div>
    `;

    showResult(resultDiv, content);
}
