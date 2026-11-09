<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProgramIndexController extends Controller
{
    public function __invoke(): AnonymousResourceCollection
    {
        return ProgramResource::collection(
            Program::query()->with('department')->orderBy('name')->get(),
        );
    }
}
