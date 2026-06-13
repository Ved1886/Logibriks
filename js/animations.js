/* ============================================
   CINEMATIC SCROLL ANIMATIONS
   GSAP ScrollTrigger + Premium Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // SMOOTH SCROLL PROGRESS BAR
  // ============================================
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
    progressBar.style.transformOrigin = 'left center';
    progressBar.style.transform = 'scaleX(0)';
  }

  // ============================================
  // HERO — CINEMATIC ENTRANCE SEQUENCE
  // ============================================
  const heroTL = gsap.timeline({ delay: 0.3 });

  heroTL
    .from('.hero-badge', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power3.out'
    })
    .from('.hero-title', {
      opacity: 0, y: 40, duration: 0.7, ease: 'power3.out'
    }, '-=0.2')
    .from('.hero-description', {
      opacity: 0, y: 30, duration: 0.6, ease: 'power3.out'
    }, '-=0.3')
    .from('.hero-tracker-widget', {
      opacity: 0, y: 25, scale: 0.98, duration: 0.6, ease: 'power3.out'
    }, '-=0.3')
    .from('.hero-ctas', {
      opacity: 0, y: 20, duration: 0.5, ease: 'power3.out'
    }, '-=0.3')
    .from('.hero-stat', {
      opacity: 0, y: 20, stagger: 0.1, duration: 0.5, ease: 'power3.out'
    }, '-=0.2')
    .from('.hero-visual', {
      opacity: 0, x: 60, scale: 0.95, duration: 0.8, ease: 'power3.out'
    }, '-=0.7')
    .from('.floating-tracker', {
      opacity: 0, x: 30, y: -20, duration: 0.5, ease: 'back.out(1.4)'
    }, '-=0.3')
    .from('.floating-notification', {
      opacity: 0, x: -30, y: 20, duration: 0.5, ease: 'back.out(1.4)'
    }, '-=0.2');

  // ============================================
  // CULTURE HERO — CINEMATIC ENTRANCE SEQUENCE
  // ============================================
  if (document.querySelector('.culture-hero')) {
    const cultureHeroTL = gsap.timeline({ delay: 0.3 });
    cultureHeroTL
      .from('.culture-hero-title', {
        opacity: 0, y: 40, duration: 0.7, ease: 'power3.out'
      })
      .from('.culture-hero-subtitle', {
        opacity: 0, y: 30, duration: 0.6, ease: 'power3.out'
      }, '-=0.4')
      .from('.culture-hero-btn', {
        opacity: 0, y: 20, duration: 0.5, ease: 'power3.out'
      }, '-=0.3')
      .from('.culture-hero-image-wrap', {
        opacity: 0, y: 40, scale: 0.98, duration: 0.7, ease: 'power3.out'
      }, '-=0.4');
  }

  // ============================================
  // HERO — PARALLAX ON SCROLL
  // ============================================
  gsap.to('.hero-title', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    y: -60, opacity: 0, ease: 'none'
  });

  gsap.to('.hero-description', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '80% top', scrub: 0.8 },
    y: -40, opacity: 0, ease: 'none'
  });

  gsap.to('.hero-tracker-widget', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '70% top', scrub: 0.8 },
    y: -30, opacity: 0, ease: 'none'
  });

  gsap.to('.hero-ctas', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: '60% top', scrub: 0.8 },
    y: -20, opacity: 0, ease: 'none'
  });

  gsap.to('.hero-visual', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    y: 80, scale: 0.9, ease: 'none'
  });

  gsap.to('.dashboard-preview', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    y: 40, rotation: 3, ease: 'none'
  });

  // ============================================
  // SECTION REVEALS — STAGGERED CLIP ENTRANCES
  // ============================================
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 35,
      duration: 0.7,
      ease: 'power3.out'
    });
  });

  gsap.utils.toArray('.section-subtitle').forEach(sub => {
    gsap.from(sub, {
      scrollTrigger: {
        trigger: sub,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.15,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.section-label').forEach(label => {
    gsap.from(label, {
      scrollTrigger: {
        trigger: label,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 15,
      scale: 0.9,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  });

  // ============================================
  // HOW-IT-WORKS — STAGGERED STEP CARDS
  // ============================================
  const howSteps = gsap.utils.toArray('.how-step');
  if (howSteps.length) {
    gsap.fromTo(howSteps,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: '.how-steps',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out'
      }
    );
  }

  // ============================================
  // SERVICE CARDS — CASCADING REVEAL
  // ============================================
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.06,
        ease: 'power3.out'
      }
    );
  });

  // ============================================
  // FEATURE PANELS — SLIDE & FADE
  // ============================================
  gsap.utils.toArray('.feature-panel').forEach(panel => {
    const info = panel.querySelector('.feature-info');
    const preview = panel.querySelector('.feature-preview');

    if (info) {
      gsap.from(info, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -40,
        duration: 0.7,
        ease: 'power3.out'
      });
    }

    if (preview) {
      gsap.from(preview, {
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 40,
        scale: 0.95,
        duration: 0.7,
        delay: 0.15,
        ease: 'power3.out'
      });
    }
  });

  // ============================================
  // TRACKING SECTION — SPLIT ENTRANCE
  // ============================================
  const trackingLeft = document.querySelector('.tracking-left');
  const trackingVisual = document.querySelector('.tracking-visual');

  if (trackingLeft) {
    gsap.fromTo(trackingLeft,
      { opacity: 0, x: -50 },
      {
        scrollTrigger: {
          trigger: '.tracking-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power3.out'
      }
    );
  }

  if (trackingVisual) {
    gsap.fromTo(trackingVisual,
      { opacity: 0, x: 50 },
      {
        scrollTrigger: {
          trigger: '.tracking-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        x: 0,
        duration: 0.7,
        delay: 0.15,
        ease: 'power3.out'
      }
    );
  }

  // ============================================
  // FLEET TABS — ENTRANCE
  // ============================================
  gsap.utils.toArray('.fleet-tab').forEach((tab, i) => {
    gsap.from(tab, {
      scrollTrigger: {
        trigger: tab.parentElement,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 15,
      duration: 0.4,
      delay: i * 0.08,
      ease: 'power2.out'
    });
  });

  // ============================================
  // BENEFIT CARDS — SCALE UP STAGGER
  // ============================================
  gsap.utils.toArray('.benefit-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 35, scale: 0.94 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        delay: i * 0.06,
        ease: 'power3.out'
      }
    );
  });

  // ============================================
  // PRICING CARDS & TOGGLE — CASCADE ENTRANCE
  // ============================================
  const pricingToggleContainer = document.querySelector('.pricing-toggle-container');
  if (pricingToggleContainer) {
    gsap.fromTo(pricingToggleContainer,
      { opacity: 0, y: 20 },
      {
        scrollTrigger: {
          trigger: pricingToggleContainer,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }
    );
  }

  gsap.utils.toArray('.pricing-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 55, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power3.out'
      }
    );
  });

  // ============================================
  // TESTIMONIAL CARDS — SLIDE IN
  // ============================================
  gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, x: i % 2 === 0 ? -30 : 30, y: 20 },
      {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }
    );
  });

  // ============================================
  // FAQ ITEMS — CASCADE
  // ============================================
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.45,
      delay: i * 0.05,
      ease: 'power2.out'
    });
  });

  // ============================================
  // QUOTE FORM — REVEAL
  // ============================================
  const quoteForm = document.querySelector('.quote-form');
  if (quoteForm) {
    gsap.from(quoteForm, {
      scrollTrigger: {
        trigger: quoteForm,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 40,
      scale: 0.97,
      duration: 0.7,
      ease: 'power3.out'
    });
  }

  // ============================================
  // PARTNER MARQUEE — FADE IN
  // ============================================
  const marquee = document.querySelector('.marquee-wrapper');
  if (marquee) {
    gsap.from(marquee, {
      scrollTrigger: {
        trigger: marquee,
        start: 'top 92%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    });
  }

  // ============================================
  // CARD TILT-ON-HOVER (3D Perspective)
  // ============================================
  document.querySelectorAll('.service-card, .benefit-card, .dash-card, .principle-card, .stat-card, .country-card, .founder-card, .culture-testimonial-card, .secure-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 800,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });

  // ============================================
  // MAGNETIC BUTTON HOVER
  // ============================================
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });

  // ============================================
  // VIDEO SWAP BY DEVICE
  // ============================================
  function handleVideoSwap() {
    const desktopVideos = document.querySelectorAll('.video-desktop');
    const mobileVideos = document.querySelectorAll('.video-mobile');
    const isMobile = window.innerWidth <= 768;

    desktopVideos.forEach(v => v.style.display = isMobile ? 'none' : 'block');
    mobileVideos.forEach(v => v.style.display = isMobile ? 'block' : 'none');
  }

  handleVideoSwap();
  window.addEventListener('resize', handleVideoSwap);

  // ============================================
  // SMOOTH REVEAL FOR .reveal ELEMENTS
  // ============================================
  // Exclude elements animated by specific staggers/triggers to prevent double-triggering conflicts
  gsap.utils.toArray('.reveal:not(.how-step):not(.service-card):not(.benefit-card):not(.pricing-card):not(.tracking-left):not(.tracking-visual):not(.pricing-toggle-container)').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        immediateRender: false
      }
    );
  });

  // ============================================
  // PARALLAX FOR BACKGROUND ELEMENTS
  // ============================================
  gsap.utils.toArray('.bg-glow').forEach(glow => {
    gsap.to(glow, {
      scrollTrigger: {
        trigger: glow.closest('.section') || glow.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      },
      y: -80,
      ease: 'none'
    });
  });

  // ============================================
  // NEWSLETTER / CTA — ENTRANCE
  // ============================================
  const ctaSection = document.querySelector('.newsletter-section, .cta-section');
  if (ctaSection) {
    gsap.from(ctaSection.children, {
      scrollTrigger: {
        trigger: ctaSection,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    });
  }

  // ============================================
  // BENTO WIDGET PROGRESS BAR FILL ANIMATION
  // ============================================
  document.querySelectorAll('.bento-progress-fill').forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';

    gsap.to(bar, {
      scrollTrigger: {
        trigger: bar,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      width: targetWidth,
      duration: 1.2,
      ease: 'power2.out'
    });
  });

  // ============================================
  // ROUTE LINE PROGRESS — ANIMATE ON SCROLL
  // ============================================
  const routeProgress = document.querySelector('.bento-route-progress');
  if (routeProgress) {
    const targetWidth = routeProgress.style.width || '50%';
    routeProgress.style.width = '0%';

    gsap.to(routeProgress, {
      scrollTrigger: {
        trigger: routeProgress,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      width: targetWidth,
      duration: 1.5,
      ease: 'power2.inOut'
    });
  }

  // ============================================
  // STATS COUNTER ANIMATION (GSAP)
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const originalText = stat.innerText.trim();
    const numericPart = originalText.replace(/[^0-9]/g, '');
    const suffix = originalText.replace(/[0-9,]/g, '');
    const hasComma = originalText.includes(',');
    const targetValue = parseInt(numericPart, 10);

    if (isNaN(targetValue)) return;

    // Set initial display to 0 with suffix to prevent jumpy rendering
    stat.innerText = (hasComma ? "0" : "0") + suffix;

    const counter = { val: 0 };
    gsap.to(counter, {
      val: targetValue,
      duration: 2.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: stat,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        let currentVal = Math.floor(counter.val);
        if (hasComma) {
          currentVal = currentVal.toLocaleString('en-US');
        }
        stat.innerText = currentVal + suffix;
      }
    });
  });

  // ============================================
  // REFRESH ON LOAD
  // ============================================
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => ScrollTrigger.refresh());
  });

});
