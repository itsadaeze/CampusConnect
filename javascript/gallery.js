
async function eventGallery() {
  try {
    const response = await fetch("/data/event.json");
    return await response.json();
  } catch (error) {
    console.error("Loading error:", error);
  }
}

//  display events
function showEvents(years, showData) {
  const gallery = document.getElementById("displayImage");
  gallery.innerHTML = "";

  if (years && showData[years]) {
    showData[years].forEach(event => {
      const eventCards = document.createElement("div");
      eventCards.className = "eventBox";
      eventCards.innerHTML = `
        <img src="${event.image}" alt="${event.Title}" alt="${event.DateAndTime}" alt="${event.venue}" alt="${event.Description}">
        <div class="eventTitle">${event.Title}</div>
        <div class="eventDateAndTime">${event.DateAndTime}</div>
         <div class="eventVenue">${event.Venue}</div>
       <div class="eventDescription">${event.Description}</div>
      `;
      gallery.appendChild(eventCards);
    });
  }
}

// json
async function loadCategories() {
  try {
    const response = await fetch("/data/categories.json");
    return await response.json();
  } catch (error) {
    console.error("Loading error:", error);
  }
}

// Display categories
function showCategories(category, data) {
  const display = document.getElementById("displayCategory");
  display.innerHTML = "";

  if (category && data[category]) {
    data[category].forEach(item => {
      const categoryCard = document.createElement("div");
      categoryCard.className = "categoryBox";
      categoryCard.innerHTML = `
        <img src="${item.image}" alt="${item.Title}">
        <div class="categoryTitle">${item.Title}</div>
      `;
      display.appendChild(categoryCard);
    });
  }
}

window.onload = async function () {
  //  Event Year
  const eventYear = document.getElementById("eventYear1");
  const showData = await eventGallery();

  eventYear.addEventListener("change", function () {
    showEvents(this.value, showData);
  });

  const newYear = "2024-2025"; 
  eventYear.value = newYear;
  showEvents(newYear, showData);

  //  Categories
  const categorySelect = document.getElementById("eventCategory");
  const data = await loadCategories();

  categorySelect.addEventListener("change", function () {
    showCategories(this.value, data);
  });

  const newCategory = "Academics-Events";
  categorySelect.value = newCategory;
  showCategories(newCategory, data);
};
