<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ([
            ['code' => 'ACA', 'name' => 'Academic Affairs'],
            ['code' => 'EXM', 'name' => 'Examinations'],
            ['code' => 'QAC', 'name' => 'Quality Assurance'],
        ] as $department) {
            Department::query()->updateOrCreate(
                ['code' => $department['code']],
                [...$department, 'is_active' => true],
            );
        }
    }
}
