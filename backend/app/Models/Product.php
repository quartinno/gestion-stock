<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Category;


class Product extends Model
{
    protected $table = 'product';
    protected $primaryKey = 'product_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'business_id', 'category_id', 'supplier_id', 'name', 'barcode', 
        'unit_price', 'cost_price', 'description', 'expiration_date', 
        'quantity_in_stock', 'minimum_stock_threshold', 'tax_rate', 'status'
    ];

    protected $casts = [
        'expiration_date' => 'datetime',
    ];

    // علاقة المنتج بالفئة
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->product_id = (string) Str::uuid();
        });
    }


}