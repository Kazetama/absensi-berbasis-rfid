<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswas';

    protected $fillable = [
        'uid_kartu',
        'nama',
        'gambar',
        'nomor_orangtua',
        'alamat',
        'kelas',
        'nim',
    ];

    // Relasi: Satu siswa memiliki banyak absensi
    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }
}
