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
    // --- Portfolio Filtering & Lightbox Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const emptyState = document.getElementById('portfolio-empty-state');

    // Lightbox DOM elements
    const lightbox = document.getElementById('video-lightbox');
    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxIframe = document.getElementById('lightbox-iframe');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxTiktokLink = document.getElementById('lightbox-tiktok-link');
    const lightboxLoader = lightbox.querySelector('.lightbox-loader');

    let currentCategoryCards = [];
    let currentCardIndex = -1;
    let lastActiveElement = null;

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

    // Lazy Load thumbnails from pre-fetched thumbnailsData.js
    if (typeof thumbnailsData !== 'undefined') {
        const thumbnailObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const link = card.querySelector('a');
                    const bg = card.querySelector('.card-bg');
                    
                    if (link && bg && !bg.classList.contains('video-bg') && !bg.style.backgroundImage) {
                        const href = link.getAttribute('href');
                        const data = thumbnailsData[link.href] || thumbnailsData[href];
                        const thumbUrl = (data && typeof data === 'object') ? data.thumbnail : data;

                        if (thumbUrl) {
                            bg.style.backgroundImage = `linear-gradient(to top, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.15)), url('${thumbUrl}')`;
                            bg.style.backgroundSize = 'cover';
                            bg.style.backgroundPosition = 'center';
                        }
                    }
                    observer.unobserve(card);
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0.01 });

        portfolioCards.forEach(card => {
            if (card.closest('.modern-portfolio-grid')) {
                thumbnailObserver.observe(card);
            }
        });
    } else {
        console.warn('thumbnailsData is not defined. Make sure thumbnailsData.js is loaded.');
    }

    // Lightbox interactivity functions
    const openVideo = (videoId, cardElement) => {
        const titleText = cardElement.querySelector('h4').textContent.trim();
        const descText = cardElement.querySelector('p').textContent.trim();
        const originalLink = cardElement.querySelector('a').href;

        lightboxCategory.innerHTML = cardElement.querySelector('.category-tag').innerHTML;
        lightboxTitle.textContent = titleText;
        lightboxDesc.textContent = descText;
        lightboxTiktokLink.href = originalLink;

        // Show loader and set iframe src
        lightboxLoader.style.display = 'block';
        lightboxIframe.style.display = 'none';
        
        // Use TikTok's responsive embed player format
        lightboxIframe.src = `https://www.tiktok.com/player/v1/${videoId}?music_info=1&description=0`;

        lightboxIframe.onload = () => {
            lightboxLoader.style.display = 'none';
            lightboxIframe.style.display = 'block';
        };

        // Accessibility: Store trigger and manage focus
        lastActiveElement = document.activeElement;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent main page scrolling

        // Focus the close button after a small delay to ensure visibility
        setTimeout(() => lightboxClose.focus(), 100);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore page scrolling
        lightboxIframe.src = ''; // Clear iframe to stop playback/audio instantly

        // Accessibility: Restore focus
        if (lastActiveElement) {
            lastActiveElement.focus();
        }
    };

    const navigateLightbox = (direction) => {
        if (currentCardIndex === -1 || currentCategoryCards.length <= 1) return;

        if (direction === 'next') {
            currentCardIndex = (currentCardIndex + 1) % currentCategoryCards.length;
        } else {
            currentCardIndex = (currentCardIndex - 1 + currentCategoryCards.length) % currentCategoryCards.length;
        }

        const nextCard = currentCategoryCards[currentCardIndex];
        const nextLink = nextCard.querySelector('a');
        const nextHref = nextLink.getAttribute('href');
        const nextData = thumbnailsData[nextLink.href] || thumbnailsData[nextHref];

        if (nextData && nextData.video_id) {
            openVideo(nextData.video_id, nextCard);
        }
    };

    // Card click event attachment
    portfolioCards.forEach(card => {
        if (!card.closest('.modern-portfolio-grid')) return;

        card.addEventListener('click', (e) => {
            const link = card.querySelector('a');
            if (!link) return;

            // Intercept normal new tab click behavior
            e.preventDefault();
            e.stopPropagation();

            const href = link.getAttribute('href');
            const data = thumbnailsData[link.href] || thumbnailsData[href];

            if (data && data.video_id) {
                // Determine current active filter to only navigate through visible cards
                const activeFilter = document.querySelector('.filter-btn.active');
                const activeFilterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

                // Get current filtered list of cards
                currentCategoryCards = Array.from(portfolioCards).filter(c => {
                    if (!c.closest('.modern-portfolio-grid')) return false;
                    if (activeFilterValue === 'all') return true;
                    return c.getAttribute('data-category') === activeFilterValue;
                });

                currentCardIndex = currentCategoryCards.indexOf(card);
                openVideo(data.video_id, card);
            } else {
                // Fallback link navigation if oEmbed failed/missing video ID
                window.open(link.href, '_blank', 'noopener,noreferrer');
            }
        });
    });

    // Control triggers setup
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));

    // Keyboard controls (Esc, Tab, Left/Right arrow keys)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            navigateLightbox('next');
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
        } else if (e.key === 'Tab') {
            // Focus trap logic
            const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // if shift key pressed for shift + tab combination
                if (document.activeElement === firstElement) {
                    lastElement.focus(); // add focus for the last focusable element
                    e.preventDefault();
                }
            } else { // if tab key is pressed
                if (document.activeElement === lastElement) {
                    firstElement.focus(); // add focus for the first focusable element
                    e.preventDefault();
                }
            }
        }
    });

    // Initially hide all portfolio items because no filter is active by default
    portfolioCards.forEach(card => {
        if (card.closest('.modern-portfolio-grid')) {
            card.classList.add('hidden');
        }
    });

    // Trigger programmatic click on "All Works" button to show them by default
    const allWorksBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allWorksBtn) {
        allWorksBtn.click();
    }
});
