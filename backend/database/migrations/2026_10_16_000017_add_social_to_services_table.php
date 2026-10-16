<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // The social account on the digital marketing phone mock-ups
            // ({"handle": "pixel_popers", "bio": …}); missing keys keep the design's text.
            $table->json('social')->nullable()->after('images');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('social');
        });
    }
};
