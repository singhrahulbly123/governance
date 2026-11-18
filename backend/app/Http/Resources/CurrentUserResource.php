<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurrentUserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'department' => $this->department ?? 'Computer Science',
            'avatar_url' => $this->avatar_url,
            'mfa_enabled' => (bool) ($this->mfa_enabled ?? false),
            'is_active' => (bool) ($this->is_active ?? true),
            'onboarded_at' => $this->onboarded_at?->toISOString(),
            'roles' => $this->whenLoaded('roles', fn () => $this->roles->map(fn ($role) => [
                'name' => $role->name,
                'slug' => $role->slug,
            ])),
            'permissions' => $this->whenLoaded('roles', fn () => $this->roles
                ->flatMap->permissions
                ->unique('slug')
                ->values()
                ->map(fn ($permission) => [
                    'name' => $permission->name,
                    'slug' => $permission->slug,
                ])),
        ];
    }
}
