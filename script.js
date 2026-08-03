document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileBtn.querySelector('i');

    const toggleMenu = () => {
        const isActive = mobileMenu.classList.toggle('active');
        mobileBtn.setAttribute('aria-expanded', isActive);

        if (isActive) {
            menuIcon.classList.replace('ph-list', 'ph-x');
            mobileBtn.setAttribute('aria-label', 'Close Menu');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            // Focus the first link after a short delay for animation
            setTimeout(() => {
                const firstLink = mobileMenu.querySelector('.mobile-link');
                if (firstLink) firstLink.focus();
            }, 300);
        } else {
            menuIcon.classList.replace('ph-x', 'ph-list');
            mobileBtn.setAttribute('aria-label', 'Toggle Menu');
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

    // Close on Escape and Focus Trap for Mobile Menu
    document.addEventListener('keydown', (e) => {
        if (!mobileMenu.classList.contains('active')) return;

        if (e.key === 'Escape') {
            toggleMenu();
            mobileBtn.focus();
        } else if (e.key === 'Tab') {
            const focusableElements = mobileMenu.querySelectorAll('.mobile-link');
            const allFocusable = [mobileBtn, ...Array.from(focusableElements)];
            const firstElement = allFocusable[0];
            const lastElement = allFocusable[allFocusable.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Scroll Progress Indicator
    const scrollProgress = document.getElementById('scroll-progress');
    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Force 100% when extremely close to the bottom to account for dynamic layout/subpixel rendering
        const isNearBottom = scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 10;
        const finalPercent = isNearBottom ? 100 : Math.min(100, Math.max(0, scrollPercent));

        scrollProgress.style.width = `${finalPercent}%`;
    };

    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateScrollProgress();
    });

    // Initial check in case of refresh
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }
    updateScrollProgress();

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

    // Contact Form Handler: generate mailto link with form values
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Part 6: Loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ph ph-spinner animate-spin"></i> Sending...';

            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            const subject = encodeURIComponent(`Project Inquiry from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

            const mailtoUrl = `mailto:Mohammedalewi7@gmail.com?subject=${subject}&body=${body}`;
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=Mohammedalewi7@gmail.com&su=${subject}&body=${body}`;

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

            // Part 6: Reset button after send
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                contactForm.reset();
            }, 1200);
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

    // --- Scroll Spy Logic ---
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link, .navbar .btn');
    const sections = document.querySelectorAll('section[id]');

    const spyObserverOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    } else if (href && href.startsWith('#')) {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, spyObserverOptions);

    sections.forEach(section => spyObserver.observe(section));

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

    // --- Portfolio Filtering & Lightbox Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const emptyState = document.getElementById('portfolio-empty-state');

    // Dynamic Portfolio Counts
    if (filterBtns.length && portfolioCards.length) {
        const gridCards = Array.from(portfolioCards).filter(c => c.closest('.modern-portfolio-grid'));
        const counts = { all: gridCards.length };
        gridCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            if (cat) counts[cat] = (counts[cat] || 0) + 1;
        });

        filterBtns.forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            const count = counts[filter] || 0;

            // Idempotency: check if label already exists
            let countLabel = btn.querySelector('.filter-count');
            if (!countLabel) {
                // Add a space for separation
                btn.appendChild(document.createTextNode(' '));
                countLabel = document.createElement('small');
                countLabel.className = 'filter-count text-muted';
                // Using a small amount of inline style for fine-tuning as no
                // utility classes for opacity/spacing exist in this custom CSS.
                countLabel.style.opacity = '0.7';
                btn.appendChild(countLabel);
            }
            countLabel.textContent = `(${count})`;
        });
    }

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

            // Remove active class and update aria-pressed from all
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

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
                            const img = new Image();
                            img.src = thumbUrl;
                            img.onload = () => {
                                bg.style.backgroundImage = `linear-gradient(to top, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.2)), url('${thumbUrl}')`;
                                bg.style.backgroundSize = 'cover';
                                bg.style.backgroundPosition = card.dataset.thumbPosition || 'center';
                                bg.classList.add('loaded');
                            };
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
    const openVideo = (videoId, cardElement, isNavigation = false) => {
        const titleText = cardElement.querySelector('h4').textContent.trim();
        const descText = cardElement.querySelector('p').textContent.trim();
        const originalLink = cardElement.querySelector('a').href;

        lightboxCategory.innerHTML = cardElement.querySelector('.category-tag').innerHTML;
        lightboxTitle.textContent = titleText;
        lightboxDesc.textContent = descText;
        lightboxTiktokLink.href = originalLink;
        lightboxTiktokLink.setAttribute('aria-label', `Watch ${titleText} on TikTok`);

        // Show loader and set iframe src
        lightboxLoader.style.display = 'block';
        lightboxIframe.style.display = 'none';
        lightboxIframe.title = `TikTok Video: ${titleText}`;
        
        // Use TikTok's responsive embed player format
        lightboxIframe.src = `https://www.tiktok.com/player/v1/${videoId}?music_info=1&description=0`;

        lightboxIframe.onload = () => {
            lightboxLoader.style.display = 'none';
            lightboxIframe.style.display = 'block';
        };

        // Accessibility: Store trigger and manage focus
        if (!isNavigation) {
            lastActiveElement = document.activeElement;
        } else {
            lastActiveElement = cardElement.querySelector('.play-btn-circle') || cardElement.querySelector('a');
        }

        // Hide navigation buttons if there is only one card in the active category
        if (currentCategoryCards.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = '';
            lightboxNext.style.display = '';
        }

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
            openVideo(nextData.video_id, nextCard, true);
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
            const focusableElements = Array.from(lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
                .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
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

    // Dynamic Portfolio Card ARIA labels for Screen Reader accessibility
    portfolioCards.forEach(card => {
        const link = card.querySelector('.play-btn-circle');
        if (!link) return;
        const h4 = card.querySelector('h4');
        const p = card.querySelector('p');
        const titleText = h4 ? h4.textContent.trim() : '';
        const descText = p ? p.textContent.trim() : '';
        let ariaLabel = 'Play video';
        if (titleText && descText) {
            ariaLabel = `Play ${titleText} - ${descText}`;
        } else if (titleText) {
            ariaLabel = `Play ${titleText}`;
        } else if (descText) {
            ariaLabel = `Play ${descText}`;
        }
        link.setAttribute('aria-label', ariaLabel);
    });

    // Trigger programmatic click on "All Works" button to show them by default
    const allWorksBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allWorksBtn) {
        allWorksBtn.click();
    }

    // Scroll indicator opacity fade
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            scrollIndicator.style.opacity = Math.max(0, 1 - window.scrollY / 300);
        }, { passive: true });
    }
// --- Part 2.1: Magnetic buttons (desktop only) ---
const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .filter-btn');

if (!window.matchMedia('(pointer: coarse)').matches) {
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width  / 2;
            const y = e.clientY - rect.top  - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// --- Part 2.2: Custom cursor glow (desktop only) ---
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && !window.matchMedia('(pointer: coarse)').matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
    });
    const animateCursor = () => {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        cursorGlow.style.left = cx + 'px';
        cursorGlow.style.top  = cy + 'px';
        requestAnimationFrame(animateCursor);
    };
    animateCursor();
}

// --- Part 3.2: Skill bars animate width on scroll ---
const skillBars = document.querySelectorAll('.skill-progress');
if (skillBars.length) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                void bar.offsetWidth; // force reflow
                bar.style.width = targetWidth;
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    skillBars.forEach(bar => skillObserver.observe(bar));
}

// --- Part 4.1: 3D tilt on portfolio cards (desktop only) ---
const tiltCards = document.querySelectorAll('.portfolio-card');

if (!window.matchMedia('(pointer: coarse)').matches) {
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top)  / rect.height;
            const rotateX = (y - 0.5) * -8;
            const rotateY = (x - 0.5) *  8;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// --- Part 5: Stat number counter animation ---
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (el) => {
    const text = el.textContent.trim();
    const hasPlus = text.includes('+');
    const hasM    = text.includes('M');
    const numericPart = parseInt(text.replace(/\D/g, ''), 10);
    if (isNaN(numericPart)) return;

    let current = 0;
    const duration  = 1500;
    const startTime = performance.now();

    const step = (now) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 4);
        current = Math.floor(eased * numericPart);

        let suffix = '';
        if (hasM)         suffix = 'M+';
        else if (hasPlus) suffix = '+';

        el.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = numericPart + suffix;
        }
    };
    requestAnimationFrame(step);
};

if (statNumbers.length) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(num => statObserver.observe(num));
}

// --- Part 8: Footer entrance ---
const footer = document.querySelector('footer');
if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                footer.classList.add('visible');
                footerObserver.unobserve(footer);
            }
        });
    }, { threshold: 0.2 });
    footerObserver.observe(footer);
}
});
