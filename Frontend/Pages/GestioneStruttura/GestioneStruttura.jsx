import {useState, useEffect} from "react";
import "./gestioneStruttura.css"
import Header from "../../components/HeaderLoginHost/HeaderLoginHost";
import AlertRegistrazione from "../Alert/alertRegistrazione/AlertRegistrazione";
import {useNavigate} from "react-router-dom";




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



export default function GestioneStruttura(){


    const port = 3000;                                                      //porta su cui lavorare nel Backend
    const [showForm, setshowForm] = useState(false)                         //flag con true o false per attivare o meno il form di inserimento del nuovo hotel


    const [Alert, setAlert] = useState({                                    //alert per mostrare evetnuali errori nella compilazione del form per l'inserimento degli hotel
        flag: 0,
        bodyError: "",
    })

    const navigate = useNavigate();                                         //per utilizzarlo quando voglio spostarlo tra le pagine, utile sopratutto se il login non è effettuato
                                                                            //propriamente quindi bisogna reindirizzare a delle pagine sicure


    const [hotel, setHotel] = useState([])                                  //vado a creare un array vuoto che poi setto con i parametri che voglio passare
    const [InfoHost, setInfoHost] = useState(null)                          //stato in cui salvare le informazioni dell'host che si è loggato
    const[flag, setFlag] = useState(0);


    const [emailUtente, setEmailUtente] = useState(null);                   //stato per salvare l'email dell'attuale Host che ha fatto l'accesso
    const [ruoloUtente, setRuoloUtente] = useState("host")                  //utilizzo questo stato per verificare se dentro questa pagina ha effettivamente fatto
                                                                            //l'accesso un Host(Proprietario Struttura) e non un Utente, se così non fosse non può avvenire l'accesso

    const [form, setForm] = useState({                                      //stato iniziale del form per l'inserimento del nuovo hotel
        nomeStruttura: "",
        citta: "",
        via: "",
        descrizione: "",
        n_ospiti: "",
        prezzo_a_notte: "",
        img: ""
    })




    const [currentModifica, setCurrentModifica] = useState({                //imposto uno stato in cui è presente la modifica che viene effettuata
        id: "",
        nome_hotel: "",
        citta: "",
        via: "",
        descrizione: "",
        prezzo_a_notte: "",
        n_ospiti: "",
        immagine_hotel: "",
    })  



    
    const fetchData = async () => {
            const res = await fetch(`http://localhost:${port}/VisualizzaGestioneStrutture/${emailUtente}`)
            const data = await res.json()
            setHotel(data.strutture)
            console.log("Ecco le strutture:", data.strutture)
    }
    

    const fetchDataHost = async () => {                                                                     //faccio una fetch per recuperare i dati dell'Host 
            const resHost = await fetch(`http://localhost:${port}/VisualizzaHost/${emailUtente}`)           //comunico con il Backend passandogli il parametro dell'"emailUtente" salvato
            const dataHost = await resHost.json()                                                           //nello stato, salvataggio avvenuto solo se è effettuato un login con verifica di cookie e token della funziona di sotto
            setInfoHost(dataHost.infoHost)                                                                  //recupero i dati e li imposto dentro lo stato "setInfoHost"
            console.log("Info Proprietario:", dataHost.infoHost)                                            //stampo su console per verificare che siano quelli
    }
    

    




    useEffect(() => {
        if(emailUtente){
            fetchData();
            fetchDataHost();
        }
    }, [emailUtente])               //eseguo il codice dentro use effect solo quando "emailUtente" cambia, quindi quando 
                                    //ho dentro lo stato un valore diverso da null, ciò significa che per cambiare lo stato
                                    //deve avvenire un login con host per accedere alla pagina







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












////////////////////////////////INSERIMENTO STRUTTURA///////////////////////////////////////

    function handleChange(e){                                           //se inserisco i dati mi aggiorna lo stato che gestisce i dati per l'inserimento dell'hotel
        setForm({ ...form, [e.target.name]: e.target.value, })
    }



    async function handleSubmit(e){
        e.preventDefault()                                              //evita l'aggiornamento della pagina


        if (form.nomeStruttura === "") {                                //verifica di eventuali campi che mancano 
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Nome della Struttura"})
            return;
        }

        if (form.citta === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Città"})
            return;
        }
        if (form.via === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Via"})
            return;
        }
        if (form.descrizione === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Descrizione"})
            return;
        }
        if (form.prezzo_a_notte === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Prezzo a Notte"})
            return;
        }
        if (form.n_ospiti === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Numero di Ospiti"})
            return;
        }


        if (isNaN(form.prezzo_a_notte)) {                           //se il prezzo non è un numero mi restituisce un errore
            setAlert({...Alert, flag: 1, bodyError: "Prezzo a notte non valido"});
            return;
        }

        if (isNaN(form.n_ospiti)) {                                 //se il numero di ospiti non è un numero mi restituisce errore
            setAlert({...Alert, flag: 1, bodyError: "Numero di Ospiti non valido"});
            return;
        }



        const nuovo = {                                             //se non ci sono problemi crea il corpo della request con i dati recuperati dal form
            emailProprietario: emailUtente,
            nomeStruttura: form.nomeStruttura,
            citta: form.citta,
            via: form.via,
            descrizione: form.descrizione,
            n_ospiti: form.n_ospiti,
            prezzo_a_notte: form.prezzo_a_notte,
            img: form.img
        }
        try{
            const response = await fetch(`http://localhost:${port}/profilo/aggiungiStruttura`, {        //eseguo una fetch di tipo post
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuovo),
            })
            const result = await response.json();                                                       //recupero il risultato della post 

            if (!response.ok) {                                                                         //se ho riscontrato problemi mi genera l'alert con l'errore
                setAlert( {...Alert, flag: 1, bodyError: result.error})
                return;
            }else{
                console.log("Inserimento eseguito!");
                setForm({                                //azzera i campi dopo aver inviato
                        nomeStruttura: "",
                        citta: "",
                        via: "",
                        descrizione: "",
                        n_ospiti: "",
                        prezzo_a_notte: "",
                        img: ""
                    });
                setshowForm(false);                     //setta il flag per mostrare il form su false per visualizzare di nuovo il pulsante "+"
                fetchData();                            //aggiorna con i nuovi dati ricevuti la pagina
            }




        }catch(e){
            console.error(e);
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////
































    return <>

            <Header/>
            <div id="posizione-griglia">

            
                <h1 id="h1-benvenuto">Benvenuto nel tuo Profilo</h1>


                <CardContent id="box-infoProprietarioStruttura">
                    {InfoHost ? (                   //al momento del caricamento i dati sono ancora null quindi inserisco un campo temporaneo
                            <div id="posizioneDescrizioneHost">
                                <p>Nome: {InfoHost.nome}</p>
                                <p>Email: {InfoHost.email}</p>
                                <p>Telefono: {InfoHost.telefono}</p>
                            </div>
                        ) : (
                            <p>Caricamento dati Proprietario Struttura...</p>
                    )}
                </CardContent>

                <div>
                    {!showForm && (                                 //se il flag "showForm" impostato su "false" mostra il pulsante "+" e se clicco il pulsante mi attiva il form con "true"
                            <Button id="button-inserisci-struttura" type="submit" variant="contained" onClick = {() => setshowForm(true)}>       
                                <div id="icona-add">
                                    <AddIcon />
                                </div>
                            </Button>
                    )}
                    {showForm && (                                  //se impstato su "true" mostra il form per l'inserimento dei dati
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <Card sx={{ minWidth: 450} } elevation={8} id="cardBox-inserimento">    {/*elevation mi crea ombra sotto il box*/}
                                        <CardContent id="box">
                                            <h2 color="black">Dati per la struttura</h2>
                                            <div id="raggruppamento">
                                                <TextField id="inputNomeStruttura" label="Nome Struttura" name='nomeStruttura' value={form.nomeStruttura} onChange={handleChange}/>
                                                <TextField id="inputcitta" label="Città" name="citta" value={form.citta} onChange={handleChange}/>
                                                <TextField id="inputVia" label="Via" name="via" value={form.via} onChange={handleChange}/>
                                                <TextField id="inputdescrizione" label="Descrizione" name="descrizione" value={form.descrizione} onChange={handleChange}/>
                                                <TextField id="inputPrezzo" label="Prezzo a Notte" name='prezzo_a_notte' value={form.prezzo_a_notte} onChange={handleChange}/>
                                                <TextField id="inputOspiti" label="Numero Ospiti" name="n_ospiti" value={form.n_ospiti} onChange={handleChange}/>
                                                <TextField id="inputimg" label="URL immagine" name="img" onChange={handleChange}/>
                                            </div>
                                        </CardContent>
                                        <div id="raggruppamento-button">
                                            <Button id="modifica-button" type="submit" variant="contained">Aggiungi</Button>
                                            <Button 
                                                id="modifica-button" 
                                                type="button" 
                                                variant="contained" 
                                                onClick={() => {
                                                    setForm({                                //azzera i campi
                                                        nomeStruttura: "",
                                                        citta: "",
                                                        via: "",
                                                        descrizione: "",
                                                        n_ospiti: "",
                                                        prezzo_a_notte: "",
                                                        img: ""
                                                    });
                                                    setshowForm(false)                      //se clicco annulla mi chiude il form mettendo "false" e azzerando i campi
                                                }}>Annulla</Button>
                                        </div>
                                    </Card>
                                </div>
                            </form>
                    
                        </div>

                    )}
                </div>







                <h3 id="scritta-strutture">Le tue strutture</h3>        






                <div id="griglia">

                <Grid container spacing={5}>               {/* Elemento che si occupa della gestione della griglia */}
                    {hotel.map(i => (
                        <div key={i._id}>
                            <Grid>   
                                <div className="fade-in-up">
                                    <Card sx={{ width: 390, height: 300 }} id="box">
                                        <div id="posizione-bottone">
                                            <Button
                                                id="visualizzaButton"
                                                type="submit"
                                                variant="contained"
                                                onClick={() => {                //cliccando il bottone salvo tutte le info che mi servono per la modifica e la visualizzazione dell'hotel dentro lo stato currentModifica
                                                    setCurrentModifica({ ...currentModifica, id: i._id, nome_hotel: i.nome_hotel, citta: i.citta, via: i.via, descrizione: i.descrizione, prezzo_a_notte: i.prezzo_a_notte, n_ospiti: i.n_ospiti, immagine_hotel: i.img}); 
                                                    setFlag(1)                  //attivo il modulo di visualizzazione della descrizione dell'hotel con il pulsante modifica 
                                                }}
                                            >
                                            </Button>
                                        </div>

                                        <div>
                                            <img
                                                id="img"
                                                src={i.img}
                                                alt={"Hotel " + i.nome_hotel}
                                            />

                                            <ImageListItemBar id="descrizioneHotel"
                                                title={"Hotel " + i.nome_hotel}
                                                subtitle={i.citta + ", Via " + i.via}
                                            />
                                        </div>
                                        
                                        
                                    </Card>
                                </div>  
                                
                            </Grid>


                            <AlertModifica                                              //popup che viene mostrato al click dell'hotel mostra la descrizione completa dell'hotel e i pulsanti di modifica e gestione
                                        id={currentModifica.id}                         //passo tutte le info che mi servono per visualizzare o per modificare
                                        nome_hotel={currentModifica.nome_hotel}
                                        citta={currentModifica.citta}
                                        via={currentModifica.via}
                                        descrizione={currentModifica.descrizione}
                                        prezzoNotte={currentModifica.prezzo_a_notte}
                                        nOspiti={currentModifica.n_ospiti}
                                        immagine={currentModifica.immagine_hotel}
                                        flag={flag}
                                        onClose={() => setFlag(0)}                     //nel popup se viene cliccato il pulsante di chiusura imposta il flag di nuovo a zero per chiudere il popup
                                        onUpdate={fetchData}                           //se richiamata aggiorna il contenuto del popup con eventuali modifiche apportate e aggiornamenti generici ricevuti
                            />
                        </div>
                        
                        
                    ))}
                </Grid>

                
                </div>

                <AlertRegistrazione
                    bodyError={Alert.bodyError}
                    flag={Alert.flag}
                    onClose={() => setAlert({ flag: 0, bodyError: "" })}
                >
                </AlertRegistrazione>
            
            </div>
        


    </>



}