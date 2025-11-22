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

    // Chuyển hướng tới trang kết quả tìm kiếm với query làm param (tuyệt đối tới root)
    const encoded = encodeURIComponent(query);
    try {
      // Su dung origin de tranh loi khi trang duoc mo tu file://
      window.location.href = `${location.origin}/search.html?q=${encoded}`;
    } catch (err) {
      // Fallback cho file://
      window.location.href = `../search.html?q=${encoded}`;
    }
  });
});

// --- Cac chuc nang gio hang dc nhung ---
(function(){
  function getCart() {
    return JSON.parse(localStorage.getItem('n6_cart')) || [];
  }

  function saveCart(cart) {
    localStorage.setItem('n6_cart', JSON.stringify(cart));
    updateCartCount();
  }

  window.addToCart = function(productId) {
    const cart = getCart();
    const existing = cart.find(i => i.id === productId);
    if (existing) existing.quantity += 1;
    else cart.push({ id: productId, quantity: 1 });
    saveCart(cart);
  };

  window.buyNow = function(productId) {
    addToCart(productId);
    try {
      window.location.href = location.origin + '/giohang/giohang.html';
    } catch (err) {
      window.location.href = '/giohang/giohang.html';
    }
  };

  function updateCartCount() {
    const cart = getCart();
    const el = document.querySelector('.right-actions_cart strong');
    if (el) el.innerText = `(${cart.length}) sản phẩm`;
  }

  document.addEventListener('DOMContentLoaded', updateCartCount);
})();

