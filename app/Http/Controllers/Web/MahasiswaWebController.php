<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MahasiswaWebController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $kelas = $request->input('kelas');

        $mahasiswas = Mahasiswa::query()
            ->when($search, function ($query, $search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('uid_kartu', 'like', "%{$search}%")
                        ->orWhere('nim', 'like', "%{$search}%");
                });
            })
            ->when($kelas, function ($query, $kelas) {
                return $query->where('kelas', $kelas);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Ambil daftar kelas unik untuk dropdown filter
        $kelasList = Mahasiswa::query()
            ->where('kelas', '!=', null)
            ->select('kelas')
            ->distinct()
            ->orderBy('kelas', 'asc')
            ->pluck('kelas');

        return Inertia::render('mahasiswa/index', [
            'mahasiswas' => $mahasiswas,
            'filters' => [
                'search' => $search ?? '',
                'kelas' => $kelas ?? '',
            ],
            'kelasList' => $kelasList,
        ]);
    }

    public function update(Request $request, $id)
    {
        $mahasiswa = Mahasiswa::findOrFail($id);

        $request->validate([
            'nama' => 'nullable|string|max:255',
            'nim' => [
                'nullable',
                'string',
                'regex:/^[A-Za-z]\d{2}\.\d{4}\.\d{5}$/',
            ],
            'kelas' => 'nullable|string|max:50',
            'nomor_orangtua' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'gambar' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'nim.regex' => 'Format NIM harus sesuai ketentuan (contoh: F11.2023.00076).',
        ]);

        $mahasiswa->nama = $request->input('nama');
        $mahasiswa->nim = $request->input('nim');
        $mahasiswa->kelas = $request->input('kelas');
        $mahasiswa->nomor_orangtua = $request->input('nomor_orangtua');
        $mahasiswa->alamat = $request->input('alamat');

        if ($request->hasFile('gambar')) {
            if ($mahasiswa->gambar && Storage::disk('public')->exists($mahasiswa->gambar)) {
                Storage::disk('public')->delete($mahasiswa->gambar);
            }
            $path = $request->file('gambar')->store('mahasiswa', 'public');
            $mahasiswa->gambar = $path;
        }

        $mahasiswa->save();

        return back();
    }

    public function destroy($id)
    {
        $mahasiswa = Mahasiswa::findOrFail($id);
        $mahasiswa->delete();

        // Mengembalikan response tanpa me-reload halaman berkat Inertia
        return back();
    }
}
