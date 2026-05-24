export interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface Siswa {
    id: number;
    uid_kartu: string;
    nama: string | null;
    gambar: string | null;
    nis: string | null;
    nomor_orangtua: string | null;
    alamat: string | null;
    kelas: string | null;
    created_at: string;
    updated_at: string;
}
