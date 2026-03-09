# ⭐ Yıldız Ülkesi v3 — MEB Uyumlu İnteraktif Okuma Macerası

MEB 2024 Türkiye Yüzyılı Maarif Modeli ile tam uyumlu, **6 interaktif mini oyun** ile zenginleştirilmiş ilk okuma-yazma öğretim platformu.

## 🎮 Yenilikler (v3)

- **Balon Patlatma** → Sesi fark etme (dinleme)
- **Ses Ölçer** → Sesi üretme (konuşma)
- **Harf Tracing** → Harfi yazma (yazma)
- **Sürükle-Bırak Hece** → Hece oluşturma
- **Resim-Kelime Eşleştirme** → Kelime okuma
- **Kelime Sıralama** → Cümle kurma

**+ Dünya Haritası | Rozet Sistemi | Animasyonlu Maskotlar | Öğretmen Paneli**

## 🚀 Kurulum

```bash
npm install
cp .env.example .env    # API key'leri ekle
npm run dev              # localhost:5173
```

## 🔑 API Anahtarları

| Servis | Amaç | Zorunlu? |
|--------|-------|----------|
| Claude API | Maskot diyalogu | Hayır (fallback var) |
| Google Cloud | TTS + STT | Hayır (Web Speech API fallback) |
| ElevenLabs | Premium TTS | Hayır (Google TTS fallback) |

## 📱 Tarayıcı: Chrome / Edge önerilir

## 📄 Lisans: MIT
