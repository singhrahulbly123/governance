<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Permission;
use App\Models\Program;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseFoundationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_role_can_be_assigned_to_a_user_with_permissions(): void
    {
        $user = User::factory()->create();
        $role = Role::factory()->create();
        $permission = Permission::factory()->create();

        $role->permissions()->attach($permission);
        $user->roles()->attach($role);

        $this->assertTrue($user->roles()->whereKey($role)->exists());
        $this->assertTrue($role->permissions()->whereKey($permission)->exists());
    }

    public function test_a_program_belongs_to_a_department(): void
    {
        $program = Program::factory()->create();

        $this->assertInstanceOf(Department::class, $program->department);
    }

    public function test_master_data_seeders_create_foundational_records(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseCount('roles', 3);
        $this->assertDatabaseCount('permissions', 8);
        $this->assertDatabaseCount('departments', 3);
        $this->assertDatabaseCount('academic_years', 1);
        $this->assertDatabaseCount('programs', 0);
    }
}
