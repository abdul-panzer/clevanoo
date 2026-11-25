<?php

namespace App\Support;

use App\Models\Job;
use Closure;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

final class PublicJobs
{
    public const LIMIT = 48;
    public const PAGE_SIZE = 6;
    public const PUBLISHED = 'published';
    public const LIMITED = 'limited';
    public const CLOSED = 'closed';

    private static function ranked(array $statuses): Builder
    {
        return Job::query()->whereIn('public_status', $statuses)
            ->whereNotNull('created_at')->where('created_at', '<=', now())
            ->orderByDesc('created_at')->orderByDesc('id');
    }

    public static function active(): Builder
    {
        // Nest the limited query for MySQL, which does not support LIMIT directly in IN.
        $latest = self::ranked([self::PUBLISHED])->select('id')->limit(self::LIMIT);
        $ids = DB::query()->fromSub($latest, 'latest_jobs')->select('id');

        return Job::query()->whereIn('id', $ids)->orderByDesc('created_at')->orderByDesc('id');
    }

    public static function page(string $search, string $category, int $page, int $size = self::PAGE_SIZE): LengthAwarePaginator
    {
        $query = self::active();
        if ($search !== '') {
            $query->where(function (Builder $matches) use ($search): void {
                foreach (['jobtitle', 'city', 'state', 'duration', 'description'] as $column) {
                    $matches->orWhere($column, 'like', '%'.$search.'%');
                }
            });
        }
        if ($category !== '') {
            $ids = (clone $query)->get(['id', 'jobtitle', 'description'])
                ->filter(fn (Job $job) => JobListing::matchesCategory($job, $category))->modelKeys();
            $query->whereIntegerInRaw('id', $ids);
        }

        return $query->paginate($size, ['*'], 'page', $page);
    }

    public static function filters(array $input): array
    {
        $search = is_string($input['search'] ?? null) ? mb_substr(trim($input['search']), 0, 255) : '';
        $category = is_string($input['category'] ?? null) ? $input['category'] : '';
        $page = filter_var($input['page'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

        return ['search' => $search, 'category' => isset(JobListing::CATEGORY_PATTERNS[$category]) ? $category : '',
            'page' => min($page ?: 1, intdiv(self::LIMIT, self::PAGE_SIZE))];
    }

    public static function listingUrl(array $filters): string
    {
        $query = http_build_query(array_filter(self::filters($filters), fn ($value) => $value !== '' && $value !== 1), '', '&', PHP_QUERY_RFC3986);

        return '/jobs'.($query === '' ? '' : '?'.$query);
    }

    public static function returnUrl(mixed $from): string
    {
        if (! is_string($from) || ! preg_match('~^/jobs(?:\?[^#\r\n]*)?$~D', $from)) {
            return '/jobs';
        }
        parse_str(explode('?', $from, 2)[1] ?? '', $query);

        return self::listingUrl($query);
    }

    public static function locked(Closure $operation): mixed
    {
        return DB::transaction(function () use ($operation) {
            // A write to the singleton serializes publishers and application intake on both MySQL and SQLite.
            DB::table('public_job_locks')->where('id', 1)->update(['id' => 1]);

            return $operation();
        }, 5);
    }

    public static function rebalance(bool $apply): array
    {
        return self::locked(function () use ($apply): array {
            $eligible = self::ranked([self::PUBLISHED, self::LIMITED]);
            $active = (clone $eligible)->limit(self::LIMIT)->pluck('id')->all();
            $overflow = (clone $eligible)->whereNotIn('id', $active);
            $retiring = (clone $overflow)->where('public_status', self::PUBLISHED)->count();
            $reactivating = Job::whereIn('id', $active)->where('public_status', self::LIMITED)->count();
            $excluded = Job::query()->whereNotIn('public_status', [self::PUBLISHED, self::LIMITED])
                ->selectRaw('public_status, count(*) as total')->groupBy('public_status')->pluck('total', 'public_status')->all();
            $missing = Job::whereIn('public_status', [self::PUBLISHED, self::LIMITED])->whereNull('created_at')->orderBy('id')->pluck('id')->all();
            $future = Job::whereIn('public_status', [self::PUBLISHED, self::LIMITED])->where('created_at', '>', now())->orderBy('id')->pluck('id')->all();
            $dateExceptions = Job::whereIntegerInRaw('id', [...$missing, ...$future])->where('public_status', self::PUBLISHED);
            $dateRetirements = (clone $dateExceptions)->count();

            if ($apply) {
                $overflow->reorder()->where('public_status', self::PUBLISHED)->toBase()->update(['public_status' => self::LIMITED]);
                Job::whereIn('id', $active)->where('public_status', self::LIMITED)->toBase()->update(['public_status' => self::PUBLISHED]);
                $dateExceptions->toBase()->update(['public_status' => self::LIMITED]);
            }

            return ['active_ids' => $active, 'becoming_inactive' => $retiring + $dateRetirements, 'backfilled' => $reactivating,
                'excluded_status_counts' => $excluded, 'missing_posting_date_ids' => $missing, 'future_posting_date_ids' => $future,
                'date_exceptions_becoming_inactive' => $dateRetirements];
        });
    }
}
