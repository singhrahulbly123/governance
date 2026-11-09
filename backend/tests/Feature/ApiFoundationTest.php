<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiFoundationTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_web_root_is_not_an_administration_interface(): void
    {
        $this->get('/')->assertNotFound();
    }

    public function test_health_endpoint_confirms_the_api_is_running(): void
    {
        $this->getJson('/api/v1/health')
            ->assertOk()
            ->assertExactJson([
                'success' => true,
                'message' => 'DIA Thrive API is running',
            ]);
    }
}
