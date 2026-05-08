import "./alertModifica.css"
import {useState, useEffect} from "react";
import Recensioni from '../../Recensioni/Recensioni'
import UtentiHotel  from '../../UtentiHotel/UtentiHotel'


////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

//////////////////////////////////////////////////////////





function AlertModifica({id, nome_hotel, citta, via, descrizione, prezzoNotte, nOspiti, immagine, flag, onClose, onUpdate}){


    
    const [selectedHotelId, setSelectedHotelId] = useState(null);  //PER TEST
    const[flagRecensione, setFlagRecensione] = useState(0);        //flag per attivare e disattivare il popup per visualizzare le recensioni
    const[flagUtentiHotel, setFlagUtentiHotel] = useState(0);      //flag per attivare e disattivare il popup degli utenti che hanno fatto quella prenotazione


    const[flagModifica, setFlagModifica] = useState(0);     //uso questo flag per attivare/disattivare la finestra delle modifiche quando mi trovo nel SINGOLO hotel
    

    const [currentModifica, setCurrentModifica] = useState({
        nome_hotel: "",
        citta: "",
        via: "",
        descrizione: "",
        prezzo_a_notte: "",
        n_ospiti: "",
        immagine_hotel: "",
    })  



  


////////////////////////////////////////ELIMINAZIONE HOTEL////////////////////////////////////////////////////////
    

    const eliminazione = async (e, hotel_id) => {
        const conferma = window.confirm("Sei sicuro di voler eliminare questo hotel?");             //avvio un alert per chiedere se voglio effettivamente eliminare l'hotel
        if(!conferma){                                                                              //se la conferma è negativa allora non faccio nulla e chiudo l'alert
            return; 
        }
        e.preventDefault();                                                                         //altrimenti se clicco si evito di aggiornare la pagina

        try {                                                                                       
            const response = await fetch(`http://localhost:3000/hotel/${hotel_id}`, {               //eseguo una fetch per eliminare l'hotel passando l'id dell'hotel che voglio rimuovere
                method: "DELETE"
            });

            if (!response.ok) {                                                                     //se c'è qualche errore
                const errorData = await response.json();                                            //salvo la risposta
                alert(errorData.error);                                                             //e mostro l'alert dell'errore
                return;
            }

            console.log("Eliminazione effettuata con successo!!!!");                                //se tutto apposto faccio la modifica

            if (onUpdate) {                                                                         //verifico onUpdate e chiudo tutti i popup attivi
                    setFlagModifica(0);     
                    onClose();
                    onUpdate();                                                                     //aggiornando la pagina con gli hotel rimasti
            }

        } catch(err) {
            console.log("Errore API: ", err);
        }
    }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////






/////////////////////////METODO PER INSIERIMENTO DELLE MODIFICHE DELLA STRUTTURA////////////////////////////////

    const modificaStruttura = async (e, hotel_id) => {              //passo l'id dell'hotel per identificarlo nel backend
        console.log("Sto iniziando la modifica!");
        console.log("Modifica con i seguenti dati:", currentModifica);
        try{

            const response = await fetch(`http://localhost:3000/modifica_hotel/${hotel_id}`, {
                method: "PUT",                                                                      //eseguo una put per aggiornare il document sul DB
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    nome_hotel: currentModifica.nome_hotel,
                    citta: currentModifica.citta,
                    via: currentModifica.via,
                    descrizione: currentModifica.descrizione,
                    prezzo_a_notte: currentModifica.prezzo_a_notte,
                    n_ospiti: currentModifica.n_ospiti,
                    img: currentModifica.immagine_hotel
                })
            })



            if(!response.ok){                                                               //se ci sono problemi li mostra
                const errorData = await response.json();

                alert(errorData.error);
                return;

            }

            console.log("Modifica effettuata con successo!!!!")
            
            if (onUpdate) {                                                                 //verifico onUpdate e chiudo tutti i popup attivi
                setFlagModifica(0);
                onClose();
                onUpdate();                                                                 //aggiorna mostrando l'hotel aggiornato sulla pagina del profilo
            }

        }catch(err){
            console.log("Errore API: ", err);
        }
    }





































    

    const divStyle = {                                                  //CSS per impostare in alto il form
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




    return<>

    {flag === 1 ? (
        flagModifica === 0 ? (




            <div style={divStyle}>
                <Card id="card-descr" sx={{ width: 900, height: 500 }} key={id}>
                    <div id="posizione-chiudi-button">
                        <Button id="chiudi-button" type="button"  variant="outlined" onClick={onClose}><CloseIcon /></Button>
                    </div>


                    <div id="container-hotel">

                        <div>
                            <img
                                id="img-modifica"
                                src={immagine}
                                alt={"Hotel " + nome_hotel}
                            />
                        </div>


                        <div id="descrizione-apertura">

                            <ul id="listadescrizione">
                                <li key={id}><h3>Hotel {nome_hotel}</h3></li>
                                <li>Città: {citta}, via {via}</li>
                                <li>Descrizione: {descrizione}</li>
                                <li>Prezzo: {prezzoNotte}€ <br />  Numero Ospiti: {nOspiti}</li>
                            </ul>

                            <div id="modifica-elimina">
                                
                                <Button
                                    id="prenotazioni-modifica"
                                    type="button"  
                                    variant="outlined" 
                                    
                                    onClick={() => { 
                                        setFlagUtentiHotel(1) 
                                    }}
                                >
                                    PRENOTAZIONI
                                </Button>

                                <Button
                                    id="recensioni-modifica"
                                    type="button"  
                                    variant="outlined" 
                                    onClick={() => { 
                                        setFlagRecensione(1) 
                                    }}
                                >
                                    RECENSIONI
                                </Button>

                                <Button
                                    id="modifica-pulsante"
                                    variant="contained"
                                    endIcon={<NavigateNextIcon />}
                                    onClick={() => {
                                        setSelectedHotelId(id);                         //per TEST
                                        setCurrentModifica({
                                            nome_hotel: nome_hotel || "",               //insierisco nei campi value dallo state i valori recuperati dal DB o se sono vuoti inserisco " "
                                            citta: citta || "",
                                            via: via || "",
                                            descrizione: descrizione || "",
                                            prezzo_a_notte: prezzoNotte || "",
                                            n_ospiti: nOspiti || "",
                                            immagine_hotel: immagine || ""
                                        });
                                        setFlagModifica(1);
                                    }}
                                >
                                    Modifica
                                </Button>
                            </div>

                            <Recensioni                     
                                id_hotel={id}
                                flag={flagRecensione}
                                onClose={() => {
                                    setFlagRecensione(0);
                                }}
                            /> 

                            <UtentiHotel                     
                                id_hotel={id}
                                flag={flagUtentiHotel}
                                onClose={() => {
                                    setFlagUtentiHotel(0);
                                }}
                            /> 
                            
                        </div>


                    </div>



                    
                </Card>
            </div>






        ) : (




            <div style={divStyle}>
                <CardContent id="box-modifica-corso">
                    <h2 id="modifica-corso">Modifica in corso</h2>


                    <div id="box-input">
                        <TextField label="Nome Hotel" onChange={handleModifica} name="nome_hotel" value={currentModifica.nome_hotel}/>
                        <TextField label="Città" onChange={handleModifica} name="citta" value={currentModifica.citta}/>
                        <TextField label="Via" onChange={handleModifica} name="via" value={currentModifica.via}/>
                        <TextField label="Descizione" type="text" onChange={handleModifica} name="descrizione" value={currentModifica.descrizione}/>
                        <TextField label="Prezzo a Notte" onChange={handleModifica} name="prezzo_a_notte" value={currentModifica.prezzo_a_notte}/>
                        <TextField label="Numero Ospiti" onChange={handleModifica} name="n_ospiti" value={currentModifica.n_ospiti}/>
                        <TextField label="URL immagine" onChange={handleModifica} name="immagine_hotel" value={currentModifica.immagine_hotel}/>
                    </div>
                    

                    <div id="gruppo-eliminaincorso">
                        <Button id="cancella-button" type="button"  variant="outlined" onClick={() => {setFlagModifica(0)}}>Cancella</Button>
                        <Button id="elimina-button" type="button" onClick={(e) => eliminazione(e, id)} variant="outlined" endIcon={<DeleteIcon />}>Elimina</Button>
                        <Button id="modifica-button" type="submit" variant="contained" onClick={(e) => {modificaStruttura(e, id)}} endIcon={<NavigateNextIcon />}>Modifica</Button>
                    </div>

                    
                </CardContent>
            </div>



        )
    ) : (
        null
    )
    }


    </>





    function handleModifica(e){   //setto lo stato degli elementi della modifica
            setCurrentModifica({ ...currentModifica, [e.target.name]: e.target.value });
    }



}

export default AlertModifica;