<?php

use App\Http\Controllers\Api\V1\AcademicYearIndexController;
use App\Http\Controllers\Api\V1\AuthenticatedSessionController;
use App\Http\Controllers\Api\V1\AuthenticatedUserController;
use App\Http\Controllers\Api\V1\DepartmentIndexController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\ProgramIndexController;
use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\Program;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:60,1')->group(function (): void {
    Route::get('/health', HealthController::class)->name('api.v1.health');

    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('api.v1.login');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('api.v1.logout');

        Route::get('/user', AuthenticatedUserController::class)
            ->name('api.v1.user');

        Route::get('/departments', DepartmentIndexController::class)
            ->middleware('can:viewAny,'.Department::class)
            ->name('api.v1.departments.index');

        Route::get('/programs', ProgramIndexController::class)
            ->middleware('can:viewAny,'.Program::class)
            ->name('api.v1.programs.index');

        Route::get('/academic-years', AcademicYearIndexController::class)
            ->middleware('can:viewAny,'.AcademicYear::class)
            ->name('api.v1.academic-years.index');
    });
});
