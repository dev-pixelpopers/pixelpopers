<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Enquiries now ask for a phone number (required on the contact form). */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {
            // Nullable only so enquiries received before this change stay valid.
            $table->string('phone', 40)->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->dropColumn('phone');
        });
    }
};
