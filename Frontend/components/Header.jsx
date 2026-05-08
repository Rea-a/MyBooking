import './Header.css'
import {Link, useNavigate} from "react-router-dom";



////////////////MaterialUI Components//////////////////////

import Button from '@mui/material/Button';

//////////////////////////////////////////////////////////



function  Header() {

    const navigate = useNavigate();


 return (
     <>
         <nav id='headerCompleto'>


            <img id="logo-header-primo"
                src={"/logo_immagina_myBooking.png"}
                alt="Logo"/>


             
             <ul className="h3">
                 <Button id="login-button-header" type="button"  variant="outlined" onClick={() => navigate("/login")}>Login</Button>
                 <Button id="registrati-button-header" type="button"  variant="outlined" onClick={() => navigate("/registrazione")}>Registrati</Button>
             </ul>
             </nav>

         </>)
         
}

export default Header;