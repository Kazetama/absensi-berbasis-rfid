<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Siswa;
use App\Models\Absensi;
use Carbon\Carbon;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset existing data
        Absensi::query()->delete();
        Siswa::query()->delete();

        // Create students
        $s1 = Siswa::create([
            'uid_kartu' => '11223344',
            'nama' => 'Budi Santoso',
            'nis' => '10001',
            'kelas' => 'XII RPL 1',
            'nomor_orangtua' => '081234567890'
        ]);

        $s2 = Siswa::create([
            'uid_kartu' => '55667788',
            'nama' => 'Siti Aminah',
            'nis' => '10002',
            'kelas' => 'XII RPL 1',
            'nomor_orangtua' => '081234567891'
        ]);

        $s3 = Siswa::create([
            'uid_kartu' => '99001122',
            'nama' => 'Adit Pratama',
            'nis' => '10003',
            'kelas' => 'X TKJ 2',
            'nomor_orangtua' => '081234567892'
        ]);

        $s4 = Siswa::create([
            'uid_kartu' => '33445566',
            'nama' => 'Rini Lestari',
            'nis' => '10004',
            'kelas' => 'X TKJ 2',
            'nomor_orangtua' => '081234567893'
        ]);

        $s5 = Siswa::create([
            'uid_kartu' => '55667799',
            'nama' => 'Faisal Reza',
            'nis' => '10005',
            'kelas' => 'XII RPL 1',
            'nomor_orangtua' => '081234567894'
        ]);

        $s6 = Siswa::create([
            'uid_kartu' => '77889900',
            'nama' => 'Dewi Lestari',
            'nis' => '10006',
            'kelas' => 'XI MM 3',
            'nomor_orangtua' => '081234567895'
        ]);

        // Yesterday Attendance
        Absensi::create([
            'siswa_id' => $s1->id,
            'tanggal' => Carbon::yesterday()->toDateString(),
            'jam_masuk' => '07:15:00',
            'jam_pulang' => '16:05:00',
            'status' => 'Hadir'
        ]);

        Absensi::create([
            'siswa_id' => $s2->id,
            'tanggal' => Carbon::yesterday()->toDateString(),
            'jam_masuk' => '07:45:00',
            'jam_pulang' => '16:00:00',
            'status' => 'Terlambat'
        ]);

        Absensi::create([
            'siswa_id' => $s3->id,
            'tanggal' => Carbon::yesterday()->toDateString(),
            'jam_masuk' => '07:20:00',
            'jam_pulang' => '16:10:00',
            'status' => 'Hadir'
        ]);

        Absensi::create([
            'siswa_id' => $s5->id,
            'tanggal' => Carbon::yesterday()->toDateString(),
            'jam_masuk' => '07:25:00',
            'jam_pulang' => '16:05:00',
            'status' => 'Hadir'
        ]);

        // Today Attendance
        Absensi::create([
            'siswa_id' => $s1->id,
            'tanggal' => Carbon::today()->toDateString(),
            'jam_masuk' => '07:10:00',
            'jam_pulang' => null,
            'status' => 'Hadir'
        ]);

        Absensi::create([
            'siswa_id' => $s2->id,
            'tanggal' => Carbon::today()->toDateString(),
            'jam_masuk' => '07:55:00',
            'jam_pulang' => null,
            'status' => 'Terlambat'
        ]);

        Absensi::create([
            'siswa_id' => $s3->id,
            'tanggal' => Carbon::today()->toDateString(),
            'jam_masuk' => '07:50:00',
            'jam_pulang' => null,
            'status' => 'Terlambat'
        ]);

        Absensi::create([
            'siswa_id' => $s6->id,
            'tanggal' => Carbon::today()->toDateString(),
            'jam_masuk' => '07:15:00',
            'jam_pulang' => null,
            'status' => 'Hadir'
        ]);
    }
}
