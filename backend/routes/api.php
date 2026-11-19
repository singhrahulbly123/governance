<?php

use App\Http\Controllers\Api\V1\AcademicYearIndexController;
use App\Http\Controllers\Api\V1\ActivityTimelineController;
use App\Http\Controllers\Api\V1\AdministrationOverviewController;
use App\Http\Controllers\Api\V1\AuthenticatedSessionController;
use App\Http\Controllers\Api\V1\AuthenticatedUserController;
use App\Http\Controllers\Api\V1\CalendarEventController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DashboardSummaryController;
use App\Http\Controllers\Api\V1\DepartmentIndexController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\MfaVerificationController;
use App\Http\Controllers\Api\V1\PasswordChangeController;
use App\Http\Controllers\Api\V1\PasswordRecoveryController;
use App\Http\Controllers\Api\V1\ProfileSetupController;
use App\Http\Controllers\Api\V1\ProgramIndexController;
use App\Http\Controllers\Api\V1\SessionHeartbeatController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\UserRoleManagementController;
use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\Program;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:60,1')->group(function (): void {
    Route::get('/health', HealthController::class)->name('api.v1.health');

    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:15,1,api-login')
        ->name('api.v1.login');

    Route::post('/forgot-password', [PasswordRecoveryController::class, 'sendCode'])
        ->middleware('throttle:3,10,api-forgot-password')
        ->name('api.v1.forgot-password');

    Route::post('/verify-otp', [PasswordRecoveryController::class, 'verifyOtp'])
        ->middleware('throttle:10,1,api-verify-otp')
        ->name('api.v1.verify-otp');

    Route::post('/reset-password', [PasswordRecoveryController::class, 'resetPassword'])
        ->middleware('throttle:5,1,api-reset-password')
        ->name('api.v1.reset-password');

    Route::post('/mfa/challenge', [MfaVerificationController::class, 'challenge'])
        ->middleware('throttle:3,10,api-mfa-challenge')
        ->name('api.v1.mfa.challenge');

    Route::post('/mfa/verify', MfaVerificationController::class)
        ->middleware('throttle:6,1,api-mfa-verify')
        ->name('api.v1.mfa.verify');

    Route::middleware(['auth:sanctum', 'mfa.verified'])->group(function (): void {
        Route::post('/session/extend', SessionHeartbeatController::class)
            ->name('api.v1.session.extend');

        Route::get('/dashboard', [DashboardController::class, 'show'])
            ->name('api.v1.dashboard.show');

        Route::get('/dashboard/summary', DashboardSummaryController::class)
            ->name('api.v1.dashboard.summary');

        Route::get('/calendar-events', [CalendarEventController::class, 'index'])
            ->name('api.v1.calendar-events.index');
        Route::post('/calendar-events', [CalendarEventController::class, 'store'])
            ->name('api.v1.calendar-events.store');
        Route::put('/calendar-events/{calendarEventId}', [CalendarEventController::class, 'update'])
            ->name('api.v1.calendar-events.update');
        Route::delete('/calendar-events/{calendarEventId}', [CalendarEventController::class, 'destroy'])
            ->name('api.v1.calendar-events.destroy');

        Route::get('/tasks', [TaskController::class, 'index'])
            ->name('api.v1.tasks.index');
        Route::post('/tasks', [TaskController::class, 'store'])
            ->name('api.v1.tasks.store');
        Route::put('/tasks/{taskId}', [TaskController::class, 'update'])
            ->name('api.v1.tasks.update');
        Route::delete('/tasks/{taskId}', [TaskController::class, 'destroy'])
            ->name('api.v1.tasks.destroy');

        Route::get('/activity-timeline', ActivityTimelineController::class)
            ->name('api.v1.activity-timeline.index');

        Route::post('/dashboard/sync', [DashboardController::class, 'sync'])
            ->name('api.v1.dashboard.sync');

        Route::post('/dashboard/reset', [DashboardController::class, 'reset'])
            ->name('api.v1.dashboard.reset');

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
            ->name('api.v1.logout');

        Route::get('/user', AuthenticatedUserController::class)
            ->name('api.v1.user');

        Route::post('/change-password', PasswordChangeController::class)
            ->name('api.v1.change-password');

        Route::put('/profile', ProfileSetupController::class)
            ->name('api.v1.profile.update');

        Route::middleware('role:super-administrator')->group(function (): void {
            Route::get('/administration/overview', AdministrationOverviewController::class)
                ->name('api.v1.administration.overview');

            Route::get('/administration/users', [UserRoleManagementController::class, 'index'])
                ->name('api.v1.administration.users.index');

            Route::post('/administration/users', [UserRoleManagementController::class, 'storeUser'])
                ->name('api.v1.administration.users.store');

            Route::put('/administration/users/{user}', [UserRoleManagementController::class, 'updateUser'])
                ->name('api.v1.administration.users.update');

            Route::delete('/administration/users/{user}', [UserRoleManagementController::class, 'destroyUser'])
                ->name('api.v1.administration.users.destroy');

            Route::post('/administration/roles', [UserRoleManagementController::class, 'storeRole'])
                ->name('api.v1.administration.roles.store');
        });

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
