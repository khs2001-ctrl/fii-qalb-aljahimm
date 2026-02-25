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

    // ── Mobile Menu Toggle ──
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuBtn.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuBtn.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
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
        if (href && href === page) link.classList.add('active');
    });

    // ── Inject FAQ Link in Nav ──
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && !navLinks.querySelector('a[href="faq.html"]')) {
        const readItem = navLinks.querySelector('a[href="read.html"]');
        if (readItem) {
            const faqLi = document.createElement('li');
            faqLi.innerHTML = '<a href="faq.html">الأسئلة</a>';
            readItem.closest('li').before(faqLi);
        }
    }

    // ── Mobile Bottom Navigation Bar ──
    const bottomNav = document.createElement('nav');
    bottomNav.className = 'mobile-bottom-nav';
    bottomNav.style.display = 'none';
    bottomNav.innerHTML = `
        <a href="index.html"><span class="nav-icon">🏠</span>الرئيسية</a>
        <a href="characters.html"><span class="nav-icon">👤</span>الشخصيات</a>
        <a href="gallery.html"><span class="nav-icon">🖼️</span>المعرض</a>
        <a href="read.html"><span class="nav-icon">📖</span>اقرأ</a>
        <a href="reviews.html"><span class="nav-icon">⭐</span>آراء</a>
        <a href="buy.html" class="nav-buy-btn"><span class="nav-icon">🛒</span>اشترِ</a>
    `;
    document.body.appendChild(bottomNav);
    bottomNav.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === page) link.classList.add('active');
    });

    // ── Skip to Content (Accessibility) ──
    if (!document.querySelector('.skip-to-content')) {
        const skip = document.createElement('a');
        skip.href = '#main-content';
        skip.className = 'skip-to-content';
        skip.textContent = 'تخطي إلى المحتوى';
        document.body.prepend(skip);
        const mainEl = document.querySelector('main');
        if (mainEl && !mainEl.id) mainEl.id = 'main-content';
    }

    // ── Reading Progress Bar ──
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);
    const progressFill = progressBar.querySelector('.reading-progress-fill');

    // ── Back to Top Button ──
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'العودة لأعلى');
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTop);

    // ── Single Unified Scroll Handler (rAF-throttled) ──
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                if (navbar) navbar.classList.toggle('scrolled', y > 60);
                if (navbar) navbar.classList.toggle('nav-hidden', y > lastScroll && y > 200);
                lastScroll = y;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                if (docHeight > 0) progressFill.style.width = (y / docHeight) * 100 + '%';
                backToTop.classList.toggle('visible', y > 500);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ── Inject Schema.org Book + Author JSON-LD (only on index) ──
    if (page === 'index.html' || page === '') {
        const schema = document.createElement('script');
        schema.type = 'application/ld+json';
        schema.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": "في قلب الجحيم",
            "author": {
                "@type": "Person",
                "name": "حنين سعد حايس",
                "url": "https://fii-qalb-aljahimm.vercel.app/author.html"
            },
            "publisher": {
                "@type": "Organization",
                "name": "دار ملاذ للنشر والتوزيع"
            },
            "datePublished": "2026-01",
            "genre": ["Crime Fiction", "Mystery", "Psychological Thriller"],
            "inLanguage": "ar",
            "numberOfPages": "250+",
            "image": "https://fii-qalb-aljahimm.vercel.app/assets/images/book-cover/Main Book Cover Image.jpeg",
            "url": "https://fii-qalb-aljahimm.vercel.app/",
            "description": "رواية تحقيق جنائي غامضة تدور في قرية نائية تُعرف بالجُب، حيث تتوالى الجرائم والخرافات"
        });
        document.head.appendChild(schema);
    }

    // ── View Transitions API (smooth page transitions) ──
    if ('startViewTransition' in document) {
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.startViewTransition(() => {
                    window.location.href = href;
                });
            });
        });
    }

    // ── Google Analytics Placeholder ──
    // Uncomment and replace GA_MEASUREMENT_ID with your actual GA4 ID:
    // <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'GA_MEASUREMENT_ID');

})();
