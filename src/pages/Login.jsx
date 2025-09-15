import React, { useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { useState } from 'react'
import { Button } from '@mui/material'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';




function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            toast.warning(error.message)
        } else {
            const { data: userData, error: useErr } = await supabase
                .from('userler')
                .select('rol')
                .eq('userId', data.user.id)
                .single()
            if (userData.rol === 'admin') {
                dispatch(login(data.user))
                toast.success("Giriş Başarılı ")
            } else {
                toast.error("Bu panele giriş yetkiniz yoktur!")
                await supabase.auth.signOut()
            }

        }
    }

    return (
        <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
        >
            <div className='div-container flexdire-column'>
                <div className='form-container flexdire-column'>
                    <h2>Yurt Cep-te <br />Yönetici Paneli</h2>


                    <TextField
                        id="outlined-required"
                        label="Email"
                        size='small'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        size='small'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />



                    <Button sx={{ marginTop: 3, }} variant='contained' onClick={handleLogin} color='success' size='medium'>Giriş Yap</Button>


                </div>
            </div>
        </Box>
    )
}

export default Login