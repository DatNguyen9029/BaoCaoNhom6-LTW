document.addEventListener("DOMContentLoaded", function () {
      const PRODUCTS_PER_PAGE = 8;
      let currentPage = 1;
      let currentSortOption = "default";
      let allProducts = [];
      let displayedProducts = [];

      // --- CHỨC NĂNG HỖ TRỢ: CHUYỂN ĐỔI VÀ LẤY GIÁ ---

      function extractPrice(card) {
        const priceValue = card.getAttribute("data-price");
        return parseInt(priceValue) || 0;
      }

      function convertHtmlToProductNodes(htmlString) {
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = htmlString;
        return Array.from(tempContainer.children);
      }

      // --- KHAI BÁO CÁC BIẾN DOM VÀ DỮ LIỆU ---
      const mainCategoryLinks = document.querySelectorAll(
        ".product-category-list .main-cat-link"
      );
      const categoryContainer = document.querySelector(
        ".product-category-list ul"
      );
      // ĐÃ SỬA: Cập nhật lại danh sách subCategoryLinks sau khi thêm submenu ĐDHS
      let subCategoryLinks = document.querySelectorAll(
        ".product-category-list .sub-menu a"
      );
      const mainTitle = document.querySelector(
        ".product-main-content .main-title"
      );
      const descriptionParagraph = document.querySelector(
        ".product-main-content .description"
      );
      const productGrid = document.querySelector(".product-grid");
      const paginationBar = document.querySelector(".pagination");
      const priceFilterCheckboxes = document.querySelectorAll(
        ".price-filter-checkbox"
      );
      const sortSelect = document.getElementById("sort-select");

      const defaultDescription = descriptionParagraph.innerHTML;
      let penProductCards = [];
      let notebookProductCards = [];
      let studentProductCards = [];

    function createProductHTML(product) {
        const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
        return `
            <div class="product-card" data-id="${product.id}" data-price="${product.price}">
                <div class="image-box">
                    <img src="../${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/150'"/>
                </div>
                <p class="name">${product.name}</p>
                <p class="price">${priceFormatted}</p>
                
                <div style="display: flex; gap: 5px; margin-top: 5px;">
                    
                    <button onclick="addToCart('${product.id}')" 
                        style="flex: 1; padding: 8px 0; background: #fff; color: #e4002b; border: 1px solid #e4002b; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">
                        <i class="fa fa-cart-plus"></i> Thêm
                    </button>

                    <button onclick="buyNow('${product.id}')" 
                        style="flex: 1; padding: 8px 0; background: #e4002b; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">
                        Mua ngay
                    </button>
                </div>
            </div>
        `;
    }

    async function initDataAndRender() {
        try {
            const response = await fetch('/data/products.json');
            const data = await response.json();

            const penData = data.filter(p => p.category === 'Bút');
            const notebookData = data.filter(p => p.category === 'Vở' || p.category === 'Sổ');
            const studentData = data.filter(p => p.category !== 'Bút' && p.category !== 'Vở' && p.category !== 'Sổ');

            penProductCards = convertHtmlToProductNodes(penData.map(p => createProductHTML(p)).join(''));
            notebookProductCards = convertHtmlToProductNodes(notebookData.map(p => createProductHTML(p)).join(''));
            studentProductCards = convertHtmlToProductNodes(studentData.map(p => createProductHTML(p)).join(''));

            allProducts = [...penProductCards, ...notebookProductCards, ...studentProductCards];
            displayedProducts = [...allProducts];

            if (mainTitle) mainTitle.textContent = "TẤT CẢ SẢN PHẨM";

            const GENERAL_DESCRIPTION = "Chào mừng bạn đến với Nhà sách N6! Chúng tôi chuyên cung cấp các sản phẩm văn phòng phẩm, dụng cụ học tập chất lượng cao, đa dạng mẫu mã, phục vụ tốt nhất nhu cầu của học sinh, sinh viên và dân văn phòng.";
            
            if (descriptionParagraph) descriptionParagraph.innerHTML = GENERAL_DESCRIPTION;

            const allMenuItems = document.querySelectorAll(".product-category-list li");
            allMenuItems.forEach(li => li.classList.remove("active"));

            document.querySelectorAll(".sub-menu").forEach(menu => menu.style.display = "none");

            filterAndSortProducts();

        } catch (error) {
            console.error("Lỗi tải JSON:", error);
            productGrid.innerHTML = "<p style='text-align:center; margin-top:20px; color:red'>Lỗi kết nối dữ liệu (Cần chạy Live Server).</p>";
        }
    }

      // --- DỮ LIỆU SẢN PHẨM ---
      const PEN_DESCRIPTION =
        "Trong suốt những năm qua, các sản phẩm mang thương hiệu đã và đang nhận được sự yêu mến và tin tưởng của người tiêu dùng Việt. Các sản phẩm Bút luôn không ngừng được cải tiến về công nghệ, kiểu dáng, mẫu mã và chất lượng.";

      const NOTEBOOK_DESCRIPTION =
        "Công ty Cổ phần Văn phòng phẩm Hồng Hà cung cấp đa dạng các sản phẩm sổ bìa da, sổ bìa số, sổ lò xo... chất lượng cao, phong cách thiết kế hiện đại, độc đáo, đáp ứng nhu cầu sử dụng của học sinh, sinh viên.";

      const STUDENT_DESCRIPTION =
        "Công ty Cổ phần Văn phòng phẩm Hồng Hà cung cấp các sản phẩm Dụng cụ học tập phục vụ tận tình cho nhu cầu học tập đa dạng của các bạn học sinh, sinh viên.";

      // TRẠNG THÁI MẶC ĐỊNH SẼ LÀ BÚT (cần đặt lại nếu bạn muốn ĐDHS là mặc định)
      allProducts = penProductCards;
      displayedProducts = [...allProducts];

      // --- CÁC HÀM XỬ LÝ PHÂN TRANG (Giữ nguyên) ---
      function paginateProducts(products, page) {
        const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
        const endIndex = page * PRODUCTS_PER_PAGE;
        productGrid.innerHTML = "";
        for (let i = startIndex; i < endIndex && i < products.length; i++) {
          productGrid.appendChild(products[i].cloneNode(true));
        }
        if (products.length === 0) {
          productGrid.innerHTML =
            "<p style='grid-column: 1 / -1; text-align: center; margin-top: 20px;'>Không tìm thấy sản phẩm nào phù hợp với điều kiện lọc.</p>";
        }
      }

      function updatePaginationBar(products) {
        const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
        paginationBar.innerHTML = "";

        if (totalPages <= 1) {
          paginationBar.style.display = "none";
          return;
        }

        paginationBar.style.display = "flex";

        // Nút Previous
        if (currentPage > 1) {
          const prevButton = document.createElement("span");
          prevButton.classList.add("page-number", "prev-page");
          prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
          prevButton.onclick = () => goToPage(currentPage - 1);
          paginationBar.appendChild(prevButton);
        }

        // Các số trang
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
          const firstPage = document.createElement("span");
          firstPage.classList.add("page-number");
          firstPage.textContent = 1;
          firstPage.onclick = () => goToPage(1);
          paginationBar.appendChild(firstPage);
          if (startPage > 2) {
            const ellipsis = document.createElement("span");
            ellipsis.classList.add("ellipsis");
            ellipsis.textContent = "...";
            paginationBar.appendChild(ellipsis);
          }
        }

        for (let i = startPage; i <= endPage; i++) {
          const pageNumberSpan = document.createElement("span");
          pageNumberSpan.classList.add("page-number");
          if (i === currentPage) {
            pageNumberSpan.classList.add("active");
          }
          pageNumberSpan.textContent = i;
          pageNumberSpan.onclick = () => goToPage(i);
          paginationBar.appendChild(pageNumberSpan);
        }

        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            const ellipsis = document.createElement("span");
            ellipsis.classList.add("ellipsis");
            ellipsis.textContent = "...";
            paginationBar.appendChild(ellipsis);
          }
          const lastPage = document.createElement("span");
          lastPage.classList.add("page-number");
          lastPage.textContent = totalPages;
          lastPage.onclick = () => goToPage(totalPages);
          paginationBar.appendChild(lastPage);
        }

        // Nút Next
        if (currentPage < totalPages) {
          const nextButton = document.createElement("span");
          nextButton.classList.add("page-number", "next-page");
          nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
          nextButton.onclick = () => goToPage(currentPage + 1);
          paginationBar.appendChild(nextButton);
        }
      }

      function goToPage(page) {
        const totalPages = Math.ceil(
          displayedProducts.length / PRODUCTS_PER_PAGE
        );
        if (page < 1 || page > totalPages) {
          return;
        }
        currentPage = page;
        paginateProducts(displayedProducts, currentPage);
        updatePaginationBar(displayedProducts);
      }

      // --- CHỨC NĂNG LỌC VÀ SẮP XẾP SẢN PHẨM (Giữ nguyên) ---

      function filterAndSortProducts() {
        const activeFilters = Array.from(priceFilterCheckboxes)
          .filter((cb) => cb.checked)
          .map((cb) => cb.getAttribute("data-range"));

        // 1. LỌC
        let filteredProducts;
        if (activeFilters.length === 0) {
          filteredProducts = allProducts;
        } else {
          filteredProducts = allProducts.filter((card) => {
            const price = extractPrice(card);
            return activeFilters.some((range) => {
              const [minStr, maxStr] = range.split("-");
              const min = parseInt(minStr);
              const max = parseInt(maxStr);

              // LOGIC LỌC
              if (range === "0-100000") {
                // Giá dưới 100.000 đ
                return price < 100000;
              } else {
                // Các khoảng giá khác: 100.000 - 200.000 và 200.000 - 300.000
                return price >= min && price <= max;
              }
            });
          });
        }

        displayedProducts = [...filteredProducts];

        // 2. SẮP XẾP
        if (currentSortOption === "name-asc") {
          displayedProducts.sort((a, b) => {
            const nameA = a.querySelector(".name").textContent.toUpperCase();
            const nameB = b.querySelector(".name").textContent.toUpperCase();
            return nameA.localeCompare(nameB, "vi");
          });
        } else if (currentSortOption === "price-asc") {
          displayedProducts.sort((a, b) => extractPrice(a) - extractPrice(b));
        } else if (currentSortOption === "price-desc") {
          displayedProducts.sort((a, b) => extractPrice(b) - extractPrice(a));
        }

        // 3. Phân trang lại
        currentPage = 1;
        goToPage(currentPage);
      }

      function handleFilterChange() {
        if (
          sortSelect.value !== "default" &&
          sortSelect.value !== currentSortOption
        ) {
          sortSelect.value = "default";
          currentSortOption = "default";
        }
        filterAndSortProducts();
      }

      function handleSortChange(event) {
        currentSortOption = event.target.value;
        filterAndSortProducts();
      }

      // --- GẮN SỰ KIỆN LỌC & SẮP XẾP ---
      priceFilterCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", handleFilterChange);
      });
      sortSelect.addEventListener("change", handleSortChange);

      // --- CÁC HÀM XỬ LÝ CHUYỂN DANH MỤC (Cập nhật logic) ---
      mainCategoryLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
          event.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
          const parentLi = this.closest("li.has-submenu");
          const subMenu = parentLi ? parentLi.querySelector(".sub-menu") : null;
          const isStudentTools = parentLi.id === "student-tools-li";
          const vppLi = document.getElementById("office-tools-li");
          const studentLi = document.getElementById("student-tools-li");
          const vppSubMenu = vppLi.querySelector(".sub-menu");
          const studentSubMenu = studentLi.querySelector(".sub-menu");

          // Xử lý logic hiển thị/ẩn sub-menu và active danh mục chính
          if (subMenu) {
            const isOpened = subMenu.style.display === "block";

            // Luôn reset trạng thái của các danh mục khác trước
            document
              .querySelectorAll(".has-submenu")
              .forEach((li) => li.classList.remove("active"));
            document
              .querySelectorAll(".sub-menu")
              .forEach((menu) => (menu.style.display = "none"));
            document
              .querySelectorAll(".sub-menu li")
              .forEach((li) => li.classList.remove("active"));

            // Mở submenu và active danh mục chính hiện tại
            subMenu.style.display = "block";
            parentLi.classList.add("active");

            // Kích hoạt link con đầu tiên
            const defaultSubLink = subMenu.querySelector("li a");
            if (defaultSubLink) {
              defaultSubLink.click();
            }
          }
        });
      });

      subCategoryLinks.forEach((subLink) => {
        subLink.addEventListener("click", function (event) {
          event.preventDefault();

          // 1. Cập nhật trạng thái Active cho sub-menu
          categoryContainer
            .querySelectorAll(".sub-menu li")
            .forEach((li) => li.classList.remove("active"));
          this.closest("li").classList.add("active");

          const parentLi = this.closest(".has-submenu");
          if (parentLi) {
            // Đảm bảo chỉ có 1 danh mục chính active
            document
              .querySelectorAll(".has-submenu")
              .forEach((li) => li.classList.remove("active"));
            parentLi.classList.add("active");
          }

          // 2. Thiết lập lại Lọc & Sắp xếp
          priceFilterCheckboxes.forEach((cb) => (cb.checked = false));
          sortSelect.value = "default";
          currentSortOption = "default";

          // 3. Lọc/chuyển đổi dữ liệu sản phẩm dựa trên danh mục con được chọn
          const categoryName = this.textContent.trim().toUpperCase();
          const parentCategoryName = parentLi
            ? parentLi
                .querySelector(".main-cat-link")
                .textContent.trim()
                .toUpperCase()
            : "";

          if (parentCategoryName === "VĂN PHÒNG PHẨM") {
            if (categoryName === "BÚT") {
              mainTitle.textContent = "BÚT";
              descriptionParagraph.innerHTML = PEN_DESCRIPTION;
              allProducts = penProductCards;
            } else if (categoryName === "SỔ") {
              mainTitle.textContent = "SỔ";
              descriptionParagraph.innerHTML = NOTEBOOK_DESCRIPTION;
              allProducts = notebookProductCards;
            }
          } else if (parentCategoryName === "ĐỒ DÙNG HỌC SINH") {
            if (categoryName === "DỤNG CỤ HỌC TẬP") {
              // SỬA: Cập nhật nội dung cho Đồ dùng học sinh
              mainTitle.textContent = "ĐỒ DÙNG HỌC SINH";
              descriptionParagraph.innerHTML = STUDENT_DESCRIPTION;
              allProducts = studentProductCards;
            }
          }

          // 4. Áp dụng Lọc và Sắp xếp (đã reset) để hiển thị sản phẩm mới
          filterAndSortProducts();
        });
      });

      // --- KHỞI TẠO BAN ĐẦU (Đảm bảo Bút được hiển thị) ---
      // Không cần khởi tạo lại vì mặc định đã là Bút. Chỉ cần chạy filterAndSortProducts() để đảm bảo phân trang hoạt động.
      // Nếu bạn muốn mặc định là Đồ dùng học sinh khi load trang:
      // document.querySelector('#student-tools-li .main-cat-link').click();

      initDataAndRender();
      const cart = JSON.parse(localStorage.getItem('n6_cart')) || [];
      const cartCountElement = document.querySelector('.right-actions_cart strong');
      if(cartCountElement) {
          cartCountElement.innerText = `(${cart.length}) sản phẩm`;
      }
    });


window.addToCart = function(productId) {
    let cart = JSON.parse(localStorage.getItem('n6_cart')) || [];
    
    let existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    localStorage.setItem('n6_cart', JSON.stringify(cart));
    
    
    const cartCountElement = document.querySelector('.right-actions_cart strong');
    if(cartCountElement) {
        cartCountElement.innerText = `(${cart.length}) sản phẩm`;
    }
};

window.buyNow = function(productId) {
    addToCart(productId);
    
    window.location.href = '../giohang/giohang.html';
};
