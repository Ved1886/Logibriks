/* ==========================================================================
   LOGIVITE INTERACTIVE SIMULATOR & INTERACTION
   LogiBrisk SME Transporter Digitalization Telemetry Simulator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if simulator elements exist before initializing
  const mapSvg = document.getElementById('map-svg-canvas');
  if (!mapSvg) return;

  // Route Configuration Data
  const routes = {
    'west-coast': {
      pathId: 'path-west-coast-active',
      bgPathId: 'path-west-coast-bg',
      origin: { x: 100, y: 80 },
      destination: { x: 380, y: 270 },
      name: 'Active Route: Delhi to Mumbai Corridor',
      distance: 1400,
      baseTemp: 3.8
    },
    'midwest': {
      pathId: 'path-midwest-active',
      bgPathId: 'path-midwest-bg',
      origin: { x: 80, y: 280 },
      destination: { x: 420, y: 100 },
      name: 'Active Route: Bangalore to Chennai Transit Way',
      distance: 350,
      baseTemp: 4.2
    },
    'east-coast': {
      pathId: 'path-east-coast-active',
      bgPathId: 'path-east-coast-bg',
      origin: { x: 120, y: 220 },
      destination: { x: 440, y: 80 },
      name: 'Active Route: Kolkata to Patna Expressway',
      distance: 580,
      baseTemp: 2.5
    }
  };

  // State Variables
  let currentRouteKey = 'west-coast';
  let percentage = 0;
  let isSimulating = true;
  let speedMultiplier = 1;

  // DOM Selectors
  const routeButtons = document.querySelectorAll('.btn-route-select');
  const btnToggleSim = document.getElementById('btn-toggle-sim');
  const simBtnText = document.getElementById('sim-btn-text');
  const simPlayIcon = document.getElementById('sim-play-icon');
  const simSpeedSlider = document.getElementById('sim-speed-slider');
  const simSpeedVal = document.getElementById('sim-speed-val');
  
  const metricDist = document.getElementById('metric-dist');
  const metricDistBar = document.getElementById('metric-dist-bar');
  const metricBattery = document.getElementById('metric-battery');
  const metricBatteryBar = document.getElementById('metric-battery-bar');
  const metricSpeed = document.getElementById('metric-speed');
  const metricTemp = document.getElementById('metric-temp');
  
  const activeRouteName = document.getElementById('active-route-name');
  const hudEta = document.getElementById('hud-eta');

  const originNode = document.getElementById('node-origin');
  const destNode = document.getElementById('node-destination');
  const truckMarker = document.getElementById('truck-marker');
  const vehiclePointer = document.getElementById('vehicle-pointer');

  // SVG Node Helper Positioner
  function setNodePosition(nodeElement, coords) {
    if (!nodeElement) return;
    const circles = nodeElement.querySelectorAll('circle');
    circles.forEach(circle => {
      circle.setAttribute('cx', coords.x);
      circle.setAttribute('cy', coords.y);
    });
  }

  // Set Active Route Details
  function selectRoute(routeKey) {
    currentRouteKey = routeKey;
    const route = routes[routeKey];
    if (!route) return;

    // Reset loop percent
    percentage = 0;

    // Toggle active classes on route buttons
    routeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === routeKey);
    });

    // Toggle SVG path visibilities
    Object.keys(routes).forEach(key => {
      const activePath = document.getElementById(routes[key].pathId);
      const bgPath = document.getElementById(routes[key].bgPathId);
      
      if (key === routeKey) {
        if (activePath) activePath.style.display = 'block';
        if (bgPath) bgPath.style.opacity = '0.15';
      } else {
        if (activePath) activePath.style.display = 'none';
        if (bgPath) bgPath.style.opacity = '0.05';
      }
    });

    // Reposition origin and destination nodes
    setNodePosition(originNode, route.origin);
    setNodePosition(destNode, route.destination);

    // Update Route text
    if (activeRouteName) activeRouteName.textContent = route.name;

    updateTelemetry();
  }

  // Update Telemetry Metrics HUD
  function updateTelemetry() {
    const route = routes[currentRouteKey];
    if (!route) return;

    // Distance calculation
    const distanceTraveled = ((percentage / 100) * route.distance).toFixed(1);
    if (metricDist) metricDist.textContent = distanceTraveled;
    if (metricDistBar) metricDistBar.style.width = `${percentage}%`;

    // Battery calculation (starts at 98%, drains to 58% at end of route)
    const batteryLeft = Math.round(98 - (percentage / 100) * 40);
    if (metricBattery) metricBattery.textContent = batteryLeft;
    if (metricBatteryBar) {
      metricBatteryBar.style.width = `${batteryLeft}%`;
      // Change color if low
      if (batteryLeft < 25) {
        metricBatteryBar.className = 'fill bg-danger';
        metricBattery.parentElement.className = 'metric-num-val text-danger';
      } else {
        metricBatteryBar.className = 'fill bg-green';
        metricBattery.parentElement.className = 'metric-num-val text-green';
      }
    }

    // Fluctuate speed slightly
    const randomSpeed = Math.round(62 + Math.sin(Date.now() / 1500) * 6 + Math.random() * 2);
    if (metricSpeed) metricSpeed.textContent = isSimulating ? randomSpeed : 0;

    // Fluctuate cargo temperature around base temperature
    const currentTemp = (route.baseTemp + Math.sin(Date.now() / 2000) * 0.2).toFixed(1);
    if (metricTemp) metricTemp.textContent = currentTemp;

    // ETA remaining time (assumed average 65 km/h speed)
    const remainingDistance = route.distance - parseFloat(distanceTraveled);
    const remainingHoursTotal = remainingDistance / 65;
    const hours = Math.floor(remainingHoursTotal);
    const minutes = Math.round((remainingHoursTotal - hours) * 60);
    
    if (hudEta) {
      if (remainingDistance <= 0) {
        hudEta.textContent = 'Arrived';
      } else {
        hudEta.textContent = `${hours}h ${minutes}m`;
      }
    }
  }

  // Animation Frame Loop
  function animate() {
    if (!isSimulating) return;

    const route = routes[currentRouteKey];
    const activePath = document.getElementById(route.pathId);

    if (activePath && activePath.getTotalLength) {
      try {
        const pathLength = activePath.getTotalLength();
        
        // Progress speed based on path length and multiplier
        // Long paths need faster increment, short paths need slower
        const step = (0.015 * speedMultiplier * (1000 / pathLength));
        percentage += step;

        if (percentage >= 100) {
          percentage = 0;
        }

        // Get coordinates along SVG path
        const currentLength = (percentage / 100) * pathLength;
        const currentPoint = activePath.getPointAtLength(currentLength);

        // Position the truck marker
        if (truckMarker) {
          truckMarker.setAttribute('transform', `translate(${currentPoint.x}, ${currentPoint.y})`);
        }

        // Rotate vehicle pointer based on path angle
        const sampleAhead = Math.min(pathLength, currentLength + 2);
        const aheadPoint = activePath.getPointAtLength(sampleAhead);
        if (vehiclePointer && currentPoint) {
          const angle = Math.atan2(aheadPoint.y - currentPoint.y, aheadPoint.x - currentPoint.x) * (180 / Math.PI);
          vehiclePointer.setAttribute('transform', `rotate(${angle})`);
        }

        updateTelemetry();
      } catch (err) {
        console.warn('SVG path sample failed: ', err);
      }
    }

    requestAnimationFrame(animate);
  }

  // Route selector button event listeners
  routeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectRoute(btn.dataset.route);
    });
  });

  // Toggle Simulation Play/Pause
  if (btnToggleSim) {
    btnToggleSim.addEventListener('click', () => {
      isSimulating = !isSimulating;
      if (isSimulating) {
        if (simBtnText) simBtnText.textContent = 'Pause Simulation';
        if (btnToggleSim) btnToggleSim.classList.remove('paused');
        
        // Change play icon back to pause (two vertical bars)
        if (simPlayIcon) {
          simPlayIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        }
        
        // Resume loop
        animate();
      } else {
        if (simBtnText) simBtnText.textContent = 'Resume Simulation';
        if (btnToggleSim) btnToggleSim.classList.add('paused');
        
        // Change pause icon to play (triangle)
        if (simPlayIcon) {
          simPlayIcon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        }
        
        if (metricSpeed) metricSpeed.textContent = 0;
      }
    });

    // Default icon to pause on start
    if (simPlayIcon) {
      simPlayIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
    }
  }

  // Speed Slider input
  if (simSpeedSlider) {
    simSpeedSlider.addEventListener('input', (e) => {
      speedMultiplier = parseInt(e.target.value);
      if (simSpeedVal) simSpeedVal.textContent = `${speedMultiplier}x`;
    });
  }

  // --- Interactive 3D shipping container tilt effect ---
  const visualTrigger = document.getElementById('hero-canvas-trigger');
  const container3d = document.getElementById('shipping-container');

  if (visualTrigger && container3d) {
    visualTrigger.addEventListener('mousemove', (e) => {
      const rect = visualTrigger.getBoundingClientRect();
      // Normalized coordinates from -0.5 to 0.5
      const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

      // Mouse control rotation offsets
      const tiltX = -mouseY * 45; // Max 22.5 deg tilt vertical
      const tiltY = mouseX * 45;  // Max 22.5 deg tilt horizontal

      // Temporarily override stylesheet animation
      container3d.style.animation = 'none';
      container3d.style.transform = `rotateY(${tiltY + 180}deg) rotateX(${tiltX + 16}deg) rotateZ(0deg)`;
    });

    visualTrigger.addEventListener('mouseleave', () => {
      // Re-enable CSS animation
      container3d.style.transform = '';
      container3d.style.animation = 'rotateContainer 24s linear infinite';
    });
  }

  // --- Interactive Pricing Duration Toggle ---
  const durationPills = document.querySelectorAll('.duration-pill');
  const standardPriceDisplay = document.getElementById('standard-price-display');
  const standardCycleDisplay = document.getElementById('standard-cycle-display');
  const addOnPriceDisplay = document.getElementById('add-on-price-display');

  if (durationPills.length > 0 && standardPriceDisplay && standardCycleDisplay && addOnPriceDisplay) {
    const pricingData = {
      'monthly': { price: '₹3,000', cycle: '/ month', addon: '₹1,000' },
      'quarterly': { price: '₹8,500', cycle: '/ quarter', addon: '₹2,000' },
      'sixmonth': { price: '₹16,000', cycle: '/ 6 months', addon: '₹3,500' },
      'yearly': { price: '₹30,000', cycle: '/ year', addon: '₹5,000' }
    };

    durationPills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Toggle active class
        durationPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        // Get selected cycle
        const cycle = pill.dataset.cycle;
        const plan = pricingData[cycle];

        if (plan) {
          // Update pricing elements
          standardPriceDisplay.textContent = plan.price;
          standardCycleDisplay.textContent = plan.cycle;
          addOnPriceDisplay.textContent = plan.addon;
        }
      });
    });
  }

  // Initial selection triggers
  selectRoute('west-coast');
  animate();
});
