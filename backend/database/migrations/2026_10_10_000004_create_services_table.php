<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('accent')->default('blush');
            $table->json('hero_lines')->nullable();
            $table->text('hero_intro')->nullable();
            $table->string('hero_cta')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->json('overview')->nullable();
            $table->json('included')->nullable();
            $table->json('process')->nullable();
            $table->json('audience')->nullable();
            $table->json('insights')->nullable();
            $table->json('why_us')->nullable();
            $table->json('tools')->nullable();
            $table->json('stats')->nullable();
            $table->json('packages')->nullable();
            $table->json('faqs')->nullable();
            $table->string('cta_heading')->nullable();
            $table->string('cta_button')->nullable();
            // The home page's giant-letter tile: letter, fill, label/dot points, hover media.
            $table->json('tile')->nullable();
            $table->string('og_image')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
