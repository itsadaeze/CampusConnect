async function loadGalleryData() {
  try {
    const res = await fetch("/data/gallery.json");
    return await res.json();
  } catch (err) {
    console.error("Error loading gallery:", err);
  }
}

function renderGallery(year, category, data) {
  const display = document.getElementById("gallery-section-display");
  display.innerHTML = "";

  let items = [];

  if (year && data[year]) {
    if (category && data[year][category]) {
      items = data[year][category];
    } else {
      items = Object.values(data[year]).flat();
    }
  } else {
    
    items = Object.values(data).flatMap((cats) => Object.values(cats).flat());
  }

  if (items.length === 0) {
    display.innerHTML = "<p>No events found for the selected filter.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "gallery-section-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.Title}">
      <div class="gallery-section-card-content">
        <div class="gallery-section-card-title">${item.Title}</div>
        <div class="gallery-section-card-date">${item.DateAndTime || ""}</div>
        <div class="gallery-section-card-venue">${item.Venue || ""}</div>
        <div class="gallery-section-card-desc">${item.Description || ""}</div>
      </div>
    `;
    display.appendChild(card);
  });
}

window.onload = async () => {
  const data = await loadGalleryData();

  const yearSelect = document.getElementById("galleryYear");
  const categorySelect = document.getElementById("galleryCategory");

 
  Object.keys(data).forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  });


  const allCategories = new Set();
  Object.values(data).forEach((categories) => {
    Object.keys(categories).forEach((cat) => allCategories.add(cat));
  });

  allCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.replace(/-/g, " ");
    categorySelect.appendChild(option);
  });


  const latestYear = Object.keys(data).sort().pop();
  yearSelect.value = latestYear;
  renderGallery(latestYear, "", data);

  yearSelect.addEventListener("change", () => {
    renderGallery(yearSelect.value, categorySelect.value, data);
  });

  categorySelect.addEventListener("change", () => {
    renderGallery(yearSelect.value, categorySelect.value, data);
  });
};
