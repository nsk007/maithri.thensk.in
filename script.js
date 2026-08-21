const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const motionTargets = document.querySelectorAll('main > section:not(.hero), .practice-card, .service-row, .video-card, .photo-grid figure, .playlist-link');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
motionTargets.forEach((element, index) => {
  element.classList.add('motion-ready', 'motion-stagger');
  element.style.setProperty('--motion-order', index % 5);
});
if (reduceMotion) {
  motionTargets.forEach((element) => element.classList.add('is-visible'));
} else {
  const motionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  motionTargets.forEach((element) => motionObserver.observe(element));
  const revealVisibleTargets = () => {
    const viewportHeight = window.innerHeight;
    motionTargets.forEach((element) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < viewportHeight * 0.92 && bounds.bottom > 0) element.classList.add('is-visible');
    });
  };
  window.addEventListener('scroll', revealVisibleTargets, { passive: true });
  window.addEventListener('resize', revealVisibleTargets);
  window.addEventListener('load', revealVisibleTargets);
  requestAnimationFrame(revealVisibleTargets);
}

document.querySelectorAll('.practice-card, .video-card, .service-row, .playlist-link').forEach((element) => {
  element.addEventListener('pointerdown', () => element.classList.add('touch-active'));
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
    element.addEventListener(eventName, () => element.classList.remove('touch-active'));
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', link.getAttribute('href'));
  });
});

const whatsappMessages = {
  training: 'Hello Maithri, I would like to enquire about Bharatanatyam and Yakshagana training.',
  performance: 'Hello Maithri, I would like to enquire about booking a performance.',
  workshop: 'Hello Maithri, I would like to enquire about a performance workshop.',
  'computer science': 'Hello Maithri, I would like to enquire about computer science mentoring.',
  enquiry: 'Hello Maithri, I would like to know more about your work and services.'
};

document.querySelectorAll('[data-open-booking]').forEach((button) => {
  button.addEventListener('click', () => {
    const message = encodeURIComponent(whatsappMessages[button.dataset.openBooking] || whatsappMessages.enquiry);
    window.open(`https://wa.me/917012377220?text=${message}`, '_blank', 'noopener,noreferrer');
  });
});

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});
document.addEventListener('click', (event) => {
  if (nav.classList.contains('open') && !nav.contains(event.target) && event.target !== menuToggle) {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

document.querySelectorAll('.filter').forEach((filter) => {
  filter.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    document.querySelectorAll('.filter').forEach((button) => button.setAttribute('aria-pressed', 'false'));
    filter.classList.add('active');
    filter.setAttribute('aria-pressed', 'true');
    const type = filter.dataset.filter;
    document.querySelectorAll('.video-card').forEach((card) => card.classList.toggle('is-hidden', type !== 'all' && card.dataset.type !== type));
  });
});
