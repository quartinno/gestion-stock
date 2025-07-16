@extends('layouts.app')

@section('content')
    <h2>Edit Product</h2>

    @if(session('success'))
        <div style="color: green;">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div style="color: red;">
            <ul>
                @foreach($errors->all() as $err)
                    <li>{{ $err }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('products.update', $product->product_id) }}">
        @csrf
        @method('PUT')

        <label>Business ID:</label><br>
        <input type="text" name="business_id" value="{{ old('business_id', $product->business_id) }}" required><br><br>

        <label>Category:</label><br>
        <select name="category_id" required>
            <option value="">-- Select Category --</option>
            @foreach($categories as $category)
                <option value="{{ $category->category_id }}" {{ old('category_id', $product->category_id) == $category->category_id ? 'selected' : '' }}>
                    {{ $category->name }}
                </option>
            @endforeach
        </select><br><br>

        <label>Supplier ID:</label><br>
        <input type="text" name="supplier_id" value="{{ old('supplier_id', $product->supplier_id) }}" required><br><br>

        <label>Name:</label><br>
        <input type="text" name="name" value="{{ old('name', $product->name) }}" required><br><br>

        <label>Barcode:</label><br>
        <input type="text" name="barcode" value="{{ old('barcode', $product->barcode) }}" required><br><br>

        <label>Unit Price:</label><br>
        <input type="number" step="0.01" name="unit_price" value="{{ old('unit_price', $product->unit_price) }}" required><br><br>

        <label>Cost Price:</label><br>
        <input type="number" step="0.01" name="cost_price" value="{{ old('cost_price', $product->cost_price) }}" required><br><br>

        <label>Description:</label><br>
        <textarea name="description">{{ old('description', $product->description) }}</textarea><br><br>

        <label>Expiration Date:</label><br>
        <input type="date" name="expiration_date" value="{{ old('expiration_date', $product->expiration_date ? $product->expiration_date->format('Y-m-d') : '') }}"><br><br>

        <label>Quantity in Stock:</label><br>
        <input type="number" name="quantity_in_stock" value="{{ old('quantity_in_stock', $product->quantity_in_stock) }}" required><br><br>

        <label>Minimum Stock Threshold:</label><br>
        <input type="number" name="minimum_stock_threshold" value="{{ old('minimum_stock_threshold', $product->minimum_stock_threshold) }}" required><br><br>

        <label>Status:</label><br>
        <select name="status" required>
            <option value="active" {{ old('status', $product->status) == 'active' ? 'selected' : '' }}>Active</option>
            <option value="inactive" {{ old('status', $product->status) == 'inactive' ? 'selected' : '' }}>Inactive</option>
            <option value="discontinued" {{ old('status', $product->status) == 'discontinued' ? 'selected' : '' }}>Discontinued</option>
        </select><br><br>

        <button type="submit" style="padding: 10px 20px;">Update</button>
    </form>

    <form method="POST" action="{{ route('products.destroy', $product->product_id) }}" style="margin-top: 20px;">
        @csrf
        @method('DELETE')
        <button type="submit" onclick="return confirm('Are you sure you want to delete this product?')" style="color: red; padding: 10px 20px;">
            Delete Product
        </button>
    </form>

    <br>
    <a href="{{ route('products.index') }}">← Back to product list</a>
@endsection