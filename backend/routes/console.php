<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Support\PublicJobs;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('jobs:rebalance-public {--apply : Persist public visibility changes}', function () {
    $apply = (bool) $this->option('apply');
    $this->line($apply ? 'Applied public job ranking.' : 'Dry run. No public job statuses were changed.');
    $this->line(json_encode(PublicJobs::rebalance($apply), JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
})->purpose('Preview or apply the 48-job public publishing limit');
