<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Business Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f9fafb;
            margin: 20px;
        }

        .cards-container {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .card {
            background: white;
            padding: 20px;
            flex: 1 1 200px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
        }

        .card h3 {
            margin-bottom: 10px;
            color: #333;
            font-weight: 600;
        }

        .card p {
            font-size: 28px;
            color: #007bff;
            margin: 0;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <!-- resources/views/admin/business/dashboard.blade.php -->
<div class="container">
    <h1>Business Dashboard</h1>

    <div class="cards-container" style="display:flex; gap:20px; flex-wrap:wrap;">
        <div class="card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex:1 1 200px; text-align:center;">
            <h3>Total Products</h3>
            <p style="font-size:28px; color:#007bff;">{{ $totalProducts }}</p>
        </div>

        <div class="card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex:1 1 200px; text-align:center;">
            <h3>Expired Products</h3>
            <p style="font-size:28px; color:#dc3545;">{{ $expiredProducts }}</p>
        </div>

        <div class="card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex:1 1 200px; text-align:center;">
            <h3>Low Stock Products</h3>
            <p style="font-size:28px; color:#ffc107;">{{ $lowStockProducts }}</p>
        </div>

        <div class="card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex:1 1 200px; text-align:center;">
            <h3>Total Clients</h3>
            <p style="font-size:28px; color:#28a745;">{{ $totalClients }}</p>
        </div>

        <div class="card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex:1 1 200px; text-align:center;">
            <h3>Overdue Clients</h3>
            <p style="font-size:28px; color:#dc3545;">{{ $overdueClients }}</p>
        </div>

        <div class="card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex:1 1 200px; text-align:center;">
            <h3>Active Subscriptions</h3>
            <p style="font-size:28px; color:#17a2b8;">{{ $activeSubscriptions }}</p>
        </div>

        <div class="card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); flex:1 1 200px; text-align:center;">
            <h3>Sales Today</h3>
            <p style="font-size:28px; color:#28a745;">${{ number_format($salesToday, 2) }}</p>
        </div>
    </div>
</div>



</body>
</html>
