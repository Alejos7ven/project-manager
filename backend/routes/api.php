<?php

use App\Http\Controllers\Api\V1\AiController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\ProjectController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Authentication (Public)
    Route::post('/login', [AuthController::class, 'login'])->name('api.v1.login');
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected Routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        // Auth session
        Route::post('/logout', [AuthController::class, 'logout'])->name('api.v1.logout');
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me'])->name('api.v1.me');
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Dashboard Analytics
        Route::get('/dashboard/stats', [DashboardController::class, 'stats'])->name('api.v1.dashboard.stats');

        // Clients CRUD
        Route::apiResource('clients', ClientController::class);

        // Projects CRUD
        Route::apiResource('projects', ProjectController::class);

        // Bonus: AI Project Description
        Route::post('/ai/generate-description', [AiController::class, 'generateDescription'])->name('api.v1.ai.generate-description');
    });
});
