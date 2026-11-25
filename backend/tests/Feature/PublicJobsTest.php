<?php

namespace Tests\Feature;

use App\Models\Candidate;
use App\Models\Job;
use App\Support\PublicJobs;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicJobsTest extends TestCase
{
    use RefreshDatabase;

    public function test_dry_run_and_publish_keep_the_latest_48_and_preserve_records(): void
    {
        $old = $this->job('AI Consultant', now()->subYear());
        $this->assertSame(1, $old->id);
        $historical = Candidate::create([
            'first_name' => 'Test', 'last_name' => 'Candidate', 'email' => 'old@example.test',
            'phone' => '5550101000', 'position_applied_for' => $old->jobtitle, 'resume_path' => 'resumes/old.pdf',
        ]);
        $tied = now()->subDay();
        for ($i = 0; $i < 48; $i++) {
            $this->job('Technology Engineer '.$i, $tied);
        }
        $future = $this->job('Future role', now()->addDay());
        foreach (['draft', 'closed', 'withdrawn', 'unpublished'] as $status) {
            $this->job($status, now(), $status);
        }

        $this->artisan('jobs:rebalance-public')->expectsOutputToContain('"becoming_inactive": 2')->assertSuccessful();
        $this->assertSame('published', $old->fresh()->public_status);
        $this->getJson('/api/all-jobs?per_page=100')->assertOk()->assertJsonPath('total', 48)
            ->assertJsonPath('last_page', 8)->assertJsonCount(6, 'data')->assertJsonPath('data.0.id', 49);
        $this->getJson('/api/all-jobs?page=8')->assertJsonCount(6, 'data')->assertJsonPath('data.5.id', 2);
        $this->getJson('/api/all-jobs?page=99')->assertJsonCount(0, 'data');
        $this->getJson('/api/all-jobs?search=AI%20Consultant')->assertJsonPath('total', 0);
        $this->getJson('/api/jobs/1')->assertNotFound();

        $this->artisan('jobs:rebalance-public', ['--apply' => true])->assertSuccessful();
        $this->assertSame('limited', $old->fresh()->public_status);
        $this->assertSame('limited', $future->fresh()->public_status);
        $id = $this->postJson('/api/create-job', $this->fields('Newest Technology Engineer'))->assertCreated()->json('data.id');
        $this->assertSame('limited', Job::findOrFail(2)->public_status);
        $this->assertSame(48, Job::where('public_status', 'published')->count());
        $this->assertSame(48, PublicJobs::active()->count());
        $this->assertSame($id, PublicJobs::active()->first()->id);
        $this->assertNull($historical->fresh()->job_id);
        $this->assertSame('AI Consultant', $historical->fresh()->position_applied_for);

        $this->deleteJson('/api/jobs/'.$id)->assertOk();
        $this->assertSame('closed', Job::findOrFail($id)->public_status);
        $this->assertSame('published', Job::findOrFail(2)->public_status);
        $this->artisan('jobs:rebalance-public')->expectsOutputToContain('"becoming_inactive": 0')->assertSuccessful();
    }

    public function test_category_search_sitemap_and_applications_share_public_visibility(): void
    {
        Storage::fake('public');
        config(['services.website_mail.to' => 'inbox@example.test', 'mail.default' => 'array',
            'mail.from' => ['address' => 'website@example.test', 'name' => 'Clevanoo test']]);
        $analyst = $this->job('Sr. Business Systems Analyst', now()->subDay());
        $analyst->update(['description' => 'Healthcare experience required.']);
        $mainframe = $this->job('Mainframe Developer', now()->subDay());
        $mainframe->update(['description' => 'Experience with healthcare claims required.']);
        $ot = $this->job('Senior IT Business Systems Analyst (OT Cybersecurity)', now()->subDay());
        $thin = $this->job('UKG Consultant', now()->subDay());
        $thin->update(['description' => '.']);
        $closed = $this->job('Physical Therapist Assistant', now()->subDay(), 'closed');
        $this->getJson('/api/all-jobs?category=healthcare')->assertJsonPath('total', 2)->assertJsonCount(2, 'data');
        $this->getJson('/api/all-jobs?category=healthcare&search=claims')->assertJsonPath('total', 1)
            ->assertJsonPath('data.0.id', $mainframe->id);
        $this->getJson('/api/all-jobs?category=technology')->assertJsonPath('total', 3)->assertJsonPath('last_page', 1);
        $this->getJson('/api/jobs/'.$thin->id)->assertOk();

        $xml = simplexml_load_string($this->get('/jobs-sitemap.xml')->assertOk()->getContent());
        $urls = array_map(static fn ($item): string => (string) $item->loc, iterator_to_array($xml->url, false));
        $this->assertSame(array_map(static fn (Job $job): string => 'https://clevanoo.com/job/'.$job->id, [$ot, $mainframe, $analyst]), $urls);

        $application = [
            'first_name' => 'Test', 'last_name' => 'Candidate', 'email' => 'applicant@example.test',
            'phone' => '5550101000', 'position_applied_for' => $closed->jobtitle,
            'resume' => UploadedFile::fake()->createWithContent('test.pdf', "%PDF-1.4\n%%EOF\n"),
        ];
        $this->postJson('/api/save-candidates', $application)->assertUnprocessable()->assertJsonValidationErrors('job_id');
        $this->postJson('/api/save-candidates', $application + ['job_id' => $closed->id])->assertUnprocessable()
            ->assertJsonPath('errors.job_id.0', 'This role is no longer accepting applications.');
        $this->postJson('/api/save-candidates', $application + ['job_id' => $mainframe->id])->assertCreated();
        $this->assertSame($mainframe->id, Candidate::sole()->job_id);
        $this->assertSame($mainframe->jobtitle, Candidate::sole()->position_applied_for);
    }

    private function job(string $title, \DateTimeInterface $posted, string $status = 'published'): Job
    {
        return Job::forceCreate($this->fields($title) + ['created_at' => $posted, 'public_status' => $status]);
    }

    private function fields(string $title): array
    {
        return ['jobtitle' => $title, 'city' => 'Dallas', 'state' => 'TX', 'duration' => '6 months',
            'bill_rate' => 'DOE', 'description' => 'This position requires prior experience.'];
    }
}
