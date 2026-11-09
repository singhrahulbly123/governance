<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AcademicYearIndexController extends Controller
{
    public function __invoke(): AnonymousResourceCollection
    {
        return AcademicYearResource::collection(
            AcademicYear::query()->orderByDesc('starts_on')->get(),
        );
    }
}
