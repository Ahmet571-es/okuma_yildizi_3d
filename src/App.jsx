import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// YILDIZ ÜLKESİ v3 — MEB Uyumlu İnteraktif Okuma Macerası
// Mini Oyunlar: Balon, Ses Ölçer, Harf Çizim, Hece Sürükle,
//               Resim-Kelime Eşleştir, Cümle Sıralama
// ═══════════════════════════════════════════════════════════════

// ─── CONFIG ─────────────────────────────────────────────────
const MEB_ORDER = ['A','N','E','T','İ','L','O','K','U','R','I','M','Ü','S','Ö','Y','D','Z','Ç','B','G','C','Ş','P','H','V','Ğ','F','J'];

const PHASES = [
  { id: 'discover', label: 'Sesi Fark Et', icon: '👂', game: 'balloon', color: '#FF6B6B' },
  { id: 'produce', label: 'Sesi Söyle', icon: '🗣️', game: 'soundmeter', color: '#4ECDC4' },
  { id: 'write', label: 'Harfi Yaz', icon: '✏️', game: 'tracing', color: '#FFE66D' },
  { id: 'syllable', label: 'Hece Kur', icon: '🧩', game: 'dragdrop', color: '#A78BFA' },
  { id: 'word', label: 'Kelime Oku', icon: '📖', game: 'picmatch', color: '#F97316' },
  { id: 'sentence', label: 'Cümle Kur', icon: '📝', game: 'wordorder', color: '#06B6D4' },
];

const WORLDS = [
  { id: 'orman', name: 'Orman Ülkesi', emoji: '🌲', mascot: '🦁', mascotName: 'Leo', bg: '#065f46', accent: '#10B981', letters: ['A','N','E','T','İ','L'], group: 1 },
  { id: 'okyanus', name: 'Okyanus Ülkesi', emoji: '🌊', mascot: '🐬', mascotName: 'Yunus Yıldız', bg: '#1e3a5f', accent: '#3B82F6', letters: ['O','K','U','R','I','M'], group: 2 },
  { id: 'gokyuzu', name: 'Gökyüzü Ülkesi', emoji: '☁️', mascot: '🦅', mascotName: 'Kartal Kaan', bg: '#312e81', accent: '#8B5CF6', letters: ['Ü','S','Ö','Y','D','Z'], group: 3 },
  { id: 'col', name: 'Çöl Ülkesi', emoji: '🏜️', mascot: '🦊', mascotName: 'Tilki Tina', bg: '#78350f', accent: '#F59E0B', letters: ['Ç','B','G','C','Ş'], group: 4 },
  { id: 'buz', name: 'Buz Ülkesi', emoji: '❄️', mascot: '🐧', mascotName: 'Penguen Pelin', bg: '#164e63', accent: '#06B6D4', letters: ['P','H','V','Ğ','F','J'], group: 5 },
];

const LETTER_DATA = {
  A: { sound:'a', mouth:'Ağzını büyükçe aç', syllables:['a'], words:[], sentences:[], discoveryWords:['araba','süt','anne','top'], pictureWords:[{word:'araba',img:'🚗'},{word:'anne',img:'👩'},{word:'ayı',img:'🐻'},{word:'top',img:'⚽'}] },
  N: { sound:'n', mouth:'Dilini damağa yapıştır', syllables:['an','na'], words:['an'], sentences:[], discoveryWords:['nine','top','anne','kuş'], pictureWords:[{word:'nine',img:'👵'},{word:'an',img:'⏱️'},{word:'kuş',img:'🐦'},{word:'nar',img:'🍎'}] },
  E: { sound:'e', mouth:'Dudaklarını yana çek', syllables:['an','na','en','ne'], words:['an','ne'], sentences:[], discoveryWords:['elma','ev','ekmek','top'], pictureWords:[{word:'elma',img:'🍎'},{word:'ev',img:'🏠'},{word:'ekmek',img:'🍞'},{word:'top',img:'⚽'}] },
  T: { sound:'t', mouth:'Dilini üst dişlere koy', syllables:['at','ta','et','te','an','na','en','ne'], words:['at','et','tat','tan','net','tane','nane'], sentences:['Tat ne?'], discoveryWords:['tavuk','top','tren','kalem'], pictureWords:[{word:'at',img:'🐴'},{word:'et',img:'🥩'},{word:'tavuk',img:'🐔'},{word:'tren',img:'🚂'}] },
  İ: { sound:'i', mouth:'Dudaklarını yana çek', syllables:['it','ti','in','ni','at','ta'], words:['it','in','tin','nine','inat'], sentences:['Nine, nane at.'], discoveryWords:['inek','ip','incir','ütü'], pictureWords:[{word:'inek',img:'🐄'},{word:'ip',img:'🧵'},{word:'incir',img:'🫐'},{word:'it',img:'🐕'}] },
  L: { sound:'l', mouth:'Dilini damağa yapıştır', syllables:['al','la','el','le','il','li'], words:['al','el','lale','alet','elli'], sentences:['Ali, lale al.','Ela, nane al.'], discoveryWords:['limon','lamba','lokum','araba'], pictureWords:[{word:'limon',img:'🍋'},{word:'lamba',img:'💡'},{word:'lale',img:'🌷'},{word:'lokum',img:'🍬'}] },
  O: { sound:'o', mouth:'Dudaklarını yuvarlak yap', syllables:['ol','lo','on','no','ot','to'], words:['ol','on','ot','not','otel'], sentences:['Ali, not al.'], discoveryWords:['okul','otobüs','orman','çanta'], pictureWords:[{word:'okul',img:'🏫'},{word:'otobüs',img:'🚌'},{word:'orman',img:'🌳'},{word:'on',img:'🔟'}] },
  K: { sound:'k', mouth:'Dilin arkasını damağa yapıştır', syllables:['ak','ka','ek','ke','ok','ko'], words:['kale','kol','kan','tek','kanat'], sentences:['Ali, kale al.'], discoveryWords:['kuş','kedi','kalem','ağaç'], pictureWords:[{word:'kuş',img:'🐦'},{word:'kedi',img:'🐱'},{word:'kale',img:'🏰'},{word:'kalem',img:'✏️'}] },
  U: { sound:'u', mouth:'Dudaklarını topla uzat', syllables:['ul','lu','un','nu','ut','tu','uk','ku'], words:['un','kutu','kulak','kukla'], sentences:['Kutu al, Ali.'], discoveryWords:['uçak','uzay','uyku','masa'], pictureWords:[{word:'uçak',img:'✈️'},{word:'uzay',img:'🚀'},{word:'un',img:'🌾'},{word:'kutu',img:'📦'}] },
  R: { sound:'r', mouth:'Dilini titret', syllables:['ar','ra','er','re','or','ro','ur','ru'], words:['renk','tur','kar','rulo','kurt'], sentences:['Kartal uçar.'], discoveryWords:['robot','resim','radyo','top'], pictureWords:[{word:'robot',img:'🤖'},{word:'resim',img:'🖼️'},{word:'kar',img:'❄️'},{word:'kurt',img:'🐺'}] },
  I: { sound:'ı', mouth:'Dudaklarını geriye çek', syllables:['ıl','lı','ır','rı','ın','nı','ık','kı'], words:['ılık','altın','kırık','artık'], sentences:['Altın ılık.'], discoveryWords:['ırmak','ılık','ıslık','elma'], pictureWords:[{word:'ırmak',img:'🏞️'},{word:'altın',img:'🥇'},{word:'ılık',img:'🌡️'},{word:'arı',img:'🐝'}] },
  M: { sound:'m', mouth:'Dudaklarını kapat', syllables:['am','ma','em','me','im','mi','om','mo','um','mu'], words:['mum','mal','mola','marul','motor'], sentences:['Metin, mum al.'], discoveryWords:['masa','muz','mantar','top'], pictureWords:[{word:'masa',img:'🪑'},{word:'muz',img:'🍌'},{word:'mum',img:'🕯️'},{word:'motor',img:'🏍️'}] },
  Ü: { sound:'ü', mouth:'Dudaklarını topla ince söyle', syllables:['ül','lü','ün','nü','üt','tü','ük','kü'], words:['üç','ütü','üst','tür','kürk','türkü'], sentences:['Ütü üç tane.'], discoveryWords:['üzüm','ütü','ülke','araba'], pictureWords:[{word:'üzüm',img:'🍇'},{word:'ütü',img:'👔'},{word:'üç',img:'3️⃣'},{word:'ülke',img:'🗺️'}] },
  S: { sound:'s', mouth:'Dişlerini birbirine yaklaştır', syllables:['as','sa','es','se','us','su','üs','sü'], words:['su','sol','süt','son','simit'], sentences:['Sultan su al.'], discoveryWords:['su','saat','sincap','top'], pictureWords:[{word:'su',img:'💧'},{word:'saat',img:'⏰'},{word:'sincap',img:'🐿️'},{word:'süt',img:'🥛'}] },
  Ö: { sound:'ö', mouth:'Dudaklarını topla ince söyle', syllables:['öl','lö','ön','nö','ör','rö'], words:['ön','örs','köle','ölçü','ömür'], sentences:['Ön sıra, Sultan.'], discoveryWords:['ördek','ödev','öğretmen','araba'], pictureWords:[{word:'ördek',img:'🦆'},{word:'ön',img:'⬆️'},{word:'öğretmen',img:'👨‍🏫'},{word:'ölçü',img:'📏'}] },
  Y: { sound:'y', mouth:'Dilini damağa yaklaştır', syllables:['ay','ya','ey','ye','oy','yo','uy','yu'], words:['yol','yan','yıl','yurt','yün'], sentences:['Yol yan.'], discoveryWords:['yıldız','yaprak','yumurta','masa'], pictureWords:[{word:'yıldız',img:'⭐'},{word:'yaprak',img:'🍃'},{word:'yumurta',img:'🥚'},{word:'yol',img:'🛤️'}] },
  D: { sound:'d', mouth:'Dilini üst dişlere koy', syllables:['ad','da','ed','de','ud','du'], words:['dil','dal','dur','dolu','dost'], sentences:['Dost yol yürür.'], discoveryWords:['deniz','dağ','deve','top'], pictureWords:[{word:'deniz',img:'🌊'},{word:'dağ',img:'⛰️'},{word:'deve',img:'🐫'},{word:'dal',img:'🌿'}] },
  Z: { sound:'z', mouth:'Dişlerini yaklaştır titreşimli', syllables:['az','za','ez','ze','uz','zu','üz','zü'], words:['yüz','söz','zil','uzun','deniz'], sentences:['Deniz düz.'], discoveryWords:['zürafa','zil','zeytin','araba'], pictureWords:[{word:'zürafa',img:'🦒'},{word:'zil',img:'🔔'},{word:'zeytin',img:'🫒'},{word:'deniz',img:'🌊'}] },
  Ç: { sound:'ç', mouth:'Dilini damağa yapıştır sert', syllables:['aç','ça','eç','çe','iç','çi','uç','çu'], words:['çok','üç','iç','aç','çöl','çiçek'], sentences:['Çöl çok sıcak.'], discoveryWords:['çiçek','çanta','çorap','top'], pictureWords:[{word:'çiçek',img:'🌸'},{word:'çanta',img:'👜'},{word:'çorap',img:'🧦'},{word:'çöl',img:'🏜️'}] },
  B: { sound:'b', mouth:'Dudaklarını kapat birden aç', syllables:['ab','ba','eb','be','ub','bu'], words:['bir','ben','bol','buz','bulut'], sentences:['Buz bol.'], discoveryWords:['balon','böcek','balık','masa'], pictureWords:[{word:'balon',img:'🎈'},{word:'böcek',img:'🐛'},{word:'balık',img:'🐟'},{word:'buz',img:'🧊'}] },
  G: { sound:'g', mouth:'Dilin arkasını damağa koy', syllables:['ag','ga','eg','ge','ug','gu','üg','gü'], words:['göl','gel','gül','gün','güzel'], sentences:['Göl güzel.'], discoveryWords:['gemi','güneş','gökkuşağı','araba'], pictureWords:[{word:'gemi',img:'🚢'},{word:'güneş',img:'☀️'},{word:'gül',img:'🌹'},{word:'göl',img:'🏞️'}] },
  C: { sound:'c', mouth:'Dilini damağa koy yumuşak', syllables:['ac','ca','ec','ce','uc','cu'], words:['can','cilt','ceket','ceylan'], sentences:['Can cömert.'], discoveryWords:['cam','ceylan','ceviz','top'], pictureWords:[{word:'cam',img:'🪟'},{word:'ceviz',img:'🥜'},{word:'ceket',img:'🧥'},{word:'can',img:'❤️'}] },
  Ş: { sound:'ş', mouth:'Dudaklarını öne uzat', syllables:['aş','şa','eş','şe','uş','şu'], words:['şu','beş','iş','kuş','güneş'], sentences:['Beş kuş uçtu.'], discoveryWords:['şeker','şemsiye','şapka','masa'], pictureWords:[{word:'şeker',img:'🍭'},{word:'şemsiye',img:'☂️'},{word:'şapka',img:'🎩'},{word:'kuş',img:'🐦'}] },
  P: { sound:'p', mouth:'Dudaklarını kapat sert aç', syllables:['ap','pa','ep','pe','up','pu'], words:['pul','pas','pilot','portakal'], sentences:['Portakal parlak.'], discoveryWords:['patates','panda','portakal','top'], pictureWords:[{word:'panda',img:'🐼'},{word:'portakal',img:'🍊'},{word:'pul',img:'📮'},{word:'patates',img:'🥔'}] },
  H: { sound:'h', mouth:'Nefesini ver hafif ses', syllables:['ah','ha','eh','he','uh','hu'], words:['her','hız','hoş','horoz','hesap'], sentences:['Huzur her şey.'], discoveryWords:['havuç','halı','hediye','araba'], pictureWords:[{word:'havuç',img:'🥕'},{word:'hediye',img:'🎁'},{word:'horoz',img:'🐓'},{word:'halı',img:'🟤'}] },
  V: { sound:'v', mouth:'Üst dişlerini alt dudağa koy', syllables:['av','va','ev','ve'], words:['ve','var','ver','vişne','volkan'], sentences:['Vişne var.'], discoveryWords:['vapur','vazo','vişne','top'], pictureWords:[{word:'vapur',img:'🚢'},{word:'vazo',img:'🏺'},{word:'vişne',img:'🍒'},{word:'volkan',img:'🌋'}] },
  Ğ: { sound:'ğ', mouth:'Tek başına söylenmez', syllables:['ağ','eğ','oğ','uğ'], words:['dağ','bağ','soğuk','yağmur','doğru'], sentences:['Dağ soğuk.'], discoveryWords:['dağ','bağ','yağmur','araba'], pictureWords:[{word:'dağ',img:'🏔️'},{word:'yağmur',img:'🌧️'},{word:'bağ',img:'🍇'},{word:'soğuk',img:'🥶'}] },
  F: { sound:'f', mouth:'Üst dişlerini alt dudağa koy', syllables:['af','fa','ef','fe','uf','fu'], words:['fil','fen','füze','fırın','fıstık'], sentences:['Fil fıstık yer.'], discoveryWords:['fil','fener','fırın','masa'], pictureWords:[{word:'fil',img:'🐘'},{word:'fener',img:'🏮'},{word:'fıstık',img:'🥜'},{word:'füze',img:'🚀'}] },
  J: { sound:'j', mouth:'Dudaklarını öne it titreşimli', syllables:['aj','ja'], words:['jöle','jest','jüri','jeton'], sentences:['Jöle çok güzel.'], discoveryWords:['jöle','jilet','jest','araba'], pictureWords:[{word:'jöle',img:'🍮'},{word:'jeton',img:'🪙'},{word:'jest',img:'🤝'},{word:'jüri',img:'👨‍⚖️'}] },
};

const BADGES = [
  { id:'first_sound', name:'İlk Ses!', icon:'🎵', desc:'İlk sesini keşfettin', req: c => c >= 1 },
  { id:'group1', name:'Orman Kâşifi', icon:'🌲', desc:'1. Grubu bitirdin', req: c => c >= 6 },
  { id:'group2', name:'Okyanus Dalgıcı', icon:'🌊', desc:'2. Grubu bitirdin', req: c => c >= 12 },
  { id:'group3', name:'Gökyüzü Pilotu', icon:'✈️', desc:'3. Grubu bitirdin', req: c => c >= 18 },
  { id:'group4', name:'Çöl Gezgini', icon:'🏜️', desc:'4. Grubu bitirdin', req: c => c >= 23 },
  { id:'group5', name:'Buz Kahramanı', icon:'❄️', desc:'5. Grubu bitirdin', req: c => c >= 29 },
  { id:'star10', name:'10 Yıldız', icon:'⭐', desc:'10 yıldız topladın', req: (_c,s) => s >= 10 },
  { id:'star50', name:'50 Yıldız', icon:'🌟', desc:'50 yıldız topladın', req: (_c,s) => s >= 50 },
];

// ─── STYLE KEYFRAMES ────────────────────────────────────────
const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&display=swap');
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes pop { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.15)} 100%{transform:scale(1);opacity:1} }
@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
@keyframes slideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
@keyframes mascotBounce { 0%,100%{transform:translateY(0) rotate(0deg)} 25%{transform:translateY(-8px) rotate(-3deg)} 75%{transform:translateY(-4px) rotate(3deg)} }
@keyframes balloonFloat { 0%{transform:translateY(100vh) scale(0.7)} 100%{transform:translateY(-20vh) scale(1)} }
@keyframes starBurst { 0%{transform:scale(0) rotate(0deg);opacity:1} 100%{transform:scale(2) rotate(180deg);opacity:0} }
@keyframes ripple { 0%{box-shadow:0 0 0 0 rgba(255,255,255,0.4)} 100%{box-shadow:0 0 0 20px rgba(255,255,255,0)} }
@keyframes traceDash { to{stroke-dashoffset:0} }
@keyframes confetti { 0%{transform:translateY(0) rotate(0);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
@keyframes glow { 0%,100%{filter:drop-shadow(0 0 8px rgba(255,215,0,0.6))} 50%{filter:drop-shadow(0 0 20px rgba(255,215,0,0.9))} }
`;

// ─── HELPERS ────────────────────────────────────────────────
const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const delay = ms => new Promise(r => setTimeout(r, ms));

// ─── MASCOT COMPONENT ───────────────────────────────────────
function Mascot({ emoji, name, message, speaking, size = 80, onClick }) {
  return (
    <div onClick={onClick} style={{ display:'flex', flexDirection:'column', alignItems:'center', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{
        fontSize: size, lineHeight: 1, animation: speaking ? 'mascotBounce 0.6s ease infinite' : 'float 3s ease-in-out infinite',
        filter: speaking ? 'drop-shadow(0 0 20px rgba(255,215,0,0.6))' : 'none', transition: 'filter 0.3s'
      }}>{emoji}</div>
      {message && (
        <div style={{
          background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '10px 18px', marginTop: 8,
          maxWidth: 280, fontSize: 15, fontWeight: 600, color: '#1e293b', textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', animation: 'pop 0.4s ease',
          fontFamily: "'Nunito', sans-serif", position: 'relative',
        }}>
          <div style={{ position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)', width:0, height:0,
            borderLeft:'8px solid transparent', borderRight:'8px solid transparent', borderBottom:'8px solid rgba(255,255,255,0.95)' }}/>
          {message}
        </div>
      )}
      {name && <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontFamily: "'Fredoka', sans-serif" }}>{name}</div>}
    </div>
  );
}

// ─── STAR BURST EFFECT ──────────────────────────────────────
function StarBurst({ count = 12 }) {
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:999 }}>
      {Array.from({length: count}).map((_,i) => (
        <div key={i} style={{
          position:'absolute', left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          fontSize: 20+Math.random()*30, animation: `starBurst ${1+Math.random()}s ease-out forwards`,
          animationDelay: `${Math.random()*0.5}s`
        }}>⭐</div>
      ))}
    </div>
  );
}

// ─── CONFETTI ───────────────────────────────────────────────
function Confetti() {
  const colors = ['#FF6B6B','#4ECDC4','#FFE66D','#A78BFA','#F97316','#06B6D4','#10B981','#F43F5E'];
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:998 }}>
      {Array.from({length:40}).map((_,i) => (
        <div key={i} style={{
          position:'absolute', left:`${Math.random()*100}%`, top: -20,
          width: 8+Math.random()*8, height: 8+Math.random()*12, borderRadius: Math.random()>0.5 ? '50%' : 2,
          background: colors[Math.floor(Math.random()*colors.length)],
          animation: `confetti ${2+Math.random()*3}s linear forwards`, animationDelay:`${Math.random()*2}s`,
        }} />
      ))}
    </div>
  );
}

// ─── PROGRESS BAR ───────────────────────────────────────────
function ProgressBar({ value, max, color, label }) {
  const pct = Math.min(100, (value/max)*100);
  return (
    <div style={{ width:'100%' }}>
      {label && <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.8)', marginBottom:4, fontFamily:"'Nunito'" }}>{label}</div>}
      <div style={{ height:12, background:'rgba(255,255,255,0.15)', borderRadius:6, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg, ${color}, ${color}dd)`, borderRadius:6, transition:'width 0.6s ease' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINI GAME 1: BALON PATLATMA (Sesi Fark Et)
// ═══════════════════════════════════════════════════════════════
function BalloonGame({ letter, letterData, onComplete, accent }) {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [popped, setPopped] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [round, setRound] = useState(0);

  useEffect(() => {
    const words = letterData.discoveryWords || ['araba','top','anne','kuş'];
    const newBalloons = shuffle(words).map((w,i) => ({
      id: i, word: w,
      hasSound: w.toLowerCase().includes(letterData.sound.toLowerCase()),
      color: ['#FF6B6B','#4ECDC4','#FFE66D','#A78BFA','#F97316','#06B6D4'][i%6],
      x: 15 + (i%3)*30 + Math.random()*10,
      delay: i * 0.4,
    }));
    setBalloons(newBalloons);
    setPopped(new Set());
    setFeedback(null);
  }, [round]);

  const popBalloon = (b) => {
    if (popped.has(b.id)) return;
    setPopped(p => new Set([...p, b.id]));
    setTotal(t => t + 1);
    if (b.hasSound) {
      setScore(s => s + 1);
      setFeedback({ type:'success', text:`Harika! "${b.word}" kelimesinde "${letterData.sound}" sesi var!` });
    } else {
      setFeedback({ type:'error', text:`"${b.word}" kelimesinde "${letterData.sound}" sesi yok. Tekrar dene!` });
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const allDone = popped.size === balloons.length;

  useEffect(() => {
    if (allDone && balloons.length > 0) {
      setTimeout(() => {
        if (round < 1) { setRound(r => r+1); }
        else { onComplete(Math.min(3, score)); }
      }, 2000);
    }
  }, [allDone]);

  return (
    <div style={{ position:'relative', minHeight:400, display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div style={{ fontSize:18, fontWeight:700, color:'#fff', marginBottom:8, fontFamily:"'Fredoka'" }}>
        "{letterData.sound}" sesini içeren balonları patlat! 🎈
      </div>
      <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', marginBottom:16 }}>Puan: {score} / {total}</div>

      <div style={{ position:'relative', width:'100%', height:350, overflow:'hidden', borderRadius:20, background:'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)' }}>
        {balloons.map(b => (
          <div key={b.id} onClick={() => popBalloon(b)} style={{
            position:'absolute', left:`${b.x}%`, bottom: popped.has(b.id) ? '-100px' : '10%',
            width:90, height:110, cursor:'pointer', transition: popped.has(b.id) ? 'all 0.5s ease' : 'none',
            opacity: popped.has(b.id) ? 0 : 1, transform: popped.has(b.id) ? 'scale(1.5)' : 'scale(1)',
            animation: popped.has(b.id) ? 'none' : `float 2s ease-in-out infinite ${b.delay}s`,
          }}>
            <div style={{
              width:80, height:95, borderRadius:'50%', background:`radial-gradient(circle at 30% 30%, ${b.color}ee, ${b.color}88)`,
              display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
              boxShadow:`0 4px 15px ${b.color}44, inset 0 -5px 10px rgba(0,0,0,0.1)`,
              border:'2px solid rgba(255,255,255,0.3)',
            }}>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,0.3)', fontFamily:"'Fredoka'" }}>{b.word}</div>
            </div>
            <div style={{ width:2, height:15, background:'rgba(255,255,255,0.3)', margin:'0 auto' }} />
          </div>
        ))}
      </div>

      {feedback && (
        <div style={{
          position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)',
          background: feedback.type === 'success' ? '#10B981' : '#EF4444', color:'#fff',
          padding:'12px 24px', borderRadius:12, fontWeight:700, fontSize:15,
          animation:'pop 0.3s ease', boxShadow:'0 4px 20px rgba(0,0,0,0.3)', fontFamily:"'Nunito'",
          zIndex:10, whiteSpace:'nowrap', maxWidth:'90%', textAlign:'center'
        }}>{feedback.text}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINI GAME 2: SES ÖLÇER (Sesi Üretme)
// ═══════════════════════════════════════════════════════════════
function SoundMeterGame({ letter, letterData, onComplete, accent }) {
  const [level, setLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [listening, setListening] = useState(false);
  const [success, setSuccess] = useState(false);
  const [msg, setMsg] = useState(`"${letterData.sound}" sesini söyle!`);
  const analyserRef = useRef(null);
  const animRef = useRef(null);
  const streamRef = useRef(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;
      setListening(true);
      setMsg(`Dinliyorum... "${letterData.sound}" de!`);

      const data = new Uint8Array(analyser.frequencyBinCount);
      let maxLevel = 0;
      let frames = 0;

      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a,b) => a+b, 0) / data.length;
        const normalized = Math.min(100, (avg / 128) * 100);
        setLevel(normalized);
        if (normalized > maxLevel) maxLevel = normalized;
        frames++;

        if (frames > 120) { // ~2 seconds
          stopListening();
          setAttempts(a => a + 1);
          if (maxLevel > 30) {
            setSuccess(true);
            setMsg('Harika! Çok güzel söyledin! 🎉');
          } else {
            setMsg('Biraz daha yüksek sesle söyle!');
          }
          return;
        }
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    } catch {
      setMsg('Mikrofon izni gerekli! Tarayıcıda izin ver.');
    }
  };

  const stopListening = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setListening(false);
  };

  useEffect(() => { return () => stopListening(); }, []);

  useEffect(() => {
    if (success && attempts > 0) {
      setTimeout(() => onComplete(attempts <= 1 ? 3 : attempts <= 2 ? 2 : 1), 2000);
    }
  }, [success]);

  const bars = 20;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
      <div style={{ fontSize:18, fontWeight:700, color:'#fff', fontFamily:"'Fredoka'", textAlign:'center' }}>{msg}</div>

      <div style={{
        fontSize:100, lineHeight:1, animation: listening ? 'pulse 0.5s ease infinite' : 'float 3s ease infinite',
        filter: listening ? `drop-shadow(0 0 30px ${accent})` : 'none',
      }}>{letter}</div>

      <div style={{ display:'flex', gap:4, alignItems:'flex-end', height:120, padding:'0 20px' }}>
        {Array.from({length:bars}).map((_,i) => {
          const h = Math.max(8, (level/100) * (40 + Math.sin(i*0.5 + Date.now()*0.01)*20));
          return <div key={i} style={{
            width:10, height:h, borderRadius:5, transition:'height 0.1s',
            background: h > 40 ? '#10B981' : h > 20 ? '#FFE66D' : '#FF6B6B',
          }} />;
        })}
      </div>

      <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', fontFamily:"'Nunito'" }}>
        Ağız pozisyonu: {letterData.mouth}
      </div>

      {!success && (
        <button onClick={listening ? stopListening : startListening} style={{
          padding:'14px 36px', borderRadius:50, border:'none', fontSize:18, fontWeight:800,
          background: listening ? '#EF4444' : accent, color:'#fff', cursor:'pointer',
          fontFamily:"'Fredoka'", boxShadow:`0 4px 20px ${listening ? '#EF444466' : accent+'66'}`,
          animation: listening ? 'ripple 1.5s ease infinite' : 'none',
        }}>
          {listening ? '🎤 Dinleniyor...' : '🎤 Başla'}
        </button>
      )}

      {success && <div style={{ fontSize:48, animation:'pop 0.5s ease' }}>🌟</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINI GAME 3: HARF ÇİZİM (Harfi Yaz - Tracing)
// ═══════════════════════════════════════════════════════════════
function TracingGame({ letter, onComplete, accent }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  const startDraw = (e) => { e.preventDefault(); setDrawing(true); setCurrentPath([getPos(e)]); };
  const moveDraw = (e) => { e.preventDefault(); if (!drawing) return; setCurrentPath(p => [...p, getPos(e)]); };
  const endDraw = () => { if (currentPath.length > 3) setPaths(p => [...p, currentPath]); setCurrentPath([]); setDrawing(false); };

  const clearCanvas = () => { setPaths([]); setCurrentPath([]); };

  const checkDrawing = () => {
    setAttempts(a => a+1);
    if (paths.length > 0 && paths.reduce((s,p) => s+p.length, 0) > 15) {
      setDone(true);
      setTimeout(() => onComplete(attempts < 1 ? 3 : attempts < 3 ? 2 : 1), 1500);
    }
  };

  const allPoints = [...paths.flat(), ...currentPath];

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ fontSize:18, fontWeight:700, color:'#fff', fontFamily:"'Fredoka'" }}>
        "{letter}" harfini parmağınla çiz! ✏️
      </div>

      <div style={{ position:'relative', width:300, height:300, borderRadius:20, overflow:'hidden', background:'rgba(255,255,255,0.95)', boxShadow:'0 8px 30px rgba(0,0,0,0.3)' }}>
        {/* Guide letter */}
        <div style={{
          position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:200, fontWeight:900, color:'rgba(0,0,0,0.06)', fontFamily:"'Fredoka'", userSelect:'none', pointerEvents:'none'
        }}>{letter}</div>

        {/* Drawing surface */}
        <svg ref={canvasRef} width={300} height={300} style={{ position:'absolute', inset:0, touchAction:'none', cursor:'crosshair' }}
          onMouseDown={startDraw} onMouseMove={moveDraw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={moveDraw} onTouchEnd={endDraw}>
          {paths.map((path, pi) => (
            <polyline key={pi} points={path.map(p=>`${p.x},${p.y}`).join(' ')}
              fill="none" stroke={accent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {currentPath.length > 0 && (
            <polyline points={currentPath.map(p=>`${p.x},${p.y}`).join(' ')}
              fill="none" stroke={accent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>

        {done && (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(16,185,129,0.3)' }}>
            <div style={{ fontSize:80, animation:'pop 0.5s ease' }}>✅</div>
          </div>
        )}
      </div>

      {!done && (
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={clearCanvas} style={{
            padding:'10px 24px', borderRadius:12, border:'2px solid rgba(255,255,255,0.3)',
            background:'transparent', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'"
          }}>🗑️ Temizle</button>
          <button onClick={checkDrawing} style={{
            padding:'10px 24px', borderRadius:12, border:'none',
            background:accent, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'",
            boxShadow:`0 4px 15px ${accent}66`
          }}>✅ Kontrol Et</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINI GAME 4: SÜRÜKLE-BIRAK HECE (Hece Oluşturma)
// ═══════════════════════════════════════════════════════════════
function DragDropSyllableGame({ letter, letterData, onComplete, accent }) {
  const targetSyllables = useMemo(() => (letterData.syllables || []).slice(0, 4), [letter]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [slots, setSlots] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentIdx >= targetSyllables.length) { setDone(true); return; }
    const target = targetSyllables[currentIdx];
    const chars = [...target.toUpperCase()];
    const extras = shuffle(MEB_ORDER.filter(l => !chars.includes(l))).slice(0, 2);
    setAvailableLetters(shuffle([...chars, ...extras]).map((c,i) => ({ id:i, char:c, used:false })));
    setSlots(chars.map((_,i) => ({ id:i, char:null })));
    setFeedback(null);
  }, [currentIdx]);

  useEffect(() => {
    if (done) setTimeout(() => onComplete(score >= 3 ? 3 : score >= 2 ? 2 : 1), 1500);
  }, [done]);

  const placeInSlot = (letterObj) => {
    const emptySlot = slots.findIndex(s => s.char === null);
    if (emptySlot === -1) return;
    setSlots(s => s.map((sl,i) => i === emptySlot ? {...sl, char: letterObj.char} : sl));
    setAvailableLetters(a => a.map(l => l.id === letterObj.id ? {...l, used:true} : l));

    const newSlots = [...slots]; newSlots[emptySlot] = {...newSlots[emptySlot], char: letterObj.char};
    if (newSlots.every(s => s.char !== null)) {
      const formed = newSlots.map(s => s.char).join('').toLowerCase();
      if (formed === targetSyllables[currentIdx]) {
        setScore(s => s + 1);
        setFeedback({ type:'success', text:`Harika! "${targetSyllables[currentIdx]}" hecesini kurdun!` });
        setTimeout(() => setCurrentIdx(i => i + 1), 1500);
      } else {
        setFeedback({ type:'error', text:'Bu doğru değil, tekrar dene!' });
        setTimeout(() => {
          setSlots(s => s.map(sl => ({...sl, char:null})));
          setAvailableLetters(a => a.map(l => ({...l, used:false})));
          setFeedback(null);
        }, 1200);
      }
    }
  };

  const resetSlots = () => {
    setSlots(s => s.map(sl => ({...sl, char:null})));
    setAvailableLetters(a => a.map(l => ({...l, used:false})));
  };

  if (done) return (
    <div style={{ textAlign:'center', padding:40 }}>
      <div style={{ fontSize:60, animation:'pop 0.5s ease' }}>🎉</div>
      <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Fredoka'", marginTop:12 }}>
        {score}/{targetSyllables.length} hece doğru!
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
      <div style={{ fontSize:18, fontWeight:700, color:'#fff', fontFamily:"'Fredoka'" }}>
        "{targetSyllables[currentIdx]}" hecesini kur! 🧩
      </div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>Hece {currentIdx+1} / {targetSyllables.length}</div>

      {/* Drop Slots */}
      <div style={{ display:'flex', gap:12, marginBottom:12 }}>
        {slots.map((s,i) => (
          <div key={i} style={{
            width:70, height:80, borderRadius:16, border:`3px dashed ${s.char ? accent : 'rgba(255,255,255,0.4)'}`,
            background: s.char ? `${accent}33` : 'rgba(255,255,255,0.05)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:36, fontWeight:900, color:'#fff', fontFamily:"'Fredoka'",
            transition:'all 0.3s ease',
          }}>{s.char || ''}</div>
        ))}
      </div>

      {/* Available Letters */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
        {availableLetters.filter(l => !l.used).map(l => (
          <button key={l.id} onClick={() => placeInSlot(l)} style={{
            width:60, height:60, borderRadius:14, border:'none',
            background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)',
            fontSize:28, fontWeight:800, color:'#fff', cursor:'pointer',
            fontFamily:"'Fredoka'", transition:'all 0.2s',
            boxShadow:'0 2px 10px rgba(0,0,0,0.2)',
          }}
          onMouseOver={e => { e.target.style.transform='scale(1.1)'; e.target.style.background=`${accent}44`; }}
          onMouseOut={e => { e.target.style.transform='scale(1)'; e.target.style.background='rgba(255,255,255,0.15)'; }}
          >{l.char}</button>
        ))}
      </div>

      <button onClick={resetSlots} style={{
        padding:'8px 20px', borderRadius:10, border:'2px solid rgba(255,255,255,0.2)',
        background:'transparent', color:'rgba(255,255,255,0.7)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'Nunito'"
      }}>🔄 Sıfırla</button>

      {feedback && (
        <div style={{
          padding:'10px 24px', borderRadius:12, fontWeight:700, fontSize:15, fontFamily:"'Nunito'",
          background: feedback.type === 'success' ? '#10B981' : '#EF4444', color:'#fff',
          animation:'pop 0.3s ease', boxShadow:'0 4px 15px rgba(0,0,0,0.3)'
        }}>{feedback.text}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINI GAME 5: RESİM-KELİME EŞLEŞTİRME (Kelime Okuma)
// ═══════════════════════════════════════════════════════════════
function PicMatchGame({ letter, letterData, onComplete, accent }) {
  const items = useMemo(() => shuffle(letterData.pictureWords || []).slice(0, 4), [letter]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [matches, setMatches] = useState({});
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setShuffledWords(shuffle(items.map(i => i.word)));
    setMatches({});
    setSelected(null);
    setScore(0);
  }, [items]);

  const selectPic = (item) => {
    if (matches[item.word]) return;
    setSelected(item);
  };

  const selectWord = (word) => {
    if (!selected || matches[word]) return;
    if (word === selected.word) {
      setMatches(m => ({...m, [word]: true}));
      setScore(s => s + 1);
      setFeedback({ type:'success', text:`Doğru! ${selected.img} = "${word}"` });
      setSelected(null);
    } else {
      setFeedback({ type:'error', text:'Eşleşmedi! Tekrar dene.' });
      setSelected(null);
    }
    setTimeout(() => setFeedback(null), 1500);
  };

  const allMatched = Object.keys(matches).length === items.length && items.length > 0;

  useEffect(() => {
    if (allMatched) setTimeout(() => onComplete(score >= 4 ? 3 : score >= 2 ? 2 : 1), 1500);
  }, [allMatched]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ fontSize:18, fontWeight:700, color:'#fff', fontFamily:"'Fredoka'" }}>Resmi kelimeyle eşleştir! 📖</div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, width:'100%', maxWidth:400 }}>
        {/* Pictures */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {items.map(item => (
            <div key={item.word} onClick={() => selectPic(item)} style={{
              padding:'12px', borderRadius:16, cursor: matches[item.word] ? 'default' : 'pointer',
              background: matches[item.word] ? '#10B98133' : selected?.word === item.word ? `${accent}44` : 'rgba(255,255,255,0.1)',
              border: selected?.word === item.word ? `3px solid ${accent}` : '3px solid transparent',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:42,
              transition:'all 0.3s', opacity: matches[item.word] ? 0.5 : 1,
              boxShadow: selected?.word === item.word ? `0 0 20px ${accent}44` : 'none',
            }}>{item.img}</div>
          ))}
        </div>

        {/* Words */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {shuffledWords.map(word => (
            <div key={word} onClick={() => selectWord(word)} style={{
              padding:'12px 16px', borderRadius:16, cursor: matches[word] ? 'default' : 'pointer',
              background: matches[word] ? '#10B98133' : 'rgba(255,255,255,0.1)',
              border: '3px solid transparent', display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, fontWeight:800, color: matches[word] ? '#10B981' : '#fff',
              fontFamily:"'Fredoka'", transition:'all 0.3s', opacity: matches[word] ? 0.5 : 1,
              textDecoration: matches[word] ? 'line-through' : 'none',
            }}
            onMouseOver={e => { if(!matches[word]) e.target.style.background=`${accent}33`; }}
            onMouseOut={e => { if(!matches[word]) e.target.style.background='rgba(255,255,255,0.1)'; }}
            >{word}</div>
          ))}
        </div>
      </div>

      {feedback && (
        <div style={{
          padding:'10px 24px', borderRadius:12, fontWeight:700, fontSize:15, fontFamily:"'Nunito'",
          background: feedback.type === 'success' ? '#10B981' : '#EF4444', color:'#fff', animation:'pop 0.3s ease'
        }}>{feedback.text}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MINI GAME 6: KELİME SIRALAMA (Cümle Kurma)
// ═══════════════════════════════════════════════════════════════
function WordOrderGame({ letter, letterData, onComplete, accent }) {
  const sentences = useMemo(() => (letterData.sentences || []).filter(s => s.length > 0).slice(0, 2), [letter]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [placed, setPlaced] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sentences.length === 0) { setDone(true); return; }
    if (currentIdx >= sentences.length) { setDone(true); return; }
    const words = sentences[currentIdx].replace(/[.,!?]/g, '').split(' ').filter(w => w);
    setShuffledWords(shuffle(words.map((w,i) => ({ id:i, word:w, used:false }))));
    setPlaced([]);
    setFeedback(null);
  }, [currentIdx, sentences]);

  useEffect(() => {
    if (done) setTimeout(() => onComplete(score >= 2 ? 3 : score >= 1 ? 2 : 1), 1500);
  }, [done]);

  const addWord = (w) => {
    setPlaced(p => [...p, w]);
    setShuffledWords(s => s.map(sw => sw.id === w.id ? {...sw, used:true} : sw));
  };

  const removeWord = (idx) => {
    const removed = placed[idx];
    setPlaced(p => p.filter((_,i) => i !== idx));
    setShuffledWords(s => s.map(sw => sw.id === removed.id ? {...sw, used:false} : sw));
  };

  const checkOrder = () => {
    const formed = placed.map(p => p.word).join(' ');
    const target = sentences[currentIdx].replace(/[.,!?]/g, '');
    if (formed === target) {
      setScore(s => s+1);
      setFeedback({ type:'success', text:'Mükemmel! Cümleyi doğru kurdun! 🎉' });
      setTimeout(() => setCurrentIdx(i => i+1), 2000);
    } else {
      setFeedback({ type:'error', text:'Sıralama doğru değil. Tekrar dene!' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  if (done || sentences.length === 0) return (
    <div style={{ textAlign:'center', padding:40 }}>
      <div style={{ fontSize:60, animation:'pop 0.5s ease' }}>{sentences.length === 0 ? '🔄' : '🎉'}</div>
      <div style={{ fontSize:18, fontWeight:700, color:'#fff', fontFamily:"'Fredoka'", marginTop:12 }}>
        {sentences.length === 0 ? 'Bu harf için henüz cümle yok. Kelime pratiği yapalım!' : `${score}/${sentences.length} cümle doğru!`}
      </div>
      {sentences.length === 0 && <button onClick={() => onComplete(2)} style={{
        marginTop:16, padding:'10px 30px', borderRadius:12, border:'none', background:accent,
        color:'#fff', fontSize:16, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'"
      }}>Devam Et →</button>}
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ fontSize:18, fontWeight:700, color:'#fff', fontFamily:"'Fredoka'" }}>Kelimeleri sırala, cümle kur! 📝</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>Cümle {currentIdx+1} / {sentences.length}</div>

      {/* Placed area */}
      <div style={{
        minHeight:60, width:'100%', maxWidth:400, borderRadius:16, padding:12,
        border:'3px dashed rgba(255,255,255,0.3)', background:'rgba(255,255,255,0.05)',
        display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', alignItems:'center',
      }}>
        {placed.length === 0 && <span style={{ color:'rgba(255,255,255,0.3)', fontSize:14, fontFamily:"'Nunito'" }}>Kelimeleri buraya sırala...</span>}
        {placed.map((w,i) => (
          <button key={i} onClick={() => removeWord(i)} style={{
            padding:'8px 16px', borderRadius:10, border:'none', background:`${accent}55`,
            color:'#fff', fontSize:18, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'", animation:'pop 0.3s ease'
          }}>{w.word}</button>
        ))}
      </div>

      {/* Word pool */}
      <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
        {shuffledWords.filter(w => !w.used).map(w => (
          <button key={w.id} onClick={() => addWord(w)} style={{
            padding:'10px 20px', borderRadius:12, border:'none',
            background:'rgba(255,255,255,0.15)', backdropFilter:'blur(10px)',
            color:'#fff', fontSize:18, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'",
            transition:'all 0.2s',
          }}
          onMouseOver={e => e.target.style.transform='scale(1.1)'}
          onMouseOut={e => e.target.style.transform='scale(1)'}
          >{w.word}</button>
        ))}
      </div>

      {placed.length === shuffledWords.length && placed.length > 0 && (
        <button onClick={checkOrder} style={{
          padding:'12px 32px', borderRadius:14, border:'none', background:accent,
          color:'#fff', fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:"'Fredoka'",
          boxShadow:`0 4px 20px ${accent}66`, animation:'pulse 2s ease infinite',
        }}>✅ Kontrol Et</button>
      )}

      {feedback && (
        <div style={{
          padding:'10px 24px', borderRadius:12, fontWeight:700, fontSize:15, fontFamily:"'Nunito'",
          background: feedback.type === 'success' ? '#10B981' : '#EF4444', color:'#fff', animation:'pop 0.3s ease'
        }}>{feedback.text}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════════

// ─── WELCOME SCREEN ─────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('');
  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)', padding:20, position:'relative', overflow:'hidden',
    }}>
      {/* Stars background */}
      {Array.from({length:50}).map((_,i) => (
        <div key={i} style={{
          position:'absolute', width:2+Math.random()*3, height:2+Math.random()*3, borderRadius:'50%',
          background:'#fff', left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
          animation:`sparkle ${2+Math.random()*3}s ease-in-out infinite`, animationDelay:`${Math.random()*3}s`,
          opacity: 0.3 + Math.random() * 0.7,
        }} />
      ))}

      <div style={{ animation:'pop 0.8s ease', zIndex:1, textAlign:'center' }}>
        <div style={{ fontSize:80, marginBottom:12, animation:'float 3s ease-in-out infinite' }}>⭐</div>
        <h1 style={{
          fontSize:42, fontWeight:900, color:'#fff', fontFamily:"'Fredoka'", margin:0,
          background:'linear-gradient(135deg, #FFE66D, #FF6B6B, #A78BFA, #4ECDC4)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1.2,
        }}>Yıldız Ülkesi</h1>
        <div style={{ fontSize:16, color:'rgba(255,255,255,0.7)', fontFamily:"'Nunito'", fontWeight:600, marginTop:4 }}>
          MEB 2024 — Ses Temelli Okuma Macerası v3
        </div>
      </div>

      <div style={{ marginTop:40, zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:16, animation:'slideUp 0.8s ease' }}>
        <div style={{ fontSize:15, color:'rgba(255,255,255,0.8)', fontWeight:600, fontFamily:"'Nunito'" }}>Adın ne, küçük kaşif?</div>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Adını yaz..." style={{
          padding:'14px 24px', borderRadius:16, border:'3px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)',
          color:'#fff', fontSize:20, fontWeight:700, textAlign:'center', outline:'none', fontFamily:"'Fredoka'", width:260,
          backdropFilter:'blur(10px)', transition:'border-color 0.3s',
        }}
        onFocus={e => e.target.style.borderColor='#FFE66D'}
        onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.2)'}
        onKeyDown={e => e.key === 'Enter' && name.trim() && onStart(name.trim())}
        />
        <button onClick={() => name.trim() && onStart(name.trim())} disabled={!name.trim()} style={{
          padding:'14px 40px', borderRadius:16, border:'none',
          background: name.trim() ? 'linear-gradient(135deg, #FFE66D, #F97316)' : 'rgba(255,255,255,0.1)',
          color: name.trim() ? '#1e293b' : 'rgba(255,255,255,0.3)',
          fontSize:18, fontWeight:800, cursor: name.trim() ? 'pointer' : 'default',
          fontFamily:"'Fredoka'", transition:'all 0.3s',
          boxShadow: name.trim() ? '0 4px 20px rgba(249,115,22,0.4)' : 'none',
        }}>
          🚀 Maceraya Başla!
        </button>
      </div>

      {/* Mascots row */}
      <div style={{ marginTop:40, display:'flex', gap:20, zIndex:1, animation:'slideUp 1s ease' }}>
        {WORLDS.map((w,i) => (
          <div key={w.id} style={{ fontSize:36, animation:`float ${2+i*0.3}s ease-in-out infinite`, animationDelay:`${i*0.2}s` }}>
            {w.mascot}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WORLD MAP SCREEN ───────────────────────────────────────
function WorldMapScreen({ childName, completedLetters, stars, onSelectWorld, onBadges, onTeacher }) {
  const completedCount = completedLetters.length;

  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
      padding:20, position:'relative', overflow:'hidden',
    }}>
      {/* Stars bg */}
      {Array.from({length:30}).map((_,i) => (
        <div key={i} style={{
          position:'absolute', width:2, height:2, borderRadius:'50%', background:'#fff',
          left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, opacity:0.3+Math.random()*0.5,
          animation:`sparkle ${3+Math.random()*2}s infinite`, animationDelay:`${Math.random()*2}s`,
        }} />
      ))}

      {/* Header */}
      <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, color:'#FFE66D', fontFamily:"'Fredoka'" }}>⭐ Yıldız Ülkesi</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.7)', fontFamily:"'Nunito'", fontWeight:600 }}>
            Merhaba {childName}! 👋
          </div>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <div style={{
            background:'rgba(255,215,0,0.15)', padding:'8px 16px', borderRadius:12,
            fontSize:16, fontWeight:800, color:'#FFE66D', fontFamily:"'Fredoka'",
            display:'flex', alignItems:'center', gap:6,
          }}>⭐ {stars}</div>
          <button onClick={onBadges} style={{
            padding:'8px 16px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.1)',
            color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'"
          }}>🏅 Rozetler</button>
          <button onClick={onTeacher} style={{
            padding:'8px 16px', borderRadius:12, border:'none', background:'rgba(255,255,255,0.1)',
            color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'"
          }}>👨‍🏫 Öğretmen</button>
        </div>
      </div>

      {/* Overall Progress */}
      <div style={{ position:'relative', zIndex:1, marginBottom:24 }}>
        <ProgressBar value={completedCount} max={29} color="#FFE66D" label={`Toplam İlerleme: ${completedCount}/29 harf`} />
      </div>

      {/* World Map */}
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:20 }}>
        {WORLDS.map((world, wi) => {
          const worldCompleted = world.letters.filter(l => completedLetters.includes(l)).length;
          const isLocked = wi > 0 && WORLDS[wi-1].letters.filter(l => completedLetters.includes(l)).length < WORLDS[wi-1].letters.length;
          const isActive = !isLocked;

          return (
            <div key={world.id} onClick={() => isActive && onSelectWorld(world)} style={{
              background: isLocked ? 'rgba(255,255,255,0.03)' : `linear-gradient(135deg, ${world.bg}cc, ${world.bg}88)`,
              borderRadius:24, padding:20, cursor: isActive ? 'pointer' : 'default',
              border: `2px solid ${isLocked ? 'rgba(255,255,255,0.05)' : world.accent+'44'}`,
              opacity: isLocked ? 0.4 : 1, transition:'all 0.3s', position:'relative', overflow:'hidden',
              animation: isActive ? `slideUp 0.5s ease ${wi*0.1}s both` : 'none',
            }}
            onMouseOver={e => { if(isActive) e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 30px ${world.accent}33`; }}
            onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
            >
              {isLocked && <div style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', fontSize:40, opacity:0.5 }}>🔒</div>}

              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ fontSize:52, animation: isActive ? 'float 3s ease infinite' : 'none', filter: isActive ? 'none' : 'grayscale(1)' }}>
                  {world.mascot}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:22, fontWeight:900, color:'#fff', fontFamily:"'Fredoka'" }}>{world.name}</span>
                    <span style={{ fontSize:14 }}>{world.emoji}</span>
                  </div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontFamily:"'Nunito'", fontWeight:600, marginBottom:8 }}>
                    Maskot: {world.mascotName} · {world.letters.length} harf
                  </div>
                  <ProgressBar value={worldCompleted} max={world.letters.length} color={world.accent} />
                  <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                    {world.letters.map(l => (
                      <span key={l} style={{
                        width:30, height:30, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:14, fontWeight:800, fontFamily:"'Fredoka'",
                        background: completedLetters.includes(l) ? world.accent : 'rgba(255,255,255,0.1)',
                        color: completedLetters.includes(l) ? '#fff' : 'rgba(255,255,255,0.4)',
                        border: `1px solid ${completedLetters.includes(l) ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                      }}>{l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── LETTER SELECT SCREEN ───────────────────────────────────
function LetterSelectScreen({ world, completedLetters, onSelectLetter, onBack }) {
  return (
    <div style={{
      minHeight:'100vh', background:`linear-gradient(135deg, ${world.bg} 0%, ${world.bg}dd 100%)`,
      padding:20, position:'relative',
    }}>
      <button onClick={onBack} style={{
        position:'absolute', top:20, left:20, padding:'8px 16px', borderRadius:10, border:'none',
        background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'"
      }}>← Harita</button>

      <div style={{ textAlign:'center', paddingTop:40, marginBottom:30 }}>
        <Mascot emoji={world.mascot} name={world.mascotName} size={70}
          message={`${world.name}'ne hoş geldin! Hangi sesi keşfetmek istersin?`} speaking={false} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, maxWidth:400, margin:'0 auto' }}>
        {world.letters.map((l, i) => {
          const isCompleted = completedLetters.includes(l);
          const prevCompleted = i === 0 || completedLetters.includes(world.letters[i-1]);
          const isLocked = !isCompleted && !prevCompleted;

          return (
            <button key={l} onClick={() => !isLocked && onSelectLetter(l)} disabled={isLocked} style={{
              width:'100%', aspectRatio:'1', borderRadius:20, border:'none',
              background: isCompleted ? `${world.accent}33` : isLocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.12)',
              cursor: isLocked ? 'default' : 'pointer', position:'relative',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4,
              opacity: isLocked ? 0.3 : 1, transition:'all 0.3s',
              boxShadow: isCompleted ? `0 0 20px ${world.accent}33` : 'none',
              animation: !isLocked ? `pop 0.4s ease ${i*0.08}s both` : 'none',
            }}
            onMouseOver={e => { if(!isLocked) e.currentTarget.style.transform='scale(1.08)'; }}
            onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
            >
              <div style={{ fontSize:40, fontWeight:900, color: isCompleted ? world.accent : '#fff', fontFamily:"'Fredoka'" }}>{l}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontFamily:"'Nunito'", fontWeight:600 }}>
                "{LETTER_DATA[l]?.sound}"
              </div>
              {isCompleted && <div style={{ position:'absolute', top:6, right:6, fontSize:18 }}>⭐</div>}
              {isLocked && <div style={{ fontSize:20 }}>🔒</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── GAME SCREEN (Phase-based mini games) ───────────────────
function GameScreen({ world, letter, completedLetters, onComplete, onBack }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseScores, setPhaseScores] = useState({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [mascotMsg, setMascotMsg] = useState(`"${LETTER_DATA[letter].sound}" sesini keşfetmeye hazır mısın?`);
  const [speaking, setSpeaking] = useState(true);

  const phase = PHASES[phaseIdx];
  const ld = LETTER_DATA[letter];

  useEffect(() => { setSpeaking(true); setTimeout(() => setSpeaking(false), 2000); }, [phaseIdx]);

  const handlePhaseComplete = (score) => {
    const newScores = { ...phaseScores, [phase.id]: score };
    setPhaseScores(newScores);

    if (phaseIdx < PHASES.length - 1) {
      setMascotMsg(`Süper! ${PHASES[phaseIdx+1].label} zamanı!`);
      setSpeaking(true);
      setTimeout(() => { setPhaseIdx(phaseIdx + 1); setSpeaking(false); }, 1500);
    } else {
      setShowCelebration(true);
      setTimeout(() => onComplete(letter, newScores), 3000);
    }
  };

  if (showCelebration) {
    const totalScore = Object.values(phaseScores).reduce((a,b)=>a+b,0);
    const earnedStars = totalScore >= 15 ? 3 : totalScore >= 10 ? 2 : 1;
    return (
      <div style={{
        minHeight:'100vh', background:`linear-gradient(135deg, ${world.bg}, ${world.accent}44)`,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20,
      }}>
        <Confetti />
        <StarBurst />
        <div style={{ fontSize:80, animation:'pop 0.6s ease' }}>{world.mascot}</div>
        <div style={{ fontSize:32, fontWeight:900, color:'#FFE66D', fontFamily:"'Fredoka'", marginTop:16, animation:'glow 2s ease infinite' }}>
          Tebrikler! 🎉
        </div>
        <div style={{ fontSize:18, color:'#fff', fontFamily:"'Nunito'", fontWeight:600, marginTop:8 }}>
          "{letter}" sesini tamamen öğrendin!
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16 }}>
          {[1,2,3].map(s => (
            <span key={s} style={{ fontSize:40, opacity: s <= earnedStars ? 1 : 0.2, animation: s <= earnedStars ? `pop 0.5s ease ${s*0.2}s both` : 'none' }}>⭐</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight:'100vh', background:`linear-gradient(135deg, ${world.bg} 0%, ${world.bg}cc 100%)`,
      display:'flex', flexDirection:'column', padding:16,
    }}>
      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <button onClick={onBack} style={{
          padding:'6px 14px', borderRadius:8, border:'none', background:'rgba(255,255,255,0.1)',
          color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'"
        }}>← Geri</button>
        <div style={{
          fontSize:28, fontWeight:900, color:world.accent, fontFamily:"'Fredoka'",
          textShadow:`0 0 20px ${world.accent}66`
        }}>{letter}</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontFamily:"'Nunito'", fontWeight:600 }}>
          Faz {phaseIdx+1}/6
        </div>
      </div>

      {/* Phase indicators */}
      <div style={{ display:'flex', gap:4, marginBottom:16 }}>
        {PHASES.map((p,i) => (
          <div key={p.id} style={{
            flex:1, height:6, borderRadius:3,
            background: i < phaseIdx ? world.accent : i === phaseIdx ? `${world.accent}88` : 'rgba(255,255,255,0.1)',
            transition:'background 0.5s',
          }} />
        ))}
      </div>

      {/* Phase label */}
      <div style={{
        textAlign:'center', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        animation:'slideUp 0.4s ease',
      }}>
        <span style={{ fontSize:24 }}>{phase.icon}</span>
        <span style={{
          fontSize:16, fontWeight:800, color:phase.color, fontFamily:"'Fredoka'",
          background:`${phase.color}22`, padding:'4px 14px', borderRadius:8,
        }}>{phase.label}</span>
      </div>

      {/* Mascot */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>
        <Mascot emoji={world.mascot} message={mascotMsg} speaking={speaking} size={50} />
      </div>

      {/* Game Area */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        {phase.game === 'balloon' && <BalloonGame letter={letter} letterData={ld} onComplete={handlePhaseComplete} accent={world.accent} />}
        {phase.game === 'soundmeter' && <SoundMeterGame letter={letter} letterData={ld} onComplete={handlePhaseComplete} accent={world.accent} />}
        {phase.game === 'tracing' && <TracingGame letter={letter} onComplete={handlePhaseComplete} accent={world.accent} />}
        {phase.game === 'dragdrop' && <DragDropSyllableGame letter={letter} letterData={ld} onComplete={handlePhaseComplete} accent={world.accent} />}
        {phase.game === 'picmatch' && <PicMatchGame letter={letter} letterData={ld} onComplete={handlePhaseComplete} accent={world.accent} />}
        {phase.game === 'wordorder' && <WordOrderGame letter={letter} letterData={ld} onComplete={handlePhaseComplete} accent={world.accent} />}
      </div>
    </div>
  );
}

// ─── BADGES SCREEN ──────────────────────────────────────────
function BadgesScreen({ completedLetters, stars, onBack }) {
  const count = completedLetters.length;
  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding:20,
    }}>
      <button onClick={onBack} style={{
        padding:'8px 16px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.1)',
        color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'", marginBottom:20,
      }}>← Harita</button>

      <h2 style={{ fontSize:28, fontWeight:900, color:'#FFE66D', fontFamily:"'Fredoka'", textAlign:'center', marginBottom:24 }}>
        🏅 Rozet Koleksiyonum
      </h2>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16, maxWidth:400, margin:'0 auto' }}>
        {BADGES.map(badge => {
          const earned = badge.req(count, stars);
          return (
            <div key={badge.id} style={{
              background: earned ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
              borderRadius:20, padding:20, textAlign:'center',
              border: earned ? '2px solid rgba(255,215,0,0.3)' : '2px solid rgba(255,255,255,0.05)',
              opacity: earned ? 1 : 0.4, transition:'all 0.3s',
            }}>
              <div style={{ fontSize:40, marginBottom:8, filter: earned ? 'none' : 'grayscale(1)', animation: earned ? 'glow 3s ease infinite' : 'none' }}>{badge.icon}</div>
              <div style={{ fontSize:15, fontWeight:800, color: earned ? '#FFE66D' : 'rgba(255,255,255,0.5)', fontFamily:"'Fredoka'" }}>{badge.name}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:"'Nunito'", marginTop:4 }}>{badge.desc}</div>
              {earned && <div style={{ fontSize:12, color:'#10B981', fontWeight:700, marginTop:4, fontFamily:"'Nunito'" }}>✅ Kazanıldı!</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── TEACHER SCREEN ─────────────────────────────────────────
function TeacherScreen({ childName, completedLetters, stars, assessments, onBack }) {
  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', padding:20,
    }}>
      <button onClick={onBack} style={{
        padding:'8px 16px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.1)',
        color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Fredoka'", marginBottom:20,
      }}>← Harita</button>

      <h2 style={{ fontSize:24, fontWeight:900, color:'#fff', fontFamily:"'Fredoka'", textAlign:'center', marginBottom:8 }}>
        👨‍🏫 Öğretmen Paneli
      </h2>
      <div style={{ textAlign:'center', fontSize:14, color:'rgba(255,255,255,0.6)', fontFamily:"'Nunito'", marginBottom:24 }}>
        Öğrenci: {childName} · {completedLetters.length}/29 harf · ⭐ {stars} yıldız
      </div>

      <div style={{ maxWidth:500, margin:'0 auto' }}>
        <ProgressBar value={completedLetters.length} max={29} color="#FFE66D" label="Genel İlerleme" />

        <div style={{ marginTop:24 }}>
          {WORLDS.map(world => {
            const wLetters = world.letters.filter(l => completedLetters.includes(l));
            return (
              <div key={world.id} style={{ marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:24 }}>{world.mascot}</span>
                  <span style={{ fontSize:16, fontWeight:800, color:world.accent, fontFamily:"'Fredoka'" }}>{world.name}</span>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontFamily:"'Nunito'" }}>
                    ({wLetters.length}/{world.letters.length})
                  </span>
                </div>

                {world.letters.map(l => {
                  const a = assessments[l];
                  const isComplete = completedLetters.includes(l);
                  return (
                    <div key={l} style={{
                      background: isComplete ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                      borderRadius:12, padding:'10px 14px', marginBottom:6,
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                    }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{
                          width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                          background: isComplete ? world.accent : 'rgba(255,255,255,0.05)',
                          fontSize:16, fontWeight:900, color:'#fff', fontFamily:"'Fredoka'"
                        }}>{l}</span>
                        <span style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontFamily:"'Nunito'", fontWeight:600 }}>
                          "{LETTER_DATA[l]?.sound}" sesi
                        </span>
                      </div>
                      {a?.phaseScores ? (
                        <div style={{ display:'flex', gap:3 }}>
                          {PHASES.map(p => {
                            const sc = a.phaseScores[p.id] || 0;
                            return <div key={p.id} title={`${p.label}: ${sc}/3`} style={{
                              width:20, height:20, borderRadius:4, fontSize:9, fontWeight:800,
                              display:'flex', alignItems:'center', justifyContent:'center',
                              background: sc >= 3 ? '#10B981' : sc >= 2 ? '#F59E0B' : sc >= 1 ? '#EF4444' : 'rgba(255,255,255,0.05)',
                              color:'#fff', fontFamily:"'Nunito'",
                            }}>{sc}</div>;
                          })}
                        </div>
                      ) : (
                        <span style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontFamily:"'Nunito'" }}>—</span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* MEB Reference */}
        <div style={{
          marginTop:24, padding:16, borderRadius:16, background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#FFE66D', fontFamily:"'Fredoka'", marginBottom:8 }}>
            📋 MEB Kazanım Kodları
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.6)', fontFamily:"'Nunito'", lineHeight:1.8 }}>
            T.O.1.1.1 — Sesi fark etme · T.O.1.1.2 — Sesi üretme · T.Y.1.1.1 — Harfi yazma<br/>
            T.O.1.2.1 — Hece oluşturma · T.O.1.3.1 — Kelime okuma · T.O.1.4.1 — Cümle oluşturma
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function YildizUlkesiV3() {
  const [screen, setScreen] = useState('welcome');
  const [childName, setChildName] = useState('');
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [completedLetters, setCompletedLetters] = useState([]);
  const [stars, setStars] = useState(0);
  const [assessments, setAssessments] = useState({});

  const handleStart = (name) => { setChildName(name); setScreen('map'); };

  const handleSelectWorld = (world) => { setSelectedWorld(world); setScreen('letters'); };

  const handleSelectLetter = (letter) => { setSelectedLetter(letter); setScreen('game'); };

  const handleGameComplete = (letter, phaseScores) => {
    if (!completedLetters.includes(letter)) {
      setCompletedLetters(prev => [...prev, letter]);
    }
    const totalScore = Object.values(phaseScores).reduce((a,b)=>a+b,0);
    const earnedStars = totalScore >= 15 ? 3 : totalScore >= 10 ? 2 : 1;
    setStars(s => s + earnedStars);
    setAssessments(a => ({...a, [letter]: { phaseScores, date: new Date().toISOString() }}));
    setTimeout(() => setScreen('letters'), 500);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: '100vh', overflow:'hidden' }}>
      <style>{keyframes}</style>

      {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}

      {screen === 'map' && (
        <WorldMapScreen childName={childName} completedLetters={completedLetters} stars={stars}
          onSelectWorld={handleSelectWorld}
          onBadges={() => setScreen('badges')}
          onTeacher={() => setScreen('teacher')}
        />
      )}

      {screen === 'letters' && selectedWorld && (
        <LetterSelectScreen world={selectedWorld} completedLetters={completedLetters}
          onSelectLetter={handleSelectLetter}
          onBack={() => setScreen('map')}
        />
      )}

      {screen === 'game' && selectedWorld && selectedLetter && (
        <GameScreen world={selectedWorld} letter={selectedLetter} completedLetters={completedLetters}
          onComplete={handleGameComplete}
          onBack={() => setScreen('letters')}
        />
      )}

      {screen === 'badges' && (
        <BadgesScreen completedLetters={completedLetters} stars={stars} onBack={() => setScreen('map')} />
      )}

      {screen === 'teacher' && (
        <TeacherScreen childName={childName} completedLetters={completedLetters}
          stars={stars} assessments={assessments} onBack={() => setScreen('map')} />
      )}
    </div>
  );
}
