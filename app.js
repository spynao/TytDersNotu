// Ders verileri
const dersData = {
    "Türkçe": ["Sözcükte Anlam", "Cümlede Anlam", "Paragraf", "Ses Bilgisi", "Yazım Kuralları", "Noktalama İşaretleri", "Sözcük Türleri", "Fiiller", "Cümlenin Ögeleri", "Cümle Türleri", "Anlatım Bozukluğu"],
    "Temel Matematik": ["Temel Kavramlar", "Sayı Basamakları", "Bölme ve Bölünebilme", "EBOB – EKOK", "Rasyonel Sayılar", "Basit Eşitsizlikler", "Mutlak Değer", "Üslü Sayılar", "Köklü Sayılar", "Çarpanlara Ayırma", "Oran Orantı", "Denklem Çözme", "Problemler", "Kümeler", "Mantık", "Fonksiyonlar", "Polinomlar", "Dereceden Denklemler", "Permütasyon ve Kombinasyon", "Olasılık", "Veri – İstatistik"],
    "Fizik": ["Fizik Bilimine Giriş", "Madde ve Özellikleri", "Sıvıların Kaldırma Kuvveti", "Basınç", "Isı, Sıcaklık ve Genleşme", "Hareket ve Kuvvet", "Dinamik", "İş, Güç ve Enerji", "Elektrik", "Manyetizma", "Dalga Mekaniği", "Optik"],
    "Kimya": ["Kimya Bilimi", "Atom ve Periyodik Sistem", "Kimyasal Türler Arası Etkileşimler", "Maddenin Halleri", "Doğa ve Kimya", "Kimyanın Temel Kanunları", "Asitler, Bazlar ve Tuzlar", "Kimyasal Tepkimeler", "Kimya ve Enerji", "Kimya Her Yerde"],
    "Biyoloji": ["Biyoloji Bilimi", "Canlıların Yapısında Bulunan Temel Bileşenler", "Hücre ve Organelleri", "Canlıların Sınıflandırılması", "Üreme ve Gelişme", "Kalıtım", "Modern Genetik Uygulamaları", "Ekosistem Ekolojisi", "Dünyamız", "Canlılarda Enerji Dönüşümleri"],
    "Tarih": ["Tarih Bilimine Giriş", "Uygarlığın Doğuşu ve İlk Uygarlıklar", "İlk Türk Devletleri", "İslam Tarihi ve Uygarlığı", "Türk-İslam Devletleri", "Türkiye Tarihi", "Beylikten Devlete (1300-1453)", "Dünya Gücü: Osmanlı Devleti (1453-1600)", "Arayış Yılları (17. Yüzyıl)", "Diplomasi ve Değişim (18. Yüzyıl)", "En Uzun Yüzyıl (1800-1922)"],
    "Coğrafya": ["Doğa ve İnsan", "Dünya'nın Şekli ve Hareketleri", "Coğrafi Konum", "Harita Bilgisi", "Atmosfer ve Sıcaklık", "İklimler", "Basınç ve Rüzgarlar", "Nem, Yağış ve Buharlaşma", "İç Kuvvetler / Dış Kuvvetler", "Su – Toprak ve Bitkiler", "Nüfus", "Göç", "Yerleşme", "Türkiye'nin Yer Şekilleri", "Ekonomik Faaliyetler", "Bölgeler", "Uluslararası Ulaşım Hatları", "Çevre ve Toplum", "Doğal Afetler"],
    "Felsefe": ["Felsefenin Konusu", "Bilgi Felsefesi", "Varlık Felsefesi", "Ahlak Felsefesi", "Sanat Felsefesi", "Din Felsefesi", "Siyaset Felsefesi", "Bilim Felsefesi"],
    "Din Kültürü ve Ahlak Bilgisi": ["Bilgi ve İnanç", "İslam ve İbadet", "Ahlak ve Değerler", "Hz. Muhammed (S.A.V.)", "Vahiy ve Akıl", "İslam Düşüncesinde Yorumlar", "Din ve Laiklik", "Dinler ve Mezhepler"]
};

// Ders verilerini saklamak için obje
let dersVerileri = JSON.parse(localStorage.getItem('dersVerileri')) || {};
let aktifDers = '';
let aktifKonu = '';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    dersleriYukle();
});

// Dersleri yükleme fonksiyonu
function dersleriYukle() {
    const dersListesi = document.getElementById('dersList');
    Object.keys(dersData).forEach((ders, index) => {
        const dersItem = document.createElement('div');
        dersItem.className = 'ders-item';
        dersItem.textContent = ders;
        dersItem.onclick = () => dersSecildi(ders);
        dersListesi.appendChild(dersItem);
    });
    // İlk dersi seç (Türkçe)
    dersSecildi(Object.keys(dersData)[0]);
}

// Ders seçildiğinde çalışacak fonksiyon
function dersSecildi(ders) {
    aktifDers = ders;
    
    // Aktif ders görsel güncelleme
    document.querySelectorAll('.ders-item').forEach(item => {
        item.classList.toggle('active', item.textContent === ders);
    });
    
    // Başlığı güncelle
    document.getElementById('seciliDers').textContent = ders;
    
    // Konuları yükle
    konulariYukle(ders);
    
    // Tamamlanma yüzdesini güncelle
    tamamlanmaYuzdesiniGuncelle(ders);
}

// Konuları yükleme fonksiyonu
function konulariYukle(ders) {
    const konuListesi = document.getElementById('konuListesi');
    konuListesi.innerHTML = '';

    dersData[ders].forEach(konu => {
        const key = `${ders}-${konu}`;
        const konuVerisi = dersVerileri[key] || { durum: 'başlanmadı', notlar: '', tamamlanma: 0 };
        
        const konuDiv = document.createElement('div');
        konuDiv.className = 'konu-item';
        konuDiv.setAttribute('data-durum', konuVerisi.durum);
        konuDiv.onclick = () => konuAc(ders, konu);
        
        const progressHtml = konuVerisi.durum !== 'başlanmadı' ? 
            `<div class="progress">
                <div class="progress-bar" style="width: ${konuVerisi.tamamlanma}%"></div>
            </div>` : '';
        
        konuDiv.innerHTML = `
            <h3>${konu}</h3>
            <div class="konu-durum">${konuVerisi.durum}</div>
            ${progressHtml}
        `;
        
        konuListesi.appendChild(konuDiv);
    });
}

// Konu açma fonksiyonu
function konuAc(ders, konu) {
    aktifDers = ders;
    aktifKonu = konu;
    
    const konuVerisi = dersVerileri[`${ders}-${konu}`] || {
        durum: 'başlanmadı',
        notlar: '',
        tamamlanma: 0
    };

    document.getElementById('editorModalLabel').textContent = konu;
    
    // Durum butonlarını güncelle
    document.querySelectorAll('.durum-buttons button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-durum') === konuVerisi.durum);
    });

    // Editör içeriğini yükle
    editorIceriginiYukle(konuVerisi.notlar);

    // Modal'ı aç
    document.getElementById('editorModal').classList.add('active');
}

// Editör içeriğini yükle
function editorIceriginiYukle(icerik) {
    const editor = document.getElementById('editor');
    editor.innerHTML = icerik || '';
    
    // Buton durumlarını güncelle
    document.querySelectorAll('.format-btn').forEach(btn => {
        const cmd = btn.getAttribute('data-command');
        if (cmd && document.queryCommandEnabled(cmd)) {
            const state = document.queryCommandState(cmd);
            btn.classList.toggle('active', state);
        }
    });

    // Yazı tipi ve boyutunu güncelle
    const fontName = document.queryCommandValue('fontName');
    const fontSize = document.queryCommandValue('fontSize');
    
    if (fontName) document.getElementById('fontSelect').value = fontName;
    if (fontSize) document.getElementById('sizeSelect').value = fontSize;
}

// Metin formatlama fonksiyonu
function formatText(command, value = null) {
    document.execCommand(command, false, value);
    
    // Aktif buton stilini güncelle
    document.querySelectorAll('.format-btn').forEach(btn => {
        const cmd = btn.getAttribute('data-command');
        if (cmd === command) {
            const state = document.queryCommandState(command);
            btn.classList.toggle('active', state);
        }
    });

    // Seçili yazı tipi ve boyutunu güncelle
    if (command === 'fontName') {
        document.getElementById('fontSelect').value = value;
    } else if (command === 'fontSize') {
        document.getElementById('sizeSelect').value = value;
    }

    // Editöre odaklan
    document.getElementById('editor').focus();
}

// Klavye kısayolları
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch(e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                formatText('bold');
                break;
            case 'i':
                e.preventDefault();
                formatText('italic');
                break;
            case 'u':
                e.preventDefault();
                formatText('underline');
                break;
        }
    }
});

// Editör içeriği değiştiğinde butonları güncelle
document.getElementById('editor').addEventListener('keyup', function() {
    document.querySelectorAll('.format-btn').forEach(btn => {
        const cmd = btn.getAttribute('data-command');
        if (cmd && document.queryCommandEnabled(cmd)) {
            const state = document.queryCommandState(cmd);
            btn.classList.toggle('active', state);
        }
    });
});

// Editör seçimi değiştiğinde butonları güncelle
document.getElementById('editor').addEventListener('mouseup', function() {
    document.querySelectorAll('.format-btn').forEach(btn => {
        const cmd = btn.getAttribute('data-command');
        if (cmd && document.queryCommandEnabled(cmd)) {
            const state = document.queryCommandState(cmd);
            btn.classList.toggle('active', state);
        }
    });
});

// Yazdırma önizleme fonksiyonu
function yazdirOnizleme() {
    const baslik = document.getElementById('editorModalLabel').textContent;
    const icerik = editorIceriginiKaydet();
    
    // Yeni pencere aç
    const yazdir = window.open('', '_blank');
    yazdir.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${baslik}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                }
                .baslik {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #ccc;
                }
                .icerik {
                    margin: 20px 0;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="baslik">
                <h1>${baslik}</h1>
                <div>${aktifDers}</div>
            </div>
            <div class="icerik">${icerik}</div>
        </body>
        </html>
    `);
    
    // Yazdırma diyaloğunu aç
    yazdir.document.close();
    yazdir.focus();
    setTimeout(() => yazdir.print(), 500);
}

// PDF indirme fonksiyonu
function pdfIndir() {
    const editor = document.getElementById('editor');
    const konu = document.getElementById('editorModalLabel').textContent;
    
    // Stil ekle
    const style = `
        <style>
            body { font-family: Inter, Arial, sans-serif; line-height: 1.6; color: #333; }
            h1, h2, h3 { margin: 0.75em 0; font-weight: 600; }
            p { margin: 0.75em 0; }
            ul, ol { margin: 0.75em 0; padding-left: 2em; }
            li { margin: 0.375em 0; }
            hr { margin: 1.5em 0; border: none; border-top: 1px solid #ddd; }
            blockquote { 
                margin: 1em 0;
                padding: 0.5em 1em;
                border-left: 4px solid #007bff;
                background-color: #f8f9fa;
            }
        </style>
    `;
    
    // İçeriği hazırla
    const content = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${konu}</title>
            ${style}
        </head>
        <body>
            <h1>${konu}</h1>
            ${editor.innerHTML}
        </body>
        </html>
    `;
    
    // HTML'i PDF'e çevir
    const element = document.createElement('iframe');
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.contentDocument.write(content);
    element.contentDocument.close();
    
    const opt = {
        margin: [1, 1, 1, 1],
        filename: `${konu}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };
    
    // PDF oluştur ve indir
    html2pdf().set(opt).from(element.contentDocument.body).save().then(() => {
        document.body.removeChild(element);
    });
}

// Durum güncelleme fonksiyonu
function durumGuncelle(button) {
    const yeniDurum = button.getAttribute('data-durum');
    const key = `${aktifDers}-${aktifKonu}`;
    
    dersVerileri[key] = dersVerileri[key] || { notlar: '', tamamlanma: 0 };
    dersVerileri[key].durum = yeniDurum;
    
    if (yeniDurum === 'tamamlandı') {
        dersVerileri[key].tamamlanma = 100;
    } else if (yeniDurum === 'devam ediyor') {
        dersVerileri[key].tamamlanma = 50;
    } else {
        dersVerileri[key].tamamlanma = 0;
    }

    // Durum butonlarını güncelle
    document.querySelectorAll('.durum-buttons button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-durum') === yeniDurum);
    });

    localStorage.setItem('dersVerileri', JSON.stringify(dersVerileri));
    konulariYukle(aktifDers);
    tamamlanmaYuzdesiniGuncelle(aktifDers);
}

// Modal kapatma fonksiyonu
function modalKapat() {
    document.getElementById('editorModal').classList.remove('active');
}

// Notları kaydetme fonksiyonu
function notKaydet() {
    const key = `${aktifDers}-${aktifKonu}`;
    const notlar = editorIceriginiKaydet();
    
    dersVerileri[key] = dersVerileri[key] || { durum: 'başlanmadı', tamamlanma: 0 };
    dersVerileri[key].notlar = notlar;
    
    localStorage.setItem('dersVerileri', JSON.stringify(dersVerileri));
    modalKapat();
    konulariYukle(aktifDers);
}

// Editör içeriğini kaydet
function editorIceriginiKaydet() {
    return document.getElementById('editor').innerHTML;
}

// Tamamlanma yüzdesini güncelleme fonksiyonu
function tamamlanmaYuzdesiniGuncelle(ders) {
    const konular = dersData[ders];
    let toplamTamamlanma = 0;
    
    konular.forEach(konu => {
        const konuVerisi = dersVerileri[`${ders}-${konu}`];
        if (konuVerisi) {
            toplamTamamlanma += konuVerisi.tamamlanma;
        }
    });
    
    const ortalamaTamamlanma = Math.round(toplamTamamlanma / konular.length);
    
    document.getElementById('tamamlanmaBar').style.width = `${ortalamaTamamlanma}%`;
    document.getElementById('tamamlanmaYuzde').textContent = `${ortalamaTamamlanma}%`;
}
