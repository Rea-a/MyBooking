import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import io from "socket.io-client";
import "./chat.css";
const port = 3000;    //mi connetto al backend

const socket = io(`http://localhost:${port}/`, {withCredentials: true});   // aggiungo parametro per i cookie

function Chat() {

    const { emailDestinatario } = useParams();  //recupero parametro dall'URL
    const navigate = useNavigate();             //per spostarmi tra le pagine

    const [message, setMessage] = useState("");                            //messaggi che invio io 
    const [chat, setChat] = useState([]);                                  //messaggi che visualizzo dal destinatario

    const [historyMessaggi, setHistoryMessaggi] = useState([]);            // array dove salvo tutti i messaggi tra i due utenti
    // const [TuaRisposta, setTuaRisposta] = useState([]);

    const location = useLocation();     //serve per definirmi la posizione in cui mi trovo (gestione spostamento pagina)




////////////////////////////VERIFICA COOKIE - TOKEN/////////////////////////////////////


    const [emailUtente, setEmailUtente] = useState(null);                                       //per verificare quale utente è presente tramite l'email



    useEffect(() => {
        fetch('http://localhost:3000/EmailTokenUtente', {                                       //verifico la presenza del token
            credentials: 'include',                                                             //necessito che i cookie siano presenti
        })
        .then(res => {                                                                          //poi in base alla risposta
            if (!res.ok) {                                                                      //se la risposta non è ok e quidni generato errore 401
                console.log("Token non valido o utente non autenticato");                       //mi stampa che il token non è più valido o non ci si è autenticati
                navigate("/")                                                                   //quindi reindirizza alla pagina iniziale
            }
            return res.json();                                                                  //altrimenti restituisco l'oggetto della risposta senza errori
        })
        .then(data => {
            if (data.emailUtente) {                                                             //poi in base alla risposta ricevuta (significa che il token è valido)
                setEmailUtente(data.emailUtente);                                               //controllo in caso di errore nel login, accedendo all'oggetto e verificando l'emailUtente contenuta
                console.log("Email:", data.emailUtente);                                        //se esiste un contenuto nella "data" della risposta
                console.log("Ruolo:", data.ruolo);                                              //e il tipo di ruolo con cui si è loggato


                if(data.ruolo !== "utente" && data.ruolo !== "host"){                           //se il ruolo non corrisponde o all'"utente" o all'"host" allora reindirizza alla pagina iniziale
                    navigate("/");
                }
            } else {
                navigate("/ErroreLogin");                                                       //se non ci si è autenticati e si prova ad andare in una delle pagine che necessitano il login reindirizza alla pagina ErroreLogin
            }
        })
        .catch(err => {
            console.error("Errore nel recupero email dal token:", err);                         //alternativamente mi genera un errore del token e mi reindirizza alla pagina ErroreLogin
            navigate("/ErroreLogin");
        });
    }, []);

//////////////////////////////////////////////////////////////////////////////////////////












///////////////////PER MOSTRARE LA HISTORY DELLA CHAT/////////////////////////////



    const fetchData = async () => {
        const res = await fetch(`http://localhost:${port}/messaggioRicevuto/${emailDestinatario}/${emailUtente}`);      //recupero i messaggi con quell'utente e con quel destinatario

        const data = await res.json();
        setHistoryMessaggi(data.messaggi);                                                                              //li imposto nell'array HistoryMessaggi con il contenuto messaggi del "data"
        console.log("Ecco i messaggi del Destinatario:", data.messaggi);                                                //li stampo per vedere cosa ho ricevuto
    };




////////////////////////////////////////////////////////////////////////////////////









////////////////////////////////////////////////CONNESSIONE CHAT//////////////////////////////////////////////


    useEffect(() => {
        if(emailUtente){
            socket.on("connect", () => {                                  //mi connetto
            console.log("Connesso con ID:", socket.id);                   //visualizzo l'ID del socket con il quale mi sono connesso alla chat
            });

            socket.on("chat message", async (msgObj) => {                 //lavoro sul canale "chat message" e recupero i messaggi che vengono inviati in tale canale

                const mittente = msgObj.email_Mittente;                   
                const destinatario = msgObj.email_Destinatario;

                const partecipantiCoinvolti = (mittente === emailDestinatario && destinatario === emailUtente)  //filtro i messaggi che ricevo in real-time dall'destinatario con il quale sono connesso
                
                if (partecipantiCoinvolti) {
                    setChat((prev) => [...prev, msgObj]);                  //aggiungo un nuovo messaggio alla chat mantenendo quelli presenti, visualizzando quindi quelli che ricevo dal destinatario
                }
            });

            fetchData();                                                  //eseguo un aggiornamento di ciò che ricevo

            return () => {
                socket.off("chat message");
                socket.off("connect");
            };
        }

    }, [emailUtente]);



    const sendMessage = (e) => {                            //QUANDO INVIO IL MESSAGGIO
        e.preventDefault();                                 //evito l'aggiornamento della pagina

        

        if (message.trim()) {                               //prende il messaggio ed elimina eventuali spazi bianchi prima o dopo
            const nuovoMessaggio = {
                text: message,
                email_Mittente: emailUtente,
                email_Destinatario: emailDestinatario
            };
            socket.emit("chat message", nuovoMessaggio);    // lo invii al server

            setChat((prev) => [...prev, nuovoMessaggio]);   //appendo allo stato nuovi messaggi in coda che ho appena inviato
            setMessage("");                                 //dopo che ho inviato svuoto il campo di inserimento del messaggio
        }
    };







    useEffect(() => {
        if(emailUtente){

            const handleBeforeUnload = () => {                                  //definisco una funzione callback
                socket.disconnect();                                            //chiude manualmente la connessione
            };

            window.addEventListener('beforeunload', handleBeforeUnload);        //ascolto un certo evento 'beforeunload', che si attiva quando la finestra sta per essere chiusa o ricaricata

            return () => {                                                      //se ho cambiamenti nella pagina come l'emailUtente, rimuove l'ascolto dell'evento
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }   
    }, [emailUtente]);



    useEffect(() => {                          //useEffect che mi serve per disconnettermi dal socket quando clicco il torna indietro nella pagina 
        if(emailUtente){
            return () => {
                socket.disconnect();
            };
        }
    }, [emailUtente, location.pathname]);                  //si esegue a ogni cambio del percorso pagina

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






    return (
        <>
            <div id="posizione-boxmsg">
                <h1>ASSISTENZA</h1>
                <div className="chat-container">
                    <div className="chat-box">





                        {historyMessaggi.map((msg, i) => {                            /////PER VISUALIZZARE LA HISTORY DEI MESSAGGI   
                            const isMio = msg.email_Mittente === emailUtente;         ///filtro per distinguere i miei messaggi da quelli del destinatario

                            return (
                            <div
                                key={i}
                                className={"chat-msg"}
                                id={`${isMio ? "TuoVecchiomessaggio" : "messaggio-destinatario"}`}
                            >
                                <p><strong>{isMio ? "TU" : emailDestinatario}</strong></p>
                                <p>{msg.text}</p>
                            </div>
                            );
                        })}
                             


                        <div>
                            {chat.map((msg, i) => {                                     /////PER VISUALIZZARE I MESSAGGI IN REAL-TIME
                                    const isMio = msg.email_Mittente === emailUtente;   ///filtro per distinguere i miei messaggi da quelli del destinatario

                                    return (
                                        <div
                                            key={i}
                                            className="chat-msg"
                                            id={isMio ? "TuoVecchiomessaggio" : "messaggio-destinatario"}
                                        >
                                            <p><strong>{isMio ? "TU" : emailDestinatario}</strong></p>
                                            <p>{msg.text}</p>
                                        </div>
                                    );
                                })
                            }
                        </div>


                    </div>


                    <form onSubmit={sendMessage} className="chat-form">
                        <input
                            type="text"
                            id="messaggioInvio"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}    //imposto il messaggio che sto inviando nello stato
                            placeholder="Scrivi un messaggio..."
                        />
                        <button id="bottone-inviochat" type="submit">INVIA</button>
                    </form>


                </div>
            </div>

        </>

    );
}

export default Chat;
