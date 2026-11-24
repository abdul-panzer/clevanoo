<?php

use App\Http\Controllers\CandidatesController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\WebsiteEmailController;
use Illuminate\Support\Facades\Route;

// Job Routes
Route::get('/all-jobs', [JobController::class, 'index']);
Route::get('/jobs/{job}', [JobController::class, 'show']);

Route::post('/jobs', [JobController::class, 'store']);
Route::put('/jobs/{job}', [JobController::class, 'update']);
Route::delete('/jobs/{job}', [JobController::class, 'destroy']);
Route::post('/create-job', [JobController::class, 'store']);
Route::put('/update-job/{job}', [JobController::class, 'update']);
Route::delete('/delete-job/{id}', [JobController::class, 'destroy']);

Route::post('/save-candidates', [CandidatesController::class, 'store'])->middleware('throttle:10,1');
Route::get('/resumes/{filename}', [CandidatesController::class, 'downloadResume'])
    ->name('candidate.resume');
Route::post('/website-email', [WebsiteEmailController::class, 'send'])
    ->middleware('throttle:10,1');
