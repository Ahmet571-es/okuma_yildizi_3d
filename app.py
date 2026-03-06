# ============================================================================
# 🌟 OKUMA YILDIZI - Turkish Phonics Reading Game for Children (Age 5)
# ============================================================================
# pip install streamlit streamlit-lottie requests
# Run: streamlit run app.py
# ============================================================================

import streamlit as st
import json
import random
import time
from streamlit_lottie import st_lottie
import requests

# ============================================================================
# PAGE CONFIG — Must be the first Streamlit command
# ============================================================================
st.set_page_config(
    page_title="🌟 Okuma Yıldızı",
    page_icon="⭐",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ============================================================================
# TURKISH PHONETIC CURRICULUM DATASET
# Sequenced per modern Turkish early reading standards:
#   Group 1: E, L, A, K, İ, N
#   Group 2: O, M, U, T, Ü, Y
#   Group 3: S, D, Ö, R, I, B
#   Group 4: Z, Ç, Ş, G, C, P
#   Group 5: H, F, V, Ğ, J
# Each entry: letter, word, emoji, syllable practice, color accent
# ============================================================================
PHONETIC_GROUPS = [
    {
        "group_id": 1,
        "group_name": "1. Grup",
        "unlock_label": "Yıldız Tomurcuğu ⭐",
        "letters": [
            {"letter": "E", "word": "Elma",  "emoji": "🍎", "syllables": ["El", "ma"],  "color": "#FF6B6B"},
            {"letter": "L", "word": "Lale",  "emoji": "🌷", "syllables": ["La", "le"],  "color": "#E84393"},
            {"letter": "A", "word": "Arı",   "emoji": "🐝", "syllables": ["A",  "rı"],  "color": "#FDCB6E"},
            {"letter": "K", "word": "Kedi",  "emoji": "🐱", "syllables": ["Ke", "di"],  "color": "#A29BFE"},
            {"letter": "İ", "word": "İnek",  "emoji": "🐄", "syllables": ["İ",  "nek"], "color": "#55EFC4"},
            {"letter": "N", "word": "Nar",   "emoji": "🍎", "syllables": ["N",  "ar"],  "color": "#FF7675"},
        ],
    },
    {
        "group_id": 2,
        "group_name": "2. Grup",
        "unlock_label": "Parlayan Yıldız 🌟",
        "letters": [
            {"letter": "O", "word": "Okul",  "emoji": "🏫", "syllables": ["O",  "kul"], "color": "#74B9FF"},
            {"letter": "M", "word": "Masa",  "emoji": "🪑", "syllables": ["Ma", "sa"],  "color": "#FD79A8"},
            {"letter": "U", "word": "Uçak",  "emoji": "✈️", "syllables": ["U",  "çak"], "color": "#81ECEC"},
            {"letter": "T", "word": "Top",   "emoji": "⚽", "syllables": ["T",  "op"],  "color": "#00B894"},
            {"letter": "Ü", "word": "Üzüm",  "emoji": "🍇", "syllables": ["Ü",  "züm"], "color": "#6C5CE7"},
            {"letter": "Y", "word": "Yıldız","emoji": "⭐", "syllables": ["Yıl","dız"], "color": "#FFEAA7"},
        ],
    },
    {
        "group_id": 3,
        "group_name": "3. Grup",
        "unlock_label": "Süper Yıldız 💫",
        "letters": [
            {"letter": "S", "word": "Su",    "emoji": "💧", "syllables": ["S",  "u"],   "color": "#0984E3"},
            {"letter": "D", "word": "Dağ",   "emoji": "⛰️", "syllables": ["D",  "ağ"],  "color": "#636E72"},
            {"letter": "Ö", "word": "Ördek", "emoji": "🦆", "syllables": ["Ör", "dek"], "color": "#E17055"},
            {"letter": "R", "word": "Robot", "emoji": "🤖", "syllables": ["Ro", "bot"], "color": "#B2BEC3"},
            {"letter": "I", "word": "Irmak", "emoji": "🏞️", "syllables": ["Ir", "mak"], "color": "#00CEC9"},
            {"letter": "B", "word": "Balık", "emoji": "🐟", "syllables": ["Ba", "lık"], "color": "#0984E3"},
        ],
    },
    {
        "group_id": 4,
        "group_name": "4. Grup",
        "unlock_label": "Mega Yıldız 🌠",
        "letters": [
            {"letter": "Z", "word": "Zürafa","emoji": "🦒", "syllables": ["Zü","ra","fa"], "color": "#FDCB6E"},
            {"letter": "Ç", "word": "Çiçek", "emoji": "🌸", "syllables": ["Çi","çek"],    "color": "#FD79A8"},
            {"letter": "Ş", "word": "Şapka", "emoji": "🎩", "syllables": ["Şap","ka"],    "color": "#2D3436"},
            {"letter": "G", "word": "Göz",   "emoji": "👁️", "syllables": ["G","öz"],      "color": "#00B894"},
            {"letter": "C", "word": "Cam",   "emoji": "🪟", "syllables": ["C","am"],      "color": "#74B9FF"},
            {"letter": "P", "word": "Pasta", "emoji": "🎂", "syllables": ["Pas","ta"],    "color": "#E84393"},
        ],
    },
    {
        "group_id": 5,
        "group_name": "5. Grup",
        "unlock_label": "Efsane Yıldız 🏆",
        "letters": [
            {"letter": "H", "word": "Hayvan","emoji": "🐾", "syllables": ["Hay","van"],   "color": "#A29BFE"},
            {"letter": "F", "word": "Fil",   "emoji": "🐘", "syllables": ["F","il"],      "color": "#636E72"},
            {"letter": "V", "word": "Vazo",  "emoji": "🏺", "syllables": ["Va","zo"],     "color": "#E17055"},
            {"letter": "Ğ", "word": "Dağ",   "emoji": "🏔️", "syllables": ["Da","ğ"],      "color": "#55EFC4"},
            {"letter": "J", "word": "Jilet",  "emoji": "✨", "syllables": ["Ji","let"],    "color": "#FFEAA7"},
        ],
    },
]

# ============================================================================
# LOTTIE ANIMATION URLS (Publicly available free Lottie JSONs)
# Replace these with your own hosted Lottie files for production
# ============================================================================
LOTTIE_URLS = {
    "confetti":  "https://lottie.host/0472e6e8-3e3f-4d22-87ac-57a498bb1e03/ZJfNRHBWpL.json",
    "star":      "https://lottie.host/d78c7e14-3544-4b09-8032-8a2fa62a1817/mzVWP5jLb3.json",
    "rocket":    "https://lottie.host/36eab8f9-21c9-4e3a-a498-a46a41e59039/cjSFRvjsBM.json",
    "bounce":    "https://lottie.host/46890d1b-2e2d-461e-8bb0-517a990c1bea/glEn5WxzUf.json",
    "sparkle":   "https://lottie.host/f8e3c913-7e60-4f9b-85c3-1f05c1a05f31/kbwUQBVpBX.json",
}

def load_lottie_url(url: str):
    """Safely load a Lottie animation JSON from a URL."""
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return None

# ============================================================================
# AUDIO HELPER — Plays sound effects via embedded HTML audio tags
# Replace placeholder URLs with real hosted MP3s for production
# ============================================================================
SOUND_URLS = {
    "correct":  "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
    "combo":    "https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3",
    "levelup":  "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
    "click":    "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
    "whoosh":   "https://assets.mixkit.co/active_storage/sfx/2516/2516-preview.mp3",
}

def play_sound(sound_key: str):
    """Inject an auto-playing HTML audio element for the given sound."""
    url = SOUND_URLS.get(sound_key, "")
    if url:
        st.markdown(
            f'<audio autoplay><source src="{url}" type="audio/mpeg"></audio>',
            unsafe_allow_html=True,
        )

# ============================================================================
# SESSION STATE INITIALIZATION
# ============================================================================
def init_state():
    """Initialize all session state variables for the game engine."""
    defaults = {
        "screen": "splash",          # splash | game | group_complete | victory
        "current_group": 0,           # Index into PHONETIC_GROUPS
        "current_letter_idx": 0,      # Index within current group's letters
        "score": 0,
        "combo": 0,
        "max_combo": 0,
        "stars_earned": 0,
        "total_correct": 0,
        "total_attempts": 0,
        "show_correct_feedback": False,
        "show_wrong_feedback": False,
        "wrong_tile_id": "",
        "game_mode": "letter_match",  # letter_match | syllable_match
        "options": [],                # Current answer options
        "needs_new_question": True,
        "animation_ts": 0,
        "groups_unlocked": 1,         # How many groups the child can access
    }
    for key, val in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = val

init_state()

# ============================================================================
# GLOBAL CSS — Hides Streamlit chrome, sets game background & typography
# ============================================================================
GLOBAL_CSS = """
<style>
/* ---- Import child-friendly rounded font ---- */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Baloo+2:wght@400;500;600;700;800&display=swap');

/* ---- Hide ALL default Streamlit UI ---- */
#MainMenu, header, footer,
[data-testid="stToolbar"],
[data-testid="stDecoration"],
[data-testid="stStatusWidget"],
.stDeployButton {
    display: none !important;
}

/* Remove default padding */
.stApp {
    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
    overflow-x: hidden;
}

section.main > div.block-container {
    padding: 0.5rem 1rem 1rem 1rem !important;
    max-width: 100% !important;
}

/* ---- Base typography ---- */
* {
    font-family: 'Nunito', 'Baloo 2', sans-serif !important;
}

/* ---- Floating star particles background ---- */
.stApp::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image:
        radial-gradient(2px 2px at 20px 30px, #eee, transparent),
        radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
        radial-gradient(3px 3px at 50px 160px, #ddd, transparent),
        radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.6), transparent),
        radial-gradient(2px 2px at 130px 80px, #fff, transparent),
        radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.7), transparent);
    background-repeat: repeat;
    background-size: 200px 200px;
    animation: twinkle 4s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
}

@keyframes twinkle {
    0% { opacity: 0.3; }
    100% { opacity: 0.6; }
}

/* ---- Utility animation classes ---- */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
}
@keyframes popIn {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
}
@keyframes slideUp {
    0% { transform: translateY(40px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    15% { transform: translateX(-8px) rotate(-2deg); }
    30% { transform: translateX(8px) rotate(2deg); }
    45% { transform: translateX(-6px) rotate(-1deg); }
    60% { transform: translateX(6px) rotate(1deg); }
    75% { transform: translateX(-3px); }
}
@keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(255,215,0,0.5); }
    50% { box-shadow: 0 0 30px rgba(255,215,0,0.9), 0 0 60px rgba(255,215,0,0.3); }
}
@keyframes rainbow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
}
@keyframes confettiFall {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(80px) rotate(360deg); opacity: 0; }
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 0px; }
</style>
"""
st.markdown(GLOBAL_CSS, unsafe_allow_html=True)


# ============================================================================
# HELPER: Generate distractors for answer options
# ============================================================================
def get_letter_options(correct_letter: str, group_idx: int) -> list:
    """Generate 4 shuffled options including the correct letter."""
    all_letters = []
    # Pull from current group and nearby groups for distractors
    for g_idx in range(max(0, group_idx - 1), min(len(PHONETIC_GROUPS), group_idx + 2)):
        for item in PHONETIC_GROUPS[g_idx]["letters"]:
            if item["letter"] != correct_letter:
                all_letters.append(item["letter"])
    all_letters = list(set(all_letters))
    random.shuffle(all_letters)
    distractors = all_letters[:3]
    options = distractors + [correct_letter]
    random.shuffle(options)
    return options


def get_syllable_options(correct_syllable: str, group_idx: int) -> list:
    """Generate 4 shuffled syllable options."""
    all_syllables = []
    for g_idx in range(max(0, group_idx - 1), min(len(PHONETIC_GROUPS), group_idx + 2)):
        for item in PHONETIC_GROUPS[g_idx]["letters"]:
            for s in item["syllables"]:
                if s != correct_syllable:
                    all_syllables.append(s)
    all_syllables = list(set(all_syllables))
    random.shuffle(all_syllables)
    distractors = all_syllables[:3]
    options = distractors + [correct_syllable]
    random.shuffle(options)
    return options


# ============================================================================
# SCREEN: SPLASH / TITLE SCREEN
# ============================================================================
def render_splash():
    splash_html = """
    <div style="
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        min-height: 85vh; text-align: center; position: relative; z-index: 1;
    ">
        <!-- Animated Title -->
        <div style="animation: float 3s ease-in-out infinite; margin-bottom: 10px;">
            <div style="font-size: clamp(60px, 12vw, 120px); line-height: 1.1;">⭐</div>
        </div>
        <h1 style="
            font-family: 'Baloo 2', cursive !important;
            font-size: clamp(36px, 8vw, 72px);
            font-weight: 800;
            background: linear-gradient(135deg, #FFEAA7, #FDCB6E, #FF6B6B, #E84393, #A29BFE, #74B9FF);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbow 4s ease infinite;
            margin: 0 0 5px 0;
            text-shadow: none;
            letter-spacing: 2px;
        ">OKUMA YILDIZI</h1>
        <p style="
            color: rgba(255,255,255,0.7);
            font-size: clamp(16px, 3vw, 24px);
            margin: 0 0 40px 0;
            font-weight: 600;
            letter-spacing: 1px;
        ">Harfleri Öğrenmeye Hazır mısın? 🚀</p>

        <!-- Decorative floating emojis -->
        <div style="position: absolute; top: 10%; left: 8%; font-size: 40px; animation: float 4s ease-in-out infinite 0.5s; opacity: 0.6;">🍎</div>
        <div style="position: absolute; top: 15%; right: 10%; font-size: 35px; animation: float 3.5s ease-in-out infinite 1s; opacity: 0.5;">🌷</div>
        <div style="position: absolute; bottom: 20%; left: 12%; font-size: 38px; animation: float 4.5s ease-in-out infinite 0.2s; opacity: 0.5;">🐱</div>
        <div style="position: absolute; bottom: 25%; right: 8%; font-size: 42px; animation: float 3s ease-in-out infinite 1.5s; opacity: 0.6;">🦋</div>
    </div>
    """
    st.markdown(splash_html, unsafe_allow_html=True)

    # Centered Play button
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        play_btn_html = """
        <div style="display: flex; justify-content: center; position: relative; z-index: 2;">
            <div style="
                background: linear-gradient(135deg, #00B894, #00CEC9);
                color: white;
                font-size: clamp(22px, 4vw, 32px);
                font-weight: 800;
                padding: 18px 60px;
                border-radius: 50px;
                cursor: pointer;
                animation: glow 2s ease-in-out infinite, bounce 2s ease-in-out infinite;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 184, 148, 0.4);
                letter-spacing: 2px;
                user-select: none;
            ">
                🎮 OYNA!
            </div>
        </div>
        """
        st.markdown(play_btn_html, unsafe_allow_html=True)
        if st.button("▶️ Oyuna Başla!", key="start_game", use_container_width=True):
            st.session_state.screen = "game"
            st.session_state.needs_new_question = True
            st.rerun()


# ============================================================================
# COMPONENT: Top HUD — Score, Combo, Progress Bar
# ============================================================================
def render_hud():
    group = PHONETIC_GROUPS[st.session_state.current_group]
    total_in_group = len(group["letters"])
    progress_pct = (st.session_state.current_letter_idx / total_in_group) * 100

    # Combo display
    combo = st.session_state.combo
    combo_text = ""
    if combo >= 2:
        combo_text = f'<span style="color: #FFEAA7; font-weight:800; animation: bounce 0.6s;">🔥 x{combo} KOMBO!</span>'

    hud_html = f"""
    <div style="
        position: relative; z-index: 2;
        display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
        padding: 12px 20px;
        background: rgba(255,255,255,0.08);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        margin-bottom: 15px;
        border: 1px solid rgba(255,255,255,0.1);
        gap: 10px;
    ">
        <!-- Group Name -->
        <div style="color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 700;">
            {group["group_name"]} — {group["unlock_label"]}
        </div>

        <!-- Score & Stars -->
        <div style="display: flex; align-items: center; gap: 20px;">
            <div style="color: #FFEAA7; font-size: 18px; font-weight: 800;">
                ⭐ {st.session_state.stars_earned}
            </div>
            <div style="color: #74B9FF; font-size: 18px; font-weight: 800;">
                🏆 {st.session_state.score}
            </div>
            {combo_text}
        </div>
    </div>

    <!-- Progress Bar -->
    <div style="
        position: relative; z-index: 2;
        background: rgba(255,255,255,0.1);
        border-radius: 15px;
        height: 18px;
        margin-bottom: 20px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.08);
    ">
        <div style="
            background: linear-gradient(90deg, #00B894, #00CEC9, #74B9FF, #A29BFE);
            background-size: 200% 100%;
            animation: rainbow 3s linear infinite;
            height: 100%;
            width: {progress_pct}%;
            border-radius: 15px;
            transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        "></div>
    </div>
    """
    st.markdown(hud_html, unsafe_allow_html=True)


# ============================================================================
# SCREEN: MAIN GAME
# ============================================================================
def render_game():
    render_hud()

    group = PHONETIC_GROUPS[st.session_state.current_group]
    letter_data = group["letters"][st.session_state.current_letter_idx]

    # Generate new question options if needed
    if st.session_state.needs_new_question:
        if st.session_state.game_mode == "letter_match":
            st.session_state.options = get_letter_options(
                letter_data["letter"], st.session_state.current_group
            )
        else:
            target_syl = letter_data["syllables"][0]
            st.session_state.options = get_syllable_options(
                target_syl, st.session_state.current_group
            )
        st.session_state.needs_new_question = False
        st.session_state.show_correct_feedback = False
        st.session_state.show_wrong_feedback = False
        st.session_state.wrong_tile_id = ""

    # ---- Question Card ----
    emoji = letter_data["emoji"]
    word = letter_data["word"]
    target = letter_data["letter"] if st.session_state.game_mode == "letter_match" else letter_data["syllables"][0]
    color = letter_data["color"]

    if st.session_state.game_mode == "letter_match":
        question_text = f'<b>"{word}"</b> kelimesinin ilk harfi nedir?'
    else:
        question_text = f'<b>"{word}"</b> kelimesinin ilk hecesi nedir?'

    card_html = f"""
    <div style="
        position: relative; z-index: 2;
        display: flex; flex-direction: column; align-items: center;
        background: rgba(255,255,255,0.06);
        backdrop-filter: blur(12px);
        border-radius: 30px;
        padding: 30px 20px 20px;
        margin-bottom: 25px;
        border: 2px solid {color}33;
        animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
        <!-- Big Emoji -->
        <div style="
            font-size: clamp(70px, 15vw, 130px);
            animation: float 3s ease-in-out infinite;
            margin-bottom: 10px;
            filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3));
        ">{emoji}</div>

        <!-- Word Display -->
        <div style="
            font-family: 'Baloo 2', cursive !important;
            font-size: clamp(36px, 7vw, 64px);
            font-weight: 800;
            color: white;
            text-shadow: 0 4px 15px rgba(0,0,0,0.3);
            margin-bottom: 8px;
            letter-spacing: 4px;
        ">{word}</div>

        <!-- Question -->
        <div style="
            color: rgba(255,255,255,0.8);
            font-size: clamp(16px, 3vw, 22px);
            font-weight: 600;
            text-align: center;
        ">{question_text}</div>
    </div>
    """
    st.markdown(card_html, unsafe_allow_html=True)

    # ---- Correct Feedback: Confetti + Lottie ----
    if st.session_state.show_correct_feedback:
        play_sound("correct")

        # Confetti burst via CSS
        confetti_particles = ""
        for i in range(25):
            left = random.randint(5, 95)
            delay = round(random.uniform(0, 0.8), 2)
            clr = random.choice(["#FF6B6B","#FFEAA7","#55EFC4","#74B9FF","#A29BFE","#FD79A8","#FDCB6E"])
            size = random.randint(6, 14)
            confetti_particles += f"""
            <div style="
                position: fixed; top: -10px; left: {left}%;
                width: {size}px; height: {size}px;
                background: {clr};
                border-radius: {random.choice(['50%','2px'])};
                animation: confettiFall {round(random.uniform(1.5, 3.0), 1)}s ease-out {delay}s forwards;
                z-index: 9999;
            "></div>"""

        st.markdown(confetti_particles, unsafe_allow_html=True)

        # Lottie confetti animation
        lottie_data = load_lottie_url(LOTTIE_URLS["confetti"])
        if lottie_data:
            col_l, col_c, col_r = st.columns([1, 2, 1])
            with col_c:
                st_lottie(lottie_data, height=200, key=f"confetti_{st.session_state.animation_ts}")

        success_html = f"""
        <div style="
            position: relative; z-index: 2;
            text-align: center;
            animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            margin-bottom: 15px;
        ">
            <div style="
                display: inline-block;
                background: linear-gradient(135deg, #00B894, #00CEC9);
                color: white;
                font-size: clamp(22px, 4vw, 36px);
                font-weight: 800;
                padding: 15px 40px;
                border-radius: 25px;
                box-shadow: 0 8px 30px rgba(0,184,148,0.4);
            ">🎉 Harika! Doğru!</div>
        </div>
        """
        st.markdown(success_html, unsafe_allow_html=True)

        col1, col2, col3 = st.columns([1, 1, 1])
        with col2:
            if st.button("Sonraki ➡️", key="next_q", use_container_width=True):
                advance_question()
                st.rerun()
        return

    # ---- Answer Tiles (Custom HTML + Streamlit buttons for state) ----
    st.markdown('<div style="position: relative; z-index: 2;">', unsafe_allow_html=True)

    # Responsive grid for tiles
    cols = st.columns(len(st.session_state.options))
    for idx, option in enumerate(st.session_state.options):
        with cols[idx]:
            is_wrong = (st.session_state.show_wrong_feedback and st.session_state.wrong_tile_id == f"opt_{idx}")
            shake_anim = "animation: shake 0.5s ease;" if is_wrong else ""

            tile_html = f"""
            <div style="
                {shake_anim}
                text-align: center;
                margin-bottom: 5px;
            ">
                <div style="
                    background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
                    backdrop-filter: blur(8px);
                    border: 2px solid rgba(255,255,255,0.15);
                    border-radius: 24px;
                    padding: clamp(16px, 3vw, 28px) 10px;
                    font-family: 'Baloo 2', cursive !important;
                    font-size: clamp(32px, 7vw, 56px);
                    font-weight: 800;
                    color: white;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    letter-spacing: 2px;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    user-select: none;
                ">{option}</div>
            </div>
            """
            st.markdown(tile_html, unsafe_allow_html=True)

            if st.button(
                f"Seç: {option}",
                key=f"opt_{idx}_{st.session_state.current_group}_{st.session_state.current_letter_idx}",
                use_container_width=True,
            ):
                handle_answer(option, target, idx)
                st.rerun()

    st.markdown('</div>', unsafe_allow_html=True)

    # ---- Mode Toggle: Letter vs Syllable ----
    st.markdown("<br>", unsafe_allow_html=True)
    mode_col1, mode_col2, mode_col3 = st.columns([1, 2, 1])
    with mode_col2:
        current_mode_label = "📝 Harf Eşleştirme" if st.session_state.game_mode == "letter_match" else "🔤 Hece Eşleştirme"
        toggle_label = "Hece Moduna Geç 🔤" if st.session_state.game_mode == "letter_match" else "Harf Moduna Geç 📝"
        if st.button(toggle_label, key="mode_toggle", use_container_width=True):
            st.session_state.game_mode = "syllable_match" if st.session_state.game_mode == "letter_match" else "letter_match"
            st.session_state.needs_new_question = True
            st.rerun()


def handle_answer(selected, correct, tile_idx):
    """Process the child's answer selection."""
    st.session_state.total_attempts += 1
    if selected == correct:
        # Correct!
        st.session_state.show_correct_feedback = True
        st.session_state.show_wrong_feedback = False
        st.session_state.total_correct += 1
        st.session_state.combo += 1
        st.session_state.max_combo = max(st.session_state.max_combo, st.session_state.combo)

        # Scoring: base 10 + combo bonus
        bonus = min(st.session_state.combo * 5, 50)
        st.session_state.score += 10 + bonus

        # Star every 3 correct
        if st.session_state.total_correct % 3 == 0:
            st.session_state.stars_earned += 1

        st.session_state.animation_ts = time.time()
    else:
        # Wrong — gentle shake, no negative feedback
        st.session_state.show_wrong_feedback = True
        st.session_state.wrong_tile_id = f"opt_{tile_idx}"
        st.session_state.combo = 0  # reset combo


def advance_question():
    """Move to the next letter in the current group, or to the next group."""
    group = PHONETIC_GROUPS[st.session_state.current_group]
    next_idx = st.session_state.current_letter_idx + 1

    if next_idx >= len(group["letters"]):
        # Group complete!
        st.session_state.screen = "group_complete"
        st.session_state.current_letter_idx = 0
    else:
        st.session_state.current_letter_idx = next_idx

    st.session_state.needs_new_question = True
    st.session_state.show_correct_feedback = False


# ============================================================================
# SCREEN: GROUP COMPLETE CELEBRATION
# ============================================================================
def render_group_complete():
    group = PHONETIC_GROUPS[st.session_state.current_group]
    play_sound("levelup")

    # Lottie star animation
    lottie_data = load_lottie_url(LOTTIE_URLS["star"])
    if lottie_data:
        col_l, col_c, col_r = st.columns([1, 1.5, 1])
        with col_c:
            st_lottie(lottie_data, height=250, key=f"star_celebration_{st.session_state.current_group}")

    letters_learned = " ".join([l["letter"] for l in group["letters"]])

    complete_html = f"""
    <div style="
        position: relative; z-index: 2;
        text-align: center;
        animation: slideUp 0.6s ease-out;
    ">
        <div style="
            font-size: clamp(40px, 8vw, 70px);
            margin-bottom: 10px;
        ">🏆</div>
        <h2 style="
            font-family: 'Baloo 2', cursive !important;
            font-size: clamp(28px, 5vw, 48px);
            font-weight: 800;
            background: linear-gradient(135deg, #FFEAA7, #FDCB6E, #FF6B6B);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 0 10px;
        ">Tebrikler!</h2>
        <p style="
            color: rgba(255,255,255,0.8);
            font-size: clamp(18px, 3vw, 26px);
            font-weight: 600;
            margin-bottom: 5px;
        ">{group["group_name"]} tamamlandı!</p>
        <p style="
            color: rgba(255,255,255,0.5);
            font-size: clamp(14px, 2.5vw, 20px);
            margin-bottom: 25px;
        ">Öğrendiğin harfler: <b style="color: #FFEAA7; letter-spacing: 6px;">{letters_learned}</b></p>

        <!-- Stats Card -->
        <div style="
            display: inline-flex; gap: 30px;
            background: rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 20px 35px;
            border: 1px solid rgba(255,255,255,0.1);
            margin-bottom: 30px;
            flex-wrap: wrap;
            justify-content: center;
        ">
            <div style="text-align: center;">
                <div style="font-size: 28px;">⭐</div>
                <div style="color: #FFEAA7; font-size: 24px; font-weight: 800;">{st.session_state.stars_earned}</div>
                <div style="color: rgba(255,255,255,0.5); font-size: 12px;">Yıldız</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 28px;">🏆</div>
                <div style="color: #74B9FF; font-size: 24px; font-weight: 800;">{st.session_state.score}</div>
                <div style="color: rgba(255,255,255,0.5); font-size: 12px;">Puan</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 28px;">🔥</div>
                <div style="color: #FF6B6B; font-size: 24px; font-weight: 800;">{st.session_state.max_combo}x</div>
                <div style="color: rgba(255,255,255,0.5); font-size: 12px;">En İyi Kombo</div>
            </div>
        </div>
    </div>
    """
    st.markdown(complete_html, unsafe_allow_html=True)

    # Confetti burst
    confetti_particles = ""
    for i in range(30):
        left = random.randint(2, 98)
        delay = round(random.uniform(0, 1.2), 2)
        clr = random.choice(["#FF6B6B","#FFEAA7","#55EFC4","#74B9FF","#A29BFE","#FD79A8"])
        size = random.randint(6, 14)
        confetti_particles += f"""
        <div style="
            position: fixed; top: -10px; left: {left}%;
            width: {size}px; height: {size}px;
            background: {clr};
            border-radius: {random.choice(['50%','3px'])};
            animation: confettiFall {round(random.uniform(2, 4), 1)}s ease-out {delay}s forwards;
            z-index: 9999;
        "></div>"""
    st.markdown(confetti_particles, unsafe_allow_html=True)

    # Next group or Victory
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        next_group_idx = st.session_state.current_group + 1
        if next_group_idx < len(PHONETIC_GROUPS):
            next_group = PHONETIC_GROUPS[next_group_idx]
            if st.button(f"🚀 {next_group['group_name']} Başlasın!", key="next_group", use_container_width=True):
                st.session_state.current_group = next_group_idx
                st.session_state.current_letter_idx = 0
                st.session_state.groups_unlocked = max(st.session_state.groups_unlocked, next_group_idx + 1)
                st.session_state.needs_new_question = True
                st.session_state.screen = "game"
                st.rerun()
        else:
            if st.button("🏆 Zafer Ekranı!", key="victory_btn", use_container_width=True):
                st.session_state.screen = "victory"
                st.rerun()


# ============================================================================
# SCREEN: FINAL VICTORY
# ============================================================================
def render_victory():
    play_sound("levelup")

    lottie_data = load_lottie_url(LOTTIE_URLS["rocket"])
    if lottie_data:
        col_l, col_c, col_r = st.columns([1, 1.5, 1])
        with col_c:
            st_lottie(lottie_data, height=280, key="victory_rocket")

    victory_html = f"""
    <div style="
        position: relative; z-index: 2;
        text-align: center;
        animation: slideUp 0.8s ease-out;
    ">
        <h1 style="
            font-family: 'Baloo 2', cursive !important;
            font-size: clamp(36px, 8vw, 68px);
            font-weight: 900;
            background: linear-gradient(135deg, #FFEAA7, #FDCB6E, #FF6B6B, #E84393, #A29BFE);
            background-size: 300% 300%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbow 3s ease infinite;
            margin: 0 0 10px;
        ">🏆 SEN BİR ŞAMPİYONSUN! 🏆</h1>
        <p style="
            color: rgba(255,255,255,0.8);
            font-size: clamp(18px, 3vw, 28px);
            font-weight: 700;
            margin-bottom: 30px;
        ">Tüm harfleri öğrendin! Artık okumaya hazırsın! 📚</p>

        <div style="
            display: inline-flex; gap: 30px;
            background: rgba(255,255,255,0.08);
            border-radius: 25px;
            padding: 25px 40px;
            border: 1px solid rgba(255,255,255,0.1);
            flex-wrap: wrap; justify-content: center;
        ">
            <div style="text-align: center;">
                <div style="font-size: 36px;">⭐</div>
                <div style="color: #FFEAA7; font-size: 30px; font-weight: 800;">{st.session_state.stars_earned}</div>
                <div style="color: rgba(255,255,255,0.5); font-size: 14px;">Toplam Yıldız</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 36px;">🏆</div>
                <div style="color: #74B9FF; font-size: 30px; font-weight: 800;">{st.session_state.score}</div>
                <div style="color: rgba(255,255,255,0.5); font-size: 14px;">Toplam Puan</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 36px;">✅</div>
                <div style="color: #55EFC4; font-size: 30px; font-weight: 800;">{st.session_state.total_correct}</div>
                <div style="color: rgba(255,255,255,0.5); font-size: 14px;">Doğru Cevap</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 36px;">🔥</div>
                <div style="color: #FF6B6B; font-size: 30px; font-weight: 800;">{st.session_state.max_combo}x</div>
                <div style="color: rgba(255,255,255,0.5); font-size: 14px;">En İyi Kombo</div>
            </div>
        </div>
    </div>
    """
    st.markdown(victory_html, unsafe_allow_html=True)

    # Mega confetti
    confetti_particles = ""
    for i in range(40):
        left = random.randint(0, 100)
        delay = round(random.uniform(0, 2), 2)
        clr = random.choice(["#FF6B6B","#FFEAA7","#55EFC4","#74B9FF","#A29BFE","#FD79A8","#FDCB6E","#00B894"])
        size = random.randint(8, 16)
        confetti_particles += f"""
        <div style="
            position: fixed; top: -20px; left: {left}%;
            width: {size}px; height: {size}px;
            background: {clr};
            border-radius: {random.choice(['50%','3px'])};
            animation: confettiFall {round(random.uniform(2.5, 5), 1)}s ease-out {delay}s forwards;
            z-index: 9999;
        "></div>"""
    st.markdown(confetti_particles, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        if st.button("🔄 Baştan Başla!", key="restart", use_container_width=True):
            for key in list(st.session_state.keys()):
                del st.session_state[key]
            init_state()
            st.rerun()


# ============================================================================
# MAIN ROUTER
# ============================================================================
def main():
    screen = st.session_state.screen
    if screen == "splash":
        render_splash()
    elif screen == "game":
        render_game()
    elif screen == "group_complete":
        render_group_complete()
    elif screen == "victory":
        render_victory()
    else:
        render_splash()

main()
