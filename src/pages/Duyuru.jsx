import React, { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import dayjs from 'dayjs'



function Duyuru() {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [showDate, setShowDate] = useState(dayjs())
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            toast.warning("Tüm alanları doldurunuz!")
            return
        }
        setLoading(true);

        const { data, error } = await supabase
            .from("duyurular")
            .insert([{ title, content, show_date: showDate.format('YYYY-MM-DD') }])

        setLoading(false)

        if (error) {
            toast.error(error.message)
        } else {
            toast.info("Duyuru eklendi")
            setTitle("")
            setContent("")
            setShowDate(dayjs())
        }
    }
    return (
        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '40ch' } }}
            noValidate
            autoComplete="off"
        >
            <div className='duyuru-cont flexdire-column '>
                <div className='duyuru-form flexdire-column'>
                    <h2 >Duyuru Ekleyiniz</h2>
                    <TextField id="standard-basic" label="Başlık" variant="standard" size='small'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={showDate}
                            onChange={(newValue) => setShowDate(newValue)}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    sx: { width: 360 },

                                },
                                openPickerIcon: {
                                    color: 'primary',

                                },

                            }}

                        />
                    </LocalizationProvider>
                    <TextField
                        id="outlined-multiline-static"
                        label="Duyuru giriniz..."
                        multiline='false'
                        rows={9}
                        size='medium'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <Button variant='contained' size='medium' sx={{ width: 360 }} onClick={handleSubmit}>Yayınla </Button>
                </div>
            </div>

        </Box>
    )
}

export default Duyuru