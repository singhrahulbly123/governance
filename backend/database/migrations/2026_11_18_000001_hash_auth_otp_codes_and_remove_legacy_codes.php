<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('auth_otp_codes')->delete();

        Schema::table('auth_otp_codes', function (Blueprint $table): void {
            $table->string('code', 255)->change();
        });
    }

    public function down(): void
    {
        DB::table('auth_otp_codes')->delete();

        Schema::table('auth_otp_codes', function (Blueprint $table): void {
            $table->string('code', 6)->change();
        });
    }
};
