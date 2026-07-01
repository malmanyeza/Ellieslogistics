document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THEME SWITCHER
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  const body = document.body;

  // Update toggle button icon state to match the body class (set by the inline script)
  if (body.classList.contains('light-theme')) {
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    themeIcon.className = 'fa-solid fa-moon';
  }

  // Toggle Theme
  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('theme', 'dark');
    }
  });

  // ==========================================
  // 2. STICKY HEADER & ACTIVE NAV LINKS
  // ==========================================
  const header = document.getElementById('main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Intersection Observer for Active Navigation Highlighting
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-item');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the middle of the viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update Desktop Nav
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });

        // Update Mobile Nav Links
        mobileNavItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // ==========================================
  // 3. MOBILE MENU TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  const mobileMenuIcon = mobileMenuBtn.querySelector('i');

  mobileMenuBtn.addEventListener('click', () => {
    mobileNavMenu.classList.toggle('open');
    if (mobileNavMenu.classList.contains('open')) {
      mobileMenuIcon.className = 'fa-solid fa-xmark';
    } else {
      mobileMenuIcon.className = 'fa-solid fa-bars';
    }
  });

  // Close Mobile Menu on link click
  const allMobileNavLinks = document.querySelectorAll('.mobile-nav-item, .mobile-cta');
  allMobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavMenu.classList.remove('open');
      mobileMenuIcon.className = 'fa-solid fa-bars';
    });
  });

  // ==========================================
  // 4. MODAL VISIBILITY & APPLICATION FORM
  // ==========================================
  const modal = document.getElementById('import-quote-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const openModalBtns = document.querySelectorAll('.open-import-modal');

  const openModal = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop page scrolling
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Restore scrolling
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside card
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // ==========================================
  // 7. FORM SUBMISSIONS WITH ANIMATIONS
  // ==========================================
  const handleFormSubmit = (formId, successAlertId, buttonId) => {
    const form = document.getElementById(formId);
    const successAlert = document.getElementById(successAlertId);
    const submitBtn = document.getElementById(buttonId);
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show spinner & disable button
      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      submitBtn.disabled = true;

      // Mock API call delay (1.5 seconds)
      setTimeout(() => {
        // Reset button state
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        submitBtn.disabled = false;

        // Show Success Alert
        successAlert.classList.remove('hidden');
        
        // Reset Form Fields
        form.reset();

        // Hide success alert after 5 seconds
        setTimeout(() => {
          successAlert.classList.add('hidden');
          // If it was the modal form, close modal after completion
          if (formId === 'modal-quote-form') {
            closeModal();
          }
        }, 5000);

      }, 1500);
    });
  };

  // Initialize Contact Us Form Submission
  handleFormSubmit('contact-us-form', 'contact-success', 'btn-submit-contact');
  
  // Initialize Modal Import Quote Form Submission
  handleFormSubmit('modal-quote-form', 'modal-success', 'btn-submit-modal');

  // ==========================================
  // 8. HERO SLIDESHOW LOGIC
  // ==========================================
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.indicator-dot');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
        dots[i].classList.add('active');
      } else {
        slide.classList.remove('active');
        dots[i].classList.remove('active');
      }
    });
    currentSlide = index;
  };

  const nextSlide = () => {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  };

  const startSlideShow = () => {
    slideInterval = setInterval(nextSlide, 4500); // Transition every 4.5s
  };

  const stopSlideShow = () => {
    clearInterval(slideInterval);
  };

  // Add click events to indicators
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopSlideShow();
      showSlide(index);
      startSlideShow(); // Reset interval
    });
  });

  // Add click events for Arrow Navigation Buttons
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      stopSlideShow();
      let prev = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prev);
      startSlideShow();
    });

    nextBtn.addEventListener('click', () => {
      stopSlideShow();
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
      startSlideShow();
    });
  }

  // Start the loop automatically
  if (slides.length > 0) {
    startSlideShow();
  }
});
