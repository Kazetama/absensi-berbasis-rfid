<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AbsensiRequest;
use App\Models\Absensi;
use App\Models\SettingAbsensi;
use App\Models\Siswa;
use Carbon\Carbon;

class AbsensiController extends Controller
{
    // Menyimpan absensi masuk atau pulang
    public function absen(AbsensiRequest $request)
    {
        $siswa = Siswa::query()->where('uid_kartu', $request->uid_kartu)->first();

        if (! $siswa) {
            // Celah Keamanan Ditutup: Tolak kartu yang tidak terdaftar
            return response()->json(['message' => 'Akses Ditolak: Kartu belum terdaftar di sistem!'], 404);
        }

        // Ambil pengaturan absensi
        $setting = SettingAbsensi::query()->first();
        if (! $setting) {
            $setting = SettingAbsensi::create([
                'jam_masuk_mulai' => '06:00:00',
                'jam_masuk_batas' => '07:30:00',
                'jam_masuk_selesai' => '08:30:00',
                'jam_pulang_mulai' => '16:00:00',
                'jam_pulang_selesai' => '18:00:00',
                'is_active' => true,
            ]);
        }

        // 1. Cek Apakah Sistem Absensi Sedang Dibuka/Aktif
        if (! $setting->is_active) {
            return response()->json(['message' => 'Akses Ditolak: Sistem absensi saat ini sedang ditutup!'], 403);
        }

        $tanggal = Carbon::today()->toDateString();
        $jam_sekarang = Carbon::now()->format('H:i:s');
        $absensi = Absensi::query()->where('siswa_id', $siswa->id)->where('tanggal', $tanggal)->first();

        $sekarang_ts = strtotime($jam_sekarang);

        if (! $absensi) {
            // Tap pertama: Absensi masuk
            $mulai_masuk_ts = strtotime($setting->jam_masuk_mulai);
            $selesai_masuk_ts = strtotime($setting->jam_masuk_selesai);

            if ($sekarang_ts < $mulai_masuk_ts) {
                $jam_buka = substr($setting->jam_masuk_mulai, 0, 5);

                return response()->json(['message' => "Maaf, absen masuk belum dibuka. Silakan absen mulai jam {$jam_buka} WIB."], 400);
            }

            if ($sekarang_ts > $selesai_masuk_ts) {
                $jam_tutup = substr($setting->jam_masuk_selesai, 0, 5);

                return response()->json(['message' => "Maaf, batas waktu absen masuk sudah ditutup pada jam {$jam_tutup} WIB."], 400);
            }

            $batas_masuk_ts = strtotime($setting->jam_masuk_batas);
            $status = ($sekarang_ts > $batas_masuk_ts) ? 'Terlambat' : 'Hadir';

            Absensi::create([
                'siswa_id' => $siswa->id,
                'tanggal' => $tanggal,
                'jam_masuk' => $jam_sekarang,
                'status' => $status,
            ]);

            return response()->json(['message' => "Absensi masuk berhasil ($status) pada $jam_sekarang WIB"], 200);
        } elseif (! $absensi->jam_pulang) {
            // Tap kedua: Absensi pulang
            $mulai_pulang_ts = strtotime($setting->jam_pulang_mulai);
            $selesai_pulang_ts = strtotime($setting->jam_pulang_selesai);

            if ($sekarang_ts < $mulai_pulang_ts) {
                $jam_pulang = substr($setting->jam_pulang_mulai, 0, 5);

                return response()->json(['message' => "Maaf, ini belum jam pulang. Pulang hanya bisa setelah jam {$jam_pulang} WIB."], 400);
            }

            if ($sekarang_ts > $selesai_pulang_ts) {
                $jam_tutup_pulang = substr($setting->jam_pulang_selesai, 0, 5);

                return response()->json(['message' => "Maaf, batas waktu absen pulang sudah ditutup pada jam {$jam_tutup_pulang} WIB."], 400);
            }

            // Absensi pulang
            $absensi->jam_pulang = $jam_sekarang;
            $absensi->save();

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
    public function getAbsensiByUID(string $uid_kartu)
    {
        $siswa = Siswa::query()->where('uid_kartu', $uid_kartu)->first();

        if (! $siswa) {
            return response()->json(['message' => 'Siswa tidak ditemukan'], 404);
        }

        $absensi = Absensi::query()->where('siswa_id', $siswa->id)->get();

        return response()->json($absensi);
    }
}
