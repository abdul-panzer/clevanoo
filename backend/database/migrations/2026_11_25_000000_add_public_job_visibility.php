<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clevanoo_jobs', function (Blueprint $table) {
            $table->string('public_status', 20)->default('published');
            $table->index(['public_status', 'created_at', 'id'], 'jobs_public_rank');
        });
        Schema::table('candidates', function (Blueprint $table) {
            $table->unsignedBigInteger('job_id')->nullable()->index();
        });
        Schema::create('public_job_locks', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary();
        });
        DB::table('public_job_locks')->insert(['id' => 1]);
    }

    public function down(): void
    {
        Schema::dropIfExists('public_job_locks');
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropIndex(['job_id']);
            $table->dropColumn('job_id');
        });
        Schema::table('clevanoo_jobs', function (Blueprint $table) {
            $table->dropIndex('jobs_public_rank');
            $table->dropColumn('public_status');
        });
    }
};
