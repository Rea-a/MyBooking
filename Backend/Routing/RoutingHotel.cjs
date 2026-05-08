//MODULI NECESSARI
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//HOTEL SCHEMA
const hotel = require('../Models/hotelModel.cjs')

//METODI FORMATTAZIONE DATI
const rangeDay = require('../Logica/FormattazioneDati/DifferenzaGiorni.cjs')

//GESTIONE DEL CALENDARIO
const checkCalendar = require('./ControlloCalendario.cjs')

//MIDDLEWARE DI APP 
app.use(express.json())
app.use(express.urlencoded({extended: false}))                      //serve per dire a Express di interpretare i dati provenienti da un form HTML (POST) nel formato usato dai form senza file (es. <form method="POST">)
                                                                    //false = usa la libreria querystring (più semplice)
                                                                    //true = usa qs, una libreria che supporta oggetti annidati e array complessi


/////////////////////USATO IN FormRicerca.jsx///////////////////////////



//CERCO GLI HOTEL CHE CORRISPONDONO ALLA MIA RICERCA 
app.post( '/ricerca' , async ( req , res ) => {
    if( req.body ){                                                                                                                                     //Esiste il corpo del messaggio
        
        if( (req.body.dataArrivo !== null) && (req.body.dataPartenza !== null) && (req.body.citta !== null) && (req.body.numeroOspiti !== null) ){      //Verifica Ulteriore del mio Body
            //Salvo i dati della richiesta
            const dataArrivo = String( req.body.dataArrivo )
            const dataPartenza = String ( req.body.dataPartenza )
            const numeroOspiti = Number( req.body.numeroOspiti )
            const citta = String( req.body.citta )

            const dbRequest = await ( hotel.find( { $and: [ {citta: citta} , {n_ospiti: {$gte: numeroOspiti}} ] } ) )                                   //Ricerco nel mio DB gli hotel che sono affini ai miei criteri di ricerca
                                                                                                                                                        // "$gte - great then equal" Cerca solo gli hotel dove il campo n_ospiti è maggiore o uguale a "numeroOspiti"
                                                                                                                                                        // "$and - AND logico" cioè voglio i documenti nel DB che soddisfano tutte le condizioni elencate

            let hotelResult = []                                                                                                                        //Vettore che stampa gli hotel che vanno bene
            let indexHotelResult = 0    
            let dayRange = 0
            
            if( dbRequest.length > 0 ){                                                                                                                 //Verifico se ho trovato degli hotel
                //HOTEL TROVATI
                dayRange = rangeDay( dataArrivo , dataPartenza )                                                                                        //Differenza giorni fra le prenotazioni (mi restituisce il numero di giorni, non una data)

                //VERIFICA DISPONIBILITA DATE
                for( let i = 0 ; i < dbRequest.length ; i++ ){                                                                                          //scorro il vettore dbRequest contenente gli hotel che ho trovato                         

                    let tempCalendar = dbRequest[i].calendario;                                                                                         //Prelevo volta per volta i calendari dei singoli hotel (sono oggetti non vettori)
                    let flag = checkCalendar(tempCalendar , dataArrivo , dataPartenza , dayRange)                                                       //Ritorna un flag di verifica se "0" hotel disponibile se "> 0" non disponibile

                    if( flag === 0){
                        //HOTEL VISUALIZZABILE
                        hotelResult[ indexHotelResult ] = dbRequest[i]                                                                                  //Aggiungo gli hotel al mio vettore risultato inizializzato
                        indexHotelResult += 1                                                                                                           //incremento il contatore così si può spostare avanti in hotelResult
                    }
                    flag = 0;                                                                                                                           //imposto nuovamento a zero il flag se nell'eventualità che girnado il for ha trovato degli hotel con flag 1
                }
            res.status(200).json( {lista: hotelResult , dayRange: dayRange} )                                                                           //Terminato il for invio il mio array in front-end con dentro tutti gli hotel che desidero

            } else {
                //Hotel non Trovati
                res.status(200).json( {message: "Nessuna struttura affine ai criteri di ricerca impostati"} )                                           //Messaggio per gli alert
            }
            
        } else {
            res.status(400).json( {message: "Errore nella richiesta, riprovare "} )                                                                     //Messaggio per gli alert
        }
    } else {
        //Non Esiste il corpo del messaggio
        res.status(200).json( {message: "Nessun Corpo"} )                                                                                               //Messaggio per gli alert
    }  
})

module.exports = app