let productsData = []; 
let cart = []; 

let currentVoucher = {
    code: "",
    discountPercent: 0,
    discountAmount: 0
};

const VALID_VOUCHERS = {
    "N6VIP": 0.2,
    "CHAO2025": 0.1,
    "CT188": 0.9,
    "FREESHIP": 15000 
};

document.addEventListener('DOMContentLoaded', () => {
    loadProducts(); 
    setupVoucherEvents();
});

async function loadProducts() {
    try {
        const response = await fetch('/data/products.json');
        
        if (!response.ok) {
            throw new Error("Không thể kết nối tới file products.json");
        }

        productsData = await response.json();
        
        loadCartFromStorage();

    } catch (error) {
        console.error("Lỗi:", error);
        const container = document.querySelector('.js-cart-items');
        if(container) {
            container.innerHTML = `<p style="color:red; text-align:center; padding:20px;">
                Lỗi tải dữ liệu! Hãy chắc chắn bạn đang chạy bằng <b>Live Server</b>.<br>
                (Chi tiết lỗi: ${error.message})
            </p>`;
        }
    }
}

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('n6_cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    } else {
        cart = [];
    }
    // Migrate legacy homepage IDs (e.g. 0001,1001,2003) to product IDs in products.json
    const legacyMap = {
        '0001': 'p001', '0002': 'p002', '0003': 'p003', '0004': 'p004',
        '1001': 'p005', '1002': 'p006', '1003': 'p007', '2003': 'p009'
    };
    let migrated = false;
    cart.forEach(item => {
        if (legacyMap[item.id]) {
            item.id = legacyMap[item.id];
            migrated = true;
        }
    });
    if (migrated) saveCartToStorage();

    renderCart();
}

function saveCartToStorage() {
    localStorage.setItem('n6_cart', JSON.stringify(cart));
    updateCartBadge();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// --- 3. HIỂN THỊ GIỎ HÀNG (RENDER) ---
function renderCart() {
    const cartContainer = document.querySelector('.js-cart-items');
    updateCartBadge();

    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart-message">Giỏ hàng của bạn đang trống!<br><a href="../sanpham/sanpham.html" style="color:#e4002b; margin-top:10px; display:inline-block;">Quay lại mua sắm</a></div>';
        updateOrderSummary();
        return;
    }

    cart.forEach(item => {
        const productInfo = productsData.find(p => p.id === item.id);

        if (productInfo) {
            const totalItemPrice = productInfo.price * item.quantity;
            
            let imgSrc = productInfo.image;
            if (!imgSrc.startsWith("../") && !imgSrc.startsWith("http")) {
                imgSrc = "../" + imgSrc;
            }

            const itemHTML = `
                <div class="giohang__item" data-id="${item.id}">
                    <img src="${imgSrc}" alt="${productInfo.name}" class="giohang__item--anh" onerror="this.src='https://via.placeholder.com/70'">
                    <div class="giohang__item--ten">
                        <strong>${productInfo.name}</strong>
                        <br><small style="color:#888">${productInfo.category || 'Sản phẩm'}</small>
                    </div>
                    <div class="giohang__item--gia">${formatCurrency(productInfo.price)}</div>
                    <input type="number" min="1" value="${item.quantity}" class="giohang__item--soluong" onchange="updateQuantity('${item.id}', this.value)">
                    <div class="giohang--thanhtien">${formatCurrency(totalItemPrice)}</div>
                    <button class="giohang__item--xoa" onclick="removeItem('${item.id}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            `;
            cartContainer.insertAdjacentHTML('beforeend', itemHTML);
        }
    });

    updateOrderSummary();
}

window.updateQuantity = function(id, newQuantity) {
    const item = cart.find(p => p.id === id);
    if (item) {
        let qty = parseInt(newQuantity);
        if (qty < 1 || isNaN(qty)) qty = 1;
        item.quantity = qty;
        saveCartToStorage();
        renderCart();
    }
}

window.removeItem = function(id) {
    
        cart = cart.filter(p => p.id !== id);
        saveCartToStorage();
        renderCart();
}

function updateOrderSummary() {
    let subTotal = 0;
    
    cart.forEach(item => {
        const productInfo = productsData.find(p => p.id === item.id);
        if (productInfo) {
            subTotal += productInfo.price * item.quantity;
        }
    });

    let discount = 0;
    if (currentVoucher.discountPercent > 0) {
        discount = subTotal * currentVoucher.discountPercent;
    } else if (currentVoucher.discountAmount > 0) {
        discount = currentVoucher.discountAmount;
    }

    if (discount > subTotal) discount = subTotal;

    const finalTotal = subTotal - discount;

    const tamTinhEl = document.querySelector('.thanhtoan__tamtinh .price');
    const discountEl = document.querySelector('.js-voucher-discount');
    const tongTienEl = document.querySelector('.thanhtoan__tongtien .price');

    if(tamTinhEl) tamTinhEl.textContent = formatCurrency(subTotal);
    if(discountEl) discountEl.textContent = `-${formatCurrency(discount)}`;
    if(tongTienEl) tongTienEl.textContent = formatCurrency(finalTotal > 0 ? finalTotal : 0);
}

function updateCartBadge() {
    const cartCountElement = document.querySelector('.right-actions_cart strong');
    if(cartCountElement) {
        cartCountElement.innerText = `(${cart.length}) sản phẩm`;
    }
}

function setupVoucherEvents() {
    const btnApply = document.querySelector('.js-voucher-apply');
    const btnRemove = document.querySelector('.js-voucher-remove');
    const inputVoucher = document.querySelector('.js-voucher-code');

    if(!btnApply) return;

    btnApply.addEventListener('click', () => {
        const code = inputVoucher.value.trim().toUpperCase();
        if (code === "") { alert("Vui lòng nhập mã!"); return; }

        if (VALID_VOUCHERS.hasOwnProperty(code)) {
            const value = VALID_VOUCHERS[code];
            if (value < 1) {
                currentVoucher.discountPercent = value;
                currentVoucher.discountAmount = 0;
                alert(`Áp dụng mã ${code}: Giảm ${value * 100}%`);
            } else {
                currentVoucher.discountPercent = 0;
                currentVoucher.discountAmount = value;
                alert(`Áp dụng mã ${code}: Giảm ${formatCurrency(value)}`);
            }
            btnApply.style.display = 'none';
            btnRemove.style.display = 'inline-flex';
            inputVoucher.disabled = true;
            updateOrderSummary();
        } else {
            alert("Mã giảm giá không tồn tại!");
        }
    });

    btnRemove.addEventListener('click', () => {
        currentVoucher = { code: "", discountPercent: 0, discountAmount: 0 };
        inputVoucher.value = "";
        inputVoucher.disabled = false;
        btnApply.style.display = 'inline-flex';
        btnRemove.style.display = 'none';
        updateOrderSummary();
    });
}