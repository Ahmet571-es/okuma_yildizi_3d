# ⭐ Yıldız Ülkesi — Kurulum ve Yayınlama Rehberi

## 📋 Gereksinimler

- **Node.js** v18+ (https://nodejs.org — LTS versiyonu indir)
- **Git** (https://git-scm.com)
- **Bir kod editörü** (VS Code önerilir)
- **Chrome veya Edge** tarayıcı (Web Speech API için)

---

## ADIM 1: ZIP'i Aç ve Projeyi Hazırla

```bash
# 1. İndirdiğin zip'i aç (masaüstüne veya istediğin klasöre)
# 2. Terminal / Komut satırını aç
# 3. Klasöre git:

cd okuma_yildizi_3d
```

---

## ADIM 2: Bağımlılıkları Yükle

```bash
npm install
```

Bu komut tüm kütüphaneleri (React, Express, Zustand vb.) indirir.
İlk seferde 1-2 dakika sürebilir.

---

## ADIM 3: API Anahtarlarını Ayarla

```bash
# .env dosyasını oluştur
cp .env.example .env
```

Sonra `.env` dosyasını editörle aç ve anahtarları gir:

```env
# Claude API (maskot diyalogu için)
ANTHROPIC_API_KEY=sk-ant-buraya-kendi-keyini-yaz

# ElevenLabs (Türkçe sesli okuma için)
ELEVENLABS_API_KEY=buraya-kendi-keyini-yaz
ELEVENLABS_VOICE_ID=buraya-ses-id-yaz

# Sunucu
PORT=3001
NODE_ENV=development
```

### API Key Nereden Alınır?

**Claude API:**
1. https://console.anthropic.com adresine git
2. Hesap oluştur / giriş yap
3. "API Keys" → "Create Key" → Kopyala

**ElevenLabs:**
1. https://elevenlabs.io adresine git
2. Hesap oluştur (ücretsiz plan yeterli başlangıç için)
3. Profil → "API Key" → Kopyala
4. Türkçe bir ses seç → ses ID'sini kopyala

> ⚠️ API key olmadan da çalışır! Claude yoksa hazır yanıtlar,
> ElevenLabs yoksa tarayıcının yerleşik Türkçe sesi kullanılır.

---

## ADIM 4: Lokalde Test Et

```bash
npm run dev
```

Bu komut iki şey başlatır:
- **Backend** → http://localhost:3001 (API proxy)
- **Frontend** → http://localhost:5173 (oyun arayüzü)

Tarayıcıda **http://localhost:5173** aç.
Mikrofon izni ver ve test et!

---

## ADIM 5: GitHub'a Yükle

```bash
# Git başlat (eğer yoksa)
git init

# Mevcut repo'yu remote olarak ekle
git remote add origin https://github.com/Ahmet571-es/okuma_yildizi_3d.git

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "v2.0 - MEB 2024 Maarif Modeli uyumlu sıfırdan yeniden yazım"

# Ana branch'i ayarla ve push et
git branch -M main
git push -u origin main --force
```

> Not: `--force` mevcut repo içeriğini tamamen değiştirir.
> Eğer eski kodu korumak istersen önce `git push` yerine
> yeni bir branch aç: `git checkout -b v2-meb`

---

## ADIM 6: Canlıya Yayınla (Render.com — ÜCRETSİZ)

Bu proje backend (Express) + frontend (Vite) içerdiği için
**statik hosting (GitHub Pages, Netlify) ÇALIŞMAZ**.
En kolay çözüm: **Render.com** (ücretsiz plan var).

### 6a. Render Hesabı Aç
1. https://render.com adresine git
2. "Get Started for Free" → GitHub ile giriş yap

### 6b. Production Build Script Ekle

Önce `package.json`'a production scriptleri ekleyelim.
package.json'daki "scripts" bölümünü şöyle güncelle:

```json
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "client": "vite",
  "server": "node server/server.js",
  "build": "vite build",
  "start": "NODE_ENV=production node server/server.js",
  "preview": "vite preview"
}
```

### 6c. Server'ı Production İçin Güncelle

server/server.js dosyasının sonuna, `app.listen`'den ÖNCE şunu ekle:

```javascript
// Production'da frontend'i serve et
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}
```

### 6d. Bu Değişiklikleri GitHub'a Push Et

```bash
git add .
git commit -m "Production build hazırlığı"
git push
```

### 6e. Render'da Web Service Oluştur

1. Render Dashboard → **"New +"** → **"Web Service"**
2. **"Build and deploy from a Git repository"** seç
3. GitHub reposunu bağla → `okuma_yildizi_3d` seç
4. Ayarlar:

| Alan | Değer |
|------|-------|
| **Name** | yildiz-ulkesi |
| **Region** | Frankfurt (EU) — Türkiye'ye en yakın |
| **Branch** | main |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

5. **Environment Variables** bölümüne API key'leri ekle:
   - `ANTHROPIC_API_KEY` = sk-ant-xxx
   - `ELEVENLABS_API_KEY` = xxx
   - `ELEVENLABS_VOICE_ID` = xxx (opsiyonel)
   - `NODE_ENV` = production
   - `PORT` = 10000

6. **"Create Web Service"** tıkla

### 6f. Deploy Bekle (3-5 dk)
Render otomatik build edecek. Bitince URL alırsın:
**https://yildiz-ulkesi.onrender.com**

> ⚠️ Render ücretsiz planda 15 dk inaktivite sonrası uyku moduna geçer.
> İlk açılış 30-50 sn sürebilir. Ücretli planda ($7/ay) bu sorun olmaz.

---

## ALTERNATİF: Railway.app

Render yerine Railway da kullanılabilir:

1. https://railway.app → GitHub ile giriş
2. "New Project" → "Deploy from GitHub repo"
3. Repo seç → Otomatik algılar
4. Variables sekmesinden API key'leri ekle
5. Deploy!

Railway $5/ay kredi veriyor, genelde yeterli.

---

## ALTERNATİF: VPS (Tam Kontrol)

Eğer kendi sunucun varsa (DigitalOcean, Hetzner vb.):

```bash
# Sunucuda
git clone https://github.com/Ahmet571-es/okuma_yildizi_3d.git
cd okuma_yildizi_3d
npm install
npm run build

# .env dosyasını oluştur ve key'leri gir
nano .env

# PM2 ile çalıştır (auto-restart)
npm install -g pm2
pm2 start server/server.js --name yildiz-ulkesi
pm2 save
pm2 startup

# Nginx reverse proxy ayarla (port 3001 → 80/443)
```

---

## 🔒 ÖNEMLİ GÜVENLİK NOTLARI

1. `.env` dosyası ASLA GitHub'a push edilmemeli (`.gitignore`'da zaten var)
2. API key'leri SADECE sunucu tarafında kullanılır (frontend asla görmez)
3. Render/Railway'de key'leri Environment Variables olarak girin
4. CORS sadece kendi domain'inize izin verecek şekilde ayarlanmalı

---

## 🧪 Test Kontrol Listesi

Yayınladıktan sonra şunları test et:

- [ ] Mikrofon izni çalışıyor mu?
- [ ] Ses tanıma (Web Speech API) Türkçe algılıyor mu?
- [ ] Maskot konuşuyor mu? (ElevenLabs veya fallback)
- [ ] Harf sırası doğru mu? (A→N→E→T→İ→L ile başlamalı)
- [ ] 2. dünya (Okyanus) kilitli mi? (6 harf tamamlanmadan açılmamalı)
- [ ] Öğretmen paneli açılıyor mu?
- [ ] Mobilde çalışıyor mu? (Chrome Android)

---

## 📞 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| `npm install` hata veriyor | Node.js v18+ yüklü mü? `node -v` kontrol |
| Mikrofon çalışmıyor | Chrome kullan, HTTPS gerekli (localhost hariç) |
| Ses tanıma yok | Chrome/Edge dışı tarayıcılarda desteklenmez |
| Claude yanıt vermiyor | `.env`'de ANTHROPIC_API_KEY doğru mu? Bakiye var mı? |
| ElevenLabs çalışmıyor | Fallback otomatik devreye girer. Key kontrol et |
| Render'da açılmıyor | Build loglarını kontrol et, Start Command doğru mu? |
| HTTPS gerekli hatası | Render/Railway otomatik HTTPS sağlar. Lokal: localhost hariç |

---

## 🔄 Güncelleme Nasıl Yapılır?

```bash
# Kod değişikliği yaptıktan sonra:
git add .
git commit -m "Güncelleme açıklaması"
git push

# Render otomatik yeniden deploy eder (auto-deploy açıksa)
```

---

Bu rehberle sorunsuz yayınlayabilirsin. Herhangi bir adımda takılırsan sor! 🚀
