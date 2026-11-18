<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Department;
use App\Models\Program;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class DashboardSummaryController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $roles = Role::query()
            ->withCount([
                'users',
                'users as active_users_count' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->map(fn (Role $role): array => [
                'name' => $role->name,
                'slug' => $role->slug,
                'users' => $role->users_count,
                'active_users' => $role->active_users_count,
            ])
            ->values();

        $departments = Department::query()
            ->withCount([
                'programs',
                'programs as active_programs_count' => fn (Builder $query) => $query->where('is_active', true),
            ])
            ->orderBy('name')
            ->get()
            ->map(fn (Department $department): array => [
                'id' => $department->id,
                'code' => $department->code,
                'name' => $department->name,
                'is_active' => $department->is_active,
                'programs' => $department->programs_count,
                'active_programs' => $department->active_programs_count,
                'faculty' => User::query()
                    ->whereRaw('LOWER(TRIM(department)) = ?', [mb_strtolower(trim($department->name))])
                    ->where('is_active', true)
                    ->whereHas('roles', fn (Builder $query) => $query->whereIn('slug', ['faculty', 'visiting']))
                    ->count(),
            ])
            ->values();

        $currentAcademicYear = AcademicYear::query()
            ->where('is_current', true)
            ->orderByDesc('starts_on')
            ->first();

        $activeFacultyCount = User::query()
            ->where('is_active', true)
            ->whereHas('roles', fn (Builder $query) => $query->whereIn('slug', ['faculty', 'visiting']))
            ->count();

        $totals = [
            'users' => User::query()->count(),
            'active_users' => User::query()->where('is_active', true)->count(),
            'faculty' => $activeFacultyCount,
            'unassigned_faculty' => max(0, $activeFacultyCount - $departments->sum('faculty')),
            'departments' => Department::query()->count(),
            'active_departments' => Department::query()->where('is_active', true)->count(),
            'programs' => Program::query()->count(),
            'active_programs' => Program::query()->where('is_active', true)->count(),
            'academic_years' => AcademicYear::query()->count(),
        ];

        return response()->json([
            'data' => [
                'source' => 'postgresql',
                'generated_at' => now()->toIso8601String(),
                'totals' => $totals,
                'roles' => $roles,
                'departments' => $departments,
                'current_academic_year' => $currentAcademicYear === null ? null : [
                    'id' => $currentAcademicYear->id,
                    'name' => $currentAcademicYear->name,
                    'starts_on' => $currentAcademicYear->starts_on?->toDateString(),
                    'ends_on' => $currentAcademicYear->ends_on?->toDateString(),
                ],
                'data_availability' => [
                    'programs' => true,
                    'courses' => false,
                    'students' => false,
                    'class_sessions' => false,
                    'attendance' => false,
                    'workload' => false,
                    'lesson_plans' => false,
                    'audits' => false,
                    'approvals' => false,
                    'notifications' => false,
                ],
            ],
        ]);
    }
}
