// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe step items
    document.querySelectorAll('.step-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(item);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroBackground = document.querySelector('.hero-background');
            
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Add hover effect to dashboard preview
    const dashboardPreview = document.querySelector('.dashboard-preview');
    if (dashboardPreview) {
        dashboardPreview.addEventListener('mousemove', function(e) {
            const rect = dashboardPreview.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            dashboardPreview.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        dashboardPreview.addEventListener('mouseleave', function() {
            dashboardPreview.style.transform = 'perspective(1000px) rotateY(-5deg)';
        });
    }

    // Animate stats on scroll
    const statsSection = document.querySelector('.hero-stats');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const targetText = stat.textContent;
                    const isPercentage = targetText.includes('%');
                    const isCurrency = targetText.includes('$');
                    const hasPlus = targetText.includes('+');
                    
                    let finalNumber = targetText.replace(/[^0-9.]/g, '');
                    
                    animateNumber(stat, finalNumber, isPercentage, isCurrency, hasPlus);
                    
                    statsObserver.unobserve(entry.target);
                });
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateNumber(element, targetNumber, isPercentage, isCurrency, hasPlus) {
        const duration = 2000;
        const startTime = Date.now();
        const start = 0;
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (targetNumber - start) * easeOutCubic(progress);
            
            let displayValue = Math.floor(current).toLocaleString();
            
            if (hasPlus) displayValue = '+' + displayValue;
            if (isCurrency) displayValue = '$' + displayValue;
            if (isPercentage) displayValue = displayValue + '%';
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        update();
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Initialize EmailJS
    (function() {
        emailjs.init("saPI9mIjUc9HCNhRD"); // You'll need to replace this with your EmailJS public key
    })();

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            
            try {
                // Send email using EmailJS
                // Note: You need to configure EmailJS service with these values:
                // - service_id: your service ID
                // - template_id: your template ID
                const response = await emailjs.send(
                    'service_rw66yon',      // Replace with your EmailJS service ID
                    'template_msu03fo',     // Replace with your EmailJS template ID
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        message: formData.message,
                        to_email: 'your-email@example.com' // Your email address to receive inquiries
                    }
                );
                
                // Success
                formStatus.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.';
                formStatus.classList.add('success');
                contactForm.reset();
                
            } catch (error) {
                console.error('EmailJS Error:', error);
                formStatus.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
                formStatus.classList.add('error');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }

    console.log('VoyagerAI website loaded successfully!');
});

