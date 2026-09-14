<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $table = 'clevanoo_jobs';
    // Allow mass-assignment for all job fields
    protected $fillable = [
        'jobtitle',
        'city',
        'state',
        'duration',
        'bill_rate',
        'description',
    ];
}
