// ═══════════════════════════════════════════════════════════════
// 5 DÜNYA = 5 MEB SES GRUBU
// Her dünya ilgili ses grubundaki harfleri kapsar
// Kilit açma: Önceki grubun tüm harfleri tamamlanmalı
// ═══════════════════════════════════════════════════════════════

export const WORLDS = [
  {
    id: 'orman',
    groupId: 1,
    name: 'Orman Ülkesi',
    subtitle: '1. Ses Grubu',
    emoji: '🌲',
    weeks: 6,
    mascot: {
      id: 'aslan',
      name: 'Leo',
      emoji: '🦁',
      color: '#FF8C00',
      personality: 'cesaretli, teşvik edici, eğlenceli',
    },
    theme: {
      bg: 'from-green-950 via-green-800 to-emerald-700',
      accent: '#10B981',
      bgColor: '#14532d',
      particleColor: '#4ade80',
      cardBg: 'rgba(16, 185, 129, 0.15)',
    },
    letters: ['A', 'N', 'E', 'T', 'İ', 'L'],
    unlockRequirement: 0,
  },
  {
    id: 'okyanus',
    groupId: 2,
    name: 'Okyanus Ülkesi',
    subtitle: '2. Ses Grubu',
    emoji: '🌊',
    weeks: 4,
    mascot: {
      id: 'yunus',
      name: 'Yunus Yıldız',
      emoji: '🐬',
      color: '#3B82F6',
      personality: 'oyuncu, meraklı, şakacı',
    },
    theme: {
      bg: 'from-blue-950 via-blue-800 to-cyan-700',
      accent: '#3B82F6',
      bgColor: '#172554',
      particleColor: '#60a5fa',
      cardBg: 'rgba(59, 130, 246, 0.15)',
    },
    letters: ['O', 'K', 'U', 'R', 'I', 'M'],
    unlockRequirement: 6, // 1. grubun 6 harfi
  },
  {
    id: 'gokyuzu',
    groupId: 3,
    name: 'Gökyüzü Ülkesi',
    subtitle: '3. Ses Grubu',
    emoji: '☁️',
    weeks: 2,
    mascot: {
      id: 'kartal',
      name: 'Kartal Kaan',
      emoji: '🦅',
      color: '#8B5CF6',
      personality: 'bilge, sakin, güven verici',
    },
    theme: {
      bg: 'from-violet-950 via-purple-800 to-indigo-700',
      accent: '#8B5CF6',
      bgColor: '#2e1065',
      particleColor: '#a78bfa',
      cardBg: 'rgba(139, 92, 246, 0.15)',
    },
    letters: ['Ü', 'S', 'Ö', 'Y', 'D', 'Z'],
    unlockRequirement: 12, // 1+2. grubun 12 harfi
  },
  {
    id: 'col',
    groupId: 4,
    name: 'Çöl Ülkesi',
    subtitle: '4. Ses Grubu',
    emoji: '🏜️',
    weeks: 2,
    mascot: {
      id: 'tilki',
      name: 'Tilki Tina',
      emoji: '🦊',
      color: '#F59E0B',
      personality: 'zeki, şakacı, yaratıcı',
    },
    theme: {
      bg: 'from-amber-950 via-orange-800 to-yellow-700',
      accent: '#F59E0B',
      bgColor: '#451a03',
      particleColor: '#fbbf24',
      cardBg: 'rgba(245, 158, 11, 0.15)',
    },
    letters: ['Ç', 'B', 'G', 'C', 'Ş'],
    unlockRequirement: 18, // 1+2+3. grubun 18 harfi
  },
  {
    id: 'buz',
    groupId: 5,
    name: 'Buz Ülkesi',
    subtitle: '5. Ses Grubu',
    emoji: '❄️',
    weeks: 2,
    mascot: {
      id: 'penguen',
      name: 'Penguen Pelin',
      emoji: '🐧',
      color: '#06B6D4',
      personality: 'tatlı, yardımsever, sabırlı',
    },
    theme: {
      bg: 'from-cyan-950 via-sky-800 to-blue-600',
      accent: '#06B6D4',
      bgColor: '#083344',
      particleColor: '#67e8f9',
      cardBg: 'rgba(6, 182, 212, 0.15)',
    },
    letters: ['P', 'H', 'V', 'Ğ', 'F', 'J'],
    unlockRequirement: 23, // 1+2+3+4. grubun 23 harfi
  },
];

export const getWorldById = (id) => WORLDS.find((w) => w.id === id);
export const getWorldByGroupId = (gid) => WORLDS.find((w) => w.groupId === gid);
export const getMascotByWorldId = (id) => WORLDS.find((w) => w.id === id)?.mascot;
