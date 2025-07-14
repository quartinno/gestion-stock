<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class POSController extends Controller
{
    // Show POS page
    public function index()
    {
        return view('admin.pos.index');
    }

    // Search product by barcode (AJAX)
    public function getProductByBarcode(Request $request)
    {
        $barcode = $request->barcode;
        $product = DB::table('product')->where('barcode', $barcode)->first();

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json($product);
    }
}
