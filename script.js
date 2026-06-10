/* ============================================
   LOGIBRISK — Enterprise TMS Website
   Interactive Components & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Hero scrolling parallax & general section entrance sequences are handled in animations.js

  // ============================================
  // 1. HEADER — Scroll & Mobile Menu
  // ============================================
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Scroll reveal Intersection Observer is handled in animations.js for index.html

  // ============================================
  // 3. SLOT-MACHINE REEL COUNTERS
  // ============================================
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(c => {
    const targetStr = c.dataset.target;
    
    // Format large numbers: 2400000 -> 2.4M
    let displayStr = targetStr;
    const num = parseInt(targetStr);
    if (num >= 1000000) {
      displayStr = (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      displayStr = (num / 1000).toFixed(0) + 'K';
    }
    
    c.innerHTML = ''; // Clear initial static text
    
    // Build slots for each character
    const chars = displayStr.split('');
    let digitCount = 0;
    
    chars.forEach(char => {
      if (/\d/.test(char)) {
        const slotDigit = document.createElement('div');
        slotDigit.className = 'slot-digit';
        
        const strip = document.createElement('div');
        strip.className = 'digit-strip';
        strip.dataset.digit = char;
        
        // Stagger digit rolls
        strip.style.transitionDelay = `${digitCount * 120}ms`;
        
        // Generate 3 loops of 0-9 for spin effect
        let stripContent = '';
        for (let loop = 0; loop < 3; loop++) {
          for (let val = 0; val < 10; val++) {
            stripContent += `<span>${val}</span>`;
          }
        }
        strip.innerHTML = stripContent;
        slotDigit.appendChild(strip);
        c.appendChild(slotDigit);
        digitCount++;
      } else {
        const separator = document.createElement('div');
        separator.className = 'slot-separator';
        separator.textContent = char;
        c.appendChild(separator);
      }
    });
  });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Trigger spin after a brief delay
        setTimeout(() => {
          el.querySelectorAll('.digit-strip').forEach(strip => {
            const digit = parseInt(strip.dataset.digit);
            // Go to target digit on the last loop (index 20 + digit)
            const finalIndex = 20 + digit;
            const pct = -(finalIndex / 30) * 100;
            strip.style.transform = `translateY(${pct}%)`;
          });
        }, 100);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObserver.observe(c));

  // ============================================
  // YARD OPERATIONS SCROLL-SCRUB SIMULATOR
  // ============================================
  const yardWorkspace = document.querySelector('.yard-sim-wrapper');
  const stagesTrack = document.querySelector('.yard-sim-scrolling-stages');
  const stageCards = document.querySelectorAll('.sim-stage-card');
  const simTruck = document.querySelector('#simulator-truck');
  const simWheels = document.querySelectorAll('.truck-wheel');

  if (yardWorkspace && simTruck && stagesTrack && stageCards.length) {
    gsap.registerPlugin(MotionPathPlugin);

    gsap.set(simTruck, { left: 0, top: 0, xPercent: -50, yPercent: -50, rotation: 0 });

    const setActiveStage = (stage) => {
      stageCards.forEach((card) => {
        card.classList.toggle('active', card.dataset.stage === String(stage));
      });
    };

    const pathConfig = {
      path: '#truck-road-path',
      align: '#truck-road-path',
      alignOrigin: [0.5, 0.5],
      autoRotate: true
    };

    const simTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.yard-sim-wrapper',
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 2)}`,
        scrub: 1.2,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const stage = self.progress < 0.34 ? 1 : self.progress < 0.67 ? 2 : 3;
          setActiveStage(stage);
        }
      }
    });

    simTimeline
      // Stage 1 — approach gate & scan
      .to(simTruck, {
        motionPath: { ...pathConfig, start: 0, end: 0.1 },
        duration: 1.8,
        ease: 'none'
      })
      .to('.gate-scanner-beam', { opacity: 1, duration: 0.35, ease: 'power2.out' })
      .to('.gate-scanner', {
        filter: 'drop-shadow(0 0 10px #10B981)',
        color: '#10B981',
        duration: 0.25,
        ease: 'power2.out'
      }, '-=0.15')
      .to('.gate-arm', { rotation: -70, duration: 0.55, ease: 'power2.inOut' }, '-=0.1')
      .to(simTruck, {
        motionPath: { ...pathConfig, start: 0.1, end: 0.42 },
        duration: 3.8,
        ease: 'none'
      })
      // Stage 2 — loading bay crane
      .to('.crane-arm', { rotation: 14, duration: 0.65, ease: 'power2.inOut' })
      .to('.cargo-container-box', { y: 50, duration: 0.65, ease: 'power2.inOut' }, '-=0.45')
      .to('.loaded-cargo', { opacity: 1, duration: 0.2, ease: 'power1.out' })
      .to('.cargo-container-box', { opacity: 0, duration: 0.2, ease: 'power1.in' }, '-=0.1')
      .to('.crane-arm', { rotation: 0, duration: 0.65, ease: 'power2.inOut' })
      // Stage 3 — outbound dispatch to ship
      .to(simTruck, {
        motionPath: { ...pathConfig, start: 0.42, end: 0.9 },
        duration: 5.2,
        ease: 'none'
      })
      .to('.cargo-ship-icon', {
        scale: 1.12,
        color: '#0EA5E9',
        filter: 'drop-shadow(0 0 15px rgba(14,165,233,0.6))',
        duration: 0.6,
        ease: 'power2.out'
      }, '-=1.2')
      .to(simTruck, {
        motionPath: { ...pathConfig, start: 0.9, end: 1 },
        duration: 1.8,
        ease: 'none'
      });

    const totalDur = simTimeline.duration();
    const wheelRot = { val: 0 };

    simTimeline.to(wheelRot, {
      val: 1080,
      ease: 'none',
      duration: totalDur,
      onUpdate: () => {
        simWheels.forEach((w) => {
          w.style.transform = `rotate(${wheelRot.val}deg)`;
        });
      }
    }, 0);

    // Cards crossfade in place automatically via the active class
  }

  // ============================================
  // 4. SHIPMENT TRACKER SIMULATOR
  // ============================================
  const trackingData = {
    'TRK-20841': {
      status: 'In Transit',
      statusClass: 'in-transit',
      origin: 'Surat Depot',
      destination: 'Mumbai Central',
      eta: 'Today, 4:30 PM',
      progress: 65,
      activePoint: 2,
      points: ['Surat', 'Navsari', 'Mumbai Hub', 'Mumbai Central'],
      timeline: [
        { title: 'Order Picked Up', desc: 'Surat Depot — Package collected', time: '9:14 AM, Today', status: 'completed' },
        { title: 'Cleared Navsari Checkpoint', desc: 'Security verified, cleared for transit', time: '10:42 AM, Today', status: 'completed' },
        { title: 'En Route to Mumbai Hub', desc: 'Vehicle ID: GJ-05-TX-4421', time: 'In Progress', status: 'current' },
        { title: 'Delivery to Receiver', desc: 'Mumbai Central — Estimated', time: 'ETA: 4:30 PM', status: 'pending' }
      ]
    },
    'TRK-55012': {
      status: 'Delivered',
      statusClass: 'delivered',
      origin: 'Delhi Warehouse',
      destination: 'Bangalore Tech Park',
      eta: 'Delivered at 2:15 PM',
      progress: 100,
      activePoint: 3,
      points: ['Delhi', 'Nagpur', 'Hyderabad', 'Bangalore'],
      timeline: [
        { title: 'Order Dispatched', desc: 'Delhi Warehouse — Express shipment', time: '6:00 AM, Yesterday', status: 'completed' },
        { title: 'Transit via Nagpur Hub', desc: 'Sorted and forwarded', time: '2:30 PM, Yesterday', status: 'completed' },
        { title: 'Hyderabad Checkpoint', desc: 'Customs cleared', time: '11:00 PM, Yesterday', status: 'completed' },
        { title: 'Delivered to Bangalore', desc: 'Signed by: Rakesh M.', time: '2:15 PM, Today', status: 'completed' }
      ]
    },
    'TRK-88374': {
      status: 'In Transit',
      statusClass: 'in-transit',
      origin: 'Chennai Port',
      destination: 'Kolkata Distribution',
      eta: 'Tomorrow, 10:00 AM',
      progress: 35,
      activePoint: 1,
      points: ['Chennai', 'Vijayawada', 'Bhubaneswar', 'Kolkata'],
      timeline: [
        { title: 'Cargo Released from Port', desc: 'Chennai Port — Container unloaded', time: '7:30 AM, Today', status: 'completed' },
        { title: 'En Route to Vijayawada', desc: 'Vehicle ID: TN-09-AB-7832', time: 'In Progress', status: 'current' },
        { title: 'Bhubaneswar Hub', desc: 'Awaiting arrival', time: 'Estimated: 11 PM', status: 'pending' },
        { title: 'Kolkata Distribution', desc: 'Final delivery', time: 'ETA: Tomorrow 10 AM', status: 'pending' }
      ]
    },
    'TRK-31290': {
      status: 'In Transit',
      statusClass: 'in-transit',
      origin: 'Ahmedabad Factory',
      destination: 'Pune Distribution',
      eta: 'Today, 8:00 PM',
      progress: 50,
      activePoint: 2,
      points: ['Ahmedabad', 'Vadodara', 'Nashik', 'Pune'],
      timeline: [
        { title: 'Factory Pickup', desc: 'Ahmedabad Factory — Loaded 12 tons', time: '5:00 AM, Today', status: 'completed' },
        { title: 'Vadodara Transit', desc: 'Refueling completed', time: '8:15 AM, Today', status: 'completed' },
        { title: 'En Route via Nashik', desc: 'Vehicle ID: GJ-01-XX-5590', time: 'In Progress', status: 'current' },
        { title: 'Pune Distribution Center', desc: 'Warehouse slot booked', time: 'ETA: 8:00 PM', status: 'pending' }
      ]
    }
  };

  const trackInput = document.getElementById('tracking-input');
  const trackBtn = document.getElementById('track-btn');
  const trackingResult = document.getElementById('tracking-result');

  const heroTrackInput = document.getElementById('hero-tracking-input');
  const heroTrackBtn = document.getElementById('hero-track-btn');

  // Helper to trigger tracking and scroll
  function executeTracking(code, shouldScroll = false) {
    // Sync both inputs
    if (trackInput) trackInput.value = code;
    if (heroTrackInput) heroTrackInput.value = code;

    performTracking(code);

    if (shouldScroll) {
      const target = document.getElementById('tracking');
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  // Sample code buttons
  document.querySelectorAll('.sample-code').forEach(btn => {
    btn.addEventListener('click', () => {
      executeTracking(btn.dataset.code, false);
    });
  });

  // Hero sample code buttons
  document.querySelectorAll('.hero-sample-code').forEach(btn => {
    btn.addEventListener('click', () => {
      executeTracking(btn.dataset.code, true);
    });
  });

  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      const code = trackInput.value.trim().toUpperCase();
      executeTracking(code, false);
    });
  }

  if (trackInput) {
    trackInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const code = trackInput.value.trim().toUpperCase();
        executeTracking(code, false);
      }
    });
  }

  if (heroTrackBtn) {
    heroTrackBtn.addEventListener('click', () => {
      const code = heroTrackInput.value.trim().toUpperCase();
      executeTracking(code, true);
    });
  }

  if (heroTrackInput) {
    heroTrackInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const code = heroTrackInput.value.trim().toUpperCase();
        executeTracking(code, true);
      }
    });
  }

  function performTracking(code) {
    const data = trackingData[code];
    if (!data) {
      // Show not found state
      trackingResult.classList.add('active');
      document.getElementById('result-tracking-id').textContent = code || 'N/A';
      document.getElementById('result-status').textContent = 'Not Found';
      document.getElementById('result-status').className = 'tracking-status-badge';
      document.getElementById('result-status').style.background = 'rgba(239,68,68,0.15)';
      document.getElementById('result-status').style.color = '#EF4444';
      document.getElementById('route-progress').style.width = '0%';
      document.getElementById('detail-origin').textContent = '—';
      document.getElementById('detail-destination').textContent = '—';
      document.getElementById('detail-eta').textContent = 'No data available';

      // Reset route dots
      for (let i = 0; i < 4; i++) {
        const dot = document.getElementById(`route-dot-${i}`);
        dot.className = 'route-dot';
        document.getElementById(`route-label-${i}`).className = 'route-label';
        document.getElementById(`route-label-${i}`).textContent = '—';
      }
      return;
    }

    trackingResult.classList.add('active');
    document.getElementById('result-tracking-id').textContent = code;

    const statusBadge = document.getElementById('result-status');
    statusBadge.textContent = data.status;
    statusBadge.className = `tracking-status-badge ${data.statusClass}`;
    statusBadge.style.background = '';
    statusBadge.style.color = '';

    document.getElementById('detail-origin').textContent = data.origin;
    document.getElementById('detail-destination').textContent = data.destination;
    document.getElementById('detail-eta').textContent = data.eta;

    // Animate route progress
    const progressBar = document.getElementById('route-progress');
    progressBar.style.width = '0%';
    setTimeout(() => {
      progressBar.style.width = `calc(${data.progress}% - 30px)`;
    }, 100);

    // Update route points
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`route-dot-${i}`);
      const label = document.getElementById(`route-label-${i}`);
      label.textContent = data.points[i];

      dot.className = 'route-dot';
      label.className = 'route-label';

      if (i < data.activePoint) {
        dot.classList.add('completed');
      } else if (i === data.activePoint) {
        dot.classList.add('active');
        label.classList.add('active');
      }
    }

    // Update timeline
    const timeline = document.getElementById('route-timeline');
    timeline.innerHTML = '';
    data.timeline.forEach(item => {
      const el = document.createElement('div');
      el.className = `timeline-item ${item.status}`;
      el.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-desc">${item.desc}</div>
        <div class="timeline-time">${item.time}</div>
      `;
      timeline.appendChild(el);
    });
  }

  // ============================================
  // 5. FEATURE TABS
  // ============================================
  const featureTabs = document.querySelectorAll('.feature-tab');
  const featurePanels = document.querySelectorAll('.feature-panel');

  featureTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      featureTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      featurePanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `panel-${target}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ============================================
  // 6. FLEET TABS
  // ============================================
  const fleetTabs = document.querySelectorAll('.fleet-tab');
  const fleetPanels = document.querySelectorAll('.fleet-panel');

  fleetTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.fleet;

      fleetTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      fleetPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `fleet-${target}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ============================================
  // 7. FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ============================================
  // 8. QUOTE CALCULATOR WIZARD
  // ============================================
  let currentStep = 1;
  const totalSteps = 4;

  // Distance matrix (simplified, in km)
  const distances = {
    surat:     { surat: 0, mumbai: 284, delhi: 1184, bangalore: 1237, chennai: 1568, kolkata: 1926, hyderabad: 900, ahmedabad: 265, pune: 332 },
    mumbai:    { surat: 284, mumbai: 0, delhi: 1400, bangalore: 984, chennai: 1331, kolkata: 2050, hyderabad: 710, ahmedabad: 524, pune: 148 },
    delhi:     { surat: 1184, mumbai: 1400, delhi: 0, bangalore: 2150, chennai: 2182, kolkata: 1472, hyderabad: 1500, ahmedabad: 940, pune: 1417 },
    bangalore: { surat: 1237, mumbai: 984, delhi: 2150, bangalore: 0, chennai: 347, kolkata: 1871, hyderabad: 570, ahmedabad: 1497, pune: 840 },
    chennai:   { surat: 1568, mumbai: 1331, delhi: 2182, bangalore: 347, chennai: 0, kolkata: 1676, hyderabad: 627, ahmedabad: 1829, pune: 1172 },
    kolkata:   { surat: 1926, mumbai: 2050, delhi: 1472, bangalore: 1871, chennai: 1676, kolkata: 0, hyderabad: 1500, ahmedabad: 1890, pune: 1888 },
    hyderabad: { surat: 900, mumbai: 710, delhi: 1500, bangalore: 570, chennai: 627, kolkata: 1500, hyderabad: 0, ahmedabad: 1150, pune: 560 },
    ahmedabad: { surat: 265, mumbai: 524, delhi: 940, bangalore: 1497, chennai: 1829, kolkata: 1890, hyderabad: 1150, ahmedabad: 0, pune: 662 },
    pune:      { surat: 332, mumbai: 148, delhi: 1417, bangalore: 840, chennai: 1172, kolkata: 1888, hyderabad: 560, ahmedabad: 662, pune: 0 }
  };

  const freightRates = { ftl: 28, ptl: 38, express: 55, cold: 65 };
  const cargoMultipliers = { general: 1, perishable: 1.25, hazardous: 1.5, fragile: 1.3, electronics: 1.15 };
  const insuranceRates = { no: 0, basic: 0.5, full: 1.2 };

  function goToStep(step) {
    currentStep = step;

    // Update step circles
    for (let i = 1; i <= totalSteps; i++) {
      const circle = document.getElementById(`step-${i}`);
      circle.classList.remove('active', 'completed');

      if (i < step) {
        circle.classList.add('completed');
        circle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>';
      } else if (i === step) {
        circle.classList.add('active');
        circle.textContent = i;
      } else {
        circle.textContent = i;
      }
    }

    // Update connectors
    for (let i = 1; i < totalSteps; i++) {
      const conn = document.getElementById(`connector-${i}`);
      conn.classList.toggle('completed', i < step);
    }

    // Show panels
    for (let i = 1; i <= totalSteps; i++) {
      const panel = document.getElementById(`wizard-step-${i}`);
      panel.classList.toggle('active', i === step);
    }
  }

  // Step navigation buttons
  document.getElementById('wizard-next-1')?.addEventListener('click', () => {
    const origin = document.getElementById('origin-city').value;
    const dest = document.getElementById('dest-city').value;
    if (!origin || !dest) {
      shakeElement(document.getElementById('wizard-step-1').querySelector('.wizard-form-grid'));
      return;
    }
    if (origin === dest) {
      shakeElement(document.getElementById('dest-city'));
      return;
    }
    goToStep(2);
  });

  document.getElementById('wizard-prev-2')?.addEventListener('click', () => goToStep(1));
  document.getElementById('wizard-next-2')?.addEventListener('click', () => {
    const weight = document.getElementById('cargo-weight').value;
    const freight = document.getElementById('freight-type').value;
    const cargo = document.getElementById('cargo-type').value;
    if (!weight || !freight || !cargo) {
      shakeElement(document.getElementById('wizard-step-2').querySelector('.wizard-form-grid'));
      return;
    }
    goToStep(3);
  });

  document.getElementById('wizard-prev-3')?.addEventListener('click', () => goToStep(2));
  document.getElementById('wizard-next-3')?.addEventListener('click', () => {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    if (!name || !email || !phone) {
      shakeElement(document.getElementById('wizard-step-3').querySelector('.wizard-form-grid'));
      return;
    }
    calculateQuote();
    goToStep(4);
  });

  document.getElementById('wizard-restart')?.addEventListener('click', () => {
    // Reset all form fields
    document.querySelectorAll('.quote-wizard input, .quote-wizard select, .quote-wizard textarea').forEach(el => {
      if (el.type === 'number' || el.type === 'text' || el.type === 'email' || el.type === 'tel') el.value = '';
      else if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else if (el.tagName === 'TEXTAREA') el.value = '';
    });
    goToStep(1);
  });

  function calculateQuote() {
    const origin = document.getElementById('origin-city').value;
    const dest = document.getElementById('dest-city').value;
    const weight = parseFloat(document.getElementById('cargo-weight').value) || 100;
    const freightType = document.getElementById('freight-type').value || 'ftl';
    const cargoType = document.getElementById('cargo-type').value || 'general';
    const insurance = document.getElementById('insurance').value || 'no';

    const dist = distances[origin]?.[dest] || 500;
    const ratePerKm = freightRates[freightType] || 28;
    const cargoMul = cargoMultipliers[cargoType] || 1;
    const insRate = insuranceRates[insurance] || 0;

    const baseFright = Math.round(dist * ratePerKm * (weight / 1000) * cargoMul);
    const fuel = Math.round(baseFright * 0.15);
    const insuranceCost = Math.round(baseFright * (insRate / 100) * weight);
    const total = baseFright + fuel + insuranceCost;

    // Animate the total
    animateQuoteAmount(total);

    document.getElementById('qb-freight').textContent = '₹' + baseFright.toLocaleString('en-IN');
    document.getElementById('qb-fuel').textContent = '₹' + fuel.toLocaleString('en-IN');
    document.getElementById('qb-insurance').textContent = insuranceCost > 0 ? '₹' + insuranceCost.toLocaleString('en-IN') : 'N/A';
  }

  function animateQuoteAmount(target) {
    const el = document.getElementById('quote-amount');
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function shakeElement(el) {
    el.style.animation = 'none';
    el.offsetHeight; // trigger reflow
    el.style.animation = 'shake 0.5s ease';
    setTimeout(() => el.style.animation = '', 500);
  }

  // Add shake animation dynamically
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      50% { transform: translateX(8px); }
      75% { transform: translateX(-4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ============================================
  // 9. ROI CALCULATOR
  // ============================================
  const roiShipments = document.getElementById('roi-shipments');
  const roiCost = document.getElementById('roi-cost');

  function updateROI() {
    if (!roiShipments || !roiCost) return;

    const shipments = parseInt(roiShipments.value);
    const cost = parseInt(roiCost.value);

    document.getElementById('roi-shipments-val').textContent = shipments.toLocaleString('en-IN');
    document.getElementById('roi-cost-val').textContent = '₹' + cost.toLocaleString('en-IN');

    const annualSpend = shipments * cost * 12;
    const savings = Math.round(annualSpend * 0.24);
    const savingsFormatted = formatIndianCurrency(savings);

    document.getElementById('roi-savings').textContent = savingsFormatted;
    document.getElementById('roi-efficiency').textContent = '+42%';
  }

  function formatIndianCurrency(num) {
    if (num >= 10000000) return '₹' + (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
    return '₹' + num.toLocaleString('en-IN');
  }

  roiShipments?.addEventListener('input', updateROI);
  roiCost?.addEventListener('input', updateROI);
  updateROI(); // Initial

  // ============================================
  // 10. NEWSLETTER FORM
  // ============================================
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const btn = newsletterForm.querySelector('button');
    if (input.value.trim()) {
      btn.textContent = '✓ Done!';
      btn.style.background = 'var(--success)';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.style.background = '';
      }, 3000);
    }
  });

  // ============================================
  // 11. SMOOTH SCROLL for anchor links
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 12. CHART BAR ANIMATION on scroll
  // ============================================
  const chartBars = document.querySelectorAll('.chart-bar, .mini-bar');
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        chartObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  chartBars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
    chartObserver.observe(bar);
  });

  // ============================================
  // 13. ACTIVE NAV HIGHLIGHT on scroll
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  });

  // ============================================
  // 14. PARALLAX SUBTLE EFFECT on hero glows
  // ============================================
  const glows = document.querySelectorAll('.hero .bg-glow');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    glows.forEach((glow, i) => {
      const factor = i === 0 ? 1 : -1;
      glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  // ============================================
  // 15. DASHBOARD METRICS LIVE UPDATE SIM
  // ============================================
  function simulateDashboard() {
    const cards = document.querySelectorAll('.dashboard-body .dash-card-value');
    if (cards.length < 4) return;

    setInterval(() => {
      const base = 1200 + Math.floor(Math.random() * 100);
      cards[0].textContent = base.toLocaleString();

      const onTime = (97.5 + Math.random() * 1.5).toFixed(1);
      cards[1].textContent = onTime + '%';

      const fleet = (85 + Math.random() * 5).toFixed(1);
      cards[2].textContent = fleet + '%';

      const fuel = (3.8 + Math.random() * 1).toFixed(1);
      cards[3].textContent = '₹' + fuel + 'L';
    }, 4000);
  }
  simulateDashboard();

  // ============================================
  // 16. PRELOADER
  // ============================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Hide body initially, show after preloader
    document.body.style.opacity = '1';
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 2000);
  } else {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  }

  // Scroll progress bar is animated smoothly using GSAP ScrollTrigger in animations.js

  // ============================================
  // 18. PARTICLE CANVAS ANIMATION
  // ============================================
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      const hero = particleCanvas.parentElement;
      particleCanvas.width = hero.offsetWidth;
      particleCanvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      const count = Math.min(Math.floor((particleCanvas.width * particleCanvas.height) / 15000), 80);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * particleCanvas.width,
          y: Math.random() * particleCanvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 245, 212, ${p.opacity})`;
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
      });

      animFrame = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
  }

  // ============================================
  // 19. TESTIMONIALS CAROUSEL
  // ============================================
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
      card.classList.remove('active', 'exit-left');
      if (i === currentTestimonial && i !== index) {
        card.classList.add('exit-left');
      }
    });

    testimonialDots.forEach(dot => dot.classList.remove('active'));

    currentTestimonial = index;
    setTimeout(() => {
      testimonialCards.forEach(card => card.classList.remove('exit-left'));
      testimonialCards[currentTestimonial].classList.add('active');
    }, 50);
    testimonialDots[currentTestimonial]?.classList.add('active');
  }

  if (testimonialCards.length > 0) {
    testimonialDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index);
        if (idx !== currentTestimonial) {
          showTestimonial(idx);
          resetTestimonialInterval();
        }
      });
    });

    function resetTestimonialInterval() {
      clearInterval(testimonialInterval);
      testimonialInterval = setInterval(() => {
        const next = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(next);
      }, 5000);
    }

    resetTestimonialInterval();
  }

  // ============================================
  // 20. BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 21. TILT EFFECT ON SERVICE CARDS & PRICING CARDS
  // ============================================
  document.querySelectorAll('.service-card, .pricing-card').forEach(card => {
    card.style.transition = 'transform var(--transition-base), box-shadow var(--transition-base)';
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      const isPopular = card.classList.contains('popular');
      const lift = isPopular ? -12 : -8;
      card.style.transform = `translateY(${lift}px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================
  // 22. PRICING TOGGLE LOGIC
  // ============================================
  const pricingToggle = document.getElementById('pricing-toggle');
  const labelMonthly = document.getElementById('billing-monthly');
  const labelYearly = document.getElementById('billing-yearly');
  const priceElements = document.querySelectorAll('.plan-price .price');

  if (pricingToggle) {
    pricingToggle.addEventListener('click', () => {
      const isYearly = pricingToggle.classList.toggle('active');
      
      if (isYearly) {
        labelMonthly.classList.remove('active');
        labelYearly.classList.add('active');
      } else {
        labelMonthly.classList.add('active');
        labelYearly.classList.remove('active');
      }

      priceElements.forEach(priceEl => {
        const val = isYearly ? priceEl.dataset.yearly : priceEl.dataset.monthly;
        if (val) {
          // Simple transition animation
          priceEl.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
          priceEl.style.opacity = '0';
          priceEl.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            priceEl.textContent = val;
            priceEl.style.opacity = '1';
            priceEl.style.transform = 'translateY(0)';
          }, 150);
        }
      });
    });
  }

});

