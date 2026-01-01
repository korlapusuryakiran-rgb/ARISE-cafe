// ================= CART SETUP =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartDiv = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCart");
const whatsappBtn = document.getElementById("whatsappOrder");

// ================= SAVE CART =================
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
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
      <div style="margin-bottom:10px">
        <strong>${item.name}</strong><br>
        ₹${item.price} × ${item.qty}<br>
        <button onclick="changeQty(${index},1)">+</button>
        <button onclick="changeQty(${index},-1)">-</button>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  cartTotal.innerText = total;
}

// ================= CART ACTIONS =================
function addToCart(name, price) {
  const item = cart.find((i) => i.name === name);

  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  saveCart();
  renderCart();
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart();
  renderCart();
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
}

// ================= CLEAR CART =================
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
  });
}

// ================= WHATSAPP ORDER =================
if (whatsappBtn) {
  whatsappBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    let message = "Order Details:%0A";
    cart.forEach((item) => {
      message += `- ${item.name} x${item.qty} = ₹${item.price * item.qty}%0A`;
    });

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    message += `Total: ₹${total}`;

    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
  });
}

// ================= PAYMENT =================
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const addressSection = document.getElementById("addressSection");

paymentRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    addressSection.style.display = radio.value === "cod" ? "block" : "none";
    if (radio.value === "cod") setTimeout(() => map.invalidateSize(), 300);
  });
});

// ================= MAP =================
let selectedLat = null;
let selectedLng = null;
let marker = null;

const map = L.map("map").setView([17.385044, 78.486671], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

map.on("click", (e) => setLocation(e.latlng.lat, e.latlng.lng));

document.getElementById("liveLocationBtn").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    setLocation(pos.coords.latitude, pos.coords.longitude);
    map.setView([pos.coords.latitude, pos.coords.longitude], 16);
  });
});

function setLocation(lat, lng) {
  selectedLat = lat;
  selectedLng = lng;

  if (marker) marker.setLatLng([lat, lng]);
  else marker = L.marker([lat, lng]).addTo(map);

  document.getElementById("locationText").innerText = `📍 ${lat.toFixed(
    5
  )}, ${lng.toFixed(5)}`;
}

// ================= CONFIRM ORDER =================
document.getElementById("confirmOrderBtn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Cart is empty!");

  const payment = document.querySelector('input[name="payment"]:checked');
  if (!payment) return alert("Select payment method");

  if (payment.value === "UPI") {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    localStorage.setItem("upiAmount", total);
    localStorage.setItem("upiCart", JSON.stringify(cart));

    window.location.href = "payment.html";
    return;
  }

  if (payment.value === "cod") {
    if (!selectedLat) return alert("Select delivery location");
    alert("✅ COD Order Confirmed");
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
  }
});

// ================= INIT =================
renderCart();

// ================= ADD BUTTONS =================
document.querySelectorAll("li[data-name]").forEach((li) => {
  li.querySelector(".addbtn")?.addEventListener("click", () => {
    addToCart(li.dataset.name, Number(li.dataset.price));
  });
});
