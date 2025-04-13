document.addEventListener('DOMContentLoaded', function() { 
    // DOM Elements
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const progressBar = document.getElementById('progressBar');
    const backToTopBtn = document.getElementById('back-to-top');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    const filterBtns = document.querySelectorAll('.filter-btn');

// Restore theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    document.getElementById('dark-icon').style.display = 'none';
    document.getElementById('light-icon').style.display = 'inline';
} else {
    document.getElementById('dark-icon').style.display = 'inline';
    document.getElementById('light-icon').style.display = 'none';
}

// Theme Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');

    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Toggle icons
    document.getElementById('dark-icon').style.display = isDark ? 'none' : 'inline';
    document.getElementById('light-icon').style.display = isDark ? 'inline' : 'none';
});

    

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');

        const bars = menuToggle.querySelectorAll('.bar');
        bars[0].classList.toggle('rotate-down');
        bars[1].classList.toggle('fade-out');
        bars[2].classList.toggle('rotate-up');
    });

    // Close mobile menu on nav item click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // Scroll progress and active nav update
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';

        // Show/hide back to top button
        backToTopBtn.classList.toggle('show', winScroll > 500);

        // Highlight active nav
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (winScroll >= sectionTop && winScroll < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Back to top button
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Project filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const matches = filter === 'all' || card.dataset.category === filter;
                if (matches) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Project modal
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectTitle = card.querySelector('h3').textContent;
            const projectDesc = card.querySelector('p').textContent;
            const projectImg = card.querySelector('img').src;
            const projectTags = Array.from(card.querySelectorAll('.project-tags span')).map(tag => tag.textContent);

            modalBody.innerHTML = `
                <div class="modal-project">
                    <h2>${projectTitle}</h2>
                    <div class="modal-img">
                        <img src="${projectImg}" alt="${projectTitle}">
                    </div>
                    <div class="modal-desc">
                        <h3>Project Description</h3>
                        <p>${projectDesc}</p>
                        <h3>Technologies Used</h3>
                        <div class="project-tags">
                            ${projectTags.map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                        <div class="modal-btns">
                            <a href="#" class="btn primary-btn">Live Demo</a>
                            <a href="#" class="btn secondary-btn">View Code</a>
                        </div>
                    </div>
                </div>
            `;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Form validation
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const messageError = document.getElementById('message-error');

            nameError.textContent = '';
            emailError.textContent = '';
            messageError.textContent = '';

            let isValid = true;

            if (nameInput.value.trim() === '') {
                nameError.textContent = 'Please enter your name';
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                emailError.textContent = 'Please enter your email';
                isValid = false;
            } else if (!emailPattern.test(emailInput.value.trim())) {
                emailError.textContent = 'Please enter a valid email address';
                isValid = false;
            }

            if (messageInput.value.trim() === '') {
                messageError.textContent = 'Please enter your message';
                isValid = false;
            }

            if (isValid) {
                contactForm.reset();
                successMessage.style.display = 'block';
                successMessage.textContent = 'Message sent successfully!';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 4000);
            }
        });
    }
});
