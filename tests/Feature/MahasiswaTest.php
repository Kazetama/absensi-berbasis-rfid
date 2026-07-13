<?php

namespace Tests\Feature;

use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MahasiswaTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_mahasiswa_page()
    {
        $response = $this->get('/mahasiswa');
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_access_mahasiswa_page()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/mahasiswa');

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_update_mahasiswa_data_without_image()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $mahasiswa = Mahasiswa::create([
            'uid_kartu' => 'UID999',
            'nama' => 'Mahasiswa Lama',
            'nim' => 'F11.2023.00076',
            'kelas' => 'X RPL',
            'nomor_orangtua' => '08123456789',
            'alamat' => 'Alamat Lama',
        ]);

        $response = $this->actingAs($user)->post("/mahasiswa/{$mahasiswa->id}", [
            'nama' => 'Mahasiswa Baru',
            'nim' => 'F11.2023.00088',
            'kelas' => 'XI RPL',
            'nomor_orangtua' => '08987654321',
            'alamat' => 'Alamat Baru',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('mahasiswas', [
            'id' => $mahasiswa->id,
            'nama' => 'Mahasiswa Baru',
            'nim' => 'F11.2023.00088',
            'kelas' => 'XI RPL',
            'nomor_orangtua' => '08987654321',
            'alamat' => 'Alamat Baru',
            'uid_kartu' => 'UID999', // should remain unchanged
        ]);
    }

    public function test_updating_mahasiswa_ignores_uid_kartu_changes()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $mahasiswa = Mahasiswa::create([
            'uid_kartu' => 'UID999',
            'nama' => 'Mahasiswa Lama',
        ]);

        $response = $this->actingAs($user)->post("/mahasiswa/{$mahasiswa->id}", [
            'nama' => 'Mahasiswa Baru',
            'uid_kartu' => 'UID_HACKED',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('mahasiswas', [
            'id' => $mahasiswa->id,
            'uid_kartu' => 'UID999', // remains original
        ]);
    }

    public function test_authenticated_user_can_update_mahasiswa_data_with_image()
    {
        Storage::fake('public');

        /** @var User $user */
        $user = User::factory()->create();

        $mahasiswa = Mahasiswa::create([
            'uid_kartu' => 'UID888',
            'nama' => 'Mahasiswa Foto',
        ]);

        $file = UploadedFile::fake()->create('mahasiswa.jpg', 100, 'image/jpeg');

        $response = $this->actingAs($user)->post("/mahasiswa/{$mahasiswa->id}", [
            'nama' => 'Mahasiswa Foto Update',
            'gambar' => $file,
        ]);

        $response->assertRedirect();

        $mahasiswa->refresh();
        $this->assertNotNull($mahasiswa->gambar);
        $this->assertTrue(Storage::disk('public')->exists($mahasiswa->gambar));
    }

    public function test_authenticated_user_can_delete_mahasiswa()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $mahasiswa = Mahasiswa::create([
            'uid_kartu' => 'UID777',
            'nama' => 'Mahasiswa Hapus',
        ]);

        $response = $this->actingAs($user)->delete("/mahasiswa/{$mahasiswa->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('mahasiswas', [
            'id' => $mahasiswa->id,
        ]);
    }

    public function test_update_mahasiswa_fails_with_invalid_nim_format()
    {
        /** @var User $user */
        $user = User::factory()->create();

        $mahasiswa = Mahasiswa::create([
            'uid_kartu' => 'UID999',
            'nama' => 'Mahasiswa Lama',
            'nim' => 'F11.2023.00076',
        ]);

        $response = $this->actingAs($user)->post("/mahasiswa/{$mahasiswa->id}", [
            'nama' => 'Mahasiswa Baru',
            'nim' => 'invalid-nim-123',
        ]);

        $response->assertSessionHasErrors('nim');
        $this->assertDatabaseHas('mahasiswas', [
            'id' => $mahasiswa->id,
            'nim' => 'F11.2023.00076', // remains original
        ]);
    }
}
