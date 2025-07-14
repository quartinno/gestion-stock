<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>POS - Point of Sale</title>
</head>
<body>

<h1>Point of Sale (POS)</h1>

<div>
    <label for="barcode">Scan or enter barcode:</label>
    <input type="text" id="barcode" autofocus />
    <button id="add-product">Add Product</button>
</div>

<table border="1" cellpadding="5" style="margin-top:20px; width: 100%;">
    <thead>
        <tr>
            <th>Name</th>
            <th>Barcode</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody id="sale-items">
        <!-- Products added will appear here -->
    </tbody>
</table>

<h3>Total: $<span id="total">0</span></h3>

<script>
    let saleItems = [];
    const barcodeInput = document.getElementById('barcode');
    const saleItemsBody = document.getElementById('sale-items');
    const totalSpan = document.getElementById('total');

    function updateTable() {
        saleItemsBody.innerHTML = '';
        let total = 0;
        saleItems.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.barcode}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="qty-input" style="width:60px" />
                </td>
                <td>${subtotal.toFixed(2)}</td>
                <td><button data-index="${index}" class="remove-btn">Remove</button></td>
            `;
            saleItemsBody.appendChild(row);
        });
        totalSpan.textContent = total.toFixed(2);

        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = e.target.dataset.index;
                const qty = parseInt(e.target.value);
                if (qty < 1) {
                    e.target.value = 1;
                    saleItems[idx].quantity = 1;
                } else {
                    saleItems[idx].quantity = qty;
                }
                updateTable();
            });
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                saleItems.splice(idx, 1);
                updateTable();
            });
        });
    }

    document.getElementById('add-product').addEventListener('click', () => {
        const barcode = barcodeInput.value.trim();
        if (!barcode) return alert('Please enter a barcode');

        fetch('/admin/pos/product', {  // ولا استعمل route مباشرة من Laravel
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ barcode })
        })
        .then(res => {
            if (!res.ok) throw new Error('Product not found');
            return res.json();
        })
        .then(product => {
            const existingIndex = saleItems.findIndex(item => item.barcode === product.barcode);
            if (existingIndex >= 0) {
                saleItems[existingIndex].quantity += 1;
            } else {
                saleItems.push({ 
                    name: product.name, 
                    barcode: product.barcode, 
                    price: parseFloat(product.price), 
                    quantity: 1 
                });
            }
            updateTable();
            barcodeInput.value = '';
            barcodeInput.focus();
        })
        .catch(err => alert(err.message));
    });

    barcodeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('add-product').click();
        }
    });
</script>

</body>
</html>
