/* ================================================
   STROM-TEILEN.DE — Main JS
   Dark mode toggle + tab switching + form handling
   ================================================ */

// --- DARK MODE TOGGLE ---
(function () {
  const html = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let current = systemDark ? 'dark' : 'light';
  html.setAttribute('data-theme', current);

  function updateToggleIcon(theme) {
    if (!toggle) return;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Hellmodus aktivieren' : 'Dunkelmodus aktivieren');
    toggle.innerHTML = theme === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }

  updateToggleIcon(current);

  if (toggle) {
    toggle.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', current);
      updateToggleIcon(current);
    });
  }
})();

// --- TAB SWITCHING ---
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.reg-tab');
  const forms = document.querySelectorAll('.reg-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // Update tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update forms
      forms.forEach(form => {
        form.classList.remove('active');
        if (form.id === 'form-' + target) {
          form.classList.add('active');
        }
      });
    });
  });

  // --- FORMSPREE AJAX SUBMISSION ---
  // Handles both forms with a single success state
  const allForms = document.querySelectorAll('.reg-form');
  const successState = document.getElementById('form-success');

  allForms.forEach(form => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn = form.querySelector('.btn-primary');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Wird gesendet…';
      btn.disabled = true;

      try {
        const data = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Hide all forms and tabs, show success
          document.querySelector('.reg-tabs').style.display = 'none';
          allForms.forEach(f => f.classList.remove('active'));
          if (successState) {
            successState.removeAttribute('hidden');
          }
        } else {
          btn.innerHTML = 'Fehler — bitte nochmal versuchen';
          btn.disabled = false;
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 3000);
        }
      } catch (err) {
        btn.innerHTML = 'Fehler — bitte nochmal versuchen';
        btn.disabled = false;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 3000);
      }
    });
  });

  // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- SCROLL FADE-IN ANIMATION ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.step-card, .law-point, .check-item, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});
