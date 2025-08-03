// Fitness-hesaplama/js/karnitinHesaplayici.js
// Bu dosyanın çalışabilmesi için common.js'in HTML'de önce yüklenmesi gerekir.
function hesaplaKarnitin() {
    const result = validateInputAndGetResultDiv("l_kilo", "karnitinSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const minDozMg = (kilo * 20).toFixed(0);  // 15 mg/kg
const maxDozMg = (kilo * 40).toFixed(0);  // 30 mg/kg

const content = `
  <div class="result-value">${minDozMg} - ${maxDozMg} mg/gün</div>
  <div class="interpretation">
    <p>Kilonuzun her kilogramı için <strong>20-40 mg</strong>.</p>
    <p class="kirmizi">NOT: 4 gram üzeri dozlar bilimsel olarak kanıtlanmış ek fayda sağlamaz.</p>
  </div>
`;

    showResult(resultDiv, content);
}
