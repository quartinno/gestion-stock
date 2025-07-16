@extends('layouts.app')

@section('title', 'Product List')

@section('content')
    <h2>Product List</h2>

    @if(session('success'))
        <div style="color: green; margin-bottom: 15px;">
            {{ session('success') }}
        </div>
    @endif

   
    <form method="GET" action="{{ route('products.index') }}">
        <input type="text" name="search" placeholder="Search by name or barcode" value="{{ request('search') }}">

        <select name="category_id">
            <option value="">All Categories</option>
            @foreach($categories as $category)
                <option value="{{ $category->category_id }}" {{ request('category_id') == $category->category_id ? 'selected' : '' }}>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>

        <select name="stock_status">
            <option value="">All Stock Status</option>
            <option value="in_stock" {{ request('stock_status') == 'in_stock' ? 'selected' : '' }}>In Stock (&gt; 10)</option>
            <option value="low_stock" {{ request('stock_status') == 'low_stock' ? 'selected' : '' }}>Low Stock (1-10)</option>
            <option value="out_of_stock" {{ request('stock_status') == 'out_of_stock' ? 'selected' : '' }}>Out of Stock (= 0)</option>
        </select>

        <button type="submit">Filter</button>
    </form>

    
    <div style="margin: 20px 0; display: flex; justify-content: space-between; align-items: center;">
        {{-- زر Import --}}
        <form action="{{ route('products.import') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <input type="file" name="file" required>
            <button type="submit" style="background-color: green; color: white; padding: 6px 15px;">📂 Import CSV</button>
        </form>

        {{-- زر Add --}}
        <a href="{{ route('products.create') }}" style="background-color: #0D65D2; color: white; padding: 10px 20px; text-decoration: none;">
             Add Product
        </a>
    </div>

    <table border="1" width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse;">
        <thead style="background-color: #f0f0f0;">
            <tr>
                <th>Name</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Expiration</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @forelse($products as $product)
                <tr>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->barcode }}</td>
                    <td>{{ $product->category ? $product->category->name : 'N/A' }}</td>
                    <td>{{ $product->quantity_in_stock }}</td>
                    <td>
                        @if($product->expiration_date)
                            {{ \Carbon\Carbon::parse($product->expiration_date)->format('Y-m-d') }}
                        @else
                            N/A
                        @endif
                    </td>
                    <td>
                        <a href="{{ route('products.edit', $product->product_id) }}">Edit</a> |
                        <a href="{{ route('products.adjust-stock', $product->product_id) }}">Adjust Stock</a> |
                        <form action="{{ route('products.destroy', $product->product_id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button onclick="return confirm('Are you sure?')" style="color: red; background: none; border: none; cursor: pointer; padding: 0;">
                                Delete
                            </button>
                        </form>
                    </td>
                </tr>
            @empty
                <tr><td colspan="6" style="text-align:center;">No products found.</td></tr>
            @endforelse
        </tbody>
    </table>
@endsection