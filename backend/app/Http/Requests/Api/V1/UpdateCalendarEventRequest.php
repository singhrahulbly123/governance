<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCalendarEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:180'],
            'description' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'event_type' => ['sometimes', 'required', 'string', Rule::in(['personal', 'class', 'meeting', 'deadline', 'other'])],
            'starts_at' => ['sometimes', 'required', 'date'],
            'ends_at' => ['sometimes', 'nullable', 'date'],
            'is_all_day' => ['sometimes', 'required', 'boolean'],
            'location' => ['sometimes', 'nullable', 'string', 'max:180'],
        ];
    }
}
