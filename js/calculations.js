// Yardımcı fonksiyon: Girişleri doğrular ve sonuç divini döndürür
function validateInputAndGetResultDiv(inputId, resultId, requiredInputs = []) {
    let isValid = true;
    
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const valueInput = document.getElementById(inputId);
    const value = parseFloat(valueInput.value);
    const resultDiv = document.getElementById(resultId);
    const warningSpan = document.getElementById(inputId + '_warning');

    if (isNaN(value) || value <= 0) {
        warningSpan.textContent = "Lütfen geçerli (pozitif) bir değer girin.";
        isValid = false;
    } else {
        warningSpan.textContent = "";
    }

    for (const input of requiredInputs) {
        const el = document.getElementById(input.id);
        const elWarningSpan = document.getElementById(input.id + '_warning');
        let val;
        if (input.type === 'number') {
            val = parseFloat(el.value);
            if (isNaN(val) || val <= 0) {
                elWarningSpan.textContent = "Lütfen geçerli (pozitif) bir değer girin.";
                isValid = false;
            } else {
                elWarningSpan.textContent = "";
            }
        } else if (input.type === 'select') {
            val = el.value;
            if (!val) {
                elWarningSpan.textContent = `Lütfen ${el.options[el.selectedIndex].text.replace('-- ', '').replace(' --', '').toLowerCase()} seçin.`;
                isValid = false;
            } else {
                elWarningSpan.textContent = "";
            }
        }
    }

    if (!isValid) {
        showResult(resultDiv, "Lütfen tüm gerekli alanları doğru şekilde doldurun.", false);
        return null;
    }
    return {
        value,
        resultDiv
    };
}

// Sonuçları göstermek için yardımcı fonksiyon
function showResult(resultDiv, content, isSuccess = true) {
    resultDiv.innerHTML = content;
    resultDiv.style.backgroundColor = isSuccess ? '#f0f7ff' : '#fff3cd';
    resultDiv.style.borderLeftColor = isSuccess ? 'var(--primary-color)' : 'var(--warning-color)';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hesaplaProtein() {
    const result = validateInputAndGetResultDiv("p_kilo", "proteinSonuc", [{
        id: "p_hedef",
        type: "select"
    }]);
    if (!result) return;

    const kilo = result.value;
    const hedef = document.getElementById("p_hedef").value;
    const resultDiv = result.resultDiv;
    
    let min = 1.4, max = 1.8;
    let formulaText = "";
    let recommendation = "";
    
    if (hedef === "alma") {
        min = 1.6; max = 2.2;
        formulaText = `Kilonuzun her kilogramı için 1.6 - 2.2 gram protein.`
        recommendation = "Kilo alma döneminde kas gelişimi için yüksek protein alımı önerilir.";
    } else if (hedef === "verme") {
        min = 1.8; max = 2.4;
        formulaText = `Kütlenizin her kilogramı için 1.8 - 2.4 gram protein.`;
        recommendation = "Kilo verme döneminde kas kaybını önlemek için yüksek protein alımı önerilir.";
    } else {
        formulaText = `Kilonuzun her kilogramı için 1.4 - 1.8 gram protein.`;
        recommendation = "Kilo koruma döneminde orta düzey protein alımı yeterlidir.";
    }

    const content = `
        <div class="result-value">${(kilo * min).toFixed(1)} - ${(kilo * max).toFixed(1)} gram</div>
        <div class="interpretation">
            <p><strong>Önerilen günlük protein alımı:</strong></p>
            <p>${recommendation}</p>
            <p class="formula">${formulaText}</p>
        </div>
    `;
    
    showResult(resultDiv, content);
}

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

function hesaplaKreatin() {
    const result = validateInputAndGetResultDiv("k_kilo", "kreatinSonuc");
    if (!result) return;

    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const idameMin = (kilo * 0.03).toFixed(1);
    const idameMax = (kilo * 0.05).toFixed(1);
    const asiriGereksinimMin = (kilo * 0.05).toFixed(1);
    const asiriGereksinimMax = (kilo * 0.10).toFixed(1);
    const yuklemeDoz = (kilo * 0.3).toFixed(1);

    const content = `
        <div class="result-value">${idameMin} - ${idameMax} g/gün</div>
        <div class="interpretation">
            <p><strong>Günlük Kreatin Dozları:</strong></p>
            <p>- İdame Dozu: <b>${idameMin} – ${idameMax} gram</b> <span class="formula">(Kilonuzun her kilogramı için 0.03 - 0.05 gram)</span></p>
            <p>- Aşırı Gereksinim Dozu: <b>${asiriGereksinimMin} – ${asiriGereksinimMax} gram</b> <span class="formula">(Veganlar, yüksek kas kütlesine sahip bireyler için)</span></p>
            <p>- Yükleme Dozu: <b>${yuklemeDoz} gram</b> <span class="formula">(5-7 gün boyunca alınır)</span></p>
        </div>
    `;
    
    showResult(resultDiv, content);
}

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
            <p class="formula">Kilonuzun her kilogramı için 0.065 - 0.080 gram.</p>
        </div>
    `;
    
    showResult(resultDiv, content);
}

function hesaplaSitrulin() {
    const result = validateInputAndGetResultDiv("s_kilo", "sitrulinSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const minDoz = (kilo * 0.10).toFixed(1);
    const maxDoz = (kilo * 0.15).toFixed(1);
    const content = `
        <div class="result-value">${minDoz} - ${maxDoz} g/gün</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için 0.10 - 0.15 gram.</p>
        </div>
    `;
    
    showResult(resultDiv, content);
}

function hesaplaKarnitin() {
    const result = validateInputAndGetResultDiv("l_kilo", "karnitinSonuc");
    if (!result) return;
    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const minDozMg = (kilo * 15).toFixed(0);
    const maxDozMg = (kilo * 30).toFixed(0);
    const content = `
        <div class="result-value">${minDozMg} - ${maxDozMg} mg/gün</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için 15 - 30 mg. Genel kullanım 2-4 gram arası.Min doz 1 gr max doz günlük 4gr</p>
        </div>
    `;
    
    showResult(resultDiv, content);
}

function hesaplaKreatin() {
    const result = validateInputAndGetResultDiv("k_kilo", "kreatinSonuc");
    if (!result) return;

    const kilo = result.value;
    const resultDiv = result.resultDiv;

    const idameMin = (kilo * 0.03).toFixed(1);
    const idameMax = (kilo * 0.05).toFixed(1);

    const content = `
        <div class="result-value">${idameMin} - ${idameMax} g/gün</div>
        <div class="interpretation">
            <p class="formula">Kilonuzun her kilogramı için 0.03 - 0.05 gram (idame dozu).</p>
        </div>
    `;
    
    showResult(resultDiv, content);
}

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
            <p class="formula">Kilonuzun her kilogramı için 3 - 6 mg.</p>
        </div>
    `;
    
    showResult(resultDiv, content);
}

function hesaplaToplu() {
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    const kiloInput = document.getElementById("toplu_kilo");
    const hedefInput = document.getElementById("toplu_hedef");
    const secilenler = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const topluSonucDiv = document.getElementById("topluSonuc");

    const kilo = parseFloat(kiloInput.value);
    const hedef = hedefInput.value;

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

    if (document.getElementById("chk_protein").checked) {
        if (!hedef) {
            document.getElementById('toplu_hedef_warning').textContent = "Protein için hedef seçimi gerekli.";
            isValid = false;
        } else {
            let min = 1.4, max = 1.8;
            if (hedef === "alma") {
                min = 1.6; max = 2.2;
            } else if (hedef === "verme") {
                min = 1.8; max = 2.4;
            }
            output += `<p><strong>Protein:</strong> ${(kilo * min).toFixed(1)} – ${(kilo * max).toFixed(1)} g/gün</p>`;
        }
    }

    if (!isValid) {
        showResult(topluSonucDiv, "Lütfen tüm gerekli alanları doğru şekilde doldurun.", false);
        return;
    }

    if (document.getElementById("chk_kreatin").checked) {
        const idameMin = (kilo * 0.03).toFixed(1);
        const idameMax = (kilo * 0.05).toFixed(1);
        output += `<p><strong>Kreatin:</strong> ${idameMin} – ${idameMax} g/gün (idame dozu)</p>`;
    }

    if (document.getElementById("chk_beta").checked) {
        const minDoz = (kilo * 0.065).toFixed(1);
        const maxDoz = (kilo * 0.080).toFixed(1);
        output += `<p><strong>Beta-Alanin:</strong> ${minDoz} – ${maxDoz} g/gün</p>`;
    }

    if (document.getElementById("chk_sitrulin").checked) {
        const minDoz = (kilo * 0.10).toFixed(1);
        const maxDoz = (kilo * 0.15).toFixed(1);
        output += `<p><strong>Sitrülin Malat:</strong> ${minDoz} – ${maxDoz} g/gün</p>`;
    }

    if (document.getElementById("chk_karnitin").checked) {
        const minDozMg = (kilo * 15).toFixed(0);
        const maxDozMg = (kilo * 30).toFixed(0);
        output += `<p><strong>L-Karnitin:</strong> ${minDozMg} – ${maxDozMg} mg/gün</p>`;
    }

    if (document.getElementById("chk_kafein").checked) {
        const alt = kilo * 3;
        const ust = kilo * 6;
        output += `<p><strong>Kafein:</strong> ${alt.toFixed(0)} – ${ust.toFixed(0)} mg (antrenman öncesi)</p>`;
    }

    output += "</div>";
    showResult(topluSonucDiv, output);
}

function hesaplaKreatininTahmini() {
  document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

  const genderInput = document.getElementById('gender');
  const ageInput = document.getElementById('age');
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const fatInput = document.getElementById('fat');
  const waterInput = document.getElementById('water');
  const proteinInput = document.getElementById('protein');
  const creatineInput = document.getElementById('creatine');
  const activityInput = document.getElementById('activity');
  const lbmMethodInput = document.getElementById('lbmMethod');

  const gender = genderInput.value;
  const age = +ageInput.value;
  const weight = +weightInput.value;
  const height = +heightInput.value;
  const fat = +fatInput.value;
  const lbmMethod = lbmMethodInput.value;

  let isValid = true;

  if (!gender) {
    document.getElementById('gender_warning').textContent = "Lütfen cinsiyetinizi seçin.";
    isValid = false;
  }
  if (isNaN(age) || age <= 0) {
    document.getElementById('age_warning').textContent = "Lütfen geçerli bir yaş girin.";
    isValid = false;
  }
  if (isNaN(weight) || weight <= 0) {
    document.getElementById('weight_warning').textContent = "Lütfen geçerli bir kilo girin.";
    isValid = false;
  }
  if (isNaN(height) || height <= 0) {
    document.getElementById('height_warning').textContent = "Lütfen geçerli bir boy girin.";
    isValid = false;
  }

  if ((lbmMethod === 'fat' || lbmMethod === 'both') && (isNaN(fat) || fat <= 0 || fat >= 100)) {
    document.getElementById('fat_warning').textContent = "Yağ oranı %0-100 arasında olmalıdır.";
    isValid = false;
  }

  const kreatininResultCard = document.getElementById('kreatininResultCard');
  const kreatininInterpretation = document.getElementById('kreatininInterpretation');
  const kreatininResultValue = document.getElementById('kreatininResultValue');

  if (!isValid) {
    kreatininResultValue.textContent = "0.00 - 0.00 mg/dL";
    kreatininInterpretation.textContent = "Lütfen tüm gerekli alanları doğru şekilde doldurun.";
    kreatininResultCard.style.display = 'block';
    document.getElementById('kreatininResultFat').style.display = 'none';
    document.getElementById('kreatininResultBoer').style.display = 'none';
    return;
  }

  const water = +waterInput.value || 1.5;
  const protein = +proteinInput.value || 60;
  const creatine = +creatineInput.value || 0;
  const activity = +activityInput.value || 5;

  const lbmFat = !isNaN(fat) ? weight * (1 - fat / 100) : null;
  const lbmBoer = (gender === 'male') ? (0.407 * weight) + (0.267 * height) - 19.2 : (0.252 * weight) + (0.473 * height) - 48.3;

  const lbmMinCoef = (gender === 'male') ? 0.0124 : 0.0105;
  const lbmMaxCoef = (gender === 'male') ? 0.0212 : 0.0175;
  const creatineMinCoef = 0.055;
  const creatineMaxCoef = 0.075;
  const proteinMinCoef = 0.0001;
  const proteinMaxCoef = 0.00015;

  const getValue = (lbm) => {
    let actMin = 0, actMax = 0;
    if (activity > 7) { actMin = 0.03; actMax = 0.04; }
    else if (activity > 5) { actMin = 0.01; actMax = 0.015; }

    let waterAdjustment = 0;
    if (water < 1.0) waterAdjustment = 0.06;
    else if (water < 1.5) waterAdjustment = 0.03;
    else if (water > 2.5) waterAdjustment = -0.04;

    const ageAdjustment = -0.01 * ((age - 20) / 10);

    const minE = Math.max(lbm * lbmMinCoef + creatine * creatineMinCoef + protein * proteinMinCoef + actMin + waterAdjustment + ageAdjustment, 0.3);
    const maxE = Math.max(lbm * lbmMaxCoef + creatine * creatineMaxCoef + protein * proteinMaxCoef + actMax + waterAdjustment + ageAdjustment, minE + 0.08);

    return [minE.toFixed(2), maxE.toFixed(2)];
  };

  let displayText = '';
  document.getElementById('kreatininResultFat').style.display = 'none';
  document.getElementById('kreatininResultBoer').style.display = 'none';

  if (lbmMethod === 'fat' && lbmFat !== null) {
    const [min, max] = getValue(lbmFat);
    displayText = `${min} - ${max} mg/dL`;
  } else if (lbmMethod === 'boer') {
    const [min, max] = getValue(lbmBoer);
    displayText = `${min} - ${max} mg/dL`;
  } else if (lbmMethod === 'both' && lbmFat !== null) {
    const [minFat, maxFat] = getValue(lbmFat);
    const [minBoer, maxBoer] = getValue(lbmBoer);
    document.getElementById('kreatininResultFat').style.display = 'block';
    document.getElementById('kreatininResultBoer').style.display = 'block';
    document.getElementById('kreatininValueFat').textContent = `${minFat} - ${maxFat} mg/dL`;
    document.getElementById('kreatininValueBoer').textContent = `${minBoer} - ${maxBoer} mg/dL`;
    displayText = 'Her iki yöntem aşağıda listelendi';
  } else {
    const [min, max] = getValue(lbmBoer);
    displayText = `${min} - ${max} mg/dL`;
  }

  kreatininResultValue.textContent = displayText;
  kreatininInterpretation.textContent = 'Bu tahmini aralık, vücut kompozisyonunuza göre beklenen kreatinin seviyelerini gösterir.';
  kreatininResultCard.style.display = 'block';
}
