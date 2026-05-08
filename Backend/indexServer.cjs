///////REQUIRE TOKEN E COOKIE/////
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');  


//////CHAT REAL TIME////////////
const http = require("http");
const { Server } = require('socket.io');
const Message = require("./Models/Message.cjs");
////////////////////////////////



const express = require("express");
const app = express();

app.use(cookieParser());


const JWT_SECRET1 = 'segreto-user';                  //Firma segreta utenti
const JWT_SECRET2 = 'segreto-host';





const server = http.createServer(app);              //converto app in un server e ascolto su tale porta


const connectDB = require("./server.cjs");
const verificaUser = require('./Logica/Verifiche/verificaUser.cjs')
const verificaHost = require('./Logica/Verifiche/verificaHost.cjs')
const calendarGeneration = require("./Logica/FormattazioneDati/calendarCreation.cjs")           //per creare le date da inserire nell'array "Prenotazioni" dell'hotel
const cors = require("cors");
const port = 3000;
const portFrontend = 5173;


app.use(cors({
    origin: `http://localhost:${portFrontend}`,
    credentials: true  // necessario per inviare cookie dal frontend
}));




app.use((req, res, next) => {                           //mi serve per verificare le operazioni che sto eseguendo di volta in volta
  console.log(`[${req.method}] ${req.path}`);           //stampandole sulla console
  next();
});










//IMPORT DEI ROUTING           
const routingHotel = require('./Routing/RoutingHotel.cjs')
const routingPrenotazione = require('./Routing/RoutingPrenotazione.cjs')



////SCHEMI
const userModel = require("./Models/userModel.cjs")
const hotelModel = require("./Models/hotelModel.cjs")
const hostModel = require("./Models/hostModel.cjs")



app.use(express.json());     //mi serve per leggere correttamente il "req.body"

connectDB();




app.use( '/hotel' , routingHotel)                                          //Filtraggio degli hotel in base alla ricerca, presente solo "/ricerca" (usato in FormRicerca.jsx)                                                             
app.use( '/prenotazione' , routingPrenotazione)                            //Gestione delle prenotazioni, presente solo "/struttura" (usato in HotelPage.jsx)
















////////////////////////////CHAT REAL-TIME///////////////////////////////////////


const io = new Server(server, {
    cors: {
        origin: `http://localhost:${portFrontend}`,         //lavora sul frontend
        methods: ['GET', 'POST'],                           //metodi che utilizzo in questo server
        credentials: true                                   //invia i cookie
    },
});




io.on('connection', (socket) => {
    console.log('Utente connesso:', socket.id);                    //stampo l'utente che si è connesso dall'ID del socket

    socket.on('chat message', async (msgObj) => {                  //"chat message" mi identifica la comunicazione su cui inviarà i messaggi l'utente

        const { text, email_Mittente, email_Destinatario } = msgObj;    //recupero i valori che invia in msgObj e li salvo in delle variabili

        const newMsg = new Message({ text, email_Mittente, email_Destinatario });              // creo un nuovo messaggio che salverò poi sul DB
        await newMsg.save();                                                                   // salvo il messaggio sul DB

        io.emit('chat message', { text, email_Mittente, email_Destinatario });                 // invio il messaggio con i parametri che ho definito
    });

    socket.on('disconnect', () => {                                                            //per eseguire la disconnessione del determinato utente
        console.log('Utente disconnesso:', socket.id);
    });
});






app.get("/messaggioRicevuto/:emailDestinatario/:TuaMail", async (req, res) => {         //Per visualizzare la HISTORY DELLA CHAT
    const emailDestinatario = req.params.emailDestinatario;  
    const TuaEmail = req.params.TuaMail;                 

    try {

        const messaggiRicevuti = await Message.find({           // cerco messaggi inviati dalla persona con cui sto chattando
            email_Mittente: emailDestinatario,
            email_Destinatario: TuaEmail
        });

        const messaggiInviati = await Message.find({            // cerco messaggi che ho inviato io
            email_Mittente: TuaEmail,
            email_Destinatario: emailDestinatario
        });

        
        const tuttiIMessaggi = [...messaggiRicevuti, ...messaggiInviati];    // unisco i messaggi in un unico array

        const messaggiOrdinati = tuttiIMessaggi.sort((msg1, msg2) => {       // ordino i messaggi in base alla data di invio
            const data1 = new Date(msg1.createdAt);
            const data2 = new Date(msg2.createdAt);
            return data1 - data2;               // dal più vecchio al più recente  (se risultato negativo il risultato allora la seconda data è la più recente)
        });

        return res.json({ messaggi: messaggiOrdinati });

    } catch (errore) {
        console.error("Errore nel recupero dei messaggi:", errore);
        return res.status(500).json({ error: "Errore interno nel recupero messaggi" });
    }
});





//////////////////////////////////////////////////////////////
















//////////////////////GET PER VISUALIZZARE TUTTE LE STRUTTURE PRESENTI NEL DB - Usata in FormRicerca.jsx///////////////////////


app.get("/gestioneStrutture", async(req, res) => {   //restituisce tutte le strutture e poi le randomizza e ne prende solo un certo numero dall'array in cui vengono salvate
    const response = await hotelModel.find()
    return res.json({items : response})
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////







///////////////////////////////GET PER VISUALIZZARE LE STRUTTURE CREATE DAL SINGOLO PROPRIETARIO - Usata in GestioneStruttura.jsx///////////


app.get("/VisualizzaGestioneStrutture/:emailProprietario", async(req, res) => {   //mi permette di visualizzare le strutture dentro a GestioneStruttura.jsx in base al proprietario
    
    const emailProprietario = req.params.emailProprietario;                             //recupero l'email come parametro 

    const strutture = await hotelModel.find({emailProprietario: emailProprietario})     //cerco nel DB le strutture che hanno quella email associata
    return res.json({strutture: strutture})

})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





//////////////////////////GET PER VISUALIZZARE LE INFO HOST - Usata in GestioneStruttura.jsx///////////


app.get("/VisualizzaHost/:emailProprietario", async (req, res) => {                      
    const emailHost = req.params.emailProprietario;                                //recupero parametro  

    const infoHost = await hostModel.findOne({ email: emailHost });                //cerco l'email dell'host nel DB
    return res.json({ infoHost: infoHost });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////






///////////////////////////////////GET VISUALIZZA RECENSIONI RICHIAMATA DA Recensioni.jsx/////////////////////////

app.get("/visualizzaRecensioni/:id_hotel", async (req, res) => {                            //ottengo in input l'ID del'hotel e lo salvo nel paramentro "id"
    const id = req.params.id_hotel;

    try {
        
        const hotel = await hotelModel.findById(id);                                        //cerco l'hotel nel DB tramite l'ID

        if (!hotel) {                                                                       //se non viene trovato riporta uno stato di errore
            return res.status(404).json({ error: "Hotel non trovato" });
        }

        const recensioni = hotel.recensioni || [];                                          //altrimenti mi crea un array contenente le recensioni o eventualmente un array vuoto in 
                                                                                            //in caso risulti undefined o null 

        res.json({ recensioni });                                                           //restituisco al frontend

    } catch (err) {
        console.error("Errore durante la ricerca delle recensioni:", err);                  //eventuali errori
        res.status(500).json({ error: "Errore del server" });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////










////////////////////GET usata per UtentiHotel.jsx/////////////////////////////


app.get("/visualizzaUtentiHotel/:id_hotel", async (req, res) => {                                   //ricevo una request con dentro il parametro "id_hotel"
    const id = req.params.id_hotel;                                                                 //recupero e salvo in un variabile il parametro 

    try {
        
        const hotel = await hotelModel.findById(id);                                                //cerco l'hotel con quell'id

        if (!hotel) {                                                                               //se non trovo l'hotel mi esce un errore che non è stato trovato
            return res.status(404).json({ error: "Hotel non trovato" });                            //controllo non molto indispensabile visto che per effettuare questa get 
        }                                                                                           //sicuramente verrà premuto un hotel, presente solo se creato da dove recupero l'id

        const prenotazioni = hotel.prenotazioni || [];                                              //creo una array di prenotazioni e per evitare situazioni di undefined o null
                                                                                                    //lo inizializzo eventualmente come un array vuoto

        res.json({ prenotazioni });                                                                 //rispondo alla richiesta con l'array in formato json

    } catch (err) { 
        console.error("Errore durante la ricerca delle prenotazioni:", err);                        //se riscontro un problema lo catturo e stampo che ho avuto problemi nella rircerca delle prenoazioni
        res.status(500).json({ error: "Errore del server" });                                       //presentando un errore del server con status 500
    }
});

///////////////////////////////////////////////////////////////////////////////







//////////////////////////////////////////GET PER VISUALIZZARE LE PROPRIE PRENOTAZIONI - USATO IN ProfiloUtente.jsx//////////////////////////////////////


app.get("/visualizzaLeTuePrenotazioni/:emailUser", async (req, res) => {
    const emailUtente = req.params.emailUser;                                           //recupero l'emailUtente dal parametro passato

    try {
        const hotelPrenotati = await hotelModel.find({ "prenotazioni.emailUtente": emailUtente });    //accedo al DB cercando negli Hotel e in particolare nel campo array "Prenotazioni" l'email con l'Utente che li ho passato

        const prenotazioniUtente = [];                              //istanzio un array vuoto

        hotelPrenotati.forEach(hotel => {                           //scorro i vari hotel chiamando i vari elementi che recupero "hotel"
            hotel.prenotazioni.forEach(p => {                       //scorro l'array delle "prenotazioni" del singolo hotel chiamando i singoli elementi nell'array "p" (prenotazioni)
                if (p.emailUtente === emailUtente) {                // mi chiedo se l'email della prenotazione che ho trovato corrisponde all'email dell'utente che ho passato
                    prenotazioniUtente.push({                       //con la push inserisco dentro l'array istanziato all'inizio tutti i parametri trovati
                        nome_hotel: hotel.nome_hotel,
                        img: hotel.img,
                        via: hotel.via,
                        citta: hotel.citta,
                        dataArrivo: p.dataArrivo,
                        dataPartenza: p.dataPartenza,
                        prezzo: p.prezzo,
                        giorniTotali: p.giorniTotali,
                        idHotel: hotel._id,
                        emailProprietario: hotel.emailProprietario
                    });
                }
            });
        });

        res.json({ items: prenotazioniUtente });     //invio l'array che continene gli hotel con i parametri che ho definito

    } catch (err) {
        console.error("Errore durante la ricerca delle prenotazioni:", err);        //eventuale errore del server
        res.status(500).json({ error: "Errore del server" });
    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////GET PER VISUALIZZARE LE INFO UTENTE - USATO IN ProfiloUtente.jsx//////////////////////////////////////

app.get("/visualizzaInfoUtente/:emailUser", async(req, res) => {                 //mi permette di visualizzare le strutture dentro a GestioneStruttura.jsx
    try {
        const emailUtente = req.params.emailUser;                               // recupero l'email dell'utente attualmente loggato
        const response = await userModel.findOne({ email: emailUtente });       //cerco nel DB l'utente con quella email
        return res.json({oggettoUtente : response})                             //restituisco l'email
    } catch (err) {
        console.error("Errore durante la ricerca delle informazioni dell'Utente:", err);    //eventuale errore del server
        res.status(500).json({ error: "Errore del server" });
    }
})

//NB: nessun controllo perché di base se sto passando il paramentro significa che mi trovo nella pagina del profilo quindi di base l'email esiste

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






////////////////////DELETE USATA PER ELIMINARE L'HOTEL - Usata in alertModifica.jsx///////////////////////////////////


app.delete("/hotel/:id", async (req, res) => {
    const _id = req.params.id;                                           //recupero l'id dal corpo della richiesta (parametro)
    try{
        const result = await hotelModel.findByIdAndDelete(_id);          //cerco ed elimino nel DB l'hotel con quel l'id associato
        res.json({message: "Hotel eliminato con successo!"});            //restituisco messaggio di avvenuta eliminazione
    }catch(err){
        res.status(500).json({message: err.message});
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////








/////////////////////////////POST PER REGISTRAZIONE HOST (PROPRIETARIO STRUTTURA)////////////////////////////



app.post('/registrazione/proprietarioStruttura', async (req, res) => {
    try {

        const email = req.body.email;                                               //recupero l'email dal body

        const esisteUtente = await hostModel.findOne({ email });                    //eseguo una verifica nel DB in cui cerco un utente con stessa email 
        if (esisteUtente) {                                                         //se l'email esiste genero un errore che faccio ritornare al frontend e visualizzo nell'Alert
            return res.status(400).json({ error: 'Email già registrata' });
        }
        const form = req.body;                                                      //se non è presente allora credo un oggetto con i contenuti del body della richiesta

        // Crea nuova Proprietrario di Struttura con password hashata
        const newHost = new hostModel({                                             //successivamente credo un nuovo Host accedendo ai singoli parametri dell'oggetto
            nome: form.nome,
            email: form.email,
            telefono: form.telefono,
            password: form.password,
        });


        await newHost.save();                                                       //infine salvo nel DB e invio un messaggio di inserimento eseguito

        res.status(201).json({ message: 'Proprietario registrato con successo!', });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nella registrazione' });
    }
})


/////////////////////////////////////////////////////////////////////////////////////////









////////////////////////////POST PER AGGIUNGERE LA STRUTTURA DALL'HOST - Usata in GestionStruttura.jsx/////////////////////////////

app.post('/profilo/aggiungiStruttura', async (req, res) => {
    try {

        const form = req.body;                                      //Salvo il contenuto della richiesta in form

        
        const newStruttura = new hotelModel({                       //creo una nuova struttura in base ai parametri salvati in "form"
            emailProprietario: form.emailProprietario,
            nome_hotel: form.nomeStruttura,
            citta: form.citta,
            via: form.via,
            descrizione: form.descrizione,
            prezzo_a_notte: form.prezzo_a_notte,
            n_ospiti: form.n_ospiti,
            img: form.img,
            calendario: calendarGeneration ,                        //genero il calendario
            recensioni: [] ,                                        //inizializzo recensioni e prenotazioni vuote come array
            prenotazioni: []

        });


        await newStruttura.save();                                  //salvo la struttura nel DB

        res.status(201).json({ message: 'Struttura registrata con successo!', });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore nell'inserimento della Struttura" });
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







/////////////////////////////POST PER REGISTRAZIONE UTENTE - Usata in RegistrazioneUtente.jsx//////////////////////////////////////////////


app.post("/registrazione/utente", async (req, res) => {           
    try{

        console.log("Dati ricevuti dal client:", req.body);                                            //visualizzo cosa ho ricevuto dalla request del client

        const {nome, cognome, email, password, genere, dataNascita} = req.body;                        //salvo i singoli valori del body dentro i parametri
        

        if(!dataNascita){                                                                             //ulteriore controllo per la data se eventualmente è mancante
            return res.status(400).json({ error: "Data di nascita mancante" });    
        }

        const newUser = new userModel({ nome, cognome, email, password, genere, dataNascita });       //alcuni controlli vengono fatti a posteriori dentro lo UserModl, tipo campi richiesti con determinati valori come nel caso della email 
        await newUser.save();                                                                         //creo il nuovo Utente e lo salvo nel DB


        console.log("Utente creato!");                                                                //stampo un messaggio a console e invio uno status 200 di utente creato
        res.status(200).json({ message: "Utente creato!"});
        




    }catch(err){

        if (err.name === "ValidationError") {                                                           //se si presenta una situazione di "ValidationError" 
            return res.status(400).json({ error: "Email non valida, insierirne una appropriata!" });    //genero un errore di email scritta male
        }

        if (err.code === 11000) {                                                                       //se si presenta un errore con un codice di quel tipo, numero intercettato durante la fase di programmazione, 
            return res.status(400).json({ error: "Email già registrata!" });                            //invio un altro errore che fa risultare l'email già registrata, quindi presente già nel DB  
        }



        console.error("Errore nel server, Errore 500:", err);                                           //eventuali errori di Server
        res.status(500).json({ error: "Errore del server, Errore 500" });
    }
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////







//////////////////////////////////////PUT PER MODIFICARE L'HOTEL - Usata in alerModifica.jsx//////////////////////

app.put("/modifica_hotel/:id", async (req, res) => {                 //passo l'ID dell'hotel come paramentro e lo salvo dentro "_id"
    try{
        const _id = req.params.id;

        const {nome_hotel, citta, via, descrizione, prezzo_a_notte, n_ospiti, img} = req.body;              //recupero gli elementi che hanno ricevuto modifiche dal body della req
        
        

        const updateHotel = await hotelModel.findByIdAndUpdate(                                             //eseguo un Update dell'hotel in base all'ID che ho recuperato nei parametri
            _id,
            {nome_hotel, citta, via, descrizione, prezzo_a_notte, n_ospiti, img},                           
            {new: true}                                                                                     //mi restituisce il documento con la modifica effettuata da MongoDB
        )


        console.log("Modifica effettuata!");
        res.status(200).json({ message: "Modifica effettuata!"});
        




    }catch(err){
        console.error("Errore nel server, Errore 500:", err);
        res.status(500).json({ error: "Errore del server, Errore 500" });
    }
})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////PUT PER AGGIUNGERE RECENSIONE - Usata in FormRecensione.jsx//////////////////////////

////NB: faccio la PUT perché non sto aggiungendo un nuovo oggetto al DB ma semplicemente sto modificando un array dentro un hotel che è già presente

app.put("/aggiungiFeedback", async (req, res) => {                                            
    try {
        const { _id, voto, corpoRecensione, nomeUtente, emailUtente } = req.body;           //recupero dal body le info che mi servono per aggiungere la recension

        const hotel = await hotelModel.findById(_id);                                       //cerco l'hotel in base all'id e lo salvo in una variabile

        const recensioneEsistente = hotel.recensioni.find(                                  //dentro all'hotel che ho trovato cerco nell'array recensioni con l'elemento
            (rec) => rec.emailUtente === emailUtente                                        //"rec" (indica la singola recensione) quella che ha l'emailUtente uguale a quello che
        );                                                                                  //è presente nel body passatogli con la request

        if (recensioneEsistente) {                                                          //se la recensione è stata già effettuata non può essere fatta nuovamente alla stessa struttura
            return res.status(400).json({
                error: "Hai già recensito questa struttura!",
            });
        }

        const nuovaRecensione = {                                                           //altrimenti creo il corpo della mia nuova recensione da andare a inserire dentro il DB
            nomeUtente,
            voto,
            corpoRecensione,
            emailUtente
        };

        const updateHotelRecensione = await hotelModel.findByIdAndUpdate(                   //eseguo un Update dell'hotel nel DB in base all'ID
            _id,
            { $push: { recensioni: nuovaRecensione } },                                     // utilizzo la push perché si tratta di un array annidato dentro hotel
            { new: true }                                                                   // mi restituisce l'elemento modificato dal DB
        );

        if (!updateHotelRecensione) {                                                       //se updateHotelRecensioni non va a buon fine mi genera un errore
            return res.status(404).json({ error: "Hotel non trovato" });
        }

        console.log("Recensione aggiunta!");
        res.status(200).json({ message: "Recensione aggiunta con successo", hotel: updateHotelRecensione });
        
    } catch (err) {
        console.error("Errore nel server, Errore 500:", err);
        res.status(500).json({ error: "Errore del server, Errore 500" });
    }
});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////












///////////////////////POST LOGIN DEI DUE DIFFERENTI UTENTI - Usati in Login.jsx//////////////////////////////////////////////////


/////LOGIN UTENTE NORMALE////////////

app.post( '/loginUtente' , async ( req , res )=> {                     
    const { emailUtente , passwordUtente } = req.body                            // recupero i valori inviati da axios di email e password dell'utente

    console.log(`\Backend - Informazioni Login UTENTE:\n-Email: ${emailUtente}\n-Password: ${passwordUtente}`)      // li stampo per essere sicuro che siano quelli

    const exitCode = await verificaUser(emailUtente , passwordUtente)            //eseguo la verifica dell'utente tramite modulo js esterno

    switch ( exitCode ) {                                                        //in base a ciò che il modulo di verifica mi restituisce mi posiziono nella swtichCase
        case 0:
            console.log(`\nSpecificare Email e Password`)
            res.status(200).json( {message: "Specificare Email e Password"} );
            return;

        case 1: 
            console.log(`\nEmail non esistente`)
            res.status(200).json( {message:"Email non esistente" } );
            return;

        case 2: 
            console.log(`\nEmail o Password errati`)
            res.status(200).json( {message: "Email o Password errati"} );
            return;

        case 3:                                                    //se la verifica è andata a buon fine mi setta il login generando un cookie a cui assegno il token

            const token = jwt.sign({emailUtente: emailUtente}, JWT_SECRET1, {expiresIn: "1h"})  //il token presenterà al suo interno l'emailUtente (che lo indentifica nel DB) in modo da poter essere sempre utilizzabile nelle varie pagine
                                                                                                //inserisco come chiavere a cui associarla "JWT_SECRET1" e imposto che non varrà più dopo 1 ora


            res.cookie("token", token,                             //associo al cookie il token e lo chiamo "token"                                
                        {                                          
                            httpOnly: true,                        //il cookie non è accessibile da js nel browser (document.cookie), solo dal server
                            secure: false,                         //indica se il cookie deve essere inviato solo tramite connessioni HTTPS  (false in sviluppo, true produzione)
                            sameSite: 'lax',                       //protezione contro attacchi CSRF (Cross-Site Request Forgery), 'lax' permette l’invio del cookie solo in richieste di navigazione "normale" (es. clic su link)
                            maxAge: 3600000                        //durata del cookie in millisecondi   (questo caso 1h)
                        }
            )
            console.log("COOKIE TOKEN RICEVUTO:", token);           //visualizzo il cookie ricevuto


            console.log(`\nBackend - Utente Loggato UTENTE`)
            res.status(200).json( {message: "UTENTE Loggato"} );    //invio una risposta che verrà gestita dall'exitMessage e in base a questo risultato reindirizzerà alla pagina desiderata
            return;

        default: 
            res.status(500)
    }
})

/////////////////////


////LOGIN HOST (PROPRIETARIO STRUTTURA)////////////

app.post( '/loginHost' , async ( req , res ) => {                                                              
    const { emailUtente , passwordUtente } = req.body                             // recupero i valori inviati da axios di email e password dell'utente

    console.log(`\Backend - Informazioni Login HOST:\n-Email: ${emailUtente}\n-Password: ${passwordUtente}`)      // li stampo per essere sicuro che siano quelli

    const exitCode = await verificaHost ( emailUtente , passwordUtente)           //eseguo la verifica dell'utente tramite modulo js esterno

    switch ( exitCode) {                                                          //in base a ciò che il modulo di verifica mi restituisce mi posiziono nella swtichCase
        case 0:
            console.log(`\nSpecificare Email e Password`)
            res.status(200).json( {message: "Specificare Email e Password"} );
            return;

        case 1: 
            console.log(`\nEmail non esistente`)
            res.status(200).json( {message:"Email non esistente" } );
            return;

        case 2: 
            console.log(`\nEmail o Password errati`)
            res.status(200).json( {message: "Email o Password errati"} );
            return;

        case 3:                                                     //se la verifica è andata a buon fine mi setta il login generando un cookie a cui assegno il token
            
            const token = jwt.sign({emailUtente: emailUtente}, JWT_SECRET2, {expiresIn: "1h"})  //il token presenterà al suo interno l'emailUtente (che lo indentifica nel DB) in modo da poter essere sempre utilizzabile nelle varie pagine
                                                                                                //inserisco come chiavere a cui associarla "JWT_SECRET1" e imposto che non varrà più dopo 1 ora
            
            
            
            res.cookie("token", token,                             //associo al cookie il token e lo chiamo "token" 
                        {                                          
                            httpOnly: true,                        //il cookie non è accessibile da js nel browser (document.cookie), solo dal server
                            secure: false,                         //indica se il cookie deve essere inviato solo tramite connessioni HTTPS  (false in sviluppo, true produzione)
                            sameSite: 'lax',                       //protezione contro attacchi CSRF (Cross-Site Request Forgery), 'lax' permette l’invio del cookie solo in richieste di navigazione "normale" (es. clic su link)
                            maxAge: 3600000                        //durata del cookie in millisecondi   (questo caso 1h)
                        }
            )
            console.log("COOKIE TOKEN RICEVUTO:", token);         //visualizzo il cookie ricevuto


            console.log(`\nBackend - Utente Loggato HOST`)
            res.status(200).json( {message: "HOST Loggato"} );    //invio una risposta che verrà gestita dall'exitMessage e in base a questo risultato reindirizzerà alla pagina desiderata
            return;

        default: 
            res.status(500)
    }
})

////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////GESTIONE TOKEN E COOKIE///////////////////////////////////////


app.get('/EmailTokenUtente', (req, res) => {                                                        
  const token = req.cookies.token;                                                                             //recupero il token dal cookie e lo salvo dentro la variabile "token"
  if (!token) {                                                                                                //se non esiste un token allora lancio una return con errore 401 di "token non trovato"
    return res.status(401).json({ error: 'Token non trovato' });
  }

  try {                                                                                                        //se esiste il token
    const payload = jwt.verify(token, JWT_SECRET1);                                                            //verifico il token con la la prima chiave segreta del JWT e salvo il valore nel payload
    console.log({ emailUtente: payload.emailUtente, ruolo: "utente" });                                        //se questo genera un errore nel mentre allora viene catturato e viene generato un nuovo try
    return res.status(200).json({ emailUtente: payload.emailUtente, ruolo: "utente" });                        //se non genera errori significa che il token è impostato per il ruolo "UTENTE" e quindi stampo a i valori
                                                                                                               //restituendo una risposta 
  } catch (err1) {
    try {
      const payload = jwt.verify(token, JWT_SECRET2);                                                          // Prova come host
      console.log({ emailUtente: payload.emailUtente, ruolo: "host" });
      return res.status(200).json({ emailUtente: payload.emailUtente, ruolo: "host" });
    } catch (err2) {
      return res.status(401).json({ error: 'Token non valido o scaduto' });                                   //se entrambe le risposte generano un errore allora signfica che il token è scaduto
    }
  }
});





app.post('/logout', (req, res) => {                                                                             //LOGOUT
    res.clearCookie('token', {                                                                                  //imposto il contenuto della risposta con una funziona di clearCookie in cui pulisco
        httpOnly: true,                                                                                         //il cookie dal valore "token"
        secure: false,     
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Logout effettuato con successo' });                                        //restituisco un messaggio di effettivo logout
});






app.post('/firstRenderAuthentication' , ( req , res ) => {                                                     //identico praticamente a emailTokenUtente solo che viene effettuato solo una volta al momento dell'apertura della pagina

    const token = req.cookies.token;

    console.log("Mi trovo qui!!!!")

    if( !token ){
        //TOKEN NON ANCORA CREATO
        res.status(200).json({message: "Nessun Token Esistente"})
        return;
    }
    try{
        const User = jwt.verify( token , JWT_SECRET1 )
        if(User){
            //LOGGATO COME UTENTE
            res.status(200).json( {message: "TOKEN - Loggato come Utente" , User: User} )
            return;
        }
    } catch(error1){
        try{
            const Host = jwt.verify( token , JWT_SECRET2 )
            if(Host){
                //LOGGATO COME HOST
                res.status(200).json( {message: "TOKEN - Loggato come Host" , Host: Host} )
                return;
            }
        } catch(error2){
            res.status(200).json( {message: "Errore nella fase di autenticazione"} )
            return;
        }
    }
})










//////////////////////////////////////////////////////////////////////////////



server.listen(port, () => {
    console.log("Sito in esecuzione!");
})




