<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CurrentUserResource;
use Illuminate\Http\Request;

class AuthenticatedUserController extends Controller
{
    public function __invoke(Request $request): CurrentUserResource
    {
        return new CurrentUserResource(
            $request->user()->load('roles.permissions'),
        );
    }
}
