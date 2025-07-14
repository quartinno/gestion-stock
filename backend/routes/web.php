<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\pk_product\ProductController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubscriptionController;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/products', [ProductController::class, 'index'])->name('products');
    Route::get('/clients', [ClientController::class, 'index'])->name('clients');
    Route::get('/pos', [POSController::class, 'index'])->name('pos');
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices');
    Route::get('/reports', [ReportController::class, 'index'])->name('reports');
    Route::get('/users', [UserController::class, 'index'])->name('users');
    Route::get('/subscription', [SubscriptionController::class, 'index'])->name('subscription');
});

Route::get('/pos', [POSController::class, 'userPos'])->name('pos.user');
