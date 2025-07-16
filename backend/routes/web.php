<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\BusinessDashboardController;
use App\Http\Controllers\pk_product\ProductController; 
use App\Http\Controllers\ClientController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::get('/clients', [ClientController::class, 'index'])->name('clients');
    Route::get('/pos', [POSController::class, 'index'])->name('pos');
    Route::post('/pos/product', [POSController::class, 'getProductByBarcode'])->name('pos.product');
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/subscription', [SubscriptionController::class, 'index'])->name('subscription');
});

Route::get('/business/dashboard', [BusinessDashboardController::class, 'index'])->name('business.dashboard');

Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
Route::post('/products', [ProductController::class, 'store'])->name('products.store');
Route::post('/products/import', [ProductController::class, 'import'])->name('products.import');  
Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
Route::get('/products/{product}/adjust-stock', [ProductController::class, 'adjustStock'])->name('products.adjust-stock');
