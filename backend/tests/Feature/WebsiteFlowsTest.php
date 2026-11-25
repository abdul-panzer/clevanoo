<?php

namespace Tests\Feature;

use App\Models\Candidate;
use App\Models\Job;
use App\Support\JobListing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class WebsiteFlowsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.website_mail.to' => 'inbox@example.test',
            'mail.from' => ['address' => 'website@example.test', 'name' => 'Clevanoo test'],
            'mail.default' => 'array',
        ]);
        if ($port = getenv('CLEVANOO_TEST_SMTP_PORT')) {
            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp' => [
                    'transport' => 'smtp', 'scheme' => 'smtp', 'host' => '127.0.0.1',
                    'port' => (int) $port, 'timeout' => 3,
                ],
            ]);
        }
    }

    public function test_job_upload_api_can_publish_edit_and_remove_a_job(): void
    {
        $data = [
            'jobtitle' => 'Isolated QA Engineer', 'city' => 'Remote', 'state' => 'Remote',
            'duration' => '6 months', 'bill_rate' => 'DOE', 'description' => 'Test opening.',
        ];
        $this->postJson('/api/create-job', $data)->assertCreated();
        $job = Job::sole();
        $this->getJson('/api/all-jobs?search=isolated&per_page=6')->assertOk()->assertJsonPath('data.0.id', $job->id);
        $this->getJson('/api/jobs/'.$job->id)->assertOk()->assertJsonPath('description', 'Test opening.');
        $this->getJson('/api/all-jobs?per_page=0')->assertUnprocessable();
        $this->putJson('/api/update-job/'.$job->id, ['description' => 'Updated.'])->assertOk();
        $this->getJson('/api/jobs/'.$job->id)->assertJsonPath('description', 'Updated.');
        $this->deleteJson('/api/delete-job/'.$job->id)->assertOk();
        $this->getJson('/api/jobs/'.$job->id)->assertNotFound();
    }

    public function test_public_job_categories_work_with_search_and_keep_internal_rates_private(): void
    {
        $titles = [
            'accounting-finance' => 'Senior Accountant',
            'technology' => 'Snowflake Architect',
            'telecommunications' => 'Fiber Splicer',
            'healthcare' => 'Physical Therapist Assistant',
        ];
        $ids = [];
        foreach ($titles as $category => $title) {
            $ids[$category] = Job::create([
                'jobtitle' => $title, 'city' => 'Remote', 'state' => 'Remote', 'duration' => 'Contract',
                'bill_rate' => 'Internal confidential rate',
                'description' => "Responsibilities: Review requests.\nRequirements: Prior experience.",
            ])->id;
        }
        foreach ($titles as $category => $title) {
            $this->getJson('/api/all-jobs?per_page=1&'.http_build_query(['category' => $category, 'search' => 'experience']))
                ->assertOk()->assertJsonPath('total', 1)->assertJsonPath('data.0.jobtitle', $title)
                ->assertJsonPath('data.0.facts.Location', 'Remote')->assertJsonMissingPath('data.0.bill_rate');
        }
        $this->getJson('/api/all-jobs?category=technology&search=Fiber')->assertJsonPath('total', 0);
        $this->getJson('/api/all-jobs?search=Internal%20confidential%20rate')->assertJsonPath('total', 0);
        $this->getJson('/api/all-jobs?category=made-up')->assertUnprocessable();
        $this->getJson('/api/jobs/'.$ids['technology'])->assertOk()
            ->assertJsonPath('sections.Responsibilities', 'Review requests.')
            ->assertJsonPath('sections.Requirements', 'Prior experience.')
            ->assertJsonMissingPath('bill_rate');
        $this->putJson('/api/update-job/'.$ids['technology'], ['description' => 'Updated technology role.'])->assertOk();
        $this->getJson('/api/jobs/'.$ids['healthcare'])->assertJsonPath('sections.Requirements', 'Prior experience.');
    }

    public function test_snowflake_description_is_structured_without_assigning_unverified_terms(): void
    {
        $job = new Job([
            'jobtitle' => 'Snowflake Architect', 'city' => 'Remote', 'state' => 'Remote',
            'duration' => '6 Months', 'bill_rate' => 'DOE',
            'description' => "W2 Only\n\nDeveloping in Snowflake/AWS\nLand all data in AWS\nSnowflake native tools (snow pipe)\nIDMC",
        ]);
        $this->assertSame(['Location' => 'Remote', 'Duration' => '6 Months'], JobListing::facts($job));
        $this->assertSame([
            'Work arrangement' => 'W2 Only',
            'Responsibilities' => "Developing in Snowflake/AWS\nLand all data in AWS",
            'Tools and technologies' => "Snowflake native tools (snow pipe)\nIDMC",
        ], JobListing::sections($job));
    }

    public function test_contact_and_unsubscribe_use_the_mail_transport(): void
    {
        $contact = [
            'type' => 'contact', 'name' => 'Contact QA', 'email' => 'sender@example.test', 'message' => 'SMTP integration test.',
        ];
        $this->postJson('/api/website-email', $contact)->assertOk();
        $this->postJson('/api/website-email', $contact)->assertOk();
        $this->postJson('/api/website-email', [
            'type' => 'unsubscribe', 'email' => 'opt-out@example.test',
        ])->assertOk()->assertJsonPath('message', 'We received your unsubscribe request.');
        if (! getenv('CLEVANOO_TEST_SMTP_PORT')) {
            $notifications = Mail::getSymfonyTransport()->messages();
            $this->assertCount(2, $notifications);
            $this->assertSame('New unsubscribe request', $notifications[1]->getOriginalMessage()->getSubject());
            $this->assertStringContainsString('opt-out@example.test', $notifications[1]->getOriginalMessage()->getHtmlBody());
        }
        $this->postJson('/api/website-email', ['type' => 'contact'])->assertUnprocessable();
        $this->postJson('/api/website-email', ['type' => 'contact', 'email' => 'sender@example.test'])
            ->assertUnprocessable()->assertJsonValidationErrors(['name', 'message']);

        config(['mail.default' => 'unconfigured-mailer']);
        $this->postJson('/api/website-email', array_replace($contact, ['message' => 'Retry this message.']))->assertStatus(502);
    }

    public function test_website_notification_embeds_the_clevanoo_png(): void
    {
        config(['mail.default' => 'array']);
        $this->postJson('/api/website-email', [
            'type' => 'contact', 'name' => 'Logo QA', 'email' => 'sender@example.test', 'message' => 'Check the logo.',
        ])->assertOk();

        $message = Mail::getSymfonyTransport()->messages()->sole()->getOriginalMessage();
        $logo = $message->getAttachments()[0];
        $this->assertSame('image', $logo->getMediaType());
        $this->assertSame('png', $logo->getMediaSubtype());
        $this->assertSame('inline', $logo->getDisposition());
        $this->assertStringContainsString('src="cid:', $message->getHtmlBody());
        $this->assertSame(file_get_contents(resource_path('images/clevanoo-logo.png')), $logo->getBody());
    }

    public function test_application_saves_a_public_resume_and_sends_the_notification(): void
    {
        Storage::fake('local');
        Storage::fake('public');
        $data = $this->application();
        $this->postJson('/api/save-candidates', array_replace($data, ['job_id' => 999999]))->assertUnprocessable();
        $this->post('/api/save-candidates', $data, ['Accept' => 'application/json'])
            ->assertCreated()->assertJson(['notification_sent' => true])->assertJsonMissingPath('resume_path');

        $candidate = Candidate::sole();
        $this->assertSame('Test QA job', $candidate->position_applied_for);
        if (! getenv('CLEVANOO_TEST_SMTP_PORT')) {
            $mail = Mail::getSymfonyTransport()->messages()->sole()->getOriginalMessage();
            $this->assertSame('inbox@example.test', $mail->getTo()[0]->getAddress());
            $this->assertStringContainsString('Test QA job', $mail->getHtmlBody());
        }
        Storage::disk('public')->assertExists($candidate->resume_path);
        Storage::disk('local')->assertMissing($candidate->resume_path);
        $filename = basename($candidate->resume_path);
        $this->get('/api/resumes/'.$filename)->assertDownload($filename);
    }

    public function test_previously_saved_private_resume_still_requires_a_signed_link(): void
    {
        Storage::fake('local');
        Storage::fake('public');
        $filename = 'previous-application.pdf';
        Storage::disk('local')->put('resumes/'.$filename, 'test contents');
        $this->get('/api/resumes/'.$filename)->assertForbidden();
        $url = URL::temporarySignedRoute('candidate.resume', now()->addMinute(), ['filename' => $filename]);
        $this->get($url)->assertDownload($filename);
        $this->travel(2)->minutes();
        $this->get($url)->assertForbidden();
    }

    public function test_application_survives_a_notification_failure(): void
    {
        Storage::fake('public');
        config(['mail.default' => 'unconfigured-mailer']);
        $this->post('/api/save-candidates', $this->application(), ['Accept' => 'application/json'])
            ->assertCreated()->assertJson(['notification_sent' => false]);
        Storage::disk('public')->assertExists(Candidate::sole()->resume_path);
    }

    private function application(): array
    {
        $job = Job::create([
            'jobtitle' => 'Test QA job', 'city' => 'Remote', 'state' => 'Remote', 'duration' => 'Contract',
            'bill_rate' => 'DOE', 'description' => 'Isolated test listing.',
        ]);

        return [
            'first_name' => 'Application', 'last_name' => 'QA', 'email' => 'applicant@example.test',
            'phone' => '5550101234', 'job_id' => $job->id, 'position_applied_for' => 'Ignored client-supplied title',
            'resume' => UploadedFile::fake()->createWithContent('resume.pdf', "%PDF-1.4\n%%EOF\n"),
        ];
    }
}
