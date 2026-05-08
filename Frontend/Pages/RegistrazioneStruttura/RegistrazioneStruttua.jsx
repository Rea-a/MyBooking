import {useState, useEffect} from "react"
import './RegistrazioneStruttura.css'
import { useNavigate } from 'react-router-dom';
import AlertRegistrazione from "../Alert/alertRegistrazione/AlertRegistrazione";



////////////////MaterialUI Components//////////////////////

import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


//////////////////////////////////////////////////////////







function RegistrazioneStruttura() {


    const [Alert, setAlert] = useState({                    //alert attivato in caso di errori o mancanza di campi inseriti
        flag: 0,
        bodyError: "",
    })

    const port = 3000;                                     //porta su cui lavoro in backend
    const navigate = useNavigate();                        //inizializzo navigate per spostarmi tra le pagine



    //Regex:
    const phoneRegex = /^(\+39)?[0-9]{9,10}$/;             //regex per il campo numero di telefono
    const emailRegex = /\S+@\S+\.\S+/;                     //regex per il campo email





    const [form, setForm] = useState({                     //creo uno stato dove andrò a salvare i valori del form
        nome: '',
        email: '',
        password: '',
        telefono:'',
        confirmpassword:'',
    })


    const handleChange = (e) => {                          //funzione per impostare i valori nello stato "form" sopra citato
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }








    ////////////////////////////VERIFICA COOKIE - TOKEN/////////////////////////////////////
    
    useEffect(() => {
            
            fetch('http://localhost:3000/EmailTokenUtente', {           //recupera email dal token nel cookie
            credentials: 'include',                                     //necessito che i cookie siano presenti
            })
            .then(res => res.json())                                    //poi dopo la fatch recupera eventuali risposte ricevute
            .then(data => {                                             //poi con i dati entra in un if in cui al pacchetto dato accede al campo "emailUtente"
                if (data.emailUtente) {                                 //se l'"emailUtente" è valido o presente allora l'Utente si è già autenticato
                    console.log("Utente già autenticato");
                    navigate("/")                                        //quindi reindirizzato alla pagina iniziale per evitare di fargli reinserire i campi nella registrazione
                }
            })
            .catch(err => console.error("Errore nel recupero email dal token:", err));
    }, []);
    

    ////////////////////////////////////////////////////////////////////////////////////////









    //////////////////////////FUNZIONE RICHIAMATA PER ESEGUIRE LA FETCH CON APPOSITI CONTROLLI///////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();                                                 // Impedisce il refresh della pagina

        console.log("Invio i seguenti dati:", form);

        // Controlla tutti i campi obbligatori

        if (form.nome === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Nome"})   //eventualmente fa attivare il model Alert con il flag 1 e gli passa il contenuto nel bodyError da visualizzare 
            return;
        }

        if (form.email === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire l'Email"})
            return;
        }


        if (form.telefono === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Telefono"})
            return;
        }


        if (form.password === "") {   
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Password"})
            return;
        }


        if (form.confimpassword === "") {   
            setAlert( {...Alert, flag: 1, bodyError: "Ripetere la Password"})
            return;
        }


        if (!phoneRegex.test(form.telefono)) {
            setAlert( {...Alert, flag: 1, bodyError: "Numero di Telefono non valido"})
            return;
        }
        


        if (!emailRegex.test(form.email)) {
            setAlert( {...Alert, flag: 1, bodyError: "Indirizzo Email non valido"})
            return;
        }


        if (form.password.trim() !== form.confirmpassword.trim()) {     //rimuovo gli spazi bianchi con trim()
            setAlert( {...Alert, flag: 1, bodyError: "Le password non coincidono!"})
            return;
        }



        const dataToSend = {                            //creo un oggetto che passerò alla fetch per caricare i valori della registrazione struttura dentro il DB
            nome: form.nome,
            email: form.email,
            password: form.password,
            telefono: form.telefono,
        }

        try {
            const response = await fetch(`http://localhost:${port}/registrazione/proprietarioStruttura`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToSend)                                            //valori inizializzati in precendenza
            });

            const result = await response.json();

            
            if (!response.ok) {                                                             //controllo di eventuali errori riportati dal backend
                const errorData = await response.json();
                setAlert( {...Alert, flag: 1, bodyError: errorData.error})
                return;
            }else{
                console.log("Inserimento eseguito!");                                       //se nessuno inserimento host (proprietario struttura) eseguito
                navigate('/login');
            }



        } catch (error) {
            console.error('Errore di rete: ', error);
            alert('Errore di connessione al server!');
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////






return (
        <>

                <div className="container">
                    <div className="form-container">
                        <div id="registrazione">
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <Card sx={{ minWidth: 450} } elevation={8} id="cardBox">    {/*elevation mi crea ombra sotto il box*/}
                                        <CardContent id="box">
                                            <h2 color="black">Sign up to Booking</h2>
                                            <h3 color="black">Proprietario Struttura</h3>
                                            <div id="distanza">
                                                <div id="box-input">
                                                    <TextField id="inputNome" label="Nome e Cognome" onChange={handleChange} name="nome" value={form.nome}/>
                                                    <TextField id="inputEmail" label="Email" onChange={handleChange} name="email" value={form.email}/>
                                                    <TextField id="inputTelefono" type="text" label="Telefono  (inserire +39)" onChange={handleChange} name="telefono" value={form.telefono}/>
                                                    <TextField id="inputPassword" label="Password" type="password" onChange={handleChange} name="password" value={form.password}/>
                                                    <TextField id="inputConfirmPassword" label="Conferma Password" type="password" onChange={handleChange} name="confirmpassword" value={form.confirmpassword}/>
                                                    
                                                </div>
                                            </div>
                                            
                    
                                            <Button id="button" type="submit" variant="contained" endIcon={<NavigateNextIcon />}>Registrati</Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </form>
                        </div>

                        
                    </div>
                        <AlertRegistrazione                                             //Modulo Alert attivato quando cambio il flag in base alle situazioni
                            bodyError={Alert.bodyError}
                            flag={Alert.flag}
                            onClose={() => setAlert({ flag: 0, bodyError: "" })}
                        >
                        </AlertRegistrazione>
                </div>

        </>
    )
}
export default RegistrazioneStruttura;