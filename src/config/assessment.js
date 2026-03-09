// ═══════════════════════════════════════════════════════════════
// MEB ÖLÇME-DEĞERLENDİRME SİSTEMİ
// Her faz için kazanımlar ve puanlama kriterleri
// ═══════════════════════════════════════════════════════════════

export const ASSESSMENT_CRITERIA = {
  discover: {
    code: 'T.O.1.1.1',
    label: 'Sesi fark etme',
    description: 'Tanıtılan sesi kelimeler içinde ayırt eder.',
    maxScore: 3,
    levels: {
      3: 'Sesi her seferinde doğru ayırt etti',
      2: 'Sesi çoğunlukla doğru ayırt etti',
      1: 'Sesi ayırt etmekte zorlandı',
      0: 'Sesi fark edemedi',
    },
  },
  produce: {
    code: 'T.O.1.1.2',
    label: 'Sesi üretme',
    description: 'Tanıtılan sesi doğru seslendirir.',
    maxScore: 3,
    levels: {
      3: 'Sesi net ve doğru üretti',
      2: 'Sesi yaklaşık doğru üretti',
      1: 'Sesi üretmekte zorlandı',
      0: 'Sesi üretemedi',
    },
  },
  write: {
    code: 'T.Y.1.1.1',
    label: 'Harfi yazma',
    description: 'Tanıtılan harfi doğru biçimde yazar.',
    maxScore: 3,
    levels: {
      3: 'Harfi doğru biçimde yazdı',
      2: 'Harfi yaklaşık doğru yazdı',
      1: 'Harfi yazmakta zorlandı',
      0: 'Harfi yazamadı',
    },
  },
  syllable: {
    code: 'T.O.1.2.1',
    label: 'Hece oluşturma',
    description: 'Tanıtılan ses ile anlamlı heceler oluşturur.',
    maxScore: 3,
    levels: {
      3: 'Heceleri doğru oluşturup okudu',
      2: 'Heceleri çoğunlukla doğru oluşturdu',
      1: 'Hece oluşturmakta zorlandı',
      0: 'Hece oluşturamadı',
    },
  },
  word: {
    code: 'T.O.1.3.1',
    label: 'Kelime okuma',
    description: 'Hecelerden anlamlı kelimeler oluşturarak okur.',
    maxScore: 3,
    levels: {
      3: 'Kelimeleri doğru okudu',
      2: 'Kelimeleri çoğunlukla doğru okudu',
      1: 'Kelime okumakta zorlandı',
      0: 'Kelime okuyamadı',
    },
  },
  sentence: {
    code: 'T.O.1.4.1',
    label: 'Cümle oluşturma',
    description: 'Kelimelerden cümle oluşturarak okur.',
    maxScore: 3,
    levels: {
      3: 'Cümleleri doğru okudu',
      2: 'Cümleleri çoğunlukla doğru okudu',
      1: 'Cümle okumakta zorlandı',
      0: 'Cümle okuyamadı',
    },
  },
};

// Genel başarı hesaplama
export function calculateLetterScore(phaseScores) {
  const total = Object.values(phaseScores).reduce((a, b) => a + b, 0);
  const max = Object.keys(phaseScores).length * 3;
  return {
    total,
    max,
    percent: Math.round((total / max) * 100),
    level: total >= max * 0.8 ? 'excellent' : total >= max * 0.5 ? 'good' : 'needsWork',
    label: total >= max * 0.8 ? 'Çok İyi' : total >= max * 0.5 ? 'İyi' : 'Geliştirilmeli',
    stars: total >= max * 0.8 ? 3 : total >= max * 0.5 ? 2 : 1,
  };
}
