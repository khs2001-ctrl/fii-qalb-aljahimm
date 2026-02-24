/**
 * في قلب الجحيم — Navigation & Mobile Menu
 */

(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // ── Scroll Effect ──
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        // Scrolled class
        if (y > 60) {
            navbar && navbar.classList.add('scrolled');
        } else {
            navbar && navbar.classList.remove('scrolled');
        }

        // Hide on scroll down, show on scroll up
        if (y > lastScroll && y > 200) {
            navbar && navbar.classList.add('nav-hidden');
        } else {
            navbar && navbar.classList.remove('nav-hidden');
        }
        lastScroll = y;
    }, { passive: true });

    // ── Mobile Menu Toggle ──
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuBtn.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuBtn.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('open');
                menuBtn.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ── Active Link ──
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === page) {
            link.classList.add('active');
        }
    });

})();
