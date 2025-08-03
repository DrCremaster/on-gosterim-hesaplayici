// Fitness-hesaplama/js/kreatininTahminiHesaplayici.js
// Bu dosyanın çalışabilmesi için common.js'in HTML'de önce yüklenmesi gerekir.
function hesaplaKreatininTahmini() {
    // Uyarı mesajlarını temizle
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    // Giriş alanlarını al
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

    // Giriş değerlerini al ve parse et
    const gender = genderInput.value;
    const age = +ageInput.value;
    const weight = +weightInput.value;
    const height = +heightInput.value;
    const fat = +fatInput.value;
    const lbmMethod = lbmMethodInput.value;

    let isValid = true; // Giriş kontrolü için bayrak

    // Giriş doğrulama kontrolleri
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
    if ((lbmMethod === 'fat' || lbmMethod === 'both') && (isNaN(fat) || fat < 1 || fat >= 100)) { // Yağ oranı %1-99 arası olmalı
        document.getElementById('fat_warning').textContent = "Yağ oranı %1-99 arasında olmalıdır.";
        isValid = false;
    }

    // Sonuç kartı elementlerini al
    const kreatininResultCard = document.getElementById('kreatininResultCard');
    const kreatininInterpretation = document.getElementById('kreatininInterpretation');
    const kreatininResultValue = document.getElementById('kreatininResultValue');

    // Geçersiz giriş durumunda uyarı göster ve fonksiyondan çık
    if (!isValid) {
        kreatininResultValue.textContent = "0.00 - 0.00 mg/dL";
        kreatininInterpretation.textContent = "Lütfen tüm gerekli alanları doğru şekilde doldurun.";
        kreatininResultCard.style.display = 'block';
        document.getElementById('kreatininResultFat').style.display = 'none';
        document.getElementById('kreatininResultBoer').style.display = 'none';
        return;
    }

    // Giriş değerlerini al veya varsayılan ata
    const water = +waterInput.value || 1.8; // Günlük su miktarı Litre olarak (varsayılan 1.8L)
    const protein = +proteinInput.value || 80; // Günlük protein alımı gram olarak (varsayılan 80g)
    const creatine = +creatineInput.value || 0; // Kreatin takviyesi gram olarak (varsayılan 0g)
    const activity = +activityInput.value || 2; // Egzersiz seviyesi (1-10 arası, 1 sedanter, 10 çok aktif)

    // Yağsız Vücut Kütlesi (LBM) hesaplamaları
    const lbmFat = !isNaN(fat) ? weight * (1 - fat / 100) : null;
    const lbmBoer = (gender === 'male') ? (0.407 * weight) + (0.267 * height) - 19.20 : (0.252 * weight) + (0.473 * height) - 48.30;

    // --- TEMEL KATSAYILAR ---
    // Ayarlanmış Temel Kreatinin Değerleri (Minimumlar Artırıldı)
    const baseMinCreatinine = (gender === 'male') ? 0.50 : 0.35; // Artırıldı
    const baseMaxCreatinine = (gender === 'male') ? 0.55 : 0.40;

    // Ayarlanmış LBM'nin kreatinin üzerindeki temel doğrusal etkisi (mg/dL / kg LBM) - Minimum Artırıldı
    const lbmMinCoef = (gender === 'male') ? 0.006 : 0.005; // Artırıldı
    const lbmMaxCoef = (gender === 'male') ? 0.008 : 0.007;

    // Kreatin takviyesinin logaritmik etkisi (mg/dL / log(gram+1)) - Minimum Artırıldı
    const logCreatineMinFactor = 0.030; // Artırıldı
    const logCreatineMaxFactor = 0.065;

    // Protein alımının logaritmik etkisi (mg/dL / log(gram+1)) - Minimum Artırıldı
    const logProteinMinFactor = 0.004; // Artırıldı
    const logProteinMaxFactor = 0.008;

    // --- ETKİ HESAPLAMALARI ---
    let actMinEffect = 0;
    let actMaxEffect = 0;
    // Egzersiz seviyesinin doğrusal etkisi (mg/dL) - Minimum Artırıldı
    if (activity >= 8) { // Sizin gibi yüksek spor yapanlar (8-10)
        actMinEffect = 0.015; // Artırıldı
        actMaxEffect = 0.025;
    } else if (activity >= 5) { // Orta aktifler (5-7)
        actMinEffect = 0.005;
        actMaxEffect = 0.015;
    } else if (activity >= 2) { // Hafif aktifler (2-4)
        actMinEffect = 0.001;
        actMaxEffect = 0.005;
    } else { // Sedanterler (1)
        actMinEffect = 0.000;
        actMaxEffect = 0.000;
    }

    // Su tüketimi ayarlaması (doğrusal)
    let waterAdjustmentMin = 0;
    let waterAdjustmentMax = 0;
    if (water < 1.0) { // Çok az su
        waterAdjustmentMin = 0.04;
        waterAdjustmentMax = 0.08;
    } else if (water >= 1.0 && water < 1.8) { // Az su
        waterAdjustmentMin = 0.01;
        waterAdjustmentMax = 0.03;
    } else if (water > 2.5) { // Çok fazla su
        waterAdjustmentMin = -0.05;
        waterAdjustmentMax = -0.02;
    }

    // Yaş ayarlaması (Anabolik/Katabolik yaklaşıma göre)
    let ageAdjustmentMin = 0;
    let ageAdjustmentMax = 0;
    if (age >= 45) { // Katabolik dönem: Kreatinin düşer
        const ageFactor = (age - 45) / 10;
        ageAdjustmentMin = -0.02 * ageFactor;
        ageAdjustmentMax = -0.01 * ageFactor;
    } else if (age >= 30) { // Denge dönemi: Çok hafif düşüş veya sabit
        const ageFactor = (age - 30) / 10;
        ageAdjustmentMin = -0.008 * ageFactor;
        ageAdjustmentMax = 0.00;
    }

    // Ana hesaplama fonksiyonu (LBM'e göre)
    const getValue = (lbm) => {
        // Kreatin ve protein için logaritmik etki hesaplaması
        const creatineEffectMin = Math.log(creatine + 1) * logCreatineMinFactor;
        const creatineEffectMax = Math.log(creatine + 1) * logCreatineMaxFactor;

        const proteinEffectMin = Math.log(protein + 1) * logProteinMinFactor;
        const proteinEffectMax = Math.log(protein + 1) * logProteinMaxFactor;

        // Tüm minimum ve maksimum etkileri topla (temel kreatinin dahil)
        const minE = baseMinCreatinine + (lbm * lbmMinCoef) + creatineEffectMin + proteinEffectMin + actMinEffect + waterAdjustmentMin + ageAdjustmentMin;
        const maxE = baseMaxCreatinine + (lbm * lbmMaxCoef) + creatineEffectMax + proteinEffectMax + actMaxEffect + waterAdjustmentMax + ageAdjustmentMax;

        // Kreatinin alt sınırını ve aralık genişliğini koru (çok düşük fizyolojik alt sınırlar)
        const finalMin = Math.max(minE, (gender === 'male' ? 0.40 : 0.20)); // Bu sabit sınır hala çok düşükse, hesaplanan minE daha baskın olacak.
        const finalMax = Math.max(maxE, finalMin + 0.15); // Minimum aralık genişliği 0.15 mg/dL

        return [finalMin.toFixed(2), finalMax.toFixed(2)];
    };

    let displayText = '';
    document.getElementById('kreatininResultFat').style.display = 'none';
    document.getElementById('kreatininResultBoer').style.display = 'none';

    // Seçilen LBM yöntemine göre sonucu göster
    if (lbmMethod === 'fat' && lbmFat !== null) {
        const [min, max] = getValue(lbmFat);
        displayText = `${min} - ${max} mg/dL`;
        document.getElementById('kreatininResultFat').style.display = 'block';
        document.getElementById('kreatininValueFat').textContent = displayText;
        kreatininInterpretation.textContent = 'Bu tahmini aralık, yağ oranınıza göre beklenen kreatinin seviyelerini gösterir.';
    } else if (lbmMethod === 'boer') {
        const [min, max] = getValue(lbmBoer);
        displayText = `${min} - ${max} mg/dL`;
        document.getElementById('kreatininResultBoer').style.display = 'block';
        document.getElementById('kreatininValueBoer').textContent = displayText;
        kreatininInterpretation.textContent = 'Bu tahmini aralık, Boer formülüyle hesaplanan LBM\'ye göre beklenen kreatinin seviyelerini gösterir.';
    } else if (lbmMethod === 'both' && lbmFat !== null) {
        const [minFat, maxFat] = getValue(lbmFat);
        const [minBoer, maxBoer] = getValue(lbmBoer);
        document.getElementById('kreatininResultFat').style.display = 'block';
        document.getElementById('kreatininResultBoer').style.display = 'block';
        document.getElementById('kreatininValueFat').textContent = `${minFat} - ${maxFat} mg/dL`;
        document.getElementById('kreatininValueBoer').textContent = `${minBoer} - ${maxBoer} mg/dL`;
        displayText = 'Her iki yöntem aşağıda listelendi';
        kreatininInterpretation.textContent = 'Bu tahmini aralıklar, farklı LBM hesaplama yöntemlerine göre beklenen kreatinin seviyelerini gösterir.';
    } else {
        // Eğer yağ oranı girişi yoksa veya geçersizse Boer'i varsayılan olarak kullan
        const [min, max] = getValue(lbmBoer);
        displayText = `${min} - ${max} mg/dL`;
        document.getElementById('kreatininResultBoer').style.display = 'block';
        document.getElementById('kreatininValueBoer').textContent = displayText;
        kreatininInterpretation.textContent = 'Yağ oranı girilmediği için tahmin Boer formülüne göre yapılmıştır. Bu tahmini aralık, vücut kompozisyonunuza göre beklenen kreatinin seviyelerini gösterir.';
    }

    kreatininResultValue.textContent = displayText;
    kreatininResultCard.style.display = 'block';
}
