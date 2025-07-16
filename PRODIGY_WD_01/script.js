document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-links');

    // Change navbar style on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navList.classList.remove('active');
        });
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navList.classList.toggle('active');
    });

    // Change nav link color on hover
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#3498db';
            if (nav.classList.contains('scrolled')) {
                this.style.color = '#1abc9c';
            }
        });

        link.addEventListener('mouseleave', function() {
            if (nav.classList.contains('scrolled')) {
                this.style.color = '#ecf0f1';
            } else {
                this.style.color = '#2c3e50';
            }
        });
    });
});