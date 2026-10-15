<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('client')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->unsignedTinyInteger('month')->nullable();
            $table->string('tagline')->nullable();
            $table->string('discipline')->nullable();
            $table->string('accent')->default('blush');
            $table->text('description')->nullable();
            $table->boolean('featured')->default(false);
            $table->string('timeline')->nullable();
            $table->string('sticker')->nullable();
            $table->json('cover')->nullable();
            $table->string('cover_bg')->nullable();
            $table->json('services')->nullable();
            $table->json('categories')->nullable();
            $table->json('intro')->nullable();
            $table->json('brand')->nullable();
            $table->json('results')->nullable();
            $table->json('quote')->nullable();
            $table->json('story')->nullable();
            $table->json('gallery')->nullable();
            $table->string('gallery_heading')->nullable();
            $table->json('delivered')->nullable();
            $table->json('phases')->nullable();
            $table->json('team')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('og_image')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
