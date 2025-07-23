<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $table = 'subscription';
    protected $primaryKey = 'subscription_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'subscription_id',
        'business_id',
        'plan_id',
        'start_date',
        'end_date',
        'status',
        'auto_renewal',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'auto_renewal' => 'boolean',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class, 'business_id', 'business_id');
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id', 'plan_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'subscription_id', 'subscription_id');
    }
}
