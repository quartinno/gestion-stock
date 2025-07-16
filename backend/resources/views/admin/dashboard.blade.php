<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Super Admin Dashboard</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      display: flex;
      height: 100vh;
      background-color: #f4f6f8;
    }

    /* Sidebar */
    .sidebar {
      width: 220px;
      background-color: #ffffff;
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
      color: #00193B;
    }

    .sidebar a {
      color: #6C757D;
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

    /* Navbar */
    .navbar {
      position: fixed;
      top: 0;
      left: 220px;
      right: 0;
      height: 60px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      z-index: 10;
    }

    .navbar .title {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      padding-left: 15px;
    }

    .navbar .actions {
      display: flex;
      gap: 15px;
    }

    .navbar .actions button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
    }

    .main-content {
      flex: 1;
     
      padding: 90px 30px 30px;
      box-sizing: border-box;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .card-container {
      display: flex;
      gap: 15px;
      margin-top: 15px; 
      margin-bottom: 20px;
    }

    .card.small-card {
      flex: 1;
      min-width: 150px;
      padding: 15px;
      border-radius: 8px;
      background-color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      text-align: center;
    }

    .card.small-card h2 {
      font-size: 14px;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .card.small-card p {
      font-size: 18px;
      font-weight: bold;
      color: #3498db;
      margin: 0;
    }

    .card.big-card {
      padding: 20px;
      border-radius: 10px;
      background-color: white;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      margin-top: 15px; /* نقصت */
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
    <h2>Quantixa</h2>
    <a href="{{ route('admin.dashboard') }}">Dashboard</a>
    <a href="{{ route('admin.products') }}">Products</a>
    <a href="{{ route('admin.clients') }}">Clients</a>
    <a href="{{ route('admin.pos') }}">POS</a>
    <a href="{{ route('admin.invoices') }}">Invoices</a>
    <a href="{{ route('admin.reports') }}">Reports</a>
    <a href="{{ route('admin.users') }}">Users</a>
    <a href="{{ route('admin.subscription') }}">Subscription</a>
  </div>

  <div class="navbar">
    <div class="title">Super Admin</div>
    <div class="actions">
      <button> Notification</button>
      <button>Logout</button>
    </div>
  </div>

  <div class="main-content">
  
  
    <div class="card-container">
        <div class="card small-card">
        <h2>Monthly Revenue</h2>
        <p>${{ number_format($revenueThisMonth, 2) }}</p>
      </div>
      
      <div class="card small-card">
        <h2>Active Businesses</h2>
        <p>{{ $totalBusinesses }} </p>
      </div>

      <div class="card small-card">
        <h2>Expired Plans (30d)</h2>
        <p>{{ $expiredPlans }}</p>
      </div>

    
    </div>

    <div class="card big-card">
      <h2>Manage Businesses</h2>
      <!-- 🔍 Search and Filter -->
<form method="GET" action="{{ route('admin.dashboard') }}" style="margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;">
  <input type="text" name="search" placeholder="Search by name or email" value="{{ request('search') }}" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc; flex: 1; min-width: 200px;" />

  <select name="status" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
    <option value="">All Status</option>
    <option value="active" {{ request('status') == 'active' ? 'selected' : '' }}>Active</option>
    <option value="inactive" {{ request('status') == 'inactive' ? 'selected' : '' }}>Inactive</option>
  </select>

  <button type="submit" style="background-color: #3498db; color: white; border: none; padding: 8px 14px; border-radius: 5px; cursor: pointer;">Search</button>
</form>

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
