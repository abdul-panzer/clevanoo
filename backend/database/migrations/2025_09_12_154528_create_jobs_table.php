<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clevanoo_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('jobtitle');
            $table->string('city');
            $table->string('state');
            $table->string('duration');
            $table->string('bill_rate');
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clevanoo_jobs');
    }
};
