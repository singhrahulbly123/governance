<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserRoleManagementController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->with('roles:id,name,slug,description')
            ->orderBy('id')
            ->get()
            ->map(fn (User $u) => $this->formatUser($u));

        $roles = Role::query()
            ->withCount('users')
            ->orderBy('id')
            ->get()
            ->map(fn (Role $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'description' => $r->description,
                'users_count' => $r->users_count,
            ]);

        return response()->json([
            'data' => [
                'users' => $users,
                'roles' => $roles,
            ],
        ]);
    }

    public function storeUser(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'department' => ['nullable', 'string', 'max:255'],
            'role_slugs' => ['required', 'array', 'min:1'],
            'role_slugs.*' => ['string', 'exists:roles,slug'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'department' => $validated['department'] ?? 'Academic Governance',
            'is_active' => $validated['is_active'] ?? true,
            'onboarded_at' => now(),
            'email_verified_at' => now(),
        ]);

        $roleIds = Role::query()
            ->whereIn('slug', $validated['role_slugs'])
            ->pluck('id');

        $user->roles()->sync($roleIds);
        $user->load('roles:id,name,slug,description');

        return response()->json([
            'data' => $this->formatUser($user),
        ], 201);
    }

    public function updateUser(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:6'],
            'department' => ['nullable', 'string', 'max:255'],
            'role_slugs' => ['sometimes', 'required', 'array', 'min:1'],
            'role_slugs.*' => ['string', 'exists:roles,slug'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('name', $validated)) {
            $user->name = $validated['name'];
        }
        if (array_key_exists('email', $validated)) {
            $user->email = strtolower(trim($validated['email']));
        }
        if (array_key_exists('department', $validated)) {
            $user->department = $validated['department'];
        }
        if (array_key_exists('is_active', $validated)) {
            $user->is_active = (bool) $validated['is_active'];
        }
        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        if (! $user->onboarded_at) {
            $user->onboarded_at = now();
        }

        $user->save();

        if (array_key_exists('role_slugs', $validated)) {
            $roleIds = Role::query()
                ->whereIn('slug', $validated['role_slugs'])
                ->pluck('id');
            $user->roles()->sync($roleIds);
        }

        $user->load('roles:id,name,slug,description');

        return response()->json([
            'data' => $this->formatUser($user),
        ]);
    }

    public function destroyUser(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->id === $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own active account.',
            ], 422);
        }

        $user->roles()->detach();
        $user->delete();

        return response()->json([
            'data' => ['deleted' => true],
        ]);
    }

    public function storeRole(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['nullable', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:500'],
        ]);

        $slug = ! empty($validated['slug'])
            ? Str::slug($validated['slug'])
            : Str::slug($validated['name']);

        $role = Role::query()->updateOrCreate(
            ['slug' => $slug],
            [
                'name' => $validated['name'],
                'description' => $validated['description'] ?? 'Custom platform role created by Super Administrator.',
            ],
        );

        if ($role->permissions()->count() === 0) {
            $viewPermissions = Permission::query()
                ->where('slug', 'like', 'academic.%view')
                ->pluck('id');
            $role->permissions()->sync($viewPermissions);
        }

        return response()->json([
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'users_count' => $role->users()->count(),
            ],
        ], 201);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'department' => $user->department ?? 'Academic Governance',
            'is_active' => (bool) ($user->is_active ?? true),
            'mfa_enabled' => (bool) $user->mfa_enabled,
            'onboarded_at' => $user->onboarded_at?->toIso8601String(),
            'roles' => $user->roles->map(fn (Role $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'description' => $r->description,
            ])->values(),
        ];
    }
}
