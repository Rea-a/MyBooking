import './mainRegistrazione.css'
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from "react";

function MainRegistrazione() {
    const navigate = useNavigate();                                     //navigate per spostarmi tra le pagine


    
    const [emailUtente, setEmailUtente] = useState(null);
    


    

    ////////////////////////////VERIFICA COOKIE - TOKEN/////////////////////////////////////

    useEffect(() => {
            
            fetch('http://localhost:3000/EmailTokenUtente', {           //recupera email dal token nel cookie
            credentials: 'include',                                     //necessito che i cookie siano presenti
            })
            .then(res => res.json())                                    //poi estraggo i dati json dalla risposta
            .then(data => {                                             //poi lavoro sui dati recuperati
                if (data.emailUtente) {                                 //se i dati esistono signfica che c'è stato già il loggin quindi l'utente non può stare
                    console.log("Utente già autenticato");              //in quella pagina e deve tornare alla pagina iniziale
                    navigate("/")
                }
            })
            .catch(err => console.error("Errore nel recupero email dal token:", err));      //altrimenti genera un errore nel recupero della email dal token
    }, []);
    

    ///////////////////////////////////////////////////////////////////////////////////////






    

    return (
        <>
            <Header />

            <div className="register-container">
                <h2 className="register-title">Scegli come registrarti</h2>
                <div className="register-group">
                    <div className="register-c" onClick={() => navigate('/registrazione/proprietarioStruttura')}>
                        <h3>🏨 Proprietario Struttura</h3>
                        <p>Metti la tua struttura sotto i riflettori: accetta prenotazioni in modo facile e veloce.</p>
                    </div>
                    <div className="register-c" onClick={() => navigate('/registrazione/utente')}>
                        <h3>👤 Utente</h3>
                        <p>La tua prossima esperienza di viaggio inizia qui, semplice e veloce.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
export default MainRegistrazione;