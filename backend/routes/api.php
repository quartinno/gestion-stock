<?php
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\pk_product\ProductController;
use Illuminate\Support\Facades\Route;

// مسارات بدون توثيق
Route::post('/login', [AuthController::class, 'login']);

// مسارات محمية
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);

    // مسار مميز باش نجيب المنتج بالباركود
    Route::get('/products/barcode/{barcode}', [ProductController::class, 'getByBarcode']);
});
