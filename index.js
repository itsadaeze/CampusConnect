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
