<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DepartmentIndexController extends Controller
{
    public function __invoke(): AnonymousResourceCollection
    {
        return DepartmentResource::collection(
            Department::query()->orderBy('name')->get(),
        );
    }
}
