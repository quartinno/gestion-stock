<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalBusinesses = DB::table('business')->count();

        $activePlans = DB::table('subscription')
            ->where('status', 'active')
            ->count();

        $expiredPlans = DB::table('subscription')
            ->where('status', 'expired')
            ->where('end_date', '>=', Carbon::now()->subDays(30))
            ->count();

        $revenueThisMonth = DB::table('payment')
            ->whereMonth('payment_date', Carbon::now()->month)
            ->whereYear('payment_date', Carbon::now()->year)
            ->where('status', 'completed')
            ->sum('amount');

        $totalPlans = DB::table('plan')->count();

        $businesses = DB::table('business')
            ->leftJoin('subscription', 'business.business_id', '=', 'subscription.business_id')
            ->leftJoin('plan', 'subscription.plan_id', '=', 'plan.plan_id')
            ->select(
                'business.name as business_name',
                'business.email as contact_email',
                'subscription.status',
                'plan.name as plan',
                'subscription.created_at as joined_date'
            )
            ->get();

        return view('admin.dashboard', compact(
            'totalBusinesses',
            'activePlans',
            'expiredPlans',
            'revenueThisMonth',
            'totalPlans',
            'businesses'
        ));
    }
}
