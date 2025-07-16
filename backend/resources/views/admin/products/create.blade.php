@extends('layouts.app')

@section('content')
    <h2>Add New Product</h2>

    @if($errors->any())
        <div style="color: red;">
            <ul>
                @foreach($errors->all() as $err)
                    <li>{{ $err }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('products.store') }}">
        @csrf

        <label>Business ID:</label><br>
        <input type="text" name="business_id" value="{{ old('business_id') }}" required><br><br>

        <label>Category:</label><br>
        <select name="category_id" required>
            <option value="">-- Select Category --</option>
            @foreach($categories as $category)
                <option value="{{ $category->category_id }}" {{ old('category_id') == $category->category_id ? 'selected' : '' }}>
                    {{ $category->name }}
                </option>
            @endforeach
        </select><br><br>

        <label>Supplier ID:</label><br>
        <input type="text" name="supplier_id" value="{{ old('supplier_id') }}" required><br><br>

        <label>Name:</label><br>
        <input type="text" name="name" value="{{ old('name') }}" required><br><br>

        <label>Barcode:</label><br>
        <input type="text" name="barcode" value="{{ old('barcode') }}" required><br><br>

        <label>Unit Price:</label><br>
        <input type="number" step="0.01" name="unit_price" value="{{ old('unit_price') }}" required><br><br>

        <label>Cost Price:</label><br>
        <input type="number" step="0.01" name="cost_price" value="{{ old('cost_price') }}" required><br><br>

        <label>Description:</label><br>
        <textarea name="description">{{ old('description') }}</textarea><br><br>

        <label>Expiration Date:</label><br>
        <input type="date" name="expiration_date" value="{{ old('expiration_date') }}"><br><br>

        <label>Quantity in Stock:</label><br>
        <input type="number" name="quantity_in_stock" value="{{ old('quantity_in_stock') }}" required><br><br>

        <label>Minimum Stock Threshold:</label><br>
        <input type="number" name="minimum_stock_threshold" value="{{ old('minimum_stock_threshold') }}" required><br><br>

        <label>Status:</label><br>
        <select name="status" required>
            <option value="active" {{ old('status')=='active' ? 'selected' : '' }}>Active</option>
            <option value="inactive" {{ old('status')=='inactive' ? 'selected' : '' }}>Inactive</option>
            <option value="discontinued" {{ old('status')=='discontinued' ? 'selected' : '' }}>Discontinued</option>
        </select><br><br>

        <button type="submit" style="padding: 10px 20px;">Save</button>
    </form>
@endsection