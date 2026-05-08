import {useNavigate} from "react-router-dom";
import "./erroreLogin.css";

export default function ErroreLogin() {

    const navigate = useNavigate();

    return (
        <>
            <div id="allineamento-errori">
                <h1>ERRORE LOGIN</h1>
                <button id="bottone-ritorno-login" onClick={() => {navigate("/")}}>Ritorna all'inizio</button>
            </div>
        </>
    );
}
