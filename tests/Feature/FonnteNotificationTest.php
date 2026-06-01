<?php

namespace Tests\Feature;

use App\Models\SettingAbsensi;
use App\Models\Siswa;
use App\Services\FonnteService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FonnteNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup API Key Wemos
        config(['app.api_key_wemos' => 'wemos_secret_key_123']);

        // Setup active attendance window
        SettingAbsensi::create([
            'jam_masuk_mulai' => '06:00:00',
            'jam_masuk_batas' => '07:30:00',
            'jam_masuk_selesai' => '08:30:00',
            'jam_pulang_mulai' => '16:00:00',
            'jam_pulang_selesai' => '18:00:00',
            'is_active' => true,
        ]);
    }

    public function test_attendance_masuk_sends_whatsapp_notification_to_parent_and_tester(): void
    {
        // Set time to be within jam masuk (e.g. 07:00:00)
        Carbon::setTestNow(Carbon::today()->setTime(7, 0, 0));

        $siswa = Siswa::create([
            'uid_kartu' => 'UID_KARTU_TEST_123',
            'nama' => 'Budi Santoso',
            'nis' => '12345',
            'kelas' => 'X RPL 1',
            'nomor_orangtua' => '081234567890',
        ]);

        // Mock FonnteService
        $mockFonnte = $this->mock(FonnteService::class);

        // Expecting send to be called twice: once for parent, once for the test number
        $mockFonnte->shouldReceive('send')
            ->once()
            ->with('081234567890', \Mockery::on(function ($message) {
                return str_contains($message, 'NOTIFIKASI ABSENSI MASUK')
                    && str_contains($message, 'Budi Santoso')
                    && str_contains($message, 'Hadir');
            }))
            ->andReturn(true);

        $mockFonnte->shouldReceive('send')
            ->once()
            ->with('085732198202', \Mockery::on(function ($message) {
                return str_contains($message, '[TESTING COPY]')
                    && str_contains($message, 'Budi Santoso');
            }))
            ->andReturn(true);

        $response = $this->postJson('/api/absen', [
            'uid_kartu' => 'UID_KARTU_TEST_123',
        ], [
            'X-Api-Key' => 'wemos_secret_key_123',
        ]);

        $response->assertStatus(200);

        Carbon::setTestNow(); // Reset
    }

    public function test_attendance_pulang_sends_whatsapp_notification_to_parent_and_tester(): void
    {
        $siswa = Siswa::create([
            'uid_kartu' => 'UID_KARTU_TEST_123',
            'nama' => 'Budi Santoso',
            'nis' => '12345',
            'kelas' => 'X RPL 1',
            'nomor_orangtua' => '081234567890',
        ]);

        // Mock FonnteService first time for check-in setup (disable mock constraints for first request)
        $mockFonnteSetup = $this->mock(FonnteService::class);
        $mockFonnteSetup->shouldReceive('send')->andReturn(true);

        // 1. Log check-in (set time to 07:00:00)
        Carbon::setTestNow(Carbon::today()->setTime(7, 0, 0));
        $this->postJson('/api/absen', [
            'uid_kartu' => 'UID_KARTU_TEST_123',
        ], [
            'X-Api-Key' => 'wemos_secret_key_123',
        ]);

        // 2. Mock Fonnte for check-out (set time to 16:30:00)
        Carbon::setTestNow(Carbon::today()->setTime(16, 30, 0));

        $mockFonnte = $this->mock(FonnteService::class);
        $mockFonnte->shouldReceive('send')
            ->once()
            ->with('081234567890', \Mockery::on(function ($message) {
                return str_contains($message, 'NOTIFIKASI ABSENSI PULANG')
                    && str_contains($message, 'Budi Santoso');
            }))
            ->andReturn(true);

        $mockFonnte->shouldReceive('send')
            ->once()
            ->with('085732198202', \Mockery::on(function ($message) {
                return str_contains($message, '[TESTING COPY]')
                    && str_contains($message, 'Budi Santoso');
            }))
            ->andReturn(true);

        $response = $this->postJson('/api/absen', [
            'uid_kartu' => 'UID_KARTU_TEST_123',
        ], [
            'X-Api-Key' => 'wemos_secret_key_123',
        ]);

        $response->assertStatus(200);

        Carbon::setTestNow(); // Reset
    }
}
