import './hotelPage.css'
import Context from '../../Store/Context'
import {useContext, useEffect, useState} from "react";
import axios from "axios"
import {useNavigate} from "react-router-dom";
import Header from "../../../components/HeaderLogin/HeaderLogin";
import Footer from "../../../components/Footer"
import Recensioni from '../../Recensioni/Recensioni';




////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

//////////////////////////////////////////////////////////



function HotelPage() {

    const navigate = useNavigate();                                                                     //Metodo per navigare fra le pagine

    /* DATI PRELEVATI DAL CONTEXT */
    const { prenotationDate } = useContext(Context);                                                    //Data Arrivo - Data Partenza
    const { userData } = useContext(Context);                                                           //Informazioni sull'utente
    const { dayRange } = useContext(Context);                                                           //Numero di giorni per cui si vuole prenotare
    const { hotelPrenotation , setHotelPrenotation } = useContext( Context )                            //Informazioni su hotel da prenotare

    const [ loadFlag , setLoadFlag ] = useState(false)                                                  //Flag per controllare aggiornamento dei dati

    const [emailUtente, setEmailUtente] = useState(null);                                               //recupero l'emailUtente loggato
    const [ruoloUtente, setRuoloUtente] = useState("utente")                                            //verifico il ruolo che può accedere a questa pagina








    const [dataHotelRecensioni, setdataHotelRecensioni] = useState({                     //salvo in uno state l'id dell'utente per poi visualizzare le recensione se clicco il button
        idHotel: ""
    })  

    const[flag, setFlag] = useState(0);                                                 //stato per flag per visualizzare o meno il popup recensioni




        


////////////VERIFICO L'AGGIORNAMENTO DEI DATI - TEST VISUALIZZAZIONE////////////////////////////////////////
    useEffect(() => {
        if(emailUtente){                                                                   
            if( loadFlag === false ){
                console.log("hotelPrenotation - Dati prenotazione: ", hotelPrenotation)
                console.log("prenotationDate - Dati prenotazione: ", prenotationDate)
                console.log("Pagina Prenotazione - dayRange:", dayRange);
                setLoadFlag(true)
                console.log("ID HOTEL: ", hotelPrenotation._id)
            }
        }
        
    }, [ hotelPrenotation,  emailUtente]);                                        //quando lo state ha i dati

////////////////////////////////////////////////////////////////////////////////////






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






//////////////77METODO PER PRENOTARE////////////////////////////////////////////

    const handlePrenotation = async (e) => {


        try{
            const dbRequest = await axios.post('http://localhost:3000/prenotazione/struttura',{  //eseguo una Axios Post per l'inserimento
                dataArrivo: prenotationDate.dataArrivo,
                dataPartenza: prenotationDate.dataPartenza,
                nome_hotel: hotelPrenotation.nome_hotel,
                cittaHotel: hotelPrenotation.citta,
                emailUtente: emailUtente ,
                giorniTotali: dayRange
            })
            console.log("Sono fuori la request!")
            setHotelPrenotation( null )                                                       //azzero le informazioni dello stato globale riguardate l'hotel appena prenotato
            navigate( '/profiloUtente')                                                       //reindirizzo verso il profilo dell'Utente
        } catch (error){
            console.log("Errore nella prenotazione: ", error.message || error);
        }
    }


////////////////////////////////////////////////////////////////////////////////////////////////////






    return(
        <>
            {
                loadFlag === true ?
                    <div>

                        

                        <Header />
                        

                        <div id="posizione-prenotazione-box">
                            <Card id="box-hotelcardlist" sx={{ width: 900, height: 500 }} key={hotelPrenotation.id}>
                
                                <div id="container-hotel">

                                    <div id="immagine-hoterlcardlist">
                                        <img
                                            id="img-modifica"
                                            src={hotelPrenotation.img || " "}
                                            alt={"Hotel " + hotelPrenotation.nome_hotel}
                                        />
                                    </div>


                                    <div id="descrizione-hotelcardlist">
                                        <div id="contenitore-descrizione-hotelcardlist">
                                            <ul id="listadescrizione">
                                                <li key={hotelPrenotation.id}><h3>Hotel {hotelPrenotation.nome_hotel}</h3></li>
                                                <li>Città: {hotelPrenotation.citta}, via {hotelPrenotation.via}</li>
                                                <li>Descrizione: {hotelPrenotation.descrizione}</li>
                                                <li>Numero Giorni Scelti: {dayRange}</li>
                                                <li>Prezzo a Notte: {hotelPrenotation.prezzo_a_notte} €</li>
                                                <li>Prezzo Totale: {Number(hotelPrenotation.prezzo_a_notte) * Number(dayRange)} €</li>
                                            </ul>
                                        </div>

                                        <div id="posizione-scopridipiu">
                                            <Button 
                                                id="button-hotelcardlist-recensione" 
                                                type="button"  
                                                variant="outlined" 
                                                onClick={() => {             //se clicco salvo l'id dell'hotel nello stato per visualizzare le recensioni inerenti
                                                    setdataHotelRecensioni({ ...dataHotelRecensioni, idHotel: hotelPrenotation._id}); 
                                                    setFlag(1)               //attivo con il flag la visualizzazione del popup delle recensioni
                                                }}
                                            >
                                                RECENSIONI
                                            </Button>
                                            <Button id="button-hotelcardlist-prenotazione" type="button"  variant="outlined" onClick={handlePrenotation}>PRENOTA</Button>
                                        </div>
                                        
                                    </div>


                                </div>



                                
                            </Card>
                        </div>
                        

                        <Recensioni 
                            
                            id_hotel={dataHotelRecensioni.idHotel}          //passo l'id dell'hotel per visualizzare le sue recensioni
                            flag={flag}
                            onClose={() => setFlag(0)}
                        /> 


                    </div>
                    : null
            }
            <Footer/>
        </>
    )
}
export default HotelPage;
