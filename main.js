/* ════════════════════════════════════════
   MAT Afrika Activation Series
   main.js
════════════════════════════════════════ */

/* ── Navbar: add .scrolled class on scroll */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});


/* ── Scroll reveal: animate elements into view */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── Mobile menu: toggle nav links */
function toggleMenu() {
  const links = document.querySelector('.nav-links');
  const isOpen = links.style.display === 'flex';

  if (isOpen) {
    links.style.display = 'none';
  } else {
    links.style.cssText = `
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      background: rgba(10,10,10,0.97);
      padding: 2rem 6vw;
      gap: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      z-index: 99;
    `;
  }
}

/* Close mobile menu when a nav link is clicked */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (window.innerWidth <= 900) {
      links.style.display = 'none';
    }
  });
});


/* ── Form validation: highlight empty fields */
function highlightErrors(fields) {
  fields.forEach(({ id, value }) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.borderColor = value ? '' : 'rgba(200,52,26,0.6)';
    }
  });
}

/* ── Clear field error styling on input */
document.querySelectorAll('.form-input, .form-select').forEach(el => {
  el.addEventListener('input', () => {
    el.style.borderColor = '';
  });
});


/* ── Form submission — connects to Google Forms
   ─────────────────────────────────────────────
   HOW TO CONNECT YOUR GOOGLE FORM:
   1. Create a Google Form with these fields:
      - Full Name (Short answer)
      - Email Address (Short answer)
      - WhatsApp Number (Short answer)
      - I am a... (Dropdown)
      - State / City (Short answer)

   2. Click the ⋮ menu in the form → "Get pre-filled link"
      Fill in dummy values for each field, then click "Get link"

   3. From the URL generated, extract:
      - The FORM_ID from: /forms/d/e/FORM_ID/viewform
      - Each entry.XXXXXXXXX ID from the URL parameters

   4. Replace GOOGLE_FORM_ID and the entry IDs below
   ───────────────────────────────────────────── */

const GOOGLE_FORM_ID   = 'YOUR_FORM_ID';  // ← Replace with your actual form ID

const FORM_ENTRY_IDS = {
  name:     'entry.XXXXXXXXX',  // ← Replace with your Full Name entry ID
  email:    'entry.XXXXXXXXX',  // ← Replace with your Email entry ID
  whatsapp: 'entry.XXXXXXXXX',  // ← Replace with your WhatsApp entry ID
  segment:  'entry.XXXXXXXXX',  // ← Replace with your Segment entry ID
  location: 'entry.XXXXXXXXX',  // ← Replace with your Location entry ID
};

function submitForm() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const whatsapp  = document.getElementById('whatsapp').value.trim();
  const segment   = document.getElementById('segment').value;
  const location  = document.getElementById('location').value.trim();

  /* Validate — highlight missing fields and stop */
  const hasErrors = !firstName || !lastName || !email || !whatsapp || !segment || !location;

  highlightErrors([
    { id: 'firstName', value: firstName },
    { id: 'lastName',  value: lastName  },
    { id: 'email',     value: email     },
    { id: 'whatsapp',  value: whatsapp  },
    { id: 'segment',   value: segment   },
    { id: 'location',  value: location  },
  ]);

  if (hasErrors) return;

  /* Build Google Forms submission URL */
  const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

  const formData = new FormData();
  formData.append(FORM_ENTRY_IDS.name,     `${firstName} ${lastName}`);
  formData.append(FORM_ENTRY_IDS.email,    email);
  formData.append(FORM_ENTRY_IDS.whatsapp, whatsapp);
  formData.append(FORM_ENTRY_IDS.segment,  segment);
  formData.append(FORM_ENTRY_IDS.location, location);

  /*
    Submit to Google Forms using no-cors mode.
    Note: Google Forms does not allow CORS, so fetch() will always
    throw a network error — this is expected and harmless.
    The form submission goes through regardless.
  */
  fetch(formUrl, {
    method: 'POST',
    mode:   'no-cors',
    body:   formData,
  }).catch(() => {});

  /* Show success state */
  showSuccess();
}

function showSuccess() {
  document.getElementById('formContent').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
  document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
}
