/**
 * Animations Component
 * Handles scroll animations, number counters, and interactive effects
 */

class AnimationsManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.isCounterAnimated = false;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupNavbarHighlight();
        this.setupParallaxEffects();
        this.setupHoverEffects();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    
                    // Trigger counter animation when stats section is visible
                    if (entry.target.querySelector('.hero-stats') && !this.isCounterAnimated) {
                        this.animateCounters();
                        this.isCounterAnimated = true;
                    }
                }
            });
        }, this.observerOptions);

        // Observe all loading elements
        document.querySelectorAll('.loading').forEach(el => {
            observer.observe(el);
        });

        // Also observe the hero section for counter animation
        const heroSection = document.querySelector('.hero-image');
        if (heroSection) {
            observer.observe(heroSection);
        }
    }

    setupCounterAnimations() {
        // Initial setup for counter elements
        document.querySelectorAll('.stat-number').forEach(counter => {
            counter.textContent = '0';
        });
    }

    animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Add a small delay for staggered effect
            const delay = Array.from(document.querySelectorAll('.stat-number')).indexOf(counter) * 200;
            setTimeout(updateCounter, delay);
        });
    }

    setupNavbarHighlight() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        const highlightObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => {
            highlightObserver.observe(section);
        });

        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupParallaxEffects() {
        const parallaxElement = document.querySelector('.parallax');
        
        if (parallaxElement) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                parallaxElement.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        }
    }

    setupHoverEffects() {
        // Skill tags hover effect
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-2px) scale(1.05)';
                tag.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1)';
                tag.style.boxShadow = 'none';
            });
        });

        // Contact method cards hover effect
        document.querySelectorAll('.contact-method').forEach(method => {
            method.addEventListener('mouseenter', () => {
                method.style.transform = 'translateX(10px)';
                method.style.borderColor = 'var(--primary)';
                method.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.15)';
            });

            method.addEventListener('mouseleave', () => {
                method.style.transform = 'translateX(0)';
                method.style.borderColor = 'var(--border)';
                method.style.boxShadow = 'none';
            });
        });

        // Form inputs focus effect
        document.querySelectorAll('.form input, .form select, .form textarea').forEach(input => {
            input.addEventListener('focus', () => {
                input.parentNode.style.transform = 'translateY(-2px)';
            });

            input.addEventListener('blur', () => {
                input.parentNode.style.transform = 'translateY(0)';
            });
        });
    }

    // Method to trigger typing animation
    typeWriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const typing = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        };
        
        typing();
    }

    // Method to animate progress bars (for future use)
    animateProgressBar(element, percentage, duration = 1000) {
        const progressBar = element.querySelector('.progress-fill') || element;
        progressBar.style.width = '0%';
        progressBar.style.transition = `width ${duration}ms ease-out`;
        
        setTimeout(() => {
            progressBar.style.width = `${percentage}%`;
        }, 100);
    }

    // Method to create floating particles effect
    createFloatingParticles(container, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(particle);
        }
    }

    // Method to add glitch effect to text
    addGlitchEffect(element) {
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        element.addEventListener('mouseenter', () => {
            let iteration = 0;
            const interval = setInterval(() => {
                element.textContent = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    })
                    .join('');
                
                iteration += 1/3;
                
                if (iteration >= originalText.length) {
                    clearInterval(interval);
                    element.textContent = originalText;
                }
            }, 30);
        });
    }

    // Method to create magnetic effect for buttons
    addMagneticEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    }

    // Method to create reveal animation
    revealAnimation(element, direction = 'up') {
        const directions = {
            up: 'translateY(50px)',
            down: 'translateY(-50px)',
            left: 'translateX(50px)',
            right: 'translateX(-50px)'
        };

        element.style.opacity = '0';
        element.style.transform = directions[direction];
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate(0, 0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(element);
    }
}

// Add CSS for floating particles animation
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes float {
        0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
        }
        50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 1;
        }
    }

    .floating-particle {
        z-index: 1;
    }

    .loaded {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .nav-link.active {
        background: rgba(255, 255, 255, 0.2) !important;
        color: white !important;
    }

    /* Enhanced transitions */
    .skill-tag,
    .contact-method,
    .form input,
    .form select,
    .form textarea {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(animationStyles);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationsManager();
});