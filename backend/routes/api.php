<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CandidatesController;
use App\Http\Controllers\WebsiteEmailController;

// Job Routes
Route::get('/all-jobs', [JobController::class, 'index']);
Route::post('/jobs', [JobController::class, 'store']);  // Create new job
Route::get('/jobs/{job}', [JobController::class, 'show']); // Show specific job
Route::put('/jobs/{job}', [JobController::class, 'update']); // Update job
Route::delete('/jobs/{job}', [JobController::class, 'destroy']); // Delete job

// Candidate Routes (as per your original code)
Route::post('/save-candidates', [CandidatesController::class, 'store']);

// Website email routes
Route::post('/website-email', [WebsiteEmailController::class, 'send']);

// Define the route for creating a job
Route::post('/create-job', [JobController::class, 'store']);
Route::put('/update-job/{job}', [JobController::class, 'update']);
Route::delete('/delete-job/{id}', [JobController::class, 'destroy']);
