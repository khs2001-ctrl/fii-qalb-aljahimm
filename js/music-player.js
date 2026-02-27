/* ══════════════════════════════════════════════════════════
   Background Music Player — في قلب الجحيم
   Injects audio element + floating toggle button on every page.
   Persists play/mute state via localStorage.
   ══════════════════════════════════════════════════════════ */
(function () {
    // Don't inject if already present (index.html has its own inline version)
    if (document.getElementById('bgMusic')) return;

    /* ── Inject CSS ── */
    const style = document.createElement('style');
    style.textContent = `
    .music-toggle {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 9998;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 2px solid rgba(212,175,55,0.5);
      background: linear-gradient(145deg, rgba(20,20,28,0.95), rgba(10,10,15,0.95));
      color: #D4AF37;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 4px 20px rgba(0,0,0,0.5),
        0 0 30px rgba(196,30,58,0.15),
        inset 0 1px 0 rgba(255,255,255,0.05);
      transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      animation: musicBtnAppear 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
      opacity: 0;
      transform: scale(0.5);
    }
    .music-toggle:hover {
      transform: scale(1.12);
      border-color: #D4AF37;
      box-shadow:
        0 6px 30px rgba(0,0,0,0.6),
        0 0 40px rgba(212,175,55,0.25),
        inset 0 1px 0 rgba(255,255,255,0.1);
    }
    .music-toggle:active { transform: scale(0.95); }
    .music-toggle.playing {
      border-color: rgba(196,30,58,0.7);
      animation: musicBtnAppear 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, musicPulse 2.5s ease-in-out infinite 0.6s;
    }
    @keyframes musicBtnAppear { to { opacity: 1; transform: scale(1); } }
    @keyframes musicPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 30px rgba(196,30,58,0.15); }
      50% { box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 50px rgba(196,30,58,0.35), 0 0 80px rgba(196,30,58,0.1); }
    }
    .music-toggle .music-icon {
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s ease;
    }
    .music-toggle .music-label {
      position: absolute; left: 68px; white-space: nowrap;
      font-size: 13px; color: #D4AF37;
      background: rgba(15,15,20,0.95);
      border: 1px solid rgba(212,175,55,0.2);
      padding: 6px 14px; border-radius: 8px;
      opacity: 0; transform: translateX(-8px);
      pointer-events: none; transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }
    .music-toggle:hover .music-label { opacity: 1; transform: translateX(0); }
    .sound-bars { display: flex; align-items: flex-end; gap: 3px; height: 20px; }
    .sound-bars .bar {
      width: 3px; background: #D4AF37; border-radius: 2px;
      animation: soundBar 1s ease-in-out infinite;
    }
    .sound-bars .bar:nth-child(1) { height: 8px; animation-delay: 0s; }
    .sound-bars .bar:nth-child(2) { height: 14px; animation-delay: 0.15s; }
    .sound-bars .bar:nth-child(3) { height: 10px; animation-delay: 0.3s; }
    .sound-bars .bar:nth-child(4) { height: 16px; animation-delay: 0.45s; }
    .music-toggle:not(.playing) .sound-bars .bar {
      animation: none; height: 3px !important;
    }
    @keyframes soundBar {
      0%, 100% { transform: scaleY(0.5); }
      50% { transform: scaleY(1.3); }
    }
    @media (max-width: 768px) {
      .music-toggle { width: 48px; height: 48px; bottom: 18px; left: 18px; font-size: 20px; }
      .music-toggle .music-label { display: none; }
    }
  `;
    document.head.appendChild(style);

    /* ── Inject Audio ── */
    const audio = document.createElement('audio');
    audio.id = 'bgMusic';
    audio.loop = true;
    audio.preload = 'auto';
    audio.innerHTML = '<source src="assets/audio/horror-intro.mp3" type="audio/mpeg">';
    document.body.appendChild(audio);

    /* ── Inject Toggle Button ── */
    const btn = document.createElement('button');
    btn.className = 'music-toggle';
    btn.id = 'musicToggle';
    btn.setAttribute('aria-label', 'تشغيل/إيقاف الموسيقى');
    btn.title = 'تشغيل/إيقاف الموسيقى';
    btn.innerHTML = `
    <span class="music-icon">
      <span class="sound-bars">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </span>
    </span>
    <span class="music-label">🎵 الموسيقى</span>
  `;
    document.body.appendChild(btn);

    /* ── Toggle Logic ── */
    btn.addEventListener('click', function () {
        if (audio.paused) {
            audio.volume = 0.4;
            audio.play().then(function () {
                btn.classList.add('playing');
                localStorage.setItem('musicPlaying', 'true');
            }).catch(function () { });
        } else {
            audio.pause();
            btn.classList.remove('playing');
            localStorage.setItem('musicPlaying', 'false');
        }
    });

    /* ── Auto-resume if was playing on previous page ── */
    var wasPlaying = localStorage.getItem('musicPlaying');
    if (wasPlaying === 'true') {
        audio.volume = 0.4;
        audio.play().then(function () {
            btn.classList.add('playing');
        }).catch(function () { });
    }
})();
