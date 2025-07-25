document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklendiğinde genel feragatnameyi göster
    document.getElementById('initialDisclaimer').style.display = 'block';
    
    // Tüm input alanlarına otomatik odaklanma ve klavye navigasyonu
    document.querySelectorAll('input, select').forEach((input, index, inputs) => {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextInput = inputs[index + 1];
                if (nextInput) {
                    nextInput.focus();
                } else {
                    // Son input'ta enter'a basıldığında hesapla butonuna tıkla
                    const activeSection = document.querySelector('.section[style="display: block;"]');
                    if (activeSection) {
                        const calculateBtn = activeSection.querySelector('button');
                        if (calculateBtn) calculateBtn.click();
                    }
                }
            }
        });
    });
    
    // Tooltip benzeri bilgi balonları ekle
    addInfoTooltips();
    
    // Hesaplama türü seçildiğinde ilgili bölümü yükle
    document.getElementById("hesapSec").addEventListener('change', showSection);
});

function addInfoTooltips() {
    const tooltips = {
        'p_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin',
        'p_hedef': 'Mevcut fitness hedefinizi seçin',
        'y_cinsiyet': 'Cinsiyetinize göre farklı hesaplama yapılacaktır',
        'y_boy': 'Santimetre cinsinden boyunuzu girin',
        'y_kilo': 'Kilogram cinsinden ağırlığınızı girin',
        'y_boyun': 'Boyun çevrenizi cm cinsinden ölçün',
        'y_bel': 'Bel çevrenizi cm cinsinden ölçün',
        'y_kalca': 'Kalça çevrenizi cm cinsinden ölçün (kadınlar için)',
        'k_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin',
        'b_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin',
        's_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin',
        'l_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin',
        'c_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin',
        'toplu_kilo': 'Vücut ağırlığınızı kilogram cinsinden girin',
        'toplu_hedef': 'Mevcut fitness hedefinizi seçin',
        'gender': 'Cinsiyetinizi seçin (erkek/kadın).',
        'age': 'Yaşınızı girin.',
        'weight': 'Kilonuzu kilogram cinsinden girin.',
        'height': 'Boyunuzu santimetre cinsinden girin.',
        'fat': 'Vücut yağ oranınızı yüzde olarak girin (örneğin %15 için 15). Opsiyoneldir ancak daha doğru sonuç sağlar.',
        'water': 'Son 24 saat içinde attığınız idrar hacmini litre cinsinden girin (ortalama 1.5 Litre). Opsiyoneldir.',
        'protein': 'Günlük ortalama et ve hayvansal ürünlerden aldığınız protein miktarını gram cinsinden girin (ortalama 60g). Opsiyoneldir.',
        'creatine': 'Günlük kreatin takviyesi alıyorsanız gram cinsinden miktarını girin (ortalama 0g). Opsiyoneldir.',
        'activity': 'Aktivite seviyenizi 0 (çok az aktif) ile 10 (çok aktif, sporcu) arasında bir sayı olarak girin (ortalama 5). Opsiyoneldir.',
        'lbmMethod': 'Yağsız Vücut Kütlesi (LBM) hesaplama yöntemini seçin. Yağ oranınız biliniyorsa "Yağ Oranına Göre" daha hassas olabilir. Bilinmiyorsa "Boer Formülü" kullanılabilir.'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.setAttribute('title', tooltips[id]);
            element.setAttribute('aria-label', tooltips[id]);
        }
    });
}

async function showSection() {
    const sec = document.getElementById("hesapSec").value;
    const contentSectionsDiv = document.getElementById('contentSections');
    document.getElementById('initialDisclaimer').style.display = 'none';
    
    contentSectionsDiv.innerHTML = '';
    
    document.querySelectorAll('.input-warning').forEach(span => span.textContent = '');

    if (sec) {
        try {
            const response = await fetch(`sections/${sec}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            contentSectionsDiv.innerHTML = htmlContent;

            const section = contentSectionsDiv.querySelector('.section');
            if (section) {
                section.style.display = "block";
                setTimeout(() => {
                    section.style.opacity = "1";
                }, 10);
                
                const firstInput = section.querySelector('input[type="number"], input[type="text"], select');
                if (firstInput) {
                    firstInput.focus();
                }
            }

            if (sec === 'yag') {
                const cinsiyetSelect = document.getElementById('y_cinsiyet');
                if (cinsiyetSelect) {
                    cinsiyetSelect.addEventListener('change', toggleHipInput);
                    toggleHipInput();
                }
            }
            
        } catch (error) {
            console.error('Bölüm yüklenirken hata oluştu:', error);
            contentSectionsDiv.innerHTML = `<div class="disclaimer danger">Bölüm yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</div>`;
        }
    }
}

function toggleHipInput() {
    const cinsiyet = document.getElementById('y_cinsiyet');
    const kalcaInput = document.getElementById('y_kalca');
    const kalcaWarning = document.getElementById('y_kalca_warning');

    if (cinsiyet && kalcaInput && kalcaWarning) {
        if (cinsiyet.value === 'kadin') {
            kalcaInput.classList.remove('hidden');
            kalcaWarning.classList.remove('hidden');
        } else {
            kalcaInput.classList.add('hidden');
            kalcaWarning.classList.add('hidden');
            kalcaInput.value = '';
            kalcaWarning.textContent = '';
        }
    }
}
