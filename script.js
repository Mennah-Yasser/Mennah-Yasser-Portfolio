(() => {
  const content = window.portfolioContent;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const skillsGrid = document.querySelector('#skills-grid');
  content.skills.forEach((group) => {
    const section = document.createElement('article');
    section.className = 'skill-group';
    const entries = group.items.map((item) => {
      const name = typeof item === 'string' ? item : item.name;
      const label = typeof item === 'string' ? escapeHtml(name) : `${escapeHtml(name)} <strong>· ${escapeHtml(item.level)}</strong>`;
      return `<span>${label}</span>`;
    }).join('');
    section.innerHTML = `<h3>${escapeHtml(group.title)}</h3><div class="${group.title === 'Languages' ? 'language-list' : 'skill-tags'}">${entries}</div>`;
    skillsGrid.append(section);
  });

  document.querySelector('#services-list').innerHTML = content.services.map((service, index) => `
    <article class="service-item"><span class="service-number">0${index + 1}</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.description)}</p><span class="service-arrow" aria-hidden="true">↗</span></article>
  `).join('');

  document.querySelector('#projects-grid').innerHTML = content.projects.map((project, index) => {
    const actions = [];
    if (project.github) actions.push(`<a href="${escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer">View on GitHub <span aria-hidden="true">↗</span></a>`);
    if (project.demo) actions.push(`<a href="${escapeHtml(project.demo)}" target="_blank" rel="noopener noreferrer">Live Demo <span aria-hidden="true">↗</span></a>`);
    if (!actions.length) actions.push('<span class="disabled-note">Repository link not provided</span>');
    return `<article class="project-card"><div class="project-top"><span class="project-index">PROJECT / 0${index + 1}</span><span class="project-kind">Web application</span></div>${project.image ? `<div class="project-image"><img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt || `${project.name} project screenshot`)}" loading="lazy" /></div>` : ''}<h3>${escapeHtml(project.name)}</h3><p>${escapeHtml(project.description)}</p><div class="project-tags">${project.technologies.map((tech) => `<span>${escapeHtml(tech)}</span>`).join('')}</div><div class="project-actions">${actions.join('')}</div></article>`;
  }).join('');

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 680) setMenu(false); });
  document.querySelector('#year').textContent = new Date().getFullYear();

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.classList.remove('error', 'success');
    if (!form.reportValidity()) {
      status.textContent = 'Please check the highlighted fields. Include a valid email and a message of at least 10 characters.';
      status.classList.add('error');
      return;
    }
    const fields = new FormData(form);
    const subject = String(fields.get('subject')).trim();
    const body = `From: ${String(fields.get('name')).trim()}\nReply email: ${String(fields.get('email')).trim()}\n\n${String(fields.get('message')).trim()}`;
    status.textContent = 'Your email app should open with this draft. The website has not sent your message.';
    status.classList.add('success');
    window.location.href = `mailto:mennahyasser81@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  const reveals = document.querySelectorAll('.section-heading, .about-layout, .section-topline, .education-item, .skill-group, .service-item, .project-card, .contact-copy, .contact-form');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    reveals.forEach((element) => { element.classList.add('reveal'); observer.observe(element); });
  }
})();

