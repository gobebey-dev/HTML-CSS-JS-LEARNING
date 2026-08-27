/* ==========================================================================
   APP LOGIC & INTERACTIVITY
   Project: Panji Masamudra Portfolio
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // === 1. THEME SWITCHER (Dark & Light Mode) ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    // Load saved theme or check default system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // System preference default
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }
    // Event listener for theme toggle button
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add subtle rotation animation feedback on click
        themeToggleBtn.style.transform = 'scale(0.85)';
        setTimeout(() => {
            themeToggleBtn.style.transform = '';
        }, 150);
    });
    // === 2. MOBILE MENU DRAWER ===
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Lock body scrolling when mobile menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    // Close menu when links are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    // === 3. TYPING EFFECT IN HERO ===
    const typingTextElement = document.getElementById('typing-text');
    const words = ['Frontend Developer.', 'UI/UX Enthusiast.', 'Creative Coder.', 'Problem Solver.'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    const typeAnimation = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove character
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deleting
        } else {
            // Add character
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // normal typing
        }
        // Logical state changes
        if (!isDeleting && charIndex === currentWord.length) {
            // Word fully typed, pause before deleting
            isDeleting = true;
            typingSpeed = 2000; // wait 2 seconds at the end of word
        } else if (isDeleting && charIndex === 0) {
            // Word fully deleted, move to next word
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // brief pause before next word
        }
        setTimeout(typeAnimation, typingSpeed);
    };
    // Initiate typing effect
    if (typingTextElement) {
        setTimeout(typeAnimation, 1000);
    }
    // === 4. SCROLL REVEAL & NAVIGATION ACTIVE STATE ===
    const revealSections = document.querySelectorAll('.scroll-reveal');
    const navigationLinks = document.querySelectorAll('.nav-link');
    // Setup intersection observers
    const revealObserverOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the about section, trigger animation for skill progress bars
                if (entry.target.id === 'about') {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.transform = 'scaleX(1)';
                    });
                }
                
                // Stop observing this element after it has revealed
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);
    revealSections.forEach(section => {
        revealObserver.observe(section);
    });
    // Active nav link highlight based on scroll position
    const navScrollObserverOptions = {
        root: null,
        threshold: 0.4,
        rootMargin: '0px'
    };
    const navScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                
                navigationLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navScrollObserverOptions);
    // Observe all main sections for navbar highlighting
    document.querySelectorAll('section').forEach(section => {
        navScrollObserver.observe(section);
    });
    // === 5. PROJECTS GALLERY FILTERING ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all and add to clicked
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show item
                    card.style.display = 'block';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    // === 6. INTERACTIVE CONTACT FORM SUBMISSION ===
    const contactForm = document.getElementById('contact-form');
    const formSuccessAlert = document.getElementById('form-success');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // prevent form action reload
            // Select button and display loading state
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Mengirim...</span>';
            // Simulate server network delay
            setTimeout(() => {
                // Fade out form
                contactForm.style.opacity = '0';
                contactForm.style.transition = 'opacity 0.4s ease';
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    
                    // Show success block
                    formSuccessAlert.style.display = 'flex';
                    setTimeout(() => {
                        formSuccessAlert.style.opacity = '1';
                        formSuccessAlert.style.transition = 'opacity 0.4s ease';
                    }, 50);
                }, 400);
            }, 1500); // 1.5 seconds loading state simulation
        });
    }
});
