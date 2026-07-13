import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { PaginatedData, Mahasiswa } from '@/types/mahasiswa';
import { MahasiswaTableRow } from './mahasiswa-table-row';

export function MahasiswaTable({ mahasiswas }: { mahasiswas: PaginatedData<Mahasiswa> }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] text-center">
                                No
                            </TableHead>
                            <TableHead>UID Kartu</TableHead>
                            <TableHead>NIM</TableHead>
                            <TableHead>Nama Mahasiswa</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead>No. Telepon</TableHead>
                            <TableHead>Status Data</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mahasiswas.data.length > 0 ? (
                            mahasiswas.data.map((mahasiswa, index) => (
                                <MahasiswaTableRow
                                    key={mahasiswa.id}
                                    siswa={mahasiswa}
                                    index={
                                        (mahasiswas.current_page - 1) *
                                            mahasiswas.per_page +
                                        index
                                    }
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-24 text-center"
                                >
                                    Belum ada data mahasiswa terdaftar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Kontrol Pagination */}
            {mahasiswas.last_page > 1 && (
                <div className="flex flex-col-reverse items-center justify-between gap-4 py-2 sm:flex-row">
                    <div className="text-sm text-muted-foreground">
                        Menampilkan {mahasiswas.from || 0} hingga {mahasiswas.to || 0}{' '}
                        dari {mahasiswas.total} data
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {mahasiswas.links.map((link, i) =>
                            link.url ? (
                                <Button
                                    key={i}
                                    asChild
                                    variant={
                                        link.active ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    className={`h-8 px-3 ${!link.active && 'hover:bg-muted'}`}
                                >
                                    <Link
                                        href={link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
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
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
