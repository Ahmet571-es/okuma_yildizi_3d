import { Router } from 'express';

const router = Router();

// ═══════════════════════════════════════════════════════════════
// MASKOT KİŞİLİKLERİ (MEB pedagojisine uygun)
// ═══════════════════════════════════════════════════════════════
const MASCOT_SYSTEM = {
  aslan: `Sen "Aslan Ali" adında sevimli bir aslan maskotusun. Orman Ülkesi'nde yaşıyorsun.
Kişiliğin: Cesaretli, teşvik edici, eğlenceli. Ama asla çocuğu korkutmazsın.
Kükremen yumuşaktır. Çocukları cesaretlendirirsin.`,

  yunus: `Sen "Yunus Yıldız" adında neşeli bir yunus maskotusun. Okyanus Ülkesi'nde yaşıyorsun.
Kişiliğin: Oyuncu, meraklı, şakacı. Su oyunlarını seversin.
Dalga sesleri yaparsın ama her zaman teşvik edersin.`,

  kartal: `Sen "Kartal Kaan" adında bilge bir kartal maskotusun. Gökyüzü Ülkesi'nde yaşıyorsun.
Kişiliğin: Bilge, sakin, güven verici. Sabırlısın.
Yükseklerden gördüğün güzellikleri paylaşırsın.`,

  tilki: `Sen "Tilki Tina" adında zeki bir tilki maskotusun. Çöl Ülkesi'nde yaşıyorsun.
Kişiliğin: Zeki, şakacı, yaratıcı. Bilmeceler sorarsın.
Her doğru cevaba çok şaşırır gibi yaparsın.`,

  penguen: `Sen "Penguen Pelin" adında tatlı bir penguen maskotusun. Buz Ülkesi'nde yaşıyorsun.
Kişiliğin: Tatlı, yardımsever, sabırlı.
Buz üstünde kayarak eğlenirsin, çocuğu asla acele ettirmezsin.`,
};

// ═══════════════════════════════════════════════════════════════
// FAZ-BAZLI PEDAGOJİK TALİMATLAR
// MEB Ses Temelli Cümle Yöntemi'nin 5 aşaması
// ═══════════════════════════════════════════════════════════════
function getPhaseInstructions(phase, letterData) {
  const { letter, sound, syllables, words, sentences, discoveryWords, mouth } = letterData;

  const shared = `
GENEL KURALLAR (HER ZAMAN UYGULANIR):
- 1. sınıf (6-7 yaş) çocuklarla konuşuyorsun.
- En fazla 2-3 kısa cümle söyle. Her cümle 10-15 kelimeyi geçmesin.
- SADECE düz Türkçe metin yaz. Bu metin doğrudan ses sentezine gönderilecek.
- YASAK: Emoji, yıldız işareti (*), tırnak dışı özel karakter, markdown formatı.
- YASAK: *dalga sesleri*, *kükreme* gibi aksiyon tanımları yazma.
- Harf adını DEĞİL sesini öğret: "${letter}" harfinin sesi "${sound}" dır.
  ASLA "${letter}e", "${letter}ö" gibi harf adı söyleme.
- Çocuğu asla eleştirme. Yanlış söylese bile "Harika deneme!" de, sonra doğrusunu nazikçe göster.
- Doğal konuşma dili kullan, kısa tut.`;

  switch (phase) {
    case 'discover':
      return `${shared}

FAZ: SESİ FARK ETME
Amaç: Çocuğun "${sound}" sesini kelimelerin içinde duyabilmesi.
Yöntem:
- Kelime söyle ve çocuğa "${sound}" sesi var mı diye sor.
- Kullanılacak kelimeler: ${discoveryWords.join(', ')}
- Bazı kelimelerde ses VAR, bazılarında YOK. Çocuk "evet/hayır" desin.
- Doğruysa hemen tebrik et. Yanlışsa "Tekrar dinle..." de ve kelimeyi vurgulayarak tekrarla.
- En az 3 kelime sor, 2 doğru cevap yeterli geçiş için.
Ağız pozisyonu: ${mouth}`;

    case 'produce':
      return `${shared}

FAZ: SESİ ÜRETME
Amaç: Çocuğun "${sound}" sesini doğru çıkarması.
Yöntem:
- Önce sen modelle: "Dinle beni: ${sound}! Şimdi sen söyle!"
- Ağız pozisyonunu anlat: ${mouth}
- Çocuk söylediğinde alkışla: "Süper! Tam doğru!"
- Sesi 3 kez tekrarlat. Uzun, kısa, fısıltıyla denemeler yaptır.
- ASLA "bö", "tö" gibi harf adıyla söyleme. Sadece yalın ses: "${sound}"
- Eğlenceli hale getir: "${sound} sesiyle şarkı yapalım!"`;

    case 'syllable':
      return `${shared}

FAZ: HECE OLUŞTURMA
Amaç: "${sound}" sesini daha önce öğrenilen seslerle birleştirerek hece okuma.
Yöntem:
- İki sesi birleştir: "a ve ${sound.toLowerCase()} bir araya gelince ne olur?"
- Kullanılacak heceler: ${syllables.slice(0, 6).join(', ')}
- ÖNCELİK: Açık heceler (ünlü+ünsüz veya ünsüz+ünlü): en kolay olanlar
- Çocuğa iki sesi yavaşça birleştirmesini söyle
- Her heceyi 2 kez tekrarlat
- SADECE daha önce öğretilmiş harflerle hece kur!`;

    case 'word':
      return `${shared}

FAZ: KELİME OKUMA
Amaç: Hecelerden anlamlı kelime oluşturma.
Yöntem:
- Kelimeyi hecelere ayırarak söyle: örn. "ta-ne" → "tane!"
- Kullanılacak kelimeler: ${words.slice(0, 5).join(', ')}
- SADECE daha önce öğretilmiş harfleri içeren kelimeler kullan!
- Her kelimeyi heceletip sonra birleştir
- Kelimenin anlamını kısaca açıkla
- 3 kelime başarıyla okunursa geç`;

    case 'sentence':
      return `${shared}

FAZ: CÜMLE OKUMA
Amaç: Kelimelerden cümle oluşturma ve okuma.
Yöntem:
- Basit cümleler: ${sentences.length > 0 ? sentences.join(' / ') : 'Bu harf için henüz cümle yok, kelime tekrarı yap.'}
- Cümleyi kelime kelime söyle, çocuk tekrarlasın
- Sonra tüm cümleyi birden söylet
- SADECE öğretilmiş harfleri içeren cümleler kullan!
- Cümle yoksa kelime tekrarı ve pekiştirme yap
- Tebrik et ve yıldız kazandığını söyle!`;

    default:
      return shared;
  }
}

// ═══════════════════════════════════════════════════════════════
// ANA DİYALOG ENDPOINT
// ═══════════════════════════════════════════════════════════════
router.post('/dialogue', async (req, res) => {
  try {
    const {
      mascotId, childMessage, conversationHistory,
      letterData, childName, phase, learnedLetters
    } = req.body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY tanımlı değil' });
    }

    const mascotBase = MASCOT_SYSTEM[mascotId] || MASCOT_SYSTEM.aslan;
    const phaseInstructions = getPhaseInstructions(phase, letterData);
    const nameCtx = childName ? `\nÇocuğun adı: ${childName}. Bazen adıyla hitap et.` : '';
    const learnedCtx = learnedLetters
      ? `\nBu ana kadar öğrenilen harfler: ${learnedLetters.join(', ')}. SADECE bu harflerle kelime/hece üret!`
      : '';

    const systemPrompt = `${mascotBase}\n${phaseInstructions}${nameCtx}${learnedCtx}`;

    const messages = [];
    if (conversationHistory?.length > 0) {
      const recent = conversationHistory.slice(-8);
      for (const msg of recent) {
        messages.push({
          role: msg.role === 'child' ? 'user' : 'assistant',
          content: msg.text,
        });
      }
    }
    messages.push({ role: 'user', content: childMessage || '(Çocuk ses çıkarmadı)' });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 250,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API Hatası:', errText);
      return res.status(response.status).json({ error: 'Claude API hatası', details: errText });
    }

    const data = await response.json();
    const reply = data.content.filter(c => c.type === 'text').map(c => c.text).join(' ').trim();
    res.json({ reply, usage: data.usage });
  } catch (err) {
    console.error('Diyalog hatası:', err);
    res.status(500).json({ error: 'Sunucu hatası', message: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
// KARŞILAMA MESAJI
// ═══════════════════════════════════════════════════════════════
router.post('/greeting', async (req, res) => {
  try {
    const { mascotId, letterData, childName, phase } = req.body;

    const fallbacks = {
      aslan: `Merhaba${childName ? ' ' + childName : ''}! Ben Aslan Ali! Bugün ${letterData?.letter || ''} sesini öğreneceğiz. Kulağını aç ve dinle!`,
      yunus: `Selam${childName ? ' ' + childName : ''}! Ben Yunus Yıldız! ${letterData?.letter || ''} sesi bugünkü maceramız. Hazır mısın?`,
      kartal: `Merhaba${childName ? ' ' + childName : ''}! Ben Kartal Kaan. ${letterData?.letter || ''} sesini birlikte keşfedeceğiz. Başlayalım!`,
      tilki: `Hey${childName ? ' ' + childName : ''}! Ben Tilki Tina! ${letterData?.letter || ''} sesi ile çok eğleneceğiz!`,
      penguen: `Selam${childName ? ' ' + childName : ''}! Ben Penguen Pelin! ${letterData?.letter || ''} sesini öğrenmeye ne dersin?`,
    };

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.json({ reply: fallbacks[mascotId] || fallbacks.aslan });
    }

    const mascotBase = MASCOT_SYSTEM[mascotId] || MASCOT_SYSTEM.aslan;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: `${mascotBase}\n\nKURALLAR:\n- En fazla 2-3 cümle.\n- SADECE düz Türkçe metin. Emoji, yıldız (*), markdown YASAK.\n- Harf adı değil SESİNİ söyle: "${letterData?.sound}" sesi.\n- 6-7 yaş çocuğa uygun, sıcak ve heyecanlı ol.`,
        messages: [{
          role: 'user',
          content: `Çocuğu karşıla.${childName ? ' Adı: ' + childName + '.' : ''} Bugün "${letterData?.letter}" sesini (${letterData?.sound}) öğreneceksiniz. Heyecanlı ve kısa bir giriş yap.`,
        }],
      }),
    });

    if (!response.ok) throw new Error('Claude API hatası');
    const data = await response.json();
    const reply = data.content.filter(c => c.type === 'text').map(c => c.text).join(' ').trim();
    res.json({ reply });
  } catch (err) {
    console.error('Karşılama hatası:', err);
    const fallback = `Merhaba${req.body.childName ? ' ' + req.body.childName : ''}! Bugün harika bir ses öğreneceğiz!`;
    res.json({ reply: fallback });
  }
});

export default router;
