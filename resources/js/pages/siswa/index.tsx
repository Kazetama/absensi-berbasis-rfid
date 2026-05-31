import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { SiswaTable } from '@/components/siswa/siswa-table';
import { PaginatedData, Siswa } from '@/types/siswa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Props {
    siswas: PaginatedData<Siswa>;
    filters: {
        search: string;
        kelas: string;
    };
    kelasList: string[];
}

export default function SiswaIndex({ siswas, filters, kelasList }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [kelas, setKelas] = useState(filters.kelas);

    // Fungsi untuk memperbarui URL dengan parameter filter
    const applyFilters = (searchVal: string, kelasVal: string) => {
        router.get('/siswa', { search: searchVal, kelas: kelasVal }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
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
        const newKelas = val === "all" ? "" : val;
        setKelas(newKelas);
        applyFilters(search, newKelas);
    };

    return (
        <>
            <Head title="Data Siswa" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                    {/* Mengubah CardHeader menjadi Flex Container untuk Title (Kiri) dan Filter (Kanan) */}
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                        <div className="space-y-1.5">
                            <CardTitle>Daftar Siswa</CardTitle>
                            <CardDescription>
                                Daftar semua siswa yang terdaftar dalam sistem absensi RFID.
                            </CardDescription>
                        </div>
                        
                        {/* Bagian Filter - Sekarang di sebelah kanan untuk layar besar */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    type="text"
                                    placeholder="Cari nama, NIS, atau UID..." 
                                    className="pl-8 w-full"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-[180px]">
                                <Select value={kelas || "all"} onValueChange={handleKelasChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kelas</SelectItem>
                                        {kelasList.map((k) => (
                                            <SelectItem key={k} value={k}>Kelas {k}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <SiswaTable siswas={siswas} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SiswaIndex.layout = {
    breadcrumbs: [
        {
            title: 'Data Siswa',
            href: '/siswa',
        },
    ],
};