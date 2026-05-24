import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { PaginatedData, Siswa } from "@/types/siswa";
import { SiswaTableRow } from "./siswa-table-row";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export function SiswaTable({ siswas }: { siswas: PaginatedData<Siswa> }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] text-center">No</TableHead>
                        <TableHead>UID Kartu</TableHead>
                        <TableHead>NIS</TableHead>
                        <TableHead>Nama Siswa</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>No. Telepon</TableHead>
                        <TableHead>Status Data</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {siswas.data.length > 0 ? (
                        siswas.data.map((siswa, index) => (
                            <SiswaTableRow key={siswa.id} siswa={siswa} index={(siswas.current_page - 1) * siswas.per_page + index} />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                Belum ada data siswa terdaftar.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Kontrol Pagination */}
        {siswas.last_page > 1 && (
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 py-2">
                <div className="text-sm text-muted-foreground">
                    Menampilkan {siswas.from || 0} hingga {siswas.to || 0} dari {siswas.total} data
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1">
                    {siswas.links.map((link, i) => (
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
    );
}
