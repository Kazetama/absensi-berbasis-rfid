<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $table = 'siswas';

    protected $fillable = [
        'uid_kartu',
        'nama',
        'gambar',
        'nomor_orangtua',
        'alamat',
        'kelas',
        'nis',
    ];

    // Relasi: Satu siswa memiliki banyak absensi
    public function absensi()
    {
        return $this->hasMany(Absensi::class);
    }
}
