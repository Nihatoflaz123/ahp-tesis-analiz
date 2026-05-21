const pairs = {
    ana: [
        ["Çevresel Faktörler", "Ekonomik Faktörler"], 
        ["Çevresel Faktörler", "Sosyal & İSG Faktörleri"], 
        ["Çevresel Faktörler", "Teknik & Operasyonel Uyum"], 
        ["Ekonomik Faktörler", "Sosyal & İSG Faktörleri"], 
        ["Ekonomik Faktörler", "Teknik & Operasyonel Uyum"], 
        ["Sosyal & İSG Faktörleri", "Teknik & Operasyonel Uyum"]
    ],
    cev: [
        ["Enerji Verimliliği ve Tasarrufu", "Atık Yönetimi ve Geri Dönüşüm"], 
        ["Enerji Verimliliği ve Tasarrufu", "Karbon Ayak İzi Azaltımı"], 
        ["Atık Yönetimi ve Geri Dönüşüm", "Karbon Ayak İzi Azaltımı"]
    ],
    eko: [
        ["İlk Yatırım ve Kurulum Maliyeti", "Operasyonel Tasarruf ve Geri Kazanım"], 
        ["İlk Yatırım ve Kurulum Maliyeti", "Yatırımın Geri Dönüş Süresi (ROI)"], 
        ["Operasyonel Tasarruf ve Geri Kazanım", "Yatırımın Geri Dönüş Süresi (ROI)"]
    ],
    sos: [
        ["İş Sağlığı ve Güvenliği Standartları", "Çalışan Ergonomisi ve Çalışma Ortamı"], 
        ["İş Sağlığı ve Güvenliği Standartları", "Sürdürülebilirlik Eğitimleri"], 
        ["Çalışan Ergonomisi ve Çalışma Ortamı", "Sürdürülebilirlik Eğitimleri"]
    ],
    tek: [
        ["Üretim Süreçlerine ve Akış Hızına Etki", "Altyapıya Entegrasyon Kolaylığı"], 
        ["Üretim Süreçlerine ve Akış Hızına Etki", "Bakım ve Teknolojik Uyumluluk"], 
        ["Altyapıya Entegrasyon Kolaylığı", "Bakım ve Teknolojik Uyumluluk"]
    ]
};

function render(list, targetId, prefix) {
    const container = document.getElementById(targetId);
    list.forEach((p, rowIndex) => {
        const uniqueId = `${prefix}_${rowIndex}`;
        const card = document.createElement('div');
        card.className = 'comparison-card';
        
        let radioHtml = [-9, -7, -5, -3, 1, 3, 5, 7, 9].map((val, i) => {
            // Formspree'ye gidecek anlamlı metni oluşturuyoruz
            let valText = "";
            if (val < 0) {
                valText = `${p[0]} Daha Önemli (${Math.abs(val)})`;
            } else if (val === 1) {
                valText = "Eşit Önemde (1)";
            } else {
                valText = `${p[1]} Daha Önemli (${val})`;
            }

            return `
                <label>
                    <input type="radio" name="${prefix}_${p[0].replace(/[^a-zA-Z0-9]/g, '_')}_${p[1].replace(/[^a-zA-Z0-9]/g, '_')}" value="${valText}" 
                    ${val === 1 ? 'checked' : ''} 
                    onclick="updateColor(this, 'nums_${uniqueId}', ${i})">
                </label>
            `;
        }).join('');

        card.innerHTML = `
            <div class="ahp-table">
                <div class="side-label left-l">${p[0]}</div>
                <div class="middle-box">
                    <div class="num-row" id="nums_${uniqueId}">
                        <span>9</span><span>7</span><span>5</span><span>3</span><span class="selected-num">1</span><span>3</span><span>5</span><span>7</span><span>9</span>
                    </div>
                    <div class="radio-row">
                        ${radioHtml}
                    </div>
                </div>
                <div class="side-label right-l">${p[1]}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateColor(radio, rowId, index) {
    const spans = document.getElementById(rowId).getElementsByTagName('span');
    for(let s of spans) s.classList.remove('selected-num');
    spans[index].classList.add('selected-num');
}

document.addEventListener('DOMContentLoaded', () => {
    // Kriterleri HTML içindeki div ID'lerine render et
    Object.keys(pairs).forEach(key => render(pairs[key], key + '-group', key.toUpperCase()));

    const form = document.getElementById('ahpForm');
    const loader = document.getElementById('loader');
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMessage');

    // Sayfa Yükleme Tamamlandığında Loader'ı Kaldır
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 300);

    // Form Gönderim İşlemi
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Butonu Devre Dışı Bırak
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'İletiliyor...';

        const formData = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Formu Sakla ve Başarı Mesajını Göster
                form.style.opacity = '0';
                setTimeout(() => {
                    form.style.display = 'none';
                    successMsg.style.display = 'block';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 300);
            } else {
                throw new Error();
            }
        } catch (error) {
            alert('Gönderim sırasında bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Analizi Tamamla';
        }
    });
});
