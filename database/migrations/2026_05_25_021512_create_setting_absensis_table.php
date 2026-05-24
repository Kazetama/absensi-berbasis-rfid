<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('setting_absensis', function (Blueprint $table) {
            $table->id();
            $table->time('jam_masuk_mulai')->default('06:00:00');
            $table->time('jam_masuk_batas')->default('07:30:00');
            $table->time('jam_masuk_selesai')->default('08:30:00');
            $table->time('jam_pulang_mulai')->default('16:00:00');
            $table->time('jam_pulang_selesai')->default('18:00:00');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setting_absensis');
    }
};
