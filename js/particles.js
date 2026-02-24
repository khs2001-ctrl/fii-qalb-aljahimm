/**
 * في قلب الجحيم — Particle System
 * Per-page animated backgrounds with canvas-based particles
 */

(function () {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let W = 0, H = 0;
    let animId;

    // Detect current page for unique backgrounds
    const path = window.location.pathname.toLowerCase();
    let pageTheme = 'home';
    if (path.includes('character')) pageTheme = 'characters';
    else if (path.includes('gallery')) pageTheme = 'gallery';
    else if (path.includes('contact')) pageTheme = 'contact';
    else if (path.includes('author')) pageTheme = 'author';
    else if (path.includes('read')) pageTheme = 'read';
    else if (path.includes('about')) pageTheme = 'about';
    else if (path.includes('buy')) pageTheme = 'buy';

    const themes = {
        home: {
            count: 60,
            colors: ['#C41E3A', '#D4AF37', '#FF6B35'],
            speed: { vx: [-0.3, 0.3], vy: [-0.8, -0.2] },
            sizeRange: [1, 3],
            opacity: 0.5,
            glow: true
        },
        characters: {
            count: 35,
            colors: ['#1A3A1A', '#2D5A2D', '#D4AF37', '#1A1A2A'],
            speed: { vx: [-0.15, 0.15], vy: [-0.3, -0.05] },
            sizeRange: [1.5, 4],
            opacity: 0.3,
            glow: false
        },
        gallery: {
            count: 50,
            colors: ['#CCCCCC', '#888888', '#D4AF37'],
            speed: { vx: [-0.4, 0.4], vy: [-0.1, 0.1] },
            sizeRange: [1, 2.5],
            opacity: 0.25,
            glow: false
        },
        contact: {
            count: 20,
            colors: ['#D4AF37', '#1A1A2A'],
            speed: { vx: [-0.1, 0.1], vy: [-0.2, -0.05] },
            sizeRange: [1, 2],
            opacity: 0.2,
            glow: true
        },
        author: {
            count: 25,
            colors: ['#D4AF37', '#F0D060', '#C8C8C8'],
            speed: { vx: [-0.08, 0.08], vy: [-0.15, -0.03] },
            sizeRange: [1, 2],
            opacity: 0.35,
            glow: false
        },
        read: {
            count: 15,
            colors: ['#C41E3A', '#8B0000'],
            speed: { vx: [-0.05, 0.05], vy: [-0.1, -0.02] },
            sizeRange: [0.8, 1.5],
            opacity: 0.15,
            glow: false
        },
        about: {
            count: 40,
            colors: ['#C41E3A', '#D4AF37'],
            speed: { vx: [-0.2, 0.2], vy: [-0.5, -0.1] },
            sizeRange: [1, 2.5],
            opacity: 0.4,
            glow: true
        },
        buy: {
            count: 30,
            colors: ['#D4AF37', '#F0D060', '#C41E3A'],
            speed: { vx: [-0.2, 0.2], vy: [-0.6, -0.15] },
            sizeRange: [1, 3],
            opacity: 0.45,
            glow: true
        }
    };

    const theme = themes[pageTheme] || themes.home;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function random(min, max) { return Math.random() * (max - min) + min; }

    function createParticle() {
        const colorIdx = Math.floor(Math.random() * theme.colors.length);
        return {
            x: random(0, W),
            y: random(0, H),
            vx: random(theme.speed.vx[0], theme.speed.vx[1]),
            vy: random(theme.speed.vy[0], theme.speed.vy[1]),
            size: random(theme.sizeRange[0], theme.sizeRange[1]),
            life: 0,
            maxLife: random(120, 300),
            color: theme.colors[colorIdx],
            opacity: 0,
        };
    }

    function spawnParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) {
            const p = createParticle();
            p.life = random(0, p.maxLife);
            particles.push(p);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life++;
            p.x += p.vx;
            p.y += p.vy;

            // Fade in / out
            if (p.life < 30) {
                p.opacity = p.life / 30;
            } else if (p.life > p.maxLife - 40) {
                p.opacity = (p.maxLife - p.life) / 40;
            } else {
                p.opacity = 0.6;
            }

            // Recycle
            if (p.life >= p.maxLife) {
                particles[i] = createParticle();
                continue;
            }

            // Draw
            ctx.save();
            ctx.globalAlpha = p.opacity * theme.opacity;
            ctx.fillStyle = p.color;

            if (theme.glow) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        animId = requestAnimationFrame(draw);
    }

    function init() {
        resize();
        const count = Math.min(theme.count, Math.floor(W / 18));
        spawnParticles(Math.min(count, 80));
        draw();
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animId);
        resize();
        init();
    });

    // Reduce motion support
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        init();
    }
})();
