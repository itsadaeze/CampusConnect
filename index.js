// importing navbar and footer
function loadNabarFooterComponent(id, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback(); 
    });
}

loadNabarFooterComponent("general-navbar", "/components/navbar.html", navbarToggle);
loadNabarFooterComponent("general-footer", "components/footer.html");


// navbar toggle
function navbarToggle() {
  const toggleIcon = document.getElementById("toggle-icon");
  const navigationLinks = document.getElementById("nav-links");

  if (!toggleIcon || !navigationLinks) return;

  toggleIcon.addEventListener("click", () => {
    navigationLinks.classList.toggle("active");
    toggleIcon.classList.toggle("open");
  });
}




// Slider-section
const slidesWrapper = document.querySelector(".slides-section");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

const sliderImages = [
  "assets/images/homepage/slider1.jpg",
   "assets/images/homepage/slider2.jpg",
    "assets/images/homepage/slider3.jpg",
];

let currentSlide = 0;


function slider() {
  slidesWrapper.innerHTML = sliderImages.map(
    (img) => `<img src="${img}" alt="slide-banner">`
  ).join("");
}
slider();

function showSlide(index) {
  currentSlide = (index + sliderImages.length) % sliderImages.length;
  slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
}

nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
setInterval(() => showSlide(currentSlide + 1), 5000);



// upcoming events
fetch("data/event.json")
  .then(res => res.json())
  .then(data => {

    const eventCards = document.getElementById("event-section-cards");
    eventCards.innerHTML = data.map(event => `
      <div class="event-section-card" onclick="window.location.href='event.html'">
        <img src="${event.image}" alt="${event.title}" style="width:100%; border-radius:8px; margin-bottom:0.5rem;">
        <h3>${event.title}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p>${event.description}</p>
      </div>
    `).join("");
  });