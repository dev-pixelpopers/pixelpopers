<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Replacement images for the page's design ({"packaging": "https://…/x.webp"});
            // a missing key keeps the built-in image (see Service::IMAGE_SLOTS).
            $table->json('images')->nullable()->after('visibility');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('images');
        });
    }
};
