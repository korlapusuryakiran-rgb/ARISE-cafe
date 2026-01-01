const amount = localStorage.getItem("upiAmount");
const cart = JSON.parse(localStorage.getItem("upiCart"));

document.getElementById("amount").innerText = amount;

// ===== CREATE UPI QR =====
const upiId = "yourupi@bank"; // 🔴 change to your UPI ID
const name = "ARISE CAFE";

const upiURL = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

document.getElementById("qr").src =
  "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
  encodeURIComponent(upiURL);

// ===== OTP GENERATION =====
const otp = Math.floor(100000 + Math.random() * 900000);
alert("🔐 OTP (demo): " + otp);

function verifyOTP() {
  const enteredOTP = document.getElementById("otpInput").value;

  if (enteredOTP == otp) {
    alert("✅ Payment Successful!\nOrder Confirmed");

    // clear everything
    localStorage.removeItem("cart");
    localStorage.removeItem("upiCart");
    localStorage.removeItem("upiAmount");

    window.location.href = "index.html"; // your main page
  } else {
    alert("❌ Invalid OTP. Try again.");
  }
}
