function hesaplaKreatin() {
    const result = validateInputAndGetResultDiv("k_kilo", "kreatinSonuc");
    if (!result) return;

    const kilo = result.value;
    const resultDiv = result.resultDiv;

    // ORİJİNAL HESAPLAMALAR (Hiç değişmedi)
    const idameMin = (kilo * 0.03).toFixed(1);
    const idameMax = (kilo * 0.05).toFixed(1);
    const asiriGereksinimMin = (kilo * 0.05).toFixed(1);
    const asiriGereksinimMax = (kilo * 0.10).toFixed(1);
    const yuklemeDoz = (kilo * 0.3).toFixed(1);

    // SADECE İÇERİK KISMI DEĞİŞTİ (Renksiz ve temiz format)
    const content = `
    <div class="result-value">${idameMin} - ${idameMax} g/gün</div>
    <div class="interpretation">
        <p><span class="formula-text">Standart:</span> ${idameMin} - ${idameMax} g <strong><span class="formula">(0.03-0.05 g/kg)</span></strong></p>
        <p><span class="formula-text">Aşırı ihtiyaç(vegan/ağır sporcu):</span> ${asiriGereksinimMin} - ${asiriGereksinimMax} g <strong><span class="formula">(0.05-0.1 g/kg)</span></strong></p>
        <p><span class="formula-text">Yükleme:</span> ${yuklemeDoz} g <strong><span class="formula">(0.3 g/kg × 5-7 gün)</span></strong></p>
    </div>
`;


    showResult(resultDiv, content);
}