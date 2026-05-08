import { TextField, Button, Box } from '@mui/material';
import {useState , useEffect} from "react";
import "./home.css"
import {useNavigate} from "react-router-dom";

function Home () {

    const navigate = useNavigate();                                     //lo uso per spostarmi tra le pagine


    const [emailUtente, setEmailUtente] = useState(null);
    const [flag, setFleg] = useState(0);                                //flag per gestire il reindirizzamento nelle pagine dalla pagina iniziale in base al ruolo di login che è stato effettuato
    const [ruoloUtente, setRuoloUtente] = useState("utente")



    ////////////////////////////VERIFICA COOKIE - TOKEN/////////////////////////////////////

    useEffect(() => {
            
            fetch('http://localhost:3000/EmailTokenUtente', {           //recupera email dal token nel cookie
            credentials: 'include',                                     //necessito che i cookie siano presenti
            })
            .then(res => res.json())                                    //poi estraggo i dati json dalla risposta
            .then(data => {                                             //poi lavoro sui dati recuperati
                if (data.emailUtente) {                                 //se i dati esistono signfica che c'è stato già il login 
                    console.log("Utente già autenticato");              
                    if(data.ruolo === ruoloUtente){                     //recupero dal "data" il ruolo restituito se è inizialmente uguale a "utente"
                        setFleg(1)                                      //imposto il flag a 1
                    }else{
                        setFleg(2)                                      //altrimenti a 0 se si tratta di un "host"
                    } 
                }else{
                    setFlag(0)                                          //se non è stato effettuato il login reimposta la pagina al reindirizzamento originario
                }
            })
            .catch(err => console.error("Errore nel recupero email dal token:", err));      //stampa in caso di eventuali errori
    }, []);
    
    
    //////////////////////////////////////////////////////////////////////////////////




    return (
        <>
            <div className="home">
                <div className="home-content">
                    <h1 id='benvenuto'>Benvenuto su MyBooking</h1>
                    <p id='sottotitolo'>Trova la tua prossima avventura, al miglior prezzo</p>

                    {
                        flag === 0 ? (                                                                                    //se il flag è zero allora No login e reindirizza alla pagina di login
                            <Button id="bottone-home" variant="contained" onClick={() => navigate('/login')}>
                                Cerca il tuo viaggio
                            </Button>
                        ) : (
                            flag === 1 ? (                                                                               //se 1 login come "utente" e reindirizza alla pagina di ricerca degli hotel
                                <Button id="bottone-home" variant="contained" onClick={() => navigate('/formRicerca')}>
                                    Cerca il tuo viaggio
                                </Button>
                            ) : (                                                                                       //altrimenti 2 come "host" e quindi reindirizza alla pagina di gestione delle strutture
                                <Button id="bottone-home" variant="contained" onClick={() => navigate('/profilo/gestioneStruttura')}>
                                    Cerca il tuo viaggio
                                </Button>
                            )
                        )

                        
                    }

                    
                </div>
            </div>
        </>
    )
}
export default Home
