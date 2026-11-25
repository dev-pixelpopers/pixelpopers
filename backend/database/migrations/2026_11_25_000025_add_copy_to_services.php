<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Digital marketing: the words of the page's design sections
            // (hero dashboard, funnel, social, results, SEO, story ads).
            // Empty keys keep the design's wording on the website.
            $table->json('copy')->nullable()->after('engine');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('copy');
        });
    }
};
