// Fitness-hesaplama/js/topluSupplementHesaplayici.js
function hesaplaToplu() {
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const kiloInput = document.getElementById("toplu_kilo");
    const hedefInput = document.getElementById("toplu_hedef");
    const secilenler = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const topluSonucDiv = document.getElementById("topluSonuc");

    const kilo = parseFloat(kiloInput.value);
    let isValid = true;

    if (isNaN(kilo) || kilo <= 0) {
        document.getElementById('toplu_kilo_warning').textContent = "Lütfen geçerli (pozitif) bir kilonuzu girin.";
        isValid = false;
    }
    if (secilenler.length === 0) {
        showResult(topluSonucDiv, "Lütfen en az bir supplement seçin.", false);
        return;
    }
    if (!isValid) {
        showResult(topluSonucDiv, "Lütfen tüm gerekli alanları doğru şekilde doldurun.", false);
        return;
    }

    let output = "<div class='result-value'>Toplu Supplement Önerileri</div><div class='interpretation'>";

    // Protein (proteinHesaplayici.js ile aynı)
    if (document.getElementById("chk_protein").checked) {
        const hedef = hedefInput.value;
        let min = 1.4, max = 1.8;
        if (hedef === "alma") { min = 1.6; max = 2.2; }
        else if (hedef === "verme") { min = 1.8; max = 2.4; }
        output += `<p><strong>Protein:</strong> ${(kilo * min).toFixed(1)} – ${(kilo * max).toFixed(1)} g/gün</p>`;
    }

    // Kreatin (kreatinHesaplayici.js ile aynı)
    if (document.getElementById("chk_kreatin").checked) {
        const idameMin = (kilo * 0.03).toFixed(1);
        const idameMax = (kilo * 0.05).toFixed(1);
        output += `<p><strong>Kreatin:</strong> ${idameMin} – ${idameMax} g/gün</p>`;
    }

    // Beta-Alanin (betaHesaplayici.js ile aynı)
    if (document.getElementById("chk_beta").checked) {
        const minDoz = (kilo * 0.065).toFixed(1);
        const maxDoz = (kilo * 0.080).toFixed(1);
        output += `<p><strong>Beta-Alanin:</strong> ${minDoz} – ${maxDoz} g/gün</p>`;
    }

    // Sitrülin (sitrulinHesaplayici.js ile aynı)
    if (document.getElementById("chk_sitrulin").checked) {
        const minDoz = (kilo * 0.10).toFixed(1);
        const maxDoz = (kilo * 0.12).toFixed(1);
        output += `<p><strong>Sitrülin Malat:</strong> ${minDoz} – ${maxDoz} g/gün</p>`;
    }

    // Karnitin (karnitinHesaplayici.js ile aynı)
    if (document.getElementById("chk_karnitin").checked) {
        const minDozMg = (kilo * 15).toFixed(0);
        const maxDozMg = (kilo * 30).toFixed(0);
        output += `<p><strong>L-Karnitin:</strong> ${minDozMg} – ${maxDozMg} mg/gün</p>`;
    }

    // Kafein (kafeinHesaplayici.js ile aynı)
    if (document.getElementById("chk_kafein").checked) {
        const alt = (kilo * 3).toFixed(0);
        const ust = (kilo * 6).toFixed(0);
        output += `<p><strong>Kafein:</strong> ${alt} – ${ust} mg</p>`;
    }

    output += "</div>";
    showResult(topluSonucDiv, output);
}