// ═══════════════════════════════════════════════════════════════
// MEB 2024 TÜRKİYE YÜZYILI MAARİF MODELİ
// Ses Temelli Cümle Yöntemi - İlk Okuma Yazma Müfredatı
// 5 Ses Grubu × 29 Harf × Kümülatif Kelime Sistemi
// ═══════════════════════════════════════════════════════════════
//
// HARF SIRASI (MEB 2024):
// 1. Grup (6 hafta): A, N, E, T, İ, L
// 2. Grup (4 hafta): O, K, U, R, I, M
// 3. Grup (2 hafta): Ü, S, Ö, Y, D, Z
// 4. Grup (2 hafta): Ç, B, G, C, Ş
// 5. Grup (2 hafta): P, H, V, Ğ, F, J
//
// KRİTİK KURAL: Her harfin kelime/hece havuzu SADECE
// o ana kadar öğretilmiş harfleri kullanır.
// "İ" = noktalı i, "I" = noktasız ı
// ═══════════════════════════════════════════════════════════════

export const MEB_ORDER = [
  'A','N','E','T','İ','L',   // 1. Grup
  'O','K','U','R','I','M',   // 2. Grup
  'Ü','S','Ö','Y','D','Z',   // 3. Grup
  'Ç','B','G','C','Ş',       // 4. Grup
  'P','H','V','Ğ','F','J',   // 5. Grup
];

export const GROUP_INFO = [
  { id: 1, name: '1. Ses Grubu', weeks: 6, letters: ['A','N','E','T','İ','L'] },
  { id: 2, name: '2. Ses Grubu', weeks: 4, letters: ['O','K','U','R','I','M'] },
  { id: 3, name: '3. Ses Grubu', weeks: 2, letters: ['Ü','S','Ö','Y','D','Z'] },
  { id: 4, name: '4. Ses Grubu', weeks: 2, letters: ['Ç','B','G','C','Ş'] },
  { id: 5, name: '5. Ses Grubu', weeks: 2, letters: ['P','H','V','Ğ','F','J'] },
];

// ═══════════════════════════════════════════════════════════════
// MEB PEDAGOJİK AŞAMALAR (her harf için 5 aşama)
// ═══════════════════════════════════════════════════════════════
export const PHASES = {
  DISCOVER:  'discover',   // 1. Sesi Fark Etme (ses duyma, ayırt etme)
  PRODUCE:   'produce',    // 2. Sesi Üretme (doğru seslendirme)
  WRITE:     'write',      // 3. Harfi Yazma (parmakla çizme)
  SYLLABLE:  'syllable',   // 4. Hece Oluşturma (ses birleştirme)
  WORD:      'word',       // 5. Kelime Oluşturma (hecelerden kelime)
  SENTENCE:  'sentence',   // 6. Cümle Oluşturma (kelimelerden cümle)
};

export const PHASE_LABELS = {
  [PHASES.DISCOVER]: 'Sesi Fark Et',
  [PHASES.PRODUCE]:  'Sesi Söyle',
  [PHASES.WRITE]:    'Harfi Yaz',
  [PHASES.SYLLABLE]: 'Hece Kur',
  [PHASES.WORD]:     'Kelime Oku',
  [PHASES.SENTENCE]: 'Cümle Kur',
};

// ═══════════════════════════════════════════════════════════════
// 29 HARF MÜFREDATİ — KÜMÜLATİF
// Her harf SADECE öncesinde öğretilmiş harflerle kelime içerir
// sound: Yalın ses (harf adı DEĞİL — MEB kuralı)
// ═══════════════════════════════════════════════════════════════
export const CURRICULUM = {
  // ─────────────── 1. GRUP: A, N, E, T, İ, L ───────────────
  A: {
    letter: 'A', lower: 'a', sound: 'a', group: 1, order: 1,
    mouth: 'Ağzını büyükçe aç, çeneni aşağı indir.',
    syllables: ['a'],
    words: [],  // İlk harf — henüz kelime yok, sadece ses
    sentences: [],
    discoveryWords: ['araba', 'süt', 'anne', 'top'],
    discoveryPrompt: 'Bu kelimelerde "a" sesi var mı yok mu?',
  },
  N: {
    letter: 'N', lower: 'n', sound: 'n', group: 1, order: 2,
    mouth: 'Dilini üst damağına yapıştır, burnundan ses ver.',
    syllables: ['an', 'na'],
    words: ['an'],
    sentences: [],
    discoveryWords: ['nine', 'top', 'anne', 'kuş'],
    discoveryPrompt: 'Hangi kelimelerde "n" sesi duyuyorsun?',
  },
  E: {
    letter: 'E', lower: 'e', sound: 'e', group: 1, order: 3,
    mouth: 'Dudaklarını hafif yana çek, gülümser gibi yap.',
    syllables: ['an', 'na', 'en', 'ne', 'ae', 'ea'],
    words: ['an', 'ne', 'ane'],
    sentences: [],
    discoveryWords: ['elma', 'ev', 'ekmek', 'top'],
    discoveryPrompt: '"E" sesini hangi kelimelerde duyuyorsun?',
  },
  T: {
    letter: 'T', lower: 't', sound: 't', group: 1, order: 4,
    mouth: 'Dilinin ucunu üst dişlerinin arkasına koy, hızla çek.',
    syllables: ['at', 'ta', 'et', 'te', 'an', 'na', 'en', 'ne'],
    words: ['at', 'et', 'tat', 'tan', 'ten', 'net', 'tane', 'nane', 'ente'],
    sentences: ['Tat ne?'],
    discoveryWords: ['tavuk', 'top', 'tren', 'kalem'],
    discoveryPrompt: '"T" sesi hangi kelimelerde var?',
    names: ['Ata'],
  },
  İ: {
    letter: 'İ', lower: 'i', sound: 'i', group: 1, order: 5,
    mouth: 'Dudaklarını yana çek, dişlerini biraz göster.',
    syllables: ['at','ta','et','te','an','na','en','ne','it','ti','in','ni'],
    words: ['at','et','it','an','ne','in','tat','tan','ten','net','tin','tane','nane','nine','inat','anti'],
    sentences: ['Tane net.', 'Nine, nane at.'],
    discoveryWords: ['inek', 'ip', 'incir', 'ütü'],
    discoveryPrompt: '"İ" sesini duy! Hangi kelimelerde var?',
    names: ['Ata', 'İnan'],
  },
  L: {
    letter: 'L', lower: 'l', sound: 'l', group: 1, order: 6,
    mouth: 'Dilinin ucunu üst damağına yapıştır, yanlardan ses ver.',
    syllables: ['al','la','el','le','il','li','at','ta','et','te','an','na','en','ne','it','ti','in','ni'],
    words: ['at','et','it','al','el','il','an','ne','in','alt','tat','tan','ten','net','tin','lal',
            'tane','nane','nine','lale','alet','elle','elli','ileti','anti','inat','telli'],
    sentences: ['Ali, lale al.', 'Ela, nane al.', 'Ali ile Ela.', 'Alet al, Ali.', 'Lale elli tane.'],
    discoveryWords: ['limon', 'lamba', 'lokum', 'araba'],
    discoveryPrompt: '"L" sesini duyabilir misin? Hangi kelimelerde?',
    names: ['Ali', 'Ela', 'Nil', 'Ata', 'İnal'],
  },

  // ─────────────── 2. GRUP: O, K, U, R, I, M ───────────────
  O: {
    letter: 'O', lower: 'o', sound: 'o', group: 2, order: 7,
    mouth: 'Dudaklarını yuvarlak yap, öne doğru it.',
    syllables: ['ol','lo','on','no','ot','to','al','la','el','le'],
    words: ['ol','on','ot','not','ton','tol','otel','nota','talon','oltan'],
    sentences: ['Ali, not al.', 'Otel on tane.', 'Nota al, Ela.'],
    discoveryWords: ['okul', 'otobüs', 'orman', 'çanta'],
    discoveryPrompt: '"O" sesi hangi kelimelerde saklı?',
    names: ['Ali', 'Ela', 'Nil', 'Oltan'],
  },
  K: {
    letter: 'K', lower: 'k', sound: 'k', group: 2, order: 8,
    mouth: 'Dilin arkasını damağa yapıştır, sert bir ses çıkar.',
    syllables: ['ak','ka','ek','ke','ik','ki','ok','ko','al','la','el','le'],
    words: ['kale','kol','kel','kan','kin','kot','tek','tok','oktan','kalite',
            'kanal','keten','kilit','kolon','tokat','kanat','tekne'],
    sentences: ['Ali, kale al.', 'Kol kol, el ele.', 'Kanat tek.', 'Ketene not al.'],
    discoveryWords: ['kuş', 'kedi', 'kalem', 'ağaç'],
    discoveryPrompt: '"K" sesi nerede?',
    names: ['Ali', 'Ela', 'Kenan', 'Kaan'],
  },
  U: {
    letter: 'U', lower: 'u', sound: 'u', group: 2, order: 9,
    mouth: 'Dudaklarını topla, öne doğru uzat, yuvarlak tut.',
    syllables: ['ul','lu','un','nu','ut','tu','uk','ku','al','la'],
    words: ['un','kul','kutu','unut','ulak','kulon','nutuk','kulak','kukla','tutun','tuluk'],
    sentences: ['Kutu al, Ali.', 'Un at, Ela.', 'Kulak tut.'],
    discoveryWords: ['uçak', 'uzay', 'uyku', 'masa'],
    discoveryPrompt: '"U" sesini duy!',
    names: ['Ali', 'Ela', 'Kenan', 'Utku'],
  },
  R: {
    letter: 'R', lower: 'r', sound: 'r', group: 2, order: 10,
    mouth: 'Dilini titret, damağa değdir çek.',
    syllables: ['ar','ra','er','re','ir','ri','or','ro','ur','ru'],
    words: ['renk','arka','rota','tur','kar','rol','rulo',
            'kurt','orta','tire','rant','kural','ortak','kartal','kornet'],
    sentences: ['Kartal uçar.', 'Kurt, orta not al.', 'Arı ile koru.'],
    discoveryWords: ['robot', 'resim', 'radyo', 'top'],
    discoveryPrompt: '"R" sesi titreşir! Nerede duyuyorsun?',
    names: ['Ali', 'Ela', 'Kenan', 'Rükan', 'Kartal'],
  },
  I: {
    letter: 'I', lower: 'ı', sound: 'ı', group: 2, order: 11,
    mouth: 'Dudaklarını geriye çek ama yuvarlama. Gırtlaktan gelir.',
    syllables: ['al','la','ıl','lı','ır','rı','ın','nı','ık','kı'],
    words: ['ılık','ırak','alın','kırık','kıl','altın','artık','karın','takılı','kırılı','ırlak','tanık'],
    sentences: ['Altın ılık.', 'Artık tanık al.', 'Kırık alet.'],
    discoveryWords: ['ırmak', 'ılık', 'ıslık', 'elma'],
    discoveryPrompt: '"I" sesi "ı" diye okunur. Nerede?',
    names: ['Ali', 'Ela', 'Kıral', 'Tanık'],
  },
  M: {
    letter: 'M', lower: 'm', sound: 'm', group: 2, order: 12,
    mouth: 'Dudaklarını kapat, burnundan ses ver: mmm.',
    syllables: ['am','ma','em','me','im','mi','om','mo','um','mu'],
    words: ['mum','mal','men','mola','marul','makine','minik','motor','mutlu',
            'metin','mental','market','miktar','malum','mıntık','milat'],
    sentences: ['Metin, mum al.', 'Motor mutlu.', 'Marul market.', 'Minik Ali mutlu.'],
    discoveryWords: ['masa', 'muz', 'mantar', 'top'],
    discoveryPrompt: '"M" sesi dudaklarını kapar! Nerede?',
    names: ['Ali', 'Ela', 'Metin', 'Murat', 'Merlin'],
  },

  // ─────────────── 3. GRUP: Ü, S, Ö, Y, D, Z ───────────────
  Ü: {
    letter: 'Ü', lower: 'ü', sound: 'ü', group: 3, order: 13,
    mouth: 'Dudaklarını topla ve öne uzat ama "i" gibi ince söyle.',
    syllables: ['ül','lü','ün','nü','üt','tü','ük','kü','ür','rü','üm','mü'],
    words: ['üç','ütü','üst','tür','küt','müt','kürk','türkü','ünlü','mürit','türk','üretim'],
    sentences: ['Ütü üç tane.', 'Türkü ünlü.', 'Kürk üst kat.'],
    discoveryWords: ['üzüm', 'ütü', 'ülke', 'araba'],
    discoveryPrompt: '"Ü" sesi dudakları büzer! Nerede?',
    names: ['Ali', 'Ela', 'Metin', 'Ülkü'],
  },
  S: {
    letter: 'S', lower: 's', sound: 's', group: 3, order: 14,
    mouth: 'Dişlerini birbirine yaklaştır, fısıldar gibi: sss.',
    syllables: ['as','sa','es','se','is','si','os','so','us','su','üs','sü'],
    words: ['su','sol','süt','son','sır','salt','simit','sinir','sultan','sırt',
            'sonuç','soru','sınıt','sular','simli','serim','sorun','sektor'],
    sentences: ['Sultan su al.', 'Süt sorun mu?', 'Simit üst kat.'],
    discoveryWords: ['su', 'saat', 'sincap', 'top'],
    discoveryPrompt: '"S" sesi yılan gibi fısıldar! Nerede?',
    names: ['Ali', 'Ela', 'Metin', 'Sultan', 'Selin'],
  },
  Ö: {
    letter: 'Ö', lower: 'ö', sound: 'ö', group: 3, order: 15,
    mouth: 'Dudaklarını topla, "o" gibi ama ince söyle.',
    syllables: ['öl','lö','ön','nö','öt','tö','ök','kö','ör','rö','öm','mö','ös','sö'],
    words: ['ön','öl','ört','ötü','örs','köle','sönük','sönme','ölçü','önem',
            'ömür','örtü','ören','öteki','sökmek','kömür'],
    sentences: ['Ön sıra, Sultan.', 'Kömür ört.', 'Ömür önemli.'],
    discoveryWords: ['ördek', 'ödev', 'öğretmen', 'araba'],
    discoveryPrompt: '"Ö" sesi dudakları büzer! Nerede?',
    names: ['Ali', 'Ela', 'Metin', 'Ömer'],
  },
  Y: {
    letter: 'Y', lower: 'y', sound: 'y', group: 3, order: 16,
    mouth: 'Dilini damağa yaklaştır ama değme, yumuşak bir ses.',
    syllables: ['ay','ya','ey','ye','iy','yi','oy','yo','uy','yu','üy','yü','öy','yö'],
    words: ['yol','yan','yıl','yurt','yün','yırtık','yorum','yüksek','yalan',
            'yeter','yoğurt','yurt','yanık','yılın','yalnız','yırtık'],
    sentences: ['Yol yan.', 'Yoğurt yeter.', 'Yüksek yurt.'],
    discoveryWords: ['yıldız', 'yaprak', 'yumurta', 'masa'],
    discoveryPrompt: '"Y" sesi yumuşak! Nerede duyuyorsun?',
    names: ['Ali', 'Ela', 'Metin', 'Yasemin', 'Yusuf'],
  },
  D: {
    letter: 'D', lower: 'd', sound: 'd', group: 3, order: 17,
    mouth: 'Dilini üst dişlerin arkasına koy, "t" gibi ama titretirli.',
    syllables: ['ad','da','ed','de','id','di','od','do','ud','du','üd','dü','öd','dö','yd','dy'],
    words: ['dil','dal','dur','dolu','dost','dünya','destek','demir',
            'dert','dolum','direkt','dayı','dersi','dalı','dürüst'],
    sentences: ['Dost yol yürür.', 'Dal durur.', 'Dünya yol.'],
    discoveryWords: ['deniz', 'dağ', 'deve', 'top'],
    discoveryPrompt: '"D" sesi "t" nin kardeşi ama yumuşak! Nerede?',
    names: ['Ali', 'Ela', 'Metin', 'Deniz', 'Doruk'],
  },
  Z: {
    letter: 'Z', lower: 'z', sound: 'z', group: 3, order: 18,
    mouth: 'Dişlerini "s" gibi yaklaştır ama titreşimli söyle: zzz.',
    syllables: ['az','za','ez','ze','iz','zi','oz','zo','uz','zu','üz','zü','öz','zö'],
    words: ['yüz','söz','göz','zil','uzun','deniz','yıldız','düz','süzme',
            'tuz','sözlük','zeytin','zor','zoom','azı','ızın'],
    sentences: ['Deniz düz.', 'Yıldız yüz tane.', 'Zil öt.'],
    discoveryWords: ['zürafa', 'zil', 'zeytin', 'araba'],
    discoveryPrompt: '"Z" sesi "s" nin titreşimlisi! Nerede?',
    names: ['Ali', 'Ela', 'Metin', 'Deniz', 'Zeynep'],
  },

  // ─────────────── 4. GRUP: Ç, B, G, C, Ş ───────────────
  Ç: {
    letter: 'Ç', lower: 'ç', sound: 'ç', group: 4, order: 19,
    mouth: 'Dilini damağa yapıştır, "t" ve "ş" arası sert ses.',
    syllables: ['aç','ça','eç','çe','iç','çi','oç','ço','uç','çu','üç','çü','öç','çö'],
    words: ['çok','üç','iç','aç','çöl','çizim','çiçek','çözmek','çelik',
            'çürük','çıkış','çoçuk','çözüm','çetin','çift'],
    sentences: ['Çöl çok sıcak.', 'Üç çiçek al.', 'Çetin çözüm.'],
    discoveryWords: ['çiçek', 'çanta', 'çorap', 'top'],
    discoveryPrompt: '"Ç" sesi sert! Nerede duyuyorsun?',
    names: ['Ali', 'Çetin', 'Deniz'],
  },
  B: {
    letter: 'B', lower: 'b', sound: 'b', group: 4, order: 20,
    mouth: 'Dudaklarını kapat, birden aç: b! ("Bö" değil!)',
    syllables: ['ab','ba','eb','be','ib','bi','ob','bo','ub','bu','üb','bü','öb','bö'],
    words: ['bir','ben','bol','buz','burun','bilim','bulut','beyaz','borç',
            'büyük','bölüm','bilet','buçuk','bıçkı','blok'],
    sentences: ['Ben bir büyük bulut.', 'Buz bol.', 'Bilim bölüm.'],
    discoveryWords: ['balon', 'böcek', 'balık', 'masa'],
    discoveryPrompt: '"B" sesi dudak patlaması! Nerede?',
    names: ['Ali', 'Ela', 'Burak', 'Berk'],
  },
  G: {
    letter: 'G', lower: 'g', sound: 'g', group: 4, order: 21,
    mouth: 'Dilin arkasını damağa yapıştır, yumuşak ses çıkar.',
    syllables: ['ag','ga','eg','ge','ig','gi','og','go','ug','gu','üg','gü','ög','gö'],
    words: ['göl','gel','gül','gün','giz','güzel','giyim','gökyüzü','gezi',
            'gür','görüntü','gündem','gizli','güçlü','gölge'],
    sentences: ['Göl güzel.', 'Gül gün göçer.', 'Gizli gezi.'],
    discoveryWords: ['gemi', 'güneş', 'gökkuşağı', 'araba'],
    discoveryPrompt: '"G" sesi "k" nin yumuşağı! Nerede?',
    names: ['Ali', 'Ela', 'Gül', 'Deniz'],
  },
  C: {
    letter: 'C', lower: 'c', sound: 'c', group: 4, order: 22,
    mouth: 'Dilini damağa yapıştır, "d" ve "j" arası yumuşak.',
    syllables: ['ac','ca','ec','ce','ic','ci','oc','co','uc','cu','üc','cü','öc','cö'],
    words: ['can','cilt','cins','cümle','ceket','çiçek','cüzdan','ceylan',
            'cömert','canlı','cüret','cılız','cenk'],
    sentences: ['Can cömert.', 'Ceylan canlı.', 'Cümle çiz.'],
    discoveryWords: ['cam', 'ceylan', 'ceviz', 'top'],
    discoveryPrompt: '"C" sesi yumuşak bir patlama! Nerede?',
    names: ['Ali', 'Ela', 'Can', 'Ceyda'],
  },
  Ş: {
    letter: 'Ş', lower: 'ş', sound: 'ş', group: 4, order: 23,
    mouth: 'Dudaklarını öne uzat, dişleri yaklaştır: şşş.',
    syllables: ['aş','şa','eş','şe','iş','şi','oş','şo','uş','şu','üş','şü','öş','şö'],
    words: ['şu','beş','iş','kuş','güneş','şekil','şölen','şiddet',
            'şüçük','şeftali','şöyle','şart','şişe','şirin'],
    sentences: ['Beş kuş uçtu.', 'Güneş şirin.', 'Şu iş çok.'],
    discoveryWords: ['şeker', 'şemsiye', 'şapka', 'masa'],
    discoveryPrompt: '"Ş" sesi sus işareti gibi: şşş! Nerede?',
    names: ['Ali', 'Ela', 'Deniz', 'Şirin'],
  },

  // ─────────────── 5. GRUP: P, H, V, Ğ, F, J ───────────────
  P: {
    letter: 'P', lower: 'p', sound: 'p', group: 5, order: 24,
    mouth: 'Dudaklarını kapat, sert bir şekilde aç: p!',
    syllables: ['ap','pa','ep','pe','ip','pi','op','po','up','pu','üp','pü'],
    words: ['pul','pas','pilot','program','prens','portakal',
            'pancar','pencil','pırıl','polis','poyraz'],
    sentences: ['Polis pul toplu.', 'Portakal parlak.'],
    discoveryWords: ['patates', 'panda', 'portakal', 'top'],
    discoveryPrompt: '"P" sesi "b" nin sert hali! Nerede?',
    names: ['Ali', 'Ela', 'Deniz', 'Pelin'],
  },
  H: {
    letter: 'H', lower: 'h', sound: 'h', group: 5, order: 25,
    mouth: 'Nefesini dışarı ver, boğazından hafif bir ses: h.',
    syllables: ['ah','ha','eh','he','ih','hi','oh','ho','uh','hu'],
    words: ['her','hız','hoş','hint','horoz','hesap','hikmet',
            'hürmet','hırsız','holün','hayır','huzur'],
    sentences: ['Her hoş hikmet.', 'Hızlı horoz.', 'Huzur her şey.'],
    discoveryWords: ['havuç', 'halı', 'hediye', 'araba'],
    discoveryPrompt: '"H" sesi nefes gibi! Nerede?',
    names: ['Ali', 'Ela', 'Deniz', 'Hülya'],
  },
  V: {
    letter: 'V', lower: 'v', sound: 'v', group: 5, order: 26,
    mouth: 'Üst dişlerini alt dudağına koy, titreşimli: vvv.',
    syllables: ['av','va','ev','ve','iv','vi','ov','vo','uv','vu'],
    words: ['ve','var','ver','vız','vol','vicdan','vişne','vücut',
            'vuruş','vitrin','volkan','vur'],
    sentences: ['Ver ve al.', 'Vişne var.', 'Vücut önemli.'],
    discoveryWords: ['vapur', 'vazo', 'vişne', 'top'],
    discoveryPrompt: '"V" sesi titreşir! Nerede?',
    names: ['Ali', 'Ela', 'Deniz', 'Volkan'],
  },
  Ğ: {
    letter: 'Ğ', lower: 'ğ', sound: 'ğ', group: 5, order: 27,
    mouth: 'Bu ses tek başına söylenmez! Ünlüyü uzatır veya yumuşatır.',
    syllables: ['ağ','eğ','iğ','oğ','uğ','üğ','öğ'],
    words: ['dağ','bağ','soğuk','yağmur','doğru','eğlence',
            'oğul','çağ','sığır','değil','öğle'],
    sentences: ['Dağ soğuk.', 'Yağmur çok.', 'Doğru söz.'],
    discoveryWords: ['dağ', 'bağ', 'yağmur', 'araba'],
    discoveryPrompt: '"Ğ" sesi gizli bir kahraman! Sesleri uzatır. Nerede?',
    names: ['Ali', 'Ela', 'Deniz', 'Doğukan'],
  },
  F: {
    letter: 'F', lower: 'f', sound: 'f', group: 5, order: 28,
    mouth: 'Üst dişlerini alt dudağına koy, nefesini ver: fff.',
    syllables: ['af','fa','ef','fe','if','fi','of','fo','uf','fu'],
    words: ['fil','fen','fır','fol','füze','fırın','filiz',
            'fırtına','fıstık','fon','fikir','fısıltı'],
    sentences: ['Fil fıstık yer.', 'Fırtına çok.', 'Fen fikir.'],
    discoveryWords: ['fil', 'fener', 'fırın', 'masa'],
    discoveryPrompt: '"F" sesi "v" nin nefesli hali! Nerede?',
    names: ['Ali', 'Ela', 'Deniz', 'Filiz'],
  },
  J: {
    letter: 'J', lower: 'j', sound: 'j', group: 5, order: 29,
    mouth: 'Dudaklarını öne it, dişleri yaklaştır, titreşimli: jjj.',
    syllables: ['aj','ja','ej','je'],
    words: ['jöle','jest','jüri','jilet','jeton','jandarma','jurnal'],
    sentences: ['Jöle çok güzel.', 'Jüri beş kişi.'],
    discoveryWords: ['jöle', 'jilet', 'jest', 'araba'],
    discoveryPrompt: '"J" sesi son harfimiz! Nerede?',
    names: ['Ali', 'Ela', 'Deniz', 'Jale'],
  },
};

// ═══════════════════════════════════════════════════════════════
// YARDIMCI FONKSİYONLAR
// ═══════════════════════════════════════════════════════════════

// O ana kadar öğrenilmiş harfleri döndürür
export function getLearnedLetters(currentLetter) {
  const idx = MEB_ORDER.indexOf(currentLetter);
  if (idx === -1) return [];
  return MEB_ORDER.slice(0, idx + 1);
}

// Bir kelimenin sadece öğrenilmiş harflerle yazılıp yazılamayacağını kontrol eder
export function isWordValid(word, learnedLetters) {
  const lowerLetters = learnedLetters.map(l => CURRICULUM[l]?.lower || l.toLowerCase());
  return [...word.toLowerCase()].every(char => lowerLetters.includes(char) || char === ' ');
}

// Harf verisi döndürür
export function getLetterData(letter) {
  return CURRICULUM[letter] || null;
}

// Grup bilgisi döndürür
export function getGroupForLetter(letter) {
  const data = CURRICULUM[letter];
  if (!data) return null;
  return GROUP_INFO[data.group - 1];
}

// Gruptaki harfleri döndürür
export function getLettersByGroup(groupId) {
  return GROUP_INFO[groupId - 1]?.letters.map(l => CURRICULUM[l]) || [];
}

// Sonraki harf
export function getNextLetter(currentLetter) {
  const idx = MEB_ORDER.indexOf(currentLetter);
  if (idx === -1 || idx >= MEB_ORDER.length - 1) return null;
  return MEB_ORDER[idx + 1];
}

// Sonraki harf aynı grupta mı
export function isNextLetterSameGroup(currentLetter) {
  const next = getNextLetter(currentLetter);
  if (!next) return false;
  return CURRICULUM[currentLetter]?.group === CURRICULUM[next]?.group;
}
