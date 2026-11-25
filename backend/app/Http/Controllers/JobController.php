<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Support\JobListing;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class JobController extends Controller
{
    // Get all jobs
    public function index(Request $request)
    {
        $query = Job::query();

        $filters = $request->validate([
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
            'category' => ['nullable', Rule::in(array_keys(JobListing::CATEGORY_PATTERNS))],
        ]);
        if (($search = $filters['search'] ?? '') !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('jobtitle', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhere('duration', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }
        if ($category = $filters['category'] ?? null) {
            $pattern = JobListing::CATEGORY_PATTERNS[$category];
            $matching = (clone $query)->select(['id', 'jobtitle'])->lazyById()
                ->filter(static fn (Job $job): bool => preg_match($pattern, $job->jobtitle) === 1)
                ->pluck('id')->all();
            $query->whereIntegerInRaw('id', $matching);
        }
        $query->orderByDesc('created_at')->orderByDesc('id');
        $perPage = $filters['per_page'] ?? 10;
        $jobs = $query->paginate($perPage)->through(static fn (Job $job): array => $job->toArray() + [
            'facts' => JobListing::facts($job),
        ]);

        return response()->json($jobs, 200);
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

        $job = Job::create($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Job successfully created.',
            'data'    => $job
        ], 201);
    }


    // Show a specific job
    public function show(Job $job)
    {
        return response()->json($job->toArray() + [
            'facts' => JobListing::facts($job),
            'sections' => JobListing::sections($job),
        ]);
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

        $job->update($validated);

        return response()->json($job, 200);
    }

    // Delete a job
    public function destroy($id)
    {
        $job = Job::find($id);
        if (!$job) {
            return response()->json(['error' => 'Job not found.'], 404);
        }

        $job->delete();

        return response()->json(['message' => 'Job deleted successfully.'], 200);
    }
}
