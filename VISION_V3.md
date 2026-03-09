# ⭐ Yıldız Ülkesi v3 — VİZYON DOKÜMANİ

## MEB 2024 Türkiye Yüzyılı Maarif Modeli — İnteraktif Okuma Platformu

---

## 🎯 V3 Tasarım Felsefesi

"Çocuklar hem dinlesin, hem konuşsun, hem yazsın, hem okusun."

V3, her pedagojik aşamayı bağımsız bir **interaktif mini oyun** olarak sunar.
Pasif dinleme yerine **aktif katılım** esastır.

---

## 🎮 6 Faz × 6 Mini Oyun

| Faz | MEB Kazanım | Mini Oyun | Beceri |
|-----|-------------|-----------|--------|
| 1. Sesi Fark Et | T.O.1.1.1 | 🎈 Balon Patlatma | DİNLEME |
| 2. Sesi Söyle | T.O.1.1.2 | 🎤 Ses Ölçer | KONUŞMA |
| 3. Harfi Yaz | T.Y.1.1.1 | ✏️ Harf Tracing | YAZMA |
| 4. Hece Kur | T.O.1.2.1 | 🧩 Sürükle-Bırak Hece | OKUMA |
| 5. Kelime Oku | T.O.1.3.1 | 📖 Resim-Kelime Eşleştir | OKUMA |
| 6. Cümle Kur | T.O.1.4.1 | 📝 Kelime Sıralama | OKUMA+YAZMA |

### Oyun Detayları

**🎈 Balon Patlatma (Sesi Fark Et)**
- Ekranda kelime yazılı balonlar yüzer
- Çocuk hedef sesi içeren balonları patlatır
- Doğru/yanlış anında geri bildirim
- 2 tur, her turda 4 balon

**🎤 Ses Ölçer (Sesi Söyle)**
- Mikrofon açılır, ses seviye barı animasyonlu
- Çocuk hedef sesi söyler
- Ağız pozisyonu rehberliği
- Ses algılandığında otomatik değerlendirme

**✏️ Harf Tracing (Harfi Yaz)**
- Canvas üzerinde parmak/mouse ile çizim
- Arka planda soluk rehber harf
- Serbest çizim + kontrol mekanizması
- Temizle/tekrar dene seçenekleri

**🧩 Sürükle-Bırak Hece (Hece Kur)**
- Hedef hece gösterilir
- Mevcut harfler + yanıltıcılar sunulur
- Tıklayarak slotlara yerleştir
- 4 hece turu

**📖 Resim-Kelime Eşleştirme (Kelime Oku)**
- Sol: emoji resimler, sağ: kelimeler
- Tıkla-eşle mekanizması
- 4 çift eşleme
- Doğru eşleme animasyonu

**📝 Kelime Sıralama (Cümle Kur)**
- Karışık kelimeler havuzu
- Tıklayarak sıraya diz
- Cümle doğruluğu kontrolü
- 2 cümle turu

---

## 🗺️ Dünya Haritası Sistemi

5 dünya = 5 MEB ses grubu:

```
🌲 Orman Ülkesi (Leo 🦁) → A, N, E, T, İ, L
🌊 Okyanus Ülkesi (Yunus 🐬) → O, K, U, R, I, M
☁️ Gökyüzü Ülkesi (Kartal 🦅) → Ü, S, Ö, Y, D, Z
🏜️ Çöl Ülkesi (Tilki 🦊) → Ç, B, G, C, Ş
❄️ Buz Ülkesi (Penguen 🐧) → P, H, V, Ğ, F, J
```

- Sıralı kilit açma (önceki dünya tamamlanmalı)
- Her dünyada harfler de sıralı
- İlerleme barı ve yıldız sistemi

---

## 🏅 Rozet Sistemi

| Rozet | Koşul |
|-------|-------|
| 🎵 İlk Ses | 1 harf tamamla |
| 🌲 Orman Kâşifi | 1. Grubu bitir |
| 🌊 Okyanus Dalgıcı | 2. Grubu bitir |
| ✈️ Gökyüzü Pilotu | 3. Grubu bitir |
| 🏜️ Çöl Gezgini | 4. Grubu bitir |
| ❄️ Buz Kahramanı | 5. Grubu bitir |
| ⭐ 10 Yıldız | 10 yıldız topla |
| 🌟 50 Yıldız | 50 yıldız topla |

---

## 🐾 Animasyonlu Maskotlar

Her maskot:
- Dünyasına özel kişilik
- Claude API ile faz-duyarlı diyalog
- Konuşurken bounce animasyonu
- Sessizken float animasyonu
- Konuşma baloncuğu ile mesaj

---

## 👨‍🏫 Öğretmen Paneli

- Harf bazlı 6-faz değerlendirme grid'i
- Puan renk kodu (yeşil/sarı/kırmızı)
- MEB kazanım kodları referansı
- Dünya bazlı ilerleme takibi
- Genel yıldız ve başarı istatistikleri

---

## 🔧 Teknik Mimari (v3)

```
yildiz-ulkesi-v3/
├── server/                    # ← AYNEN KORUNDU
│   ├── server.js              # Express API proxy
│   └── routes/
│       ├── claude.js          # Claude AI maskot diyalogu
│       ├── google-tts.js      # Google Cloud TTS
│       ├── google-stt.js      # Google Cloud STT
│       └── elevenlabs.js      # ElevenLabs fallback TTS
├── src/
│   ├── App.jsx                # ← YENİ: Tüm v3 frontend
│   ├── main.jsx               # React entry
│   ├── index.css              # Tailwind + keyframes
│   ├── config/                # ← KORUNDU
│   │   ├── curriculum.js      # 29 harf müfredatı
│   │   ├── worlds.js          # 5 dünya
│   │   └── assessment.js      # MEB ölçme-değerlendirme
│   └── hooks/                 # ← KORUNDU
│       ├── useClaudeDialogue.js
│       ├── useSpeechRecognition.js
│       └── useTextToSpeech.js
├── package.json
├── vite.config.js
├── render.yaml                # Render.com deploy
└── .env.example
```

---

## 🚀 Kurulum

```bash
git clone <repo>
cd yildiz-ulkesi-v3
npm install
cp .env.example .env  # API key'leri ekle
npm run dev            # localhost:5173
```

---

## 📋 MEB Sunumu İçin Öne Çıkan Özellikler

1. **Ses Temelli Cümle Yöntemi** tam uyum
2. **29 harf × 6 faz** = 174 interaktif oyun
3. **Kümülatif kelime sistemi** — sadece öğrenilmiş harflerle
4. **AI maskot diyalogu** — Claude API ile pedagojik rehberlik
5. **Google TTS/STT** — Türkçe ana dil ses kalitesi
6. **Gerçek zamanlı değerlendirme** — MEB kazanım kodlarıyla
7. **Çoklu beceri hedefi**: Dinleme + Konuşma + Yazma + Okuma
8. **Oyunlaştırma**: Yıldız, rozet, dünya keşfi motivasyonu
9. **Öğretmen paneli**: Detaylı harf bazlı performans takibi
10. **Mobil uyumlu**: Dokunmatik cihazlarda tam çalışır
