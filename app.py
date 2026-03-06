# ============================================================================
# 🌟 OKUMA YILDIZI 3D — Immersive 3D Turkish Phonics Game
# ============================================================================
# pip install streamlit
# Run: streamlit run app.py
# ============================================================================

import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="Okuma Yıldızı 3D",
    page_icon="⭐",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Hide all Streamlit chrome
st.markdown("""
<style>
#MainMenu,header,footer,[data-testid="stToolbar"],[data-testid="stDecoration"],
[data-testid="stStatusWidget"],.stDeployButton{display:none!important}
.stApp{background:#000!important}
section.main>div.block-container{padding:0!important;max-width:100%!important}
iframe{border:none!important}
div[data-testid="stVerticalBlock"]{gap:0!important}
</style>
""", unsafe_allow_html=True)

# ============================================================================
# THE FULL 3D GAME — Self-contained HTML with Three.js
# ============================================================================
GAME_HTML = r"""
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
<style>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Fredoka:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{width:100%;height:100%;overflow:hidden;background:#000;font-family:'Fredoka',sans-serif}
#cv{position:fixed;top:0;left:0;width:100%;height:100%;z-index:1}
#ui{position:fixed;top:0;left:0;width:100%;height:100%;z-index:10;pointer-events:none}
#ui *{pointer-events:auto}

/* SPLASH */
#splash{
    position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:radial-gradient(ellipse at 50% 50%,rgba(30,60,120,0.3),transparent 70%);
    z-index:100;transition:opacity 0.8s,transform 0.8s;
}
#splash.off{opacity:0;transform:scale(1.1);pointer-events:none}
.stitle{
    font-family:'Baloo 2',cursive;font-size:clamp(44px,11vw,96px);font-weight:800;
    background:linear-gradient(135deg,#FFD700,#FF6B6B,#A855F7,#3B82F6,#10B981,#FFD700);
    background-size:400% 400%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    animation:rbow 4s ease infinite;filter:drop-shadow(0 4px 30px rgba(255,215,0,0.4));margin-bottom:6px;text-align:center;
}
.ssub{color:rgba(255,255,255,0.7);font-size:clamp(15px,3vw,24px);font-weight:500;margin-bottom:36px;text-align:center}
.pbtn{
    background:linear-gradient(135deg,#10B981,#3B82F6);color:#fff;border:none;
    font-family:'Fredoka';font-size:clamp(20px,4vw,32px);font-weight:700;
    padding:16px 56px;border-radius:60px;cursor:pointer;
    box-shadow:0 0 40px rgba(16,185,129,0.5),0 8px 32px rgba(0,0,0,0.3);
    transition:transform 0.2s;letter-spacing:2px;animation:pulse 2s ease-in-out infinite;
}
.pbtn:hover{transform:scale(1.08)}
.pbtn:active{transform:scale(0.96)}
.float-em{position:absolute;font-size:clamp(30px,6vw,50px);animation:flt 4s ease-in-out infinite;opacity:0.5}

/* HUD */
#hud{position:absolute;top:0;left:0;width:100%;padding:10px 16px;display:none;align-items:center;justify-content:space-between;background:linear-gradient(180deg,rgba(0,0,0,0.55)0%,transparent 100%);flex-wrap:wrap;gap:6px}
#hud.on{display:flex}
.hi{display:flex;align-items:center;gap:5px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:5px 14px}
.hic{font-size:18px}.hiv{color:#fff;font-size:16px;font-weight:700}

/* PROGRESS */
#pw{position:absolute;top:52px;left:50%;transform:translateX(-50%);width:min(92%,520px);height:12px;background:rgba(255,255,255,0.08);border-radius:8px;overflow:hidden;display:none;border:1px solid rgba(255,255,255,0.06)}
#pw.on{display:block}
#pb{height:100%;width:0%;border-radius:8px;background:linear-gradient(90deg,#10B981,#3B82F6,#A855F7,#F59E0B);background-size:300% 100%;animation:rbow 3s linear infinite;transition:width 0.6s cubic-bezier(0.34,1.56,0.64,1)}

/* QUESTION */
#qp{position:absolute;bottom:0;left:0;width:100%;display:none;flex-direction:column;align-items:center;padding:0 14px 20px;background:linear-gradient(0deg,rgba(0,0,0,0.75)0%,rgba(0,0,0,0.3)60%,transparent 100%)}
#qp.on{display:flex}
.qw{font-family:'Baloo 2',cursive;font-size:clamp(30px,7vw,56px);font-weight:800;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,0.5);margin-bottom:2px;letter-spacing:3px}
.qq{color:rgba(255,255,255,0.7);font-size:clamp(13px,2.5vw,19px);font-weight:500;margin-bottom:14px;text-align:center}
.tr{display:flex;gap:clamp(8px,2vw,16px);justify-content:center;flex-wrap:wrap;margin-bottom:8px}
.tl{
    min-width:clamp(60px,14vw,105px);padding:clamp(12px,3vw,22px) clamp(8px,2vw,18px);
    background:rgba(255,255,255,0.07);backdrop-filter:blur(14px);
    border:2px solid rgba(255,255,255,0.18);border-radius:18px;
    font-family:'Baloo 2',cursive;font-size:clamp(26px,6vw,46px);font-weight:800;
    color:#fff;text-align:center;cursor:pointer;
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
    text-shadow:0 2px 10px rgba(0,0,0,0.3);user-select:none;
    box-shadow:0 4px 20px rgba(0,0,0,0.2);position:relative;overflow:hidden;
}
.tl:hover{transform:translateY(-5px) scale(1.05);border-color:rgba(255,255,255,0.45);box-shadow:0 8px 36px rgba(100,150,255,0.3)}
.tl:active{transform:translateY(-2px) scale(0.97)}
.tl.ok{background:linear-gradient(135deg,#10B981,#34D399)!important;border-color:#10B981!important;animation:tok 0.6s cubic-bezier(0.34,1.56,0.64,1);box-shadow:0 0 40px rgba(16,185,129,0.6)!important}
.tl.no{animation:tno 0.5s ease}

/* COMBO */
#cp{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);font-family:'Baloo 2',cursive;font-size:clamp(34px,8vw,68px);font-weight:800;color:#FFD700;text-shadow:0 0 40px rgba(255,215,0,0.7);pointer-events:none;z-index:50;opacity:0;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1)}
#cp.sh{transform:translate(-50%,-50%) scale(1);opacity:1}
#cp.hd{transform:translate(-50%,-80%) scale(0.5);opacity:0}

/* CELEBRATION */
#cel{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:80;text-align:center;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0.6),rgba(0,0,0,0.85))}
#cel.on{display:flex}
.ce{font-size:clamp(56px,13vw,110px);animation:cb 1s ease infinite}
.ct{font-family:'Baloo 2',cursive;font-size:clamp(28px,6vw,52px);font-weight:800;background:linear-gradient(135deg,#FFD700,#FF6B6B,#A855F7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:10px 0 4px}
.cs{color:rgba(255,255,255,0.7);font-size:clamp(14px,2.5vw,22px);font-weight:500;margin-bottom:20px}
.cst{display:flex;gap:20px;flex-wrap:wrap;justify-content:center;background:rgba(255,255,255,0.06);backdrop-filter:blur(12px);border-radius:22px;padding:18px 28px;border:1px solid rgba(255,255,255,0.1);margin-bottom:24px}
.sb{text-align:center}.si{font-size:26px}.sv{color:#FFD700;font-size:24px;font-weight:800}.sl{color:rgba(255,255,255,0.5);font-size:11px}
.nb{background:linear-gradient(135deg,#A855F7,#3B82F6);color:#fff;border:none;font-family:'Fredoka';font-size:clamp(17px,3vw,24px);font-weight:700;padding:13px 44px;border-radius:50px;cursor:pointer;box-shadow:0 0 30px rgba(168,85,247,0.4);transition:transform 0.2s;letter-spacing:1px}
.nb:hover{transform:scale(1.06)}.nb:active{transform:scale(0.96)}

/* MODE */
.mt{position:absolute;bottom:6px;right:14px;background:rgba(255,255,255,0.07);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.12);border-radius:11px;padding:5px 12px;color:rgba(255,255,255,0.55);font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;display:none}
.mt.on{display:block}.mt:hover{background:rgba(255,255,255,0.14);color:#fff}

/* Letters display in celeb */
.letters-row{display:flex;gap:8px;justify-content:center;margin-bottom:16px;flex-wrap:wrap}
.lr-item{background:rgba(255,255,255,0.1);border-radius:12px;padding:6px 14px;font-family:'Baloo 2',cursive;font-size:22px;font-weight:800;color:#FFD700;border:1px solid rgba(255,215,0,0.3)}

@keyframes rbow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes pulse{0%,100%{box-shadow:0 0 40px rgba(16,185,129,0.5),0 8px 32px rgba(0,0,0,0.3)}50%{box-shadow:0 0 60px rgba(16,185,129,0.8),0 12px 40px rgba(0,0,0,0.4)}}
@keyframes tok{0%{transform:scale(1)}40%{transform:scale(1.2) rotate(5deg)}70%{transform:scale(0.95)}100%{transform:scale(1)}}
@keyframes tno{0%,100%{transform:translateX(0)}15%{transform:translateX(-10px) rotate(-3deg)}30%{transform:translateX(10px) rotate(3deg)}45%{transform:translateX(-7px)}60%{transform:translateX(7px)}75%{transform:translateX(-3px)}}
@keyframes cb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-14px) scale(1.1)}}
@keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes pfly{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
</style>
</head>
<body>
<canvas id="cv"></canvas>
<div id="ui">
  <div id="splash">
    <div class="float-em" style="top:8%;left:7%;animation-delay:0.3s">🍎</div>
    <div class="float-em" style="top:12%;right:9%;animation-delay:0.8s">🌷</div>
    <div class="float-em" style="bottom:18%;left:10%;animation-delay:0.1s">🐱</div>
    <div class="float-em" style="bottom:22%;right:7%;animation-delay:1.2s">🦋</div>
    <div class="float-em" style="top:35%;left:4%;animation-delay:0.6s">⭐</div>
    <div class="float-em" style="top:30%;right:5%;animation-delay:1.5s">🐝</div>
    <div class="stitle">OKUMA YILDIZI</div>
    <div class="ssub">✨ 3D Harf Macerası ✨</div>
    <button class="pbtn" id="pbtn">🚀 OYNA!</button>
  </div>
  <div id="hud">
    <div class="hi"><span class="hic">⭐</span><span class="hiv" id="hs">0</span></div>
    <div class="hi"><span class="hic">🏆</span><span class="hiv" id="hsc">0</span></div>
    <div class="hi" id="hcw" style="display:none"><span class="hic">🔥</span><span class="hiv" id="hc">0</span></div>
    <div class="hi"><span class="hic">📖</span><span class="hiv" id="hg">1. Grup</span></div>
  </div>
  <div id="pw"><div id="pb"></div></div>
  <div id="cp"></div>
  <div id="qp">
    <div class="qw" id="qw"></div>
    <div class="qq" id="qq"></div>
    <div class="tr" id="trow"></div>
  </div>
  <div class="mt" id="mt">🔤 Hece Modu</div>
  <div id="cel">
    <div class="ce" id="cem">🏆</div>
    <div class="ct" id="cet">Tebrikler!</div>
    <div class="cs" id="ces"></div>
    <div id="clr"></div>
    <div class="cst" id="cst"></div>
    <button class="nb" id="ceb">🚀 Devam Et!</button>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
// ═══════════════ DATA ═══════════════
const G=[
{id:1,n:"1. Grup",b:"Yıldız Tomurcuğu ⭐",ec:0x1a3a5c,gc:0x2d6a4f,
 l:[{t:"E",w:"Elma",e:"🍎",s:["El","ma"],c:"#FF6B6B"},{t:"L",w:"Lale",e:"🌷",s:["La","le"],c:"#E84393"},{t:"A",w:"Arı",e:"🐝",s:["A","rı"],c:"#FDCB6E"},{t:"K",w:"Kedi",e:"🐱",s:["Ke","di"],c:"#A855F7"},{t:"İ",w:"İnek",e:"🐄",s:["İ","nek"],c:"#10B981"},{t:"N",w:"Nar",e:"🍎",s:["N","ar"],c:"#F97316"}]},
{id:2,n:"2. Grup",b:"Parlayan Yıldız 🌟",ec:0x2d1b4e,gc:0x4a1d8e,
 l:[{t:"O",w:"Okul",e:"🏫",s:["O","kul"],c:"#3B82F6"},{t:"M",w:"Masa",e:"🪑",s:["Ma","sa"],c:"#EC4899"},{t:"U",w:"Uçak",e:"✈️",s:["U","çak"],c:"#06B6D4"},{t:"T",w:"Top",e:"⚽",s:["T","op"],c:"#10B981"},{t:"Ü",w:"Üzüm",e:"🍇",s:["Ü","züm"],c:"#8B5CF6"},{t:"Y",w:"Yıldız",e:"⭐",s:["Yıl","dız"],c:"#EAB308"}]},
{id:3,n:"3. Grup",b:"Süper Yıldız 💫",ec:0x0c2d48,gc:0x145a32,
 l:[{t:"S",w:"Su",e:"💧",s:["S","u"],c:"#0EA5E9"},{t:"D",w:"Dağ",e:"⛰️",s:["D","ağ"],c:"#6B7280"},{t:"Ö",w:"Ördek",e:"🦆",s:["Ör","dek"],c:"#F97316"},{t:"R",w:"Robot",e:"🤖",s:["Ro","bot"],c:"#9CA3AF"},{t:"I",w:"Irmak",e:"🏞️",s:["Ir","mak"],c:"#14B8A6"},{t:"B",w:"Balık",e:"🐟",s:["Ba","lık"],c:"#2563EB"}]},
{id:4,n:"4. Grup",b:"Mega Yıldız 🌠",ec:0x3b1020,gc:0x7c2d12,
 l:[{t:"Z",w:"Zürafa",e:"🦒",s:["Zü","ra","fa"],c:"#EAB308"},{t:"Ç",w:"Çiçek",e:"🌸",s:["Çi","çek"],c:"#EC4899"},{t:"Ş",w:"Şapka",e:"🎩",s:["Şap","ka"],c:"#374151"},{t:"G",w:"Göz",e:"👁️",s:["G","öz"],c:"#10B981"},{t:"C",w:"Cam",e:"🪟",s:["C","am"],c:"#60A5FA"},{t:"P",w:"Pasta",e:"🎂",s:["Pas","ta"],c:"#DB2777"}]},
{id:5,n:"5. Grup",b:"Efsane Yıldız 🏆",ec:0x1a1a2e,gc:0x16213e,
 l:[{t:"H",w:"Hayvan",e:"🐾",s:["Hay","van"],c:"#8B5CF6"},{t:"F",w:"Fil",e:"🐘",s:["F","il"],c:"#6B7280"},{t:"V",w:"Vazo",e:"🏺",s:["Va","zo"],c:"#F97316"},{t:"Ğ",w:"Dağ",e:"🏔️",s:["Da","ğ"],c:"#34D399"},{t:"J",w:"Jeton",e:"🪙",s:["Je","ton"],c:"#FBBF24"}]}
];

// ═══════════════ STATE ═══════════════
const S={sc:"splash",gi:0,li:0,score:0,stars:0,combo:0,mx:0,tc:0,mode:"letter",ans:false,opts:[]};

// ═══════════════ AUDIO (Web Audio synth) ═══════════════
let ac=null;
function ea(){if(!ac)ac=new(window.AudioContext||window.webkitAudioContext)()}
function pt(f,d,tp='sine',v=0.15){ea();const o=ac.createOscillator(),g=ac.createGain();o.type=tp;o.frequency.setValueAtTime(f,ac.currentTime);g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}
function sfxOk(){pt(523,0.1);setTimeout(()=>pt(659,0.1),80);setTimeout(()=>pt(784,0.15),160);setTimeout(()=>pt(1047,0.3,undefined,0.12),260)}
function sfxNo(){pt(200,0.25,'triangle',0.12)}
function sfxCb(){pt(784,0.08);setTimeout(()=>pt(988,0.08),60);setTimeout(()=>pt(1175,0.08),120);setTimeout(()=>pt(1318,0.2,undefined,0.12),180)}
function sfxLv(){[523,659,784,1047,1318].forEach((f,i)=>setTimeout(()=>pt(f,0.2),i*100))}
function sfxCl(){pt(800,0.06,undefined,0.1)}

// ═══════════════ THREE.JS ═══════════════
const cv=document.getElementById('cv');
const R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
R.setSize(innerWidth,innerHeight);
R.shadowMap.enabled=true;
R.shadowMap.type=THREE.PCFSoftShadowMap;
R.toneMapping=THREE.ACESFilmicToneMapping;
R.toneMappingExposure=1.2;

const sc=new THREE.Scene();
sc.fog=new THREE.FogExp2(0x0a0a2e,0.018);
const cam=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,0.1,1000);
cam.position.set(0,5,14);cam.lookAt(0,1,0);

// Lights
sc.add(new THREE.AmbientLight(0x404080,0.6));
const dl=new THREE.DirectionalLight(0xffeedd,1.2);
dl.position.set(10,20,10);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);
dl.shadow.camera.near=0.5;dl.shadow.camera.far=50;dl.shadow.camera.left=-15;dl.shadow.camera.right=15;dl.shadow.camera.top=15;dl.shadow.camera.bottom=-15;
sc.add(dl);
const pl1=new THREE.PointLight(0x4488ff,1.5,30);pl1.position.set(-5,8,5);sc.add(pl1);
const pl2=new THREE.PointLight(0xff4488,1,25);pl2.position.set(5,6,-3);sc.add(pl2);
const pl3=new THREE.PointLight(0x44ff88,0.8,20);pl3.position.set(0,4,8);sc.add(pl3);

// Stars
const sgeo=new THREE.BufferGeometry();const sn=2500;const sp=new Float32Array(sn*3);
for(let i=0;i<sn;i++){sp[i*3]=(Math.random()-0.5)*250;sp[i*3+1]=Math.random()*120+10;sp[i*3+2]=(Math.random()-0.5)*250-20}
sgeo.setAttribute('position',new THREE.BufferAttribute(sp,3));
const smat=new THREE.PointsMaterial({color:0xffffff,size:0.35,transparent:true,opacity:0.7,sizeAttenuation:true});
sc.add(new THREE.Points(sgeo,smat));

// Island
const ig=new THREE.Group();
const imat=new THREE.MeshStandardMaterial({color:0x2d6a4f,roughness:0.8,metalness:0.1});
const imesh=new THREE.Mesh(new THREE.CylinderGeometry(8,5,3,32),imat);
imesh.position.y=-1.5;imesh.receiveShadow=true;ig.add(imesh);
const gmat=new THREE.MeshStandardMaterial({color:0x52b788,roughness:0.9});
const gmesh=new THREE.Mesh(new THREE.CylinderGeometry(8.1,8,0.4,32),gmat);
gmesh.position.y=0;gmesh.receiveShadow=true;ig.add(gmesh);

// Under-island rocks
const rmat=new THREE.MeshStandardMaterial({color:0x6b4e3d,roughness:0.9});
for(let i=0;i<6;i++){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(1.5+Math.random(),0),rmat);const a=(i/6)*Math.PI*2;r.position.set(Math.cos(a)*4,-3.5-Math.random()*1.5,Math.sin(a)*4);r.scale.setScalar(0.2+Math.random()*0.4);r.rotation.set(Math.random()*2,Math.random()*2,Math.random()*2);ig.add(r)}

// Waterfalls (glowing strips below island)
for(let i=0;i<3;i++){
    const wg=new THREE.CylinderGeometry(0.08,0.12,4,8);
    const wm=new THREE.MeshStandardMaterial({color:0x60a5fa,emissive:0x3b82f6,emissiveIntensity:0.8,transparent:true,opacity:0.5});
    const w=new THREE.Mesh(wg,wm);
    const a=(i/3)*Math.PI*2+0.5;
    w.position.set(Math.cos(a)*5,-4,Math.sin(a)*5);
    ig.add(w);
}

sc.add(ig);

// Trees
const trs=[];
function mkTree(x,z,h=2,cl=0x228B22){
    const g=new THREE.Group();
    const tk=new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.18,h*0.5,6),new THREE.MeshStandardMaterial({color:0x8B4513,roughness:0.9}));
    tk.position.y=h*0.25;tk.castShadow=true;g.add(tk);
    for(let i=0;i<3;i++){const lf=new THREE.Mesh(new THREE.ConeGeometry(0.8-i*0.15,h*0.4,7),new THREE.MeshStandardMaterial({color:cl,roughness:0.8}));lf.position.y=h*0.5+i*h*0.22;lf.castShadow=true;g.add(lf)}
    g.position.set(x,0.2,z);return g;
}
[[-5,1,1.8,0x2d8a4e],[-6,-2,1.4,0x1b7a3a],[5.5,0.5,2,0x38a169],[6,-3,1.2,0x2d6a4f],[-3,4,1.6,0x48bb78],[4,3.5,1.3,0x276749],[-4.5,-3.5,1.1,0x22763e],[3,-4,1.5,0x1a5c32]].forEach(t=>{const tr=mkTree(t[0],t[1],t[2],t[3]);ig.add(tr);trs.push(tr)});

// Flowers (small colored spheres on ground)
for(let i=0;i<20;i++){
    const fc=[0xff6b6b,0xfbbf24,0xec4899,0xa855f7,0x3b82f6,0x10b981][Math.floor(Math.random()*6)];
    const fm=new THREE.Mesh(new THREE.SphereGeometry(0.08,8,8),new THREE.MeshStandardMaterial({color:fc,emissive:fc,emissiveIntensity:0.4}));
    const a=Math.random()*Math.PI*2,r=2+Math.random()*5.5;
    fm.position.set(Math.cos(a)*r,0.25,Math.sin(a)*r);
    ig.add(fm);
}

// Platform
const pfm=new THREE.MeshStandardMaterial({color:0xffd700,roughness:0.3,metalness:0.6,emissive:0x443300,emissiveIntensity:0.3});
const pf=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2,0.3,32),pfm);
pf.position.set(0,0.35,0);pf.receiveShadow=true;ig.add(pf);

// Orbiting ring around platform
const orGeo=new THREE.TorusGeometry(2.5,0.03,16,64);
const orMat=new THREE.MeshStandardMaterial({color:0xffd700,emissive:0xffd700,emissiveIntensity:0.6,transparent:true,opacity:0.4});
const orMesh=new THREE.Mesh(orGeo,orMat);
orMesh.rotation.x=Math.PI/2;orMesh.position.y=0.5;ig.add(orMesh);

// Letter display group
const lg=new THREE.Group();lg.position.set(0,2.5,0);sc.add(lg);
let clm=null;

function mkSprite(text,sz=2.8,color='#FFD700'){
    const c=document.createElement('canvas');c.width=512;c.height=512;
    const x=c.getContext('2d');
    // Background glow
    const gr=x.createRadialGradient(256,256,0,256,256,220);
    gr.addColorStop(0,color+'66');gr.addColorStop(1,'transparent');
    x.fillStyle=gr;x.fillRect(0,0,512,512);
    // Letter
    x.font="bold 280px 'Baloo 2',Fredoka,sans-serif";x.textAlign='center';x.textBaseline='middle';
    x.shadowColor=color;x.shadowBlur=40;x.fillStyle=color;x.fillText(text,256,256);
    x.shadowBlur=0;x.fillStyle='#fff';x.fillText(text,256,256);
    const t=new THREE.CanvasTexture(c);t.needsUpdate=true;
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
    s.scale.set(sz,sz,1);return s;
}

function mkEmoji(emoji,sz=1.6){
    const c=document.createElement('canvas');c.width=256;c.height=256;
    const x=c.getContext('2d');x.font='180px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(emoji,128,140);
    const t=new THREE.CanvasTexture(c);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));
    s.scale.set(sz,sz,1);return s;
}

function setLetter(letter,emoji,color){
    while(lg.children.length)lg.remove(lg.children[0]);
    // Glow orb
    const ob=new THREE.Mesh(new THREE.SphereGeometry(1.3,32,32),new THREE.MeshStandardMaterial({color:new THREE.Color(color),transparent:true,opacity:0.12,emissive:new THREE.Color(color),emissiveIntensity:0.9}));
    lg.add(ob);
    // Orbiting rings
    for(let i=0;i<2;i++){
        const rg=new THREE.Mesh(new THREE.TorusGeometry(1.6+i*0.4,0.03,16,64),new THREE.MeshStandardMaterial({color:new THREE.Color(color),emissive:new THREE.Color(color),emissiveIntensity:1,transparent:true,opacity:0.5}));
        rg.rotation.x=Math.PI/2+i*0.4;lg.add(rg);
    }
    // Mini orbs orbiting
    const mos=[];
    for(let i=0;i<4;i++){
        const mo=new THREE.Mesh(new THREE.SphereGeometry(0.1,16,16),new THREE.MeshStandardMaterial({color:new THREE.Color(color),emissive:new THREE.Color(color),emissiveIntensity:1}));
        lg.add(mo);mos.push(mo);
    }
    const ls=mkSprite(letter,3,color);lg.add(ls);
    const es=mkEmoji(emoji,1.8);es.position.y=2.2;lg.add(es);
    clm={ob,ls,es,mos,rings:lg.children.filter(c=>c.geometry&&c.geometry.type==='TorusGeometry')};
}

// Gems
const gems=[];
function mkGem(x,y,z,c){
    const m=new THREE.Mesh(new THREE.OctahedronGeometry(0.25,0),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:0.5,roughness:0.2,metalness:0.8}));
    m.position.set(x,y,z);m.castShadow=true;sc.add(m);gems.push({m,by:y,sp:0.8+Math.random()*0.5,of:Math.random()*Math.PI*2});
}
mkGem(-3,2,2,0xff6b6b);mkGem(3.5,2.5,1,0x48bb78);mkGem(-2,3,-1,0xa855f7);mkGem(4,1.8,-2,0x3b82f6);mkGem(0,3.5,3,0xf59e0b);mkGem(-4.5,1.5,-1.5,0xec4899);mkGem(2,3.8,-1,0x06b6d4);mkGem(-1.5,2.8,4,0xfbbf24);

// Particles
const PC=300,pg=new THREE.BufferGeometry(),pp=new Float32Array(PC*3),pcl=new Float32Array(PC*3),psz=new Float32Array(PC),pv=[],plt=[];
for(let i=0;i<PC;i++){pp[i*3]=pp[i*3+1]=pp[i*3+2]=0;pcl[i*3]=pcl[i*3+1]=pcl[i*3+2]=1;psz[i]=0;pv.push({x:0,y:0,z:0});plt.push(0)}
pg.setAttribute('position',new THREE.BufferAttribute(pp,3));pg.setAttribute('color',new THREE.BufferAttribute(pcl,3));pg.setAttribute('size',new THREE.BufferAttribute(psz,1));
const pm=new THREE.PointsMaterial({size:0.35,vertexColors:true,transparent:true,opacity:0.9,sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false});
sc.add(new THREE.Points(pg,pm));
let pidx=0;

function emitP(count,orig,spd=10){
    const cs=[[1,0.84,0],[1,0.42,0.42],[0.66,0.33,0.96],[0.06,0.72,0.51],[0.23,0.51,0.96],[0.93,0.26,0.6],[0.06,0.71,0.83],[0.98,0.75,0.14]];
    for(let i=0;i<count;i++){
        const idx=pidx%PC,c=cs[Math.floor(Math.random()*cs.length)];
        pp[idx*3]=orig.x+(Math.random()-0.5)*0.5;pp[idx*3+1]=orig.y+(Math.random()-0.5)*0.5;pp[idx*3+2]=orig.z+(Math.random()-0.5)*0.5;
        pcl[idx*3]=c[0];pcl[idx*3+1]=c[1];pcl[idx*3+2]=c[2];
        psz[idx]=Math.random()*0.5+0.2;
        pv[idx]={x:(Math.random()-0.5)*spd,y:Math.random()*spd*0.8+spd*0.3,z:(Math.random()-0.5)*spd};
        plt[idx]=1;pidx++;
    }
}

function upP(dt){
    for(let i=0;i<PC;i++){if(plt[i]>0){plt[i]-=dt*0.7;pp[i*3]+=pv[i].x*dt;pp[i*3+1]+=pv[i].y*dt;pp[i*3+2]+=pv[i].z*dt;pv[i].y-=14*dt;psz[i]=Math.max(0,plt[i]*0.5)}else{psz[i]=0}}
    pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true;pg.attributes.size.needsUpdate=true;
}

// Resize
addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();R.setSize(innerWidth,innerHeight)});

// ═══════════════ UI LOGIC ═══════════════
const $=id=>document.getElementById(id);

function updHUD(){
    $('hs').textContent=S.stars;$('hsc').textContent=S.score;$('hc').textContent=S.combo+'x';
    $('hcw').style.display=S.combo>=2?'flex':'none';$('hg').textContent=G[S.gi].n;
    $('pb').style.width=(S.li/G[S.gi].l.length*100)+'%';
}

function showCb(c){
    const tx={2:'İyi! 🔥',3:'Süper! 🔥🔥',4:'Harika! 🔥🔥🔥',5:'MÜTHİŞ!! ⚡'};
    $('cp').textContent=tx[Math.min(c,5)]||'EFSANE!!! 💥';
    $('cp').className='sh';setTimeout(()=>$('cp').className='hd',800);setTimeout(()=>$('cp').className='',1200);
}

function genOpts(cor,gi,isSyl){
    let pool=[];
    for(let i=Math.max(0,gi-1);i<Math.min(G.length,gi+2);i++)
        G[i].l.forEach(l=>{if(isSyl){l.s.forEach(s=>{if(s!==cor)pool.push(s)})}else{if(l.t!==cor)pool.push(l.t)}});
    pool=[...new Set(pool)];pool.sort(()=>Math.random()-0.5);
    const o=pool.slice(0,3).concat(cor);o.sort(()=>Math.random()-0.5);return o;
}

function setupQ(){
    S.ans=false;
    const grp=G[S.gi],ld=grp.l[S.li],isSyl=S.mode==='syllable',cor=isSyl?ld.s[0]:ld.t;
    S.opts=genOpts(cor,S.gi,isSyl);
    setLetter(ld.t,ld.e,ld.c);updEnv(grp);
    $('qw').textContent=ld.e+' '+ld.w;
    $('qq').textContent=isSyl?`"${ld.w}" kelimesinin ilk hecesi hangisi?`:`"${ld.w}" kelimesinin ilk harfi hangisi?`;
    $('trow').innerHTML='';
    S.opts.forEach((o,i)=>{
        const d=document.createElement('div');d.className='tl';d.textContent=o;
        d.style.animation=`tok 0.4s ${i*0.08}s cubic-bezier(0.34,1.56,0.64,1) both`;
        d.addEventListener('click',()=>clickTile(o,cor,i,d));
        $('trow').appendChild(d);
    });
    $('mt').textContent=isSyl?'📝 Harf Modu':'🔤 Hece Modu';
    updHUD();
}

let shk={t:0,i:0};
function clickTile(sel,cor,idx,el){
    if(S.ans)return;ea();
    if(sel===cor){
        S.ans=true;el.classList.add('ok');S.tc++;S.combo++;S.mx=Math.max(S.mx,S.combo);
        const bonus=Math.min(S.combo*5,50);S.score+=10+bonus;
        if(S.tc%3===0)S.stars++;
        sfxOk();emitP(80,lg.position,12);
        if(S.combo>=2){showCb(S.combo);sfxCb()}
        updHUD();
        // Camera zoom on correct
        camTarget={x:0,y:3.5,z:10};
        setTimeout(()=>{camTarget={x:0,y:5,z:14};advQ()},900);
    }else{
        el.classList.add('no');sfxNo();S.combo=0;updHUD();shk={t:0.4,i:0.3};
        setTimeout(()=>el.classList.remove('no'),500);
    }
}

function advQ(){
    S.li++;
    if(S.li>=G[S.gi].l.length){showCeleb()}
    else{setupQ()}
}

function showCeleb(){
    sfxLv();S.sc='celeb';
    $('qp').classList.remove('on');$('mt').classList.remove('on');
    const grp=G[S.gi],isLast=S.gi>=G.length-1;
    $('cem').textContent=isLast?'🏆':'🎉';
    $('cet').textContent=isLast?'SEN BİR ŞAMPİYONSUN!':'Tebrikler!';
    $('ces').textContent=isLast?'Tüm harfleri öğrendin! Artık okumaya hazırsın! 📚':`${grp.n} tamamlandı! — ${grp.b}`;
    // Show learned letters
    $('clr').innerHTML='<div class="letters-row">'+grp.l.map(l=>`<div class="lr-item">${l.e} ${l.t}</div>`).join('')+'</div>';
    $('cst').innerHTML=`<div class="sb"><div class="si">⭐</div><div class="sv">${S.stars}</div><div class="sl">Yıldız</div></div><div class="sb"><div class="si">🏆</div><div class="sv">${S.score}</div><div class="sl">Puan</div></div><div class="sb"><div class="si">🔥</div><div class="sv">${S.mx}x</div><div class="sl">Kombo</div></div><div class="sb"><div class="si">✅</div><div class="sv">${S.tc}</div><div class="sl">Doğru</div></div>`;
    $('ceb').textContent=isLast?'🔄 Baştan Başla!':'🚀 Sonraki Grup!';
    $('cel').classList.add('on');
    emitP(150,{x:0,y:3,z:0},14);setTimeout(()=>emitP(100,{x:0,y:3,z:0},10),500);
}

$('ceb').addEventListener('click',()=>{
    ea();sfxCl();$('cel').classList.remove('on');
    if(S.gi>=G.length-1){S.gi=0;S.li=0;S.score=0;S.stars=0;S.combo=0;S.mx=0;S.tc=0}
    else{S.gi++;S.li=0}
    S.sc='game';$('qp').classList.add('on');$('mt').classList.add('on');setupQ();
});

// Env color transition
let tec=new THREE.Color(0x0a0a2e),tgc=new THREE.Color(0x2d6a4f);
function updEnv(grp){tec=new THREE.Color(grp.ec);tgc=new THREE.Color(grp.gc)}

// Mode toggle
$('mt').addEventListener('click',()=>{ea();sfxCl();S.mode=S.mode==='letter'?'syllable':'letter';setupQ()});

// Start
$('pbtn').addEventListener('click',()=>{
    ea();sfxCl();$('splash').classList.add('off');S.sc='game';
    setTimeout(()=>{$('hud').classList.add('on');$('pw').classList.add('on');$('qp').classList.add('on');$('mt').classList.add('on');setupQ()},600);
});

// Camera target for smooth transitions
let camTarget={x:0,y:5,z:14};

// ═══════════════ RENDER LOOP ═══════════════
const clk=new THREE.Clock();
function ani(){
    requestAnimationFrame(ani);
    const dt=Math.min(clk.getDelta(),0.05),t=clk.getElapsedTime();

    // Island float & slow rotate
    ig.position.y=Math.sin(t*0.3)*0.15;ig.rotation.y+=dt*0.015;

    // Orbiting ring
    orMesh.rotation.z=t*0.3;

    // Letter group
    if(clm){
        lg.position.y=2.5+Math.sin(t*1.2)*0.3;lg.rotation.y+=dt*0.5;
        clm.ob.scale.setScalar(1+Math.sin(t*2)*0.1);
        // Mini orbs orbit
        clm.mos.forEach((mo,i)=>{
            const a=t*1.5+i*(Math.PI*2/clm.mos.length);
            mo.position.set(Math.cos(a)*1.8,Math.sin(a*0.7)*0.5,Math.sin(a)*1.8);
        });
    }

    // Shake
    if(shk.t>0){shk.t-=dt;lg.position.x=(Math.random()-0.5)*shk.i;lg.position.z=(Math.random()-0.5)*shk.i}
    else{lg.position.x*=0.9;lg.position.z*=0.9}

    // Gems
    gems.forEach(g=>{g.m.position.y=g.by+Math.sin(t*g.sp+g.of)*0.4;g.m.rotation.x+=dt*0.5;g.m.rotation.z+=dt*0.3});

    // Star twinkle
    smat.opacity=0.5+Math.sin(t*0.5)*0.25;

    // Lights orbit
    pl1.position.x=Math.cos(t*0.3)*8;pl1.position.z=Math.sin(t*0.3)*8;
    pl2.position.x=Math.cos(t*0.4+2)*7;pl2.position.z=Math.sin(t*0.4+2)*7;
    pl3.position.x=Math.cos(t*0.25+4)*6;pl3.position.z=Math.sin(t*0.25+4)*6;
    pl3.position.y=3+Math.sin(t*0.6)*2;

    // Smooth env color
    sc.fog.color.lerp(tec,dt*2);imat.color.lerp(tgc,dt*2);R.setClearColor(sc.fog.color);

    // Smooth camera
    cam.position.x+=(camTarget.x+Math.sin(t*0.15)*0.5-cam.position.x)*dt*3;
    cam.position.y+=(camTarget.y+Math.sin(t*0.2)*0.3-cam.position.y)*dt*3;
    cam.position.z+=(camTarget.z-cam.position.z)*dt*3;
    cam.lookAt(0,1.5,0);

    // Trees sway
    trs.forEach((tr,i)=>{tr.rotation.z=Math.sin(t*0.5+i)*0.03});

    // Particles
    upP(dt);

    R.render(sc,cam);
}
ani();
</script>
</body>
</html>
"""

components.html(GAME_HTML, height=760, scrolling=False)
