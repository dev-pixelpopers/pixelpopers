<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Pages built in the CMS (Pages → New page). A custom page is a list of
 * sections copied from other pages; each section remembers which kind it is
 * (`type`, e.g. "about:values") so the website renders it with that section's
 * own design. The site's built-in pages are unaffected (type stays empty).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->boolean('is_custom')->default(false)->after('slug');
        });
        Schema::table('page_sections', function (Blueprint $table) {
            $table->string('type', 100)->nullable()->after('key');
        });
    }

    public function down(): void
    {
        Schema::table('page_sections', function (Blueprint $table) {
            $table->dropColumn('type');
        });
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('is_custom');
        });
    }
};
