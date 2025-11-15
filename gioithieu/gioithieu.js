document.addEventListener('DOMContentLoaded', () => {

  const sections = document.querySelectorAll('.gioithieu-container > section');
  sections.forEach((s, i) => {
    s.style.opacity = '0';
    s.style.transform = 'translateY(12px)';
    s.style.transition = 'opacity 420ms ease, transform 420ms ease';
    setTimeout(() => { s.style.opacity = '1'; s.style.transform = 'translateY(0)'; }, 120 + i*90);
  });

  
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
  

  const searchForm = document.querySelector('.header_search-bar form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = searchForm.querySelector('input[type="text"]');
      const query = input ? input.value.trim() : '';
      if (!query) {
        alert('Vui lòng nhập từ khóa tìm kiếm.');
        if (input) input.focus();
        return;
      }
      const encoded = encodeURIComponent(query);

      window.location.href = `../search.html?q=${encoded}`;
    });
  }
});
