// js/yagOraniHesaplayici.js
// Bu dosyanın çalışabilmesi için common.js'in HTML'de önce yüklenmesi gerekir.
function hesaplaYagOrani() {
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const cinsiyetInput = document.getElementById('y_cinsiyet');
    const boyInput = document.getElementById("y_boy");
    const kiloInput = document.getElementById("y_kilo");
    const belInput = document.getElementById("y_bel");
    const boyunInput = document.getElementById("y_boyun");
    const kalcaInput = document.getElementById("y_kalca");

    const cinsiyet = cinsiyetInput.value;
    const boy = parseFloat(boyInput.value);
    const kilo = parseFloat(kiloInput.value);
    const bel = parseFloat(belInput.value);
    const boyun = parseFloat(boyunInput.value);
    const kalca = parseFloat(kalcaInput.value);

    const yagSonucDiv = document.getElementById("yagSonuc");
    const vkiSonucDiv = document.getElementById("vkiSonuc");

    let isValid = true;

    if (!cinsiyet) {
        document.getElementById('y_cinsiyet_warning').textContent = "Lütfen cinsiyetinizi seçin.";
        isValid = false;
    }
    if (isNaN(boy) || boy <= 0) {
        document.getElementById('y_boy_warning').textContent = "Lütfen boyunuzu girin.";
        isValid = false;
    }
    if (isNaN(kilo) || kilo <= 0) {
        document.getElementById('y_kilo_warning').textContent = "Lütfen kilonuzu girin.";
        isValid = false;
    }
    if (isNaN(bel) || bel <= 0) {
        document.getElementById('y_bel_warning').textContent = "Lütfen bel çevrenizi girin.";
        isValid = false;
    }
    if (isNaN(boyun) || boyun <= 0) {
        document.getElementById('y_boyun_warning').textContent = "Lütfen boyun çevrenizi girin.";
        isValid = false;
    }
    if (cinsiyet === 'kadin' && (isNaN(kalca) || kalca <= 0)) {
        document.getElementById('y_kalca_warning').textContent = "Kadınlar için kalça çevresi gereklidir.";
        isValid = false;
    }

    if (!isValid) {
        showResult(yagSonucDiv, "Lütfen tüm gerekli alanları geçerli değerlerle doldurun.", false);
        vkiSonucDiv.innerHTML = "";
        return;
    }

    let yagOrani = 0;
    let yagOraniFormulaText = "ABD Donanması Yöntemi kullanılmıştır. Max sapma payı ±%1-3'tür";
    if (cinsiyet === 'erkek') {
        yagOrani = 495 / (1.0324 - 0.19077 * Math.log10(bel - boyun) + 0.15456 * Math.log10(boy)) - 450;
    } else if (cinsiyet === 'kadin') {
        yagOrani = 495 / (1.29579 - 0.35004 * Math.log10(bel + kalca - boyun) + 0.22100 * Math.log10(boy)) - 450;
    }

    const vki = kilo / ((boy / 100) ** 2);
    const vkiFormulaText = `Formül: Kilo (kg) / (Boy (metre) ^ 2)`;

    let yagKategori = '';
    if (cinsiyet === 'erkek') {
        if (yagOrani >= 2 && yagOrani <= 5) yagKategori = 'Temel Yağ';
        else if (yagOrani >= 6 && yagOrani <= 13) yagKategori = 'Atletik';
        else if (yagOrani >= 14 && yagOrani <= 17) yagKategori = 'Fitness';
        else if (yagOrani >= 18 && yagOrani <= 24) yagKategori = 'Ortalama';
        else if (yagOrani >= 25) yagKategori = 'Obez';
    } else {
        if (yagOrani >= 10 && yagOrani <= 13) yagKategori = 'Temel Yağ';
        else if (yagOrani >= 14 && yagOrani <= 20) yagKategori = 'Atletik';
        else if (yagOrani >= 21 && yagOrani <= 24) yagKategori = 'Fitness';
        else if (yagOrani >= 25 && yagOrani <= 31) yagKategori = 'Ortalama';
        else if (yagOrani >= 32) yagKategori = 'Obez';
    }

    let vkiKategori = '';
    if (vki < 18.5) vkiKategori = 'Zayıf';
    else if (vki >= 18.5 && vki <= 24.9) vkiKategori = 'Normal Kilolu';
    else if (vki >= 25.0 && vki <= 29.9) vkiKategori = 'Fazla Kilolu';
    else if (vki >= 30.0 && vki <= 34.9) vkiKategori = 'Obezite (1. Derece)';
    else if (vki >= 35.0 && vki <= 39.9) vkiKategori = 'Obezite (2. Derece)';
    else if (vki >= 40.0) vkiKategori = 'Morbid Obezite (3. Derece)';


    showResult(yagSonucDiv, `Tahmini Vücut Yağ Oranınız: <b>%${yagOrani.toFixed(1)}</b><br><br>Bu sonuca göre <strong>${yagKategori}</strong> kategorisindesiniz.<div class="formula">${yagOraniFormulaText}</div>`);
    showResult(vkiSonucDiv, `Vücut Kitle İndeksiniz (VKİ): <b>${vki.toFixed(1)}</b><br><br>Bu sonuca göre <strong>${vkiKategori}</strong> kategorisindesiniz.<div class="formula">${vkiFormulaText}</div>`);
}
