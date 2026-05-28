<?php

namespace Tests\Feature;

use App\Models\Siswa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SiswaTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_siswa_page()
    {
        $response = $this->get('/siswa');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_access_siswa_page()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/siswa');

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_update_siswa_data_without_image()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $siswa = Siswa::create([
            'uid_kartu' => 'UID999',
            'nama' => 'Siswa Lama',
            'nis' => '1001',
            'kelas' => 'X RPL',
            'nomor_orangtua' => '08123456789',
            'alamat' => 'Alamat Lama',
        ]);

        $response = $this->actingAs($user)->post("/siswa/{$siswa->id}", [
            'nama' => 'Siswa Baru',
            'nis' => '2002',
            'kelas' => 'XI RPL',
            'nomor_orangtua' => '08987654321',
            'alamat' => 'Alamat Baru',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('siswas', [
            'id' => $siswa->id,
            'nama' => 'Siswa Baru',
            'nis' => '2002',
            'kelas' => 'XI RPL',
            'nomor_orangtua' => '08987654321',
            'alamat' => 'Alamat Baru',
            'uid_kartu' => 'UID999', // should remain unchanged
        ]);
    }

    public function test_updating_siswa_ignores_uid_kartu_changes()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $siswa = Siswa::create([
            'uid_kartu' => 'UID999',
            'nama' => 'Siswa Lama',
        ]);

        $response = $this->actingAs($user)->post("/siswa/{$siswa->id}", [
            'nama' => 'Siswa Baru',
            'uid_kartu' => 'UID_HACKED',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('siswas', [
            'id' => $siswa->id,
            'uid_kartu' => 'UID999', // remains original
        ]);
    }

    public function test_authenticated_user_can_update_siswa_data_with_image()
    {
        Storage::fake('public');

        /** @var User $user */
        $user = User::factory()->create();

        $siswa = Siswa::create([
            'uid_kartu' => 'UID888',
            'nama' => 'Siswa Foto',
        ]);

        $file = UploadedFile::fake()->create('siswa.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($user)->post("/siswa/{$siswa->id}", [
            'nama' => 'Siswa Foto Update',
            'gambar' => $file,
        ]);

        $response->assertRedirect();

        $siswa->refresh();
        $this->assertNotNull($siswa->gambar);
        $this->assertTrue(Storage::disk('public')->exists($siswa->gambar));
    }

    public function test_authenticated_user_can_delete_siswa()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $siswa = Siswa::create([
            'uid_kartu' => 'UID777',
            'nama' => 'Siswa Hapus',
        ]);

        $response = $this->actingAs($user)->delete("/siswa/{$siswa->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('siswas', [
            'id' => $siswa->id,
        ]);
    }
}
