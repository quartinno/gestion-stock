<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    // عرض صفحة POS
    public function index()
    {
        return view('admin.pos.index');
    }

    // جلب منتج حسب الباركود (POST AJAX)
    public function getProductByBarcode(Request $request)
    {
        $barcode = $request->barcode;

        $product = DB::table('product')->where('barcode', $barcode)->first();

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json([
            'product_id' => $product->product_id,
            'name' => $product->name,
            'barcode' => $product->barcode,
            'price' => $product->unit_price,
            'quantity_in_stock' => $product->quantity_in_stock,
        ]);
    }
}
