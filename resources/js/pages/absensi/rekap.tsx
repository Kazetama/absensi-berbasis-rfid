import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, Calendar, ArrowRight } from 'lucide-react';

interface ClassSummary {
    kelas: string;
    total_siswa: number;
    total_absen: number;
    hadir_hari_ini: number;
}

interface Props {
    classes: ClassSummary[];
}

export default function RekapAbsensi({ classes }: Props) {
    return (
        <>
            <Head title="Rekap Absensi Kelas" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Rekap Absensi Kelas
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Pilih kelas untuk melihat histori dan detail absensi siswa secara berkala.
                    </p>
                </div>

                {classes.length === 0 ? (
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm flex flex-col items-center justify-center p-12 text-center">
                        <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <CardTitle className="mb-2 text-lg">Belum Ada Data Kelas</CardTitle>
                        <CardDescription>
                            Pastikan data siswa telah diinput dan memiliki kelas yang terdaftar.
                        </CardDescription>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {classes.map((c) => (
                            <Link 
                                key={c.kelas}
                                href={`/absensi/rekap/${encodeURIComponent(c.kelas)}`}
                                className="group block focus:outline-none"
                            >
                                <Card className="h-full border-sidebar-border/70 dark:border-sidebar-border shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50 group-focus:ring-2 group-focus:ring-primary overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <GraduationCap className="h-24 w-24 text-primary" />
                                    </div>
                                    
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                                Kelas Aktif
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                        <CardTitle className="text-xl font-bold mt-2 group-hover:text-primary transition-colors">
                                            Kelas {c.kelas}
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent className="pt-2 flex flex-col gap-4">
                                        <div className="grid grid-cols-2 gap-4 border-t border-muted/50 pt-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                                    <Users className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">Siswa</span>
                                                    <span className="text-sm font-semibold">{c.total_siswa} orang</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 rounded-md bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400">
                                                    <Calendar className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-muted-foreground">Hari Ini</span>
                                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                        {c.hadir_hari_ini} hadir
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-muted/40 rounded-lg px-3 py-2 flex justify-between items-center text-xs mt-2">
                                            <span className="text-muted-foreground">Total Absensi Keseluruhan:</span>
                                            <span className="font-semibold text-foreground">{c.total_absen} record</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

RekapAbsensi.layout = {
    breadcrumbs: [
        {
            title: 'Rekap Absensi',
            href: '/absensi/rekap',
        },
    ],
};
