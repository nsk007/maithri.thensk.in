const dialog = document.querySelector('#booking-dialog');
const interest = document.querySelector('#interest');
const dialogTitle = document.querySelector('#dialog-title');
const dialogCopy = document.querySelector('#dialog-copy');
const form = document.querySelector('#booking-form');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const bookingModes = {
  training: ['Book arts training.', 'Tell me a little about your practice and what you would like to explore.', 'Bharatanatyam & Yakshagana training'],
  performance: ['Invite me to perform.', 'Share the occasion, location, and the story you would like to bring to your audience.', 'Performance booking'],
  workshop: ['Plan a workshop.', 'Tell me about your group, institution, and the kind of workshop you have in mind.', 'Performance workshop'],
  'computer science': ['Book academic mentoring.', 'Share the topic, level, and learning goal you would like help with.', 'Computer science mentoring'],
  enquiry: ['Start a conversation.', 'Tell me what you have in mind.', 'Something else']
};

document.querySelectorAll('[data-open-booking]').forEach((button) => {
  button.addEventListener('click', () => {
    const mode = bookingModes[button.dataset.openBooking] || bookingModes.enquiry;
    dialogTitle.textContent = mode[0];
    dialogCopy.textContent = mode[1];
    interest.value = mode[2];
    form.querySelector('.form-status').textContent = '';
    dialog.showModal();
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const status = form.querySelector('.form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  status.textContent = 'Sending your enquiry...';
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(data).toString()
  }).then((response) => {
    if (!response.ok) throw new Error('Submission failed');
    status.textContent = 'Thank you. I will be in touch soon.';
    form.reset();
  }).catch(() => {
    status.textContent = 'Something went wrong. Please email maithrimovvar@gmail.com.';
  }).finally(() => { submitButton.disabled = false; });
});

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('open')));

document.querySelectorAll('.filter').forEach((filter) => {
  filter.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    filter.classList.add('active');
    const type = filter.dataset.filter;
    document.querySelectorAll('.video-card').forEach((card) => card.classList.toggle('is-hidden', type !== 'all' && card.dataset.type !== type));
  });
});
