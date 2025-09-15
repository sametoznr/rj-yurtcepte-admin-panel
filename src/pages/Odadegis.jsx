import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { supabase } from '../../supabaseClient';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AccordionUsage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('odatransferi')
            .select('ogrId, detay, durum, userler!inner(adSoyad, odaNo)')
            .eq('durum', 'Onay bekliyor');

        if (error) {
            toast.error('Veri çekme hatası: ' + error.message);
            setRows([]);
        } else {
            setRows(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleConfirm = async (talep) => {
        const { data: odalar, error: odaErr } = await supabase
            .from('odalar')
            .select('odaNo, dolu_kisi, kapasite');

        if (odaErr) return toast.error('Oda çekme hatası: ' + odaErr.message);

        const mevcutOda = talep.userler?.odaNo;

        const bosOdalar = (odalar || []).filter(o => o.dolu_kisi < o.kapasite && o.odaNo !== mevcutOda);
        if (bosOdalar.length === 0) {
            toast.warning('Boş oda yok!');
            return;
        }

        const randomOda = bosOdalar[Math.floor(Math.random() * bosOdalar.length)];
        const { error: userErr } = await supabase
            .from('userler')
            .update({ odaNo: randomOda.odaNo })
            .eq('userId', talep.ogrId);

        if (userErr) return toast.error('Öğrenci güncellenemedi: ' + userErr.message);

        const { error: odaUpdateErr } = await supabase
            .from('odalar')
            .update({ dolu_kisi: randomOda.dolu_kisi + 1 })
            .eq('odaNo', randomOda.odaNo);

        if (odaUpdateErr) return toast.error('Oda güncelleme hatası: ' + odaUpdateErr.message);

        const { error: talepErr } = await supabase
            .from('odatransferi')
            .update({ durum: 'Onaylandı' })
            .eq('ogrId', talep.ogrId);

        if (talepErr) return toast.error('Talep güncellenemedi: ' + talepErr.message);

        toast.success('Talep onaylandı, öğrenci yeni odaya taşındı');
        fetchData();
    };

    const handleRejected = async (ogrId, currentDurum) => {
        if (currentDurum !== 'Onay bekliyor') return;

        const { error } = await supabase
            .from('odatransferi')
            .update({ durum: 'Reddedildi' })
            .eq('ogrId', ogrId);

        if (error) {
            toast.error('Reddetme işlemi başarısız: ' + error.message);
        } else {
            setRows(prev => prev.map(it => it.ogrId === ogrId ? { ...it, durum: 'Reddedildi' } : it));
            toast.warning('Talep reddedildi');
        }
    };

    if (loading) return <Typography>Yükleniyor...</Typography>;

    return (
        <div >
            <ToastContainer position="bottom-right" />
            {rows.length === 0 && (
                <Typography>Gösterilecek talep yok.</Typography>
            )}
            {rows.map((item) => (
                <Accordion key={item.ogrId} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography component="span">
                            {(item.userler?.adSoyad || '—')} ({item.durum})
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ margin: 5 }}>
                            <Typography>Talep detayı: {item.detay}</Typography>
                            <Typography>Oda No: {item.userler?.odaNo ?? '—'}</Typography>
                        </div>
                    </AccordionDetails>
                    <AccordionActions>
                        <Button variant="contained" onClick={() => handleConfirm(item)}>Onayla</Button>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => handleRejected(item.ogrId, item.durum)}
                        >
                            Reddet
                        </Button>
                    </AccordionActions>
                </Accordion>
            ))}
        </div>
    );
}
