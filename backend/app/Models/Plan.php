<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $table = 'plan';
    protected $primaryKey = 'plan_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'plan_id',
        'name',
        'description',
        'price',
        'duration',
        'max_users',
        'max_products',
        'features',
        'status',
    ];

    protected $casts = [
        'features' => 'json',
    ];
}
