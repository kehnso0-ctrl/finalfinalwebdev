/**
 * NexusArena - Contact & Registration Page JavaScript
 * Handles Dynamic Event Selection, Real-Time Fee Calculation, and Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactFormTabs();
  populateEventDropdown();
  initContactCalculations();
  initFormValidation();
});

// Toggle between General Inquiry and Event Registration modes
function initContactFormTabs() {
  const modeRadios = document.querySelectorAll('input[name="formMode"]');
  const eventSelectGroup = document.getElementById('eventSelectGroup');
  const attendeesGroup = document.getElementById('attendeesGroup');
  const calcSummaryBox = document.getElementById('contactCalcSummary');

  modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const isRegistration = e.target.value === 'registration';
      if (eventSelectGroup) eventSelectGroup.style.display = isRegistration ? 'block' : 'none';
      if (attendeesGroup) attendeesGroup.style.display = isRegistration ? 'block' : 'none';
      if (calcSummaryBox) calcSummaryBox.style.display = isRegistration ? 'block' : 'none';

      // Update submit button text
      const submitBtn = document.getElementById('contactSubmitBtn');
      if (submitBtn) {
        submitBtn.textContent = isRegistration ? 'Complete Simulated Event Registration' : 'Send General Campus Inquiry';
      }
    });
  });
}

// Populate events into dropdown
function populateEventDropdown() {
  const select = document.getElementById('targetEventSelect');
  if (!select) return;

  select.innerHTML = '<option value="">-- Choose a Campus Event to Register --</option>' +
    CAMPUS_EVENTS.map(e => `
      <option value="${e.id}" data-fee="${e.feePerPerson}">
        ${e.title} (${e.feePerPerson === 0 ? 'Free' : '$' + e.feePerPerson + '/person'})
      </option>
    `).join('');
}

// Live Fee Calculation in the Contact / Registration Form
function initContactCalculations() {
  const eventSelect = document.getElementById('targetEventSelect');
  const attendeeInput = document.getElementById('contactAttendeeCount');
  const totalCostEl = document.getElementById('contactTotalCost');
  const rateBreakdownEl = document.getElementById('contactRateBreakdown');

  function calculate() {
    if (!eventSelect || !attendeeInput || !totalCostEl) return;

    const selectedOption = eventSelect.options[eventSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) {
      totalCostEl.textContent = '$0.00';
      if (rateBreakdownEl) rateBreakdownEl.textContent = 'Select an event above to calculate total fee';
      return;
    }

    const feePerPerson = parseFloat(selectedOption.getAttribute('data-fee') || '0');
    const count = Math.max(1, parseInt(attendeeInput.value || '1', 10));
    const total = feePerPerson * count;

    totalCostEl.textContent = `$${total.toFixed(2)}`;
    if (rateBreakdownEl) {
      rateBreakdownEl.textContent = `${count} participant(s) × $${feePerPerson.toFixed(2)} per person`;
    }
  }

  if (eventSelect) eventSelect.addEventListener('change', calculate);
  if (attendeeInput) attendeeInput.addEventListener('input', calculate);
}

// Form Validation using HTML5 and JavaScript
function initFormValidation() {
  const form = document.getElementById('unifiedContactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCount');

  // Live Character Counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500 characters`;
      if (len < 10) {
        charCounter.style.color = 'var(--accent-rose)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Please provide your full legal or student name.');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'Please provide a valid university email address (e.g., student@campus.edu).');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Event selection if mode is registration
    const isRegistration = document.querySelector('input[name="formMode"]:checked')?.value === 'registration';
    if (isRegistration) {
      const eventSelect = document.getElementById('targetEventSelect');
      if (!eventSelect.value) {
        showFieldError(eventSelect, 'Please select the tournament or seminar you wish to register for.');
        isValid = false;
      } else {
        clearFieldError(eventSelect);
      }
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showFieldError(messageInput, 'Message must be at least 10 characters long.');
      isValid = false;
    } else {
      clearFieldError(messageInput);
    }

    if (!isValid) {
      showToast('Please correct the highlighted form errors before submitting.', 'error');
      return;
    }

    // Process Submission Simulation
    const trackingCode = (isRegistration ? 'REG-' : 'INQ-') + Math.floor(100000 + Math.random() * 900000);
    const successBox = document.getElementById('contactSuccessAlert');
    const trackingEl = document.getElementById('contactTrackingCode');

    if (successBox && trackingEl) {
      trackingEl.textContent = trackingCode;
      successBox.style.display = 'flex';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showToast(isRegistration ? 'Registration simulated successfully!' : 'Inquiry sent successfully!', 'success');
    form.reset();
    if (charCounter) charCounter.textContent = '0 / 500 characters';
    
    // Reset calculations
    const totalCostEl = document.getElementById('contactTotalCost');
    if (totalCostEl) totalCostEl.textContent = '$0.00';
  });
}

function showFieldError(input, message) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  const errorEl = document.getElementById(`${input.id}Error`);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function clearFieldError(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  const errorEl = document.getElementById(`${input.id}Error`);
  if (errorEl) {
    errorEl.style.display = 'none';
  }
}
