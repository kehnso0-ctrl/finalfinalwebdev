/**
 * NexusArena - Details Page JavaScript
 * Handles Event Information Rendering and Dynamic Ticket Reservation Computation
 */

let currentEvent = null;
let teamMemberCount = 1;
let selectedTier = 'standard';
let jerseyAddonChecked = false;
let certAddonChecked = false;
let studentDiscountChecked = true;

document.addEventListener('DOMContentLoaded', () => {
  loadEventDetails();
  initCalculatorControls();
  initReservationModal();
});

// Parse ?id= query param and render extended info
function loadEventDetails() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('id');
  currentEvent = getEventById(eventId);

  // Set default team members to minimum team size
  teamMemberCount = Math.max(1, currentEvent.teamSizeMin || 1);

  // Populate Hero and Meta
  document.title = `${currentEvent.title} | NexusArena Campus Events`;
  
  const heroImg = document.getElementById('detailsHeroImg');
  if (heroImg) {
    heroImg.src = currentEvent.image;
    heroImg.alt = currentEvent.title;
  }

  const kickerEl = document.getElementById('detailsCategoryKicker');
  if (kickerEl) {
    kickerEl.textContent = currentEvent.categoryLabel;
    kickerEl.className = `category-kicker ${currentEvent.category}`;
  }

  const titleEl = document.getElementById('detailsTitle');
  if (titleEl) titleEl.textContent = currentEvent.title;

  const dateEl = document.getElementById('detailsDate');
  if (dateEl) dateEl.textContent = currentEvent.date;

  const timeEl = document.getElementById('detailsTime');
  if (timeEl) timeEl.textContent = currentEvent.time;

  const venueEl = document.getElementById('detailsVenue');
  if (venueEl) venueEl.textContent = currentEvent.venue;

  const orgEl = document.getElementById('detailsOrganizer');
  if (orgEl) orgEl.textContent = currentEvent.organizer;

  const descEl = document.getElementById('detailsFullDesc');
  if (descEl) descEl.textContent = currentEvent.fullDesc;

  const prizesEl = document.getElementById('detailsPrizes');
  if (prizesEl) prizesEl.textContent = currentEvent.prizes || "Certificate of Participation & Swag";

  // Render Schedule Timeline
  const scheduleContainer = document.getElementById('detailsSchedule');
  if (scheduleContainer && currentEvent.schedule) {
    scheduleContainer.innerHTML = currentEvent.schedule.map(item => `
      <div class="timeline-item">
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-desc">${item.desc}</div>
      </div>
    `).join('');
  }

  // Render Rules
  const rulesContainer = document.getElementById('detailsRules');
  if (rulesContainer && currentEvent.rules) {
    rulesContainer.innerHTML = `
      <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; color: var(--text-secondary); font-size: 0.9rem;">
        ${currentEvent.rules.map(r => `<li>${r}</li>`).join('')}
      </ul>
    `;
  }

  // Update base calculator fees
  const baseFeeLabel = document.getElementById('calcBaseFeeLabel');
  if (baseFeeLabel) {
    baseFeeLabel.textContent = currentEvent.feePerPerson === 0 
      ? 'Free Admission ($0.00)' 
      : `$${currentEvent.feePerPerson.toFixed(2)} / participant`;
  }

  // Initialize team counter bounds
  const counterInput = document.getElementById('teamCountDisplay');
  if (counterInput) {
    counterInput.textContent = teamMemberCount;
  }

  const teamHint = document.getElementById('teamSizeHint');
  if (teamHint) {
    teamHint.textContent = `Recommended squad size: ${currentEvent.teamSizeMin || 1} - ${currentEvent.teamSizeMax || 1} members`;
  }

  updateTotalCalculation();
}

// Interactive Ticket Calculation Logic
function initCalculatorControls() {
  const decrementBtn = document.getElementById('decrementTeamBtn');
  const incrementBtn = document.getElementById('incrementTeamBtn');
  const tierSelect = document.getElementById('ticketTierSelect');
  const jerseyCheckbox = document.getElementById('addonJersey');
  const certCheckbox = document.getElementById('addonCert');
  const discountCheckbox = document.getElementById('studentDiscount');

  if (decrementBtn) {
    decrementBtn.addEventListener('click', () => {
      const min = currentEvent ? (currentEvent.teamSizeMin || 1) : 1;
      if (teamMemberCount > min) {
        teamMemberCount--;
        document.getElementById('teamCountDisplay').textContent = teamMemberCount;
        updateTotalCalculation();
      } else {
        showToast(`Minimum squad/team size is ${min} member(s)`, 'info');
      }
    });
  }

  if (incrementBtn) {
    incrementBtn.addEventListener('click', () => {
      const max = currentEvent ? (currentEvent.teamSizeMax || 6) : 6;
      if (teamMemberCount < max) {
        teamMemberCount++;
        document.getElementById('teamCountDisplay').textContent = teamMemberCount;
        updateTotalCalculation();
      } else {
        showToast(`Maximum squad size for this event is ${max} members`, 'info');
      }
    });
  }

  if (tierSelect) {
    tierSelect.addEventListener('change', (e) => {
      selectedTier = e.target.value;
      updateTotalCalculation();
    });
  }

  if (jerseyCheckbox) {
    jerseyCheckbox.addEventListener('change', (e) => {
      jerseyAddonChecked = e.target.checked;
      updateTotalCalculation();
    });
  }

  if (certCheckbox) {
    certCheckbox.addEventListener('change', (e) => {
      certAddonChecked = e.target.checked;
      updateTotalCalculation();
    });
  }

  if (discountCheckbox) {
    discountCheckbox.addEventListener('change', (e) => {
      studentDiscountChecked = e.target.checked;
      updateTotalCalculation();
    });
  }
}

// Compute dynamic ticket total
function updateTotalCalculation() {
  if (!currentEvent) return;

  const basePrice = currentEvent.feePerPerson || 0;
  
  // Tier multiplier or extra fee
  let tierMultiplier = 1.0;
  let tierFee = 0;
  if (selectedTier === 'vip') {
    tierMultiplier = 1.5; // 50% premium for VIP stage seats
  } else if (selectedTier === 'spectator') {
    tierMultiplier = 0.5; // 50% discount for spectator gallery
  }

  // Base Subtotal: price * tier * members
  const subtotal = (basePrice * tierMultiplier) * teamMemberCount;

  // Add-ons
  const jerseyTotal = jerseyAddonChecked ? (15 * teamMemberCount) : 0;
  const certTotal = certAddonChecked ? (5 * teamMemberCount) : 0;
  const addonsTotal = jerseyTotal + certTotal;

  // Student Discount (15% off base subtotal if checked)
  const discountAmount = studentDiscountChecked ? (subtotal * 0.15) : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount + addonsTotal);

  // Update DOM elements
  const subtotalEl = document.getElementById('calcSubtotal');
  const discountEl = document.getElementById('calcDiscountRow');
  const discountAmountEl = document.getElementById('calcDiscountAmount');
  const addonsRow = document.getElementById('calcAddonsRow');
  const addonsAmountEl = document.getElementById('calcAddonsAmount');
  const totalAmountEl = document.getElementById('calcFinalTotal');

  if (subtotalEl) {
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  if (discountEl && discountAmountEl) {
    if (discountAmount > 0) {
      discountEl.style.display = 'flex';
      discountAmountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountEl.style.display = 'none';
    }
  }

  if (addonsRow && addonsAmountEl) {
    if (addonsTotal > 0) {
      addonsRow.style.display = 'flex';
      addonsAmountEl.textContent = `+$${addonsTotal.toFixed(2)}`;
    } else {
      addonsRow.style.display = 'none';
    }
  }

  if (totalAmountEl) {
    totalAmountEl.textContent = `$${finalTotal.toFixed(2)}`;
  }
}

// Modal handling for simulated ticket booking
function initReservationModal() {
  const reserveBtn = document.getElementById('btnReserveTickets');
  const modal = document.getElementById('reservationModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const finishBtn = document.getElementById('finishBookingBtn');

  if (!reserveBtn || !modal) return;

  reserveBtn.addEventListener('click', () => {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const attendeeName = user ? user.fullName : "Campus Guest Attendee";
    const attendeeEmail = user ? user.email : "student@campus.edu";
    const refCode = "NX-" + Math.floor(100000 + Math.random() * 900000);

    const totalStr = document.getElementById('calcFinalTotal')?.textContent || '$0.00';

    const modalContent = document.getElementById('modalTicketDetails');
    if (modalContent) {
      modalContent.innerHTML = `
        <div class="ticket-pass">
          <div style="text-align: center; margin-bottom: 1rem;">
            <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--accent-cyan); font-weight: 700; letter-spacing: 0.1em;">Simulated Campus Entry Pass</div>
            <h4 style="font-size: 1.25rem; margin-top: 0.25rem;">${currentEvent.title}</h4>
            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">${currentEvent.date} · ${currentEvent.time}</div>
          </div>

          <div class="ticket-qr">
            <!-- Simulated QR code SVG -->
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" fill="white"/>
              <rect x="10" y="10" width="24" height="24" fill="black"/>
              <rect x="14" y="14" width="16" height="16" fill="white"/>
              <rect x="18" y="18" width="8" height="8" fill="black"/>
              <rect x="66" y="10" width="24" height="24" fill="black"/>
              <rect x="70" y="14" width="16" height="16" fill="white"/>
              <rect x="74" y="18" width="8" height="8" fill="black"/>
              <rect x="10" y="66" width="24" height="24" fill="black"/>
              <rect x="14" y="70" width="16" height="16" fill="white"/>
              <rect x="18" y="74" width="8" height="8" fill="black"/>
              <rect x="42" y="12" width="6" height="6" fill="black"/>
              <rect x="52" y="18" width="6" height="6" fill="black"/>
              <rect x="42" y="42" width="16" height="16" fill="black"/>
              <rect x="46" y="46" width="8" height="8" fill="white"/>
              <rect x="66" y="42" width="6" height="6" fill="black"/>
              <rect x="78" y="48" width="8" height="8" fill="black"/>
              <rect x="42" y="66" width="6" height="6" fill="black"/>
              <rect x="52" y="72" width="8" height="8" fill="black"/>
              <rect x="72" y="72" width="14" height="14" fill="black"/>
            </svg>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.8rem; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
            <div>
              <span style="color: var(--text-muted); display: block;">Primary Registrant:</span>
              <strong style="color: var(--text-primary);">${attendeeName}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Email:</span>
              <strong style="color: var(--text-primary); word-break: break-all;">${attendeeEmail}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Squad / Seats:</span>
              <strong style="color: var(--text-primary);">${teamMemberCount} Pass(es)</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Tier:</span>
              <strong style="color: var(--accent-cyan); text-transform: uppercase;">${selectedTier}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Booking Code:</span>
              <strong class="tabular-nums" style="color: var(--accent-amber);">${refCode}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted); display: block;">Total Simulated Paid:</span>
              <strong class="tabular-nums" style="color: var(--accent-emerald); font-size: 0.95rem;">${totalStr}</strong>
            </div>
          </div>
        </div>
      `;
    }

    modal.classList.add('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      showToast("Ticket reservation successfully recorded! Check-in instructions sent to your email.", "success");
    });
  }

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
}
