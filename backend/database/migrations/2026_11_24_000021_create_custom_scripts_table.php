<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Code snippets (tracking tags, chat widgets, verification meta tags,
 * structured data) added to the website from the CMS (SEO → Scripts):
 * on every page or on one page, in the <head> or at the end of the <body>.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_scripts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // "*" = every page, otherwise one page's path ("/", "/about", "/work/fifth-sip").
            $table->string('target', 500)->default('*');
            $table->string('location', 10)->default('head'); // head | body
            $table->longText('code');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_scripts');
    }
};
