/* ═══════════════════════════════════════════════════
   GSAP Enhancements — في قلب الجحيم
   Additive animation layer on top of existing main.js
   Requires: GSAP 3 + ScrollTrigger + ScrollToPlugin
   ═══════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Wait for GSAP ──
    if (typeof gsap === 'undefined') {
        console.warn('[gsap-enhancements] GSAP not loaded');
        return;
    }

    // ── Respect reduced motion ──
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        console.info('[gsap-enhancements] Reduced motion detected — animations disabled');
        return;
    }

    // ── Register plugins ──
    gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

    // ── Global defaults ──
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });

    // ═══════════════════════════════════
    // 1. SCROLL PROGRESS BAR
    // ═══════════════════════════════════
    function initProgressBar() {
        // Create progress bar if not exists
        if (!document.querySelector('.gsap-progress-bar')) {
            const bar = document.createElement('div');
            bar.className = 'gsap-progress-bar';
            bar.innerHTML = '<div class="gsap-progress-fill"></div>';
            document.body.prepend(bar);
        }

        const fill = document.querySelector('.gsap-progress-fill');
        if (!fill) return;

        gsap.to(fill, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.documentElement,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }

    // ═══════════════════════════════════
    // 2. SCROLL REVEALS ([data-reveal])
    // ═══════════════════════════════════
    function initReveals() {
        gsap.utils.toArray('[data-reveal]').forEach(el => {
            // Check if already revealed by main.js
            if (el.classList.contains('revealed')) return;

            const direction = el.dataset.reveal || 'up';
            const fromVars = { opacity: 0, y: 0, x: 0, scale: 1, rotate: 0 };

            switch (direction) {
                case 'left': fromVars.x = -60; break;
                case 'right': fromVars.x = 60; break;
                case 'down': fromVars.y = -40; break;
                case 'scale': fromVars.scale = 0.85; fromVars.opacity = 0; break;
                default: fromVars.y = 50; break; // 'up' or empty
            }

            fromVars.opacity = 0;

            gsap.fromTo(el, fromVars, {
                opacity: 1, y: 0, x: 0, scale: 1,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                onComplete: () => el.classList.add('revealed')
            });
        });
    }

    // ═══════════════════════════════════
    // 3. STAGGER CHILDREN ([data-stagger])
    // ═══════════════════════════════════
    function initStagger() {
        gsap.utils.toArray('[data-stagger]').forEach(container => {
            const children = container.children;
            if (!children.length) return;

            const delay = parseFloat(container.dataset.stagger) || 0.12;

            gsap.fromTo(children,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.7,
                    stagger: delay,
                    ease: 'back.out(1.4)',
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
    // 4. PARALLAX ([data-parallax])
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
                        trigger: el.closest('section') || el.parentElement || el,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            );
        });
    }

    // ═══════════════════════════════════
    // 5. COUNTER ANIMATION ([data-count])
    // ═══════════════════════════════════
    function initCounters() {
        gsap.utils.toArray('[data-count]').forEach(el => {
            // Skip if already animated
            if (el.dataset.gsapCounted) return;
            el.dataset.gsapCounted = 'true';

            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const isDecimal = el.dataset.decimal;
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
                    if (isDecimal) {
                        el.textContent = (obj.val * parseFloat(isDecimal)).toFixed(1) + suffix;
                    } else if (target === 2026) {
                        el.textContent = Math.floor(2020 + (obj.val / target) * 6) + suffix;
                    } else {
                        el.textContent = Math.floor(obj.val) + suffix;
                    }
                }
            });
        });
    }

    // ═══════════════════════════════════
    // 6. MAGNETIC BUTTONS
    // ═══════════════════════════════════
    function initMagneticButtons() {
        if (window.matchMedia('(hover: none)').matches) return;

        document.querySelectorAll('.btn-primary, .btn-outline, .buy-cta, .intro-gate-btn').forEach(btn => {
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
                gsap.to(btn, {
                    x: 0, y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        });
    }

    // ═══════════════════════════════════
    // 7. SPLIT TEXT UTILITY
    // ═══════════════════════════════════
    function splitText(el) {
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
        return el.querySelectorAll('.split-char');
    }

    // ═══════════════════════════════════
    // 8. NAV SCROLL EFFECT
    // ═══════════════════════════════════
    function initNavScroll() {
        const nav = document.querySelector('.main-nav');
        if (!nav || nav.classList.contains('scrolled')) return;

        ScrollTrigger.create({
            start: 'top -80',
            onUpdate: (self) => {
                nav.classList.toggle('scrolled', self.scroll() > 80);
            }
        });
    }

    // ═══════════════════════════════════
    // 9. BACK TO TOP
    // ═══════════════════════════════════
    function initBackToTop() {
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
    // 10. RIPPLE EFFECT
    // ═══════════════════════════════════
    function addRipple(e) {
        const btn = e.currentTarget;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-wave');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);

        gsap.fromTo(ripple,
            { scale: 0, opacity: 0.5 },
            {
                scale: 1, opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
            }
        );
    }

    function initRipple() {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.classList.add('btn-ripple');
            btn.addEventListener('click', addRipple);
        });
    }

    // ═══════════════════════════════════
    // PAGE-SPECIFIC: INDEX.HTML
    // ═══════════════════════════════════
    function initIndexPage() {
        const introGate = document.getElementById('introGate');
        if (!introGate) return;

        // Enhanced Intro Gate Animation
        const titleEl = introGate.querySelector('.intro-gate-title');
        if (titleEl) {
            const fullText = titleEl.textContent.trim();
            const part1 = 'في قلب ';
            const part2 = 'الجحيم';

            titleEl.innerHTML = '';

            // Create spans for part1
            const chars1Frag = document.createDocumentFragment();
            part1.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.display = 'inline-block';
                span.style.opacity = '0';
                span.classList.add('split-char');
                chars1Frag.appendChild(span);
            });

            // Create glitch span for part2
            const glitchSpan = document.createElement('span');
            glitchSpan.textContent = part2;
            glitchSpan.classList.add('glitch-text');
            glitchSpan.dataset.text = part2;
            glitchSpan.style.opacity = '0';
            glitchSpan.style.display = 'inline-block';

            titleEl.appendChild(chars1Frag);
            titleEl.appendChild(glitchSpan);

            // Timeline for intro
            const introTl = gsap.timeline({ delay: 0.5 });

            // Part 1: letters appear one by one
            introTl.fromTo(titleEl.querySelectorAll('.split-char'),
                { opacity: 0, y: 20, rotateX: -30 },
                { opacity: 1, y: 0, rotateX: 0, stagger: 0.08, duration: 0.5, ease: 'back.out(1.4)' }
            );

            // Part 2: "الجحيم" explodes with glitch
            introTl.to(glitchSpan, {
                opacity: 1,
                scale: 1,
                duration: 0.1,
                onStart: () => glitchSpan.classList.add('glitching')
            }, '+=0.2');

            introTl.fromTo(glitchSpan,
                { opacity: 0, scale: 1.5, filter: 'blur(8px)' },
                {
                    opacity: 1, scale: 1, filter: 'blur(0px)',
                    duration: 0.8,
                    ease: 'power4.out',
                    onComplete: () => {
                        setTimeout(() => glitchSpan.classList.remove('glitching'), 300);
                    }
                },
                '<'
            );

            // Subtitle fade in
            const subEl = introGate.querySelector('.intro-gate-sub');
            if (subEl) {
                introTl.fromTo(subEl,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.6 },
                    '-=0.3'
                );
            }

            // Button appear
            const btnEl = introGate.querySelector('.intro-gate-btn');
            if (btnEl) {
                introTl.fromTo(btnEl,
                    { opacity: 0, y: 20, scale: 0.9 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)' },
                    '-=0.2'
                );
            }
        }

        // Hero split text
        const heroTitle = document.querySelector('.hero-title .title-main');
        const heroAccent = document.querySelector('.hero-title .title-accent');

        if (heroTitle && heroAccent) {
            // Wait for intro dismissal then animate hero
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    if (introGate.classList.contains('dismissed')) {
                        observer.disconnect();
                        setTimeout(() => animateHero(heroTitle, heroAccent), 800);
                    }
                });
            });
            observer.observe(introGate, { attributes: true, attributeFilter: ['class'] });
        }

        // Features stagger - add data-stagger attribute
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid && !featuresGrid.dataset.stagger) {
            featuresGrid.dataset.stagger = '0.15';
        }

        // Events grid stagger
        const eventsGrid = document.querySelector('.events-grid');
        if (eventsGrid && !eventsGrid.dataset.stagger) {
            eventsGrid.dataset.stagger = '0.12';
        }

        // CTA particle burst
        const ctaBtn = document.querySelector('.cta-section .btn-primary');
        if (ctaBtn) {
            ctaBtn.addEventListener('mouseenter', () => createParticleBurst(ctaBtn));
        }
    }

    function animateHero(titleMain, titleAccent) {
        const tl = gsap.timeline();

        // Split title-main for char-by-char
        const mainChars = splitText(titleMain);
        tl.fromTo(mainChars,
            { opacity: 0, x: 30, rotateY: -20 },
            { opacity: 1, x: 0, rotateY: 0, stagger: 0.04, duration: 0.5, ease: 'power3.out' }
        );

        // Title accent appears with scale + glow
        tl.fromTo(titleAccent,
            { opacity: 0, scale: 0.8, filter: 'blur(6px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' },
            '-=0.2'
        );

        // Animate about section parallax
        const aboutVisual = document.querySelector('.about-visual');
        const aboutContent = document.querySelector('.about-content');
        if (aboutVisual) {
            gsap.fromTo(aboutVisual,
                { x: -80, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: aboutVisual, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
        }
        if (aboutContent) {
            gsap.fromTo(aboutContent,
                { x: 60, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: aboutContent, start: 'top 85%', toggleActions: 'play none none none' }
                }
            );
        }
    }

    function createParticleBurst(el) {
        const rect = el.getBoundingClientRect();
        const count = 12;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        border-radius: 50%;
        background: ${Math.random() > 0.5 ? '#D4AF37' : '#C41E3A'};
        pointer-events: none;
        z-index: 9999;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
      `;
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5);
            const distance = Math.random() * 60 + 30;

            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 0,
                duration: 0.6 + Math.random() * 0.4,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }
    }

    // ═══════════════════════════════════
    // PAGE-SPECIFIC: READ.HTML
    // ═══════════════════════════════════
    function initReadPage() {
        const readerLayout = document.querySelector('.reader-layout');
        if (!readerLayout) return;

        // GSAP scroll progress (enhance existing)
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            gsap.to(progressFill, {
                width: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: document.documentElement,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.2
                }
            });
        }

        // Paragraph reveals
        const proseEls = document.querySelectorAll('.prose p, .prose .whisper');
        proseEls.forEach((p, i) => {
            gsap.fromTo(p,
                { opacity: 0.3, y: 20 },
                {
                    opacity: 1, y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: p,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // Enhanced chapter switching
        const origSwitchChapter = window.switchChapter;
        if (origSwitchChapter) {
            window.switchChapter = function (id) {
                const activeSection = document.querySelector('.chapter-section.active');
                if (activeSection) {
                    gsap.to(activeSection, {
                        opacity: 0, x: -30,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            origSwitchChapter(id);
                            const newSection = document.querySelector('.chapter-section.active');
                            if (newSection) {
                                gsap.fromTo(newSection,
                                    { opacity: 0, x: 30 },
                                    { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
                                );
                                // Re-animate paragraphs in new section
                                newSection.querySelectorAll('.prose p, .prose .whisper').forEach(p => {
                                    gsap.fromTo(p,
                                        { opacity: 0.3, y: 15 },
                                        {
                                            opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
                                            scrollTrigger: { trigger: p, start: 'top 92%', toggleActions: 'play none none none' }
                                        }
                                    );
                                });
                            }
                        }
                    });
                } else {
                    origSwitchChapter(id);
                }
            };
        }
    }

    // ═══════════════════════════════════
    // PAGE-SPECIFIC: AUTHOR.HTML
    // ═══════════════════════════════════
    function initAuthorPage() {
        const authorHero = document.querySelector('.author-hero');
        if (!authorHero) return;

        // Curtain reveal for photo
        const photoFrame = document.querySelector('.author-photo-frame');
        if (photoFrame) {
            gsap.fromTo(photoFrame,
                { clipPath: 'inset(0 0 100% 0)' },
                {
                    clipPath: 'inset(0 0 0% 0)',
                    duration: 1.2,
                    ease: 'power4.inOut',
                    delay: 0.3
                }
            );
        }

        // Timeline milestones stagger
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, i) => {
            const marker = item.querySelector('.timeline-marker');

            gsap.fromTo(item,
                { opacity: 0, x: 40 },
                {
                    opacity: 1, x: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            if (marker) {
                gsap.fromTo(marker,
                    { scale: 0, opacity: 0 },
                    {
                        scale: 1, opacity: 1,
                        duration: 0.5,
                        ease: 'back.out(2)',
                        scrollTrigger: {
                            trigger: item,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        });

        // Photos parallax
        const photoItems = document.querySelectorAll('.photo-item');
        photoItems.forEach((photo, i) => {
            const speed = 0.1 + (i * 0.08);
            gsap.fromTo(photo,
                { yPercent: -speed * 15 },
                {
                    yPercent: speed * 15,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: photo.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            );
        });

        // Typewriter for pull quote
        const pullText = document.querySelector('.bio-pull-text');
        if (pullText) {
            const text = pullText.textContent;
            pullText.textContent = '';
            pullText.classList.add('typewriter-cursor');

            ScrollTrigger.create({
                trigger: pullText,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    let i = 0;
                    const typeInterval = setInterval(() => {
                        pullText.textContent += text[i];
                        i++;
                        if (i >= text.length) {
                            clearInterval(typeInterval);
                            pullText.classList.remove('typewriter-cursor');
                        }
                    }, 25);
                }
            });
        }
    }

    // ═══════════════════════════════════
    // PAGE-SPECIFIC: BUY.HTML
    // ═══════════════════════════════════
    function initBuyPage() {
        const buyPage = document.querySelector('.buy-page');
        if (!buyPage) return;

        // 3D book mouse tracking
        const book3d = document.querySelector('.book-3d');
        if (book3d && !window.matchMedia('(hover: none)').matches) {
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 10;
                gsap.to(book3d, {
                    rotateY: -15 + x,
                    rotateX: y,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });
        }

        // Reason cards stagger
        const reasonCards = document.querySelectorAll('.reason-card');
        if (reasonCards.length) {
            reasonCards.forEach((card, i) => {
                const numEl = card.querySelector('.reason-num');

                gsap.fromTo(card,
                    { opacity: 0, x: 60 },
                    {
                        opacity: 1, x: 0,
                        duration: 0.7,
                        delay: i * 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 88%',
                            toggleActions: 'play none none none'
                        }
                    }
                );

                // Animate number icon
                if (numEl) {
                    gsap.fromTo(numEl,
                        { scale: 0, rotate: -10 },
                        {
                            scale: 1, rotate: 0,
                            duration: 0.5,
                            delay: i * 0.15 + 0.2,
                            ease: 'back.out(2)',
                            scrollTrigger: {
                                trigger: card,
                                start: 'top 88%',
                                toggleActions: 'play none none none'
                            }
                        }
                    );
                }
            });
        }

        // Price counter animation
        const priceNow = document.querySelector('.price-now');
        if (priceNow) {
            const target = parseInt(priceNow.textContent) || 153;
            priceNow.textContent = '0';
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: priceNow,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    priceNow.textContent = Math.floor(obj.val);
                }
            });
        }

        // Final CTA ambient glow
        const finalCta = document.querySelector('.final-cta');
        if (finalCta) {
            finalCta.classList.add('cta-ambient-glow');
        }
    }

    // ═══════════════════════════════════
    // PAGE-SPECIFIC: REVIEWS.HTML
    // ═══════════════════════════════════
    function initReviewsPage() {
        const reviewsHero = document.querySelector('.reviews-hero');
        if (!reviewsHero) return;

        // Stats counter animation
        const totalEl = document.getElementById('totalReviews');
        const avgEl = document.getElementById('avgRating');
        // These will be animated by Supabase data loading, so we add a subtle entry animation
        if (totalEl) {
            gsap.fromTo(totalEl.parentElement,
                { opacity: 0, y: 20, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.3, ease: 'back.out(1.4)' }
            );
        }

        // Form focus animations
        document.querySelectorAll('.review-form-card .form-input, .review-form-card .form-textarea').forEach(input => {
            input.classList.add('form-input-enhanced');
            input.addEventListener('focus', () => {
                gsap.to(input, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
            });
            input.addEventListener('blur', () => {
                gsap.to(input, { scale: 1, duration: 0.3, ease: 'power2.out' });
            });
        });

        // Submit button ripple
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.classList.add('btn-ripple');
            submitBtn.addEventListener('click', addRipple);
        }
    }

    // ═══════════════════════════════════
    // PAGE-SPECIFIC: CHARACTERS.HTML
    // ═══════════════════════════════════
    function initCharactersPage() {
        // 3D tilt for character cards
        if (window.matchMedia('(hover: none)').matches) return;
        document.querySelectorAll('.character-card, .char-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(card, {
                    rotateY: x * 12,
                    rotateX: -y * 8,
                    scale: 1.03,
                    duration: 0.4,
                    ease: 'power2.out',
                    transformPerspective: 800
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateY: 0, rotateX: 0, scale: 1,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    // ═══════════════════════════════════
    // PAGE-SPECIFIC: GALLERY.HTML
    // ═══════════════════════════════════
    function initGalleryPage() {
        const galleryItems = document.querySelectorAll('.gallery-item, .photo-item');
        if (!galleryItems.length) return;

        galleryItems.forEach((item, i) => {
            gsap.fromTo(item,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.6,
                    delay: (i % 4) * 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // ═══════════════════════════════════
    // SIMPLE REVEALS (secondary pages)
    // ═══════════════════════════════════
    function initSimpleReveals() {
        // For pages like contact, faq, 404, about-book
        gsap.utils.toArray('.section-container, .section-header').forEach(el => {
            if (el.closest('[data-reveal]') || el.dataset.reveal !== undefined) return;
            // Only if not already handled
        });
    }

    // ═══════════════════════════════════
    // VIEW TRANSITIONS API
    // ═══════════════════════════════════
    function initPageTransitions() {
        if (!document.startViewTransition) return;

        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || link.target === '_blank') return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.startViewTransition(() => {
                    window.location.href = href;
                });
            });
        });
    }

    // ═══════════════════════════════════
    // INIT ALL
    // ═══════════════════════════════════
    function init() {
        // Global features
        initProgressBar();
        initReveals();
        initStagger();
        initParallax();
        initCounters();
        initMagneticButtons();
        initNavScroll();
        initBackToTop();
        initRipple();
        initPageTransitions();

        // Page-specific
        initIndexPage();
        initReadPage();
        initAuthorPage();
        initBuyPage();
        initReviewsPage();
        initCharactersPage();
        initGalleryPage();
        initSimpleReveals();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // If deferred, DOM is ready
        init();
    }

    // Expose utilities
    window.gsapEnhancements = {
        splitText,
        createParticleBurst,
        addRipple
    };

})();
