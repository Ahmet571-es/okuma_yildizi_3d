# ======================================================================================
# ⭐ YILDIZ ÜLKESİ — Sinematik 3D Okuma Macerası (MEB Projesi)
# ======================================================================================
# pip install streamlit
# streamlit run app.py
# ======================================================================================

import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="Yıldız Ülkesi", page_icon="⭐", layout="wide", initial_sidebar_state="collapsed")

st.markdown("""<style>
#MainMenu,header,footer,[data-testid="stToolbar"],[data-testid="stDecoration"],
[data-testid="stStatusWidget"],.stDeployButton{display:none!important}
.stApp{background:#000!important}
section.main>div.block-container{padding:0!important;max-width:100%!important}
div[data-testid="stVerticalBlock"]{gap:0!important}
</style>""", unsafe_allow_html=True)

with st.sidebar:
    st.markdown("### ⚙️ Ayarlar")
    claude_key = st.text_input("Claude API Key (opsiyonel)", type="password",
                               help="AI maskot diyalogları ve hikaye modu için")
    st.markdown("---")
    st.markdown("API key olmadan da oyun tam çalışır.")

ck = claude_key or ""

GAME = r"""<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Fredoka:wght@300;400;500;600;700&family=Quicksand:wght@300;400;500;600;700&display=swap');
:root{--gold:#FFD700;--coral:#FF6B6B;--mint:#10B981;--sky:#3B82F6;--purple:#A855F7;--pink:#EC4899;--amber:#F59E0B;--teal:#06B6D4}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{width:100%;height:100%;overflow:hidden;font-family:'Fredoka',sans-serif;color:#fff}

/* FALLBACK BG when Three.js unavailable */
body{background:linear-gradient(135deg,#0a0a2e 0%,#1a1a4e 30%,#0f3460 60%,#0a2647 100%);background-size:400% 400%;animation:bgShift 15s ease infinite}
@keyframes bgShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

/* Stars fallback */
.stars-bg{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:twinkle var(--dur) ease-in-out infinite var(--del)}
@keyframes twinkle{0%,100%{opacity:0.2}50%{opacity:0.9}}

canvas#cv{position:fixed;inset:0;width:100%;height:100%;z-index:1}
#ui{position:fixed;inset:0;z-index:10;pointer-events:none;overflow:hidden}
#ui>*{pointer-events:auto}

/* CINEMATIC */
#cin{position:absolute;inset:0;z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;transition:opacity 1.2s}
#cin.off{opacity:0;pointer-events:none}
#cin-mascot{font-size:clamp(50px,12vw,100px);opacity:0;transition:all 0.8s;transform:scale(0.5)}
#cin-mascot.show{opacity:1;transform:scale(1)}
#cin-text{font-family:'Baloo 2',cursive;font-size:clamp(18px,3.5vw,32px);text-align:center;max-width:85%;line-height:1.7;opacity:0;transition:opacity 0.6s;color:rgba(255,255,255,0.85);text-shadow:0 0 30px rgba(255,215,0,0.2)}
#cin-text.show{opacity:1}
.cin-skip{position:absolute;bottom:16px;right:16px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:6px 18px;color:rgba(255,255,255,0.4);font-size:12px;cursor:pointer;transition:all 0.3s;backdrop-filter:blur(8px)}
.cin-skip:hover{background:rgba(255,255,255,0.15);color:#fff}

/* NAME */
#name-scr{position:absolute;inset:0;z-index:150;display:none;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse,rgba(20,40,80,0.9),rgba(10,10,46,0.95));transition:opacity 0.8s}
#name-scr.on{display:flex}#name-scr.off{opacity:0;pointer-events:none}
.nm-mascot{font-size:clamp(44px,9vw,80px);margin-bottom:6px;animation:bob 2s ease-in-out infinite}
.nm-title{font-family:'Baloo 2',cursive;font-size:clamp(20px,4.5vw,36px);font-weight:700;color:var(--gold);margin-bottom:4px;text-align:center}
.nm-sub{color:rgba(255,255,255,0.55);font-size:clamp(13px,2.5vw,18px);margin-bottom:20px;text-align:center}
#nm-input{background:rgba(255,255,255,0.07);border:2px solid rgba(255,255,255,0.18);border-radius:16px;padding:12px 22px;font-family:'Baloo 2',cursive;font-size:clamp(18px,4vw,28px);color:#fff;text-align:center;outline:none;width:min(80%,280px);transition:all 0.3s}
#nm-input:focus{border-color:var(--gold);box-shadow:0 0 20px rgba(255,215,0,0.15)}
#nm-input::placeholder{color:rgba(255,255,255,0.25)}
#nm-btn{margin-top:18px;background:linear-gradient(135deg,var(--mint),var(--sky));color:#fff;border:none;font-family:'Fredoka';font-size:clamp(16px,3vw,24px);font-weight:700;padding:12px 44px;border-radius:50px;cursor:pointer;opacity:0.3;pointer-events:none;transition:all 0.3s}
#nm-btn.ok{opacity:1;pointer-events:auto;animation:pls 2s ease-in-out infinite}

/* WORLD MAP */
#wmap{position:absolute;inset:0;z-index:100;display:none;flex-direction:column;align-items:center;background:radial-gradient(ellipse at 50% 30%,rgba(20,40,80,0.85),rgba(10,10,30,0.95));overflow-y:auto;padding:16px}
#wmap.on{display:flex}
.wm-t{font-family:'Baloo 2',cursive;font-size:clamp(26px,5.5vw,44px);font-weight:800;background:linear-gradient(135deg,var(--gold),var(--coral),var(--purple));background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:rbow 4s ease infinite;margin-bottom:2px}
.wm-pn{color:var(--gold);font-size:clamp(13px,2.5vw,17px);font-weight:700;margin-bottom:12px}
.wm-g{display:flex;flex-direction:column;gap:12px;width:100%;max-width:480px}
.wm-z{display:flex;align-items:center;gap:14px;padding:14px 18px;background:rgba(255,255,255,0.04);backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,0.07);border-radius:18px;cursor:pointer;transition:all 0.3s;position:relative}
.wm-z:hover{transform:translateX(5px);border-color:rgba(255,255,255,0.18);background:rgba(255,255,255,0.07)}
.wm-z.locked{opacity:0.3;pointer-events:none;filter:grayscale(0.5)}
.wm-z.cur{border-color:var(--gold);box-shadow:0 0 16px rgba(255,215,0,0.15)}
.wm-z.done{border-color:var(--mint);opacity:0.65}
.wm-ico{font-size:clamp(32px,6vw,48px);flex-shrink:0}
.wm-inf{flex:1}
.wm-zn{font-family:'Baloo 2',cursive;font-size:clamp(15px,2.8vw,20px);font-weight:700}
.wm-mn{color:rgba(255,255,255,0.5);font-size:clamp(11px,2vw,14px)}
.wm-zl{color:rgba(255,255,255,0.4);font-size:clamp(11px,1.8vw,13px);letter-spacing:3px;margin-top:2px}
.wm-pr{height:5px;background:rgba(255,255,255,0.08);border-radius:3px;margin-top:5px;overflow:hidden}
.wm-pb{height:100%;border-radius:3px;transition:width 0.5s}
.wm-bd{position:absolute;top:7px;right:10px;font-size:16px}

/* MASCOT DIALOGUE */
#mascot-dlg{position:absolute;inset:0;z-index:90;display:none;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse,rgba(10,20,45,0.92),rgba(5,5,20,0.97));transition:opacity 0.6s;padding:16px;text-align:center}
#mascot-dlg.on{display:flex}
.md-char{font-size:clamp(60px,14vw,110px);animation:bob 2.5s ease-in-out infinite;margin-bottom:6px}
.md-name{font-family:'Baloo 2',cursive;font-size:clamp(20px,4vw,32px);font-weight:800;margin-bottom:8px}
.md-bubble{background:rgba(255,255,255,0.07);backdrop-filter:blur(14px);border-radius:22px;padding:18px 24px;max-width:min(88%,440px);border:1px solid rgba(255,255,255,0.1);margin-bottom:16px}
.md-text{font-size:clamp(15px,2.8vw,22px);line-height:1.7;color:rgba(255,255,255,0.88)}
.md-text b{color:var(--gold)}
.md-letter{font-family:'Baloo 2',cursive;font-size:clamp(50px,12vw,90px);font-weight:800;margin-bottom:4px;filter:drop-shadow(0 0 20px currentColor)}
.md-word{font-size:clamp(26px,5vw,40px);margin-bottom:12px}
.md-btn{background:linear-gradient(135deg,var(--purple),var(--sky));color:#fff;border:none;font-family:'Fredoka';font-size:clamp(15px,2.8vw,20px);font-weight:700;padding:11px 36px;border-radius:50px;cursor:pointer;transition:transform 0.2s;box-shadow:0 0 20px rgba(168,85,247,0.3)}
.md-btn:hover{transform:scale(1.05)}
.typing-dots{display:inline-flex;gap:4px;align-items:center;height:20px}
.typing-dots span{width:7px;height:7px;background:var(--gold);border-radius:50%;animation:tdot 1.2s ease-in-out infinite}
.typing-dots span:nth-child(2){animation-delay:0.2s}.typing-dots span:nth-child(3){animation-delay:0.4s}

/* HUD */
#hud{position:absolute;top:0;left:0;width:100%;padding:8px 14px;display:none;align-items:center;justify-content:space-between;background:linear-gradient(180deg,rgba(0,0,0,0.6)0%,transparent 100%);flex-wrap:wrap;gap:5px;z-index:50}
#hud.on{display:flex}
.hi{display:flex;align-items:center;gap:4px;background:rgba(255,255,255,0.07);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:3px 10px}
.hic{font-size:15px}.hiv{font-size:13px;font-weight:700}
#pw{position:absolute;top:44px;left:50%;transform:translateX(-50%);width:min(88%,460px);height:8px;background:rgba(255,255,255,0.06);border-radius:5px;overflow:hidden;display:none;z-index:50}
#pw.on{display:block}
#pb{height:100%;width:0%;border-radius:5px;background:linear-gradient(90deg,var(--mint),var(--sky),var(--purple),var(--amber));background-size:300% 100%;animation:rbow 3s linear infinite;transition:width 0.6s cubic-bezier(0.34,1.56,0.64,1)}
#slbl{position:absolute;top:43px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.3);font-size:10px;font-weight:600;display:none;z-index:50;letter-spacing:2px;font-family:'Quicksand',sans-serif;white-space:nowrap}
#slbl.on{display:block}

/* STAGES */
.stage{position:absolute;bottom:0;left:0;width:100%;display:none;flex-direction:column;align-items:center;padding:0 14px 18px;z-index:40;background:linear-gradient(0deg,rgba(0,0,0,0.75)0%,rgba(0,0,0,0.3)60%,transparent 100%)}
.stage.on{display:flex}
.stg-full{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:40;padding:56px 14px 18px;text-align:center;background:linear-gradient(0deg,rgba(0,0,0,0.5)0%,transparent 40%,transparent 60%,rgba(0,0,0,0.3)100%)}
.stg-full.on{display:flex}
.meet-emoji{font-size:clamp(44px,10vw,75px);animation:bob 2.5s ease-in-out infinite;margin-bottom:4px}
.meet-letter{font-family:'Baloo 2',cursive;font-size:clamp(60px,16vw,140px);font-weight:800;filter:drop-shadow(0 0 30px currentColor);margin-bottom:2px}
.meet-word{font-family:'Baloo 2',cursive;font-size:clamp(26px,5vw,42px);font-weight:700;margin-bottom:2px}
.meet-sound{color:rgba(255,255,255,0.55);font-size:clamp(13px,2.2vw,18px);margin-bottom:14px}
.tiles{display:flex;gap:clamp(7px,1.8vw,13px);justify-content:center;flex-wrap:wrap}
.tile{min-width:clamp(55px,12vw,90px);padding:clamp(10px,2.2vw,18px) clamp(7px,1.5vw,14px);background:rgba(255,255,255,0.05);backdrop-filter:blur(12px);border:2px solid rgba(255,255,255,0.14);border-radius:16px;font-family:'Baloo 2',cursive;font-size:clamp(24px,5vw,40px);font-weight:800;text-align:center;cursor:pointer;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);user-select:none;box-shadow:0 3px 14px rgba(0,0,0,0.2)}
.tile:hover{transform:translateY(-4px) scale(1.04);border-color:rgba(255,255,255,0.35)}
.tile:active{transform:translateY(-1px) scale(0.97)}
.tile.ok{background:linear-gradient(135deg,var(--mint),#34D399)!important;border-color:var(--mint)!important;animation:tok 0.5s cubic-bezier(0.34,1.56,0.64,1)!important;box-shadow:0 0 24px rgba(16,185,129,0.4)!important}
.tile.no{animation:tno 0.5s ease!important}
.sm-round{color:rgba(255,255,255,0.3);font-size:11px;margin-top:8px;font-family:'Quicksand'}
.build-target{font-family:'Baloo 2',cursive;font-size:clamp(28px,6vw,48px);font-weight:800;color:var(--gold);letter-spacing:4px;min-height:clamp(36px,7vw,52px);margin-bottom:8px}
.build-hint{color:rgba(255,255,255,0.35);font-size:clamp(12px,2vw,15px);margin-bottom:12px}
.read-syls{display:flex;gap:clamp(6px,1.5vw,10px);justify-content:center;flex-wrap:wrap;margin-bottom:10px}
.syl{padding:clamp(7px,1.5vw,12px) clamp(10px,2.5vw,18px);background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.1);border-radius:12px;font-family:'Baloo 2',cursive;font-size:clamp(20px,4.5vw,32px);font-weight:800;cursor:pointer;transition:all 0.2s;user-select:none}
.syl:hover{transform:scale(1.04);border-color:rgba(255,255,255,0.25)}
.syl.lit{background:linear-gradient(135deg,var(--gold),var(--amber));color:#000;border-color:var(--gold);box-shadow:0 0 16px rgba(255,215,0,0.3)}
.syl.done{opacity:0.3;pointer-events:none}
.mg-cards{display:flex;gap:clamp(8px,2vw,14px);justify-content:center;flex-wrap:wrap}
.mg-card{display:flex;flex-direction:column;align-items:center;gap:4px;padding:clamp(10px,2vw,16px);background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.12);border-radius:16px;cursor:pointer;transition:all 0.25s;min-width:clamp(70px,16vw,110px)}
.mg-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,0.3)}
.mg-card .mg-emoji{font-size:clamp(28px,6vw,44px)}
.mg-card .mg-word{font-family:'Baloo 2',cursive;font-size:clamp(14px,2.5vw,20px);font-weight:700}
.mg-card.ok{background:linear-gradient(135deg,var(--mint),#34D399)!important;border-color:var(--mint)!important;animation:tok 0.5s!important}
.mg-card.no{animation:tno 0.5s!important}
.prompt{font-family:'Baloo 2',cursive;font-size:clamp(22px,4.5vw,36px);font-weight:700;margin-bottom:3px;text-shadow:0 3px 16px rgba(0,0,0,0.4)}
.subprompt{color:rgba(255,255,255,0.6);font-size:clamp(12px,2.2vw,17px);margin-bottom:12px;text-align:center}
.gbtn{color:#fff;border:none;font-family:'Fredoka';font-size:clamp(14px,2.5vw,20px);font-weight:700;padding:10px 34px;border-radius:50px;cursor:pointer;transition:transform 0.2s}
.gbtn:hover{transform:scale(1.05)}
.gbtn.gold{background:linear-gradient(135deg,var(--gold),var(--amber));color:#000;box-shadow:0 0 20px rgba(255,215,0,0.3)}
.gbtn.purple{background:linear-gradient(135deg,var(--purple),var(--sky));box-shadow:0 0 20px rgba(168,85,247,0.3)}
.gbtn.green{background:linear-gradient(135deg,var(--mint),var(--teal));box-shadow:0 0 20px rgba(16,185,129,0.3)}
#celeb{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;z-index:80;text-align:center;background:radial-gradient(ellipse,rgba(0,0,0,0.55),rgba(0,0,0,0.88));overflow-y:auto;padding:16px}
#celeb.on{display:flex}
.cel-e{font-size:clamp(48px,11vw,90px);animation:cb 1s ease infinite}
.cel-t{font-family:'Baloo 2',cursive;font-size:clamp(24px,5vw,44px);font-weight:800;background:linear-gradient(135deg,var(--gold),var(--coral),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:6px 0 3px}
.cel-s{color:rgba(255,255,255,0.6);font-size:clamp(13px,2.2vw,18px);margin-bottom:12px}
.cel-stats{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;background:rgba(255,255,255,0.05);backdrop-filter:blur(10px);border-radius:18px;padding:14px 22px;border:1px solid rgba(255,255,255,0.08);margin-bottom:6px}
.sb{text-align:center}.si{font-size:22px}.sv{color:var(--gold);font-size:20px;font-weight:800}.slab{color:rgba(255,255,255,0.4);font-size:9px}
.lr{display:flex;gap:5px;justify-content:center;flex-wrap:wrap;margin:10px 0}
.lri{background:rgba(255,255,255,0.07);border-radius:10px;padding:3px 10px;font-family:'Baloo 2',cursive;font-size:16px;font-weight:800;color:var(--gold);border:1px solid rgba(255,215,0,0.15)}
#combo{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);font-family:'Baloo 2',cursive;font-size:clamp(30px,7vw,60px);font-weight:800;color:var(--gold);text-shadow:0 0 36px rgba(255,215,0,0.5);pointer-events:none;z-index:55;opacity:0;transition:all 0.4s cubic-bezier(0.34,1.56,0.64,1)}
#combo.sh{transform:translate(-50%,-50%) scale(1);opacity:1}
#combo.hd{transform:translate(-50%,-80%) scale(0.5);opacity:0}
#story{position:absolute;inset:0;z-index:85;display:none;flex-direction:column;align-items:center;justify-content:center;padding:16px;background:radial-gradient(ellipse,rgba(15,25,50,0.95),rgba(5,5,20,0.98));text-align:center}
#story.on{display:flex}
.st-mascot{font-size:clamp(36px,8vw,56px);margin-bottom:6px}
.st-title{font-family:'Baloo 2',cursive;font-size:clamp(20px,4vw,32px);font-weight:800;color:var(--gold);margin-bottom:12px}
.st-card{background:rgba(255,255,255,0.05);backdrop-filter:blur(12px);border-radius:22px;padding:20px 24px;max-width:min(88%,480px);border:1px solid rgba(255,255,255,0.08);margin-bottom:16px}
.st-text{font-family:'Baloo 2',cursive;font-size:clamp(18px,3.5vw,28px);font-weight:600;line-height:1.8;color:rgba(255,255,255,0.88)}

@keyframes rbow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes pls{0%,100%{box-shadow:0 0 24px rgba(16,185,129,0.3)}50%{box-shadow:0 0 40px rgba(16,185,129,0.6)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes slideUp{0%{transform:translateY(25px);opacity:0}100%{transform:translateY(0);opacity:1}}
@keyframes tok{0%{transform:scale(1)}40%{transform:scale(1.12) rotate(3deg)}70%{transform:scale(0.96)}100%{transform:scale(1)}}
@keyframes tno{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px) rotate(-2deg)}30%{transform:translateX(8px) rotate(2deg)}45%{transform:translateX(-5px)}60%{transform:translateX(5px)}}
@keyframes cb{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.06)}}
@keyframes tdot{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.1)}}
@keyframes confDrop{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
</style></head><body>

<!-- Fallback animated stars background (CSS only, always works) -->
<div class="stars-bg" id="stars-bg"></div>
<canvas id="cv"></canvas>

<div id="ui">
<div id="cin"><div id="cin-mascot"></div><div id="cin-text"></div><div class="cin-skip" id="cin-skip">Atla ▸</div></div>
<div id="name-scr"><div class="nm-mascot">⭐</div><div class="nm-title">Seni tanıyabilir miyim?</div><div class="nm-sub">Adını yaz, maceraya başlayalım!</div><input id="nm-input" type="text" placeholder="Adın..." maxlength="15" autocomplete="off"><button id="nm-btn">🚀 Başlayalım!</button></div>
<div id="wmap"><div class="wm-t">Yıldız Ülkesi</div><div class="wm-pn" id="wm-pn"></div><div class="wm-g" id="wm-g"></div></div>
<div id="mascot-dlg"><div class="md-char" id="md-char"></div><div class="md-name" id="md-name"></div><div class="md-letter" id="md-letter"></div><div class="md-word" id="md-word"></div><div class="md-bubble"><div class="md-text" id="md-text"></div></div><button class="md-btn" id="md-btn">Hazırım! ✨</button></div>
<div id="hud"><div class="hi"><span class="hic">⭐</span><span class="hiv" id="h-s">0</span></div><div class="hi"><span class="hic">🏆</span><span class="hiv" id="h-sc">0</span></div><div class="hi" id="h-cw" style="display:none"><span class="hic">🔥</span><span class="hiv" id="h-c">0</span></div><div class="hi"><span class="hic">📖</span><span class="hiv" id="h-g"></span></div></div>
<div id="pw"><div id="pb"></div></div><div id="slbl"></div>
<div id="s-meet" class="stg-full"></div>
<div id="s-match" class="stage"></div>
<div id="s-build" class="stage"></div>
<div id="s-read" class="stage"></div>
<div id="s-mini" class="stage"></div>
<div id="celeb"></div>
<div id="combo"></div>
<div id="story"><div class="st-mascot" id="st-m"></div><div class="st-title">📖 Hikaye Zamanı!</div><div class="st-card"><div class="st-text" id="st-text"></div></div><button class="gbtn green" id="st-btn">Devam Et ▸</button></div>
</div>

<!-- GAME LOGIC FIRST (no dependency on Three.js) -->
<script>
const CK="__CK__";
let has3D=false;

// Generate CSS star particles as fallback
(function(){const bg=document.getElementById('stars-bg');for(let i=0;i<80;i++){const s=document.createElement('div');s.className='star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.setProperty('--dur',(2+Math.random()*3)+'s');s.style.setProperty('--del',Math.random()*3+'s');bg.appendChild(s)}})();

// ═══════════ CURRICULUM ═══════════
const MASCOTS=[
{name:"Aslan Leo",icon:"🦁",pers:"cesur ve enerjik",greet:"Kükreee! Ben Aslan Leo!",color:"#F59E0B"},
{name:"Baykuş Bilge",icon:"🦉",pers:"bilge ve sakin",greet:"Huuu! Ben Baykuş Bilge!",color:"#A855F7"},
{name:"Yunus Duru",icon:"🐬",pers:"neşeli ve oyuncu",greet:"Şıp şıp! Ben Yunus Duru!",color:"#06B6D4"},
{name:"Deve Doruk",icon:"🐪",pers:"sabırlı ve esprili",greet:"Hörgüçlerim selamlar! Ben Deve Doruk!",color:"#F97316"},
{name:"Tavşan Zıpzıp",icon:"🐰",pers:"hızlı ve meraklı",greet:"Zıp zıp! Ben Tavşan Zıpzıp!",color:"#EC4899"}
];
const GR=[
{id:1,n:"Yeşil Orman",icon:"🌳",mi:0,ec:0x0a2e1a,gc:0x2d6a4f,cl:["#22c55e","#16a34a"],
 l:[{t:"E",w:"Elma",e:"🍎",s:["El","ma"],c:"#FF6B6B",snd:"E sesi: Eeee! Ağzını aç.",ws:["El","Ele","Ek"]},{t:"L",w:"Lale",e:"🌷",s:["La","le"],c:"#E84393",snd:"L sesi: Llll! Dilin damağa değer.",ws:["Al","Lale"]},{t:"A",w:"Arı",e:"🐝",s:["A","rı"],c:"#FDCB6E",snd:"A sesi: Aaaa! En kolay ses!",ws:["Al","Ala","Ela"]},{t:"K",w:"Kedi",e:"🐱",s:["Ke","di"],c:"#A855F7",snd:"K sesi: Kkk! Boğazından gelir.",ws:["Kel","Kale","Ak"]},{t:"İ",w:"İnek",e:"🐄",s:["İ","nek"],c:"#10B981",snd:"İ sesi: İiii! Gülümser gibi.",ws:["İl","İlk","Kil"]},{t:"N",w:"Nar",e:"🍎",s:["N","ar"],c:"#F97316",snd:"N sesi: Nnnn! Burnundan hisset.",ws:["An","İn","Nal"]}]},
{id:2,n:"Mor Gökyüzü",icon:"🌌",mi:1,ec:0x2d1b4e,gc:0x4a1d8e,cl:["#a855f7","#7c3aed"],
 l:[{t:"O",w:"Okul",e:"🏫",s:["O","kul"],c:"#3B82F6",snd:"O sesi: Oooo!",ws:["Ok","On","Kol"]},{t:"M",w:"Masa",e:"🪑",s:["Ma","sa"],c:"#EC4899",snd:"M sesi: Mmmm!",ws:["Ma","Mal"]},{t:"U",w:"Uçak",e:"✈️",s:["U","çak"],c:"#06B6D4",snd:"U sesi: Uuuu!",ws:["Un","Kum"]},{t:"T",w:"Top",e:"⚽",s:["T","op"],c:"#10B981",snd:"T sesi: Ttt!",ws:["At","Ot","Tut"]},{t:"Ü",w:"Üzüm",e:"🍇",s:["Ü","züm"],c:"#8B5CF6",snd:"Ü sesi: Üüüü!",ws:["Ün","Üç"]},{t:"Y",w:"Yıldız",e:"⭐",s:["Yıl","dız"],c:"#EAB308",snd:"Y sesi: Yyy!",ws:["Yol","Yük"]}]},
{id:3,n:"Mavi Okyanus",icon:"🌊",mi:2,ec:0x0c2d48,gc:0x0e4a6e,cl:["#0ea5e9","#0284c7"],
 l:[{t:"S",w:"Su",e:"💧",s:["S","u"],c:"#0EA5E9",snd:"S sesi: Ssss!",ws:["Su","Sal","Ses"]},{t:"D",w:"Dağ",e:"⛰️",s:["D","ağ"],c:"#6B7280",snd:"D sesi: Ddd!",ws:["Dal","Dil","Ad"]},{t:"Ö",w:"Ördek",e:"🦆",s:["Ör","dek"],c:"#F97316",snd:"Ö sesi: Öööö!",ws:["Ön","Öl"]},{t:"R",w:"Robot",e:"🤖",s:["Ro","bot"],c:"#9CA3AF",snd:"R sesi: Rrrr!",ws:["Ör","Ar"]},{t:"I",w:"Irmak",e:"🏞️",s:["Ir","mak"],c:"#14B8A6",snd:"I sesi: Iiii!",ws:["Sır","Kır"]},{t:"B",w:"Balık",e:"🐟",s:["Ba","lık"],c:"#2563EB",snd:"B sesi: Bbb!",ws:["Bal","Bol","Bin"]}]},
{id:4,n:"Turuncu Çöl",icon:"🏜️",mi:3,ec:0x3b1020,gc:0x7c2d12,cl:["#f97316","#ea580c"],
 l:[{t:"Z",w:"Zürafa",e:"🦒",s:["Zü","ra","fa"],c:"#EAB308",snd:"Z sesi: Zzzz!",ws:["Az","Yüz"]},{t:"Ç",w:"Çiçek",e:"🌸",s:["Çi","çek"],c:"#EC4899",snd:"Ç sesi: Çç!",ws:["Aç","İç","Üç"]},{t:"Ş",w:"Şapka",e:"🎩",s:["Şap","ka"],c:"#64748B",snd:"Ş sesi: Şşş!",ws:["Aş","Taş"]},{t:"G",w:"Göz",e:"👁️",s:["G","öz"],c:"#10B981",snd:"G sesi: Ggg!",ws:["Göl","Gül"]},{t:"C",w:"Cam",e:"🪟",s:["C","am"],c:"#60A5FA",snd:"C sesi: Ccc!",ws:["Can"]},{t:"P",w:"Pasta",e:"🎂",s:["Pas","ta"],c:"#DB2777",snd:"P sesi: Ppp!",ws:["Pul","Kap"]}]},
{id:5,n:"Altın Uzay",icon:"🚀",mi:4,ec:0x1a1a2e,gc:0x16213e,cl:["#eab308","#ca8a04"],
 l:[{t:"H",w:"Hayvan",e:"🐾",s:["Hay","van"],c:"#8B5CF6",snd:"H sesi: Hhh!",ws:["Han","Ah"]},{t:"F",w:"Fil",e:"🐘",s:["F","il"],c:"#6B7280",snd:"F sesi: Fff!",ws:["Fil","Af"]},{t:"V",w:"Vazo",e:"🏺",s:["Va","zo"],c:"#F97316",snd:"V sesi: Vvv!",ws:["Van","Var"]},{t:"Ğ",w:"Dağ",e:"🏔️",s:["Da","ğ"],c:"#34D399",snd:"Ğ sesi: Yumuşak!",ws:["Dağ","Bağ"]},{t:"J",w:"Jeton",e:"🪙",s:["Je","ton"],c:"#FBBF24",snd:"J sesi: Jjj!",ws:["Jet","Jel"]}]}
];

// ═══════════ STATE ═══════════
const S={name:"",gi:0,li:0,stg:0,mr:0,score:0,stars:0,combo:0,mx:0,tc:0,gc:[],ld:[],buf:"",ri:0};

// ═══════════ AUDIO ═══════════
let ac=null;function ea(){if(!ac)try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
function tn(f,d,tp,v){try{ea();if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type=tp||'sine';o.frequency.setValueAtTime(f,ac.currentTime);g.gain.setValueAtTime(v||0.1,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
function sfxOk(){tn(523,.1);setTimeout(()=>tn(659,.1),70);setTimeout(()=>tn(784,.12),140);setTimeout(()=>tn(1047,.2,undefined,.08),220)}
function sfxNo(){tn(200,.22,'triangle',.08)}
function sfxCb(){tn(784,.06);setTimeout(()=>tn(988,.06),45);setTimeout(()=>tn(1175,.06),90);setTimeout(()=>tn(1318,.15,undefined,.08),135)}
function sfxLv(){[523,659,784,1047,1318].forEach((f,i)=>setTimeout(()=>tn(f,.15),i*80))}
function sfxCl(){tn(880,.04,undefined,.06)}
function sfxMg(){tn(1047,.25);setTimeout(()=>tn(1319,.25),90);setTimeout(()=>tn(1568,.3,undefined,.06),180)}
function speakL(l){ea();const vf={E:350,A:300,I:270,İ:380,O:320,U:290,Ü:360,Ö:340};const f=vf[l];if(f)tn(f,.45,'sine',.12);else tn(180+Math.random()*100,.12,'square',.06)}

// ═══════════ CLAUDE API ═══════════
async function aiChat(prompt){
    if(!CK)return null;
    try{const m=MASCOTS[GR[S.gi].mi];
    const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":CK,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:250,
            messages:[{role:"user",content:prompt}],
            system:`Sen "${m.name}" adında ${m.pers} bir hayvan maskotusun. 5 yaşındaki çocuklara Türkçe okuma öğretiyorsun. Çok kısa (2-3 cümle), basit, neşeli, cesaretlendirici konuş. Emoji kullan. Çocuğun adı: ${S.name}`})});
    const d=await r.json();return d.content?.[0]?.text||null}catch(e){return null}}

// ═══════════ DOM ═══════════
const $=id=>document.getElementById(id);
function show(id){$(id).classList.add('on')}
function hide(id){$(id).classList.remove('on')}
function hideAll(){['hud','pw','slbl','s-meet','s-match','s-build','s-read','s-mini','celeb','wmap','mascot-dlg','name-scr','story'].forEach(hide)}
function confetti(n){n=n||25;let h='';for(let i=0;i<n;i++){const l=~~(Math.random()*100),d=(Math.random()*.8).toFixed(2),c=['#FF6B6B','#FFEAA7','#55EFC4','#74B9FF','#A29BFE','#FD79A8','#FDCB6E'][~~(Math.random()*7)],sz=6+~~(Math.random()*8);h+='<div style="position:fixed;top:-10px;left:'+l+'%;width:'+sz+'px;height:'+sz+'px;background:'+c+';border-radius:'+(Math.random()>.5?'50%':'2px')+';animation:confDrop '+(2+Math.random()*2).toFixed(1)+'s ease-out '+d+'s forwards;z-index:9999;pointer-events:none"></div>'}document.body.insertAdjacentHTML('beforeend',h);setTimeout(function(){document.querySelectorAll('[style*="confDrop"]').forEach(function(e){e.remove()})},5000)}
function updHUD(){$('h-s').textContent=S.stars;$('h-sc').textContent=S.score;$('h-c').textContent=S.combo+'x';$('h-cw').style.display=S.combo>=2?'flex':'none';$('h-g').textContent=GR[S.gi].n;var g=GR[S.gi];$('pb').style.width=((S.li+S.stg/5)/g.l.length*100)+'%'}
function showCb(c){var t={2:'İyi! 🔥',3:'Süper! 🔥🔥',4:'Harika! 🔥🔥🔥',5:'MÜTHİŞ!! ⚡'};$('combo').textContent=t[Math.min(c,5)]||'EFSANE!!! 💥';$('combo').className='sh';setTimeout(function(){$('combo').className='hd'},700);setTimeout(function(){$('combo').className=''},1100)}
function correct(){S.tc++;S.combo++;S.mx=Math.max(S.mx,S.combo);S.score+=10+Math.min(S.combo*5,50);if(S.tc%3===0)S.stars++;if(S.combo>=2){showCb(S.combo);sfxCb()}sfxOk();updHUD();if(has3D)try{emP(50,lg.position,10)}catch(e){}}
function wrong(el){el.classList.add('no');sfxNo();S.combo=0;updHUD();setTimeout(function(){el.classList.remove('no')},450)}

// ═══════════ CINEMATIC ═══════════
var cinS=[{t:"",m:"",d:400},{t:"Çok çok uzaklarda...",m:"",d:2200},{t:"Yıldızların arasında büyülü bir ülke varmış...",m:"",d:2800},{t:"",m:"⭐",d:1200},{t:"Orada harfler canlıymış ve her birinin kendi sesi varmış...",m:"⭐",d:3000},{t:"Ama bir gün harfler kaybolmuş!",m:"",d:2500},{t:"Onları bulmak için cesur hayvan dostlarımız yardıma gelmiş...",m:"",d:2800},{t:"",m:"🦁🦉🐬🐪🐰",d:2000},{t:"Şimdi sıra sende!",m:"⭐",d:2500}];
var cinI=0;
function runCin(){if(cinI>=cinS.length){endCin();return}var s=cinS[cinI];$('cin-text').className='';$('cin-mascot').className='';setTimeout(function(){$('cin-text').textContent=s.t;$('cin-mascot').textContent=s.m;if(s.t)$('cin-text').className='show';if(s.m)$('cin-mascot').className='show';cinI++;setTimeout(runCin,s.d)},400)}
function endCin(){$('cin').classList.add('off');setTimeout(function(){$('cin').style.display='none';show('name-scr');sfxMg()},1200)}
$('cin-skip').onclick=function(){cinI=cinS.length;endCin()};
setTimeout(runCin,600);

// ═══════════ NAME ═══════════
$('nm-input').oninput=function(e){$('nm-btn').classList.toggle('ok',e.target.value.trim().length>0)};
$('nm-btn').onclick=function(){var n=$('nm-input').value.trim();if(!n)return;S.name=n;sfxLv();hide('name-scr');$('name-scr').classList.add('off');setTimeout(showWM,700)};

// ═══════════ WORLD MAP ═══════════
function showWM(){
    hideAll();$('wm-pn').textContent='🌟 '+S.name;
    var g=$('wm-g');g.innerHTML='';
    GR.forEach(function(gr,gi){
        var done=S.gc.indexOf(gi)>=0,nextIdx=S.gc.length?S.gc[S.gc.length-1]+1:0,cur=gi===nextIdx&&!done,locked=gi>0&&S.gc.indexOf(gi-1)<0&&gi!==nextIdx;
        var m=MASCOTS[gr.mi],ld=gr.l.filter(function(l){return S.ld.indexOf(l.t)>=0}).length,pct=(ld/gr.l.length)*100;
        var z=document.createElement('div');z.className='wm-z'+(locked?' locked':'')+(cur?' cur':'')+(done?' done':'');
        z.innerHTML='<div class="wm-ico">'+gr.icon+'</div><div class="wm-inf"><div class="wm-zn">'+gr.n+'</div><div class="wm-mn">'+m.icon+' '+m.name+'</div><div class="wm-zl">'+gr.l.map(function(l){return l.t}).join(' ')+'</div><div class="wm-pr"><div class="wm-pb" style="width:'+pct+'%;background:linear-gradient(90deg,'+gr.cl[0]+','+gr.cl[1]+')"></div></div></div><div class="wm-bd">'+(done?'✅':locked?'🔒':gr.icon)+'</div>';
        if(!locked)(function(idx){z.onclick=function(){sfxCl();S.gi=idx;S.li=done?0:ld;if(S.li>=gr.l.length)S.li=0;hide('wmap');showMascotIntro()}})(gi);
        g.appendChild(z);
    });show('wmap')}

// ═══════════ MASCOT INTRO ═══════════
function showMascotIntro(){
    hideAll();var g=GR[S.gi],l=g.l[S.li],m=MASCOTS[g.mi];
    if(has3D)try{setEnv(g);set3D(l.t,l.e,l.c)}catch(e){}
    $('md-char').textContent=m.icon;$('md-name').textContent=m.name;$('md-name').style.color=m.color;
    $('md-letter').textContent=l.e+' '+l.t;$('md-letter').style.color=l.c;$('md-word').textContent=l.w;
    $('md-text').innerHTML='<div class="typing-dots"><span></span><span></span><span></span></div>';
    show('mascot-dlg');speakL(l.t);
    aiChat('Şimdi "'+l.t+'" harfini öğreteceğiz. Kelime: "'+l.w+'" ('+l.e+'). '+l.snd+' Çocuğu heyecanlandır.').then(function(aiMsg){
        var fallback=m.greet+' Bugün <b>'+l.t+'</b> harfini öğreneceğiz! '+l.e+' <b>'+l.w+'</b>... '+l.snd+' Hazır mısın? ✨';
        $('md-text').innerHTML=aiMsg||fallback});
    $('md-btn').onclick=function(){sfxCl();hide('mascot-dlg');startStg(0)}}

// ═══════════ STAGES ═══════════
function startStg(n){S.stg=n;S.mr=0;S.buf="";S.ri=0;hideAll();show('hud');show('pw');show('slbl');updHUD();
var labels=["1/5 — Tanış","2/5 — Bul","3/5 — Hece Yap","4/5 — Oku","5/5 — Mini Oyun"];$('slbl').textContent=labels[n]||"";
[showMeet,showMatch,showBuild,showRead,showMini][n]()}

function showMeet(){var g=GR[S.gi],l=g.l[S.li];
if(has3D)try{set3D(l.t,l.e,l.c)}catch(e){}
$('s-meet').innerHTML='<div class="meet-emoji">'+l.e+'</div><div class="meet-letter" style="color:'+l.c+'">'+l.t+'</div><div class="meet-word">'+l.w+'</div><div class="meet-sound">'+l.snd+'</div><button class="gbtn gold" id="meet-go">Sesi Duydum! Devam ▸</button>';
show('s-meet');speakL(l.t);
document.getElementById('meet-go').onclick=function(){sfxCl();hide('s-meet');startStg(1)}}

function showMatch(){var g=GR[S.gi],l=g.l[S.li],cor=l.t;
if(has3D)try{set3D(l.t,l.e,l.c)}catch(e){}
var pool=[];for(var gi=Math.max(0,S.gi-1);gi<Math.min(GR.length,S.gi+2);gi++)GR[gi].l.forEach(function(x){if(x.t!==cor)pool.push(x.t)});
pool=[].concat(new Set(pool));pool.sort(function(){return Math.random()-.5});var opts=pool.slice(0,3).concat(cor).sort(function(){return Math.random()-.5});
$('s-match').innerHTML='<div class="prompt">'+l.e+' '+l.w+'</div><div class="subprompt">"'+l.w+'" kelimesinin ilk harfi hangisi?</div><div class="tiles" id="mt">'+opts.map(function(o,i){return '<div class="tile" style="animation:slideUp .4s '+i*.06+'s both" data-v="'+o+'">'+o+'</div>'}).join('')+'</div><div class="sm-round">'+(S.mr+1)+'/3</div>';
show('s-match');
document.querySelectorAll('#mt .tile').forEach(function(t){t.onclick=function(){if(t.classList.contains('ok'))return;ea();
if(t.dataset.v===cor){t.classList.add('ok');correct();setTimeout(function(){hide('s-match');S.mr++;S.mr>=3?startStg(2):showMatch()},650)}else wrong(t)}})}

function showBuild(){var g=GR[S.gi],l=g.l[S.li];
if(has3D)try{set3D(l.t,l.e,l.c)}catch(e){}
var target=l.s.join(''),syls=[].concat(l.s);var extra=S.ld.filter(function(x){return x!==l.t}).slice(-2);extra.forEach(function(e){syls.push(e)});syls.sort(function(){return Math.random()-.5});S.buf="";
$('s-build').innerHTML='<div class="prompt">'+l.e+' Heceleri Birleştir!</div><div class="build-target" id="bt">_</div><div class="build-hint">'+l.e+' '+l.w+' → '+l.s.join(' + ')+'</div><div class="tiles" id="bl">'+syls.map(function(s){return '<div class="tile" data-v="'+s+'">'+s+'</div>'}).join('')+'</div>';
show('s-build');
document.querySelectorAll('#bl .tile').forEach(function(b){b.onclick=function(){if(b.style.opacity==='0.2')return;ea();sfxCl();b.style.background='var(--sky)';b.style.borderColor='var(--sky)';
S.buf+=b.dataset.v;$('bt').textContent=S.buf||'_';
if(S.buf===target){correct();$('bt').style.color='var(--mint)';confetti(15);setTimeout(function(){hide('s-build');startStg(3)},800)}
else if(target.indexOf(S.buf)!==0){sfxNo();S.combo=0;updHUD();setTimeout(function(){S.buf="";$('bt').textContent='_';$('bt').style.color='';document.querySelectorAll('#bl .tile').forEach(function(x){x.style.background='';x.style.borderColor=''})},350)}}})}

function showRead(){var g=GR[S.gi],l=g.l[S.li];
if(has3D)try{set3D(l.t,l.e,l.c)}catch(e){}
S.ri=0;var sh=[].concat(l.s).sort(function(){return Math.random()-.5});
$('s-read').innerHTML='<div style="color:rgba(255,255,255,.4);font-size:12px;margin-bottom:6px">Hecelere sırayla dokun ve oku!</div><div class="prompt">'+l.e+' '+l.w+'</div><div class="read-syls" id="rs">'+sh.map(function(s){return '<div class="syl" data-v="'+s+'">'+s+'</div>'}).join('')+'</div>';
show('s-read');
document.querySelectorAll('#rs .syl').forEach(function(b){b.onclick=function(){if(b.classList.contains('done'))return;ea();
if(b.dataset.v===l.s[S.ri]){b.classList.add('lit');sfxCl();speakL(b.dataset.v[0]);S.ri++;setTimeout(function(){b.classList.replace('lit','done')},250);
if(S.ri>=l.s.length){correct();confetti(12);setTimeout(function(){hide('s-read');startStg(4)},800)}}else wrong(b)}})}

function showMini(){var g=GR[S.gi],l=g.l[S.li],m=MASCOTS[g.mi];
if(has3D)try{set3D(l.t,l.e,l.c)}catch(e){}
var corW={w:l.w,e:l.e},others=[];GR.forEach(function(gr){gr.l.forEach(function(x){if(x.t!==l.t)others.push({w:x.w,e:x.e})})});
others.sort(function(){return Math.random()-.5});var cards=[corW].concat(others.slice(0,3)).sort(function(){return Math.random()-.5});
$('s-mini').innerHTML='<div class="prompt">Hangi kelime "'+l.t+'" ile başlar?</div><div class="subprompt">'+m.icon+' '+m.name+' soruyor!</div><div class="mg-cards" id="mc">'+cards.map(function(c){return '<div class="mg-card" data-w="'+c.w+'"><div class="mg-emoji">'+c.e+'</div><div class="mg-word">'+c.w+'</div></div>'}).join('')+'</div>';
show('s-mini');
document.querySelectorAll('#mc .mg-card').forEach(function(c){c.onclick=function(){if(c.classList.contains('ok'))return;ea();
if(c.dataset.w===l.w){c.classList.add('ok');correct();confetti(20);setTimeout(function(){hide('s-mini');letterDone()},800)}else wrong(c)}})}

function letterDone(){var g=GR[S.gi],l=g.l[S.li];if(S.ld.indexOf(l.t)<0)S.ld.push(l.t);S.li++;S.li>=g.l.length?groupDone():showMascotIntro()}

function groupDone(){
    hideAll();sfxLv();confetti(35);if(S.gc.indexOf(S.gi)<0)S.gc.push(S.gi);
    var g=GR[S.gi],m=MASCOTS[g.mi],isLast=S.gi>=GR.length-1;
    $('celeb').innerHTML='<div class="cel-e">'+(isLast?'🏆':'🎉')+'</div><div class="cel-t">'+(isLast?'SEN BİR ŞAMPİYONSUN!':'Tebrikler, '+S.name+'!')+'</div><div class="cel-s">'+(isLast?'Tüm harfleri öğrendin! 📚':g.n+' tamamlandı! '+m.icon+' '+m.name+' seninle gurur duyuyor!')+'</div><div class="lr">'+g.l.map(function(l){return '<div class="lri">'+l.e+' '+l.t+'</div>'}).join('')+'</div><div class="cel-stats"><div class="sb"><div class="si">⭐</div><div class="sv">'+S.stars+'</div><div class="slab">Yıldız</div></div><div class="sb"><div class="si">🏆</div><div class="sv">'+S.score+'</div><div class="slab">Puan</div></div><div class="sb"><div class="si">🔥</div><div class="sv">'+S.mx+'x</div><div class="slab">Kombo</div></div><div class="sb"><div class="si">✅</div><div class="sv">'+S.tc+'</div><div class="slab">Doğru</div></div></div><div id="cel-ai" style="margin:10px 0;max-width:min(85%,400px)"></div><button class="gbtn purple" id="cel-b">'+(isLast?'🔄 Baştan!':CK?'📖 Hikaye!':'🚀 Sonraki!')+'</button>';
    show('celeb');if(has3D)try{emP(100,{x:0,y:3,z:0},12)}catch(e){}
    aiChat(S.name+' '+g.n+' tamamladı! Harfler: '+g.l.map(function(l){return l.t}).join(', ')+'. Tebrik et!').then(function(aiMsg){
        if(aiMsg)$('cel-ai').innerHTML='<div style="background:rgba(255,255,255,.06);border-radius:16px;padding:12px 18px;border:1px solid rgba(255,255,255,.08);font-size:clamp(13px,2.2vw,17px);color:rgba(255,255,255,.8);line-height:1.6">'+m.icon+' '+aiMsg+'</div>'});
    $('cel-b').onclick=function(){sfxCl();hide('celeb');
    if(isLast){S.gi=0;S.li=0;S.score=0;S.stars=0;S.combo=0;S.mx=0;S.tc=0;S.gc=[];S.ld=[];showWM()}
    else if(CK){showStory()}else{S.gi++;S.li=0;showWM()}}}

function showStory(){
    hideAll();var g=GR[S.gi],m=MASCOTS[g.mi];$('st-m').textContent=m.icon;
    $('st-text').innerHTML='<div class="typing-dots"><span></span><span></span><span></span></div>';show('story');
    var words=[];GR.forEach(function(gr){gr.l.forEach(function(l){if(S.ld.indexOf(l.t)>=0)words=words.concat(l.ws)})});
    var wl=words.filter(function(v,i,a){return a.indexOf(v)===i}).join(', ');
    aiChat('Öğrenilen harfler: '+S.ld.join(', ')+'. Kelimeler: '+wl+'. SADECE bu harflerle 2-3 cümle hikaye yaz. '+S.name+' ve '+m.name+' olsun.').then(function(story){
        $('st-text').textContent=story||S.name+' ve '+m.name+' birlikte harfleri topladı. Yeni maceralar bekliyordu! ⭐'});
    $('st-btn').onclick=function(){sfxCl();hide('story');S.gi++;S.li=0;showWM()}}

// ═══════════ These will be set by Three.js if it loads ═══════════
var set3D=function(){},setEnv=function(){},emP=function(){},lg={position:{x:0,y:3,z:0}};
</script>

<!-- Load Three.js ASYNC with error handling -->
<script>
(function(){
    var s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload=function(){init3D()};
    s.onerror=function(){console.log('Three.js failed to load - using 2D fallback');document.getElementById('cv').style.display='none'};
    document.head.appendChild(s);
})();

function init3D(){
try{
has3D=true;
document.getElementById('stars-bg').style.display='none';
var cv=document.getElementById('cv');
var R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.2;
var sc=new THREE.Scene();sc.fog=new THREE.FogExp2(0x0a0a2e,.015);
var cam=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,1000);cam.position.set(0,5,14);cam.lookAt(0,1,0);
sc.add(new THREE.AmbientLight(0x404080,.5));
var dl=new THREE.DirectionalLight(0xffeedd,1);dl.position.set(10,20,10);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);dl.shadow.camera.near=.5;dl.shadow.camera.far=50;dl.shadow.camera.left=-15;dl.shadow.camera.right=15;dl.shadow.camera.top=15;dl.shadow.camera.bottom=-15;sc.add(dl);
var pl1=new THREE.PointLight(0x4488ff,1,28);pl1.position.set(-5,8,5);sc.add(pl1);
var pl2=new THREE.PointLight(0xff4488,.7,22);pl2.position.set(5,6,-3);sc.add(pl2);
var sg=new THREE.BufferGeometry(),sn=2500,sp=new Float32Array(sn*3);
for(var i=0;i<sn;i++){sp[i*3]=(Math.random()-.5)*280;sp[i*3+1]=Math.random()*130+10;sp[i*3+2]=(Math.random()-.5)*280-20}
sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
var starMat=new THREE.PointsMaterial({color:0xffffff,size:.3,transparent:true,opacity:.65,sizeAttenuation:true});
var sf=new THREE.Points(sg,starMat);sc.add(sf);
var ig=new THREE.Group();
var iMt=new THREE.MeshStandardMaterial({color:0x2d6a4f,roughness:.8});
var im=new THREE.Mesh(new THREE.CylinderGeometry(8,5,3,32),iMt);im.position.y=-1.5;im.receiveShadow=true;ig.add(im);
var gm=new THREE.Mesh(new THREE.CylinderGeometry(8.1,8,.4,32),new THREE.MeshStandardMaterial({color:0x52b788,roughness:.9}));gm.receiveShadow=true;ig.add(gm);
for(var i=0;i<6;i++){var r=new THREE.Mesh(new THREE.DodecahedronGeometry(1.2+Math.random(),0),new THREE.MeshStandardMaterial({color:0x6b4e3d,roughness:.9}));var a=(i/6)*Math.PI*2;r.position.set(Math.cos(a)*4,-3.5-Math.random()*2,Math.sin(a)*4);r.scale.setScalar(.2+Math.random()*.4);r.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);ig.add(r)}
sc.add(ig);
var trs=[];function mkTr(x,z,h,c){var g=new THREE.Group();var tk=new THREE.Mesh(new THREE.CylinderGeometry(.1,.15,h*.5,6),new THREE.MeshStandardMaterial({color:0x8B4513,roughness:.9}));tk.position.y=h*.25;tk.castShadow=true;g.add(tk);for(var i=0;i<3;i++){var lf=new THREE.Mesh(new THREE.ConeGeometry(.7-i*.13,h*.36,7),new THREE.MeshStandardMaterial({color:c,roughness:.8}));lf.position.y=h*.5+i*h*.22;lf.castShadow=true;g.add(lf)}g.position.set(x,.2,z);return g}
[[-5,1,1.8,0x2d8a4e],[-6,-2,1.4,0x1b7a3a],[5.5,.5,2,0x38a169],[6,-3,1.2,0x2d6a4f],[-3,4,1.6,0x48bb78],[4,3.5,1.3,0x276749]].forEach(function(t){var tr=mkTr(t[0],t[1],t[2],t[3]);ig.add(tr);trs.push(tr)});
for(var i=0;i<20;i++){var fc=[0xff6b6b,0xfbbf24,0xec4899,0xa855f7,0x3b82f6,0x10b981][~~(Math.random()*6)];var f=new THREE.Mesh(new THREE.SphereGeometry(.06,8,8),new THREE.MeshStandardMaterial({color:fc,emissive:fc,emissiveIntensity:.4}));var a=Math.random()*Math.PI*2,r=2+Math.random()*5.5;f.position.set(Math.cos(a)*r,.25,Math.sin(a)*r);ig.add(f)}
var pf=new THREE.Mesh(new THREE.CylinderGeometry(1.8,2,.3,32),new THREE.MeshStandardMaterial({color:0xffd700,roughness:.3,metalness:.6,emissive:0x443300,emissiveIntensity:.3}));pf.position.y=.35;pf.receiveShadow=true;ig.add(pf);
var gems=[];function mkG(x,y,z,c){var m=new THREE.Mesh(new THREE.OctahedronGeometry(.2,0),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.5,roughness:.2,metalness:.8}));m.position.set(x,y,z);m.castShadow=true;sc.add(m);gems.push({m:m,by:y,sp:.7+Math.random()*.5,of:Math.random()*Math.PI*2})}
mkG(-3,2,2,0xff6b6b);mkG(3.5,2.5,1,0x48bb78);mkG(-2,3,-1,0xa855f7);mkG(4,1.8,-2,0x3b82f6);mkG(0,3.5,3,0xf59e0b);

var lgrp=new THREE.Group();lgrp.position.set(0,2.5,0);sc.add(lgrp);
lg=lgrp;var cLetter=null;
function mkSp(t,sz,clr){var c=document.createElement('canvas');c.width=512;c.height=512;var x=c.getContext('2d');var gr=x.createRadialGradient(256,256,0,256,256,220);gr.addColorStop(0,clr+'44');gr.addColorStop(1,'transparent');x.fillStyle=gr;x.fillRect(0,0,512,512);x.font="bold 260px 'Baloo 2',sans-serif";x.textAlign='center';x.textBaseline='middle';x.shadowColor=clr;x.shadowBlur=40;x.fillStyle=clr;x.fillText(t,256,256);x.shadowBlur=0;x.fillStyle='#fff';x.fillText(t,256,256);var tx=new THREE.CanvasTexture(c);var s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthTest:false}));s.scale.set(sz||3,sz||3,1);return s}
function mkEm(e,sz){var c=document.createElement('canvas');c.width=256;c.height=256;var x=c.getContext('2d');x.font='170px serif';x.textAlign='center';x.textBaseline='middle';x.fillText(e,128,138);var tx=new THREE.CanvasTexture(c);var s=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthTest:false}));s.scale.set(sz||1.5,sz||1.5,1);return s}

set3D=function(letter,emoji,color){while(lgrp.children.length)lgrp.remove(lgrp.children[0]);lgrp.add(new THREE.Mesh(new THREE.SphereGeometry(1.1,32,32),new THREE.MeshStandardMaterial({color:new THREE.Color(color),transparent:true,opacity:.1,emissive:new THREE.Color(color),emissiveIntensity:.8})));for(var i=0;i<2;i++){var ring=new THREE.Mesh(new THREE.TorusGeometry(1.4+i*.35,.02,16,64),new THREE.MeshStandardMaterial({color:new THREE.Color(color),emissive:new THREE.Color(color),emissiveIntensity:1,transparent:true,opacity:.35}));ring.rotation.x=Math.PI/2+i*.5;lgrp.add(ring)}var mos=[];for(var i=0;i<3;i++){var mo=new THREE.Mesh(new THREE.SphereGeometry(.07,12,12),new THREE.MeshStandardMaterial({color:new THREE.Color(color),emissive:new THREE.Color(color),emissiveIntensity:1}));lgrp.add(mo);mos.push(mo)}lgrp.add(mkSp(letter,3,color));var es=mkEm(emoji,1.6);es.position.y=2.2;lgrp.add(es);cLetter={mos:mos}};

var PC=250,pg=new THREE.BufferGeometry(),pp=new Float32Array(PC*3),pcl=new Float32Array(PC*3),psz=new Float32Array(PC),pv=[],plt=[];
for(var i=0;i<PC;i++){pp[i*3]=pp[i*3+1]=pp[i*3+2]=0;pcl[i*3]=pcl[i*3+1]=pcl[i*3+2]=1;psz[i]=0;pv.push({x:0,y:0,z:0});plt.push(0)}
pg.setAttribute('position',new THREE.BufferAttribute(pp,3));pg.setAttribute('color',new THREE.BufferAttribute(pcl,3));pg.setAttribute('size',new THREE.BufferAttribute(psz,1));
sc.add(new THREE.Points(pg,new THREE.PointsMaterial({size:.3,vertexColors:true,transparent:true,opacity:.85,sizeAttenuation:true,blending:THREE.AdditiveBlending,depthWrite:false})));
var pidx=0;
emP=function(n,o,spd){var cs=[[1,.84,0],[1,.42,.42],[.66,.33,.96],[.06,.72,.51],[.23,.51,.96],[.93,.26,.6]];for(var i=0;i<n;i++){var idx=pidx%PC,c=cs[~~(Math.random()*cs.length)];pp[idx*3]=o.x+(Math.random()-.5)*.5;pp[idx*3+1]=o.y+(Math.random()-.5)*.5;pp[idx*3+2]=o.z+(Math.random()-.5)*.5;pcl[idx*3]=c[0];pcl[idx*3+1]=c[1];pcl[idx*3+2]=c[2];psz[idx]=Math.random()*.4+.2;pv[idx]={x:(Math.random()-.5)*spd,y:Math.random()*spd*.8+spd*.3,z:(Math.random()-.5)*spd};plt[idx]=1;pidx++}};

var tec=new THREE.Color(0x0a0a2e),tgc=new THREE.Color(0x2d6a4f);
setEnv=function(g){tec=new THREE.Color(g.ec);tgc=new THREE.Color(g.gc)};

addEventListener('resize',function(){cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();R.setSize(innerWidth,innerHeight)});

var clk=new THREE.Clock();
function anim(){requestAnimationFrame(anim);var dt=Math.min(clk.getDelta(),.05),t=clk.getElapsedTime();
ig.position.y=Math.sin(t*.3)*.12;ig.rotation.y+=dt*.012;
if(cLetter){lgrp.position.y=2.5+Math.sin(t*1.2)*.25;lgrp.rotation.y+=dt*.4;cLetter.mos.forEach(function(mo,i){var a=t*1.4+i*(Math.PI*2/cLetter.mos.length);mo.position.set(Math.cos(a)*1.6,Math.sin(a*.7)*.4,Math.sin(a)*1.6)})}
if(shk.t>0){shk.t-=dt;lgrp.position.x=(Math.random()-.5)*shk.i;lgrp.position.z=(Math.random()-.5)*shk.i}else{lgrp.position.x*=.9;lgrp.position.z*=.9}
gems.forEach(function(g){g.m.position.y=g.by+Math.sin(t*g.sp+g.of)*.35;g.m.rotation.x+=dt*.4;g.m.rotation.z+=dt*.25});
starMat.opacity=.45+Math.sin(t*.5)*.2;
pl1.position.x=Math.cos(t*.3)*8;pl1.position.z=Math.sin(t*.3)*8;pl2.position.x=Math.cos(t*.4+2)*7;pl2.position.z=Math.sin(t*.4+2)*7;
sc.fog.color.lerp(tec,dt*2);iMt.color.lerp(tgc,dt*2);R.setClearColor(sc.fog.color);
cam.position.x+=(camT.x+Math.sin(t*.15)*.4-cam.position.x)*dt*3;cam.position.y+=(camT.y+Math.sin(t*.2)*.25-cam.position.y)*dt*3;cam.position.z+=(camT.z-cam.position.z)*dt*3;cam.lookAt(0,1.5,0);
trs.forEach(function(tr,i){tr.rotation.z=Math.sin(t*.5+i)*.025});sf.rotation.y+=dt*.002;
for(var i=0;i<PC;i++){if(plt[i]>0){plt[i]-=dt*.65;pp[i*3]+=pv[i].x*dt;pp[i*3+1]+=pv[i].y*dt;pp[i*3+2]+=pv[i].z*dt;pv[i].y-=13*dt;psz[i]=Math.max(0,plt[i]*.45)}else psz[i]=0}
pg.attributes.position.needsUpdate=pg.attributes.color.needsUpdate=pg.attributes.size.needsUpdate=true;
R.render(sc,cam)}
anim();
}catch(e){console.log('3D init error:',e);document.getElementById('cv').style.display='none';has3D=false}}
</script>
</body></html>"""

components.html(GAME.replace('__CK__',ck), height=780, scrolling=False)
