// Fitness-hesaplama/js/proteinHesaplayici.js
// Bu dosyanın çalışabilmesi için common.js'in HTML'de önce yüklenmesi gerekir.
function hesaplaProtein() {
    const result = validateInputAndGetResultDiv("p_kilo", "proteinSonuc", [{
        id: "p_hedef",
        type: "select"
    }]);
    if (!result) return;

    const kilo = result.value;
    const hedef = document.getElementById("p_hedef").value;
    const resultDiv = result.resultDiv;

    let min = 1.4,
        max = 1.8;
    let formulaText = "";
    let recommendation = "";

    if (hedef === "alma") {
        min = 1.6;
        max = 2.2;
        formulaText = `Kilonuzun her kilogramı için <strong>1.6 - 2.2 gram</strong> protein.`;
        recommendation = "Kilo alma döneminde kas gelişimi için yüksek protein alımı önerilir.";
    } else if (hedef === "verme") {
        min = 1.8;
        max = 2.4;
        formulaText = `Kütlenizin her kilogramı için <strong>1.8 - 2.4 gram</strong> protein.`;
        recommendation = "Kilo verme döneminde kas kaybını önlemek için yüksek protein alımı önerilir.";
    } else {
        formulaText = `Kilonuzun her kilogramı için <strong>1.4 - 1.8 gram</strong>   protein.`;
        recommendation = "Kilo koruma döneminde orta düzey protein alımı yeterlidir.";
    }

    const content = `
        <div class="result-value">${(kilo * min).toFixed(1)} - ${(kilo * max).toFixed(1)} gram</div>
        <div class="interpretation">
            <p>${recommendation}</p>
            <p class="formula">${formulaText}</p>
        </div>
    `;

    showResult(resultDiv, content);
}
