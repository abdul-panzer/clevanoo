<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Support\JobListing;
use App\Support\PublicJobs;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class JobController extends Controller
{
    // Get all jobs
    public function index(Request $request)
    {
        $filters = $request->validate([
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
            'category' => ['nullable', Rule::in(array_keys(JobListing::CATEGORY_PATTERNS))],
        ]);
        $page = min((int) ($filters['page'] ?? 1), 9);
        $jobs = PublicJobs::page($filters['search'] ?? '', $filters['category'] ?? '', $page)
            ->through(static fn (Job $job): array => $job->toArray() + [
            'facts' => JobListing::facts($job),
        ]);

        return response()->json($jobs)->header('Cache-Control', 'private, no-store');
    }

    // Create a new job
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jobtitle'    => 'required|string|max:255',
            'city'        => 'required|string|max:255',
            'state'       => 'required|string|max:255',
            'duration'    => 'required|string|max:100',
            'bill_rate'   => 'required|string|max:100',
            'description' => 'required|string|max:15000',
        ]);

        $job = PublicJobs::locked(function () use ($validated): Job {
            $job = Job::create($validated);
            PublicJobs::rebalance(true);

            return $job->refresh();
        });

        return response()->json([
            'status'  => 'success',
            'message' => 'Job successfully created.',
            'data'    => $job
        ], 201);
    }


    // Show a specific job
    public function show(string $job)
    {
        $job = PublicJobs::active()->whereKey($job)->firstOrFail();

        return response()->json($job->toArray() + [
            'facts' => JobListing::facts($job),
            'sections' => JobListing::sections($job),
        ])->header('Cache-Control', 'private, no-store');
    }

    // Update a job
    public function update(Request $request, Job $job)
    {
        $validated = $request->validate([
            'jobtitle'    => 'sometimes|required|string|max:255',
            'city'        => 'sometimes|required|string|max:255',
            'state'       => 'sometimes|required|string|max:255',
            'duration'    => 'sometimes|required|string|max:100',
            'bill_rate'   => 'sometimes|required|string|max:100',
            'description' => 'sometimes|required|string|max:15000',
        ]);

        // Use a locked, fresh row so a concurrent close cannot be overwritten.
        $job = PublicJobs::locked(function () use ($job, $validated): Job {
            $current = Job::findOrFail($job->getKey());
            $current->update($validated);

            return $current;
        });

        return response()->json($job, 200);
    }

    // Delete a job
    public function destroy($id)
    {
        PublicJobs::locked(function () use ($id): void {
            $job = Job::findOrFail($id);
            $job->forceFill(['public_status' => PublicJobs::CLOSED])->save();
            PublicJobs::rebalance(true);
        });

        return response()->json(['message' => 'Job closed successfully.']);
    }
}
