<?php

namespace App\Http\Controllers;

use App\Support\WebsiteEmailEndpoint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebsiteEmailController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        return WebsiteEmailEndpoint::send($request, 'WebsiteEmailController::send');
    }
}
