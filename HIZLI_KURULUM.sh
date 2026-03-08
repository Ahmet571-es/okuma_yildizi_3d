#!/bin/bash
# ═══════════════════════════════════════════════════════════
# ⭐ YILDIZ ÜLKESİ — TEK KOMUTLA KURULUM
# Bu scripti çalıştır, gerisini o halleder
# ═══════════════════════════════════════════════════════════

set -e
echo ""
echo "⭐ Yıldız Ülkesi — Kurulum Başlıyor..."
echo "════════════════════════════════════════"
echo ""

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo "❌ Node.js bulunamadı!"
    echo "   https://nodejs.org adresinden LTS versiyonu indir."
    exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
    echo "❌ Node.js v18+ gerekli. Mevcut: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) bulundu"

# Git kontrolü
if ! command -v git &> /dev/null; then
    echo "❌ Git bulunamadı! https://git-scm.com adresinden indir."
    exit 1
fi
echo "✅ Git bulundu"

# Bağımlılıkları yükle
echo ""
echo "📦 Bağımlılıklar yükleniyor..."
npm install --silent 2>/dev/null
echo "✅ Bağımlılıklar yüklendi"

# .env dosyası
if [ ! -f .env ]; then
    cp .env.example .env
    echo ""
    echo "📝 .env dosyası oluşturuldu."
    echo "   API key'lerini girmek ister misin? (key olmadan da çalışır)"
    read -p "   [e/h]: " answer
    if [ "$answer" = "e" ] || [ "$answer" = "E" ]; then
        echo ""
        read -p "   ANTHROPIC_API_KEY (boş bırakabilirsin): " CLAUDE_KEY
        read -p "   ELEVENLABS_API_KEY (boş bırakabilirsin): " EL_KEY
        read -p "   ELEVENLABS_VOICE_ID (boş bırakabilirsin): " EL_VOICE

        if [ -n "$CLAUDE_KEY" ]; then
            sed -i "s|ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=$CLAUDE_KEY|" .env
        fi
        if [ -n "$EL_KEY" ]; then
            sed -i "s|ELEVENLABS_API_KEY=.*|ELEVENLABS_API_KEY=$EL_KEY|" .env
        fi
        if [ -n "$EL_VOICE" ]; then
            sed -i "s|ELEVENLABS_VOICE_ID=.*|ELEVENLABS_VOICE_ID=$EL_VOICE|" .env
        fi
        echo "   ✅ API key'leri kaydedildi"
    fi
else
    echo "✅ .env dosyası mevcut"
fi

# Build
echo ""
echo "🔨 Production build yapılıyor..."
npx vite build --silent 2>/dev/null || npx vite build
echo "✅ Build tamamlandı"

# Git
echo ""
echo "════════════════════════════════════════"
echo "📤 GitHub'a Push"
echo "════════════════════════════════════════"
read -p "GitHub'a push etmek ister misin? [e/h]: " gitanswer
if [ "$gitanswer" = "e" ] || [ "$gitanswer" = "E" ]; then
    if [ ! -d .git ]; then
        git init
    fi
    git add .
    git commit -m "v2.0 - MEB 2024 Maarif Modeli uyumlu Yıldız Ülkesi" 2>/dev/null || true

    # Remote kontrolü
    REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
    if [ -z "$REMOTE" ]; then
        read -p "GitHub repo URL'i: " REPO_URL
        git remote add origin "$REPO_URL"
    else
        echo "   Mevcut remote: $REMOTE"
    fi

    git branch -M main
    echo "   Push ediliyor..."
    git push -u origin main --force
    echo "✅ GitHub'a push edildi!"
fi

echo ""
echo "════════════════════════════════════════"
echo "⭐ KURULUM TAMAMLANDI!"
echo "════════════════════════════════════════"
echo ""
echo "📌 Lokalde test etmek için:  npm run dev"
echo "   Sonra tarayıcıda:        http://localhost:5173"
echo ""
echo "📌 Canlıya almak için:"
echo "   1. https://render.com → GitHub ile giriş"
echo "   2. New Web Service → Bu repoyu seç"
echo "   3. Build Command:  npm install && npm run build"
echo "   4. Start Command:  npm start"
echo "   5. Environment'a API key'leri ekle"
echo "   6. Deploy!"
echo ""
echo "   VEYA: https://railway.app ile aynı adımlar"
echo ""
echo "🌟 Yıldız Ülkesi hazır! 🌟"
