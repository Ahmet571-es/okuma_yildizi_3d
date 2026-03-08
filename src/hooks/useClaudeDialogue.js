import { useState, useCallback } from 'react';
import { useGameStore } from './useGameStore';

const WORLD_MASCOT = { orman:'aslan', okyanus:'yunus', gokyuzu:'kartal', col:'tilki', buz:'penguen' };

export function useClaudeDialogue() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentWorldId, currentPhase, childName, conversationHistory, addMessage } = useGameStore();

  const mascotId = WORLD_MASCOT[currentWorldId] || 'aslan';

  const getGreeting = useCallback(async (letterData) => {
    setIsLoading(true);
    try {
      const r = await fetch('/api/claude/greeting', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mascotId, letterData, childName, phase: currentPhase }),
      });
      const d = await r.json();
      const reply = d.reply || `Merhaba! Bugün ${letterData.letter} sesini öğreneceğiz!`;
      addMessage('mascot', reply);
      return reply;
    } catch {
      const fb = `Merhaba${childName ? ' ' + childName : ''}! Bugün ${letterData.sound} sesini öğreneceğiz!`;
      addMessage('mascot', fb); return fb;
    } finally { setIsLoading(false); }
  }, [mascotId, childName, currentPhase, addMessage]);

  const getResponse = useCallback(async (childMessage, letterData, learnedLetters) => {
    if (!childMessage?.trim()) return null;
    setIsLoading(true);
    addMessage('child', childMessage);
    try {
      const r = await fetch('/api/claude/dialogue', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mascotId, childMessage, conversationHistory,
          letterData, childName, phase: currentPhase, learnedLetters,
        }),
      });
      const d = await r.json();
      const reply = d.reply;
      if (reply) { addMessage('mascot', reply); return reply; }
      throw new Error('Boş yanıt');
    } catch {
      const hints = letterData?.discoveryWords || [];
      const fb = hints.length > 0
        ? `Harika deneme! Haydi tekrar deneyelim: ${letterData.sound}!`
        : 'Süper gidiyorsun! Devam edelim mi?';
      addMessage('mascot', fb); return fb;
    } finally { setIsLoading(false); }
  }, [mascotId, childName, currentPhase, conversationHistory, addMessage]);

  return { getGreeting, getResponse, isLoading };
}
