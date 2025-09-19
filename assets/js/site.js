(function() {
  const body = document.body;
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navPanel = document.querySelector('[data-nav-panel]');

  if (navToggle && navPanel) {
    const toggleNav = () => {
      const isOpen = navPanel.getAttribute('data-open') === 'true';
      navPanel.setAttribute('data-open', String(!isOpen));
      body.classList.toggle('overflow-hidden', !isOpen);
    };

    navToggle.addEventListener('click', toggleNav);
    navPanel.addEventListener('click', (event) => {
      if (event.target.closest('[data-nav-close]')) {
        toggleNav();
      }
      if (event.target === navPanel) {
        toggleNav();
      }
    });

    navPanel.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navPanel.getAttribute('data-open') === 'true') {
          toggleNav();
        }
      });
    });
  }

  const fadeElems = document.querySelectorAll('.fade-in-up');
  if (fadeElems.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    fadeElems.forEach(elem => observer.observe(elem));
  }

  const yearSpan = document.querySelector('[data-year]');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();
