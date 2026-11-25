<?php

use App\Http\Controllers\JobPostingController;
use Illuminate\Support\Facades\Route;

Route::get('/job/{id}', [JobPostingController::class, 'show'])->where('id', '[1-9][0-9]{0,18}');
Route::get('/jobs-sitemap.xml', [JobPostingController::class, 'sitemap']);

Route::get('/', function () {
    return view('welcome');
});
