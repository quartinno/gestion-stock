<?php

namespace App\Http\Controllers\pk_product;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;



class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'business'])) {
            return response()->json(['message' => 'Unauthorized: Insufficient role'], 403);
        }
        $products = Product::all();
        return response()->json($products, 200);
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'business') {
            return response()->json(['message' => 'Unauthorized: Insufficient role'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    public function show(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin', 'business'])) {
            return response()->json(['message' => 'Unauthorized: Insufficient role'], 403);
        }
        $product = Product::findOrFail($id);
        return response()->json($product, 200);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'business') {
            return response()->json(['message' => 'Unauthorized: Insufficient role'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $product = Product::findOrFail($id);
        $product->update($request->all());
        return response()->json($product, 200);
    }

    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'business') {
            return response()->json(['message' => 'Unauthorized: Insufficient role'], 403);
        }

        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Product deleted'], 200);
    }
}