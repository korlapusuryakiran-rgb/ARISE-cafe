// ================= BASIC VALIDATION =================
const amount = localStorage.getItem("upiAmount");
const cart = JSON.parse(localStorage.getItem("upiCart"));

if (!amount || !cart || cart.length === 0) {
  alert("Invalid payment session");
  window.location.href = "index.html";
}

// SHOW TOTAL AMOUNT
document.getElementById("amount").innerText = amount;

// ================= UPI DETAILS =================
const upiId = "arise.cafe@okaxis & 9876543210"; // 🔴 CHANGE TO YOUR REAL UPI ID
const merchantName = "ARISE CAFE";

const upiURL = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR`;

// ================= ELEMENTS =================
const qrSection = document.getElementById("qrSection");
const phoneSection = document.getElementById("phoneSection");
const qrImg = document.getElementById("qr");
const upiText = document.getElementById("upiText");

// ================= OTP (DEMO) =================
let otp = null;

function generateOTP() {
  if (otp !== null) return; // prevent multiple OTPs
  otp = Math.floor(100000 + Math.random() * 900000);
  alert("🔐 OTP (Demo): " + otp);
}

// ================= SHOW QR PAYMENT =================
function showQR() {
  phoneSection.style.display = "none";
  qrSection.style.display = "block";

  qrImg.src =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(upiURL);

  generateOTP();
}

// ================= SHOW PHONE PAYMENT =================
function showPhone() {
  qrSection.style.display = "none";
  phoneSection.style.display = "block";

  upiText.innerText = `UPI ID / Phone Number: ${upiId}`;

  generateOTP();
}

// ================= OPEN UPI APP =================
function openUPIApp() {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isMobile) {
    alert("Please open this payment on your mobile phone to use UPI apps.");
    return;
  }

  // This triggers UPI app chooser
  window.location.href = upiURL;
}

// ================= VERIFY OTP =================
function verifyOTP() {
  const enteredOTP = document.getElementById("otpInput").value;

  if (!enteredOTP) {
    alert("Please enter OTP");
    return;
  }

  if (enteredOTP == otp) {
    alert("✅ Payment Successful!\nOrder Confirmed");

    // CLEAR EVERYTHING
    localStorage.removeItem("cart");
    localStorage.removeItem("upiCart");
    localStorage.removeItem("upiAmount");
    localStorage.removeItem("cartTime");

    window.location.href = "index.html";
  } else {
    alert("❌ Invalid OTP. Try again.");
  }
}
