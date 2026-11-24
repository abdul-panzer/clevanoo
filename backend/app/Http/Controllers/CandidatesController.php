<?php

namespace App\Http\Controllers;

use App\Models\Candidate;
use App\Models\Job;
use App\Services\WebsiteEmailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use RuntimeException;
use Throwable;

class CandidatesController extends Controller
{
    public function __construct(private WebsiteEmailService $websiteEmailService) {}

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'job_id' => 'nullable|integer|exists:clevanoo_jobs,id',
            'position_applied_for' => 'required_without:job_id|nullable|string|max:255',
            'visa_type' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'resume' => 'required|file|mimes:pdf,doc,docx|extensions:pdf,doc,docx|max:2048',
            'message' => 'nullable|string|max:5000',
        ]);

        if (! empty($data['job_id'])) {
            $data['position_applied_for'] = Job::findOrFail($data['job_id'])->jobtitle;
        }
        unset($data['job_id'], $data['resume']);

        $path = null;
        try {
            $path = $request->file('resume')->store('resumes', 'public');
            if (! $path) {
                throw new RuntimeException('Résumé storage failed.');
            }
            $candidate = Candidate::create($data + ['resume_path' => $path]);
        } catch (Throwable $exception) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
            Log::error('Candidate application could not be saved.', ['exception_type' => $exception::class]);

            return response()->json(['error' => 'Your application could not be saved. Please try again.'], 500);
        }

        $notificationSent = true;
        try {
            $this->websiteEmailService->send('candidate_application', $data + [
                'candidate_id' => $candidate->id,
                'resume_url' => $this->resumeDownloadUrl(basename($path)),
            ]);
        } catch (Throwable $exception) {
            $notificationSent = false;
            Log::error('Candidate notification failed.', ['candidate_id' => $candidate->id, 'exception_type' => $exception::class]);
        }

        return response()->json([
            'message' => 'Your application has been saved.',
            'notification_sent' => $notificationSent,
        ], 201);
    }

    public function downloadResume(Request $request, string $filename)
    {
        abort_unless($filename === basename($filename), 404);
        $path = 'resumes/'.$filename;
        $public = Storage::disk('public');
        if ($public->exists($path)) {
            return $public->download($path, headers: ['Cache-Control' => 'private, no-store']);
        }
        $private = Storage::disk('local');
        if ($private->exists($path)) {
            abort_unless($request->hasValidSignature(), 403);

            return $private->download($path, headers: ['Cache-Control' => 'private, no-store']);
        }

        abort(404);
    }

    private function resumeDownloadUrl(string $filename): string
    {
        $base = config('services.website_mail.resume_base_url');

        return $base ? rtrim($base, '/').'/'.rawurlencode($filename) : URL::route('candidate.resume', ['filename' => $filename]);
    }
}
