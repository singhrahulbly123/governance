<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\InitialAdministratorSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AuthenticationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_sign_in_and_sign_out_through_the_api(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@example.test',
            'password' => 'secret-password',
        ]);

        $this->withHeader('Origin', 'http://localhost:3000')->postJson('/api/v1/login', [
            'email' => $user->email,
            'password' => 'secret-password',
        ])->assertOk()
            ->assertJsonPath('data.email', $user->email);

        $this->assertAuthenticatedAs($user);

        $this->withHeader('Origin', 'http://localhost:3000')
            ->postJson('/api/v1/logout')
            ->assertNoContent();

        app('auth')->forgetGuards();

        $this->withHeader('Origin', 'http://localhost:3000')
            ->getJson('/api/v1/user')
            ->assertUnauthorized();
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create([
            'email' => 'admin@example.test',
            'password' => 'secret-password',
        ]);

        $this->withHeader('Origin', 'http://localhost:3000')->postJson('/api/v1/login', [
            'email' => 'admin@example.test',
            'password' => 'incorrect-password',
        ])
            ->assertUnprocessable()
            ->assertJsonPath('errors.email.0', 'The provided credentials do not match our records.');

        $this->assertGuest();
    }

    public function test_authenticated_user_receives_current_user_api_response(): void
    {
        $permission = Permission::factory()->create(['slug' => 'academic.departments.view']);
        $role = Role::factory()->create(['slug' => 'department-head']);
        $role->permissions()->attach($permission);
        $user = User::factory()->create();
        $user->roles()->attach($role);

        $this->actingAs($user)
            ->getJson('/api/v1/user')
            ->assertOk()
            ->assertJsonPath('data.email', $user->email)
            ->assertJsonPath('data.roles.0.slug', 'department-head')
            ->assertJsonPath('data.permissions.0.slug', 'academic.departments.view');
    }

    public function test_roles_and_permissions_drive_policy_authorization(): void
    {
        $permission = Permission::factory()->create(['slug' => 'academic.departments.view']);
        $role = Role::factory()->create(['slug' => 'department-head']);
        $role->permissions()->attach($permission);
        $user = User::factory()->create();
        $user->roles()->attach($role);

        $this->assertTrue($user->can('viewAny', Department::class));
    }

    public function test_super_administrators_can_view_administration_overview(): void
    {
        $superAdministrator = Role::factory()->create(['slug' => 'super-administrator']);
        $administrator = Role::factory()->create(['slug' => 'administrator']);
        $superAdministratorUser = User::factory()->create();
        $administratorUser = User::factory()->create();

        $superAdministratorUser->roles()->attach($superAdministrator);
        $administratorUser->roles()->attach($administrator);

        $this->actingAs($superAdministratorUser)
            ->getJson('/api/v1/administration/overview')
            ->assertOk()
            ->assertJsonPath('data.administrators', 1)
            ->assertJsonPath('data.super_administrators', 1)
            ->assertJsonPath('data.total_users', 2);

        $this->actingAs($administratorUser)
            ->getJson('/api/v1/administration/overview')
            ->assertForbidden();
    }

    public function test_initial_administrator_is_seeded_from_environment_configuration(): void
    {
        $superAdministrator = Role::factory()->create(['slug' => 'super-administrator']);
        Config::set('app.initial_super_administrator', [
            'name' => 'Platform Administrator',
            'email' => 'administrator@example.test',
            'password' => 'seeded-password',
        ]);

        $this->seed(InitialAdministratorSeeder::class);

        $administrator = User::query()->where('email', 'administrator@example.test')->firstOrFail();

        $this->assertTrue(Hash::check('seeded-password', $administrator->password));
        $this->assertTrue($administrator->roles()->whereKey($superAdministrator)->exists());
    }

    public function test_permission_middleware_rejects_users_without_the_required_permission(): void
    {
        $user = User::factory()->create();

        Route::get('/permission-check', fn () => response()->noContent())
            ->middleware(['auth', 'permission:academic.departments.view']);

        $this->actingAs($user)
            ->get('/permission-check')
            ->assertForbidden();
    }

    public function test_role_middleware_rejects_users_without_the_required_role(): void
    {
        $user = User::factory()->create();

        Route::get('/role-check', fn () => response()->noContent())
            ->middleware(['auth', 'role:super-administrator']);

        $this->actingAs($user)
            ->get('/role-check')
            ->assertForbidden();
    }
}
