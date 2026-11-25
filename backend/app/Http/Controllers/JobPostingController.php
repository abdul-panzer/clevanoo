<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Support\JobListing;
use App\Support\PublicJobs;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class JobPostingController extends Controller
{
    private const ORIGIN = 'https://clevanoo.com';

    private const US_STATES = [
        'AL' => 'ALABAMA', 'AK' => 'ALASKA', 'AZ' => 'ARIZONA', 'AR' => 'ARKANSAS',
        'CA' => 'CALIFORNIA', 'CO' => 'COLORADO', 'CT' => 'CONNECTICUT', 'DE' => 'DELAWARE',
        'DC' => 'DISTRICT OF COLUMBIA', 'FL' => 'FLORIDA', 'GA' => 'GEORGIA', 'HI' => 'HAWAII',
        'ID' => 'IDAHO', 'IL' => 'ILLINOIS', 'IN' => 'INDIANA', 'IA' => 'IOWA',
        'KS' => 'KANSAS', 'KY' => 'KENTUCKY', 'LA' => 'LOUISIANA', 'ME' => 'MAINE',
        'MD' => 'MARYLAND', 'MA' => 'MASSACHUSETTS', 'MI' => 'MICHIGAN', 'MN' => 'MINNESOTA',
        'MS' => 'MISSISSIPPI', 'MO' => 'MISSOURI', 'MT' => 'MONTANA', 'NE' => 'NEBRASKA',
        'NV' => 'NEVADA', 'NH' => 'NEW HAMPSHIRE', 'NJ' => 'NEW JERSEY', 'NM' => 'NEW MEXICO',
        'NY' => 'NEW YORK', 'NC' => 'NORTH CAROLINA', 'ND' => 'NORTH DAKOTA', 'OH' => 'OHIO',
        'OK' => 'OKLAHOMA', 'OR' => 'OREGON', 'PA' => 'PENNSYLVANIA', 'RI' => 'RHODE ISLAND',
        'SC' => 'SOUTH CAROLINA', 'SD' => 'SOUTH DAKOTA', 'TN' => 'TENNESSEE', 'TX' => 'TEXAS',
        'UT' => 'UTAH', 'VT' => 'VERMONT', 'VA' => 'VIRGINIA', 'WA' => 'WASHINGTON',
        'WV' => 'WEST VIRGINIA', 'WI' => 'WISCONSIN', 'WY' => 'WYOMING',
    ];

    public function index(Request $request): Response
    {
        $filters = PublicJobs::filters($request->query());
        $jobs = PublicJobs::page(...$filters);
        if ($filters['page'] > $jobs->lastPage()) {
            $filters['page'] = $jobs->lastPage();
            $jobs = PublicJobs::page(...$filters);
        }

        $return = PublicJobs::listingUrl($filters);
        $cards = '';
        foreach ($jobs as $job) {
            $title = e($job->jobtitle);
            $description = e(Str::limit(trim((string) $job->description), 180, '…'));
            $facts = $this->factsHtml(JobListing::facts($job));
            $url = e('/job/'.$job->id.($return === '/jobs' ? '' : '?from='.rawurlencode($return)));
            $cards .= <<<HTML
            <article class="job-card">
              <h3>{$title}</h3><p class="job-desc">{$description}</p><dl class="job-facts">{$facts}</dl>
              <div class="job-actions">
                <a class="btn btn-outline" href="{$url}" aria-label="Read more about {$title}">Read more</a>
                <a class="btn btn-primary" href="{$url}#apply" aria-label="Apply for {$title}">Apply</a>
              </div>
            </article>
            HTML;
        }

        $pages = '';
        if ($jobs->lastPage() > 1) {
            for ($page = 1; $page <= $jobs->lastPage(); $page++) {
                $url = e(PublicJobs::listingUrl(array_replace($filters, ['page' => $page])));
                $current = $page === $filters['page'] ? ' aria-current="page"' : '';
                $pages .= '<a class="btn btn-ghost" href="'.$url.'"'.$current.'>Page '.$page.'</a>';
            }
            $pages = '<nav class="pager" id="job-server-pager" aria-label="Job listing pages">'.$pages.'</nav>';
        }
        $total = $jobs->total();
        $status = match (true) {
            $total === 1 => '1 job found',
            $total > 1 => $total.' jobs found',
            $filters['search'] !== '' || $filters['category'] !== '' => 'No jobs match these filters.',
            default => 'There are no open roles right now.',
        };
        $replacements = [
            '<!-- jobs-status -->' => $status,
            '<!-- jobs-results -->' => $cards,
            '<!-- jobs-pages -->' => $pages,
            'id="job-search" name=' => 'id="job-search" value="'.e($filters['search']).'" name=',
        ];
        if ($filters['category'] !== '') {
            $option = '<option value="'.$filters['category'].'"';
            $replacements[$option] = $option.' selected';
        }

        return response(strtr($this->template('jobs.html'), $replacements))->header('Cache-Control', 'private, no-store');
    }

    public function show(Request $request, string $id): Response
    {
        $backUrl = e(PublicJobs::returnUrl($request->query('from')));
        $job = PublicJobs::active()->whereKey($id)->first();
        if (! $job) {
            $closedPage = $this->template('404.html');

            return response(strtr($closedPage, [
                'The page may have moved or the address may be incorrect.' => 'This role is no longer accepting applications. Browse current openings for other opportunities.',
                'href="/jobs">Browse jobs' => 'href="'.$backUrl.'">Browse current openings',
            ]), 404)
                ->header('Cache-Control', 'no-store, private');
        }

        $template = $this->template('job.html');
        $headStart = strpos($template, '<!-- job-head -->');
        $headEnd = strpos($template, '<!-- /job-head -->');
        abort_if($headStart === false || $headEnd === false || $headEnd < $headStart, 503, 'Job page template is unavailable.');

        $posted = $job->created_at?->toDateString();
        $jobTitle = trim((string) $job->jobtitle);
        $title = e($jobTitle.' – Clevanoo LLC');
        $description = trim((string) $job->description);
        $summary = e(Str::limit(preg_replace('/\s+/u', ' ', $description), 155));
        $url = self::ORIGIN.'/job/'.$job->id;
        $location = $this->location($job);
        $head = <<<HTML
        <title>{$title}</title>
        <meta name="description" content="{$summary}">
        <link rel="canonical" href="{$url}">
        <meta property="og:title" content="{$title}">
        <meta property="og:description" content="{$summary}">
        <meta property="og:url" content="{$url}">
        <meta name="twitter:title" content="{$title}">
        <meta name="twitter:description" content="{$summary}">

        HTML;

        $descriptionHtml = '';
        foreach (JobListing::sections($job) as $heading => $text) {
            if ($heading !== 'Overview') {
                $descriptionHtml .= '<h3 class="h-card">'.e($heading).'</h3>';
            }
            $descriptionHtml .= '<p>'.str_replace(["\r\n", "\n", "\r"], '<br>', e($text)).'</p>';
        }

        if ($this->isEligible($job, $location)) {
            $schema = [
                '@context' => 'https://schema.org',
                '@type' => 'JobPosting',
                'url' => $url,
                'title' => $jobTitle,
                'description' => $descriptionHtml,
                'datePosted' => $posted,
                'hiringOrganization' => ['@type' => 'Organization', 'name' => 'confidential'],
                'identifier' => ['@type' => 'PropertyValue', 'name' => 'Clevanoo LLC', 'value' => (string) $job->id],
            ] + $location;
            $head .= '<script type="application/ld+json">'.json_encode($schema, JSON_HEX_TAG | JSON_THROW_ON_ERROR)."</script>\n";
        } else {
            $head .= '<meta name="robots" content="noindex">'."\n";
        }

        $facts = JobListing::facts($job) + ['Posted' => $posted];
        if (isset($location['applicantLocationRequirements'])) {
            $facts['Location'] = 'Remote (United States)';
        }
        $oldHead = substr($template, $headStart, $headEnd + strlen('<!-- /job-head -->') - $headStart);
        $html = strtr($template, [
            $oldHead => $head,
            '<!-- job-status --><p' => '<p hidden',
            '<div id="job-detail" hidden>' => '<div id="job-detail" data-job-id="'.$id.'">',
            '<!-- job-title -->' => e($jobTitle),
            '<!-- job-facts -->' => $this->factsHtml($facts),
            'id="back-to-jobs" href="/jobs"' => 'id="back-to-jobs" href="'.$backUrl.'"',
            '<!-- job-description -->' => $descriptionHtml ?: '<p>Contact Clevanoo for more information about this role.</p>',
            '<!-- job-id -->' => '<input type="hidden" name="job_id" value="'.$id.'">',
            'id="apply" method="post"' => 'id="apply" action="/backend/public/api/save-candidates" method="post"',
            'Loading job details…' => '',
        ]);

        return response($html)->header('Cache-Control', 'no-store, private');
    }

    public function sitemap(): Response
    {
        $xml = ["<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n", '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
        foreach (PublicJobs::active()->get(['id', 'jobtitle', 'description', 'city', 'state', 'created_at', 'updated_at']) as $job) {
            if (! $this->isEligible($job, $this->location($job))) {
                continue;
            }

            $xml[] = '<url><loc>'.self::ORIGIN.'/job/'.$job->id.'</loc><lastmod>'
                .($job->updated_at ?? $job->created_at)->toAtomString().'</lastmod></url>';
        }
        $xml[] = '</urlset>';

        return response(implode("\n", $xml), 200, ['Content-Type' => 'application/xml; charset=UTF-8', 'Cache-Control' => 'no-store, private']);
    }

    private function factsHtml(array $facts): string
    {
        $html = '';
        foreach (array_filter($facts) as $label => $value) {
            $html .= '<div><dt>'.e($label).'</dt><dd>'.e($value).'</dd></div>';
        }

        return $html;
    }

    private function isEligible(Job $job, array $location): bool
    {
        $title = trim((string) $job->jobtitle);
        $description = trim((string) $job->description);

        return $location !== [] && $title !== '' && preg_match('/[\pL\pN]/u', $description) && strcasecmp($title, $description) !== 0
            && $job->created_at !== null && ! $job->created_at->isFuture();
    }

    private function location(Job $job): array
    {
        $city = trim((string) $job->city);
        $state = strtoupper(trim((string) $job->state));
        if (strcasecmp($city, 'Remote') === 0 && in_array($state, ['REMOTE', 'US', 'USA', 'UNITED STATES'], true)) {
            return [
                'jobLocationType' => 'TELECOMMUTE',
                'applicantLocationRequirements' => ['@type' => 'Country', 'name' => 'United States'],
            ];
        }

        $region = isset(self::US_STATES[$state]) ? $state : array_search($state, self::US_STATES, true);
        if ($city === '' || preg_match('/^(?:remote|hybrid|on[ -]?site|n\/?a|tbd)\b/i', $city) || $region === false) {
            return [];
        }

        return ['jobLocation' => [
            '@type' => 'Place',
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => $city,
                'addressRegion' => $region,
                'addressCountry' => 'US',
            ],
        ]];
    }

    private function template(string $file): string
    {
        $path = base_path('../'.$file);
        if (! is_file($path)) {
            $path = base_path('../build/'.$file);
        }
        abort_unless(is_readable($path), 503, 'Job page template is unavailable.');

        return file_get_contents($path);
    }
}
