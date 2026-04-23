const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealItems = document.querySelectorAll('.expertise-card, .service-item, .credential-item');

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(24px)';
    item.style.transitionDelay = `${index * 0.06}s`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
  });
}

const photoFrame = document.querySelector('.photo-frame');
const profileImage = photoFrame?.querySelector('img');

const renderPhotoFallback = () => {
  if (!photoFrame || photoFrame.querySelector('.photo-fallback')) {
    return;
  }

  profileImage?.remove();

  const placeholder = document.createElement('div');
  placeholder.className = 'photo-fallback';
  placeholder.innerHTML = '<span>TS</span>';
  photoFrame.insertBefore(placeholder, photoFrame.firstChild);
};

if (profileImage) {
  profileImage.addEventListener('error', renderPhotoFallback, { once: true });

  if (profileImage.complete && profileImage.naturalWidth === 0) {
    renderPhotoFallback();
  }
}

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-links');

if (navToggle && navMenu) {
  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}

const yearTarget = document.querySelector('[data-year]');

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

const copyButton = document.querySelector('[data-copy-email]');
const copyLabel = copyButton?.querySelector('[data-copy-label]');
const defaultCopyText = copyLabel?.textContent ?? '';

if (copyButton && copyLabel) {
  copyButton.addEventListener('click', async () => {
    const email = copyButton.getAttribute('data-copy-email');

    if (!email) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copyButton.classList.add('copied');
        copyLabel.textContent = 'Copied';
        window.setTimeout(() => {
          copyButton.classList.remove('copied');
          copyLabel.textContent = defaultCopyText;
        }, 1800);
      } else {
        window.location.href = `mailto:${email}`;
      }
    } catch (error) {
      window.location.href = `mailto:${email}`;
    }
  });
}
