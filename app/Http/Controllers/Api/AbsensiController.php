<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AbsensiRequest;
use App\Models\Absensi;
use App\Models\Siswa;
use Carbon\Carbon;

class AbsensiController extends Controller
{
    // Menyimpan absensi masuk atau pulang
    public function absen(AbsensiRequest $request)
    {

        $siswa = Siswa::where('uid_kartu', $request->uid_kartu)->first();

        if (! $siswa) {
            // Celah Keamanan Ditutup: Tolak kartu yang tidak terdaftar
            return response()->json(['message' => 'Akses Ditolak: Kartu belum terdaftar di sistem!'], 404);
        }

        $tanggal = Carbon::today()->toDateString();
        $jam_sekarang = Carbon::now()->format('H:i:s');
        $absensi = Absensi::where('siswa_id', $siswa->id)->where('tanggal', $tanggal)->first();

        $batas_masuk = '07:30:00';
        $batas_pulang = '16:00:00';

        if (! $absensi) {
            // Tap pertama: Absensi masuk
            $status = (strtotime($jam_sekarang) > strtotime($batas_masuk)) ? 'Terlambat' : 'Hadir';

            Absensi::create([
                'siswa_id' => $siswa->id,
                'tanggal' => $tanggal,
                'jam_masuk' => $jam_sekarang,
                'status' => $status,
            ]);

            return response()->json(['message' => "Absensi masuk berhasil ($status) pada $jam_sekarang WIB"], 200);
        } elseif (! $absensi->jam_pulang) {
            // Tap kedua: Absensi pulang
            // Cek apakah sudah melewati jam pulang
            if (strtotime($jam_sekarang) < strtotime($batas_pulang)) {
                return response()->json(['message' => 'Maaf, ini belum jam pulang. Pulang hanya bisa setelah 16:00 WIB.'], 400);
            }

            // Absensi pulang
            $absensi->update(['jam_pulang' => $jam_sekarang]);

            return response()->json(['message' => "Absensi pulang berhasil pada $jam_sekarang WIB"], 200);
        } else {
            return response()->json(['message' => 'Absensi sudah lengkap hari ini'], 400);
        }
    }

    // Mendapatkan riwayat absensi semua siswa
    public function getAllAbsensi()
    {
        $absensi = Absensi::with('siswa')->get();

        return response()->json($absensi);
    }

    // Mendapatkan riwayat absensi siswa berdasarkan UID
    public function getAbsensiByUID($uid_kartu)
    {
        $siswa = Siswa::where('uid_kartu', $uid_kartu)->first();

        if (! $siswa) {
            return response()->json(['message' => 'Siswa tidak ditemukan'], 404);
        }

        $absensi = Absensi::where('siswa_id', $siswa->id)->get();

        return response()->json($absensi);
    }
}
