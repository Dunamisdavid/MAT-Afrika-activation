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

const GOOGLE_FORM_ID = '1FAIpQLScBULvD-YMe4cfycVzPclHwOYCaDGrm9JA9gaQiO6MosKQ17Q';

const FORM_ENTRY_IDS = {
  name: 'entry.112382292',   // Full Name
  email:     'entry.187831532',   // Email Address
  whatsapp:  'entry.542472842',   // WhatsApp Number
  segment:   'entry.91712470',    // I am a...
  location:  'entry.1041890123',  // State / City
};

function submitForm() {
  const name = document.getElementById('name').value.trim();
  const email     = document.getElementById('email').value.trim();
  const whatsapp  = document.getElementById('whatsapp').value.trim();
  const segment   = document.getElementById('segment').value;
  const location  = document.getElementById('location').value.trim();

  /* Validate — highlight missing fields and stop */
  const hasErrors = !name || !email || !whatsapp || !segment || !location;

  highlightErrors([
    { id: 'name', value: name },
    { id: 'email',     value: email     },
    { id: 'whatsapp',  value: whatsapp  },
    { id: 'segment',   value: segment   },
    { id: 'location',  value: location  },
  ]);

  if (hasErrors) return;

  /* ── Create a hidden iframe to absorb Google's redirect response */
  let iframe = document.getElementById('_gf_sink');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id   = '_gf_sink';
    iframe.name = '_gf_sink';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  /* ── Build a temporary form that POSTs into the hidden iframe.
        This is a native browser form POST — not fetch() — so it
        bypasses CORS restrictions entirely. Google Forms accepts it. */
  const tempForm = document.createElement('form');
  tempForm.method = 'POST';
  tempForm.action = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
  tempForm.target = '_gf_sink';
  tempForm.style.display = 'none';

  const fields = {
    [FORM_ENTRY_IDS.name]:     name,
    [FORM_ENTRY_IDS.email]:    email,
    [FORM_ENTRY_IDS.whatsapp]: whatsapp,
    [FORM_ENTRY_IDS.segment]:  segment,
    [FORM_ENTRY_IDS.location]: location,
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = name;
    input.value = value;
    tempForm.appendChild(input);
  });

  document.body.appendChild(tempForm);
  tempForm.submit();
  document.body.removeChild(tempForm);

  /* Show success state immediately — iframe absorbs Google's redirect */
  showSuccess();
}

function showSuccess() {
  document.getElementById('formContent').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
  document.getElementById('register').scrollIntoView({ behavior: 'smooth' });
}
