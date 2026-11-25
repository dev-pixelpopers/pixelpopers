<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Headings of the shared blocks on a service page ("Everything in
            // the box", "Packages", "Asked & answered"…). Empty keys keep the
            // website's default wording.
            $table->json('headings')->nullable()->after('copy');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('headings');
        });
    }
};
