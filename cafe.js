// ================= ASK USER ON VISIT =================
const savedCart = JSON.parse(localStorage.getItem("cart"));

if (savedCart && savedCart.length > 0) {
  const choice = confirm(
    "🛒 You have a previous order.\n\nOK = Continue Order\nCancel = New Order",
  );

  if (!choice) {
    localStorage.removeItem("cart");
    localStorage.removeItem("cartTime");
  }
}

// ================= CART SETUP =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= DOM =================
const cartDiv = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCart");
const whatsappBtn = document.getElementById("whatsappOrder");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const addressSection = document.getElementById("addressSection");

// ================= SAVE CART =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartTime", Date.now());
}

// ================= AUTO CLEAR =================
function clearCartAuto() {
  cart = [];
  localStorage.removeItem("cart");
  localStorage.removeItem("cartTime");
  renderCart();
  syncMenuQty();
}

// ================= CART EXPIRY (30 MIN) =================
const CART_EXPIRY = 30 * 60 * 1000;
const savedTime = localStorage.getItem("cartTime");
if (savedTime && Date.now() - savedTime > CART_EXPIRY) {
  clearCartAuto();
}

// ================= RENDER CART =================
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
      <div style="margin-bottom:12px;">
        <img src="${item.img}" style="
          width:60px;height:60px;
          object-fit:cover;
          border-radius:8px;
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

// ================= CART FUNCTIONS =================
function addToCart(name, price, img) {
  const item = cart.find((i) => i.name === name);
  if (item) item.qty++;
  else cart.push({ name, price, img, qty: 1 });

  saveCart();
  renderCart();
}

function updateQty(index, change) {
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
  syncMenuQty();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  syncMenuQty();
}

// ================= CLEAR CART BUTTON =================
clearCartBtn.addEventListener("click", clearCartAuto);

// ================= MENU + / - =================
document.querySelectorAll(".menu-item").forEach((item) => {
  const plus = item.querySelector(".plus");
  const minus = item.querySelector(".minus");
  const qtySpan = item.querySelector(".qty");

  const name = item.dataset.name;
  const price = Number(item.dataset.price);
  const img = item.dataset.img;

  let qty = 0;
  const cartItem = cart.find((i) => i.name === name);
  if (cartItem) {
    qty = cartItem.qty;
    qtySpan.innerText = qty;
  }

  plus.onclick = () => {
    qty++;
    qtySpan.innerText = qty;
    addToCart(name, price, img);
  };

  minus.onclick = () => {
    if (qty > 0) {
      qty--;
      qtySpan.innerText = qty;
      const index = cart.findIndex((i) => i.name === name);
      if (index !== -1) updateQty(index, -1);
    }
  };
});

// ================= SYNC MENU =================
function syncMenuQty() {
  document.querySelectorAll(".menu-item").forEach((item) => {
    const qtySpan = item.querySelector(".qty");
    const cartItem = cart.find((i) => i.name === item.dataset.name);
    qtySpan.innerText = cartItem ? cartItem.qty : 0;
  });
}

// ================= PAYMENT RADIO =================
document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    addressSection.style.display = radio.value === "cod" ? "block" : "none";
    if (radio.value === "cod") setTimeout(() => map.invalidateSize(), 300);
  });
});

// ================= MAP =================
let selectedLat = null;
let marker = null;

const map = L.map("map").setView([17.385044, 78.486671], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

map.on("click", (e) => {
  selectedLat = e.latlng.lat;
  if (marker) marker.setLatLng(e.latlng);
  else marker = L.marker(e.latlng).addTo(map);
});
// ================= LIVE LOCATION =================
const liveLocationBtn = document.getElementById("liveLocationBtn");

liveLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      selectedLat = lat;

      const userLatLng = [lat, lng];

      map.setView(userLatLng, 16);

      if (marker) {
        marker.setLatLng(userLatLng);
      } else {
        marker = L.marker(userLatLng).addTo(map);
      }

      alert("📍 Live location detected successfully");
    },
    (error) => {
      alert("❌ Unable to fetch live location. Please allow location access.");
    },
  );
});

// ================= WHATSAPP =================
whatsappBtn.onclick = () => {
  if (cart.length === 0) return alert("Cart is empty!");

  let msg = "🛒 ARISE CAFE ORDER%0A";
  cart.forEach((i) => {
    msg += `• ${i.name} x${i.qty} = ₹${i.price * i.qty}%0A`;
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  msg += `%0ATotal: ₹${total}`;

  window.open(`https://wa.me/8125311552?text=${msg}`, "_blank");
};

// ================= CONFIRM ORDER =================
confirmOrderBtn.onclick = () => {
  if (cart.length === 0) return alert("Cart is empty!");

  const payment = document.querySelector('input[name="payment"]:checked');
  if (!payment) return alert("Select payment method");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (payment.value === "UPI") {
    localStorage.setItem("upiAmount", total);
    localStorage.setItem("upiCart", JSON.stringify(cart));
    window.location.href = "payment.html";
  } else {
    if (!selectedLat) return alert("Select delivery location");
    alert("✅ COD Order Confirmed");
    clearCartAuto();
  }
};

// ================= INIT =================
renderCart();
syncMenuQty();
