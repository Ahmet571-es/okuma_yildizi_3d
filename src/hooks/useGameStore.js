import { create } from 'zustand';
import { MEB_ORDER, PHASES, getLearnedLetters } from '../config/curriculum.js';

const STORAGE_KEY = 'yildiz_ulkesi_v2';

function load() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; }
  catch { return null; }
}
function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      childName: state.childName,
      completedLetters: state.completedLetters,
      stars: state.stars,
      currentWorldId: state.currentWorldId,
      assessments: state.assessments,
      sessionCount: state.sessionCount,
    }));
  } catch {}
}

const saved = load();

export const useGameStore = create((set, get) => ({
  // ─── Ekran ───
  screen: 'role', // role | welcome | name | worldSelect | game | celebration | teacher
  setScreen: (s) => set({ screen: s }),

  // ─── Çocuk ───
  childName: saved?.childName || '',
  setChildName: (name) => { set({ childName: name }); save({ ...get(), childName: name }); },

  // ─── Dünya & Harf ───
  currentWorldId: saved?.currentWorldId || null,
  currentLetter: null,
  currentPhase: PHASES.DISCOVER,
  setCurrentWorld: (id) => { set({ currentWorldId: id }); save({ ...get(), currentWorldId: id }); },
  setCurrentLetter: (l) => set({ currentLetter: l, currentPhase: PHASES.DISCOVER }),
  setCurrentPhase: (p) => set({ currentPhase: p }),

  // ─── İlerleme ───
  completedLetters: saved?.completedLetters || [],
  stars: saved?.stars || 0,
  sessionCount: saved?.sessionCount || 0,

  completeLetter: (letter, phaseScores) => {
    const s = get();
    const updated = s.completedLetters.includes(letter) ? s.completedLetters : [...s.completedLetters, letter];
    const earnedStars = phaseScores
      ? Math.max(1, Math.round(Object.values(phaseScores).reduce((a,b)=>a+b,0) / 5))
      : 1;
    const newStars = s.stars + earnedStars;
    const assessments = { ...s.assessments, [letter]: { phaseScores, date: new Date().toISOString() } };
    set({ completedLetters: updated, stars: newStars, assessments });
    save({ ...get(), completedLetters: updated, stars: newStars, assessments });
    return earnedStars;
  },

  // ─── Değerlendirme (öğretmen paneli için) ───
  assessments: saved?.assessments || {},

  // ─── Diyalog Geçmişi ───
  conversationHistory: [],
  addMessage: (role, text) =>
    set(s => ({ conversationHistory: [...s.conversationHistory, { role, text, ts: Date.now() }] })),
  clearConversation: () => set({ conversationHistory: [] }),

  // ─── Konuşma Durumları ───
  isMascotSpeaking: false,
  isProcessing: false,
  setMascotSpeaking: (v) => set({ isMascotSpeaking: v }),
  setProcessing: (v) => set({ isProcessing: v }),

  // ─── Yardımcılar ───
  getLearnedLettersForCurrent: () => {
    const letter = get().currentLetter;
    return letter ? getLearnedLetters(letter) : [];
  },

  incrementSession: () => {
    const c = get().sessionCount + 1;
    set({ sessionCount: c });
    save({ ...get(), sessionCount: c });
  },

  resetProgress: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      childName: '', completedLetters: [], stars: 0, currentWorldId: null,
      currentLetter: null, currentPhase: PHASES.DISCOVER, conversationHistory: [],
      assessments: {}, sessionCount: 0, screen: 'role',
    });
  },
}));
