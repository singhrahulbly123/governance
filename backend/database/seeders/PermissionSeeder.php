<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ([
            ['name' => 'Manage roles', 'slug' => 'administration.roles.manage', 'module' => 'administration'],
            ['name' => 'Manage permissions', 'slug' => 'administration.permissions.manage', 'module' => 'administration'],
            ['name' => 'View departments', 'slug' => 'academic.departments.view', 'module' => 'academic'],
            ['name' => 'Manage departments', 'slug' => 'academic.departments.manage', 'module' => 'academic'],
            ['name' => 'View academic years', 'slug' => 'academic.years.view', 'module' => 'academic'],
            ['name' => 'Manage academic years', 'slug' => 'academic.years.manage', 'module' => 'academic'],
            ['name' => 'View programs', 'slug' => 'academic.programs.view', 'module' => 'academic'],
            ['name' => 'Manage programs', 'slug' => 'academic.programs.manage', 'module' => 'academic'],
        ] as $permission) {
            Permission::query()->updateOrCreate(
                ['slug' => $permission['slug']],
                $permission,
            );
        }
    }
}
