<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';  // اسم الجدول الصحيح
    protected $primaryKey = 'id';   // المفتاح الأساسي
    protected $fillable = [
        'name', 'barcode', 'category', 'unit_price', 'cost_price',
        'supplier', 'description', 'expiration_date', 'quantity_in_stock', 'min_stock_threshold'
    ];
}
