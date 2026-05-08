import React from 'react';
import {useState , useContext , useEffect} from "react";
import { BrowserRouter , Router, Routes, Route, Link , useNavigate} from 'react-router-dom'
import Context from  "../Store/Context";
import './formRicerca.css';
import axios from 'axios'
import Header from "../../components/HeaderLogin/HeaderLogin";
import Footer from "../../components/Footer";
import StrutturaCard from '../../components/Cards/Cards';



////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AlertModifica from "../Alert/AlertModifica/alertModifica";
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Slider from "react-slick";
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//////////////////////////////////////////////////////////





export default function FormRicerca() {

    //USATO PER LA NAVIGAZIONE
    const navigate = useNavigate();                 //per spostarmi tra le pagine
    const [card, setCard] = useState([])            //dove salvo gli hotel recuperati dal DB per visualizzarli nei consigliati
    const [loading, setLoading] = useState(true);   //(TEST)

    //USE CONTEXT
    const { prenotationDate , setPrenotationDate } = useContext(Context)                                                //Date della prenotazione
    const { structureList , setStructureList } = useContext(Context)                                                    //Lista delle struttura date dalla ricerca
    const { userPrenotation , setUserPrenotation } = useContext(Context)                                                //Dati da salvare sulla prenotazione dell'utente   (TEST)
    const { hotelReviews , setHotelReviews } = useContext(Context)                                                      //Dati per la recensione                           (TEST)
    const { dayRange , setDayRange } = useContext(Context)                                                              //Numero di giorni della prenotazione

    const [emailUtente, setEmailUtente] = useState(null);                                                               //per salvare l'email dell'utente loggato
    const [ruoloUtente, setRuoloUtente] = useState("utente")                                                            //stato per gestire che la pagina può essere visualizzabile solo dall'"utente"

    const settings = {          //impostazioni CSS per lo scorrimento dei consigliati preso da Material UI
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerPadding: '40px'

    };


    
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






/////////////////////////////PER VISUALIZZARE IL CONTENUTO DEGLI HOTEL CONSIGLIATI//////////////////////////
        
    useEffect(() => {
        if(emailUtente){                                                        //se emailUtente è pronto
            console.log('Card state modificato:', card);                        //stampo il contenuto del card che corrisponde agli hotel presenti nel DB
            if (card.length === 0) {                                            //se l'array card è vuoto allora lo stampo
                console.trace('Card state è vuoto - stack trace:');
            }
        }
    }, [card, emailUtente]);                                                   //si esegue solo se ho cambiamenti in card o emailUtente



    useEffect(()=>{                                                           
        if(emailUtente){                                                       //quando l'emailUtente è pronta eseguo il contenuto dell'if
            fetch("http://localhost:3000/gestioneStrutture ")                  //faccio una fetch per recuperare il contenuto della risposta
                .then( res => res.json())                                      //poi recupero la risposta
            .then(data => {                                                    //poi dal contenuto data estaggo il valore "items" contenente gli hotel
                setCard(data.items)                                            //li salvo nello stato Card
            }).catch(error => {
                    console.log(error)                                         //in caso di errore
                }
            );
        }
    }, [emailUtente])                                                          //eseguito solo se ho cambiamenti nell'emailUtente

///////////////////////////////////////////////////////////////////////////////////////////////






//////////METODO PER GESTIRE L'INVIO DEL FORM DI RICERCA DEGLI HOTEL/////////////////////////////////////////////////

    const handleSubmitMainForm = (event) => {
        event.preventDefault();                                     //evito l'aggiornamento della pagina

        setPrenotationDate({...prenotationDate, dataArrivo: event.target.dataArrivo.value, dataPartenza: event.target.dataPartenza.value})  //Salvo: dataArrivo - dataPartenza
        
        console.log("data partenza: ", event.target.dataPartenza.value, "data arrivo: ", event.target.dataArrivo.value)     //visualizzo le date scelte
        console.log("dayRange: ", dayRange)                                                                                 //visualizzo la differenza delle due date


        const request = {                                                                                                   //Costruisco l'oggetto per la richiesta
            ospiti: event.target.numeroOspiti.value ,
            city: event.target.destinazione.value,
            dataArrivo: event.target.dataArrivo.value,
            dataPartenza: event.target.dataPartenza.value
        }
        asyncRicercaStruttura(request)                                                                                     //richiamo la funzione di sotto
        navigate( '/visualizzaRicerca')                                                                                    //dopo la ricerca visualizzo la lista delle strutture trovate
    }




    async function asyncRicercaStruttura(formData) {
        const request = await axios.post ( ' http://localhost:3000/hotel/ricerca' ,                                       //eseguo un Axios post che richiamata nel backend i file RoutingHotel.cjs (in cui è presente solo "/ricerca")
            {
                numeroOspiti: formData.ospiti,
                citta: formData.city,
                dataArrivo: formData.dataArrivo ,
                dataPartenza: formData.dataPartenza
            });
        if( request.data.lista !== null ){
            setStructureList( request.data.lista )                                                                          //Lista delle strutture trovate
        }
        if( request.data.dayRange !== null){
            setDayRange( request.data.dayRange )                                                                            //Giorni fra arrivo e partenza
        }
    }


/////////////////////////////////////////////////////////////////////////////////////////////////































  return (
    <>
        <Header/>

        <div id='allineamento-tutto'>
            <div id="posizionamento-elementi">
                <h1 id="titolo-ricerca">
                    Ricerca il tuo Hotel
                    <SearchIcon id="icona-ricerca"/>
                </h1>

                <div>
                    <form onSubmit={handleSubmitMainForm}>
                    
                            <Card sx={{ minWidth: 450} } elevation={8} id="box-ricerca">    {/*elevation mi crea ombra sotto il box*/}
                            
                                    <div id="raggruppamento-ricerca">
                                        <div id="date-ricerca">
                                            <div id="dataPartenzaContainerApp">
                                                <label htmlFor="dataArrivo" className="labelFormStartApp" id='daapartenzascirtta'>Data Arrivo: </label>
                                                <input type="date" name="dataArrivo" id="dataArrivo" className="inputFormStartApp" required/>
                                            </div>

                                            <div id="dataArrivoContainerApp">
                                                <label htmlFor="dataPartenza" className="labelFormStartApp">Data Partenza: </label>
                                                <input type="date" name="dataPartenza" id="dataPartenza" className="inputFormStartApp" required/>
                                            </div>

                                        </div>
                                        

                                        <div id="posto-ricerca">
                                            <TextField id="destinazione-ricerca" label="Destinazione: " name='destinazione' required/>
                                            <TextField id="ospiti-ricerca" label="Numero Ospiti: " name="numeroOspiti" required/>
                                        </div>

                                        
                                    </div>

                                <div id="raggruppamento-button">
                                    <Button id="reset-button-ricerca" type="reset" variant="contained">Reset</Button>
                                    <Button id="cerca-button-ricerca" type="submit" variant="contained">Cerca</Button>
                                </div>

                            </Card>
                    
                    </form>
                </div>
                    
            </div>
                
            



            <div id="insieme-consigliati">
                <Box sx={{mb: 6}}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 3}} id="box-struttureconsigliate">

                            <StarIcon sx={{color : '#FFD700', mr: 1, fontSize: 30}} />

                            <div id='posizionescrittaconsigliato'>
                                <Typography variant="h4" component="h2" gutterBottom >
                                    Strutture Consigliate:
                                </Typography>
                            </div>
                            

                            <Chip
                                label="Popolari"
                                color="primary"
                                sx={{ ml: 2 }}
                                icon={<StarIcon />}
                            />

                        </Box>


                        <Box sx={{
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                            borderRadius: 2,
                            p: 3,
                            mb: 2
                        }} id="box-carosello">

                            <Slider {...settings}>                    {/*passo impostazioni css tramite "settings" */}                              
                                {[...card]                            //crea una copia dell’array card (che contiene le strutture da mostrare), evita di modificare l’array originale con sort()
                                    .sort(() => Math.random() - 0.5)  //mischia gli elementi, restituisce un numero casuale tra 0 e 1 quindi sottraendo -0,5 se il numero è negativo allora "a" prima di "b" 
                                                                      //se positivo "a" dopo "b"
                                    .slice(0, 9)                      // prende solo i primi 9
                                    .map(struttura => (
                                        <div key={struttura._id}>
                                        <StrutturaCard
                                            struttura={struttura}
                                            showModificaButton={false}
                                        />
                                        </div>
                                    ))}

                            </Slider>

                        </Box>
                    </Box>
            </div>
        </div>  
        

            





              <Footer />

    </>
  );
}

