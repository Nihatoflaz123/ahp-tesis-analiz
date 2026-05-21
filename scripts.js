const pairs = {
    ana: [
        ["Maliyet Faktörü", "Verimlilik Faktörü"], 
        ["Maliyet Faktörü", "Esneklik Yeteneği"], 
        ["Maliyet Faktörü", "Risk & Güvenlik"], 
        ["Maliyet Faktörü", "Alan Kullanımı"], 
        ["Maliyet Faktörü", "Yönetilebilirlik"], 
        ["Verimlilik Faktörü", "Esneklik Yeteneği"], 
        ["Verimlilik Faktörü", "Risk & Güvenlik"], 
        ["Verimlilik Faktörü", "Alan Kullanımı"], 
        ["Verimlilik Faktörü", "Yönetilebilirlik"], 
        ["Esneklik Yeteneği", "Risk & Güvenlik"], 
        ["Esneklik Yeteneği", "Alan Kullanımı"], 
        ["Esneklik Yeteneği", "Yönetilebilirlik"], 
        ["Risk & Güvenlik", "Alan Kullanımı"], 
        ["Risk & Güvenlik", "Yönetilebilirlik"], 
        ["Alan Kullanımı", "Yönetilebilirlik"]
    ],
    mal: [
        ["Malzeme Taşıma Maliyeti", "Kurulum/Yatırım Maliyeti"], 
        ["Malzeme Taşıma Maliyeti", "İşletme/Operasyon Maliyeti"], 
        ["Kurulum/Yatırım Maliyeti", "İşletme/Operasyon Maliyeti"]
    ],
    ver: [
        ["Üretim/Akış Hızı", "Bekleme Sürelerinin Azaltılması"], 
        ["Üretim/Akış Hızı", "Kapasite Kullanım Oranı"], 
        ["Bekleme Sürelerinin Azaltılması", "Kapasite Kullanım Oranı"]
    ],
    esn: [
        ["Ürün Çeşitliliğine Uyum", "Talep Değişimine Uyum"], 
        ["Ürün Çeşitliliğine Uyum", "Hat Değişim Kolaylığı"], 
        ["Talep Değişimine Uyum", "Hat Değişim Kolaylığı"]
    ],
    rsk: [
        ["İş Kazası Riski", "Arıza Durumunda Üretim Etkisi"], 
        ["İş Kazası Riski", "Gıda Güvenliği Riski"], 
        ["Arıza Durumunda Üretim Etkisi", "Gıda Güvenliği Riski"]
    ],
    aln: [
        ["Alan Verimliliği (M²)", "Depolama Alanı Kullanımı"], 
        ["Alan Verimliliği (M²)", "Gelecekte Genişleme İmkanı"], 
        ["Depolama Alanı Kullanımı", "Gelecekte Genişleme İmkanı"]
    ],
    ynt: [
        ["Saha Kontrol Kolaylığı", "Bölümler Arası Koordinasyon"], 
        ["Saha Kontrol Kolaylığı", "Bakım Yönetimi Kolaylığı"], 
        ["Bölümler Arası Koordinasyon", "Bakım Yönetimi Kolaylığı"]
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
    // Kriterleri render et
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
