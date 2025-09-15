
import './App.css'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Ariza from './pages/Ariza';
import Duyuru from './pages/Duyuru';
import Odadegis from './pages/Odadegis';
import YemekList from './pages/YemekList';
import IzinOnay from './pages/IzinOnay';
import ProcectRoute from './compononets/ProcectRoute';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../supabaseClient';
import { useEffect } from 'react';
import { login, logout } from './store/authSlice';


function App() {

  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(login(session.user))
      } else {
        dispatch(logout())
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(login(session.user))
      } else {
        dispatch(logout())
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={user ? <Home /> : <Login />} />
        <Route path='/home' element={<ProcectRoute> <Home /> </ProcectRoute>} />
        <Route path='ariza-takibi' element={<ProcectRoute> <Ariza /> </ProcectRoute>} />
        <Route path='duyuru' element={<ProcectRoute> <Duyuru /> </ProcectRoute>} />
        <Route path='oda-degis' element={<ProcectRoute>  <Odadegis /> </ProcectRoute>} />
        <Route path='yemek-listesi' element={<ProcectRoute> <YemekList /> </ProcectRoute>} />
        <Route path='izin-onayi' element={<ProcectRoute> <IzinOnay /> </ProcectRoute>} />
      </Routes>

    </div>
  )
}

export default App
