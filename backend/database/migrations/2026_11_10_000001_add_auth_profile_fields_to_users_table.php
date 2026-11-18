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
        Schema::table('users', function (Blueprint $table): void {
            $table->string('phone', 32)->nullable()->after('email');
            $table->string('department')->default('Computer Science')->after('phone');
            $table->boolean('mfa_enabled')->default(false)->after('password');
            $table->boolean('is_active')->default(true)->after('mfa_enabled');
            $table->timestamp('onboarded_at')->nullable()->after('email_verified_at');
        });

        Schema::create('auth_otp_codes', function (Blueprint $table): void {
            $table->id();
            $table->string('email')->index();
            $table->string('purpose', 32)->default('password_reset');
            $table->string('code', 6);
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('expires_at');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auth_otp_codes');

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['phone', 'department', 'mfa_enabled', 'is_active', 'onboarded_at']);
        });
    }
};
