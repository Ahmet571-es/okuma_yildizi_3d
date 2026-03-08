# ⭐ Yıldız Ülkesi — MEB Uyumlu Sesli Okuma Macerası

**MEB 2024 Türkiye Yüzyılı Maarif Modeli — Ses Temelli Cümle Yöntemi** ile tam uyumlu, diyalog tabanlı ilk okuma-yazma öğretim platformu.

## 🚀 Tek Tıkla Yayınla

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Ahmet571-es/okuma_yildizi_3d)

## 🎓 MEB Uyumu

### Ses Grubu Sıralaması (MEB 2024)
| Grup | Harfler | Dünya | Maskot | Süre |
|------|---------|-------|--------|------|
| 1. Grup | A, N, E, T, İ, L | 🌲 Orman | 🦁 Aslan Ali | 6 hafta |
| 2. Grup | O, K, U, R, I, M | 🌊 Okyanus | 🐬 Yunus Yıldız | 4 hafta |
| 3. Grup | Ü, S, Ö, Y, D, Z | ☁️ Gökyüzü | 🦅 Kartal Kaan | 2 hafta |
| 4. Grup | Ç, B, G, C, Ş | 🏜️ Çöl | 🦊 Tilki Tina | 2 hafta |
| 5. Grup | P, H, V, Ğ, F, J | ❄️ Buz | 🐧 Penguen Pelin | 2 hafta |

### Pedagojik Aşamalar (Her Ses İçin)
1. **Sesi Fark Etme** — Kelimelerde sesi duyma ve ayırt etme
2. **Sesi Üretme** — Doğru ağız pozisyonuyla ses çıkarma
3. **Hece Oluşturma** — Öğrenilen seslerle hece birleştirme
4. **Kelime Okuma** — Hecelerden anlamlı kelime oluşturma
5. **Cümle Kurma** — Kelimelerden cümle okuma

### Kümülatif Kelime Sistemi
Her aşamada **SADECE** o ana kadar öğretilmiş harflerle yazılabilen kelimeler kullanılır.
Örnek: T harfi öğretilirken sadece A, N, E, T harflerini içeren kelimeler: at, et, tan, net, tat, tane, nane

### Fonetik Doğruluk
Harf **adı değil sesi** öğretilir: "B" harfi → "b" sesi (ASLA "bö", "bé" değil)

## 🎮 Nasıl Çalışır?
1. Çocuk mikrofona konuşur → **Web Speech API** (tr-TR) sesi metne çevirir
2. AI maskot anlar → **Claude API** pedagogik bağlamda yanıt üretir
3. Maskot sesle konuşur → **ElevenLabs** Türkçe ana dil sesle okur
4. Diyalog devam eder → 5 aşamalı MEB müfredatı takip edilir

## 📊 Öğretmen Paneli
- Harf bazlı değerlendirme (her faz 0-3 puan)
- MEB kazanım kodu referansları (T.O.1.1.1 vb.)
- Grup bazlı ilerleme takibi
- Genel başarı yüzdesi ve yıldız sistemi

## 🏗️ Teknik Mimari

```
├── server/                # Express API Proxy (.env güvenliği)
│   ├── server.js
│   └── routes/
│       ├── claude.js      # MEB faz-bazlı maskot diyalog motoru
│       └── elevenlabs.js  # Türkçe TTS
├── src/
│   ├── config/
│   │   ├── curriculum.js  # 29 harf, kümülatif kelime sistemi
│   │   ├── worlds.js      # 5 MEB ses grubu = 5 dünya
│   │   └── assessment.js  # MEB kazanım ve puanlama
│   ├── hooks/
│   │   ├── useGameStore.js         # Zustand + assessment metrics
│   │   ├── useSpeechRecognition.js # Web Speech API (STT)
│   │   ├── useTextToSpeech.js      # ElevenLabs + fallback
│   │   └── useClaudeDialogue.js    # Faz-duyarlı AI diyalog
│   ├── screens/
│   │   ├── GameScreen.jsx          # 5-FAZLI MEB PEDAGOJİ MOTORU
│   │   ├── TeacherScreen.jsx       # Öğretmen değerlendirme paneli
│   │   └── ...
│   └── components/
│       ├── PhaseIndicator.jsx      # MEB faz göstergesi
│       ├── LetterDisplay.jsx       # Ses + ağız pozisyonu
│       └── ...
```

## 🔧 Kurulum

```bash
git clone https://github.com/Ahmet571-es/okuma_yildizi_3d.git
cd okuma_yildizi_3d
npm install
cp .env.example .env    # API key'leri gir
npm run dev             # localhost:5173
```

## 🔑 API Anahtarları

| Servis | Amaç | Zorunlu? |
|--------|-------|----------|
| Claude API | Maskot diyalogu | Hayır (fallback var) |
| ElevenLabs | Türkçe TTS | Hayır (Web Speech API fallback) |

API key olmadan da temel seviyede çalışır.

## 📱 Tarayıcı: Chrome / Edge önerilir (Web Speech API desteği)

## 📄 Lisans: MIT
