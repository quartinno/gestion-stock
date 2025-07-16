<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BusinessDashboardController extends Controller
{
    public function index()
    {
        $businessId = 'your-existing-business-id'; // هنا تجيب الـ business_id ديال المستخدم أو من الجلسة

        $totalProducts = DB::table('product')
            ->where('business_id', $businessId)
            ->count();

        $expiredProducts = DB::table('product')
            ->where('business_id', $businessId)
            ->whereDate('expiration_date', '<', Carbon::today())
            ->count();

        $lowStockProducts = DB::table('product')
            ->where('business_id', $businessId)
            ->whereColumn('quantity_in_stock', '<', 'minimum_stock_threshold')
            ->count();

        $totalClients = DB::table('client')
            ->where('business_id', $businessId)
            ->count();

        $overdueClients = DB::table('client')
            ->where('business_id', $businessId)
            ->where('credit_balance', '>', 0) // يمكن تضيف شرط آخر للتأكد من تاريخ استحقاق الدين
            ->count();

        $activeSubscriptions = DB::table('subscription')
            ->where('business_id', $businessId)
            ->where('status', 'active')
            ->count();

        $salesToday = DB::table('sale')
            ->where('business_id', $businessId)
            ->whereDate('sale_date', Carbon::today())
            ->sum('total_amount');

        return view('admin.business.dashboard', compact(
            'totalProducts',
            'expiredProducts',
            'lowStockProducts',
            'totalClients',
            'overdueClients',
            'activeSubscriptions',
            'salesToday'
        ));
    }
}
