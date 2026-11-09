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
