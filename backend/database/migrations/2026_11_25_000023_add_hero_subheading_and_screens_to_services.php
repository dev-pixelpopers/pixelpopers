<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Optional <h2> under the hero headline on every service page.
            $table->string('hero_subheading', 255)->nullable()->after('hero_lines');
            // Web development: the "One site. Every screen." section
            // ({"eyebrow": …, "heading": …, "text": …}).
            $table->json('screens')->nullable()->after('stack');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['hero_subheading', 'screens']);
        });
    }
};
