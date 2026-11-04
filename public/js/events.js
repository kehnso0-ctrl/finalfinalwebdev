/**
 * NexusArena - Events Page JavaScript
 * Handles Dynamic Category Filtering, Real-time Search, and Infinite Scrolling Feed
 */

let activeCategory = 'all';
let searchQuery = '';
let sortBy = 'date-asc';
let displayedCount = 4;
const ITEMS_PER_PAGE = 4;
let isLoadingMore = false;
let scrollObserver = null;

document.addEventListener('DOMContentLoaded', () => {
  initEventFilters();
  initSearchAndSort();
  renderEvents(true);
  setupInfiniteScroll();
});

// Category Filter Tabs
function initEventFilters() {
  const tabs = document.querySelectorAll('[data-category-filter]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-category-filter');
      displayedCount = ITEMS_PER_PAGE;
      renderEvents(true);
    });
  });
}

// Search and Sorting Handlers
function initSearchAndSort() {
  const searchInput = document.getElementById('eventSearchInput');
  const sortSelect = document.getElementById('eventSortSelect');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      displayedCount = ITEMS_PER_PAGE;
      renderEvents(true);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      displayedCount = ITEMS_PER_PAGE;
      renderEvents(true);
    });
  }
}

// Filter and Sort Data Source
function getFilteredAndSortedEvents() {
  let list = CAMPUS_EVENTS.filter(event => {
    const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery) ||
      event.shortDesc.toLowerCase().includes(searchQuery) ||
      event.organizer.toLowerCase().includes(searchQuery) ||
      event.venue.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  // Sorting
  if (sortBy === 'fee-asc') {
    list.sort((a, b) => a.feePerPerson - b.feePerPerson);
  } else if (sortBy === 'fee-desc') {
    list.sort((a, b) => b.feePerPerson - a.feePerPerson);
  } else if (sortBy === 'title-asc') {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }
  // Default 'date-asc' preserves chronological order from CAMPUS_EVENTS

  return list;
}

// Render Event Cards
function renderEvents(reset = false) {
  const grid = document.getElementById('eventsGrid');
  const countDisplay = document.getElementById('eventsCount');
  const scrollStatus = document.getElementById('infiniteScrollStatus');
  if (!grid) return;

  const filtered = getFilteredAndSortedEvents();

  if (countDisplay) {
    countDisplay.textContent = `Showing ${Math.min(displayedCount, filtered.length)} of ${filtered.length} campus events`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background-color: var(--bg-card); border: 1px dashed var(--border-medium); border-radius: var(--radius-lg);">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="1.5" style="margin: 0 auto 1rem;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">No matching campus events found</h3>
        <p style="color: var(--text-secondary); max-width: 420px; margin: 0 auto 1.5rem;">Try adjusting your category filter or search keywords to find tournaments, seminars, and hackathons.</p>
        <button id="resetFiltersBtn" class="btn btn-secondary btn-sm">Reset All Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeCategory = 'all';
        searchQuery = '';
        const searchInput = document.getElementById('eventSearchInput');
        if (searchInput) searchInput.value = '';
        document.querySelectorAll('[data-category-filter]').forEach(t => {
          t.classList.toggle('active', t.getAttribute('data-category-filter') === 'all');
        });
        renderEvents(true);
      });
    }

    if (scrollStatus) {
      scrollStatus.style.display = 'none';
    }
    return;
  }

  const itemsToRender = filtered.slice(0, displayedCount);

  grid.innerHTML = itemsToRender.map(event => createEventCardHTML(event)).join('');

  // Update Infinite Scroll Status
  if (scrollStatus) {
    if (displayedCount >= filtered.length) {
      scrollStatus.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>All ${filtered.length} campus events loaded</span>
        </div>
      `;
      scrollStatus.style.display = 'block';
    } else {
      scrollStatus.innerHTML = `
        <div class="spinner"></div>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">Scroll down to load more upcoming events...</p>
      `;
      scrollStatus.style.display = 'block';
    }
  }
}

// Generate Individual Event Card Markup
function createEventCardHTML(event) {
  const feeText = event.feePerPerson === 0 ? 'FREE ENTRY' : `$${event.feePerPerson} / PERSON`;
  const isFree = event.feePerPerson === 0;
  const spotsLeft = event.slotsTotal - event.slotsBooked;

  return `
    <article class="card card-interactive event-card" data-id="${event.id}">
      <div class="event-image-wrap">
        <img 
          src="${event.image}" 
          alt="${event.title}" 
          class="event-image"
          loading="lazy"
          onerror="this.src='/assets/images/hero_arena.jpg';"
        />
        <div class="event-fee-badge ${isFree ? 'free' : ''}">${feeText}</div>
      </div>
      <div class="event-content">
        <div class="metadata-row">
          <span class="category-kicker ${event.category}">${event.categoryLabel}</span>
          <span class="metadata-separator">·</span>
          <span>${event.date}</span>
          <span class="metadata-separator">·</span>
          <span>${event.venue}</span>
        </div>
        <h3 class="event-title">
          <a href="details.html?id=${event.id}">${event.title}</a>
        </h3>
        <p class="event-desc">${event.shortDesc}</p>
        <div class="event-footer">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">
            <strong style="color: var(--text-primary); font-family: var(--font-mono);">${spotsLeft}</strong> spots open
          </div>
          <a href="details.html?id=${event.id}" class="btn btn-outline btn-sm">
            View Details & Tickets →
          </a>
        </div>
      </div>
    </article>
  `;
}

// Infinite Scroll with IntersectionObserver
function setupInfiniteScroll() {
  const trigger = document.getElementById('infiniteScrollTrigger');
  if (!trigger) return;

  if (scrollObserver) {
    scrollObserver.disconnect();
  }

  scrollObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !isLoadingMore) {
      loadMoreEvents();
    }
  }, {
    rootMargin: '200px 0px',
    threshold: 0.1
  });

  scrollObserver.observe(trigger);
}

function loadMoreEvents() {
  const filtered = getFilteredAndSortedEvents();
  if (displayedCount >= filtered.length) return;

  isLoadingMore = true;

  // Simulate smooth asynchronous feed loading for realistic campus experience
  setTimeout(() => {
    displayedCount += ITEMS_PER_PAGE;
    renderEvents(false);
    isLoadingMore = false;
  }, 450);
}
