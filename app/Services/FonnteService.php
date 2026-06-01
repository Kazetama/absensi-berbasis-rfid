<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    /**
     * Send a WhatsApp message via Fonnte API.
     */
    public function send(string $target, string $message): bool
    {
        $token = config('services.fonnte.token');

        if (empty($token)) {
            Log::warning('Fonnte API Token is not configured in .env (FONNTE_TOKEN).');

            return false;
        }

        try {
            $request = Http::withHeaders([
                'Authorization' => $token,
            ]);

            if (app()->environment('local', 'testing')) {
                $request = $request->withoutVerifying();
            }

            $response = $request->asForm()->post('https://api.fonnte.com/send', [
                'target' => $target,
                'message' => $message,
                'countryCode' => '62',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if ($data['status'] ?? false) {
                    return true;
                }

                Log::error('Fonnte API returned failure status:', ['response' => $data]);

                return false;
            }

            Log::error('Fonnte API request failed:', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Fonnte API exception:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return false;
        }
    }
}
