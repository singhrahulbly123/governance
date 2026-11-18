<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allPermissionIds = Permission::query()->pluck('id');
        $academicViewIds = Permission::query()
            ->where('slug', 'like', 'academic.%view')
            ->pluck('id');
        $academicAllIds = Permission::query()
            ->where('slug', 'like', 'academic.%')
            ->pluck('id');

        $roles = [
            'super-administrator' => [
                'name' => 'Super Administrator',
                'description' => 'Full platform control, user & role management, and access to all 8 role dashboards.',
                'permissions' => $allPermissionIds,
            ],
            'administrator' => [
                'name' => 'Administrator',
                'description' => 'Manages academic master data, user role assignments, and operational dashboards.',
                'permissions' => $academicAllIds,
            ],
            'faculty' => [
                'name' => 'DASH-001 · Faculty',
                'description' => 'Faculty dashboard: daily sessions, syllabus coverage, lesson plans, and KRA progress.',
                'permissions' => $academicViewIds,
            ],
            'visiting' => [
                'name' => 'DASH-002 · Visiting Faculty',
                'description' => 'Visiting Faculty dashboard: session confirmations, workshop schedules, and co-taught courses.',
                'permissions' => $academicViewIds,
            ],
            'program' => [
                'name' => 'DASH-003 · Program Leader',
                'description' => 'Program Leader dashboard: program coverage, faculty workload, unassigned subjects, and audit compilation.',
                'permissions' => $academicViewIds,
            ],
            'hod' => [
                'name' => 'DASH-004 · HoD — Command Center',
                'description' => 'Head of Department Command Center: department RAG distribution, workload balance, and approvals.',
                'permissions' => $academicAllIds,
            ],
            'dean' => [
                'name' => 'DASH-005 · Dean',
                'description' => 'Dean dashboard: cross-department RAG roll-up, RED escalations, and quarterly goals.',
                'permissions' => $academicAllIds,
            ],
            'academic' => [
                'name' => 'DASH-006 · Academic Head',
                'description' => 'Academic Head dashboard: institution quality index, faculty performance bands, and accreditation readiness.',
                'permissions' => $academicAllIds,
            ],
            'management' => [
                'name' => 'DASH-007 · Management',
                'description' => 'Management dashboard: cross-department comparison, audit scores, and industry engagement.',
                'permissions' => $academicAllIds,
            ],
            'director' => [
                'name' => 'DASH-008 · Director',
                'description' => 'Director dashboard: executive institutional scorecard, escalation trend, and top-level KPIs.',
                'permissions' => $allPermissionIds,
            ],
            'department-head' => [
                'name' => 'Department Head',
                'description' => 'Views academic master data for departmental governance.',
                'permissions' => $academicViewIds,
            ],
        ];

        foreach ($roles as $slug => $attributes) {
            $role = Role::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $attributes['name'],
                    'description' => $attributes['description'],
                ],
            );

            $role->permissions()->sync($attributes['permissions']);
        }
    }
}
