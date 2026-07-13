import { Head, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MahasiswaTable } from '@/components/mahasiswa/mahasiswa-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PaginatedData, Mahasiswa } from '@/types/mahasiswa';

interface Props {
    mahasiswas: PaginatedData<Mahasiswa>;
    filters: {
        search: string;
        kelas: string;
    };
    kelasList: string[];
}

export default function MahasiswaIndex({ mahasiswas, filters, kelasList }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [kelas, setKelas] = useState(filters.kelas);

    // Fungsi untuk memperbarui URL dengan parameter filter
    const applyFilters = (searchVal: string, kelasVal: string) => {
        router.get(
            '/mahasiswa',
            { search: searchVal, kelas: kelasVal },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // Menangani pencarian dengan delay (debounce) agar tidak lag
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                applyFilters(search, kelas);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, filters.search, kelas]);

    // Menangani perubahan dropdown kelas
    const handleKelasChange = (val: string) => {
        const newKelas = val === 'all' ? '' : val;
        setKelas(newKelas);
        applyFilters(search, newKelas);
    };

    return (
        <>
            <Head title="Data Mahasiswa" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 shadow-sm dark:border-sidebar-border">
                    {/* Mengubah CardHeader menjadi Flex Container untuk Title (Kiri) dan Filter (Kanan) */}
                    <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <CardTitle>Daftar Mahasiswa</CardTitle>
                            <CardDescription>
                                Daftar semua mahasiswa yang terdaftar dalam sistem
                                absensi RFID.
                            </CardDescription>
                        </div>

                        {/* Bagian Filter - Sekarang di sebelah kanan untuk layar besar */}
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari nama, NIM, atau UID..."
                                    className="w-full pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-[180px]">
                                <Select
                                    value={kelas || 'all'}
                                    onValueChange={handleKelasChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Kelas
                                        </SelectItem>
                                        {kelasList.map((k) => (
                                            <SelectItem key={k} value={k}>
                                                Kelas {k}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <MahasiswaTable mahasiswas={mahasiswas} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MahasiswaIndex.layout = {
    breadcrumbs: [
        {
            title: 'Data Mahasiswa',
            href: '/mahasiswa',
        },
    ],
};
