<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>@yield('title', 'Dashboard')</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      display: flex;
    }
    .sidebar {
      width: 220px;
      height: 100vh;
      background-color: #0D65D2;
      color: white;
      display: flex;
      flex-direction: column;
      padding-top: 20px;
    }
    .sidebar h2 {
      text-align: center;
      margin-bottom: 30px;
      font-weight: 700;
    }
    .sidebar a {
      padding: 15px 25px;
      color: white;
      text-decoration: none;
      font-weight: 600;
      border-left: 4px solid transparent;
      transition: background-color 0.3s, border-left 0.3s;
    }
    .sidebar a:hover {
      background-color: #00214D;
      border-left: 4px solid #FFC107;
    }
    .main-content {
      flex-grow: 1;
      padding: 30px;
      background-color: #f9f9f9;
      height: 100vh;
      overflow-y: auto;
    }
  </style>
</head>
<body>
  @include('layouts.sidebar')

  <div class="main-content">
    @yield('content')
  </div>
</body>
</html>