import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { supabase } from '../../supabaseClient';
import { useEffect, useState } from 'react';
import Switch from "@mui/material/Switch";
import { toast } from 'react-toastify';


const paginationModel = { page: 0, pageSize: 5 };

export default function IzinOnay() {
    const [tasks, setTasks] = useState([])

    useEffect(() => {
        fetchTasks();
    }, [])

    const fetchTasks = async () => {
        const { data, error } = await supabase.from('izinler').select('*,userler(adSoyad)').eq('durum', 'Onay bekliyor')
        if (error) {
            toast.error("Veriler alınamadı" + error.message)
        } else {
            const transformedData = data.map(item => ({
                ...item,
                adSoyad: item.userler.adSoyad,
            }));
            setTasks(transformedData);
        }
    }

    const handleToggle = async (row) => {
        if (row.durum !== "Onay bekliyor") return;

        const yeniDurum = "Onaylandı";
        const { error } = await supabase
            .from("izinler")
            .update({ durum: yeniDurum })
            .eq("ogrId", row.ogrId)
        if (error) {
            toast.error("Güncelleme hatası: " + error.message);
        } else {
            setTasks(prev =>
                prev.filter(task => task.id !== row.id)

            );
            toast.info(`${row.adSoyad} adlı kişinin izni onaylandı!`);
        }
    };

    const columns = [
        { field: 'adSoyad', headerName: 'AdSoyad', width: 120 },
        { field: 'izinbaslangic', headerName: 'Başlangiç Tarihi', width: 200 },
        { field: 'izinbitis', headerName: 'Bitiş Tarihi', width: 200 },
        { field: 'izindetay', headerName: 'İzinDetay', width: 200 },
        {
            field: "durum",
            headerName: "Durum",
            width: 120,
        }, {
            field: "guncelle",
            headerName: "Güncelle",
            width: 150,
            renderCell: (params) => (
                <Switch
                    checked={false}
                    onChange={() => handleToggle(params.row)}
                />
            )
        }
    ];


    return (
        <Paper
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgb(154, 183, 216)",
            }}
        >
            <div style={{ width: "70%", height: "60vh" }}>
                <div className='flexdire-column'>

                    <h1>İzin Yönetimi</h1>
                </div>
                <DataGrid
                    rows={tasks}
                    columns={columns}
                    getRowId={(row) => row.id}
                    pageSize={5}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                    sx={{ border: 0 }}
                />
            </div>
        </Paper>

    );
}