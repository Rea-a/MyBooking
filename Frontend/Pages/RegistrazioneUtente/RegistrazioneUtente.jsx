////////////FRONTEND

import {useState, useEffect} from "react";
import "./registrazioneUtente.css"
import AlertRegistrazione from "../Alert/alertRegistrazione/AlertRegistrazione";
import { useNavigate } from 'react-router-dom';


////////////////MaterialUI Components//////////////////////

import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DateTime } from 'luxon';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


//////////////////////////////////////////////////////////






export default function Registrazione(){

    const navigate = useNavigate();                                         //uso navigate per spostarmi tra le pagine

    const port = 3000;                                                      //porta su cui lavoro nel backend

    const [Alert, setAlert] = useState({                                    //Alert che viene attivato quando compaiono delle eccezioni durante l'inserimento
        flag: 0,                                                            //dei dati nel campo registrazione
        bodyError: "",
    })

    const [currentRegistration, setCurrentRegistration] = useState({        //creo uno stato dove recupero i valori inseriti nei vari campi del form
        nome: "",
        cognome: "",
        email: "",
        password: "",
        genere: "maschio",
        dataNascita: "",
        confirmPassword: ""
    })









    ////////////////////////////VERIFICA COOKIE - TOKEN/////////////////////////////////////

    const [emailUtente, setEmailUtente] = useState(null);               

    useEffect(() => {
            
            fetch('http://localhost:3000/EmailTokenUtente', {           //recupera email dal token nel cookie
            credentials: 'include',                                     //necessito che i cookie siano presenti
            })
            .then(res => res.json())                                    //poi dopo la fatch recupera eventuali risposte ricevute
            .then(data => {                                             //poi con i dati entra in un if in cui al pacchetto dato accede al campo "emailUtente"
                if (data.emailUtente) {                                 //se l'"emailUtente" è valido o presente allora l'Utente si è già autenticato 
                    console.log("Utente già autenticato");      
                    navigate("/")                                       //quindi reindirizzato alla pagina iniziale per evitare di fargli reinserire i campi nella registrazione
                }
            })
            .catch(err => console.error("Errore nel recupero email dal token:", err));
    }, []);
    


    ////////////////////////////////////////////////////////////////////////////////////////








    /////////////////////////////////FUNZIONE REGISTRAZIONE RICHIAMATA DAL FORM//////////////////////////


    const registrazione = async (e) => {

        e.preventDefault();

        console.log("Invio i seguenti dati:", currentRegistration);                                     //visualizzo i dati su console che ho appena inserito nel campo



        if (currentRegistration.nome === "") {                                                         
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Nome"})
            return;                                                                                     //se uno di questi campi è vuoto attiva l'Alert impostando il flag da
        }                                                                                               //zero a uno

        if (currentRegistration.cognome === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Cognome"})
            return;
        }


        if (currentRegistration.email === "") {   
            setAlert( {...Alert, flag: 1, bodyError: "Inserire l'Email"})  
            return;
        }


        if (currentRegistration.password === "") {  
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Password"}) 
            return;
        }


        if (currentRegistration.confimPassword === "") {                                                
            setAlert( {...Alert, flag: 1, bodyError: "Inserire Conferma Password!"})
            return;
        }

        if (currentRegistration.password.trim() !== currentRegistration.confirmPassword.trim()) {     //rimuovo gli spazi bianchi con trim() se le due password sono diverse allora 
            setAlert( {...Alert, flag: 1, bodyError: "Le password non coincidono"})                   //attivo nuovamente l'Alert
            return;
        }

        if (currentRegistration.dataNascita === "") {   
            setAlert( {...Alert, flag: 1, bodyError: "Inserire Data di Nascita"})
            return;
        }



        try{

            const response = await fetch(`http://localhost:${port}/registrazione/utente`, {             //invio al Backend tutti i valori che ho appena recuperato 
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    nome: currentRegistration.nome,
                    cognome: currentRegistration.cognome,
                    email: currentRegistration.email,
                    password: currentRegistration.password,
                    genere: currentRegistration.genere,
                    dataNascita: currentRegistration.dataNascita
                })
            })



            if (!response.ok) {                                                       //se ci sono eventuali problemi nella risposta 
                const errorData = await response.json();                              //attivo l'alert per visualizzare l'errore passandogli il contenuto dell'errore da visualizzare
                setAlert( {...Alert, flag: 1, bodyError: errorData.error})
                return;
            }else{
                console.log("Inserimento eseguito!");                                //se non ci sono problemi viene registrato correttamente e riportato alla pagina di login
                navigate('/login');
            }




            console.log("Dati inviati a indexServer!!!!");

        }catch(err){
            console.error("Errore API: ", err);
        }




    }


    ////////////////////////////////////////////////////////////////////////////////////////////////









    return <>

    <div id="container">
        <div id="registrazione">
            <div className="form-container">
                <form onSubmit={registrazione}>
                <div>
                    <Card sx={{ minWidth: 450} } elevation={8} id="cardBox">    {/*elevation mi crea ombra sotto il box*/}
                        <CardContent id="box">
                            <h2 color="black">Sign up to Booking</h2>
                            <h3 color="black" id="Utenteh3">Utente</h3>

                            <div id="box-input">
                                <TextField id="inputNome" label="Nome" onChange={handleRegistration} name="nome" value={currentRegistration.nome}/>
                                <TextField id="inputCognome" label="Cognome" onChange={handleRegistration} name="cognome" value={currentRegistration.cognome}/>
                                <TextField id="inputEmail" label="Email" onChange={handleRegistration} name="email" value={currentRegistration.email}/>
                                <TextField id="inputPassword" label="Password" type="password" onChange={handleRegistration} name="password" value={currentRegistration.password}/>
                                <TextField id="inputConfirmPassword" label="Conferma Password" type="password" onChange={handleRegistration} name="confirmPassword" value={currentRegistration.confirmPassword}/>

                                <LocalizationProvider id="input" dateAdapter={AdapterLuxon} adapterLocale={"en-us"}>
                                    <DateField
                                        label="Data di Nascita"
                                        name="dataNascita"
                                        value={currentRegistration.dataNascita ? DateTime.fromISO(currentRegistration.dataNascita) : null}                  //fromIso è un convertitore di Material UI

                                        onChange={(newValue) => {                                               //nuovo valore della data selezionata
                                            if (newValue && newValue.isValid) {                                 //se ho un nuovo valore ed è valido
                                                setCurrentRegistration({ ...currentRegistration, dataNascita: newValue.toISODate() }) // salva solo la stringa ISO "YYYY-MM-DD"
                                            }
                                        }}

                                    />
                                </LocalizationProvider>
                            </div>


                            <div id="radioButton">
                                <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="maschio" name="genere" id="genere" onChange={handleRegistration}>  {/* "row" mi serve per allineare i due radio button */}
                                    <FormControlLabel value="maschio" control={<Radio color="black"/>} label="Maschio" />
                                    <FormControlLabel value="femmina" control={<Radio color="black"/>} label="Femmina" />
                                </RadioGroup>
                            </div>



                            <Button id="registrazione-button" type="submit" variant="contained" endIcon={<NavigateNextIcon />}>Registrati</Button>
                        </CardContent>
                    </Card>
                </div>


                </form>
            </div>                            

                <AlertRegistrazione
                    bodyError={Alert.bodyError}
                    flag={Alert.flag}
                    onClose={() => setAlert({ flag: 0, bodyError: "" })}
                >
                </AlertRegistrazione>
            
        </div>
    </div>


    </>



    function handleRegistration(e){                                                             //setto lo stato degli elementi
        setCurrentRegistration({ ...currentRegistration, [e.target.name]: e.target.value });    //target.name serve per salvare i valori con quel nome specifico presente
    }                                                                                           //nei campi e settatti con il valore recuperato dall'evento quando
                                                                                                //cliccato il pulsante di registrazione





}