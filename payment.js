const amount = localStorage.getItem("upiAmount");
const cart = JSON.parse(localStorage.getItem("upiCart"));

if (!amount || !cart) {
  alert("Invalid payment session");
  window.location.href = "index.html";
}

document.getElementById("amount").innerText = amount;

// ================= CREATE UPI QR =================
const upiId = "yourupi@bank"; // change this
const name = "ARISE CAFE";

const upiURL = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

document.getElementById("qr").src =
  "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
  encodeURIComponent(upiURL);

// ================= OTP =================
let otp = null;

function generateOTP() {
  otp = Math.floor(100000 + Math.random() * 900000);
  alert("🔐 OTP (demo): " + otp);
}

// generate OTP AFTER QR loads
setTimeout(generateOTP, 1000);

function verifyOTP() {
  const entered = document.getElementById("otpInput").value;

  if (entered == otp) {
    alert("✅ Payment Successful!");

    localStorage.removeItem("cart");
    localStorage.removeItem("upiCart");
    localStorage.removeItem("upiAmount");
    localStorage.removeItem("cartTime");

    window.location.href = "index.html";
  } else {
    alert("❌ Invalid OTP");
  }
}
