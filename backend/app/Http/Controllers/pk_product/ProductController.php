<?php

namespace App\Http\Controllers\pk_product;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // تجيب المنتج عبر barcode
    public function getByBarcode($barcode)
    {
        $product = DB::table('product')->where('barcode', $barcode)->first();

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json([
            'barcode' => $product->barcode,
            'name' => $product->name,
        ]);
    }

    // عرض لائحة المنتجات مع خيارات البحث والتصفية
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                  ->orWhereRaw('LOWER(barcode) LIKE ?', ['%' . strtolower($search) . '%']);
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->filled('stock_status')) {
            switch ($request->input('stock_status')) {
                case 'in_stock':
                    $query->where('quantity_in_stock', '>', 10);
                    break;
                case 'low_stock':
                    $query->whereBetween('quantity_in_stock', [1, 10]);
                    break;
                case 'out_of_stock':
                    $query->where('quantity_in_stock', '=', 0);
                    break;
            }
        }

        $categories = Category::all();
        $products = $query->with('category')->get();

        return view('admin.products.index', compact('products', 'categories'));
    }

    // عرض نموذج إضافة منتج جديد
    public function create()
    {
        $categories = Category::all();
        return view('admin.products.create', compact('categories'));
    }

    // تخزين منتج جديد
    public function store(Request $request)
    {
        $request->validate([
            'business_id' => 'required',
            'category_id' => 'required',
            'supplier_id' => 'required',
            'name' => 'required',
            'barcode' => 'required|unique:product,barcode',
            'unit_price' => 'required|numeric',
            'cost_price' => 'required|numeric',
            'quantity_in_stock' => 'required|integer',
            'minimum_stock_threshold' => 'required|integer',
            'status' => 'required|in:active,inactive,discontinued',
            'expiration_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        Product::create($request->all());

        return redirect()->route('admin.products.index')->with('success', 'Product added successfully.');
    }

    // عرض نموذج تعديل منتج
    public function edit(Product $product)
    {
        $categories = Category::all();
        return view('admin.products.edit', compact('product', 'categories'));
    }

    // تحديث بيانات المنتج
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'business_id' => 'required',
            'category_id' => 'required',
            'supplier_id' => 'required',
            'name' => 'required',
            'barcode' => 'required|unique:product,barcode,' . $product->product_id . ',product_id',
            'unit_price' => 'required|numeric',
            'cost_price' => 'required|numeric',
            'quantity_in_stock' => 'required|integer',
            'minimum_stock_threshold' => 'required|integer',
            'status' => 'required|in:active,inactive,discontinued',
            'expiration_date' => 'nullable|date',
            'description' => 'nullable|string',
        ]);

        $product->update($request->all());

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    // حذف منتج
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}
