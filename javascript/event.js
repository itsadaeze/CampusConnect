

const DATA_URL = '/data/events.json'; 


const listNode = document.getElementById('event-section-list');
const categorySel = document.getElementById('event-section-filter-category');
const sortSel = document.getElementById('event-section-sort');
const searchInput = document.getElementById('event-section-search');
const toggleUpcoming = document.getElementById('event-section-toggle-upcoming');
const togglePast = document.getElementById('event-section-toggle-past');
const countNode = document.getElementById('event-section-count');
const clearBtn = document.getElementById('event-section-clear');

let eventsData = [];   
let currentView = 'upcoming'; 


function formatDateRange(startISO, endISO){
  const start = new Date(startISO);
  const end = endISO ? new Date(endISO) : null;

  const dateOpts = { day:'2-digit', month:'short', year:'numeric' };
  const timeOpts = { hour:'numeric', minute:'2-digit' };

  const datePart = new Intl.DateTimeFormat('en-GB', dateOpts).format(start);
  const startTime = new Intl.DateTimeFormat('en-US', timeOpts).format(start);
  let range = datePart + ', ' + startTime;
  if(end){
    const endTime = new Intl.DateTimeFormat('en-US', timeOpts).format(end);
    range += ' – ' + endTime;
  }
  return range;
}


function makeCardHTML(ev){
  return `
    <article class="event-section-card" role="article" data-id="${ev.id}" tabindex="0">
      <img class="thumb" src="${ev.image}" alt="${ev.title} image">
      <div class="card-body">
        <h3>${escapeHtml(ev.title)}</h3>
        <div class="event-section-meta-row">
          <div><strong>${escapeHtml(ev.department)}</strong></div>
          <div>${escapeHtml(ev.category)}</div>
          <div>${escapeHtml(ev.venue)}</div>
        </div>
        <div class="date-time">${formatDateRange(ev.start, ev.end)}</div>
        <p class="description">${escapeHtml(ev.description)}</p>

        <div class="event-section-actions">
          <div style="color:var(--muted); font-size:.9rem">${isUpcoming(ev.start) ? '<span style=\"color:var(--accent)\">Upcoming</span>' : '<span style=\"color:var(--muted)\">Past</span>'}</div>
          <div>
            <button class="btn-primary" data-id="${ev.id}" aria-label="View details for ${ev.title}">View Details</button>
            <button class="btn-ghost" data-id="${ev.id}">Bookmark</button>
          </div>
        </div>
      </div>
    </article>
  `;
}


function escapeHtml(text){
  if(!text) return '';
  return text.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function isUpcoming(startISO){
  const now = new Date();
  return new Date(startISO) >= now;
}


function renderList(arr){
  if(!arr || arr.length === 0){
    listNode.innerHTML = `<div class="event-section-empty">No events match your filters.</div>`;
    countNode.textContent = '0 events';
    return;
  }

  const html = arr.map(ev => makeCardHTML(ev)).join('');
  listNode.innerHTML = html;
  countNode.textContent = `${arr.length} event${arr.length > 1 ? 's' : ''}`;


  listNode.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
     
      window.location.href = `event.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Bookmark button 
  listNode.querySelectorAll('.btn-ghost').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      
      e.currentTarget.textContent = 'Saved';
      e.currentTarget.disabled = true;
    });
  });


  listNode.querySelectorAll('.event-section-card').forEach(card => {
    card.addEventListener('keydown', (ev) => {
      if(ev.key === 'Enter') {
        const id = card.dataset.id;
        window.location.href = `event.html?id=${encodeURIComponent(id)}`;
      }
    });
  });
}
// filter
function getFilteredEvents(){
  const q = (searchInput.value || '').trim().toLowerCase();
  const selectedCategory = categorySel.value;
  const sortBy = sortSel.value;

  let arr = eventsData.slice();


  if(currentView === 'upcoming') arr = arr.filter(e => isUpcoming(e.start));
  else if(currentView === 'past') arr = arr.filter(e => !isUpcoming(e.start));

  // category filter
  if(selectedCategory && selectedCategory !== 'all'){
    arr = arr.filter(e => e.category === selectedCategory);
  }

  // search filter (title or venue or dept)
  if(q){
    arr = arr.filter(e => (
      (e.title && e.title.toLowerCase().includes(q)) ||
      (e.venue && e.venue.toLowerCase().includes(q)) ||
      (e.department && e.department.toLowerCase().includes(q))
    ));
  }

  // sort
  if(sortBy === 'date-asc'){
    arr.sort((a,b) => new Date(a.start) - new Date(b.start));
  } else if(sortBy === 'date-desc'){
    arr.sort((a,b) => new Date(b.start) - new Date(a.start));
  } else if(sortBy === 'name-asc'){
    arr.sort((a,b) => a.title.localeCompare(b.title));
  } else if(sortBy === 'category-asc'){
    arr.sort((a,b) => a.category.localeCompare(b.category));
  }

  return arr;
}


function populateCategories(data){
  const cats = Array.from(new Set(data.map(e => e.category))).sort();
  // map to options
  const optionsHTML = ['<option value="all">All Categories</option>']
    .concat(cats.map(c => `<option value="${c}">${capitalize(c)}</option>`))
    .join('');
  categorySel.innerHTML = optionsHTML;
}


function capitalize(s){ return s && s[0].toUpperCase() + s.slice(1); }


function attachControls(){
  categorySel.addEventListener('change', () => {
    renderList(getFilteredEvents());
  });

  sortSel.addEventListener('change', () => {
    renderList(getFilteredEvents());
  });

  searchInput.addEventListener('input', () => {
 
    clearTimeout(searchInput._deb);
    searchInput._deb = setTimeout(() => renderList(getFilteredEvents()), 250);
  });

  toggleUpcoming.addEventListener('click', () => {
    currentView = 'upcoming';
    toggleUpcoming.classList.add('active'); togglePast.classList.remove('active');
    toggleUpcoming.setAttribute('aria-pressed','true'); togglePast.setAttribute('aria-pressed','false');
    renderList(getFilteredEvents());
  });

  togglePast.addEventListener('click', () => {
    currentView = 'past';
    togglePast.classList.add('active'); toggleUpcoming.classList.remove('active');
    togglePast.setAttribute('aria-pressed','true'); toggleUpcoming.setAttribute('aria-pressed','false');
    renderList(getFilteredEvents());
  });

  clearBtn.addEventListener('click', () => {
    categorySel.value = 'all';
    sortSel.value = 'date-asc';
    searchInput.value = '';
    currentView = 'upcoming';
    toggleUpcoming.classList.add('active'); togglePast.classList.remove('active');
    renderList(getFilteredEvents());
  });
}


fetch(DATA_URL)
  .then(res => {
    if(!res.ok) throw new Error('Failed to load events.json');
    return res.json();
  })
  .then(data => {
    eventsData = Array.isArray(data) ? data : [];
   
    populateCategories(eventsData);
    attachControls();

    
    sortSel.value = 'date-asc';
    currentView = 'upcoming';
    toggleUpcoming.classList.add('active');
    renderList(getFilteredEvents());
  })
  .catch(err => {
    listNode.innerHTML = `<div class="event-section-empty">Could not load events. (${escapeHtml(err.message)})</div>`;
    countNode.textContent = '0 events';
    console.error(err);
  });

