/* ═══════════════════════════════════════════════════
   GSAP Controller — في قلب الجحيم
   Handles: ScrollTrigger reveals, split text, page-specific timelines
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    // Wait for GSAP to load
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }

    // Register plugins
    gsap.registerPlugin(ScrollTrigger);

    // ── Global defaults ──
    gsap.defaults({
        ease: 'power3.out',
        duration: 1
    });

    // ═══════════════════════════════════
    // SCROLL-TRIGGERED REVEALS
    // ═══════════════════════════════════
    function initReveals() {
        // Standard reveal (fade up)
        gsap.utils.toArray('.reveal').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Reveal from left
        gsap.utils.toArray('.reveal-left').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, x: -60 },
                {
                    opacity: 1, x: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Reveal from right
        gsap.utils.toArray('.reveal-right').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, x: 60 },
                {
                    opacity: 1, x: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Reveal scale
        gsap.utils.toArray('.reveal-scale').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, scale: 0.85 },
                {
                    opacity: 1, scale: 1,
                    duration: 0.9,
                    ease: 'back.out(1.4)',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // ═══════════════════════════════════
    // STAGGER CHILDREN
    // ═══════════════════════════════════
    function initStagger() {
        gsap.utils.toArray('[data-stagger]').forEach(container => {
            const children = container.children;
            if (!children.length) return;

            gsap.fromTo(children,
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0,
                    duration: 0.7,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // ═══════════════════════════════════
    // SPLIT TEXT ANIMATION
    // ═══════════════════════════════════
    function splitTextAnimate(el, options = {}) {
        const text = el.textContent;
        el.textContent = '';
        el.style.opacity = '1';

        const chars = text.split('');
        const fragment = document.createDocumentFragment();

        chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.classList.add('split-char');
            fragment.appendChild(span);
        });

        el.appendChild(fragment);

        return gsap.fromTo(el.querySelectorAll('.split-char'),
            { opacity: 0, y: 30, rotateX: -40 },
            {
                opacity: 1, y: 0, rotateX: 0,
                duration: options.duration || 0.6,
                stagger: options.stagger || 0.03,
                ease: options.ease || 'power3.out',
                delay: options.delay || 0,
                ...options
            }
        );
    }

    // ═══════════════════════════════════
    // PARALLAX IMAGES
    // ═══════════════════════════════════
    function initParallax() {
        gsap.utils.toArray('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.2;

            gsap.fromTo(el,
                { yPercent: -speed * 20 },
                {
                    yPercent: speed * 20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: el.parentElement || el,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            );
        });
    }

    // ═══════════════════════════════════
    // COUNTER ANIMATION
    // ═══════════════════════════════════
    function initCounters() {
        gsap.utils.toArray('[data-count]').forEach(el => {
            const target = parseFloat(el.dataset.count);
            const isDecimal = target % 1 !== 0;
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    el.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val);
                    const suffix = el.dataset.suffix || '';
                    if (suffix) el.textContent += suffix;
                }
            });
        });
    }

    // ═══════════════════════════════════
    // NAV SCROLL EFFECT
    // ═══════════════════════════════════
    function initNavScroll() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        ScrollTrigger.create({
            start: 'top -80',
            onUpdate: (self) => {
                nav.classList.toggle('scrolled', self.scroll() > 80);
            }
        });
    }

    // ═══════════════════════════════════
    // PROGRESS BAR
    // ═══════════════════════════════════
    function initProgressBar() {
        const fill = document.querySelector('.progress-fill');
        if (!fill) return;

        gsap.to(fill, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }

    // ═══════════════════════════════════
    // BACK TO TOP
    // ═══════════════════════════════════
    function initBackTop() {
        const btn = document.getElementById('backTop');
        if (!btn) return;

        ScrollTrigger.create({
            start: 'top -400',
            onUpdate: (self) => {
                btn.classList.toggle('visible', self.scroll() > 400);
            }
        });

        btn.addEventListener('click', () => {
            gsap.to(window, { scrollTo: { y: 0 }, duration: 1, ease: 'power3.inOut' });
        });
    }

    // ═══════════════════════════════════
    // MAGNETIC BUTTONS (Motion One style)
    // ═══════════════════════════════════
    function initMagneticBtns() {
        document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.15,
                    y: y * 0.15,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    // ═══════════════════════════════════
    // INIT ALL
    // ═══════════════════════════════════
    function init() {
        initNavScroll();
        initReveals();
        initStagger();
        initParallax();
        initCounters();
        initProgressBar();
        initBackTop();
        initMagneticBtns();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose splitTextAnimate for page-specific use
    window.splitTextAnimate = splitTextAnimate;

})();
