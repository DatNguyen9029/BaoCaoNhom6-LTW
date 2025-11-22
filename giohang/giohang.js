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

async function loadProducts() {
    try {
        const response = await fetch('/data/products.json');
        productsData = await response.json();
        loadCartFromStorage();
    } catch (error) {
        console.error("Lỗi không đọc được file JSON:", error);
        alert("Không thể tải danh sách sản phẩm. Vui lòng kiểm tra lại!");
    }
}

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('n6_cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    } else { //test data
        cart = [
            { id: "p001", quantity: 5 },
            { id: "p009", quantity: 1 }
        ];
        saveCartToStorage(); 
    }
    
    renderCart();
}

function saveCartToStorage() {
    localStorage.setItem('n6_cart', JSON.stringify(cart));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function renderCart() {
    const cartContainer = document.querySelector('.js-cart-items');
    const cartCountElement = document.querySelector('.right-actions_cart strong');

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div style="text-align:center; padding: 20px;">Giỏ hàng của bạn đang trống!</div>';
        updateOrderSummary();
        if(cartCountElement) {
            cartCountElement.innerText = `(0) sản phẩm`;
        }
        return;
    }

    if(cartCountElement) {
        cartCountElement.innerText = `(${cart.length}) sản phẩm`;
    }
    cart.forEach(item => {
        const productInfo = productsData.find(p => p.id === item.id);

        if (productInfo) {
            const totalItemPrice = productInfo.price * item.quantity;
            
            const itemHTML = `
                <div class="giohang__item" data-id="${item.id}">
                    <img src="/${productInfo.image}" alt="${productInfo.name}" class="giohang__item--anh" onerror="this.src='https://via.placeholder.com/70'">
                    <div class="giohang__item--ten">
                        <strong>${productInfo.name}</strong>
                        <br><small style="color:#888">${productInfo.category}</small>
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
        item.quantity = parseInt(newQuantity);
        if (item.quantity < 1) item.quantity = 1;
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

    const finalTotal = subTotal - discount;

    document.querySelector('.thanhtoan__tamtinh .price').textContent = formatCurrency(subTotal);
    document.querySelector('.js-voucher-discount').textContent = `-${formatCurrency(discount)}`;
    document.querySelector('.thanhtoan__tongtien .price').textContent = formatCurrency(finalTotal > 0 ? finalTotal : 0);
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    const btnApply = document.querySelector('.js-voucher-apply');
    const btnRemove = document.querySelector('.js-voucher-remove');
    const inputVoucher = document.querySelector('.js-voucher-code');

    btnApply.addEventListener('click', () => {
        const code = inputVoucher.value.trim().toUpperCase();
        if (code === "") { alert("Vui lòng nhập mã!"); return; }

        if (VALID_VOUCHERS.hasOwnProperty(code)) {
            const value = VALID_VOUCHERS[code];
            if (value < 1) {
                currentVoucher.discountPercent = value;
                currentVoucher.discountAmount = 0;
                console.log(`Mã ${code}: Giảm ${value * 100}%`);
            } else {
                currentVoucher.discountPercent = 0;
                currentVoucher.discountAmount = value;
                console.log(`Mã ${code}: Giảm ${formatCurrency(value)}`);
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
});