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

      // Lấy nội dung sản phẩm và mô tả mặc định (Bút)
      const defaultProductCards = convertHtmlToProductNodes(
        productGrid.innerHTML
      );
      const defaultDescription = descriptionParagraph.innerHTML;

      // --- DỮ LIỆU SẢN PHẨM ---
      const PEN_DESCRIPTION =
        "Trong suốt những năm qua, các sản phẩm mang thương hiệu đã và đang nhận được sự yêu mến và tin tưởng của người tiêu dùng Việt. Các sản phẩm Bút luôn không ngừng được cải tiến về công nghệ, kiểu dáng, mẫu mã và chất lượng.";
      const PEN_PRODUCT_HTML_STRING = `
            <div class="product-card" data-price="2190">
                    <div class="image-box">
                        <img src="../images/sanpham/butgelxoaduoc.png" alt="Bút Semi Gel 0.7mm - 2800" class="product-image"/>
                    </div>
                    <p class="name">Bút Semi Gel 0.7mm - 2800</p>
                    <p class="price">2.190 đ</p>
                </div>
            <div class="product-card" data-price="8802">
                    <div class="image-box">
                        <img src="../images/sanpham/gelminihongha.png" alt="Bút gel xóa được GP01 - 2751" class="product-image"/>
                    </div>
                    <p class="name">Bút gel xóa được GP01 - 2751</p>
                    <p class="price">8.802 đ</p>
                </div>
            <div class="product-card" data-price="4410">
                    <div class="image-box">
                        <img src="../images/sanpham/butgelxoaduoc.png" alt="Bút bi Hồng Hà 0.5mm - 2481" class="product-image"/>
                    </div>
                    <p class="name">Bút bi Hồng Hà 0.5mm - 2481</p>
                    <p class="price">4.410 đ</p>
                </div>
            <div class="product-card" data-price="5291">
                    <div class="image-box">
                        <img src="../images/sanpham/butmayhonghanethoa.png" alt="Bút bi GP02 - 2753" class="product-image"/>
                    </div>
                    <p class="name">Bút bi GP02 - 2753</p>
                    <p class="price">5.291 đ</p>
                </div>
            <div class="product-card" data-price="6000">
                    <div class="image-box">
                        <img src="../images/sanpham/gelminihongha.png" alt="Bút bi GP04 - 2754" class="product-image"/>
                    </div>
                    <p class="name">Bút bi GP04 - 2754</p>
                    <p class="price">6.000 đ</p>
                </div>
            <div class="product-card" data-price="2500">
                    <div class="image-box">
                        <img src="../images/sanpham/butchigo.png" alt="Ruột bút gel ngòi nhỏ - 2755" class="product-image"/>
                    </div>
                    <p class="name">Ruột bút gel ngòi nhỏ - 2755</p>
                    <p class="price">2.500 đ</p>
                </div>
            <div class="product-card" data-price="3000">
                    <div class="image-box">
                        <img src="../images/sanpham/butbihongha0.5mm.png" alt="Ruột bút gel GP02 - 2756" class="product-image"/>
                    </div>
                    <p class="name">Ruột bút gel GP02 - 2756</p>
                    <p class="price">3.000 đ</p>
                </div>
            <div class="product-card" data-price="7800">
                    <div class="image-box">
                        <img src="../images/sanpham/butmayhonghanethoa.png" alt="Bút Semi Gel Hồng Hà 0.7mm - 2801" class="product-image"/>
                    </div>
                    <p class="name">Bút Semi Gel Hồng Hà 0.7mm - 2801</p>
                    <p class="price">7.800 đ</p>
                </div>
            `;
      const penProductCards = convertHtmlToProductNodes(
        PEN_PRODUCT_HTML_STRING
      );

      const NOTEBOOK_DESCRIPTION =
        "Công ty Cổ phần Văn phòng phẩm Hồng Hà cung cấp đa dạng các sản phẩm sổ bìa da, sổ bìa số, sổ lò xo... chất lượng cao, phong cách thiết kế hiện đại, độc đáo, đáp ứng nhu cầu sử dụng của học sinh, sinh viên.";
      const NOTEBOOK_PRODUCT_HTML_STRING = `
        <div class="product-card" data-sku="9237" data-price="338000"><div class="image-box"><img src="../images/sanpham/so1.png" alt="Bộ sản phẩm ĐỘC LẬP (sổ tay + bút ký cao cấp) - 9237" class="product-image"/></div><p class="name">Bộ sản phẩm ĐỘC LẬP (sổ tay + bút ký cao cấp) - 9237</p><p class="price">338.000 đ</p></div>
          <div class="product-card" data-sku="9236" data-price="299000"><div class="image-box"><img src="../images/sanpham/so2.png" alt="Bộ sản phẩm TƯƠNG LAI (9 Món) - 9236" class="product-image"/></div><p class="name">Bộ sản phẩm TƯƠNG LAI (9 Món) - 9236</p><p class="price">299.000 đ</p></div>
          <div class="product-card" data-sku="9231" data-price="26500"><div class="image-box"><img src="../images/sanpham/so3.png" alt="Ruột sổ còng A5 6 lỗ kẻ ngang - 9231" class="product-image"/></div><p class="name">Ruột sổ còng A5 6 lỗ kẻ ngang - 9231 (Thay thế cho ...)</p><p class="price">26.500 đ</p></div>
          <div class="product-card" data-sku="4586" data-price="33500"><div class="image-box"><img src="../images/sanpham/so4.png" alt="Sổ bìa bồi A4 200 trang Hồng Hà Subject - 4586" class="product-image"/></div><p class="name">Sổ bìa bồi A4 200 trang Hồng Hà Subject - 4586</p><p class="price">33.500 đ</p></div>
          <div class="product-card" data-sku="4587" data-price="49100"><div class="image-box"><img src="../images/sanpham/so1.png" alt="Sổ bìa bồi A4 200 trang Hồng Hà Subject - 4587" class="product-image"/></div><p class="name">Sổ bìa bồi A4 200 trang Hồng Hà Subject - 4587</p><p class="price">49.100 đ</p></div>
          <div class="product-card" data-sku="4588" data-price="43600"><div class="image-box"><img src="../images/sanpham/so3.png" alt="Sổ bìa bồi A4 300 trang Subject Hồng Hà - 4588" class="product-image"/></div><p class="name">Sổ bìa bồi A4 300 trang Subject Hồng Hà - 4588</p><p class="price">43.600 đ</p></div>
          <div class="product-card" data-sku="4589" data-price="53300"><div class="image-box"><img src="../images/sanpham/so1.png" alt="Sổ bìa bồi A4 360 trang Subject Hồng Hà - 4589" class="product-image"/></div><p class="name">Sổ bìa bồi A4 360 trang Subject Hồng Hà - 4589</p><p class="price">53.300 đ</p></div>
          <div class="product-card" data-sku="4552" data-price="61500"><div class="image-box"><img src="../images/sanpham/so2.png" alt="Sổ bìa bồi A4 420 trang Hồng Hà Patterns - 4552" class="product-image"/></div><p class="name">Sổ bìa bồi A4 420 trang Hồng Hà Patterns - 4552</p><p class="price">61.500 đ</p></div>
          <div class="product-card" data-sku="4618" data-price="61000"><div class="image-box"><img src="../images/sanpham/so4.png" alt="Sổ bìa bồi A4 420 trang Hồng Hà Subject - 4618" class="product-image"/></div><p class="name">Sổ bìa bồi A4 420 trang Hồng Hà Subject - 4618</p><p class="price">61.000 đ</p></div>
          <div class="product-card" data-sku="4551" data-price="48000"><div class="image-box"><img src="../images/sanpham/so3.png" alt="Sổ bìa bồi caro A4 300 trang Hồng Hà Subject - 4551" class="product-image"/></div><p class="name">Sổ bìa bồi caro A4 300 trang Hồng Hà Subject - 4551</p><p class="price">48.000 đ</p></div>
          <div class="product-card" data-sku="4530" data-price="33500"><div class="image-box"><img src="../images/sanpham/so1.png" alt="Sổ bìa bồi kẻ ngang A4 200 trang Hồng Hà Patterns - 4530" class="product-image"/></div><p class="name">Sổ bìa bồi kẻ ngang A4 200 trang Hồng Hà Patterns - 4530</p><p class="price">33.500 đ</p></div>
          <div class="product-card" data-sku="4531" data-price="48100"><div class="image-box"><img src="../images/sanpham/so4.png" alt="Sổ bìa bồi kẻ ngang A4 280 trang Hồng Hà Patterns - 4531" class="product-image"/></div><p class="name">Sổ bìa bồi kẻ ngang A4 280 trang Hồng Hà Patterns - 4531</p><p class="price">48.100 đ</p></div>
        `;
      const notebookProductCards = convertHtmlToProductNodes(
        NOTEBOOK_PRODUCT_HTML_STRING
      );

      const STUDENT_DESCRIPTION =
        "Công ty Cổ phần Văn phòng phẩm Hồng Hà cung cấp các sản phẩm Dụng cụ học tập phục vụ tận tình cho nhu cầu học tập đa dạng của các bạn học sinh, sinh viên.";
      const STUDENT_PRODUCT_HTML_STRING = `
        <div class="product-card" data-sku="5903" data-price="15702">
            <div class="image-box">
            <img src="../images/sanpham/giay.png" alt="Giấy kiểm tra ô ly chống lóa đặc biệt - 5903" class="product-image"/>
          </div>
          <p class="name">Giấy kiểm tra ô ly chống lóa đặc biệt - 5903</p>
          <p class="price">15.702 đ</p>
        </div>
        <div class="product-card" data-sku="3237" data-price="359345">
            <div class="image-box">
            <img src="../images/sanpham/den.png" alt="Đèn bàn bảo vệ thị lực HH-04 HỒNG HÀ - 3237" class="product-image"/>
          </div>
          <p class="name">Đèn bàn bảo vệ thị lực HH-04 HỒNG HÀ - 3237</p>
          <p class="price">359.345 đ</p>
        </div>
        <div class="product-card" data-sku="3062" data-price="29500">
            <div class="image-box">
            <img src="../images/sanpham/boc.png" alt="Bọc decal vở, sách (280x380mm) (10 chiếc/tập)" class="product-image"/>
          </div>
          <p class="name">Bọc decal vở, sách (280x380mm) (10 chiếc/tập)</p>
          <p class="price">29.500 đ</p>
        </div>
        <div class="product-card" data-sku="3460" data-price="8925">
            <div class="image-box">
            <img src="../images/sanpham/giay.png" alt="Giấy thủ công Hồng Hà 12 màu (10x20cm) - 3460" class="product-image"/>
          </div>
          <p class="name">Giấy thủ công Hồng Hà 12 màu (10x20cm) - 3460</p>
          <p class="price">8.925 đ</p>
        </div>
        <div class="product-card" data-sku="3474" data-price="12000">
            <div class="image-box">
            <img src="../images/sanpham/bang.png" alt="Bảng học sinh tiểu học Hồng Hà - 3474" class="product-image"/>
          </div>
          <p class="name">Bảng học sinh tiểu học Hồng Hà - 3474</p>
          <p class="price">12.000 đ</p>
        </div>
        <div class="product-card" data-sku="3437" data-price="7200">
            <div class="image-box">
            <img src="../images/sanpham/muc.png" alt="Mực lọ Hồng Hà 60 cc - 3437" class="product-image"/>
          </div>
          <p class="name">Mực lọ Hồng Hà 60 cc - 3437</p>
          <p class="price">7.200 đ</p>
        </div>
        <div class="product-card" data-sku="3436" data-price="14502">
            <div class="image-box">
            <img src="../images/sanpham/eke.png" alt="Bộ Đồ dùng 4 sản phẩm - 3436" class="product-image"/>
          </div>
          <p class="name">Bộ Đồ dùng 4 sản phẩm - 3436</p>
          <p class="price">14.502 đ</p>
        </div>
        <div class="product-card" data-sku="3478" data-price="9402">
            <div class="image-box">
            <img src="../images/sanpham/eke.png" alt="Bộ đồ dùng 4 sản phẩm - 3478" class="product-image"/>
          </div>
          <p class="name">Bộ đồ dùng 4 sản phẩm - 3478</p><p class="price">9.402 đ</p>
        </div>
        <div class="product-card" data-sku="3483" data-price="53100">
          <div class="image-box">
            <img src="../images/sanpham/eke.png" alt="Compa bộ SM02 - 3483" class="product-image"/>
          </div>
          <p class="name">Compa bộ SM02 - 3483</p><p class="price">53.100 đ</p>
        </div>
        <div class="product-card" data-sku="3490" data-price="22200">
          <div class="image-box">
            <img src="../images/sanpham/eke.png" alt="Compa kép SM 04 - 3490" class="product-image"/>
          </div>
          <p class="name">Compa kép SM 04 - 3490</p><p class="price">22.200 đ</p>
        </div>
        <div class="product-card" data-sku="3489" data-price="22200">
          <div class="image-box">
            <img src="../images/sanpham/eke.png" alt="Compa chì gố SM 03 - 3489" class="product-image"/>
          </div>
          <p class="name">Compa chì gố SM 03 - 3489</p><p class="price">22.200 đ</p>
        </div>
        <div class="product-card" data-sku="3215" data-price="11400">
          <div class="image-box">
            <img src="../images/sanpham/eke.png" alt="Compa Hồng Hà C9-H - 3215" class="product-image"/>
          </div>
          <p class="name">Compa Hồng Hà C9-H - 3215</p><p class="price">11.400 đ</p>
        </div>
        `;
      const studentProductCards = convertHtmlToProductNodes(
        STUDENT_PRODUCT_HTML_STRING
      );

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

      filterAndSortProducts();
    });