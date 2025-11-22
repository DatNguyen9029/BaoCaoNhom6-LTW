// --- Hiệu ứng slide của banner ---
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

// -- Hiệu ứng float của trang chủ --
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll('main > section');

  sections.forEach((s, i) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(12px)';
    s.style.transition = 'opacity 420ms ease, transform 420ms ease';
    setTimeout(() => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; }, 120 + i * 90);
  });
});

// --- Xử lý form tìm kiếm trong header ---
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('.header_search-bar form');
  if (!searchForm) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = searchForm.querySelector('input[type="text"]');
    const query = input ? input.value.trim() : '';
    if (!query) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      if (input) input.focus();
      return;
    }

    // Chuyển hướng tới trang kết quả tìm kiếm với query làm param
    const encoded = encodeURIComponent(query);
    window.location.href = `search.html?q=${encoded}`;
  });
});

