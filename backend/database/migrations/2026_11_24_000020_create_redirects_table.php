<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Redirects the website applies before anything else (SEO → Redirects):
 * old or never-existing URLs that search engines have indexed are sent
 * somewhere useful (301/302) or reported as gone for good (410).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('redirects', function (Blueprint $table) {
            $table->id();
            // Normalised path, e.g. "/old-page" or "/old-blog/*" (everything under it).
            $table->string('from_path', 500)->unique();
            // A path on the site ("/services") or a full URL; empty for 410.
            $table->string('to_url', 1000)->nullable();
            $table->unsignedSmallInteger('status_code')->default(301);
            $table->boolean('is_active')->default(true);
            $table->string('notes', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('redirects');
    }
};
