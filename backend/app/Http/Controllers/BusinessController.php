<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use App\Models\Business;
class BusinessController extends Controller
{
    public function index()
    {
        $business = Business::with(['products', 'suppliers', 'customers'])
            ->get();
        return response()->json(['message' => 'List of businesses']);
    }
}
