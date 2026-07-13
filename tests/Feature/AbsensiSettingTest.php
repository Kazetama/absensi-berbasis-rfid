<?php

namespace Tests\Feature;

use App\Models\Mahasiswa;
use App\Models\SettingAbsensi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AbsensiSettingTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_settings_page()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/absensi/setting');

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_update_settings()
    {
        /** @var User $user */
        $user = User::factory()->create();
        $setting = SettingAbsensi::create([
            'jam_masuk_mulai' => '06:00:00',
            'jam_masuk_batas' => '07:30:00',
            'jam_masuk_selesai' => '08:30:00',
            'jam_pulang_mulai' => '16:00:00',
            'jam_pulang_selesai' => '18:00:00',
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->put('/absensi/setting', [
            'jam_masuk_mulai' => '06:30',
            'jam_masuk_batas' => '07:45',
            'jam_masuk_selesai' => '08:45',
            'jam_pulang_mulai' => '16:30',
            'jam_pulang_selesai' => '18:30',
            'is_active' => false,
        ]);

        $response->assertStatus(302); // Redirect back
        $this->assertDatabaseHas('setting_absensis', [
            'jam_masuk_mulai' => '06:30:00',
            'jam_masuk_batas' => '07:45:00',
            'jam_masuk_selesai' => '08:45:00',
            'jam_pulang_mulai' => '16:30:00',
            'jam_pulang_selesai' => '18:30:00',
            'is_active' => false,
        ]);
    }

    public function test_api_denies_attendance_when_settings_inactive()
    {
        // Setup API Key Wemos
        config(['app.api_key_wemos' => 'wemos_secret_key_123']);

        $siswa = Mahasiswa::create([
            'uid_kartu' => 'ABC123XYZ',
            'nama' => 'John Doe',
            'nim' => 'F11.2023.00101',
            'kelas' => 'XII RPL 1',
        ]);

        SettingAbsensi::create([
            'jam_masuk_mulai' => '06:00:00',
            'jam_masuk_batas' => '07:30:00',
            'jam_masuk_selesai' => '08:30:00',
            'jam_pulang_mulai' => '16:00:00',
            'jam_pulang_selesai' => '18:00:00',
            'is_active' => false, // Inactive
        ]);

        $response = $this->postJson('/api/absen', [
            'uid_kartu' => 'ABC123XYZ',
        ], [
            'X-Api-Key' => 'wemos_secret_key_123',
        ]);

        $response->assertStatus(403);
        $response->assertJson([
            'message' => 'Akses Ditolak: Sistem absensi saat ini sedang ditutup!',
        ]);
    }
}
