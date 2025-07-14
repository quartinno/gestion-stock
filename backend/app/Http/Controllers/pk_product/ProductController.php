<?php

namespace App\Http\Controllers\pk_product;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
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

   public function index()
{
    $products = DB::table('product')->get();
    return view('admin.products.index', compact('products'));
}

}
