<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Digital marketing: the "One brand. Six channels." section
            // ({"eyebrow": …, "heading": …, "text": …}).
            $table->json('engine')->nullable()->after('screens');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('engine');
        });
    }
};
