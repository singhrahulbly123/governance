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

        $roles = [
            'super-administrator' => [
                'name' => 'Super Administrator',
                'description' => 'Manages platform-wide configuration and access.',
                'permissions' => $allPermissionIds,
            ],
            'administrator' => [
                'name' => 'Administrator',
                'description' => 'Manages academic master data and operational access.',
                'permissions' => Permission::query()
                    ->where('slug', 'like', 'academic.%')
                    ->pluck('id'),
            ],
            'department-head' => [
                'name' => 'Department Head',
                'description' => 'Views academic master data for departmental governance.',
                'permissions' => Permission::query()
                    ->where('slug', 'like', 'academic.%view')
                    ->pluck('id'),
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
