<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>POS - Point of Sale</title>
  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #E9ECEF;
    }

    /* Sidebar */
    .sidebar {
      width: 240px;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      background-color: #FFFFFF;
      color: white;
      display: flex;
      flex-direction: column;
      padding: 25px 15px;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    }

    .sidebar h2 {
      margin-bottom: 35px;
      font-size: 24px;
      text-align: center;
      font-weight: bold;
      color: #00193B;
    }

    .sidebar a {
      color: #6C757D;
      text-decoration: none;
      padding: 12px 20px;
      margin: 6px 0;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .sidebar a:hover {
      background-color: #6C757D;
      padding-left: 25px;
      color: white;
    }

    /* Navbar */
    .navbar {
      margin-left: 240px;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }

    /* Layout */
    .content-area {
      margin-left: 240px;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 40px;
    }

    /* Order Summary */
    .order-summary {
      width: 350px;
      background-color: #ffffff;
      border-radius: 10px;
      padding: 25px 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .order-summary h2 {
      font-size: 20px;
      margin-bottom: 20px;
      color: #2c3e50;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
    }

    .order-summary .line {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 15px;
    }

    .order-summary .line.total {
      font-weight: bold;
      font-size: 17px;
      color: #27ae60;
      border-top: 1px solid #ddd;
      padding-top: 12px;
      margin-top: 15px;
    }

    .payment-options {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }

    .pay-btn {
      flex: 1;
      padding: 10px;
      border: 2px solid #3498db;
      border-radius: 6px;
      background-color: white;
      color: #3498db;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .pay-btn:hover,
    .pay-btn.active {
      background-color: #3498db;
      color: white;
    }

    .order-summary button {
      margin-top: 25px;
      width: 100%;
      background-color: #2ecc71;
      color: white;
      border: none;
      padding: 12px;
      font-size: 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .order-summary button:hover {
      background-color: #27ae60;
    }

    /* Barcode card */
    .card-barcode {
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      width: 420px;
    }

    #scanner {
      width: 100%;
      height: 300px;
      border: 2px dashed #7f8c8d;
      background-color: #ecf0f1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
    }

    .card-barcode input[type="text"] {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .card-barcode button {
      width: 100%;
      padding: 10px;
      border: none;
      background-color: #3498db;
      color: white;
      border-radius: 6px;
      cursor: pointer;
    }

    .card-barcode button:hover {
      background-color: #2980b9;
    }
  </style>
</head>
<body>

  <div class="sidebar">
    <h2>Quantixa</h2>
    <a href="#">Dashboard</a>
    <a href="#">Products</a>
    <a href="#">Clients</a>
    <a href="#">POS</a>
    <a href="#">Invoices</a>
    <a href="#">Reports</a>
    <a href="#">Users</a>
    <a href="#">Subscription</a>
  </div>

  <div class="navbar">Point of Sale (POS)</div>

  <div class="content-area">
    <!-- Barcode Section (left) -->
    <div class="card-barcode">
      <h3>Scan Barcode</h3>
      <button id="activate-camera">Activate Camera</button>
      <div id="scanner" style="display: none;">Camera Loading...</div>
      <input type="text" id="barcode" placeholder="Or enter barcode manually..." />
      <button id="add-product">Add Product</button>
    </div>

    <!-- Order Summary (right) -->
    <div class="order-summary">
      <h2>Order Summary</h2>
      <div class="line"><span>Subtotal</span><span id="subtotal">$0.00</span></div>
      <div class="line"><span>Discount</span><span id="discount">$0.00</span></div>
      <div class="line"><span>Tax (5%)</span><span id="tax">$0.00</span></div>
      <div class="line total"><span>Total</span><span id="total">$0.00</span></div>

      <div class="payment-method">
        <label>Payment Method</label>
        <div class="payment-options">
          <button type="button" class="pay-btn active" data-method="cash">Cash</button>
          <button type="button" class="pay-btn" data-method="credit">Credit</button>
          <button type="button" class="pay-btn" data-method="mobile">Mobile</button>
        </div>
        <input type="hidden" id="payment-method" value="cash">
      </div>

      <button onclick="confirmSale()">Confirm Sale</button>
    </div>
  </div>

  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/quagga/0.12.1/quagga.min.js"></script>
  <script>
    const barcodeInput = document.getElementById('barcode');
    const scanner = document.getElementById('scanner');

    document.getElementById('activate-camera').addEventListener('click', () => {
      scanner.style.display = 'block';

      Quagga.init({
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 400,
            height: 300,
            facingMode: "environment"
          },
          target: scanner
        },
        decoder: {
          readers: ["ean_reader", "code_128_reader"]
        }
      }, function(err) {
        if (err) {
          console.error(err);
          alert("Unable to start camera: " + err);
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected(function(result) {
        barcodeInput.value = result.codeResult.code;
        document.getElementById('add-product').click();
      });
    });

    document.getElementById('add-product').addEventListener('click', () => {
      const barcode = barcodeInput.value.trim();
      if (!barcode) return alert('Please enter a barcode');
      alert("Barcode entered: " + barcode);
      barcodeInput.value = '';
    });

    function confirmSale() {
      const method = document.getElementById('payment-method').value;
      alert('Sale Confirmed using ' + method.toUpperCase());
    }

    // Handle payment button selection
    document.querySelectorAll('.pay-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pay-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('payment-method').value = btn.dataset.method;
      });
    });
  </script>
</body>
</html>
