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

    // Dynamic thumbnails loading from thumbnails.json
    fetch('thumbnails.json')
        .then(res => res.json())
        .then(data => {
            document.querySelectorAll('.portfolio-card').forEach(card => {
                const link = card.querySelector('a');
                if (link && data[link.href]) {
                    const bg = card.querySelector('.card-bg');
                    if (bg && !bg.classList.contains('video-bg')) {
                        bg.style.backgroundImage = `linear-gradient(to top, rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.2)), url('${data[link.href]}')`;
                        bg.style.backgroundSize = 'cover';
                        bg.style.backgroundPosition = 'center';
                    }
                }
            });
        })
        .catch(err => console.error('Error loading thumbnails:', err));
});
