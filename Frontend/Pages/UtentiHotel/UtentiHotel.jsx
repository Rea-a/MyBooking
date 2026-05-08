import {useState, useEffect} from "react";
import "./utentiHotel.css"
import {useNavigate} from "react-router-dom";


////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';

//////////////////////////////////////////////////////////


export default function Recensioni({id_hotel, flag, onClose}){               //passo l'"id_hotel" per trovare le prenotazioni relative a quell'hotel
                                                                             //"flag" che mi servirà per attivare la visualizzazione del componente React
                                                                             //"onClose" richiama la funzione per quando viene chiusa la finestra cambiando il valore del flag

    const[flagModifica, setFlagModifica] = useState(0);                      //uso questo flag per attivare/disattivare la finestra delle modifiche quando mi trovo nel SINGOLO hotel
    const [listaPrenotazioni, setListaPrenotazioni] = useState([]);          //stato per memorizzare le prenotazioni che verranno trovate nella fatch

    const navigate = useNavigate();                                          //per navigare tra le pagine



    
    const fetchData = async () => {                                                         //funizione fatch per recuperare tutte le prenotazioni fatte 
        const res = await fetch(`http://localhost:3000/visualizzaUtentiHotel/${id_hotel}`)  //a quel singolo hotel, richiamo in backend passando l'id dell'hotel
        const data = await res.json()                                                       //recupero i dati ricevuti
        console.log("L'id hotel è: ", id_hotel)                                             //stampo l'id hotel nella console per capire con quale hotel sto lavorando
        console.log("Le prenotazioni trovate sono: ", data)                                 //visalizzo l'array di prenotazioni che sono state trovate 
        setListaPrenotazioni(Array.isArray(data.prenotazioni) ? data.prenotazioni : []);    //controllo per evitare che mi risulti undefined e setto 
    }                                                                                       //lo stato "listaPrenotazioni" con i valori che ho trovato





    useEffect(() => {
        if (id_hotel && flag === 1) {   // l'id potrebbe non essere pronto come il flag per cui imposto un if in modo tale da non ricevere errori quando eseguo la fatch
            fetchData();                //eseguo la fatch di sopra
        }
    }, [id_hotel, flag]);               //attivo lo useEffect se ci sono dei cambiamenti nei parametri "id_hotel" e "flag"





    const divStyle = {      //parametri CSS utilizzati per quando verra attivato il form di visualizzazione degli Utenti che hanno prenotato a quel singolo hotel 
        position: "fixed", /* fixed per restare in alto indipendentemente dallo scroll */
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(19, 19, 19, 0.32)",
        zIndex: 1000,  /* per stare sopra tutto */
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };






    
    //FORMATTARE LE DATE - Solo per la stampa
    function formatData( date ) {                                                                                //passo la data che voglio formattare in input
        date = new Date(date);                                                                                   //da quella data ne creo una nuova tramite la funzione Data()

        let stringa = "";                                                                                        //inizializzo una stringa vuota dove andrò a salvare la data formattata
        stringa = date.getFullYear() + "-" + String(Number(date.getMonth() + 1)) + "-" + date.getDate();         //dalla data recuper "anno", "mese", "giorno" e li ordino 

        return stringa;                                                                                          //restituisco la stringa formattata
    }








    return<>

    {flag === 1 ? (                                                                                                                                //se il flag è uguale a 1 allora mostra 
        flagModifica === 0 ? (




            <div style={divStyle}>
                <Card id="card-recensioni" sx={{ width: 900, height: 500 }} >
                    <div id="posizione-chiudi-button-recensioni">

                        <h2 id="posizione-scritta-recensioni">Prenotazioni</h2>
                        <Button id="chiudi-button-recensioni" type="button"  variant="outlined" onClick={onClose}><CloseIcon /></Button>          
                    
                    </div>

                    {console.log("ID HOTEL - dentro prenotazioni: ", id_hotel)}

                    <div id="contenitore-prenotazioni">
                        {listaPrenotazioni.length > 0 ? (
                            listaPrenotazioni.map(i => (
                                <div id="divisore-componentirecensione">
                                    <Card key={i._id} id="box-prenotazioniutente">
                                        <div id="componentiprenotazioni">
                                            <p>Email: {i.emailUtente}</p>
                                            <p>Data Arrivo: {formatData(i.dataArrivo)}</p>
                                            <p>Data Partenza: {formatData(i.dataPartenza)}</p>
                                            <p>Giorni Totali: {i.giorniTotali}</p>
                                            <p>Prezzo Totale: {i.prezzo} €</p>
                                        </div>
                                        
                                        <div id="bottoneassistenzautente">
                                            <Button
                                                type="button"  
                                                variant="outlined" 
                                                onClick={() => { 
                                                    navigate(`/chat/${i.emailUtente}`)
                                                }}
                                            >ASSISTENZA UTENTE</Button>
                                        </div>
                                        
                                    </Card>
                                </div>
                                
                            ))
                        ) : (
                            <p style={{ padding: "1rem", fontStyle: "italic" }}>Nessuna prenotazione effettuata.</p>
                        )}
                    </div>

                        

                </Card>

            </div>


        ) : (
        null
        )
    ): null
    }


    </>





}