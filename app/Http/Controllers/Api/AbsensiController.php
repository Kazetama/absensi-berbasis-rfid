<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\AbsensiRequest;
use App\Models\Absensi;
use App\Models\SettingAbsensi;
use App\Models\Siswa;
use App\Services\FonnteService;
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

            $newAbsensi = Absensi::create([
                'siswa_id' => $siswa->id,
                'tanggal' => $tanggal,
                'jam_masuk' => $jam_sekarang,
                'status' => $status,
            ]);

            $this->kirimNotifikasiAbsen($siswa, $newAbsensi, 'masuk');

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

            $this->kirimNotifikasiAbsen($siswa, $absensi, 'pulang');

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

    /**
     * Kirim notifikasi absensi via WhatsApp.
     */
    protected function kirimNotifikasiAbsen(Siswa $siswa, Absensi $absensi, string $tipe): void
    {
        $fonnteService = app(FonnteService::class);
        $hari_tanggal = Carbon::parse($absensi->tanggal)->locale('id')->translatedFormat('l, d F Y');
        $jam = substr($tipe === 'masuk' ? $absensi->jam_masuk : $absensi->jam_pulang, 0, 5);

        if ($tipe === 'masuk') {
            $statusStr = $absensi->status === 'Terlambat' ? '🔴 Terlambat' : '🟢 Hadir';
            $message = "📢 *NOTIFIKASI ABSENSI MASUK*\n\n"
                ."Yth. Orang Tua/Wali dari siswa:\n"
                ."Nama: *{$siswa->nama}*\n"
                ."NIS: {$siswa->nis}\n"
                ."Kelas: {$siswa->kelas}\n\n"
                ."Menginfokan bahwa putra/putri Anda telah melakukan absensi *MASUK* sekolah.\n"
                ."📅 Hari, Tanggal: {$hari_tanggal}\n"
                ."⏰ Waktu: {$jam} WIB\n"
                ."📝 Status: {$statusStr}\n\n"
                .'Terima kasih atas kerja samanya.';
        } else {
            $message = "📢 *NOTIFIKASI ABSENSI PULANG*\n\n"
                ."Yth. Orang Tua/Wali dari siswa:\n"
                ."Nama: *{$siswa->nama}*\n"
                ."NIS: {$siswa->nis}\n"
                ."Kelas: {$siswa->kelas}\n\n"
                ."Menginfokan bahwa putra/putri Anda telah melakukan absensi *PULANG* sekolah dengan selamat.\n"
                ."📅 Hari, Tanggal: {$hari_tanggal}\n"
                ."⏰ Waktu: {$jam} WIB\n\n"
                .'Terima kasih.';
        }

        // 1. Kirim ke nomor orang tua jika diisi
        if (! empty($siswa->nomor_orangtua)) {
            $fonnteService->send($siswa->nomor_orangtua, $message);
        }

        // 2. Kirim juga ke nomor tester user (085732198202) untuk monitoring/testing
        $testPhone = '085732198202';
        if ($this->cleanPhone($siswa->nomor_orangtua) !== $this->cleanPhone($testPhone)) {
            $testMessage = "⚠️ *[TESTING COPY]* ⚠️\n".$message;
            $fonnteService->send($testPhone, $testMessage);
        }
    }

    /**
     * Bersihkan format nomor telepon.
     */
    protected function cleanPhone(?string $phone): string
    {
        if (empty($phone)) {
            return '';
        }

        // Hapus karakter non-digit
        $cleaned = preg_replace('/\D/', '', $phone);

        // Ubah awalan 0 menjadi 62
        if (str_starts_with($cleaned, '0')) {
            $cleaned = '62'.substr($cleaned, 1);
        }

        return $cleaned;
    }
}
