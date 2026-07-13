<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-Api-Key');

        // Cek apakah API Key sama dengan yang kita tentukan (contoh: wemos_secret_key_123)
        if ($apiKey !== env('API_KEY_WEMOS', 'wemos_secret_key_123')) {
            return response()->json(['message' => 'Akses Ditolak: API Key tidak valid!'], 401);
        }

        // Simpan timestamp aktif terakhir dari alat ke cache
        Cache::put('rfid_device_last_seen', now()->toIso8601String(), 86400);

        return $next($request);
    }
}
