<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_web_routes_do_not_expose_an_administration_interface(): void
    {
        $this->get('/')
            ->assertNotFound();
    }
}
