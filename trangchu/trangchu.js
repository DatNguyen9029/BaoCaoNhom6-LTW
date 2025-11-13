const slides = document.getElementById('slides');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
  const totalSlides = dots.length;
  if (index >= 0 && index < totalSlides) {
    slides.style.transform = `translateX(-${index * 100}vw)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, {
    threshold: 0.1
  });

  sections.forEach(section => {
    observer.observe(section);
  });
});

