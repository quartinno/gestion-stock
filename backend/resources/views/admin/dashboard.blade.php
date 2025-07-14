<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Super Admin Dashboard</title>
    <style>
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          display: flex;
          height: 100vh;
          background-color: #f4f6f8;
        }

        /* Sidebar style */
        .sidebar {
          width: 220px;
          background-color: #2c3e50;
          color: white;
          display: flex;
          flex-direction: column;
          padding: 20px;
          box-sizing: border-box;
        }

        .sidebar h2 {
          margin-bottom: 30px;
          font-size: 22px;
          letter-spacing: 1px;
          font-weight: bold;
          text-align: center;
        }

        .sidebar a {
          color: white;
          text-decoration: none;
          padding: 12px 15px;
          margin-bottom: 10px;
          border-radius: 5px;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }

        .sidebar a:hover {
          background-color: #34495e;
        }

        /* Main content style */
        .main-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
          box-sizing: border-box;
        }

        h1 { 
          color: #2c3e50; 
          margin-top: 0;
          margin-bottom: 20px;
        }

        .card { 
          padding: 20px; 
          border: 1px solid #ccc; 
          margin-bottom: 15px; 
          border-radius: 10px; 
          background: white;
        }

        .card h2 { 
          margin: 0 0 10px; 
        }

        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px; 
        }

        th, td { 
          border: 1px solid #ddd; 
          padding: 10px; 
          text-align: left; 
        }

        th { 
          background-color: #f2f2f2; 
        }

        tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        /* Big card style for Manage Businesses */
        .big-card {
          margin-top: 30px;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          background-color: white;
        }

        .actions a {
          margin-right: 10px;
          text-decoration: none;
          font-weight: 600;
        }

        .actions a.edit {
          color: #3498db;
        }

        .actions a.delete {
          color: #e74c3c;
        }
    </style>
</head>
<body>

  <div class="sidebar">
    <h2>Admin Panel</h2>
    <a href="{{ route('admin.dashboard') }}">Dashboard</a>
    <a href="{{ route('admin.products') }}">Products</a>
    <a href="{{ route('admin.clients') }}">Clients</a>
    <a href="{{ route('admin.pos') }}">POS</a>
    <a href="{{ route('admin.invoices') }}">Invoices</a>
    <a href="{{ route('admin.reports') }}">Reports</a>
    <a href="{{ route('admin.users') }}">Users</a>
    <a href="{{ route('admin.subscription') }}">Subscription</a>
  </div>

  <div class="main-content">
    <h1>Super Admin Dashboard</h1>

    <div class="card">
      <h2>Active Businesses: {{ $totalBusinesses }}</h2>
    </div>

    <div class="card">
      <h2>Expired Plans (last 30 days): {{ $expiredPlans }}</h2>
    </div>

    <div class="card">
      <h2>Monthly Revenue: ${{ number_format($revenueThisMonth, 2) }}</h2>
    </div>

    <!-- Big card for Manage Businesses -->
    <div class="card big-card">
      <h2>Manage Businesses</h2>

      <table>
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Contact Email</th>
            <th>Plan</th>
            <th>Status</th>
            <th>Joined Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @foreach($businesses as $business)
                    <tr>
                        <td>{{ $business->business_name }}</td>
                        <td>{{ $business->contact_email }}</td>
                        <td>{{ $business->plan }}</td>
                        <td>{{ ucfirst($business->status) }}</td>
                        <td>{{ date('Y-m-d', strtotime($business->joined_date)) }}</td>
                        <td>
            <td class="actions">
              <a href="#" class="edit">Edit</a>
              <a href="#" class="delete" onclick="return confirm('Are you sure you want to delete this business?')">Delete</a>
            </td>
          </tr>
          @endforeach
        </tbody>
      </table>
    </div>
  </div>

</body>
</html>
