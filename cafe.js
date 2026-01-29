// ================== ASK USER ON VISIT ==================
const savedCart = JSON.parse(localStorage.getItem("cart"));

if (savedCart && savedCart.length > 0) {
  const choice = confirm(
    "🛒 You have a previous order.\n\nPress OK to CONTINUE\nPress Cancel for NEW ORDER"
  );

  if (!choice) {
    // User wants new order
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTime");
  }
}

// ================== CART SETUP ==================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartDiv = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCart");
const whatsappBtn = document.getElementById("whatsappOrder");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");

// ================== SAVE CART ==================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTime", Date.now());
}

// ================== AUTO CLEAR CART ==================
function clearCartAuto() {
  cart = [];
  localStorage.removeItem("cart");
  localStorage.removeItem("cartTime");
  renderCart();
  syncMenuQty();
}

// ================== CART EXPIRY (30 MIN) ==================
const CART_EXPIRY = 30 * 60 * 1000; // 30 minutes
const savedTime = localStorage.getItem("cartTime");

if (savedTime && Date.now() - savedTime > CART_EXPIRY) {
  clearCartAuto();
}

// ================== RENDER CART ==================
function renderCart() {
  cartDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty</p>";
    cartTotal.innerText = "0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartDiv.innerHTML += `
      <div style="margin-bottom:15px;">
        <img src="${item.img}" style="
          width:60px;
          height:60px;
          object-fit:cover;
          border-radius:10px;
          border:2px solid brown;
        "><br>
        <strong>${item.name}</strong><br>
        ₹${item.price} × ${item.qty}<br>
        <button onclick="updateQty(${index},1)">+</button>
        <button onclick="updateQty(${index},-1)">-</button>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  cartTotal.innerText = total;
}

// ================== ADD TO CART ==================
function addToCart(name, price, img) {
  if (!img) img = "default.jpg";

  const item = cart.find(i => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, img, qty: 1 });

  saveCart();
  renderCart();
}

// ================== UPDATE QTY ==================
function updateQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
  syncMenuQty();
}

// ================== REMOVE ITEM ==================
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  syncMenuQty();
}

// ================== CLEAR CART BUTTON ==================
clearCartBtn.addEventListener("click", clearCartAuto);

// ================== MENU BUTTONS ==================
document.querySelectorAll(".menu-item").forEach(item => {
  const plus = item.querySelector(".plus");
  const minus = item.querySelector(".minus");
  const qtySpan = item.querySelector(".qty");

  const name = item.dataset.name;
  const price = Number(item.dataset.price);
  const img = item.dataset.img;

  let qty = 0;
  const cartItem = cart.find(i => i.name === name);
  if (cartItem) {
    qty = cartItem.qty;
    qtySpan.innerText = qty;
  }

  plus.addEventListener("click", () => {
    qty++;
    qtySpan.innerText = qty;
    addToCart(name, price, img);
  });

  minus.addEventListener("click", () => {
    if (qty > 0) {
      qty--;
      qtySpan.innerText = qty;
      const index = cart.findIndex(i => i.name === name);
      if (index !== -1) updateQty(index, -1);
    }
  });
});

// ================== SYNC MENU QTY ==================
function syncMenuQty() {
  document.querySelectorAll(".menu-item").forEach(item => {
    const qtySpan = item.querySelector(".qty");
    const name = item.dataset.name;
    const cartItem = cart.find(i => i.name === name);
    qtySpan.innerText = cartItem ? cartItem.qty : 0;
  });
}

// ================== WHATSAPP ORDER ==================
whatsappBtn.addEventListener("click", () => {
  if (cart.length === 0) return alert("Cart is empty!");

  let msg = "🛒 *ARISE CAFE ORDER*%0A";
  cart.forEach(item => {
    msg += `• ${item.name} x${item.qty} = ₹${item.price * item.qty}%0A`;
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  msg += `%0A*Total: ₹${total}*`;

  window.open(`https://wa.me/1234567890?text=${msg}`, "_blank");
});

// ================== CONFIRM ORDER ==================
confirmOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) return alert("Cart is empty!");

  const payment = document.querySelector('input[name="payment"]:checked');
  if (!payment) return alert("Select payment method");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (payment.value === "UPI") {
    localStorage.setItem("upiAmount", total);
    localStorage.setItem("upiCart", JSON.stringify(cart));
    clearCartAuto(); // AUTO CLEAR
    window.location.href = "payment.html";
  } else {
    alert("✅ COD Order Confirmed");
    clearCartAuto(); // AUTO CLEAR
  }
});

// ================== INIT ==================
renderCart();
syncMenuQty();
