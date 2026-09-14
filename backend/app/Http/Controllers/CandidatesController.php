<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Candidate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Services\WebsiteEmailService;
use Exception;
use Throwable;

class CandidatesController extends Controller
{
    public function __construct(private WebsiteEmailService $websiteEmailService)
    {
    }

    public function store(Request $request)
    {
        try {
            // Validate incoming data
            $validated = $request->validate([
                'first_name'           => 'required|string|max:255',
                'last_name'            => 'required|string|max:255',
                'email'                => 'required|email|max:255',
                'phone'                => 'required|string|max:20',
                'position_applied_for' => 'required|string|max:255',
                'visa_type'            => 'nullable|string|max:255',
                'state'                => 'nullable|string|max:255',
                'resume'               => 'required|file|mimes:pdf,doc,docx|max:2048',
                'message'              => 'nullable|string',
            ]);

            // Generate safe and unique file name
            $date = now()->format('Ymd');
            $extension = $request->file('resume')->getClientOriginalExtension();
            $safeName = preg_replace('/[^A-Za-z0-9]/', '', $validated['first_name']) . '_' .
                preg_replace('/[^A-Za-z0-9]/', '', $validated['last_name']);
            $timestamp = now()->timestamp;
            $filename = $safeName . '_' . $date . '_' . $timestamp . '.' . $extension;

            // Try to store the resume file
            try {
                $resumePath = $request->file('resume')->storeAs('resumes', $filename, 'public');
            } catch (Exception $e) {
                Log::error('Resume upload failed: ' . $e->getMessage());
                return response()->json([
                    'error' => 'Failed to upload resume file.',
                ], 500);
            }

            // Save to database
            try {
                Candidate::create([
                    'first_name'           => $validated['first_name'],
                    'last_name'            => $validated['last_name'],
                    'email'                => $validated['email'],
                    'phone'                => $validated['phone'],
                    'position_applied_for' => $validated['position_applied_for'],
                    'visa_type'            => $validated['visa_type'] ?? null,
                    'state'                => $validated['state'] ?? null,
                    'resume_path'          => $resumePath,
                    'message'              => $validated['message'] ?? null,
                ]);
            } catch (Exception $e) {
                Log::error('Database insert failed: ' . $e->getMessage());

                // Clean up the uploaded file if DB insert fails
                if (Storage::disk('public')->exists($resumePath)) {
                    Storage::disk('public')->delete($resumePath);
                }

                return response()->json([
                    'error' => 'Failed to save candidate data to the database.',
                ], 500);
            }

            $resumeUrl = url('storage/' . $resumePath);

            try {
                $this->websiteEmailService->send('candidate_application', [
                    ...$validated,
                    'resume_url' => $resumeUrl,
                ]);
            } catch (Throwable $e) {
                Log::error('Candidate notification email failed: ' . $e->getMessage());

                return response()->json([
                    'error' => 'Candidate saved, but failed to send notification email.',
                    'resume_path' => $resumePath,
                ], 500);
            }

            return response()->json([
                'message' => 'Candidate submitted successfully!',
                'resume_path' => $resumePath,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error'   => 'Validation failed.',
                'details' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            Log::error('Unexpected error: ' . $e->getMessage());

            return response()->json([
                'error' => 'An unexpected error occurred.',
            ], 500);
        }
    }
}
