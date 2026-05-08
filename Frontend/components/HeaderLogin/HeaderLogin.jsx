import './headerLogin.css'
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';



////////////////MaterialUI Components//////////////////////

import Button from '@mui/material/Button';

//////////////////////////////////////////////////////////



function  Header() {

    const navigate = useNavigate();                 //per spostarmi tra le pagine



////////////////////////////VERIFICA COOKIE - TOKEN/////////////////////////////////////

    const handleLogout = async () => {
    try {
        await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });    // struttura axios.post(url, data, config)  config voglio includere i cookie con il token
        navigate('/login');
    } catch (error) {
        console.error('Errore durante il logout:', error);
    }
    };

////////////////////////////////////////////////////////////////////////////////////////

    


 return (
     <>
         <nav id='headerCompleto-Login'>
            <img id="logo-header-login"
                src="/logo_immagina_myBooking.png"
                alt="Logo"
                href="./"/>

             <ul className="h3">
                <Button id="ricerca-button-header" type="button"  variant="outlined" onClick={() => navigate("/formRicerca")}>Ricerca</Button>
                 <Button id="login-button-header" type="button"  variant="outlined" onClick={() => navigate("/profiloUtente")}>Profilo</Button>
                 <Button id="registrati-button-header" type="button"  variant="outlined" onClick={handleLogout}>Logout</Button>
             </ul>
             </nav>

         </>)
         
}

export default Header;