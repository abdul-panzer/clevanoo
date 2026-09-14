<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobController;
use App\Http\Controllers\CandidatesController;

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
Route::post('/website-email', function (Request $request) {
    \Illuminate\Support\Facades\Log::info('[WebsiteEmail] route reached', [
        'route' => 'api.php:/website-email',
        'method' => $request->method(),
        'path' => $request->path(),
        'origin' => $request->headers->get('origin'),
        'content_type' => $request->headers->get('content-type'),
        'payload' => $request->except(['password']),
    ]);

    try {
        \Illuminate\Support\Facades\Log::info('[WebsiteEmail] validation starting');

        $validated = $request->validate([
            'type' => ['required', 'string', \Illuminate\Validation\Rule::in(['contact', 'unsubscribe', 'subscription'])],
            'name' => ['required_unless:type,subscription', 'nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required_if:type,unsubscribe', 'nullable', 'string', 'max:30'],
            'message' => ['required_if:type,contact', 'nullable', 'string', 'max:5000'],
        ]);

        \Illuminate\Support\Facades\Log::info('[WebsiteEmail] validation passed', [
            'type' => $validated['type'],
        ]);

        \Illuminate\Support\Facades\Log::info('[WebsiteEmail] mail send starting', [
            'mail_default' => config('mail.default'),
            'mail_host' => config('mail.mailers.smtp.host'),
            'mail_port' => config('mail.mailers.smtp.port'),
            'mail_scheme' => config('mail.mailers.smtp.scheme'),
            'mail_username_set' => filled(config('mail.mailers.smtp.username')),
            'mail_password_set' => filled(config('mail.mailers.smtp.password')),
            'mail_from' => config('mail.from.address'),
            'website_mail_to' => config('services.website_mail.to'),
        ]);

        app(\App\Services\WebsiteEmailService::class)->send($validated['type'], $validated);

        \Illuminate\Support\Facades\Log::info('[WebsiteEmail] mail send completed');

        return response()->json([
            'message' => 'Email sent successfully.',
        ]);
    } catch (\Throwable $exception) {
        \Illuminate\Support\Facades\Log::error('[WebsiteEmail] failed', [
            'exception_class' => $exception::class,
            'exception_message' => $exception->getMessage(),
            'exception_file' => $exception->getFile(),
            'exception_line' => $exception->getLine(),
        ]);

        return response()->json([
            'error' => config('app.debug') ? $exception->getMessage() : 'Failed to send email. Please try again later.',
        ], 500);
    }
});

// Define the route for creating a job
Route::post('/create-job', [JobController::class, 'store']);
Route::put('/update-job/{job}', [JobController::class, 'update']);
Route::delete('/delete-job/{id}', [JobController::class, 'destroy']);
