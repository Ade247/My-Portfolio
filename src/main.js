import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavigation();
  initTheme();
  initAnimations();
  initProjectModal();
  initViewMoreProjects();
});

// Project Modal Logic
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalTech = document.getElementById('modal-tech');
  const modalDescription = document.getElementById('modal-description');
  const modalLink = document.getElementById('modal-link');
  const closeBtn = document.querySelector('.modal-close');
  const projectCards = document.querySelectorAll('.project-card.stacked');

  function openModal(card) {
    const title = card.getAttribute('data-title');
    const description = card.getAttribute('data-description');
    const tech = card.getAttribute('data-tech').split(',');
    const image = card.querySelector('img').src;
    const link = card.getAttribute('data-link');

    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalImage.src = image;
    modalLink.href = link;

    modalTech.innerHTML = '';
    tech.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tech-pill';
      span.textContent = t.trim();
      modalTech.appendChild(span);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // GSAP Animation for modal content
    gsap.fromTo('.modal-container', 
      { scale: 0.9, y: 40, opacity: 0 },
      { duration: 0.6, scale: 1, y: 0, opacity: 1, ease: 'power3.out' }
    );
  }

  function closeModal() {
    gsap.to('.modal-container', {
      duration: 0.4,
      scale: 0.9,
      y: 40,
      opacity: 0,
      ease: 'power3.in',
      onComplete: () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  projectCards.forEach(card => {
    const readMoreBtn = card.querySelector('.read-more-btn');
    if (readMoreBtn) {
      readMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(card);
      });
    }

    const imgWrapper = card.querySelector('.project-image-wrapper');
    if (imgWrapper) {
      imgWrapper.addEventListener('click', () => {
        openModal(card);
      });
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Theme Toggle
function initTheme() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const icon = themeToggle.querySelector('svg');
      // Simple icon swap or rotation could go here
      gsap.to(themeToggle, { rotate: 360, duration: 0.5, onComplete: () => gsap.set(themeToggle, { rotate: 0 }) });
    });
  }
}

// Custom Cursor
function initCursor() {
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card');

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Slight delay for the outline
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards", easing: "ease-out" });
  });

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

// Navigation scroll effect and mobile menu
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// GSAP Animations
function initAnimations() {
  // 1. Hero Animations
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl.from('.hero-badge', { y: 20, opacity: 0, duration: 1, delay: 0.2 })
    .from('.hero-title', { y: 20, opacity: 0, duration: 1 }, "-=0.8")
    .from('.hero-description', { y: 20, opacity: 0, duration: 1 }, "-=0.8")
    .from('.grid-block', { scale: 0.8, opacity: 0, duration: 1, stagger: 0.1 }, "-=1.2")
    .from('.scroll-indicator', { opacity: 0, duration: 1 }, "-=0.4");

  // Set initial state for elements to be visible immediately
  gsap.set('.hero-actions .btn-primary, .hero-actions .btn-secondary', { opacity: 1, x: 0 });
  gsap.set('.hero-tech-stack, .hero-tech-stack .tech-pill', { opacity: 1, y: 0 });

  // Role Cycling Animation
  const roles = ["UI/UX Designer", "Product Designer", "Graphic Designer", "Brand Designer"];
  let roleIndex = 0;
  const roleElement = document.querySelector('.role-cycle');

  if (roleElement) {
    setInterval(() => {
      gsap.to(roleElement, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          roleIndex = (roleIndex + 1) % roles.length;
          roleElement.textContent = roles[roleIndex];
          gsap.fromTo(roleElement,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        }
      });
    }, 3000);
  }

  // Floating Visual Animation
  gsap.to('.hero-visual-right', {
    y: -20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut"
  });

  // 2. Journey About Section Reveal
  const aboutJourneyTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about-journey-grid',
      start: 'top 70%',
    }
  });

  aboutJourneyTl.from('.section-header-left', { x: -30, opacity: 0, duration: 1 })
               .from('.about-bio-premium p', { y: 20, opacity: 0, duration: 0.8, stagger: 0.2 }, "-=0.6")
               .from('.about-experience-badge-premium', { scale: 0.8, opacity: 0, duration: 0.8 }, "-=0.4");

  // Parallax Backdrop Text
  gsap.to('.about-backdrop-text', {
    y: 150,
    scrollTrigger: {
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // Stagger Journey Items
  gsap.utils.toArray('.journey-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      },
      x: 30,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      delay: i * 0.1
    });
  });

  // 3. Projects Section Reveal
  const projectCards = document.querySelectorAll('.project-card.stacked');

  projectCards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      delay: i % 2 === 0 ? 0 : 0.15
    });
  });

  // 4. Services Section (Bento Grid)
  gsap.from('.dark-feature-card', {
    scrollTrigger: {
      trigger: '.services-bento-grid',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // 5. Contact Section
  gsap.from('.contact-card', {
    scrollTrigger: {
      trigger: '.contact',
      start: 'top 80%',
    },
    scale: 0.95,
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });
}

// View More Projects functionality
function initViewMoreProjects() {
  const viewMoreBtn = document.getElementById('view-more-btn');
  const hiddenContainer = document.querySelector('.hidden-projects-container');
  if (!viewMoreBtn || !hiddenContainer) return;

  let isOpen = false;

  viewMoreBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    
    if (isOpen) {
      viewMoreBtn.classList.add('active');
      viewMoreBtn.childNodes[0].textContent = 'View less ';
      
      hiddenContainer.classList.add('active');
      
      // Animate the cards in
      const cards = hiddenContainer.querySelectorAll('.project-card');
      gsap.fromTo(cards, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', clearProps: 'all' }
      );

      // Scroll slightly to show new content
      setTimeout(() => {
        window.scrollBy({ top: 200, behavior: 'smooth' });
      }, 100);
    } else {
      viewMoreBtn.classList.remove('active');
      viewMoreBtn.childNodes[0].textContent = 'View more ';
      
      gsap.to(hiddenContainer, {
        opacity: 0,
        y: 30,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          hiddenContainer.classList.remove('active');
        }
      });
    }
  });
}
