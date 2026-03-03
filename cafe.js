(function () {
  const WHATSAPP_NUMBER = "918125311552";
  const UPI_ID = "arisecafe@okhdfcbank";
  const MERCHANT_NAME = "Arise Cafe";

  const menuItems = [
    {
      id: 1,
      name: "Espresso",
      price: 250,
      category: "coffee",
      image: "Espresso.jpg",
    },
    {
      id: 2,
      name: "Latte",
      price: 150,
      category: "coffee",
      image: "latte.jpg",
    },
    {
      id: 3,
      name: "Cappuccino",
      price: 200,
      category: "coffee",
      image: "coffe.jpg",
    },
    {
      id: 4,
      name: "Cold Coffee",
      price: 180,
      category: "coffee",
      image: "cold coffee.jpg",
    },
    {
      id: 5,
      name: "Croissant",
      price: 60,
      category: "food",
      image: "Quick & Easy Chocolate Almond Croissants.jpg",
    },
    {
      id: 6,
      name: "Choco Kunafa",
      price: 250,
      category: "food",
      image: "Pistachio Kunafa Brownie 🍰🌰.jpg",
    },
    {
      id: 7,
      name: "Brownie",
      price: 110,
      category: "food",
      image: "Brownie.jpg",
    },
    {
      id: 8,
      name: "Veg Sandwich",
      price: 120,
      category: "food",
      image: "Veg Sandwich.jpg",
    },
    {
      id: 9,
      name: "Green Tea",
      price: 90,
      category: "coffee",
      image: "green tea.jpg",
    },
    {
      id: 10,
      name: "Hot Coffee",
      price: 180,
      category: "coffee",
      image: "hot coffe.jpg",
    },
    {
      id: 11,
      name: "Truffle Fries",
      price: 60,
      category: "food",
      image: "truffle fries.jpg",
    },
    {
      id: 12,
      name: "Greek Veggie Cottage Cheese Wrap",
      price: 80,
      category: "food",
      image: "Greek Veggie Cottage Cheese Wrap.jpg",
    },
    {
      id: 13,
      name: "Chicken Sandwich",
      price: 90,
      category: "food",
      image: "chick.jpg",
    },
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
    renderMenu(getCurrentCategory());
  }

  function getCurrentCategory() {
    const active = document.querySelector(".filter-btn.active");
    return active ? active.dataset.category : "all";
  }

  function renderMenu(category = "all") {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;
    const filtered =
      category === "all"
        ? menuItems
        : menuItems.filter((i) => i.category === category);
    grid.innerHTML = filtered
      .map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);
        const qty = cartItem ? cartItem.quantity : 0;
        return `
        <div class="group bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-stone-100 dark:border-stone-700 flex flex-col">
          <div class="relative aspect-square overflow-hidden">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500">
            <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-orange-600">★ 4.5</div>
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1">${item.name}</h3>
            <p class="text-stone-500 dark:text-stone-400 text-sm line-clamp-2 mb-4 flex-1">Delicious ${item.name}</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="font-bold text-lg">₹${item.price}</span>
              <div class="flex items-center gap-2">
                ${
                  qty > 0
                    ? `
                  <button onclick="adjustQuantity(${item.id}, -1)" class="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"><i data-lucide="minus" class="w-4 h-4"></i></button>
                  <span id="menu-qty-${item.id}" class="w-6 text-center font-medium bg-stone-100 dark:bg-stone-700 rounded-md px-1 py-0.5">${qty}</span>
                  <button onclick="adjustQuantity(${item.id}, 1)" class="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-colors"><i data-lucide="plus" class="w-4 h-4"></i></button>
                `
                    : `
                  <button onclick="adjustQuantity(${item.id}, 1)" class="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-700 transition-colors">Add</button>
                `
                }
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
    lucide.createIcons();
  }

  window.adjustQuantity = (idOrName, delta) => {
    let id = idOrName;
    if (typeof idOrName === "string") {
      const item = menuItems.find((m) => m.name === idOrName);
      if (!item) return;
      id = item.id;
    }
    const existing = cart.find((c) => c.id === id);
    if (existing) {
      existing.quantity += delta;
      if (existing.quantity <= 0) cart = cart.filter((c) => c.id !== id);
    } else if (delta > 0) {
      const menuItem = menuItems.find((m) => m.id === id);
      cart.push({ ...menuItem, quantity: 1 });
    }
    saveCart();
  };

  window.increaseQty = (id) => adjustQuantity(id, 1);
  window.decreaseQty = (id) => adjustQuantity(id, -1);
  window.removeFromCart = (id) => {
    cart = cart.filter((c) => c.id !== id);
    saveCart();
  };

  function updateCartDisplay() {
    const container = document.getElementById("cart-items");
    const totalSpan = document.getElementById("cart-total");
    const countSpan = document.getElementById("cart-count");
    if (!container || !totalSpan || !countSpan) return;

    if (cart.length === 0) {
      container.innerHTML =
        '<div class="text-center py-12 text-stone-400">Your cart is empty</div>';
      totalSpan.innerText = "₹0";
      countSpan.classList.add("hidden");
    } else {
      let total = 0;
      let itemsCount = 0;
      let html = "";
      cart.forEach((item) => {
        total += item.price * item.quantity;
        itemsCount += item.quantity;
        html += `
          <div class="flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
            <div class="flex-1"><span class="font-medium">${item.name}</span> <span class="text-sm text-stone-500">(₹${item.price})</span></div>
            <div class="flex items-center gap-3">
              <button onclick="decreaseQty(${item.id})" class="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white"><i data-lucide="minus" class="w-3 h-3"></i></button>
              <span class="w-6 text-center font-medium bg-stone-100 dark:bg-stone-700 rounded-md px-1 py-0.5">${item.quantity}</span>
              <button onclick="increaseQty(${item.id})" class="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white"><i data-lucide="plus" class="w-3 h-3"></i></button>
              <button onclick="removeFromCart(${item.id})" class="text-red-400 hover:text-red-600"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
            </div>
          </div>
        `;
      });
      container.innerHTML = html;
      totalSpan.innerText = `₹${total}`;
      countSpan.innerText = itemsCount;
      countSpan.classList.remove("hidden");
    }

    menuItems.forEach((item) => {
      const span = document.getElementById(
        `qty-${item.name.replace(/\s/g, "")}`,
      );
      if (span) {
        const cartItem = cart.find((c) => c.id === item.id);
        span.innerText = cartItem ? cartItem.quantity : 0;
      }
    });

    lucide.createIcons();
  }

  window.clearCart = () => {
    cart = [];
    saveCart();
  };

  window.toggleCart = () => {
    const modal = document.getElementById("cart-modal");
    const content = document.getElementById("cart-content");
    modal.classList.toggle("hidden");
    setTimeout(() => content.classList.toggle("translate-x-full"), 10);
  };

  document
    .getElementById("payment-mode")
    ?.addEventListener("change", function () {
      const cashDiv = document.getElementById("cash-options");
      const upiDiv = document.getElementById("upi-apps");
      if (this.value === "Cash") {
        cashDiv.classList.remove("hidden");
        upiDiv.classList.add("hidden");
      } else if (this.value === "UPI") {
        upiDiv.classList.remove("hidden");
        cashDiv.classList.add("hidden");
      } else {
        cashDiv.classList.add("hidden");
        upiDiv.classList.add("hidden");
      }
    });

  document.getElementById("cash-type")?.addEventListener("change", function () {
    const addrSection = document.getElementById("delivery-address-section");
    addrSection.classList.toggle("hidden", this.value !== "Delivery");
  });

  window.payWithUPI = (app) => {
    const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
    if (total === 0) return alert("Cart is empty");
    const upiBase = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total}&cu=INR`;
    let link = upiBase;
    if (app === "gpay")
      link = `tez://upi/pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${total}&cu=INR`;
    else if (app === "phonepe")
      link = `phonepe://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${total}&cu=INR`;
    else if (app === "paytm")
      link = `paytmmp://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${total}&cu=INR`;
    window.location.href = link;
  };

  let pendingMessage = "";
  function showBill(message, total) {
    const modal = document.getElementById("bill-modal");
    const details = document.getElementById("bill-details");
    const totalEl = document.getElementById("bill-total");
    details.innerHTML = "";
    cart.forEach((item) => {
      details.innerHTML += `<div class="flex justify-between"><span>${item.name} x${item.quantity}</span><span>₹${item.price * item.quantity}</span></div>`;
    });
    totalEl.textContent = `₹${total}`;
    pendingMessage = message;
    modal.classList.remove("hidden");
  }
  window.closeBillModal = () =>
    document.getElementById("bill-modal").classList.add("hidden");
  window.confirmCashPayment = () => {
    alert("Payment Successful ✅");
    closeBillModal();
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pendingMessage)}`,
      "_blank",
    );
  };

  window.checkoutWhatsApp = () => {
    if (cart.length === 0) return alert("Cart empty");
    const phone = document.getElementById("order-phone").value.trim();
    const payment = document.getElementById("payment-mode").value;
    if (!phone || !payment)
      return alert("Enter phone number and select payment mode");

    let total = 0;
    let msg = "New Order:\n";
    cart.forEach((i) => {
      msg += `- ${i.name} x${i.quantity}\n`;
      total += i.price * i.quantity;
    });
    msg += `\nTotal: ₹${total}\nCustomer Phone: ${phone}\nPayment: ${payment}`;

    if (payment === "Cash") {
      const orderType = document.getElementById("cash-type").value;
      if (!orderType) return alert("Select Dine-In / Takeaway / Delivery");
      msg += `\nOrder Type: ${orderType}`;
      if (orderType === "Delivery") {
        const addr = document.getElementById("delivery-address").value.trim();
        if (!addr) return alert("Enter delivery address");
        msg += `\nAddress: ${addr}`;
      }
      if (orderType === "Takeaway" || orderType === "Delivery") {
        showBill(msg, total);
        return;
      }

      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
    } else {
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
    }
  };

  window.sendBillToCustomer = () => {
    if (cart.length === 0) return alert("Cart empty");
    const customerPhone = document.getElementById("order-phone").value.trim();
    const payment = document.getElementById("payment-mode").value;
    if (!customerPhone || !payment)
      return alert("Enter phone number and select payment mode");

    let total = 0;
    let msg = "🧾 Your Arise Cafe Bill:\n\n";
    cart.forEach((i) => {
      msg += `- ${i.name} x${i.quantity} = ₹${i.price * i.quantity}\n`;
      total += i.price * i.quantity;
    });
    msg += `\nTotal: ₹${total}`;
    msg += `\nPayment: ${payment}`;

    if (payment === "Cash") {
      const orderType = document.getElementById("cash-type").value;
      if (orderType) {
        msg += `\nOrder Type: ${orderType}`;

        if (orderType === "Dine-In") {
          msg += `\n\nYour order will be served at your table. Thank you for dining with us! ☕`;
        } else if (orderType === "Takeaway") {
          msg += `\n\nYour order will be ready for pickup. Thank you! Have a nice day 😇`;
        } else if (orderType === "Delivery") {
          const addr = document.getElementById("delivery-address").value.trim();
          if (addr) msg += `\nDelivery Address: ${addr}`;
          msg += `\n\nYour order will be delivered soon. Thank you!`;
        }
      }
    } else {
      msg += `\n\nThank you for your order! Have a great day! ☕`;
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  document.getElementById("bookingForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("bookName").value.trim();
    const phone = document.getElementById("bookPhone").value.trim();
    const date = document.getElementById("bookDate").value;
    const time = document.getElementById("bookTime").value;
    const guests = document.getElementById("bookGuests").value;

    if (!name || !phone || !date || !time || !guests) {
      alert("Please fill all booking details.");
      return;
    }

    const [hr, min] = time.split(":");
    const hour = parseInt(hr);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedTime = `${hour % 12 || 12}:${min} ${ampm}`;

    const cafeMessage = `🔔 New Table Booking\n\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nTime: ${formattedTime}\nGuests: ${guests}`;
    const customerMessage = `✅ Your table at Arise Cafe is confirmed!\n\n📅 Date: ${date}\n⏰ Time: ${formattedTime}\n👥 Guests: ${guests}\n\nWe look forward to serving you! ☕`;

    const cleanCafePhone = WHATSAPP_NUMBER.replace(/\D/g, "");
    const cleanCustomerPhone = phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/${cleanCafePhone}?text=${encodeURIComponent(cafeMessage)}`,
      "_blank",
    );
    setTimeout(() => {
      window.open(
        `https://wa.me/${cleanCustomerPhone}?text=${encodeURIComponent(customerMessage)}`,
        "_blank",
      );
    }, 500);

    alert(
      "Booking request sent to the cafe. A confirmation message has also been sent to your WhatsApp.",
    );
    e.target.reset();
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.remove("active", "bg-orange-600", "text-white");
        b.classList.add(
          "bg-white",
          "text-stone-600",
          "dark:bg-stone-700",
          "dark:text-stone-300",
        );
      });
      this.classList.add("active", "bg-orange-600", "text-white");
      this.classList.remove(
        "bg-white",
        "text-stone-600",
        "dark:bg-stone-700",
        "dark:text-stone-300",
      );
      renderMenu(this.dataset.category);
    });
  });

  const liveLocationBtn = document.getElementById("liveLocationBtn");

  liveLocationBtn?.addEventListener("click", function () {
    const destination =
      "Roast 24 Seven, Sy no 18 & 19, Plot No: 25, 42, 44, behind Vyshnavi Cynosure, Telecom Nagar, Gachibowli, Hyderabad, Telangana 500032";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const mapsURL =
            `https://www.google.com/maps/dir/?api=1` +
            `&origin=${userLat},${userLng}` +
            `&destination=${encodeURIComponent(destination)}` +
            `&travelmode=driving`;

          window.open(mapsURL, "_blank");
        },
        function () {
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
            "_blank",
          );
        },
      );
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`,
        "_blank",
      );
    }
  });

  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  menuBtn?.addEventListener("click", () =>
    mobileMenu.classList.toggle("hidden"),
  );
  document
    .querySelectorAll("#mobile-menu a")
    .forEach((link) =>
      link.addEventListener("click", () => mobileMenu.classList.add("hidden")),
    );

  const htmlEl = document.documentElement;
  if (localStorage.getItem("theme") === "dark") htmlEl.classList.add("dark");
  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    htmlEl.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      htmlEl.classList.contains("dark") ? "dark" : "light",
    );
  });

  renderMenu("all");
  updateCartDisplay();
  lucide.createIcons();

  window.addEventListener("click", (e) => {
    if (
      e.target ===
      document.querySelector("#cart-modal .absolute.inset-0.bg-black\\/50")
    )
      toggleCart();
  });
})();


