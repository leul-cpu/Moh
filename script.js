document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileBtn.querySelector('i');

    const toggleMenu = () => {
        mobileMenu.classList.toggle('active');
        if (mobileMenu.classList.contains('active')) {
            menuIcon.classList.replace('ph-list', 'ph-x');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            menuIcon.classList.replace('ph-x', 'ph-list');
            document.body.style.overflow = '';
        }
    };

    mobileBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initial check in case of refresh
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Email link: try device mail app first, then fallback to Gmail compose.
    const emailContactLink = document.getElementById('email-contact-link');
    if (emailContactLink) {
        emailContactLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mailtoUrl = 'mailto:Mohammedalewi7@gmail.com?subject=Project%20Inquiry&body=Hi%20Mohammed%2C%0A%0AI%20would%20like%20to%20work%20with%20you%20on%20...';
            const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=Mohammedalewi7@gmail.com&su=Project%20Inquiry&body=Hi%20Mohammed%2C%0A%0AI%20would%20like%20to%20work%20with%20you%20on%20...';

            let pageHidden = false;
            const onVisibilityChange = () => {
                if (document.hidden) pageHidden = true;
            };
            document.addEventListener('visibilitychange', onVisibilityChange);

            window.location.href = mailtoUrl;

            setTimeout(() => {
                document.removeEventListener('visibilitychange', onVisibilityChange);
                if (!pageHidden) {
                    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
                }
            }, 900);
        });
    }

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once it has become visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Private Videos Logic ---
    const privateVideos = document.querySelectorAll('.main-video');
    
    // 1. Pause other videos when one is played
    privateVideos.forEach(video => {
        video.addEventListener('play', () => {
            privateVideos.forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            });
        });
    });

    // 2. Pause video if it scrolls out of view
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && !entry.target.paused) {
                entry.target.pause();
            }
        });
    }, { threshold: 0.1 });

    privateVideos.forEach(video => {
        videoObserver.observe(video);
    });

    // --- Portfolio Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const emptyState = document.getElementById('portfolio-empty-state');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hide the empty state message once a filter is clicked
            if (emptyState) {
                emptyState.classList.add('hidden');
            }

            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                // Ignore cards not in the filterable grid
                if (!card.closest('.modern-portfolio-grid')) return;
                
                let shouldShow = false;
                if (filterValue === 'all') {
                    shouldShow = true;
                } else if (card.getAttribute('data-category') === filterValue) {
                    shouldShow = true;
                }

                if (shouldShow) {
                    card.classList.remove('hidden');
                    // Force a reflow to restart the CSS animation
                    void card.offsetWidth;
                    card.classList.add('animate-enter');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('animate-enter');
                }
            });
        });
    });

    // Initially hide all portfolio items because no filter is active by default
    portfolioCards.forEach(card => {
        if (card.closest('.modern-portfolio-grid')) {
            card.classList.add('hidden');
        }
    });

    // Load thumbnails from pre-fetched thumbnailsData.js
    if (typeof thumbnailsData !== 'undefined') {
        document.querySelectorAll('.portfolio-card').forEach(card => {
            const link = card.querySelector('a');
            // Make sure we have a link and it's a tiktok link
            if (link && (link.href.includes('tiktok.com') || (link.getAttribute('href') && link.getAttribute('href').includes('tiktok.com')))) {
                const bg = card.querySelector('.card-bg');
                if (bg && !bg.classList.contains('video-bg')) {
                    // Use getAttribute as fallback just in case the browser normalizes the href
                    const href = link.getAttribute('href');
                    const thumbUrl = thumbnailsData[link.href] || thumbnailsData[href];
                    
                    if (thumbUrl) {
                        bg.style.backgroundImage = `linear-gradient(to top, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.15)), url('${thumbUrl}')`;
                        bg.style.backgroundSize = 'cover';
                        bg.style.backgroundPosition = 'center';
                    } else {
                        console.warn('Thumbnail not found in thumbnailsData for URL:', href);
                    }
                }
            }
        });
    } else {
        console.warn('thumbnailsData is not defined. Make sure thumbnailsData.js is loaded.');
    }
});
