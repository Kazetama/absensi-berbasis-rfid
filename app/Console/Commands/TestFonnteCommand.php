<?php

namespace App\Console\Commands;

use App\Services\FonnteService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('fonnte:test {phone=085732198202}')]
#[Description('Kirim pesan test WhatsApp menggunakan Fonnte API')]
class TestFonnteCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(FonnteService $fonnteService): int
    {
        $phone = $this->argument('phone');
        $this->info("Mengirim pesan test ke {$phone}...");

        $message = "📢 *TEST FONNTE WHATSAPP*\n\nHalo! Ini adalah pesan percobaan dari sistem Absensi Berbasis RFID.\nToken Fonnte Anda berfungsi dengan baik! 👍\n\nTanggal: ".now()->locale('id')->translatedFormat('l, d F Y')."\nWaktu: ".now()->format('H:i:s').' WIB';

        $success = $fonnteService->send($phone, $message);

        if ($success) {
            $this->info('Pesan test berhasil dikirim!');

            return Command::SUCCESS;
        }

        $this->error('Gagal mengirim pesan test. Silakan periksa log aplikasi (storage/logs/laravel.log) atau konfigurasi FONNTE_TOKEN di .env.');

        return Command::FAILURE;
    }
}
