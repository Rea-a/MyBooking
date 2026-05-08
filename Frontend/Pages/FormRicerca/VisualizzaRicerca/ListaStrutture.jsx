import './ListaStrutture.css'
import Context from "../../Store/Context";
import { useState , useEffect , useContext } from "react";
import {useNavigate} from "react-router-dom";
import HotelCardList from "../HotelCardList/HotelCardList";
import Header from "../../../components/HeaderLogin/HeaderLogin";
import Footer from '../../../components/Footer';



////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


//////////////////////////////////////////////////////////




function ListaStrutture() {

    const { dayRange , setDayRange } = useContext(Context)                              //recupera dayRange dallo stato globale usato con context
    const { structureList , setStructureList} = useContext(Context)                     //recupera le strutture ricercate nello stato in FormRicerca.jsx tramite lo stato globale context
    const [ loadFlag , setLoadFlag ] = useState(false);


    const [emailUtente, setEmailUtente] = useState(null);                               //recupero l'emaiUtente che si è loggato
    const [ruoloUtente, setRuoloUtente] = useState("utente")                            //definisco che la pagina è accessibile solo dall'utente con il ruolo "utente"

    
    const navigate = useNavigate();                                                     //per spostarmi tra le pagine
    const backForm = () => { navigate("/formRicerca") }                                 //se clicco il bottone ritorno alla pagina di ricerca se non ho trovato nulla




    //VERIFICA ARRIVO DATI
    useEffect(() => {                                                                   //appena caricata l'emailUtente visualizzo le struttue che sono state ricercate e salvate 
        if(emailUtente){                                                                //dentro "structureList" (stato globale con context)
            console.log("structureList - Strutture trovate:", structureList)            
            if (!loadFlag) setLoadFlag(true)                                            //setto il fleg di visualizzazione dei casi, se quindi loadFlag era false e quindi impostato
        }                                                                               //ancora al caso in cui non ci sono strutture trovate lo risetta con true mostrando le strutture
    }, [structureList, emailUtente])





////////////////////////////VERIFICA COOKIE - TOKEN/////////////////////////////////////

    useEffect(() => {
        fetch('http://localhost:3000/EmailTokenUtente', {                       //verifico la presenza del token
            credentials: 'include',                                             //necessito che i cookie siano presenti
        })
        .then(res => {                                                          //poi in base alla risposta
            if (!res.ok) {                                                      //se la risposta non è ok e quidni generato errore 401
                console.log("Token non valido o utente non autenticato");       //mi stampa che il token non è più valido o non ci si è autenticati
                navigate("/")                                                   //quindi reindirizza alla pagina iniziale
            }
            return res.json();                                                  //altrimenti restituisco l'oggetto della risposta senza errori
        })
        .then(data => {                                                         //poi in base alla risposta ricevuta (significa che il token è valido)
            if (data.emailUtente) {                                             //controllo in caso di errore nel login, accedendo all'oggetto e verificando l'emailUtente contenuta
                setEmailUtente(data.emailUtente);                               //se esiste un contenuto nella "data" della risposta
                console.log("Email:", data.emailUtente);                        //visualizzo l'email di chi si è loggato
                console.log("Ruolo:", data.ruolo);                              //e il tipo di ruolo con cui si è loggato
                if(data.ruolo !== ruoloUtente){                                 //se il ruolo non corrisponde a quello necessario per esistere in quella pagina allora reindirizza alla pagina iniziale
                    navigate("/");                                              //questo serve per evitare di accedere come "host" in pagine da "utente" e viceversa
                }
            } else {
                navigate("/ErroreLogin");                                       //se non ci si è autenticati e si prova ad andare in una delle pagine che necessitano il login reindirizza alla pagina ErroreLogin
            }
        })
        .catch(err => {
            console.error("Errore nel recupero email dal token:", err);         //alternativamente mi genera un errore del token e mi reindirizza alla pagina ErroreLogin
            navigate("/ErroreLogin");
        });
    }, []);


//////////////////////////////////////////////////////////////////////////////////







    return(
        <>
            <Header/>
                <div id="containerListaStruttura">
                    <div id="titolo-risultato">
                        {
                            loadFlag === true ?                             //verifico il flag se true ho la mia ricerca altrimenti non ho trovato nulla (false)
                                (
                                    Array.isArray( structureList ) ? (     //veifico chiedendomi se "structureList è un array con dei dati, perché se undefined vuol dire che non ha trovato nulla"
                                        <h1>La tua Ricerca <SearchIcon/></h1> ) : <h1>Nessuna Struttura Trovata</h1>    //se non è un array mostra il secondo caso di h1
                                    
                                ) 
                                : null
                        }
                    </div>

                    <div>

                        {
                            loadFlag === true && Array.isArray( structureList ) ? (                         //stessa cosa qui se è true ed è un array mostra il contenuto della ricerca
                            
                                structureList.map( (element , index) => {
                                    return <HotelCardList key={index} structure={element} dayRange={dayRange} />        //passa la struttura come element al modulo esterno HotelCardList.jsx per visualizzarlo
                                })

                            ):(
                                <div id="alertNessunaStrutture">
                                    <p id="testo-ritorna">Per tornare alla ricerca clicca qui</p>
                                    <Button id="button-ritorno-ricerca" onClick={backForm}>                 {/*se non trova nulla ho il button che ritorna indietro*/}
                                        RITORNA
                                        <RestartAltIcon />
                                    </Button>
                                </div>
                                )
                                
                        }

                    </div>
                    
                    

                </div>
                <Footer />
        </>
    )
}

export default ListaStrutture;
