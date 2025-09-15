import React, { useState } from 'react'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { supabase } from '../../supabaseClient'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function YemekList() {

    const [sabah, setSabah] = useState("")
    const [aksam, setAksam] = useState("")
    const [showDate, setShowDate] = useState(dayjs())
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!sabah.trim() || !aksam.trim()) {
            toast.warning("Tüm alanları doldurunuz !")
            return;
        }
        setLoading(true)

        const { data, error } = await supabase
            .from("yemeklist")
            .insert([{ sabah, aksam, show_date: showDate.format('YYYY-MM-DD') }])

        setLoading(false)

        if (error) {
            toast.error(error.message)
        } else {
            toast.info("Günün menüsü eklendi")
            setSabah("")
            setAksam("")
            setShowDate(dayjs())
        }

    }

    return (
        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '30ch' } }}
            noValidate
            autoComplete="off"
        >
            <div className='duyuru-cont flexdire-column'>
                <div className='yemek-form flexdire-column'>
                    <h1>Yemek Menüsü</h1>
                    <TextField
                        id="standard-basic"
                        label="Sabah yemeği"
                        variant="standard"
                        value={sabah}
                        onChange={(e) => setSabah(e.target.value)}
                    />
                    <TextField
                        id="standard-basic"
                        label="Akşam yemeği"
                        variant="standard"
                        value={aksam}
                        onChange={(e) => setAksam(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={showDate}
                            onChange={(newValue) => setShowDate(newValue)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                },
                                openPickerIcon: {
                                    color: 'primary',
                                },
                            }} />
                    </LocalizationProvider>
                    <div style={{ marginTop: 10 }}>

                        <Stack direction="row" spacing={2}>
                            <Button onClick={handleSubmit} variant="contained" endIcon={<SendIcon />}>
                                Yayınla
                            </Button>
                        </Stack>
                    </div>
                </div>
            </div>
        </Box>
    )
}

export default YemekList