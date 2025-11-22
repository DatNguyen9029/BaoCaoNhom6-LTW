document.addEventListener('DOMContentLoaded', function () {
	const articles = Array.from(document.querySelectorAll('.news-article'));
	const paginationContainer = document.querySelector('.news-pagination');
	const itemsPerPage = 4;

	if (!articles.length) return;

	const params = new URLSearchParams(window.location.search);
	let page = parseInt(params.get('page'), 10) || 1;
	const totalPages = Math.max(1, Math.ceil(articles.length / itemsPerPage));

	if (page < 1) page = 1;
	if (page > totalPages) page = totalPages;

	// Show/hide articles for current page
	articles.forEach((el, idx) => {
		const start = (page - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		if (idx >= start && idx < end) {
			el.style.display = '';
		} else {
			el.style.display = 'none';
		}
	});

	// Render pagination (replace existing contents)
	if (paginationContainer) {
		paginationContainer.innerHTML = '';

		// Previous button
		const prev = document.createElement('a');
		prev.className = 'page-number page-prev';
		prev.href = `tintuc.html?page=${Math.max(1, page - 1)}`;
		prev.textContent = '\u2039';
		prev.title = 'Trang trước';
		paginationContainer.appendChild(prev);

		for (let i = 1; i <= totalPages; i++) {
			const a = document.createElement('a');
			a.href = `tintuc.html?page=${i}`;
			a.className = 'page-number' + (i === page ? ' active' : '');
			a.textContent = i;
			paginationContainer.appendChild(a);
		}

		// Next button
		const next = document.createElement('a');
		next.className = 'page-number page-next';
		next.href = `tintuc.html?page=${Math.min(totalPages, page + 1)}`;
		next.textContent = '\u203A';
		next.title = 'Trang sau';
		paginationContainer.appendChild(next);
	}

	// Optional: intercept clicks to update page without full reload (progressive enhancement)
	// If you prefer full reloads, remove this handler.
	if (paginationContainer) {
		paginationContainer.addEventListener('click', function (e) {
			const target = e.target.closest('a');
			if (!target) return;
			const href = target.getAttribute('href');
			if (!href) return;
			// No-op: allow normal navigation so bookmarks work.
		});
	}
});