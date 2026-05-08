import './profiloUtente.css'
import FormRecensione from "./FormRecensione/FormRecensione"
import Header from "../../components/HeaderLogin/HeaderLogin"
import Footer from "../../components/Footer"
import Recensioni from '../Recensioni/Recensioni'

import {useNavigate} from "react-router-dom";

import {useContext, useEffect, useState} from "react";



////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AlertModifica from "../Alert/AlertModifica/alertModifica";
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';

//////////////////////////////////////////////////////////




function ProfiloUtente(){

    const navigate = useNavigate();                                     //imposto navigate per spostarmi tra le pagine
    
    const [dataPassatiForm, setdataPassatiForm] = useState({            //imposto uno stato con i dati che voglio passare al formRecensione per visualizzarli 
        id: "",
        img: "",
        nomeHotel: "",
        citta: "",
        via: "",
        emailUtente: "",
        nomeUtente: ""
    })  


    
    
    const [emailUtente, setEmailUtente] = useState(null);                                   //salvo l'email dell'utente attualmente loggato in uno stato
    const [UtenteVisulizzante, setUtenteVisualizzante] = useState([]);                      //stato dove salvare i valori dell'utente loggato
    const [listaPrenotazioni, setListaPrenotazioni] = useState([]);                         //array contenente le prenotazioni effettuate dall'hotel settate tramite fetch
    const[flag, setFlag] = useState(0);                                                     //flag per attivare e disattivare il modulo di formRecensioni
    const[flagRecensione, setFlagRecensione] = useState(0);                                 //flag per attivare e disattivare il modulo di Recensioni
    const [idHotelRecensioni, setIdHotelRecensioni] = useState(null);

    const [ruoloUtente, setRuoloUtente] = useState("utente")                                //stato per capire il ruolo dell'utente al momento del login 
                                                                                            //se dovesse essere "host" verrebbe reindirizzato




    ///////////////////////////////////FETCH PER IL RECUPER DELLE PRENOTAZIONI FATTE DALL'UTENTE E LE INFO DELL'UTENTE  //////////////                                                                                        


    const fetchData = async () => {                                                                 //PRENOTAZIONI UTENTE
            const res = await fetch(`http://localhost:3000/visualizzaLeTuePrenotazioni/${emailUtente}`)
            const data = await res.json()
            console.log("Le prenotazioni trovate sono: ", data) 
            setListaPrenotazioni(data.items)                                                        //salvo le prenotazioni trovate nello stato
            console.log("ecco cosa ho visualizzato:", data.items)
    }
    

    const fetchDataUtente = async () => {                                                           //INFO UTENTE
        const res = await fetch(`http://localhost:3000/visualizzaInfoUtente/${emailUtente}`)
        const data = await res.json()
        setUtenteVisualizzante(data.oggettoUtente)                                                  //imposto i valori recuperati che contengono le info dell'utente loggato
        console.log("L'utente trovato è:", data.oggettoUtente)
    }
    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








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


    useEffect(() => {
        if (emailUtente) {                                                      // solo dopo che ho l'email, faccio le fetch per i dati
        fetchData();
        fetchDataUtente();
        }
    }, [emailUtente]);                                                          //se ricevo cambiamenti nell'emailUtente


    //////////////////////////////////////////////////////////////////////////////////





    


    //FORMATTARE LE DATE - Solo per la stampa
    function formatData( date ) {                                                                                   //passo data come parametro
        date = new Date(date);                                                                                      //creo una nuova data in base al parametro passato

        let stringa = "";                                                                                           //inizializzo stringa vuota
        stringa = date.getFullYear() + "-" + String(Number(date.getMonth() + 1)) + "-" + date.getDate();            //salvo "anno", "mese", "giorno" tramite le funzioni sulla nuova variabile creata

        return stringa;                                                                                             //restituisco la data
    }











    return <>
    <Header/>
        <div id="divisore-info-prenotazioni">
            <div id="info-utente">

                <CardContent id="box-infoUser">
                    <h1 id="posizioneh1infoUser">Benvenuto nel tuo Profilo</h1>

                    <div id="descrizioneUser">
                        <p>Nome: {UtenteVisulizzante.nome}</p>
                        <p>Cognome: {UtenteVisulizzante.cognome}</p>
                        <p>Data di Nascita: {formatData(UtenteVisulizzante.dataNascita)}</p>
                        <p>Email: {UtenteVisulizzante.email}</p>
                        <p>Genere: {UtenteVisulizzante.genere}</p>
                    </div>
                       
                    

                    
                </CardContent>

                <div id='linea-centrale'></div>

            </div>

            

            <div id="mainContainerProfilo">
                <div id="containerPrenotazioniProfilo">
                    <div id="headerPrenotazioniProfilo">
                        {
                                listaPrenotazioni.length == 0 ?                                         //se lista prenotazioni è vuota alloa imposta un campo altrimenti l'altro
                                <h2>Nessuna Prenotazione</h2> : <h2>Lista Prenotazioni</h2>
                        }
                    </div>

                    <div id="containerListaPrenotazioniProfilo">
                            
                            {listaPrenotazioni.map(i => (
                                
                                
                                <div key={i.idHotel}>
                                    {/* {console.log("id", i.nome_hotel, ": ", i._id, ", email di colui che si è prenotato", emailUtente, "prezzo totale ", i.prezzo)} */}

                                    




                                    <div>
                                        <CardContent id="box-prenotazioni">

                                            <div>
                                                <img
                                                    id="img-prenotazione"
                                                    src={i.img || " "}
                                                    alt={"Hotel " + i.nome_hotel}
                                                />
                                            </div>
                                            <h3>Hotel {i.nome_hotel}</h3>
                                            <ul id="listadescrizione">
                                                <li>Città: {i.citta}, via {i.via}</li>
                                                <li>Prezzo Totale: {i.prezzo} €</li>
                                            </ul>
                                            <div>
                                                <p>Data Partenza: {formatData(i.dataArrivo)}</p>
                                                <p>Data Ritorno: {formatData(i.dataPartenza)}</p>
                                            </div>

                                            <div id="modifica-elimina">

                                                <Button                                         //passo i parametri utili nella visualizzazione delle recensioni
                                                    id="recensioni-button-profilo" 
                                                    type="button"  
                                                    variant="outlined" 
                                                    onClick={() => { 
                                                        setdataPassatiForm({ ...dataPassatiForm, img: i.img, nomeHotel: i.nome_hotel, citta: i.citta, via: i.via, emailUtente: emailUtente, nomeUtente: UtenteVisulizzante.nome, id: i.idHotel }); 
                                                        setIdHotelRecensioni(i.idHotel);        //imposto l'ID dell'hotel
                                                        setFlagRecensione(1)                    //attiva il modulo recensioni
                                                    }}
                                                >
                                                    RECENSIONI
                                                </Button>

                                                <Button                                 //se cliccato imposto lo stato "datiPassatiForm" con i parametri necessari alla visualizzazione e utili nella compilazione
                                                    id="commenta-button-profilo" 
                                                    type="button"  
                                                    variant="outlined" 
                                                    onClick={() => { 
                                                    setdataPassatiForm({ ...dataPassatiForm, img: i.img, nomeHotel: i.nome_hotel, citta: i.citta, via: i.via, emailUtente: emailUtente, nomeUtente: UtenteVisulizzante.nome, id: i.idHotel }); 
                                                    setFlag(1)                          //attiva il modulo dove si può commentare
                                                }}
                                                >
                                                    COMMENTA
                                                </Button>

                                                <Button
                                                        type="button"  
                                                        variant="outlined" 
                                                        onClick={() => { 
                                                            navigate(`/chat/${i.emailProprietario}`)            //se cliccato mi riporta alla pagina di assistenza con la chat
                                                        }}
                                                    >ASSISTENZA</Button>
                                            </div>

                                            
                                        </CardContent>
                                    </div>


          
                                    <FormRecensione                                                 //passo i parametri necessari per il formRecensione da compilare
                                        id_hotel={dataPassatiForm.id}
                                        img={dataPassatiForm.img}
                                        nomeHotel={dataPassatiForm.nomeHotel}
                                        citta={dataPassatiForm.citta}
                                        via={dataPassatiForm.via}
                                        nomeUtente={dataPassatiForm.nomeUtente}  
                                        emailUtente={dataPassatiForm.emailUtente}
                                        flag={flag}
                                        onClose={() => setFlag(0)}                                  //se cliccato il pulsante di chiusura viene chiuso il form 
                                        onUpdate={fetchData}                                        //aggiorno se ci sono nuove recensioni
                                    /> 

                                    <Recensioni                                                     //passo i parametri necessari per visualizzare le recensioni nel modulo Recensioni 
                                        id_hotel={dataPassatiForm.id}
                                        flag={flagRecensione}
                                        onClose={() => {                                            //se clicco il pulsante di chiusura presente nel modulo
                                            setFlagRecensione(0);                                   //chiudo il modulo reimpostando il flag
                                            fetchData();                                            //aggiorno per visualizzare le nuove recensioni in caso di nuovi inserimenti
                                        }}
                                    /> 

                                </div>
                                
                            ))}


                        <div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    </>





}

export default ProfiloUtente;
