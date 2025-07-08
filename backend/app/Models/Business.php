<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $table = 'businesses'; /
    protected $fillable = ['name', 'description', 'address']; // Add other fields as necessary

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class);
    }

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }
}
