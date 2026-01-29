<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>UPI Payment - ARISE CAFE</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>
      body {
        font-family: Arial;
        text-align: center;
        background: #fff7f0;
        padding: 30px;
      }

      h2,
      h3 {
        color: brown;
      }

      img {
        width: 260px;
        border: 3px solid brown;
        padding: 10px;
        margin: 20px 0;
      }

      input,
      button {
        padding: 10px;
        width: 240px;
        margin-top: 10px;
        font-size: 16px;
      }

      button {
        background: brown;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }

      button:hover {
        background: darkred;
      }

      .pay-options button {
        margin: 10px;
      }

      .section {
        margin-top: 20px;
      }
    </style>
  </head>

  <body>
    <h2>UPI Payment - ARISE CAFE</h2>

    <p>
      Total Amount: ₹<strong><span id="amount"></span></strong>
    </p>

    <div class="pay-options">
      <button onclick="showQR()">Pay via QR Code</button>
      <button onclick="showPhone()">Pay via Phone Number</button>
    </div>

    <div id="qrSection" class="section" style="display: none">
      <h3>Scan & Pay</h3>
      <img id="qr" alt="UPI QR Code" />
    </div>

    <div id="phoneSection" class="section" style="display: none">
      <h3>Pay via UPI ID / Phone</h3>
      <p id="upiText"></p>
      <button onclick="openUPIApp()">Open UPI App</button>
    </div>

    <div class="section">
      <h3>Enter OTP</h3>
      <input type="number" id="otpInput" placeholder="Enter OTP" />
      <br />
      <button onclick="verifyOTP()">Confirm Payment</button>
    </div>

    <script src="payment.js"></script>
  </body>
</html>
