<?php

namespace Database\Seeders;

use App\Models\Absensi;
use App\Models\Mahasiswa;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DummyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset existing data
        Absensi::query()->delete();
        Mahasiswa::query()->delete();

        // Create students
        $s1 = Mahasiswa::create([
            'uid_kartu' => '11223344',
            'nama' => 'Budi Santoso',
            'nim' => 'F11.2023.00001',
            'kelas' => 'XII RPL 1',
            'nomor_orangtua' => '081234567890',
        ]);

        $s2 = Mahasiswa::create([
            'uid_kartu' => '55667788',
            'nama' => 'Siti Aminah',
            'nim' => 'F11.2023.00002',
            'kelas' => 'XII RPL 1',
            'nomor_orangtua' => '081234567891',
        ]);

        $s3 = Mahasiswa::create([
            'uid_kartu' => '99001122',
            'nama' => 'Adit Pratama',
            'nim' => 'F11.2023.00003',
            'kelas' => 'X TKJ 2',
            'nomor_orangtua' => '081234567892',
        ]);

        $s4 = Mahasiswa::create([
            'uid_kartu' => '33445566',
            'nama' => 'Rini Lestari',
            'nim' => 'F11.2023.00004',
            'kelas' => 'X TKJ 2',
            'nomor_orangtua' => '081234567893',
        ]);

        $s5 = Mahasiswa::create([
            'uid_kartu' => '55667799',
            'nama' => 'Faisal Reza',
            'nim' => 'F11.2023.00005',
            'kelas' => 'XII RPL 1',
            'nomor_orangtua' => '081234567894',
        ]);

        $s6 = Mahasiswa::create([
            'uid_kartu' => '77889900',
            'nama' => 'Dewi Lestari',
            'nim' => 'F11.2023.00006',
            'kelas' => 'XI MM 3',
            'nomor_orangtua' => '081234567895',
        ]);

        // Yesterday Attendance
        Absensi::create([
            'mahasiswa_id' => $s1->id,
            'tanggal' => Carbon::yesterday()->toDateString(),
            'jam_masuk' => '07:15:00',
            'jam_pulang' => '16:05:00',
            'status' => 'Hadir',
        ]);

        Absensi::create([
            'mahasiswa_id' => $s2->id,
            'tanggal' => Carbon::yesterday()->toDateString(),
            'jam_masuk' => '07:45:00',
            'jam_pulang' => '16:00:00',
            'status' => 'Terlambat',
        ]);

        Absensi::create([
            'mahasiswa_id' => $s3->id,
            'tanggal' => Carbon::yesterday()->toDateString(),
            'jam_masuk' => '07:20:00',
            'jam_pulang' => '16:10:00',
            'status' => 'Hadir',
        ]);

        Absensi::create([
            'mahasiswa_id' => $s5->id,
            'tanggal' => Carbon::yesterday()->toDateString(),
            'jam_masuk' => '07:25:00',
            'jam_pulang' => '16:05:00',
            'status' => 'Hadir',
        ]);

        // Today Attendance
        Absensi::create([
            'mahasiswa_id' => $s1->id,
            'tanggal' => Carbon::today()->toDateString(),
            'jam_masuk' => '07:10:00',
            'jam_pulang' => null,
            'status' => 'Hadir',
        ]);

        Absensi::create([
            'mahasiswa_id' => $s2->id,
            'tanggal' => Carbon::today()->toDateString(),
            'jam_masuk' => '07:55:00',
            'jam_pulang' => null,
            'status' => 'Terlambat',
        ]);

        Absensi::create([
            'mahasiswa_id' => $s3->id,
            'tanggal' => Carbon::today()->toDateString(),
            'jam_masuk' => '07:50:00',
            'jam_pulang' => null,
            'status' => 'Terlambat',
        ]);

        Absensi::create([
            'mahasiswa_id' => $s6->id,
            'tanggal' => Carbon::today()->toDateString(),
            'jam_masuk' => '07:15:00',
            'jam_pulang' => null,
            'status' => 'Hadir',
        ]);
    }
}
