<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebsiteEmailController;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/api/website-email', [WebsiteEmailController::class, 'send']);
