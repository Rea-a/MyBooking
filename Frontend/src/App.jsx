import { useState, useEffect } from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
import './App.css'
import Context from '../Pages/Store/Context'
import axios from 'axios';



////////////////IMPORT DELLE SINGOLE PAGINE CHE VOGLIO VISUALIZZARE//////////////////////

import MainRegistrazione from "../Pages/MainRegistrazione/MainRegistrazione"
import RegistrazioneStruttura from "../Pages/RegistrazioneStruttura/RegistrazioneStruttua"
import GestioneStruttura from "../Pages/GestioneStruttura/GestioneStruttura"
import RegistrazioneUtente from "../Pages/RegistrazioneUtente/RegistrazioneUtente"
import Login from "../Pages/Login/Login"
import FormRicerca from '../Pages/FormRicerca/FormRicerca';
import ListaStrutture from '../Pages/FormRicerca/VisualizzaRicerca/ListaStrutture';
import Home from "../Pages/Home/Home"
import Prenotazione from "../Pages/FormRicerca/PrenotazioneRegistrazione/HotelPage"
import ProfiloUtente from "../Pages/ProfiloUtente/ProfiloUtente"
import PaginaNonTrovata from '../components/PaginaNonTrovata/PaginaNonTrovata';
import ErroreLogin from '../components/ErroreLogin/ErroreLogin';
import Chat from '../components/Chat/Chat';

////////////////////////////////////////////////////////////////////////////////////////








export default function App() {

    const navigate = useNavigate();

    const [ userPrenotation , setUserPrenotation ]  = useState( [] );                                             //Array con le prenotazioni dell'utente
    const [ structureList , setStructureList ] = useState( [] );                                                  //Lista delle strutture che corrispondono alla ricerca
    const [ dayRange , setDayRange ] = useState( 0 );                                                             //Range di giorni della prenotazione
    const [ hotelReviews , setHotelReviews ] = useState(                                                          //Oggetto per le prenotazioni  (TEST)
        {
            nomeHotel: '',
            cittaHotel: '' ,
            voto: 0 ,
            emailUtente: '' ,
            corpoRecensione: '' ,
            descrizioneHotel: '' ,
            immagineHotel: '' ,
            viaHotel: ''
        }
    );
    const [ showErrorRecensione , setShowErrorRecensione] = useState(0)                                           //Salvo l'exit code per gestire gli errori
    const [ userData , setUserData ] = useState(                                                                  //Salvo le informazioni sull'utente loggato   (TEST)
        {
            emailUtente: "lucapalmisano" ,
            nomeCompletoUtente: "" ,
            immagineProfiloUtente: ""
        });
    const [ hotelPrenotation , setHotelPrenotation ] = useState( {} )                                    //Dati per visualizzare un hotel intero
    const [ prenotationDate , setPrenotationDate ] = useState( {                                         //Mantengo salvate le informazioni su data di Arrivo e di Partenza
        dataArrivo: "" ,
        dataPartenza: ""
    } )









    //STATO PER I COOKIE
    const [user, setUser] = useState(null);   
    const [host, setHost] = useState(null);

    





    useEffect( 
        () => { firstRenderAutentication() }    // useEffect eseguo il PRIMO render per la pagina
    ,[] )



    useEffect(() => {
        console.log("Dati Host:", host, "Dati User:", user);
    }, [host, user]);                                        //se ci sono dei cambiamenti nei due parametri allora visualizzo da console i risultati che sono stati impostati





    const firstRenderAutentication = async () => {
        try{
        const request = await axios.post('http://localhost:3000/firstRenderAuthentication');        //Verifica all'accesso del sito se si è loggati come host, come utenti o se non si è loggati

        console.log(`Messaggio dal server: ${request.data.message}`)                                

        if( request.data.User ){
            setUser(request.data.User);
            setHost(null);
            navigate("/profiloUtente")
        } else if( request.data.Host ){ 
            setHost(request.data.Host);
            setUser(null);
            navigate("/profilo/gestioneStruttura")
        } else {
            setHost(null);
            setUser(null);
        }
        } catch (err) { console.log(`Errore: ${err}`) }
    }




















  return (
      <>
          <Context.Provider value={ {userPrenotation , setUserPrenotation , hotelReviews , setHotelReviews , userData , setUserData , structureList , setStructureList , showErrorRecensione , setShowErrorRecensione , dayRange , setDayRange , hotelPrenotation , setHotelPrenotation , prenotationDate , setPrenotationDate, host, setHost, user, setUser} }>
          
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/registrazione" element={<MainRegistrazione/>} />
                <Route path="/registrazione/proprietarioStruttura" element={<RegistrazioneStruttura />} />
                <Route path="/profilo/gestioneStruttura" element={<GestioneStruttura/>} />
                <Route path="/registrazione/utente" element={<RegistrazioneUtente />} />
                <Route path="/login" element={<Login />} />
                <Route path="/formRicerca" element={<FormRicerca />} />
                <Route path="/visualizzaRicerca" element={<ListaStrutture />} />
                <Route path="/prenotazione" element={<Prenotazione />} />
                <Route path="/profiloUtente" element={<ProfiloUtente />} />
                <Route path="/*" element={<PaginaNonTrovata />} />
                <Route path="/erroreLogin" element={<ErroreLogin />} />
                <Route path="/chat/:emailDestinatario" element={<Chat />} />
            </Routes>

          </Context.Provider>
      </>
  );
}
