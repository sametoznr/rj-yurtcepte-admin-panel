import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HandymanIcon from '@mui/icons-material/Handyman';
import CampaignIcon from '@mui/icons-material/Campaign';
import HotelIcon from '@mui/icons-material/Hotel';
import FlatwareIcon from '@mui/icons-material/Flatware';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';



const cards = [
    { id: 1, title: 'İzin Onayları', icons: <CalendarMonthIcon />, path: '/izin-onayi' },
    { id: 2, title: 'Arıza Takibi', icons: <HandymanIcon />, path: '/ariza-takibi' },
    { id: 3, title: 'Duyuru', icons: <CampaignIcon />, path: '/duyuru' },
    { id: 4, title: 'Yemek Menüsü', icons: <FlatwareIcon />, path: '/yemek-listesi' },
    { id: 5, title: 'Oda Değişikliği', icons: <HotelIcon />, path: '/oda-degis' },
];

function SelectActionCard() {
    const [selectedCard, setSelectedCard] = React.useState(0);
    const navigate = useNavigate()
    const authUser = useSelector((state) => state.auth.user)
    const [adSoyad, setAdSoyad] = useState("")

    useEffect(() => {
        if (authUser) {
            const fetchadSoyad = async () => {
                const { data, error } = await supabase
                    .from('userler')
                    .select('adSoyad')
                    .eq('userId', authUser.id)
                    .single()
                setAdSoyad(data.adSoyad)
            }
            fetchadSoyad()
        }
    }, [authUser])
    const dispatch = useDispatch()

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error("Çıkış yapma hatası" + error.message)
        } else {
            dispatch(logout())
            toast.success("Başarıyla çıkış yaptınız")
        }

    }

    return (
        <div className='home-cont flexdire-column'>


            <h3 style={{ color: '#fff' }}>Hoşgeldiniz {adSoyad} </h3>


            <Box
                sx={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
                    gap: 3,
                    maxWidth: 400,
                    margin: '0 auto',
                    padding: 2,
                }}
            >
                {cards.map((card, index) => (
                    <Card key={index}>
                        <CardActionArea
                            onClick={() => {
                                setSelectedCard(index)
                                navigate(card.path)
                            }
                            }
                            data-active={selectedCard === index ? '' : undefined}
                            sx={{
                                height: '100%',
                                '&[data-active]': {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {
                                        backgroundColor: 'action.selectedHover',
                                    },
                                },
                            }}
                        >
                            <CardContent sx={{ height: '100%', textAlign: 'center', }}>
                                <Typography variant="h5" component="div">
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.icons}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
                <Button variant='contained' color='success' onClick={handleLogout} endIcon={<LogoutIcon />}>Çıkış yap</Button>
            </Box>
        </div>
    );
}

export default SelectActionCard;
