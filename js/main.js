/**
 * في قلب الجحيم — Main JavaScript
 * Scroll animations, counter, quotes, loading, Khalid credit
 */

(function () {
    'use strict';

    /* ─── Loading Screen ─── */
    const loader = document.getElementById('loadingScreen');
    if (loader) {
        const fill = loader.querySelector('.loading-fill');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.transition = 'opacity 0.6s ease';
                    setTimeout(() => { loader.style.display = 'none'; }, 650);
                }, 200);
            }
            if (fill) fill.style.width = progress + '%';
        }, 80);
    }

    /* ─── Scroll Reveal ─── */
    function initReveal() {
        const items = document.querySelectorAll('[data-reveal]');
        if (!items.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

        items.forEach(el => io.observe(el));
    }

    /* ─── Counter Animation ─── */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => io.observe(c));
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(eased * target);

            if (target === 48) {
                el.textContent = (eased * 4.8).toFixed(1);
            } else if (target === 2026) {
                el.textContent = Math.floor(2020 + eased * 6);
            } else {
                el.textContent = val + (target === 300 ? '+' : '');
            }

            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    /* ─── Quotes Slider ─── */
    function initQuotes() {
        const slides = document.querySelectorAll('.quote-slide');
        const dots = document.querySelectorAll('.quote-dot');
        if (!slides.length) return;

        let current = 0;
        let timer;

        function goTo(n) {
            slides[current].classList.remove('active');
            dots[current] && dots[current].classList.remove('active');
            current = (n + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots[current] && dots[current].classList.add('active');
        }

        function start() {
            timer = setInterval(() => goTo(current + 1), 4500);
        }

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(timer);
                goTo(i);
                start();
            });
        });

        start();
    }

    /* ─── Tilt Cards (desktop only, minimal) ─── */
    function initTiltCards() {
        if (window.matchMedia('(hover: none)').matches) return;
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-4px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ─── Smooth Anchor Scroll ─── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href').slice(1);
                const target = document.getElementById(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    /* ─── Khalid Credit Animation ─── */
    function initKhalidCredit() {
        const credit = document.getElementById('khalidCredit');
        if (!credit) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    credit.classList.add('credit-animate');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        io.observe(credit);
    }

    /* ─── Cursor Glow (disabled for performance) ─── */
    function initCursorGlow() {
        // Disabled: was running constant rAF loop
    }

    /* ─── Page Transition (non-blocking) ─── */
    function initPageTransitions() {
        const body = document.body;
        body.classList.add('page-enter');
        setTimeout(() => body.classList.remove('page-enter'), 10);
        // No longer intercepting clicks — links work natively
    }

    /* ─── FAQ Accordion (in case pages use it) ─── */
    function initFaq() {
        document.querySelectorAll('.faq-question').forEach(q => {
            // Handled via onclick in HTML — just ensure styles work
        });
    }

    /* ─── Modal Accessibility ─── */
    function initModals() {
        const overlay = document.querySelector('.modal-overlay');
        if (!overlay) return;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                overlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    /* ─── Animate Stats Row on Scroll ─── */
    function initStatCards() {
        const cards = document.querySelectorAll('.stat-card');
        if (!cards.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('stat-animated'), i * 120);
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        cards.forEach(c => io.observe(c));
    }

    /* ─── Image Performance Optimization ─── */
    function initImageOptimization() {
        // Auto lazy-load + async decode all images
        document.querySelectorAll('img').forEach(img => {
            if (!img.loading) img.loading = 'lazy';
            img.decoding = 'async';
            // Above-the-fold images (in first section) get high priority
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                img.loading = 'eager';
                img.fetchPriority = 'high';
            }
        });

        // Add content-visibility to off-screen sections for faster paint
        document.querySelectorAll('section').forEach((sec, i) => {
            if (i > 1) {
                sec.style.contentVisibility = 'auto';
                sec.style.containIntrinsicSize = '0 500px';
            }
        });
    }

    /* ─── Main Init ─── */
    document.addEventListener('DOMContentLoaded', () => {
        initImageOptimization();
        initReveal();
        initCounters();
        initQuotes();
        initTiltCards();
        initSmoothScroll();
        initKhalidCredit();
        initCursorGlow();
        initPageTransitions();
        initFaq();
        initModals();
        initStatCards();
    });

})();
