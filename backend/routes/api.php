<?php

use App\Http\Controllers\CandidatesController;
use App\Http\Controllers\JobController;
use App\Support\WebsiteEmailEndpoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Job Routes
Route::get('/all-jobs', [JobController::class, 'index']);
Route::post('/jobs', [JobController::class, 'store']);  // Create new job
Route::get('/jobs/{job}', [JobController::class, 'show']); // Show specific job
Route::put('/jobs/{job}', [JobController::class, 'update']); // Update job
Route::delete('/jobs/{job}', [JobController::class, 'destroy']); // Delete job

// Candidate Routes (as per your original code)
Route::post('/save-candidates', [CandidatesController::class, 'store']);
Route::get('/resumes/{filename}', [CandidatesController::class, 'downloadResume'])->where('filename', '.*');

// Website email routes
Route::post('/website-email', fn (Request $request) => WebsiteEmailEndpoint::send($request, 'api.php:/website-email'));

// Define the route for creating a job
Route::post('/create-job', [JobController::class, 'store']);
Route::put('/update-job/{job}', [JobController::class, 'update']);
Route::delete('/delete-job/{id}', [JobController::class, 'destroy']);
