import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../hooks/useGameStore';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useClaudeDialogue } from '../hooks/useClaudeDialogue';
import { getWorldById } from '../config/worlds';
import { getLetterData, getNextLetter, isNextLetterSameGroup, PHASES, PHASE_LABELS, getLearnedLetters } from '../config/curriculum';
import MicButton from '../components/MicButton';
import DialogueBubble from '../components/DialogueBubble';
import LetterDisplay from '../components/LetterDisplay';
import PhaseIndicator from '../components/PhaseIndicator';
import ParticleField from '../components/ParticleField';

export default function GameScreen() {
  const {
    currentWorldId, currentLetter, currentPhase, childName, completedLetters,
    conversationHistory, completeLetter, setCurrentLetter, setCurrentPhase,
    setScreen, clearConversation, getLearnedLettersForCurrent,
  } = useGameStore();

  const { isListening, transcript, finalTranscript, completedAt, startListening, stopListening } = useSpeechRecognition();
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  const { getGreeting, getResponse, isLoading } = useClaudeDialogue();

  const [mascotText, setMascotText] = useState('');
  const [childText, setChildText] = useState('');
  const [phaseProgress, setPhaseProgress] = useState(0); // 0-3 tries per phase
  const [phaseScores, setPhaseScores] = useState({});
  const [showStar, setShowStar] = useState(false);
  const initRef = useRef(false);
  const lastProcessedAt = useRef(0);

  const world = getWorldById(currentWorldId);
  const letterData = getLetterData(currentLetter);
  const mascot = world?.mascot;
  const learnedLetters = getLearnedLettersForCurrent();

  // ═══════════════════════════════════════
  // INIT: Karşılama + İlk faz başlatma
  // ═══════════════════════════════════════
  useEffect(() => {
    if (initRef.current || !letterData) return;
    initRef.current = true;
    clearConversation();
    setPhaseProgress(0);
    setPhaseScores({});

    (async () => {
      // Karşılama + ilk etkinlik tek mesajda (kopukluk olmasın)
      setCurrentPhase(PHASES.DISCOVER);
      const combinedPrompt = `Çocuğu karşıla ve HEMEN ilk etkinliğe geç. Tek bir konuşma olsun, iki ayrı giriş yapma. Karşılamadan sonra direkt "${letterData.discoveryWords[0]}" kelimesini söyle ve içinde "${letterData.sound}" sesi var mı sor. Toplam 3-4 cümle.`;
      const reply = await getResponse(combinedPrompt, letterData, learnedLetters);
      const text = reply || `Merhaba! Bugün ${letterData.sound} sesini öğreneceğiz. İlk kelimem: ${letterData.discoveryWords[0]}. Bu kelimede ${letterData.sound} sesi var mı?`;
      setMascotText(text);
      await speak(text);
    })();
  }, [letterData]);

  // ═══════════════════════════════════════
  // TRANSCRIPT İŞLEME — finalTranscript + completedAt
  // ═══════════════════════════════════════
  useEffect(() => {
    if (!finalTranscript || !completedAt) return;
    if (completedAt <= lastProcessedAt.current) return; // Zaten işlendi
    if (isSpeaking || isLoading) return; // Maskot konuşuyor veya düşünüyor

    lastProcessedAt.current = completedAt;
    console.log('[Game] Çocuk dedi:', finalTranscript);
    handleChildResponse(finalTranscript);
  }, [finalTranscript, completedAt, isSpeaking, isLoading]);

  // ═══════════════════════════════════════
  // FAZ-BAZLI ÇOCUK YANITI İŞLEME
  // ═══════════════════════════════════════
  const handleChildResponse = async (text) => {
    setChildText(text);
    const newProgress = phaseProgress + 1;
    setPhaseProgress(newProgress);

    // Claude'a faz-spesifik context ile gönder
    const phaseContext = buildPhaseContext(currentPhase, letterData, text, newProgress);
    const reply = await getResponse(phaseContext, letterData, learnedLetters);
    if (reply) { setMascotText(reply); await speak(reply); }

    // Faz tamamlama kontrolü
    if (newProgress >= 3) {
      // Bu fazı puanla (Claude'un değerlendirmesi yerine basit heuristic)
      const score = evaluatePhase(currentPhase, text, letterData);
      setPhaseScores(prev => ({ ...prev, [currentPhase]: score }));

      // Sonraki faza geç
      await advancePhase();
    }
  };

  // ═══════════════════════════════════════
  // FAZ İLERLEME
  // ═══════════════════════════════════════
  const advancePhase = async () => {
    const phaseOrder = [PHASES.DISCOVER, PHASES.PRODUCE, PHASES.SYLLABLE, PHASES.WORD, PHASES.SENTENCE];
    const currentIdx = phaseOrder.indexOf(currentPhase);

    // İlk harf (A) - kelime/cümle fazı atlansın
    if (letterData.order === 1 && currentIdx >= 1) {
      // A harfi: sadece discover + produce (kelime henüz yok)
      await handleLetterComplete();
      return;
    }

    // İlk 2 harf (A,N) - cümle yok
    if (letterData.order <= 2 && currentIdx >= 3) {
      await handleLetterComplete();
      return;
    }

    // İlk 3 harf - cümle kısıtlı
    if (letterData.sentences?.length === 0 && currentPhase === PHASES.WORD) {
      await handleLetterComplete();
      return;
    }

    if (currentIdx < phaseOrder.length - 1) {
      const nextPhase = phaseOrder[currentIdx + 1];
      setCurrentPhase(nextPhase);
      setPhaseProgress(0);

      // Yeni faz başlangıç prompt'u
      const prompt = buildPhasePrompt(nextPhase, letterData, 'transition');
      const reply = await getResponse(prompt, letterData, learnedLetters);
      if (reply) { setMascotText(reply); await speak(reply); }
    } else {
      await handleLetterComplete();
    }
  };

  // ═══════════════════════════════════════
  // HARF TAMAMLAMA
  // ═══════════════════════════════════════
  const handleLetterComplete = async () => {
    const finalScores = { ...phaseScores };
    const earned = completeLetter(currentLetter, finalScores);
    setShowStar(true);

    const completeMsg = `Harikasın${childName ? ' ' + childName : ''}! ${currentLetter} sesini öğrendin! ${earned} yıldız kazandın!`;
    const reply = await getResponse(
      `Çocuk ${currentLetter} sesini tamamladı! Coşkuyla tebrik et, ${earned} yıldız kazandığını söyle. 2 cümle, çok enerjik!`,
      letterData, learnedLetters
    );
    setMascotText(reply || completeMsg);
    await speak(reply || completeMsg);

    setTimeout(() => {
      const next = getNextLetter(currentLetter);
      if (next && isNextLetterSameGroup(currentLetter)) {
        setShowStar(false);
        initRef.current = false;
        lastProcessedAt.current = 0;
        setCurrentLetter(next);
      } else {
        setScreen('celebration');
      }
    }, 3000);
  };

  // ═══════════════════════════════════════
  // MİKROFON KONTROLÜ
  // ═══════════════════════════════════════
  const handleMic = useCallback(() => {
    if (isSpeaking || isLoading) return;
    if (isListening) stopListening();
    else { setChildText(''); startListening(); }
  }, [isListening, isSpeaking, isLoading, startListening, stopListening]);

  // Evet/Hayır butonları için manuel input
  const setFinalTranscriptManual = useCallback((text) => {
    setChildText(text);
    handleChildResponse(text);
  }, []);

  const handleBack = () => {
    stopSpeaking(); stopListening(); clearConversation(); setScreen('worldSelect');
  };

  if (!world || !letterData || !mascot) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white"><p>Yükleniyor...</p></div>;
  }

  const phaseOrder = [PHASES.DISCOVER, PHASES.PRODUCE, PHASES.SYLLABLE, PHASES.WORD, PHASES.SENTENCE];
  const activePhasesCount = letterData.order <= 1 ? 2 : letterData.order <= 2 ? 4 : letterData.sentences?.length > 0 ? 5 : 4;

  return (
    <div className={`relative h-full w-full bg-gradient-to-b ${world.theme.bg} flex flex-col overflow-hidden`}>
      <ParticleField color={world.theme.particleColor} count={15} />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-3 pb-1">
        <button onClick={handleBack} className="w-10 h-10 glass rounded-full flex items-center justify-center text-white/70 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="text-center">
          <p className="font-body text-xs text-white/50">{world.name} — {world.subtitle}</p>
          <p className="font-display text-lg text-white font-bold">{letterData.letter} Sesi</p>
        </div>
        <div className="flex items-center gap-1 glass rounded-full px-3 py-1">
          <span className="text-sm">⭐</span>
          <span className="font-display text-sm text-amber-300 font-bold">{useGameStore.getState().stars}</span>
        </div>
      </div>

      {/* Phase Indicator */}
      <PhaseIndicator
        phases={phaseOrder.slice(0, activePhasesCount)}
        currentPhase={currentPhase}
        phaseScores={phaseScores}
        accentColor={world.theme.accent}
      />

      {/* Letter Display */}
      <LetterDisplay letter={letterData.letter} sound={letterData.sound} mouth={letterData.mouth} accentColor={world.theme.accent} />

      {/* Dialogue */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {mascotText && (
          <DialogueBubble type="mascot" emoji={mascot.emoji} name={mascot.name}
            text={mascotText} isSpeaking={isSpeaking} color={mascot.color} />
        )}
        {childText && <DialogueBubble type="child" text={childText} />}
        {isListening && transcript && (
          <div className="flex items-start gap-3 justify-end animate-pop">
            <div className="max-w-[75%]">
              <div className="bg-amber-400/20 backdrop-blur-sm rounded-2xl rounded-tr-sm px-4 py-3 border border-amber-400/30">
                <p className="font-body text-base text-amber-200 leading-relaxed italic">{transcript}...</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-400/30 border-2 border-red-400 flex items-center justify-center shrink-0">
              <div className="sound-wave text-red-400"><span/><span/><span/></div>
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center gap-2 pl-16">
            <div className="glass rounded-2xl px-4 py-2 flex gap-1">
              {[0,150,300].map(d => <span key={d} className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay:`${d}ms`}} />)}
            </div>
          </div>
        )}
      </div>

      {/* Star Reward */}
      {showStar && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="text-center animate-pop">
            <div className="text-9xl star-spin mb-4">⭐</div>
            <p className="font-display text-3xl text-amber-300 font-bold">Yıldız Kazandın!</p>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="relative z-10 pb-5 pt-2 px-4">
        {/* Evet/Hayır butonları — Sesi Fark Etme fazında */}
        {currentPhase === PHASES.DISCOVER && !isSpeaking && !isLoading && !showStar && (
          <div className="flex justify-center gap-4 mb-3">
            <button
              onClick={() => setFinalTranscriptManual('Evet var')}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-full font-display text-lg text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Evet var!
            </button>
            <button
              onClick={() => setFinalTranscriptManual('Hayır yok')}
              className="px-8 py-3 bg-rose-500 hover:bg-rose-400 rounded-full font-display text-lg text-white shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Hayır yok
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <MicButton isListening={isListening} disabled={isSpeaking || isLoading || showStar}
            onPress={handleMic} size="large" color={world.theme.accent} />
        </div>
        <p className="text-center text-white/40 text-xs font-body mt-2">
          {isSpeaking ? `${mascot.name} konuşuyor...` :
           isListening ? 'Dinliyorum... Bitince mikrofona tekrar bas' :
           isLoading ? 'Düşünüyor...' :
           currentPhase === PHASES.DISCOVER ? 'Butonlara bas veya mikrofona konuş' :
           'Mikrofona basılı tut ve konuş'}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FAZ YARDIMCI FONKSİYONLARI
// ═══════════════════════════════════════════════════════════════

function buildPhasePrompt(phase, letterData, type) {
  const { letter, sound, syllables, words, sentences, discoveryWords } = letterData;

  if (type === 'start' || type === 'transition') {
    switch (phase) {
      case PHASES.DISCOVER:
        return `Çocuğu zaten karşıladın. TEKRAR merhaba deme. Direkt oyuna geç. Bir kelime söyle ve içinde "${sound}" sesi var mı sor. Kelimeler: ${discoveryWords.join(', ')}. İlk kelimeyle başla. Kısa ol, 1-2 cümle.`;
      case PHASES.PRODUCE:
        return `Harika! Şimdi yeni aşama. TEKRAR merhaba deme. "${sound}" sesini çıkarmayı öğret. Model ol: "${sound}!" de. Ağız pozisyonunu açıkla. 2 cümle yeter.`;
      case PHASES.SYLLABLE:
        return `Süper! Şimdi hece kurma zamanı. TEKRAR merhaba deme. İki sesi birleştir. İlk hece: "${syllables[0]}". Sesleri yavaşça birleştirmesini söyle. 2 cümle.`;
      case PHASES.WORD:
        return `Tebrikler! Kelime okuma zamanı. TEKRAR merhaba deme. İlk kelime: "${words[0]}". Heceleyerek söyle. 2 cümle.`;
      case PHASES.SENTENCE:
        return sentences?.length > 0
          ? `Harika! Son aşama: cümle okuma. TEKRAR merhaba deme. Cümle: "${sentences[0]}". Kelime kelime söylet. 2 cümle.`
          : `Son aşama! TEKRAR merhaba deme. Kelimeleri tekrar et ve tebrik et: ${words.slice(0, 3).join(', ')}. 2 cümle.`;
      default:
        return 'Devam et.';
    }
  }
  return '';
}

function buildPhaseContext(phase, letterData, childText, progress) {
  const { sound, discoveryWords, syllables, words, sentences } = letterData;
  switch (phase) {
    case PHASES.DISCOVER:
      return `Çocuk "${childText}" dedi. "${sound}" sesi var mı sorusuna cevap verdi. Doğru mu? ${progress < 3 ? 'Sonraki kelimeyi sor: ' + (discoveryWords[progress] || discoveryWords[0]) : 'Harika! Faz bitti, tebrik et.'}`;
    case PHASES.PRODUCE:
      return `Çocuk "${childText}" dedi. "${sound}" sesini söylemeye çalıştı. Teşvik et.${progress < 3 ? ' Tekrar söylemesini iste.' : ' Süper söyledi! Faz bitti.'}`;
    case PHASES.SYLLABLE:
      return `Çocuk "${childText}" dedi. Hece söylemeye çalıştı. Doğru mu? ${progress < 3 ? 'Sonraki hece: ' + (syllables[progress] || syllables[0]) : 'Harika! Faz bitti.'}`;
    case PHASES.WORD:
      return `Çocuk "${childText}" dedi. Kelime okumaya çalıştı. ${progress < 3 ? 'Sonraki kelime: ' + (words[Math.min(progress, words.length-1)]) : 'Tebrikler! Faz bitti.'}`;
    case PHASES.SENTENCE:
      return `Çocuk "${childText}" dedi. Cümle okumaya çalıştı. ${progress < 3 ? 'Tekrar söylet.' : 'Muhteşem! Tüm fazları tamamladı!'}`;
    default:
      return `Çocuk "${childText}" dedi. Devam et.`;
  }
}

function evaluatePhase(phase, childText, letterData) {
  // Basit heuristik puanlama (0-3)
  // Gerçek üründe Claude'un değerlendirmesi veya ses analizi kullanılabilir
  if (!childText || childText.trim().length === 0) return 1;
  const lower = childText.toLowerCase();
  const sound = letterData.sound.toLowerCase();

  // Ses içeriyor mu?
  if (lower.includes(sound)) return 3;
  // Harf adı içeriyor mu? (en azından çabalamış)
  if (lower.includes(letterData.letter.toLowerCase())) return 2;
  // Herhangi bir şey söylemiş
  return 2;
}
