<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    // Get all jobs
    public function index(Request $request)
    {
        $query = Job::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('jobtitle', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhere('duration', 'like', "%{$search}%")
                    ->orWhere('bill_rate', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }
        $query->orderBy('created_at', 'desc');
        $perPage = $request->get('per_page', 10);
        $jobs = $query->paginate($perPage);

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
            'description' => 'nullable|string',
        ]);

        $job = Job::create($validated);

        // return response()->json($job, 201);
        return response()->json([
            'status'  => 'success',
            'message' => 'Job successfully created.',
            'data'    => $job
        ], 201);
    }


    // Show a specific job
    public function show(Job $job)
    {
        return response()->json($job, 200);
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
            'description' => 'nullable|string',
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
