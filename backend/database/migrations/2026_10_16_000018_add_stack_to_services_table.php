<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Web development: "The stack" heading, intro and keycaps
            // ({"heading": …, "keys": [{"label": "Next.js", "tone": "white", "icon": …}]}).
            $table->json('stack')->nullable()->after('social');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('stack');
        });
    }
};
