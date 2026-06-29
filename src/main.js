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
  // 4. REAL-TIME IMPORT CALCULATION LOGIC
  // ==========================================
  const calcForm = document.getElementById('import-calculator-form');
  const priceInput = document.getElementById('vehicle-price');
  const countrySelect = document.getElementById('sourcing-country');
  const categorySelect = document.getElementById('vehicle-category');

  // Outputs elements
  const resFob = document.getElementById('res-fob');
  const resShipping = document.getElementById('res-shipping');
  const resDuty = document.getElementById('res-duty');
  const resAgency = document.getElementById('res-agency');
  const resTotal = document.getElementById('res-total');
  const resDeposit = document.getElementById('res-deposit');
  const resInst1 = document.getElementById('res-inst1');
  const resInst2 = document.getElementById('res-inst2');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  const calculateEstimate = () => {
    const fobPrice = parseFloat(priceInput.value) || 0;
    const country = countrySelect.value;
    const category = categorySelect.value;
    
    // Get shipping method
    const shippingMethod = document.querySelector('input[name="shipping-method"]:checked').value;

    // 1. Calculate Shipping Cost dynamically by country & method
    let baseShipping = 0;
    if (shippingMethod === 'roro') {
      switch(country) {
        case 'japan': baseShipping = 1600; break;
        case 'uk': baseShipping = 2000; break;
        case 'safrica': baseShipping = 950; break;
        case 'singapore': baseShipping = 1750; break;
        default: baseShipping = 1600;
      }
    } else { // Container
      switch(country) {
        case 'japan': baseShipping = 2800; break;
        case 'uk': baseShipping = 3200; break;
        case 'safrica': baseShipping = 1600; break;
        case 'singapore': baseShipping = 3000; break;
        default: baseShipping = 2800;
      }
    }

    // 2. Estimate ZIMRA Customs Duty based on category
    // Duties are calculated on CIF (Cost, Insurance & Freight)
    const cifValue = fobPrice + baseShipping;
    let dutyRate = 0.40; // Default sedan
    
    switch(category) {
      case 'sedan': dutyRate = 0.40; break;
      case 'suv': dutyRate = 0.45; break;
      case 'doublecab': dutyRate = 0.35; break;
      case 'truck': dutyRate = 0.25; break;
    }
    const estimatedDuty = cifValue * dutyRate;

    // 3. Agency Clearing & Admin Fees
    // Flat rate plus variable percentage
    const agencyFee = (cifValue * 0.02) + 450;

    // 4. Totals
    const totalCost = fobPrice + baseShipping + estimatedDuty + agencyFee;
    const depositAmount = totalCost * 0.50;
    const installmentAmount = (totalCost - depositAmount) / 2;

    // Render to elements
    resFob.textContent = formatCurrency(fobPrice);
    resShipping.textContent = formatCurrency(baseShipping);
    resDuty.textContent = formatCurrency(estimatedDuty);
    resAgency.textContent = formatCurrency(agencyFee);
    resTotal.textContent = formatCurrency(totalCost);
    
    resDeposit.textContent = formatCurrency(depositAmount);
    resInst1.textContent = formatCurrency(installmentAmount);
    resInst2.textContent = formatCurrency(installmentAmount);
  };

  // Attach event listeners for inputs
  priceInput.addEventListener('input', calculateEstimate);
  countrySelect.addEventListener('change', calculateEstimate);
  categorySelect.addEventListener('change', calculateEstimate);
  document.querySelectorAll('input[name="shipping-method"]').forEach(radio => {
    radio.addEventListener('change', calculateEstimate);
  });

  // Run initial calculation on load
  calculateEstimate();

  // ==========================================
  // 5. BOOK SERVICE REDIRECT LINKING
  // ==========================================
  const serviceDropdown = document.getElementById('contact-service');
  const bookServiceBtns = document.querySelectorAll('.btn-book-service');

  bookServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedService = btn.getAttribute('data-service');
      if (selectedService && serviceDropdown) {
        // Find matching option and select it
        for (let i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].text.includes(selectedService)) {
            serviceDropdown.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // ==========================================
  // 6. MODAL VISIBILITY & APPLICATION FORM
  // ==========================================
  const modal = document.getElementById('import-quote-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const openModalBtns = document.querySelectorAll('.open-import-modal');
  const modalCarInput = document.getElementById('modal-car-model');
  const modalPriceInput = document.getElementById('modal-price');
  const modalCountrySelect = document.getElementById('modal-country');

  const openModal = () => {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop page scrolling
    
    // Auto-populate modal fields if coming from calculator
    const currentPrice = priceInput.value;
    const currentCountry = countrySelect.value;
    const currentCategoryText = categorySelect.options[categorySelect.selectedIndex].text.split(' (')[0];
    
    if (modalCarInput && !modalCarInput.value) {
      modalCarInput.value = `${currentCategoryText} Sourced`;
    }
    if (modalPriceInput) {
      modalPriceInput.value = currentPrice;
    }
    if (modalCountrySelect) {
      modalCountrySelect.value = currentCountry;
    }
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

  // Start the loop automatically
  if (slides.length > 0) {
    startSlideShow();
  }
});
