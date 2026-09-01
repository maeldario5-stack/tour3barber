/* ============================================
   TOUR3BARBER V2 — JavaScript
   Premium Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js');

  // === DOM Elements ===
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const navLinks = document.querySelectorAll('.nav-links a');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const sections = document.querySelectorAll('section[id]');
  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  const socialSidebar = document.querySelector('.social-sidebar');

  // === State ===
  let lastScrollY = 0;
  let currentLightboxIndex = 0;
  let lightboxCloseTimeout = null;
  let ticking = false;

  // ============================================
  // DYNAMIC COPYRIGHT YEAR
  // ============================================
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ============================================
  // NAVBAR — Scroll Effect + Auto-Hide
  // ============================================
  const handleNavScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 300) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        // Social sidebar visibility
        if (socialSidebar) {
          if (window.scrollY > lastScrollY && window.scrollY > 300) {
            socialSidebar.style.opacity = '0';
            socialSidebar.style.pointerEvents = 'none';
          } else {
            socialSidebar.style.opacity = '1';
            socialSidebar.style.pointerEvents = 'auto';
          }
        }
      });
      ticking = true;
    }
  }, { passive: true });

  handleNavScroll();

  // ============================================
  // NAVBAR — Active Link via IntersectionObserver
  // ============================================
  const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => activeLinkObserver.observe(section));

  // ============================================
  // MOBILE MENU
  // ============================================
  const toggleMobileNav = () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMobileNav);

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) {
          toggleMobileNav();
        }
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileNav.classList.contains('open')) toggleMobileNav();
      if (lightbox && lightbox.classList.contains('active')) closeLightbox(false);
      const bModal = document.getElementById('bookingModal');
      if (bModal && bModal.classList.contains('active')) {
        const closeBtn = document.getElementById('bookingModalClose');
        if (closeBtn) closeBtn.click();
      }
    }
    // Lightbox arrow navigation
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    }
  });

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // ============================================
  // GALLERY LIGHTBOX & FILTERING
  // ============================================
  let activeGalleryArray = Array.from(galleryItems);

  const openLightbox = (index) => {
    if (lightboxCloseTimeout) {
      clearTimeout(lightboxCloseTimeout);
      lightboxCloseTimeout = null;
    }

    currentLightboxIndex = index;
    const item = activeGalleryArray[index];
    const src = item.getAttribute('data-src') || item.querySelector('img').src;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add history state
    history.pushState({ modalOpen: 'lightbox' }, '', '#lightbox');
  };

  const closeLightbox = (fromHistory = false) => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxCloseTimeout = setTimeout(() => {
      lightboxImg.src = 'data:,';
      lightboxCloseTimeout = null;
    }, 400);
    
    // Remove history state if not triggered by back button
    if (!fromHistory && history.state && history.state.modalOpen === 'lightbox') {
      history.back();
    }
  };

  const navigateLightbox = (direction) => {
    if (activeGalleryArray.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + direction + activeGalleryArray.length) % activeGalleryArray.length;
    const item = activeGalleryArray[currentLightboxIndex];
    const src = item.getAttribute('data-src') || item.querySelector('img').src;

    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = `scale(0.95) translateX(${direction * 30}px)`;

    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1) translateX(0)';
    }, 150);
  };

  const galleryGrid = document.querySelector('.gallery-grid');
  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if (!item || item.classList.contains('hidden')) return;
      
      const index = activeGalleryArray.indexOf(item);
      if (index !== -1) {
        openLightbox(index);
      }
    });
  }

  const filterTriggers = document.querySelectorAll('.filter-trigger');
  filterTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const filterValue = this.getAttribute('data-filter');
      
      // Update filter button styling
      document.querySelectorAll('.gallery-filters .filter-trigger').forEach(btn => btn.style.borderColor = 'var(--gold-border)');
      const activeBtn = document.querySelector(`.gallery-filters .filter-trigger[data-filter="${filterValue}"]`);
      if (activeBtn) activeBtn.style.borderColor = 'var(--gold)';
      
      const allGalleryItems = document.querySelectorAll('.gallery-item');
      allGalleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      
      activeGalleryArray = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));

      // Smooth scroll to gallery
      const targetEl = document.querySelector('#galerie');
      if (targetEl) {
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const offsetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', () => closeLightbox(false));
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox(false);
  });


  // Touch swipe for lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
      navigateLightbox(diff > 0 ? 1 : -1);
    }
  }, { passive: true });

  // ============================================
  // BOOKING MODAL (Attente Cal.com)
  // ============================================
  const bookingModal = document.getElementById('bookingModal');
  const bookingModalClose = document.getElementById('bookingModalClose');
  const bookingModalOverlay = document.getElementById('bookingModalOverlay');

  const openBookingModal = () => {
    if (!bookingModal) return;
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus the first input for accessibility
    const firstInput = bookingModal.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
    
    history.pushState({ modalOpen: 'booking' }, '', '#reservation');
  };

  const closeBookingModal = (fromHistory = false) => {
    if (!bookingModal) return;
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
    
    if (!fromHistory && history.state && history.state.modalOpen === 'booking') {
      history.back();
    }
  };

  // Listen for hardware back button to close modals
  window.addEventListener('popstate', (e) => {
    // Determine which modal is active
    if (lightbox && lightbox.classList.contains('active')) {
      closeLightbox(true);
    } else if (bookingModal && bookingModal.classList.contains('active')) {
      closeBookingModal(true);
    }
  });

  if (bookingModalClose) bookingModalClose.addEventListener('click', () => closeBookingModal(false));
  if (bookingModalOverlay) bookingModalOverlay.addEventListener('click', () => closeBookingModal(false));

  document.querySelectorAll('a[href="#reservation"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      // If mobile nav is open, close it
      if (mobileNav && mobileNav.classList.contains('open')) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
      }
      openBookingModal();
    });
  });

  const waBookingForm = document.getElementById('waBookingForm');
  const waServiceSelect = document.getElementById('waService');
  const waDescGroup = document.getElementById('waDescGroup');

  if (waServiceSelect && waDescGroup) {
    waServiceSelect.addEventListener('change', (e) => {
      if (e.target.value === 'Coupe sur demande') {
        waDescGroup.style.display = 'flex';
      } else {
        waDescGroup.style.display = 'none';
      }
    });
  }

  // ============================================
  // FRAIS DE DÉPLACEMENT — Détection en temps réel
  // ============================================

  // Liste blanche : villes sans frais de déplacement (normalisées, sans accents, en minuscules)
  const villesGratuites = [
    "monthey",
    "chemex",       // Chemex
    "choex",        // Choëx
    "troistorrents", // Troistorrents
    "chenarlier",
    "collombey",
    "les neyres",
    "massongex"
  ];

  /**
   * Normalise une chaîne : supprime les accents/diacritiques,
   * passe en minuscules, et retire les espaces superflus.
   * Ex: "Choëx" → "choex", "Les Neyres" → "les neyres"
   */
  const normaliserTexte = (str) => {
    return str
      .normalize('NFD')                   // Décompose les caractères accentués
      .replace(/[\u0300-\u036f]/g, '')    // Supprime les diacritiques (accents)
      .toLowerCase()                      // Tout en minuscules
      .trim();                            // Supprime les espaces en début/fin
  };

  /**
   * Vérifie si le texte saisi contient une ville de la liste blanche.
   * On cherche si l'une des villes gratuites est contenue dans l'adresse saisie.
   */
  const estVilleGratuite = (saisie) => {
    const saisieNormalisee = normaliserTexte(saisie);
    return villesGratuites.some(ville => saisieNormalisee.includes(ville));
  };

  // Éléments du DOM pour la détection
  const waAddressInput = document.getElementById('waAddress');
  const travelFeeAlert = document.getElementById('travelFeeAlert');

  if (waAddressInput && travelFeeAlert) {
    // Le message s'affiche uniquement quand l'utilisateur quitte le champ (blur)
    // → il a fini de taper sa ville
    waAddressInput.addEventListener('blur', () => {
      const valeur = waAddressInput.value.trim();

      if (valeur.length > 0 && !estVilleGratuite(valeur)) {
        travelFeeAlert.classList.add('visible');
      } else {
        travelFeeAlert.classList.remove('visible');
      }
    });
  }

  // ============================================
  // FORMULAIRE WHATSAPP (avec frais de déplacement)
  // ============================================
  if (waBookingForm) {
    waBookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('waName').value.trim();
      const address = document.getElementById('waAddress').value.trim();
      const service = document.getElementById('waService').value;
      const description = document.getElementById('waDescription') ? document.getElementById('waDescription').value.trim() : '';
      const timePref = document.getElementById('waTime').value.trim();

      if (!name || !address || !service || !timePref) return;

      let message = `Salut Nico ! 💈 Je souhaite réserver pour un(e) ${service}.`;
      if (service === 'Coupe sur demande' && description) {
        message += `\n\nDétails de la demande : "${description}"\n(Je t'envoie des photos en suivant).`;
      }
      message += `\n\nJe m'appelle ${name} et j'habite à ${address}. Créneau souhaité / disponibilités : ${timePref}. Dis-moi à quelle heure tu peux passer !`;

      // Ajouter la mention des frais de déplacement si hors zone gratuite
      if (address.length > 0 && !estVilleGratuite(address)) {
        message += `\n\n(Je note qu'il y aura 5 CHF de frais de déplacement pour cette zone)`;
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/41799677796?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank');
      closeBookingModal();
      waBookingForm.reset();
      if (waDescGroup) waDescGroup.style.display = 'none';
      // Réinitialiser l'alerte de frais de déplacement
      if (travelFeeAlert) travelFeeAlert.classList.remove('visible');
    });
  }
  // ============================================
  // SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.classList.contains('filter-trigger')) return; // handled by gallery filter
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#reservation') return;

      let targetEl;
      try {
        targetEl = document.querySelector(targetId);
      } catch (e) {
        /* invalid selector */
        return;
      }

      if (targetEl) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // COUNTER ANIMATION (About Stats)
  // ============================================
  const counters = document.querySelectorAll('.stat-number');
  let counterAnimated = false;

  const animateCounters = () => {
    if (counterAnimated) return;
    counterAnimated = true;

    counters.forEach(counter => {
      const text = counter.textContent;
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      let current = 0;
      const increment = Math.ceil(target / 35);
      const stepTime = 1200 / (target / increment);

      const updateCounter = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + suffix;
          counter.style.transform = 'scale(1.15)';
          setTimeout(() => { counter.style.transform = 'scale(1)'; }, 200);
          return;
        }
        counter.textContent = current + suffix;
        setTimeout(updateCounter, stepTime);
      };

      updateCounter();
    });
  };

  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ============================================
  // MAGNETIC BUTTON HOVER
  // ============================================
  if (window.matchMedia('(hover: hover)').matches) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ============================================
  // PARALLAX HERO (Desktop only)
  // ============================================
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && window.matchMedia('(min-width: 768px) and (hover: hover)').matches) {
    let parallaxTicking = false;

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          if (scrolled < window.innerHeight) {
            heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.12}px)`;
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // MENU ITEM HOVER EFFECT (Services)
  // ============================================
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.borderBottomColor = 'rgba(212, 175, 55, 0.2)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.borderBottomColor = '';
    });
  });


});
