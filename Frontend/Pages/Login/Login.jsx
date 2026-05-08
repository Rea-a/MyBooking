import './login.css'
import { styled } from '@mui/material/styles';
import {useEffect, useState} from "react";
import axios from 'axios';
import AlertMessage from '../AlertMessage/AlertMessage'
import {useNavigate} from "react-router-dom";





function Login( ) {

    const navigate = useNavigate();                                     //per spostarmi tra le pagine

    const [ showAlert , setShowAlert ] = useState(0);                   //flag per mostrare o meno l'Alert
    const [ errorMessage , setErrorMessage ] = useState('');            //testo del messagio di errore che viene passato




    const SwitchButton = styled('button')(({ theme, active }) => ({             //CSS switch button importato da Material UI
        width: 50,
        height: 24,
        borderRadius: 34,
        border: 'none',
        backgroundColor: active ? '#1976d2' : '#ccc',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        padding: 0,

        '&::before': {
            content: '""',
            position: 'absolute',
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#fff',
            top: 4,
            left: active ? 30 : 4,
            transition: 'left 0.3s ease',
        },
    }));





    const [emailUtente, setEmailUtente] = useState(null);





    ////////////////////////////VERIFICA COOKIE - TOKEN/////////////////////////////////////

    useEffect(() => {
            
            fetch('http://localhost:3000/EmailTokenUtente', {           //recupera email dal token nel cookie
            credentials: 'include',                                     //necessito che i cookie siano presenti
            })
            .then(res => res.json())                                    //poi estraggo i dati json dalla risposta
            .then(data => {                                             //poi lavoro sui dati recuperati
                if (data.emailUtente) {                                 //se i dati esistono signfica che c'è stato già il login quindi l'utente non può stare
                    console.log("Utente già autenticato");              //in quella pagina e deve tornare alla pagina iniziale
                    navigate("/")                                       
                }
            })
            .catch(err => console.error("Errore nel recupero email dal token:", err));      //altrimenti genera un errore nel recupero della email dal token
    }, []);
    
    /////////////////////////////////////////////////////////////////////////////////////// 









    const [ loginData , setLoginData ] = useState({ emailUtente: "" , passwordUtente: ""});
  





    const [ profileType , setProfileType] = useState("Utente");   //di base lo SwitchButton è impostato su Utente

    const handleProfileTypeChange = (event) => {                  //serve per gestire il tipo Login che si vuole fare cliccando lo SwitchButton
        if( profileType === "Utente" ){                           //se ProfileType è "Utente" setta a "Host" altrimenti a "Utente"
            setProfileType("Host");                               
        } else {setProfileType("Utente")}
    }





///////////////////////////////////////////////FUNZIONE PER GESTIRE L'INVIO DEL FORM////////////////////////////////////////////////////////////////7


    const handleSubmitLogin = async (event) => {
        event.preventDefault();                 
        let exitMessage = ""

        console.log(profileType);                                                    //mostro il tipo di Login che è stato eseguito, in base alla scelta del pulsante


        if( event.target.email.value == "" || event.target.password.value == "") {    //se non è stato inserito uno dei due campi esce errore con Alert
            setErrorMessage( "Inserire email e password" )
            return;
        }

        setLoginData( (prev) => ( { ...prev , emailUtente: event.target.email.value , passwordUtente: event.target.password.value } ) );




        if( profileType === 'Utente' || profileType === 'utente'){                                       //se il tipo di login è Utente allora eseguo la funzione Axios per l'utente
            exitMessage = await asynctest03( event.target.email.value , event.target.password.value )    //salvo i valori restituiti dalla risposta Axios dentro "exitMessage"
        } else {
            exitMessage  = await asynctest06( event.target.email.value, event.target.password.value )    // altrimenti eseguo quella dell'host
        }


        if( exitMessage !== null){                                                                      //se l'exitMessage è diverso da null eseguo il contenuto dell'if

            if( exitMessage == "UTENTE Loggato" || exitMessage == "HOST Loggato"){                      //se l'exitMessage ha ricevuto uno dei due valori dal backend allora
                if(exitMessage == "UTENTE Loggato"){                                                    //gestisce il tipo di reindirizzamento alle pagine
                    console.log(`Frontend - Log Corretto UTENTE`)                                       //se Utente lo porta al formRicerca per gli Hotel
                    navigate("/formRicerca");
                }else{
                    console.log(`Frontend - Log Corretto HOST`)                                         //se Host lo porta al profilo per la gestione delle sue strutture
                    navigate("/profilo/gestioneStruttura");
                }
            } else {
                setErrorMessage( exitMessage )                                                          //altrimenti se ci sono problemi mostra l'errore nell'exitMessage aggiornando lo useEffect
            }
        }



        event.target.email.value = ""                                                                   //azzera ogni volta il contenuto della email e dalla password a ogni tentativo di login
        event.target.password.value = ""
    }








    //LOGIN UTENTE
    const asynctest03 = async ( emailUtente , passwordUtente ) =>{
            const request = await axios.post( 'http://localhost:3000/loginUtente' ,     //eseguo una richiesta Axios di tipo POST al backend
            {
                emailUtente: emailUtente,                                               //passo questi parametri
                passwordUtente: passwordUtente,
            }, {
                withCredentials: true    // mi serve per rendere compatibile la richiesta di login con il cookie
            });
        return request.data.message
    }




    //LOGIN HOST
    const asynctest06 = async ( emailUtente , passwordUtente ) => {   
        const request = await axios.post( 'http://localhost:3000/loginHost' ,       //eseguo una richiesta Axios di tipo POST al backend
            {
                emailUtente: emailUtente,                                           //passo questi parametri
                passwordUtente: passwordUtente,
            }, {
                withCredentials: true     // mi serve per rendere compatibile la richiesta di login con il cookie
            });
        return request.data.message
    }

  

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////










    //METODO CHE RILEVA I CAMBIAMENTI NELLA VARIABILE
    useEffect(() => {
        if( errorMessage !== ""){         //verifica che errorMessage sia vuoto
            setShowAlert(1)               //attiva tramite flag il popup del modulo dell'alert per visualizzarlo
        }
    }, [errorMessage]);                   //se errorMessage ha ricevuto dei cambiamenti




    const handleRegistration = () => {    //se premuto "Sign Up" mi porta alla pagina di registazione
        navigate('/registrazione')
    }





    return(
        <div id="loginMainContainerLogin">

            <div>
                <form onSubmit={handleSubmitLogin}>

                    <div id="formContainerLogin">

                        <div id="nameSiteContainerLogin">
                            <p id="bookingLogoLogin">MyBooking</p>
                        </div>

                        <div id="signInLabelLogin">
                            <p>Sign In</p>
                        </div>
                        
                        <div id="nameInputContainer">
                            <label htmlFor="email" className="labelFormLogin">Email <br/></label>
                            <input type="text" name="email" id="email" className="inputFormLogin"/>
                            
                        </div>
                        

                        <div id="passwordInputContainer">
                            <label htmlFor="password" className="labelFormLogin">Password <br/></label>
                            <input type="password" name="password" id="password"  className="inputFormLogin"/>
                        </div>

                        <div id="rememberMeContainerLogin">
                            <p>Utente 🔍</p>
                            <SwitchButton                                           //componente di Material UI
                                onClick={handleProfileTypeChange}                   //se cliccato richiama il metodo per impostare il tipo di Utente nello stato "ProfileType"
                                active={profileType === "Host" ? 1 : 0}             //quando viene cliccato e quindi risulta attivo si domanda se profileType è uguale a Host (visto che a destra c'è l'Host)
                                                                                    //significa che è 1 (vero) altrimenti 0 (falso)
                            />                                                          
                            <p>Host 🏨</p>
                        </div>

                        <div id="signInButtonContainerLogin">
                            <button>Login</button>
                        </div>


                        <div id="registerContainerLogin">
                            <button onClick={handleRegistration}>Sign Up</button>
                        </div>

                    </div>

                </form>

            </div>

            {
                (showAlert === 1) ?                                             //se il flag "showAlert" viene impostato a 1 significa che c'è un alert che viene generato
                    <div id="backgroundAlertMessage">
                        <AlertMessage 
                            message={ errorMessage }                            //contenuto del messaggio da mostrare
                            showAlertMethod={setShowAlert}                      //metodo per comunicare con il modulo gestisce il flag per mostrare l'alert
                            messageErrorMethod={setErrorMessage}                //gestisce l'evenutale pulizia del contenuto del messaggio che gli viene passato
                            mainMessage={"ERRORE LOGIN"}                        //titolo alert
                        />
                    </div> : null
            }

        </div>
    )
}




export default Login;
