import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Search, Calendar as CalendarIcon, UserX } from 'lucide-react';
import { PaginatedData, Siswa } from '@/types/siswa';

interface Absensi {
    id: number;
    siswa_id: number;
    tanggal: string;
    jam_masuk: string | null;
    jam_pulang: string | null;
    status: 'Hadir' | 'Terlambat' | 'Tidak Hadir' | null;
    created_at: string;
    updated_at: string;
    siswa: Siswa;
}

interface Props {
    kelas: string;
    absensi: PaginatedData<Absensi>;
    filters: {
        search: string;
        date: string;
    };
}

export default function RekapDetail({ kelas, absensi, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [date, setDate] = useState(filters.date);

    // Fungsi untuk memperbarui URL dengan parameter filter
    const applyFilters = (searchVal: string, dateVal: string) => {
        router.get(`/absensi/rekap/${encodeURIComponent(kelas)}`, 
            { search: searchVal, date: dateVal }, 
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    // Menangani pencarian dengan delay (debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                applyFilters(search, date);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    // Menangani perubahan filter tanggal
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        applyFilters(search, newDate);
    };

    const getStatusBadgeClass = (status: Absensi['status']) => {
        switch (status) {
            case 'Hadir':
                return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400';
            case 'Terlambat':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400';
            case 'Tidak Hadir':
                return 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <>
            <Head title={`Absensi Kelas ${kelas}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" asChild className="h-8 w-8">
                                <Link href="/absensi/rekap">
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Kelas {kelas}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground ml-10">
                            Histori lengkap absensi masuk dan pulang siswa untuk kelas {kelas}.
                        </p>
                    </div>
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle>Histori Absensi</CardTitle>
                        <CardDescription>
                            Gunakan pencarian nama atau filter tanggal untuk mempermudah pengecekan.
                        </CardDescription>
                    </CardHeader>

                    {/* Filter Section */}
                    <div className="px-6 pb-4 flex flex-col sm:flex-row gap-3">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                type="text"
                                placeholder="Cari nama siswa atau NIS..." 
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative w-full sm:w-48">
                            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input 
                                type="date"
                                className="pl-8"
                                value={date}
                                onChange={handleDateChange}
                            />
                        </div>
                        {(search || date) && (
                            <Button 
                                variant="ghost" 
                                onClick={() => {
                                    setSearch('');
                                    setDate('');
                                    applyFilters('', '');
                                }}
                            >
                                Reset Filter
                            </Button>
                        )}
                    </div>

                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px] text-center">No</TableHead>
                                            <TableHead>NIS</TableHead>
                                            <TableHead>Nama Siswa</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Jam Masuk</TableHead>
                                            <TableHead>Jam Pulang</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {absensi.data.length > 0 ? (
                                            absensi.data.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="text-center font-medium">
                                                        {(absensi.current_page - 1) * absensi.per_page + index + 1}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs">{item.siswa?.nis || '-'}</TableCell>
                                                    <TableCell className="font-semibold">{item.siswa?.nama || 'Siswa Belum Terdaftar'}</TableCell>
                                                    <TableCell>{item.tanggal}</TableCell>
                                                    <TableCell className="font-mono text-sm">{item.jam_masuk || '-'}</TableCell>
                                                    <TableCell className="font-mono text-sm">{item.jam_pulang || '-'}</TableCell>
                                                    <TableCell>
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                                                            {item.status || 'Hadir'}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-32 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                                                        <UserX className="h-8 w-8 text-muted-foreground/50 mb-1" />
                                                        <span className="font-semibold text-sm">Tidak Ada Data Absensi</span>
                                                        <span className="text-xs">Data absensi tidak ditemukan untuk filter ini.</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Control */}
                            {absensi.last_page > 1 && (
                                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 py-2">
                                    <div className="text-sm text-muted-foreground">
                                        Menampilkan {absensi.from || 0} hingga {absensi.to || 0} dari {absensi.total} data
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center gap-1">
                                        {absensi.links.map((link, i) => (
                                            link.url ? (
                                                <Button
                                                    key={i}
                                                    asChild
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    className={`h-8 px-3 ${!link.active && "hover:bg-muted"}`}
                                                >
                                                    <Link 
                                                        href={link.url}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                        preserveScroll
                                                    />
                                                </Button>
                                            ) : (
                                                <Button
                                                    key={i}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    className="h-8 px-3 opacity-50"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RekapDetail.layout = {
    breadcrumbs: [
        {
            title: 'Rekap Absensi',
            href: '/absensi/rekap',
        },
        {
            title: 'Detail',
            href: '',
        },
    ],
};
