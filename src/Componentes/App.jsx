import { React, useState, useEffect } from 'react';
import {  Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../Routes/ProtectedRoute';
import { useDispatch } from 'react-redux';
import "../Routes/Css/App.css"
import { Login } from '../Routes/Login';
import {setRollerConfig,setRielConfig,setTradicionalConfig} from "../Features/ConfigReducer"
import {setTelasRollerFeature,setTelasTradicionalFeature} from "../Features/TelasReducer"
import { Toaster, toast } from "react-hot-toast";
import { PantallaCorteTela } from '../Routes/PantallaCorteTela';
const App = () => {
    
    const dispatch = useDispatch()

    const [User, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const urlIP = import.meta.env.REACT_APP__IPSQL;
/*
    const UrlTipoConfig = "/ConfiguracionEP"
    const UrlTelas = "/TelasEP"

  */
 const UrlTipoConfig = "http://200.40.89.254:8086/Conf"
    const UrlTelas = "http://200.40.89.254:8086/Telas"
   
    const fetchRollerConf = async () => {
      try {
        const res = await fetch(UrlTipoConfig);
        const data = await res.json();
        return data.body; 
      } catch (error) {
        console.error("Error fetching roller configuration:", error);
        return null; 
      }
    };
    const fetchTelas = async()=>{
        try {
            const res = await fetch(UrlTelas);
            const data = await res.json();
            return data.body; 
        } catch (error) {
            console.error("Error fetching roller configuration:", error);
            return null; 
        }
    }
    useEffect(() => {
      const fetchData = async () => {
        try{
        const config = await fetchRollerConf();
        const telas = await fetchTelas();
        console.log("telas",telas)
        const TelasRoller = telas.filter(tela=>tela.tipo===1)
        console.log("TelasRoller",TelasRoller)
        const TelasTradi = telas.filter(tela=>tela.tipo===2)
        console.log("TelasTradi",TelasTradi)
        if (config) {
          console.log("config",config)

          dispatch(setRollerConfig(config.configuracionRoller)); 
          dispatch(setTradicionalConfig(config.configuracionTradicional))
          dispatch(setRielConfig(config.configuracionRiel)); 
          dispatch(setTelasTradicionalFeature(TelasTradi));
          dispatch(setTelasRollerFeature(TelasRoller))
        }
        }catch{
            toast.error("Error al cargar las configuraciones de los articulos")
        }
      };
    
      fetchData();
    }, []);

    const login = async (usuario) => {
        try {
            const url = `/LoginEp`;
            console.log(url);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
            };
            console.log(usuario)
    
            const response = await fetch(url, requestOptions);
            const result = await response.json();
            console.log(result);
            
            if (result.status!="OK") {
                return result
            } else {
               localStorage.setItem('user', JSON.stringify(result));
               setUser(result)

               window.location.reload();
            }

        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };



    return (
        <div className='AppContainer'>
            <Routes>
                
                <Route path='/Login' element={
                    <ProtectedRoute user={User} login={login}>
                        <Login/>
                    </ProtectedRoute>
                }>
                </Route>
                <Route path='/PantallaCorteTela' element={
                    <ProtectedRoute user={User} login={login}>
                       <PantallaCorteTela/>
                    </ProtectedRoute>} >
                    
                </Route>
                <Route path='/' element={
                    <ProtectedRoute user={User} login={login}>
                       <PantallaCorteTela/>
                    </ProtectedRoute>} >
                    
                </Route>
            </Routes>
            <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
      </div>
            </div>
    );
}

export default App;